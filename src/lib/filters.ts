export type Filter = "original" | "mono" | "film" | "warm" | "cream" | "rose" | "peach" | "mint" | "cool" | "fade" | "sepia" | "retro" | "vivid" | "sunset" | "noir" | "dreamy";
export const FILTER_GROUPS = ["Tất cả", "Nhẹ nhàng", "Hoài cổ", "Nổi bật", "Đơn sắc"] as const;
export type FilterGroup = typeof FILTER_GROUPS[number];

// The same sRGB matrix drives SVG previews and exported pixels, including intensity.
const IDENTITY = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];
function compose(...matrices: number[][]): number[] {
  return matrices.reduce((before, after) => after.map((_, index) => {
    const row = Math.floor(index / 5), col = index % 5;
    let value = col === 4 ? after[row * 5 + 4] : 0;
    for (let k = 0; k < 4; k++) value += after[row * 5 + k] * before[k * 5 + col];
    return value;
  }), IDENTITY);
}
function brightness(value: number) {
  return [value, 0, 0, 0, 0, 0, value, 0, 0, 0, 0, 0, value, 0, 0, 0, 0, 0, 1, 0];
}
function contrast(value: number) {
  const offset = (1 - value) / 2;
  return [value, 0, 0, 0, offset, 0, value, 0, 0, offset, 0, 0, value, 0, offset, 0, 0, 0, 1, 0];
}
function saturation(value: number) {
  const r = .2126 * (1 - value), g = .7152 * (1 - value), b = .0722 * (1 - value);
  return [r + value, g, b, 0, 0, r, g + value, b, 0, 0, r, g, b + value, 0, 0, 0, 0, 0, 1, 0];
}
function sepia(value: number) {
  const full = [.393, .769, .189, 0, 0, .349, .686, .168, 0, 0, .272, .534, .131, 0, 0, 0, 0, 0, 1, 0];
  return IDENTITY.map((base, i) => base + (full[i] - base) * value);
}
function tint(r: number, g: number, b: number, lift = 0) {
  return [r, 0, 0, 0, lift, 0, g, 0, 0, lift, 0, 0, b, 0, lift, 0, 0, 0, 1, 0];
}

export const FILTERS: { id: Filter; name: string; group: Exclude<FilterGroup, "Tất cả">; matrix: number[] }[] = [
  { id: "original", name: "Tự nhiên", group: "Nhẹ nhàng", matrix: IDENTITY },
  { id: "cream", name: "Kem sữa", group: "Nhẹ nhàng", matrix: compose(saturation(.78), contrast(.87), tint(1.04, 1.01, .95, .025)) },
  { id: "rose", name: "Hồng mơ", group: "Nhẹ nhàng", matrix: compose(saturation(.87), contrast(.93), tint(1.08, .96, 1.02, .015)) },
  { id: "peach", name: "Đào ngọt", group: "Nhẹ nhàng", matrix: compose(sepia(.12), saturation(1.07), tint(1.06, 1, .94, .012)) },
  { id: "mint", name: "Bạc hà", group: "Nhẹ nhàng", matrix: compose(saturation(.78), contrast(.94), tint(.93, 1.04, 1.02, .018)) },
  { id: "dreamy", name: "Mộng mơ", group: "Nhẹ nhàng", matrix: compose(saturation(.65), contrast(.78), tint(1.03, .99, 1.08, .025)) },
  { id: "film", name: "Film", group: "Hoài cổ", matrix: compose(sepia(.35), saturation(.8), contrast(.95)) },
  { id: "fade", name: "Phai màu", group: "Hoài cổ", matrix: compose(saturation(.6), contrast(.72), tint(1.02, 1, .96)) },
  { id: "sepia", name: "Nâu xưa", group: "Hoài cổ", matrix: compose(sepia(1), contrast(.94), brightness(.96)) },
  { id: "retro", name: "Retro 90s", group: "Hoài cổ", matrix: compose(sepia(.22), saturation(.72), contrast(1.12), tint(1.05, 1.02, .89)) },
  { id: "warm", name: "Nắng ấm", group: "Nổi bật", matrix: compose(sepia(.2), saturation(1.3), brightness(1.05)) },
  { id: "cool", name: "Trong veo", group: "Nổi bật", matrix: compose(saturation(1.08), contrast(1.05), tint(.94, 1.02, 1.1)) },
  { id: "vivid", name: "Rực rỡ", group: "Nổi bật", matrix: compose(saturation(1.55), contrast(1.12), brightness(1.03)) },
  { id: "sunset", name: "Hoàng hôn", group: "Nổi bật", matrix: compose(sepia(.2), saturation(1.18), tint(1.16, .99, .87, .005)) },
  { id: "mono", name: "Đen trắng", group: "Đơn sắc", matrix: saturation(0) },
  { id: "noir", name: "Noir", group: "Đơn sắc", matrix: compose(saturation(0), contrast(1.48), brightness(.95)) },
];

export function getFilterMatrix(filter: Filter, strength = 1): number[] {
  const amount = Number.isFinite(strength) ? Math.max(0, Math.min(1, strength)) : 1;
  const preset = FILTERS.find(item => item.id === filter)?.matrix ?? IDENTITY;
  return IDENTITY.map((base, i) => base + (preset[i] - base) * amount);
}

export function applyFilterPixels(pixels: Uint8ClampedArray, filter: Filter, strength = 1) {
  if (filter === "original" || strength === 0) return;
  const m = getFilterMatrix(filter, strength);
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
    pixels[i] = r * m[0] + g * m[1] + b * m[2] + m[4] * 255;
    pixels[i + 1] = r * m[5] + g * m[6] + b * m[7] + m[9] * 255;
    pixels[i + 2] = r * m[10] + g * m[11] + b * m[12] + m[14] * 255;
  }
}
