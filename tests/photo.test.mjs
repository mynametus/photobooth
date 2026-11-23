import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { canvasBlob, drawCover, getGeometry, importPhoto, movePhoto, normalizeCrop } from "../src/lib/photo.ts";
import { FILTERS, applyFilterPixels, getFilterMatrix } from "../src/lib/filters.ts";
import { COLORS, getFramePalette } from "../src/lib/frames.ts";
import { TEMPLATES, TEMPLATE_GROUPS, findTemplates, getTemplateScene, getTemplateSlots } from "../src/lib/templates.ts";

test("export sizes maintain the same 8:5 photo crop in both layouts", () => {
  const strip = getGeometry("strip"), grid = getGeometry("grid");
  assert.deepEqual([strip.width, strip.height], [1200, 3044]);
  assert.deepEqual([grid.width, grid.height], [1600, 1206]);
  for (const g of [strip, grid]) {
    assert.ok(Math.abs(g.photoWidth / g.photoHeight - 1.6) < .002);
    assert.equal(g.margin * 2 + g.columns * g.photoWidth + (g.columns - 1) * g.gap, g.width);
    assert.ok(g.height > g.margin + 4 / g.columns * g.photoHeight);
  }
});

test("landscape camera sources are center-cropped without stretching", () => {
  const image = {}, calls = [];
  drawCover({ drawImage: (...args) => calls.push(args) }, image, 1600, 900, 0, 0, 800, 500);
  assert.deepEqual(calls[0], [image, 80, 0, 1440, 900, 0, 0, 800, 500]);
});

test("portrait uploads are center-cropped without stretching", () => {
  const image = {}, calls = [];
  drawCover({ drawImage: (...args) => calls.push(args) }, image, 600, 900, 64, 64, 800, 500);
  assert.deepEqual(calls[0], [image, 0, 262.5, 600, 375, 64, 64, 800, 500]);
});

test("framing can select the top and bottom of a portrait without leaving the source", () => {
  const image = {}, calls = [];
  const ctx = { drawImage: (...args) => calls.push(args) };
  drawCover(ctx, image, 800, 1000, 0, 0, 800, 500, { x: .5, y: 0, zoom: 1 });
  drawCover(ctx, image, 800, 1000, 0, 0, 800, 500, { x: 1, y: 1, zoom: 2 });
  assert.deepEqual(calls[0], [image, 0, 0, 800, 500, 0, 0, 800, 500]);
  assert.deepEqual(calls[1], [image, 400, 750, 400, 250, 0, 0, 800, 500]);
});

test("invalid crop controls are bounded before drawing", () => {
  assert.deepEqual(normalizeCrop({ x: -10, y: 2, zoom: 100 }), { x: 0, y: 1, zoom: 3 });
  assert.deepEqual(normalizeCrop({ x: NaN, y: Infinity, zoom: 0 }), { x: .5, y: .5, zoom: 1 });
  assert.deepEqual(normalizeCrop(), { x: .5, y: .5, zoom: 1 });
});

test("reordering preserves photo identity, source and framing without changing the input", () => {
  const photos = [0, 1, 2, 3].map(id => ({ id: String(id), source: `photo-${id}`, crop: { x: .5, y: 1, zoom: 2 } }));
  const moved = movePhoto(photos, 0, 3);
  assert.deepEqual(moved.map(photo => photo.id), ["1", "2", "3", "0"]);
  assert.equal(moved[3], photos[0]);
  assert.deepEqual(movePhoto(moved, 3, 0), photos);
  assert.deepEqual(photos.map(photo => photo.id), ["0", "1", "2", "3"]);
  assert.throws(() => movePhoto(photos, -1, 0), /không hợp lệ/);
  assert.throws(() => movePhoto(photos, 0, 4), /không hợp lệ/);
  assert.throws(() => movePhoto(photos, .5, 1), /không hợp lệ/);
});

test("unsupported files and oversized images fail before image decoding", async () => {
  await assert.rejects(importPhoto(new File(["text"], "photo.svg", { type: "image/svg+xml" })), /JPG, PNG hoặc WebP/);
  await assert.rejects(importPhoto({ type: "image/jpeg", size: 20 * 1024 * 1024 + 1 }), /nhỏ hơn 20 MB/);
});

