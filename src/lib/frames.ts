export type FrameStyle = "plain" | "double" | "dashed" | "lace" | "film" | "gingham" | "confetti" | "hearts" | "floral" | "stars" | "airmail" | "ribbon";
export type Sticker = "none" | "stars" | "hearts" | "flowers" | "bow" | "cherries" | "butterfly" | "moon";
export const FRAMES: { id: FrameStyle; name: string }[] = [
  { id: "plain", name: "Tối giản" }, { id: "double", name: "Nét đôi" },
  { id: "dashed", name: "Đường chỉ" }, { id: "lace", name: "Ren nhỏ" },
  { id: "film", name: "Cuộn phim" }, { id: "gingham", name: "Caro" },
  { id: "confetti", name: "Confetti" }, { id: "hearts", name: "Tim nhỏ" },
  { id: "floral", name: "Vườn hoa" }, { id: "stars", name: "Ngàn sao" },
  { id: "airmail", name: "Thư tay" }, { id: "ribbon", name: "Nơ xinh" },
];
export const STICKERS: { id: Sticker; name: string; symbol: string }[] = [
  { id: "none", name: "Không", symbol: "—" }, { id: "stars", name: "Lấp lánh", symbol: "✦" },
  { id: "hearts", name: "Trái tim", symbol: "♡" }, { id: "flowers", name: "Hoa nhỏ", symbol: "✿" },
  { id: "bow", name: "Chiếc nơ", symbol: "🎀" }, { id: "cherries", name: "Cherry", symbol: "🍒" },
  { id: "butterfly", name: "Cánh bướm", symbol: "🦋" }, { id: "moon", name: "Trăng non", symbol: "☾" },
];
export const COLORS = [
  { value: "#fffdf8", name: "Trắng kem" }, { value: "#e9e2ff", name: "Tím lavender" },
  { value: "#dcece0", name: "Xanh matcha" }, { value: "#f7dde4", name: "Hồng phấn" },
  { value: "#faedbb", name: "Vàng bơ" }, { value: "#25252d", name: "Đen" },
  { value: "#ffffff", name: "Trắng tuyết" }, { value: "#e8ddcd", name: "Yến mạch" },
  { value: "#ffdac4", name: "Đào sữa" }, { value: "#f4a293", name: "San hô" },
  { value: "#df8eaa", name: "Hồng đất" }, { value: "#cbb1e8", name: "Tím khoai" },
  { value: "#b8c5ed", name: "Xanh tú cầu" }, { value: "#cce8fa", name: "Xanh trời" },
  { value: "#b4e2df", name: "Xanh ngọc" }, { value: "#bfe6cd", name: "Bạc hà" },
  { value: "#a7ba9a", name: "Xanh sage" }, { value: "#244d42", name: "Xanh rừng" },
  { value: "#263b63", name: "Xanh navy" }, { value: "#722f48", name: "Đỏ rượu" },
  { value: "#553d36", name: "Chocolate" }, { value: "#bd7860", name: "Đất nung" },
  { value: "#d9b95e", name: "Vàng mật ong" }, { value: "#d6dae2", name: "Xám bạc" },
];

function rgb(hex: string) {
  const value = /^#[0-9a-f]{6}$/i.test(hex) ? hex : "#fffdf8";
  return [1, 3, 5].map(offset => parseInt(value.slice(offset, offset + 2), 16));
}
function luminance(hex: string) {
  const [r, g, b] = rgb(hex).map(value => value / 255 <= .04045 ? value / 255 / 12.92 : ((value / 255 + .055) / 1.055) ** 2.4);
  return .2126 * r + .7152 * g + .0722 * b;
}
function mix(a: string, b: string, amount: number) {
  const first = rgb(a), second = rgb(b);
  return `#${first.map((value, i) => Math.round(value + (second[i] - value) * amount).toString(16).padStart(2, "0")).join("")}`;
}
export function getFramePalette(base: string) {
  const light = (luminance(base) + .05) / (luminance("#302d3b") + .05);
  const dark = 1.05 / (luminance(base) + .05);
  const ink = light >= 4.5 ? "#302d3b" : dark >= 4.5 ? "#ffffff" : "#000000";
  return { ink, muted: ink, accent: mix(base, ink, .52), soft: mix(base, ink, .16) };
}

