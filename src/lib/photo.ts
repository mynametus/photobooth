import { applyFilterPixels, type Filter } from "./filters.ts";
import { drawFrame, drawSticker, getFramePalette, type FrameStyle, type Sticker } from "./frames.ts";
import { getTemplateScene, svgDataUrl, type TemplateId } from "./templates.ts";
import type { TemplateArtwork } from "./character-templates.ts";
export { FILTERS } from "./filters.ts";
export { COLORS } from "./frames.ts";
export type { Filter } from "./filters.ts";
export type { FrameStyle, Sticker } from "./frames.ts";
export type Layout = "strip" | "grid";
export interface PhotoCrop { x: number; y: number; zoom: number }
export const DEFAULT_CROP: PhotoCrop = { x: .5, y: .5, zoom: 1 };
export interface Photo { id: string; source: string; crop?: PhotoCrop }
export interface Design {
  template: TemplateId;
  layout: Layout;
  filter: Filter;
  filterStrength: number;
  frame: FrameStyle;
  color: string;
  caption: string;
  date: string;
  showDate: boolean;
  sticker: Sticker;
}

export function getGeometry(layout: Layout) {
  const width = layout === "strip" ? 1200 : 1600;
  const margin = 64, gap = 30;
  const columns = layout === "strip" ? 1 : 2;
  const photoWidth = (width - margin * 2 - gap * (columns - 1)) / columns;
  const photoHeight = Math.round(photoWidth / 1.6);
  const rows = 4 / columns;
  const height = margin + rows * photoHeight + (rows - 1) * gap + 210;
  return { width, height, margin, gap, columns, photoWidth, photoHeight };
}

export function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Không đọc được ảnh. Hãy thử một ảnh JPG, PNG hoặc WebP khác."));
    image.src = source;
  });
}

export function normalizeCrop(crop: Partial<PhotoCrop> = {}): PhotoCrop {
  const clamp = (value: number | undefined, fallback: number, min: number, max: number) =>
    typeof value === "number" && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
  return { x: clamp(crop.x, .5, 0, 1), y: clamp(crop.y, .5, 0, 1), zoom: clamp(crop.zoom, 1, 1, 3) };
}

export function drawCover(ctx: CanvasRenderingContext2D, image: CanvasImageSource, sourceWidth: number, sourceHeight: number, x: number, y: number, width: number, height: number, crop?: PhotoCrop) {
  const framing = normalizeCrop(crop);
  const scale = Math.max(width / sourceWidth, height / sourceHeight) * framing.zoom;
  const cropWidth = width / scale, cropHeight = height / scale;
  ctx.drawImage(image, (sourceWidth - cropWidth) * framing.x, (sourceHeight - cropHeight) * framing.y, cropWidth, cropHeight, x, y, width, height);
}

export function movePhoto(photos: Photo[], from: number, to: number): Photo[] {
  if (!Number.isInteger(from) || !Number.isInteger(to) || from < 0 || to < 0 || from >= photos.length || to >= photos.length) {
    throw new Error("Vị trí ảnh không hợp lệ.");
  }
  const result = [...photos];
  const [photo] = result.splice(from, 1);
  result.splice(to, 0, photo);
  return result;
}

// Pixel math also works in browsers without CanvasRenderingContext2D.filter.
function filterPixels(ctx: CanvasRenderingContext2D, filter: Filter, x: number, y: number, width: number, height: number, strength: number) {
  if (filter === "original" || strength === 0) return;
  const image = ctx.getImageData(x, y, width, height);
  applyFilterPixels(image.data, filter, strength);
  ctx.putImageData(image, x, y);
}

