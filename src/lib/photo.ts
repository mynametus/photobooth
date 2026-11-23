export type Layout = "strip" | "grid";
export type Filter = "original" | "mono" | "film" | "warm";
export type Sticker = "none" | "stars" | "hearts" | "flowers";
export interface PhotoCrop { x: number; y: number; zoom: number }
export const DEFAULT_CROP: PhotoCrop = { x: .5, y: .5, zoom: 1 };
export interface Photo { id: string; source: string; crop?: PhotoCrop }
export interface Design {
  layout: Layout;
  filter: Filter;
  color: string;
  caption: string;
  date: string;
  showDate: boolean;
  sticker: Sticker;
}

export const FILTERS: { id: Filter; name: string; css: string }[] = [
  { id: "original", name: "Tự nhiên", css: "none" },
  { id: "mono", name: "Đen trắng", css: "grayscale(1)" },
  { id: "film", name: "Film", css: "sepia(.35) saturate(.8) contrast(.95)" },
  { id: "warm", name: "Nắng ấm", css: "sepia(.2) saturate(1.3) brightness(1.05)" },
];
export const COLORS = [
  { value: "#fffdf8", name: "Trắng kem" },
  { value: "#e9e2ff", name: "Tím lavender" },
  { value: "#dcece0", name: "Xanh matcha" },
  { value: "#f7dde4", name: "Hồng phấn" },
  { value: "#faedbb", name: "Vàng bơ" },
  { value: "#25252d", name: "Đen" },
];

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
function filterPixels(ctx: CanvasRenderingContext2D, filter: Filter, x: number, y: number, width: number, height: number) {
  if (filter === "original") return;
  const image = ctx.getImageData(x, y, width, height);
  const pixels = image.data;
  for (let i = 0; i < pixels.length; i += 4) {
    let r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
    if (filter === "mono") {
      r = g = b = .2126 * r + .7152 * g + .0722 * b;
    } else {
      const sepia = filter === "film" ? .35 : .2;
      const sr = Math.min(255, .393 * r + .769 * g + .189 * b);
      const sg = Math.min(255, .349 * r + .686 * g + .168 * b);
      const sb = Math.min(255, .272 * r + .534 * g + .131 * b);
      r += (sr - r) * sepia; g += (sg - g) * sepia; b += (sb - b) * sepia;
      const luminance = .213 * r + .715 * g + .072 * b;
      const saturation = filter === "film" ? .8 : 1.3;
      r = luminance + (r - luminance) * saturation;
      g = luminance + (g - luminance) * saturation;
      b = luminance + (b - luminance) * saturation;
      if (filter === "film") { r = (r - 127.5) * .95 + 127.5; g = (g - 127.5) * .95 + 127.5; b = (b - 127.5) * .95 + 127.5; }
      else { r *= 1.05; g *= 1.05; b *= 1.05; }
    }
    pixels[i] = r; pixels[i + 1] = g; pixels[i + 2] = b;
  }
  ctx.putImageData(image, x, y);
}

function decoration(ctx: CanvasRenderingContext2D, sticker: Sticker, x: number, y: number, size: number, rotation: number) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rotation);
  if (sticker === "stars") {
    ctx.fillStyle = "#d6ab3d";
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4 - Math.PI / 2;
      const radius = i % 2 === 0 ? size : size * .24;
      if (i === 0) ctx.moveTo(Math.cos(a) * radius, Math.sin(a) * radius);
      else ctx.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
    }
    ctx.closePath(); ctx.fill();
  } else if (sticker === "hearts") {
    ctx.fillStyle = "#c97186";
    ctx.beginPath(); ctx.moveTo(0, size * .7);
    ctx.bezierCurveTo(-size * 1.8, -size * .25, -size * .6, -size * 1.5, 0, -size * .55);
    ctx.bezierCurveTo(size * .6, -size * 1.5, size * 1.8, -size * .25, 0, size * .7); ctx.fill();
  } else if (sticker === "flowers") {
    ctx.fillStyle = "#b5a4df";
    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 3;
      ctx.beginPath(); ctx.ellipse(Math.cos(a) * size * .5, Math.sin(a) * size * .5, size * .5, size * .35, a, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = "#f6d56c"; ctx.beginPath(); ctx.arc(0, 0, size * .28, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

export async function renderPhoto(canvas: HTMLCanvasElement, photos: Photo[], design: Design) {
  if (photos.length !== 4) throw new Error("Cần đủ 4 ảnh để tạo thành phẩm.");
  const images = await Promise.all(photos.map(photo => loadImage(photo.source)));
  const g = getGeometry(design.layout);
  // Render offscreen, then commit once. Fast edits cannot expose a half-painted image.
  const buffer = document.createElement("canvas");
  buffer.width = g.width; buffer.height = g.height;
  const ctx = buffer.getContext("2d");
  if (!ctx) throw new Error("Trình duyệt không hỗ trợ xử lý ảnh.");
  ctx.fillStyle = design.color; ctx.fillRect(0, 0, g.width, g.height);
  images.forEach((image, i) => {
    const x = g.margin + (i % g.columns) * (g.photoWidth + g.gap);
    const y = g.margin + Math.floor(i / g.columns) * (g.photoHeight + g.gap);
    drawCover(ctx, image, image.naturalWidth, image.naturalHeight, x, y, g.photoWidth, g.photoHeight, photos[i].crop);
    filterPixels(ctx, design.filter, x, y, g.photoWidth, g.photoHeight);
  });
  const dark = design.color === "#25252d";
  ctx.fillStyle = dark ? "#fffdf8" : "#464152";
  ctx.textAlign = "center";
  ctx.font = "600 42px Arial, sans-serif";
  const caption = design.caption.trim() || "một chút. thật vui.";
  let fontSize = 42;
  while (ctx.measureText(caption).width > g.width - 240 && fontSize > 20) {
    fontSize -= 1; ctx.font = `600 ${fontSize}px Arial, sans-serif`;
  }
  ctx.fillText(caption, g.width / 2, g.height - 121);
  ctx.font = "24px Arial, sans-serif";
  ctx.fillStyle = dark ? "#c9c4d1" : "#81798d";
  ctx.fillText(design.showDate ? `${design.date}  ·  một chút.` : "made with một chút.", g.width / 2, g.height - 65);
  if (design.sticker !== "none") {
    decoration(ctx, design.sticker, 66, 65, 44, -.25);
    decoration(ctx, design.sticker, g.width - 65, g.height - 193, 48, .2);
    decoration(ctx, design.sticker, g.width - 68, 66 + g.photoHeight, 32, .1);
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