test("export requests the selected mime type and preserves the resulting blob", async () => {
  const expected = new Blob(["jpeg data"], { type: "image/jpeg" });
  const canvas = { toBlob(callback, mimeType, quality) {
    assert.equal(mimeType, "image/jpeg"); assert.equal(quality, .95); callback(expected);
  } };
  assert.equal(await canvasBlob(canvas, "jpeg"), expected);
});

test("failed image encoding returns a useful error instead of a broken download", async () => {
  await assert.rejects(canvasBlob({ toBlob(callback) { callback(null); } }, "png"), /Không thể xuất ảnh/);
});

test("filter intensity blends toward the original and preserves alpha", () => {
  const original = new Uint8ClampedArray([200, 60, 20, 73]);
  const zero = original.slice(); applyFilterPixels(zero, "mono", 0);
  assert.deepEqual(zero, original);
  const full = original.slice(); applyFilterPixels(full, "mono", 1);
  assert.deepEqual([...full], [87, 87, 87, 73]);
  const half = original.slice(); applyFilterPixels(half, "mono", .5);
  assert.deepEqual([...half], [143, 73, 53, 73]);
  assert.deepEqual(getFilterMatrix("rose", -1), getFilterMatrix("original"));
  assert.deepEqual(getFilterMatrix("rose", 5), getFilterMatrix("rose", 1));
});

test("every filter produces finite pixels and distinct color treatments", () => {
  const outputs = new Set();
  for (const preset of FILTERS) {
    const matrix = getFilterMatrix(preset.id);
    assert.equal(matrix.length, 20);
    assert.ok(matrix.every(Number.isFinite), preset.id);
    const pixels = new Uint8ClampedArray([45, 130, 205, 255, 230, 160, 85, 99, 0, 0, 0, 0, 255, 255, 255, 255]);
    applyFilterPixels(pixels, preset.id);
    assert.deepEqual([pixels[3], pixels[7], pixels[11], pixels[15]], [255, 99, 0, 255]);
    outputs.add([...pixels].join(","));
  }
  assert.equal(outputs.size, FILTERS.length, "presets should visibly differ, rather than just having different names");
});

test("caption contrast remains readable on every preset and custom frame colors", () => {
  const luminance = hex => {
    const channels = [1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16) / 255)
      .map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
    return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
  };
  for (const color of [...COLORS.map(color => color.value), "#777777", "#ff0000", "#0000ff", "#ffff00", "#123456"]) {
    const background = luminance(color), foreground = luminance(getFramePalette(color).ink);
    const contrast = (Math.max(background, foreground) + .05) / (Math.min(background, foreground) + .05);
    assert.ok(contrast >= 4.5, `${color}: ${contrast}`);
  }
});

test("curated templates keep four crop-compatible photo slots within each export", () => {
  for (const template of TEMPLATES) for (const layout of ["strip", "grid"]) {
    const scene = getTemplateScene(template.id, layout);
    assert.equal(scene.slots.length, 4);
    assert.deepEqual([scene.width, scene.height], layout === "strip" ? [1200, 3044] : [1600, 1206]);
    for (const slot of getTemplateSlots(template.id, layout)) {
      assert.ok(Math.abs(slot.width / slot.height - 1.6) < 1e-9);
      const angle = Math.abs(slot.rotation) * Math.PI / 180;
      const extentX = (slot.width * Math.cos(angle) + slot.height * Math.sin(angle)) / 2;
      const extentY = (slot.height * Math.cos(angle) + slot.width * Math.sin(angle)) / 2;
      const cx = slot.x + slot.width / 2, cy = slot.y + slot.height / 2;
      assert.ok(cx - extentX >= 0 && cx + extentX <= scene.width, template.id);
      assert.ok(cy - extentY >= 0 && cy + extentY <= scene.height - 100, template.id);
    }
  }
});