const artworkCache = new Map<string, Promise<HTMLImageElement>>();
function loadArtwork(artwork: TemplateArtwork[]) {
  return Promise.all(artwork.map(asset => {
    let pending = artworkCache.get(asset.source);
    if (!pending) {
      pending = loadImage(asset.source); artworkCache.set(asset.source, pending);
      void pending.catch(() => artworkCache.delete(asset.source));
    }
    return pending;
  }));
}
function drawArtwork(ctx: CanvasRenderingContext2D, artwork: TemplateArtwork[], images: HTMLImageElement[]) {
  artwork.forEach((asset, index) => {
    const image = images[index];
    const scale = Math.min(asset.width / image.naturalWidth, asset.height / image.naturalHeight);
    const width = image.naturalWidth * scale, height = image.naturalHeight * scale;
    ctx.drawImage(image, asset.x + (asset.width - width) / 2, asset.y + (asset.height - height) / 2, width, height);
  });
}

export async function renderTemplatePreview(canvas: HTMLCanvasElement, design: Design, previewWidth = 240) {
  if (design.template === "custom") throw new Error("Hãy chọn một mẫu để xem trước.");
  const scene = getTemplateScene(design.template, design.layout, design);
  const [base, overlay, artworkImages] = await Promise.all([loadImage(svgDataUrl(scene.previewBase)), loadImage(svgDataUrl(scene.overlay)), loadArtwork(scene.artwork)]);
  const scale = Math.min(1, previewWidth / scene.width);
  const buffer = document.createElement("canvas");
  buffer.width = Math.round(scene.width * scale); buffer.height = Math.round(scene.height * scale);
  const ctx = buffer.getContext("2d");
  if (!ctx) throw new Error("Không thể tạo ảnh xem trước.");
  ctx.scale(scale, scale); ctx.drawImage(base, 0, 0, scene.width, scene.height);
  drawArtwork(ctx, scene.artwork, artworkImages); ctx.drawImage(overlay, 0, 0, scene.width, scene.height);
  canvas.width = buffer.width; canvas.height = buffer.height;
  const target = canvas.getContext("2d");
  if (!target) throw new Error("Không thể tạo ảnh xem trước.");
  target.drawImage(buffer, 0, 0);
}

