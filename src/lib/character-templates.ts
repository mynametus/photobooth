import type { Filter } from "./filters.ts";

export type CharacterTemplateId = "winter-bakery" | "sky-pals" | "pink-bunny" | "balloon-party";
export const CHARACTER_TEMPLATES: { id: CharacterTemplateId; name: string; subtitle: string; group: "Cartoon"; color: string; ink: string; filter: Filter; strength: number; caption: string }[] = [
  { id: "winter-bakery", name: "Tiệm bánh mùa đông", subtitle: "Hổ con · quầy bánh · mái hiên tuyết", group: "Cartoon", color: "#243e65", ink: "#fff3dc", filter: "warm", strength: .25, caption: "warm treats, warmer memories" },
  { id: "sky-pals", name: "Biệt đội bay giữa mây", subtitle: "Rái cá phi công · mây trắng · trời xanh", group: "Cartoon", color: "#65aaef", ink: "#223d66", filter: "original", strength: 1, caption: "little trips, big happy hearts" },
  { id: "pink-bunny", name: "Thỏ ôm tim", subtitle: "Thỏ trắng · tim đỏ · hồng tím nổi bật", group: "Cartoon", color: "#f0a4c2", ink: "#fff6fc", filter: "rose", strength: .2, caption: "a little love in every photo" },
  { id: "balloon-party", name: "Hội bạn bóng bay", subtitle: "Thú bông · bóng tim · nền turquoise", group: "Cartoon", color: "#70cbd0", ink: "#254e62", filter: "cream", strength: .2, caption: "up, up & together" },
];
export interface TemplateArtwork { source: string; x: number; y: number; width: number; height: number }
export function isCharacterTemplate(id: string): id is CharacterTemplateId { return CHARACTER_TEMPLATES.some(template => template.id === id); }
export function getCharacterComposition() {
  return { side: 105, top: 168, gap: 26, radius: 12, tilted: false, grid: { side: 90, top: 108, gap: 24 } };
}
export function getCharacterArtwork(id: CharacterTemplateId, layout: "strip" | "grid"): TemplateArtwork[] {
  return [{ source: `/frames/characters/${id}.png`, x: layout === "strip" ? 150 : 12, y: layout === "strip" ? 2460 : 1014, width: layout === "strip" ? 900 : 430, height: layout === "strip" ? 460 : 180 }];
}
function title(x: number, y: number, value: string, color: string, size: number, stroke = "#233d63") {
  return `<text x="${x}" y="${y}" text-anchor="middle" font-family="'Trebuchet MS',Arial,sans-serif" font-size="${size}" font-weight="900" fill="${color}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round" paint-order="stroke fill">${value}</text>`;
}
function cloud(x: number, y: number, scale: number) {
  return `<path d="M-50 18C-76-4-47-32-29-20-23-61 25-58 34-27 69-44 89 2 57 19Z" fill="#fffdf8" stroke="#d7e4ee" stroke-width="1.2" transform="translate(${x} ${y}) scale(${scale})"/>`;
}
interface ArtOptions { w: number; h: number; base: string; ink: string; strip: boolean }
export function renderCharacterTemplate(id: CharacterTemplateId, { w, h, ink, strip }: ArtOptions) {
  let background = "", overlay = "";
  const cx = w / 2;
  if (id === "winter-bakery") {
    for (let x = 0; x < w; x += 48) background += `<path d="M${x} 0h48v42q-24 20-48 0Z" fill="${Math.round(x / 48) % 2 ? "#f6e8cf" : "#ca725d"}" stroke="#273d5f" stroke-width="1.5"/>`;
    for (let x = 12; x < w; x += 44) background += `<path d="M${x} 50q22 25 44 0" stroke="#e5c482" stroke-width="1" fill="none"/><ellipse cx="${x + 22}" cy="66" rx="3.5" ry="5" fill="#f2ce71"/>`;
    for (let i = 0; i < 70; i++) background += `<circle cx="${(i * 127 + 19) % w}" cy="${(i * 173 + 93) % h}" r="${i % 5 ? 1.2 : 2.5}" fill="#ffedcc" opacity=".7"/>`;
    background += `<path d="M0 ${h - 12}q80-7 160 0t160 0t160 0t160 0V${h}H0Z" fill="#fff5e3"/>`;
    overlay += title(cx, strip ? 116 : 78, "COZY BAKERY", ink, strip ? 43 : 33);
    overlay += `<text x="${cx}" y="${strip ? 140 : 97}" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" fill="${ink}" letter-spacing="3">SWEET LITTLE WINTER DAYS</text>`;
  } else if (id === "sky-pals") {
    for (let y = 155; y < h - 140; y += 205) background += cloud(24, y, .85) + cloud(w - 18, y + 90, .65);
    background += `<path d="M22 275q48 20 24 70t7 66M${w - 28} ${h - 400}q-42 20-22 66t-13 70" stroke="#e5f2f8" stroke-dasharray="5 5" stroke-width="2" fill="none"/>`;
    overlay += title(cx, strip ? 89 : 63, "FLY WITH US!", "#fffdf4", strip ? 45 : 37);
    overlay += `<text x="${cx}" y="${strip ? 115 : 84}" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" font-weight="700" fill="${ink}" letter-spacing="2.5">OUR HAPPY LITTLE SKY CLUB</text>`;
    background += cloud(w - 50, h - 24, .9) + cloud(50, h - 8, 1.2);
  } else if (id === "pink-bunny") {
    background += `<defs><pattern id="big-hearts" width="115" height="105" patternUnits="userSpaceOnUse"><path d="M58 82C-10 39 17-13 58 20 99-13 126 39 58 82Z" fill="none" stroke="#d970a1" stroke-width="2" opacity=".26"/></pattern></defs><rect width="${w}" height="${h}" fill="url(#big-hearts)"/><rect y="${h - (strip ? 253 : 91)}" width="${w}" height="${strip ? 253 : 91}" fill="#6862a7"/>`;
    overlay += title(cx, strip ? 86 : 60, "LOVE BUNNY", ink, strip ? 46 : 36, "#555085");
    overlay += `<text x="${cx}" y="${strip ? 114 : 82}" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" font-weight="700" fill="#665078" letter-spacing="3">HOLD ON TO THE HAPPY THINGS</text>`;
    overlay += `<path d="M23 190q17-23 28 0 11-23 28 0-4 19-28 31-24-12-28-31M${w - 50} ${h - 350}q12-18 21 0 9-18 21 0-3 14-21 23-18-9-21-23" fill="#ffe2e9" stroke="#ba6592" stroke-width="1.5"/>`;
  } else {
    for (let i = 0; i < 70; i++) {
      const x = (i * 139 + 21) % w, y = (i * 199 + 70) % h;
      background += `<path d="M${x} ${y}l3 7" stroke="${["#fff6df", "#efabc2", "#f5d78b"][i % 3]}" stroke-width="2.5" stroke-linecap="round"/>`;
    }
    background += cloud(20, 232, .55) + cloud(w - 10, h - 333, .6);
    overlay += title(cx, strip ? 87 : 61, "HAPPY FLOAT CLUB", "#fff7ed", strip ? 34 : 32, "#397988");
    overlay += `<text x="${cx}" y="${strip ? 116 : 83}" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" font-weight="700" fill="${ink}" letter-spacing="2">A LITTLE PARTY WITH OUR FAVORITE PALS</text>`;
  }
  return { background, overlay, footerFont: "'Trebuchet MS',Arial,sans-serif", footerInk: id === "pink-bunny" ? "#fff6fc" : ink, footer: { x: strip ? cx : 538, width: strip ? 480 : 460, y: h - (strip ? 37 : 50) } };
}