test("template artwork escapes visitor text and keeps demo illustrations out of exports", () => {
  const caption = '<script>alert("hello")</script> & friends';
  for (const template of TEMPLATES) {
    const scene = getTemplateScene(template.id, "grid", { caption, date: "<date>", color: '#fff\"/><script/>' });
    assert.ok(!scene.overlay.includes("<script>"));
    assert.ok(scene.overlay.includes("&lt;script&gt;"));
    assert.ok(scene.overlay.includes("&lt;date&gt;"));
    assert.ok(!scene.background.includes("YOUR HAPPY MOMENT"));
    assert.ok(!scene.overlay.includes("YOUR HAPPY MOMENT"));
    assert.ok(scene.preview.includes("YOUR HAPPY MOMENT"));
    assert.ok(scene.background.includes(template.color));
  }
});

test("expanded catalogue has unique identities and valid presets for every collection", () => {
  assert.equal(TEMPLATES.length, 32);
  assert.equal(new Set(TEMPLATES.map(template => template.id)).size, TEMPLATES.length);
  assert.equal(new Set(TEMPLATES.map(template => template.name)).size, TEMPLATES.length);
  assert.equal(TEMPLATES.filter(template => template.isNew).length, 24);
  for (const template of TEMPLATES) {
    assert.ok(TEMPLATE_GROUPS.includes(template.group), template.id);
    assert.ok(FILTERS.some(filter => filter.id === template.filter), template.id);
    assert.match(template.color, /^#[\da-f]{6}$/i);
    assert.ok(template.strength >= 0 && template.strength <= 1);
  }
});

test("template search handles Vietnamese accents, aliases and category filters", () => {
  assert.deepEqual(findTemplates("Tất cả", "  TẾT  ").map(template => template.id), ["tet"]);
  assert.deepEqual(findTemplates("Tất cả", "dien anh").map(template => template.id), ["cinema"]);
  assert.deepEqual(findTemplates("Tất cả", "tot nghiep").map(template => template.id), ["graduation"]);
  assert.deepEqual(findTemplates("Lãng mạn", "tet"), []);
  assert.equal(findTemplates("Lễ hội").length, 2);
  assert.equal(findTemplates("Cartoon").length, 8);
  assert.equal(findTemplates("Tất cả", "hoat hinh").length, 8);
  assert.deepEqual(findTemplates("Cartoon", "tiem banh").map(template => template.id), ["winter-bakery"]);
  assert.deepEqual(findTemplates("Cartoon", "rai ca").map(template => template.id), ["sky-pals"]);
  assert.deepEqual(findTemplates("Cartoon", "gau").map(template => template.id), ["bear-picnic"]);
  assert.deepEqual(findTemplates("Cartoon", "truyen tranh").map(template => template.id), ["comic-pop"]);
  assert.deepEqual(findTemplates("Tất cả", "unknown-template-123"), []);
  const results = findTemplates();
  assert.equal(results.length, TEMPLATES.length);
  assert.ok(results.slice(0, 24).every(template => template.isNew));
  assert.ok(results.slice(0, 8).every(template => template.group === "Cartoon"));
  assert.equal(TEMPLATES[0].id, "coquette", "search sorting must preserve the default template");
});

test("detailed character frames ship transparent artwork outside the four photos", async () => {
  const detailed = TEMPLATES.filter(template => getTemplateScene(template.id, "strip").artwork.length);
  assert.equal(detailed.length, 4);
  for (const template of detailed) {
    for (const layout of ["strip", "grid"]) {
      const scene = getTemplateScene(template.id, layout);
      const photoBottom = Math.max(...scene.slots.map(slot => slot.y + slot.height));
      for (const asset of scene.artwork) {
        assert.ok(asset.x >= 0 && asset.x + asset.width <= scene.width, template.id);
        assert.ok(asset.y >= photoBottom && asset.y + asset.height <= scene.height, template.id);
        const bytes = await readFile(new URL(`../public${asset.source}`, import.meta.url));
        assert.equal(bytes.subarray(1, 4).toString(), "PNG");
        assert.equal(bytes[25], 6, "PNG must retain its RGBA channel");
        assert.ok(bytes.readUInt32BE(16) >= 1000 && bytes.readUInt32BE(20) >= 1000);
      }
    }
  }
});
