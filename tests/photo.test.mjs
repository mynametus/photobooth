import { test } from "node:test";
import assert from "node:assert/strict";
import { canvasBlob, drawCover, getGeometry, importPhoto, movePhoto, normalizeCrop } from "../src/lib/photo.ts";

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
