import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { mkdir, readFile } from "node:fs/promises";
import { chromium } from "playwright-core";

const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";
let browser;
before(async () => {
  browser = process.env.TEST_CDP_URL ? await chromium.connectOverCDP(process.env.TEST_CDP_URL) : await chromium.launch({
    channel: process.env.TEST_BROWSER_CHANNEL || "chrome", headless: true,
    args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"],
  });
  await mkdir("test-results", { recursive: true });
});
after(async () => { await browser?.close(); });

async function open(options = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, ...options });
  const errors = [];
  const page = await context.newPage();
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(base);
  await page.getByRole("button", { name: "Cách chụp", exact: true }).waitFor();
  return { context, page, errors };
}

async function fixtures(page, colors = ["#db6b55", "#6e9d91", "#5f7ba8", "#cfad56"]) {
  return page.evaluate(colors => colors.map((color, i) => {
    const canvas = document.createElement("canvas"); canvas.width = 800; canvas.height = 500;
    const ctx = canvas.getContext("2d"); ctx.fillStyle = color; ctx.fillRect(0, 0, 800, 500);
    ctx.fillStyle = "#fff2"; ctx.fillRect(30, 30, 740, 440);
    ctx.fillStyle = "#fff8"; ctx.beginPath(); ctx.arc(400, 210, 95, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = color; ctx.beginPath(); ctx.arc(370, 195, 8, 0, Math.PI * 2); ctx.arc(430, 195, 8, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = color; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(400, 210, 47, .15 * Math.PI, .85 * Math.PI); ctx.stroke();
    ctx.fillStyle = "white"; ctx.font = "24px Arial"; ctx.textAlign = "center"; ctx.fillText(`our happy moment ${i + 1}`, 400, 400);
    return canvas.toDataURL("image/png").split(",")[1];
  }), colors).then(images => images.map((image, i) => ({ name: `photo-${i}.png`, mimeType: "image/png", buffer: Buffer.from(image, "base64") })));
}

async function waitForPreview(page) {
  await page.getByRole("button", { name: "Ưng rồi, lưu ảnh thôi" }).waitFor();
  await page.waitForFunction(() => {
    const canvas = document.querySelector('[data-testid="result-canvas"]');
    return canvas?.width > 1000 && !document.querySelector(".render-status");
  });
}

test("initial studio, private processing information and keyboard dialog", async () => {
  const { page, context, errors } = await open();
  assert.equal(await page.getByRole("button", { name: /Bắt đầu chụp/ }).isDisabled(), true);
  assert.equal(await page.locator(".steps button").nth(1).isDisabled(), true);
  await page.getByRole("button", { name: "Khoảnh khắc của riêng bạn" }).click();
  assert.equal(await page.getByRole("dialog").isVisible(), true);
  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("dialog").isVisible(), false);
  await page.screenshot({ path: "test-results/studio-desktop.png", fullPage: true });
  assert.deepEqual(errors, []);
  await context.close();
});

test("upload, decorate and export real PNG/JPG with correct dimensions", async () => {
  const { page, context, errors } = await open();
  await page.locator('input[type="file"]').setInputFiles(await fixtures(page));
  await waitForPreview(page);
  let geometry = await page.locator("canvas").evaluate(canvas => [canvas.width, canvas.height]);
  assert.deepEqual(geometry, [1200, 3044]);
  await page.getByRole("button", { name: "Lưới 2 × 2", exact: true }).click();
  await page.getByRole("button", { name: "Khung Tím lavender" }).click();
  await page.getByLabel("Lời nhắn nhỏ", { exact: false }).fill("Hôm nay thật vui ♡");
  await page.getByRole("button", { name: "Lấp lánh", exact: true }).click();
  await page.getByRole("button", { name: "Đen trắng", exact: true }).click();
  await waitForPreview(page);
  geometry = await page.locator("canvas").evaluate(canvas => [canvas.width, canvas.height]);
  assert.deepEqual(geometry, [1600, 1206]);
  const pixels = await page.locator("canvas").evaluate(canvas => {
    const ctx = canvas.getContext("2d");
    return { border: [...ctx.getImageData(5, 5, 1, 1).data], photo: [...ctx.getImageData(140, 150, 1, 1).data] };
  });
  assert.deepEqual(pixels.border, [233, 226, 255, 255]);
  assert.equal(pixels.photo[0], pixels.photo[1]); assert.equal(pixels.photo[1], pixels.photo[2]);
  await page.screenshot({ path: "test-results/editor-desktop.png", fullPage: true });
  await page.getByRole("button", { name: "Ưng rồi, lưu ảnh thôi" }).click();
  await page.waitForFunction(() => !document.querySelector(".render-status"));
  const pngPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Tải ảnh PNG" }).click();
  const png = await pngPromise;
  const pngData = await readFile(await png.path());
  assert.equal(pngData.subarray(1, 4).toString(), "PNG");
  assert.equal(pngData.readUInt32BE(16), 1600); assert.equal(pngData.readUInt32BE(20), 1206);
  assert.match(png.suggestedFilename(), /\.png$/);
  await page.getByRole("button", { name: /JPG.*Dễ dàng chia sẻ/ }).click();
  const jpegPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Tải ảnh JPG" }).click();
  const jpeg = await jpegPromise;
  const jpegData = await readFile(await jpeg.path());
  assert.deepEqual([...jpegData.subarray(0, 3)], [255, 216, 255]);
  assert.match(jpeg.suggestedFilename(), /\.jpg$/);
  assert.deepEqual(errors, []);
  await context.close();
});

test("individual framing is reversible and moves with its photo", async () => {
  const { page, context, errors } = await open({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const files = await fixtures(page);
  const portrait = await page.evaluate(() => {
    const canvas = document.createElement("canvas"); canvas.width = 800; canvas.height = 1000;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#e02020"; ctx.fillRect(0, 0, 800, 500);
    ctx.fillStyle = "#2040e0"; ctx.fillRect(0, 500, 800, 500);
    return canvas.toDataURL("image/png").split(",")[1];
  });
  files[0] = { name: "portrait.png", mimeType: "image/png", buffer: Buffer.from(portrait, "base64") };
  await page.locator('input[type="file"]').setInputFiles(files);
  await waitForPreview(page);
  const originals = await page.locator(".photo-slot img").evaluateAll(images => images.map(image => image.src));
  await page.getByRole("button", { name: "Chỉnh khung hình ảnh 1", exact: true }).click();
  await page.getByRole("slider", { name: /Phóng to/ }).waitFor();
  await page.waitForFunction(() => !document.querySelector(".crop-controls").disabled);
  await page.locator("#crop-zoom").fill("2");
  await page.locator("#crop-y").fill("100");
  await page.screenshot({ path: "test-results/photo-editor-mobile.png", fullPage: true });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.getByRole("button", { name: "Áp dụng", exact: true }).click();
  await waitForPreview(page);
  const pixel = await page.getByTestId("result-canvas").evaluate(canvas => [...canvas.getContext("2d").getImageData(600, 400, 1, 1).data]);
  assert.ok(pixel[2] > 180 && pixel[0] < 70, "export uses the blue bottom of the portrait");
  const applied = await page.getByTestId("result-canvas").evaluate(canvas => canvas.toDataURL());

  await page.getByRole("button", { name: "Chỉnh khung hình ảnh 1", exact: true }).click();
  await page.waitForFunction(() => !document.querySelector(".crop-controls").disabled);
  await page.getByRole("button", { name: "Đặt lại chỉnh sửa", exact: true }).click();
  await page.getByRole("button", { name: "Hủy", exact: true }).click();
  assert.equal(await page.getByTestId("result-canvas").evaluate(canvas => canvas.toDataURL()), applied);

  await page.getByRole("button", { name: "Chỉnh khung hình ảnh 1", exact: true }).click();
  await page.waitForFunction(() => !document.querySelector(".crop-controls").disabled);
  assert.equal(await page.locator("#crop-zoom").inputValue(), "2");
  await page.getByLabel("Vị trí trong bộ ảnh").selectOption("3");
  await page.getByRole("button", { name: "Áp dụng", exact: true }).click();
  await waitForPreview(page);
  const reordered = await page.locator(".photo-slot img").evaluateAll(images => images.map(image => image.src));
  assert.deepEqual(reordered, [originals[1], originals[2], originals[3], originals[0]]);
  const last = await page.getByTestId("result-canvas").evaluate(canvas => [...canvas.getContext("2d").getImageData(600, 2500, 1, 1).data]);
  assert.ok(last[2] > 180 && last[0] < 70, "framing follows the moved photo");
  assert.deepEqual(errors, []);
  await context.close();
});

test("fake camera captures four photos and replaces only the selected photo", { timeout: 45000 }, async () => {
  const { page, context, errors } = await open({ permissions: ["camera"] });
  await page.getByRole("button", { name: "Bật camera", exact: true }).click();
  await page.waitForFunction(() => document.querySelector("video")?.readyState >= 2);
  await page.getByRole("button", { name: /Bắt đầu chụp/ }).click();
  await waitForPreview(page);
  const before = await page.locator(".photo-slot img").evaluateAll(images => images.map(image => image.src));
  assert.equal(before.length, 4);
  await page.getByRole("button", { name: "Chụp lại ảnh 2", exact: true }).click();
  await page.getByRole("button", { name: "Bật camera", exact: true }).click();
  await page.waitForFunction(() => document.querySelector("video")?.readyState >= 2);
  await page.locator(".capture-button").click();
  await waitForPreview(page);
  const after = await page.locator(".photo-slot img").evaluateAll(images => images.map(image => image.src));
  assert.equal(before[0], after[0]); assert.notEqual(before[1], after[1]);
  assert.equal(before[2], after[2]); assert.equal(before[3], after[3]);
  assert.deepEqual(errors, []);
  await context.close();
});

test("cancel keeps completed shots and switching tabs releases the camera", { timeout: 20000 }, async () => {
  const { page, context } = await open({ permissions: ["camera"] });
  await page.getByRole("button", { name: "Bật camera", exact: true }).click();
  await page.waitForFunction(() => document.querySelector("video")?.readyState >= 2);
  await page.getByRole("button", { name: /Bắt đầu chụp/ }).click();
  await page.waitForFunction(() => document.querySelectorAll(".photo-slot img").length === 1);
  await page.getByRole("button", { name: "Dừng chụp", exact: true }).click();
  await page.getByRole("button", { name: /Chụp 3 ảnh còn lại/ }).waitFor();
  assert.equal(await page.locator(".photo-slot img").count(), 1);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  assert.equal(await page.locator("video").evaluate(video => video.srcObject.active), false);
  assert.equal(await page.getByRole("button", { name: "Bật camera", exact: true }).isVisible(), true);
  await context.close();
});

test("camera permission denial has an actionable message and uploads still work", async () => {
  const { context, page, errors } = await open();
  await page.evaluate(() => {
    navigator.mediaDevices.getUserMedia = async () => { throw new DOMException("Denied", "NotAllowedError"); };
  });
  await page.getByRole("button", { name: "Bật camera", exact: true }).click();
  await page.getByRole("alert").waitFor();
  assert.match(await page.getByRole("alert").innerText(), /chưa cấp quyền camera/);
  const files = await fixtures(page);
  await page.locator('input[type="file"]').setInputFiles([...files, files[0]]);
  assert.match(await page.getByRole("alert").innerText(), /chỉ cần chọn 4 ảnh/);
  assert.equal(await page.locator(".photo-slot img").count(), 0);
  await page.locator('input[type="file"]').setInputFiles({ name: "broken.png", mimeType: "image/png", buffer: Buffer.from("invalid") });
  await page.getByRole("alert").filter({ hasText: "Không đọc được ảnh" }).waitFor();
  await page.locator('input[type="file"]').setInputFiles(files);
  await waitForPreview(page);
  assert.deepEqual(errors, []);
  await context.close();
});

test("mobile layout, image replacement and reset confirmation", async () => {
  const { page, context, errors } = await open({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.screenshot({ path: "test-results/studio-mobile.png", fullPage: true });
  const files = await fixtures(page);
  await page.locator('input[type="file"]').setInputFiles(files.slice(0, 2));
  assert.equal(await page.locator(".photo-slot img").count(), 2);
  await page.locator('input[type="file"]').setInputFiles(files.slice(2));
  await waitForPreview(page);
  const first = await page.locator(".photo-slot img").first().getAttribute("src");
  await page.getByRole("button", { name: "Chụp lại ảnh 3", exact: true }).click();
  await page.locator('input[type="file"]').setInputFiles(files[0]);
  await waitForPreview(page);
  assert.equal(await page.locator(".photo-slot img").first().getAttribute("src"), first);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.screenshot({ path: "test-results/editor-mobile.png", fullPage: true });
  await page.getByRole("button", { name: "Bắt đầu lại", exact: true }).click();
  await page.getByRole("button", { name: "Giữ ảnh hiện tại" }).click();
  assert.equal(await page.locator(".photo-slot img").count(), 4);
  await page.getByRole("button", { name: "Bắt đầu lại", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Bắt đầu lại", exact: true }).click();
  assert.equal(await page.locator(".photo-slot img").count(), 0);
  assert.deepEqual(errors, []);
  await context.close();
});