export async function renderPhoto(canvas: HTMLCanvasElement, photos: Photo[], design: Design, previewWidth?: number) {
  if (photos.length !== 4) throw new Error("Cần đủ 4 ảnh để tạo thành phẩm.");
  const images = await Promise.all(photos.map(photo => loadImage(photo.source)));
  if (design.template && design.template !== "custom") {
    const scene = getTemplateScene(design.template, design.layout, design);
    const [background, overlay, artworkImages] = await Promise.all([loadImage(svgDataUrl(scene.background)), loadImage(svgDataUrl(scene.overlay)), loadArtwork(scene.artwork)]);
    const scale = previewWidth ? Math.min(1, previewWidth / scene.width) : 1;
    const buffer = document.createElement("canvas");
    buffer.width = Math.round(scene.width * scale); buffer.height = Math.round(scene.height * scale);
    const ctx = buffer.getContext("2d");
    if (!ctx) throw new Error("Trình duyệt không hỗ trợ xử lý ảnh.");
    ctx.scale(scale, scale); ctx.drawImage(background, 0, 0, scene.width, scene.height);
    scene.slots.forEach((slot, index) => {
      const photo = document.createElement("canvas");
      photo.width = Math.max(1, Math.round(slot.width * scale)); photo.height = Math.max(1, Math.round(slot.height * scale));
      const photoCtx = photo.getContext("2d");
      if (!photoCtx) throw new Error("Không thể tạo ảnh xem trước.");
      const image = images[index];
      drawCover(photoCtx, image, image.naturalWidth, image.naturalHeight, 0, 0, photo.width, photo.height, photos[index].crop);
      filterPixels(photoCtx, design.filter, 0, 0, photo.width, photo.height, design.filterStrength);
      ctx.save(); ctx.translate(slot.x + slot.width / 2, slot.y + slot.height / 2); ctx.rotate(slot.rotation * Math.PI / 180);
      ctx.beginPath(); ctx.roundRect(-slot.width / 2, -slot.height / 2, slot.width, slot.height, slot.radius); ctx.clip();
      ctx.drawImage(photo, -slot.width / 2, -slot.height / 2, slot.width, slot.height); ctx.restore();
    });
    drawArtwork(ctx, scene.artwork, artworkImages);
    ctx.drawImage(overlay, 0, 0, scene.width, scene.height);
    if (design.sticker !== "none") {
      drawSticker(ctx, design.sticker, 90, scene.height - 110, 40, -.2);
      drawSticker(ctx, design.sticker, scene.width - 60, 140, 30, .15);
    }
    canvas.width = buffer.width; canvas.height = buffer.height;
    const target = canvas.getContext("2d");
    if (!target) throw new Error("Không thể tạo ảnh xem trước.");
    target.drawImage(buffer, 0, 0);
    return;
  }
  const g = getGeometry(design.layout);
  // Render offscreen, then commit once. Fast edits cannot expose a half-painted image.
  const buffer = document.createElement("canvas");
  buffer.width = g.width; buffer.height = g.height;
  const ctx = buffer.getContext("2d");
  if (!ctx) throw new Error("Trình duyệt không hỗ trợ xử lý ảnh.");
  drawFrame(ctx, g, design.color, design.frame);
  images.forEach((image, i) => {
    const x = g.margin + (i % g.columns) * (g.photoWidth + g.gap);
    const y = g.margin + Math.floor(i / g.columns) * (g.photoHeight + g.gap);
    drawCover(ctx, image, image.naturalWidth, image.naturalHeight, x, y, g.photoWidth, g.photoHeight, photos[i].crop);
    filterPixels(ctx, design.filter, x, y, g.photoWidth, g.photoHeight, design.filterStrength);
  });
  const palette = getFramePalette(design.color);
  ctx.fillStyle = palette.ink;
  ctx.textAlign = "center";
  ctx.font = "600 42px Arial, sans-serif";
  const caption = design.caption.trim() || "một chút. thật vui.";
  let fontSize = 42;
  while (ctx.measureText(caption).width > g.width - 240 && fontSize > 20) {
    fontSize -= 1; ctx.font = `600 ${fontSize}px Arial, sans-serif`;
  }
  ctx.fillText(caption, g.width / 2, g.height - 121);
  ctx.font = "24px Arial, sans-serif";
  ctx.fillStyle = palette.muted;
  ctx.fillText(design.showDate ? `${design.date}  ·  một chút.` : "made with một chút.", g.width / 2, g.height - 65);
  if (design.sticker !== "none") {
    drawSticker(ctx, design.sticker, 66, 65, 44, -.25);
    drawSticker(ctx, design.sticker, g.width - 65, g.height - 193, 48, .2);
    drawSticker(ctx, design.sticker, g.width - 68, 66 + g.photoHeight, 32, .1);
  }
  canvas.width = g.width; canvas.height = g.height;
  const target = canvas.getContext("2d");
  if (!target) throw new Error("Không thể tạo ảnh xem trước.");
  target.drawImage(buffer, 0, 0);
}

export async function importPhoto(file: File): Promise<Photo> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error("Hãy chọn ảnh JPG, PNG hoặc WebP.");
  if (file.size > 20 * 1024 * 1024) throw new Error("Mỗi ảnh cần nhỏ hơn 20 MB.");
  const url = URL.createObjectURL(file);
  try {
    const image = await loadImage(url);
    const scale = Math.min(1, 2000 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Trình duyệt không hỗ trợ xử lý ảnh.");
    ctx.fillStyle = "white"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return { id: crypto.randomUUID(), source: canvas.toDataURL("image/jpeg", .94) };
  } finally { URL.revokeObjectURL(url); }
}

export function canvasBlob(canvas: HTMLCanvasElement, format: "png" | "jpeg") {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("Không thể xuất ảnh. Vui lòng thử lại.")), `image/${format}`, .95);
  });
}