export function drawSticker(ctx: CanvasRenderingContext2D, sticker: Sticker, x: number, y: number, size: number, rotation = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rotation);
  if (sticker === "stars") {
    ctx.fillStyle = "#d6ab3d"; ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = i * Math.PI / 4 - Math.PI / 2, radius = i % 2 === 0 ? size : size * .24;
      if (!i) ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      else ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    ctx.closePath(); ctx.fill();
  } else if (sticker === "hearts") {
    ctx.fillStyle = "#c97186"; ctx.beginPath(); ctx.moveTo(0, size * .7);
    ctx.bezierCurveTo(-size * 1.8, -size * .25, -size * .6, -size * 1.5, 0, -size * .55);
    ctx.bezierCurveTo(size * .6, -size * 1.5, size * 1.8, -size * .25, 0, size * .7); ctx.fill();
  } else if (sticker === "flowers") {
    ctx.fillStyle = "#b5a4df";
    for (let i = 0; i < 6; i++) {
      const angle = i * Math.PI / 3;
      ctx.beginPath(); ctx.ellipse(Math.cos(angle) * size * .5, Math.sin(angle) * size * .5, size * .5, size * .35, angle, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = "#f6d56c"; ctx.beginPath(); ctx.arc(0, 0, size * .28, 0, Math.PI * 2); ctx.fill();
  } else if (sticker === "bow") {
    ctx.fillStyle = "#cc7c9a";
    for (const direction of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(0, 0);
      ctx.bezierCurveTo(direction * size * 1.7, -size * 1.4, direction * size * 1.7, size, 0, 0); ctx.fill();
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(direction * size * .8, size * 1.25); ctx.lineTo(direction * size * .25, size); ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = "#a85475"; ctx.beginPath(); ctx.arc(0, 0, size * .2, 0, Math.PI * 2); ctx.fill();
  } else if (sticker === "cherries") {
    ctx.strokeStyle = "#52794c"; ctx.lineWidth = size * .1;
    ctx.beginPath(); ctx.moveTo(-size * .5, size * .35); ctx.quadraticCurveTo(-size * .55, -size, size * .25, -size);
    ctx.quadraticCurveTo(size * .35, -size * .4, size * .55, size * .3); ctx.stroke();
    ctx.fillStyle = "#c8526a";
    for (const direction of [-1, 1]) { ctx.beginPath(); ctx.arc(direction * size * .5, size * .45, size * .45, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = "#f8b8c5"; ctx.beginPath(); ctx.arc(-size * .65, size * .3, size * .1, 0, Math.PI * 2); ctx.fill();
  } else if (sticker === "butterfly") {
    for (const direction of [-1, 1]) {
      ctx.fillStyle = "#a597da"; ctx.beginPath(); ctx.ellipse(direction * size * .5, -size * .25, size * .65, size * .75, direction * .5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#d3b6e6"; ctx.beginPath(); ctx.ellipse(direction * size * .4, size * .5, size * .45, size * .5, direction * -.4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = "#6c5688"; ctx.lineWidth = size * .12;
    ctx.beginPath(); ctx.moveTo(0, -size * .5); ctx.lineTo(0, size * .7); ctx.stroke();
  } else if (sticker === "moon") {
    ctx.fillStyle = "#dbb557"; ctx.beginPath(); ctx.moveTo(size * .5, -size * .85);
    ctx.bezierCurveTo(-size * .6, -size * 1.3, -size * 1.35, size * .6, 0, size);
    ctx.bezierCurveTo(size * .7, size * 1.15, size * 1.1, size * .5, size, size * .25);
    ctx.bezierCurveTo(-size * .15, size * .8, -size * .4, -size * .5, size * .5, -size * .85); ctx.fill();
  }
  ctx.restore();
}

interface Geometry { width: number; height: number; margin: number; gap: number; columns: number; photoWidth: number; photoHeight: number }

export function drawFrame(ctx: CanvasRenderingContext2D, g: Geometry, base: string, style: FrameStyle = "plain") {
  const { width: w, height: h, margin: m } = g;
  const palette = getFramePalette(base);
  ctx.save();
  ctx.fillStyle = base; ctx.fillRect(0, 0, w, h);
  if (style === "plain") { ctx.restore(); return; }
  // Patterns stay outside photo apertures and the caption/date area.
  ctx.beginPath(); ctx.rect(0, 0, w, h);
  for (let i = 0; i < 4; i++) ctx.rect(m + i % g.columns * (g.photoWidth + g.gap), m + Math.floor(i / g.columns) * (g.photoHeight + g.gap), g.photoWidth, g.photoHeight);
  ctx.rect(m, h - 180, w - m * 2, 150);
  ctx.clip("evenodd");
  ctx.strokeStyle = palette.accent; ctx.fillStyle = palette.accent; ctx.lineWidth = 3;
  if (style === "double" || style === "dashed") {
    if (style === "dashed") ctx.setLineDash([12, 10]);
    ctx.strokeRect(20, 20, w - 40, h - 40);
    if (style === "double") { ctx.lineWidth = 1.5; ctx.strokeRect(32, 32, w - 64, h - 64); }
    for (let i = 0; i < 4; i++) ctx.strokeRect(m - 9 + i % g.columns * (g.photoWidth + g.gap), m - 9 + Math.floor(i / g.columns) * (g.photoHeight + g.gap), g.photoWidth + 18, g.photoHeight + 18);
  } else if (style === "film") {
    ctx.fillStyle = palette.ink;
    ctx.fillRect(10, 0, 42, h); ctx.fillRect(w - 52, 0, 42, h);
    ctx.fillStyle = base;
    for (let y = 18; y < h; y += 58) { ctx.fillRect(21, y, 20, 30); ctx.fillRect(w - 41, y, 20, 30); }
  } else if (style === "gingham") {
    ctx.fillStyle = palette.soft;
    for (let x = 0; x < w; x += 36) ctx.fillRect(x, 0, 18, h);
    for (let y = 0; y < h; y += 36) ctx.fillRect(0, y, w, 18);
    ctx.fillStyle = palette.accent; ctx.globalAlpha = .45;
    for (let x = 0; x < w; x += 36) for (let y = 0; y < h; y += 36) ctx.fillRect(x, y, 18, 18);
  } else if (style === "lace") {
    const bead = (x: number, y: number) => {
      ctx.fillStyle = palette.soft; ctx.beginPath(); ctx.arc(x, y, 22, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = palette.accent; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, 15, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = palette.accent; ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
    };
    for (let y = 24; y < h; y += 42) { bead(26, y); bead(w - 26, y); }
    for (let x = 68; x < w - 50; x += 42) { bead(x, 26); bead(x, h - 26); }
  } else if (style === "airmail") {
    ctx.lineWidth = 13;
    for (let y = -30; y < h + 40; y += 40) {
      ctx.strokeStyle = Math.floor((y + 30) / 40) % 2 ? "#6385af" : "#c97886";
      ctx.beginPath(); ctx.moveTo(12, y); ctx.lineTo(34, y + 25); ctx.moveTo(w - 34, y); ctx.lineTo(w - 12, y + 25); ctx.stroke();
    }
    for (let x = 48; x < w - 48; x += 40) {
      ctx.strokeStyle = Math.floor(x / 40) % 2 ? "#6385af" : "#c97886";
      ctx.beginPath(); ctx.moveTo(x, 12); ctx.lineTo(x + 25, 34); ctx.moveTo(x, h - 34); ctx.lineTo(x + 25, h - 12); ctx.stroke();
    }
    ctx.strokeStyle = palette.accent; ctx.lineWidth = 2; ctx.strokeRect(44, 44, w - 88, h - 88);
  } else if (style === "confetti") {
    let seed = 147;
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    const colors = ["#dc9cb4", "#bea6df", "#d7b65c", "#82b7a4", palette.accent];
    for (let i = 0; i < 750; i++) {
      const x = random() * w, y = random() * h, angle = random() * Math.PI;
      ctx.save(); ctx.translate(x, y); ctx.rotate(angle); ctx.fillStyle = colors[i % colors.length];
      if (i % 3) ctx.fillRect(-3, -7, 6, 14);
      else { ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore();
    }
  } else {
    const motif: Sticker = style === "hearts" ? "hearts" : style === "floral" ? "flowers" : style === "ribbon" ? "bow" : "stars";
    const spacing = style === "ribbon" ? 132 : 96;
    for (let y = 32; y < h; y += spacing) {
      drawSticker(ctx, motif, 30, y, style === "ribbon" ? 20 : 16, -.15);
      drawSticker(ctx, motif, w - 30, y + spacing / 2, style === "ribbon" ? 20 : 16, .15);
    }
    for (let x = 96; x < w - 64; x += spacing) { drawSticker(ctx, motif, x, 30, 15); drawSticker(ctx, motif, x, h - 26, 15); }
    for (let row = 1; row < 4 / g.columns; row++) for (let x = m + 25; x < w - m; x += spacing) {
      drawSticker(ctx, motif, x, m + row * (g.photoHeight + g.gap) - g.gap / 2, 10);
    }
  }
  ctx.restore();
}
