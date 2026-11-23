import { getFramePalette } from "./frames.ts";
import type { Filter } from "./filters.ts";
import { EXTRA_TEMPLATES, getExtraComposition, renderExtraTemplate, type ExtraTemplateId } from "./template-extras.ts";
import { CARTOON_TEMPLATES, getCartoonComposition, renderCartoonTemplate, type CartoonTemplateId } from "./cartoon-templates.ts";
import { CHARACTER_TEMPLATES, getCharacterArtwork, getCharacterComposition, isCharacterTemplate, renderCharacterTemplate, type CharacterTemplateId, type TemplateArtwork } from "./character-templates.ts";

export type TemplateId = "custom" | "coquette" | "scrapbook" | "cherry" | "midnight" | "botanical" | "ocean" | "birthday" | "receipt" | ExtraTemplateId | CartoonTemplateId | CharacterTemplateId;
export type CuratedTemplateId = Exclude<TemplateId, "custom">;
export const TEMPLATE_GROUPS = ["Tất cả", "Cartoon", "Lãng mạn", "Nhật ký", "Đi chơi", "Tiệc vui", "Hoa & trái cây", "Lễ hội"] as const;
export type TemplateGroup = typeof TEMPLATE_GROUPS[number];
export interface PhotoTemplate {
  id: CuratedTemplateId; name: string; subtitle: string; group: Exclude<TemplateGroup, "Tất cả">;
  color: string; ink: string; filter: Filter; strength: number; caption: string;
  isNew?: boolean;
}
export const TEMPLATES: PhotoTemplate[] = [
  { id: "coquette", name: "Nơ hồng", subtitle: "Ruy băng satin · ren ngọc trai", group: "Lãng mạn", color: "#f7e4eb", ink: "#823f58", filter: "cream", strength: .6, caption: "little things, big feelings" },
  { id: "scrapbook", name: "Nhật ký chúng mình", subtitle: "Giấy xé · băng dính · bưu thiếp", group: "Nhật ký", color: "#f4eddf", ink: "#304b69", filter: "film", strength: .65, caption: "a page from our happy days" },
  { id: "cherry", name: "Cherry café", subtitle: "Caro đỏ · cherry · nhãn café", group: "Lãng mạn", color: "#fff1dd", ink: "#a73541", filter: "peach", strength: .5, caption: "you're my cherry on top" },
  { id: "midnight", name: "Sau nửa đêm", subtitle: "Tinh vân · chòm sao · trăng vàng", group: "Đi chơi", color: "#242147", ink: "#f4dfae", filter: "cool", strength: .45, caption: "written in the stars" },
  { id: "botanical", name: "Khu vườn ký ức", subtitle: "Hoa ép · thư tay · dấu sáp", group: "Lãng mạn", color: "#eaf0df", ink: "#405c42", filter: "fade", strength: .3, caption: "let the little moments bloom" },
  { id: "ocean", name: "The summer club", subtitle: "Sóng biển · vỏ sò · nắng cam", group: "Đi chơi", color: "#deedf5", ink: "#275b85", filter: "original", strength: 1, caption: "salty air & happy hearts" },
  { id: "birthday", name: "Make a wish", subtitle: "Bóng bay · ruy băng · ánh kim", group: "Tiệc vui", color: "#263fa3", ink: "#fff0bf", filter: "vivid", strength: .45, caption: "another year of lovely memories" },
  { id: "receipt", name: "Hóa đơn niềm vui", subtitle: "Giấy nhiệt · mã vạch · dấu ngày", group: "Nhật ký", color: "#f3f0e8", ink: "#33312c", filter: "mono", strength: 1, caption: "priceless moments, kept forever" },
  ...CHARACTER_TEMPLATES.map(template => ({ ...template, isNew: true })),
  ...CARTOON_TEMPLATES.map(template => ({ ...template, isNew: true })),
  ...EXTRA_TEMPLATES.map(template => ({ ...template, isNew: true })),
];

function normalizeSearch(value: string) {
  return value.toLocaleLowerCase("vi").normalize("NFD").replace(/\p{M}/gu, "").replaceAll("đ", "d");
}

export function findTemplates(group: TemplateGroup = "Tất cả", query = "") {
  const terms = normalizeSearch(query).match(/[\p{L}\p{N}]+/gu) ?? [];
  const aliases: Partial<Record<CuratedTemplateId, string>> = {
    coquette: "nơ tình yêu love", scrapbook: "sổ tay nhật ký diary", midnight: "ngân hà vũ trụ galaxy",
    passport: "du lịch travel chuyến bay", cinema: "điện ảnh phim movie rạp", cassette: "âm nhạc music băng nhạc retro",
    postage: "bưu điện postcard thư tem", graduation: "tốt nghiệp cử nhân ra trường", wedding: "đám cưới kết hôn wedding",
    christmas: "giáng sinh noel christmas", tet: "tết nguyên đán năm mới new year", sakura: "hoa anh đào mùa xuân cherry blossom",
    "bear-picnic": "hoạt hình cartoon gấu bear kawaii", "kitty-club": "hoạt hình cartoon mèo cat kitty kawaii",
    "bunny-cloud": "hoạt hình cartoon thỏ bunny rabbit mây kawaii", "comic-pop": "hoạt hình cartoon truyện tranh comic pop art",
    "winter-bakery": "hoạt hình cartoon hổ tiệm bánh mùa đông tiger bakery winter", "sky-pals": "hoạt hình cartoon rái cá máy bay otter sky",
    "pink-bunny": "hoạt hình cartoon thỏ tim hồng bunny pink", "balloon-party": "hoạt hình cartoon hội bạn bóng bay balloon turquoise",
  };
  return TEMPLATES.filter(template => {
    if (group !== "Tất cả" && template.group !== group) return false;
    const words = normalizeSearch(`${template.name} ${template.subtitle} ${template.caption} ${template.id} ${template.group} ${aliases[template.id] ?? ""}`).match(/[\p{L}\p{N}]+/gu) ?? [];
    return terms.every(term => words.some(word => word.startsWith(term)));
  })
    .sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
}

export interface TemplateSlot { x: number; y: number; width: number; height: number; radius: number; rotation: number }
export function getTemplateSlots(id: CuratedTemplateId, layout: "strip" | "grid"): TemplateSlot[] {
  const strip = layout === "strip", w = strip ? 600 : 800;
  const original: Partial<Record<CuratedTemplateId, { side: number; top: number; gap: number; radius: number; tilted?: boolean }>> = {
    coquette: { side: 72, top: 100, gap: 32, radius: 20 }, scrapbook: { side: 72, top: 105, gap: 40, radius: 2, tilted: true },
    cherry: { side: 62, top: 100, gap: 25, radius: 2 }, midnight: { side: 58, top: 90, gap: 23, radius: 14 },
    botanical: { side: 74, top: 112, gap: 28, radius: 2 }, ocean: { side: 64, top: 105, gap: 26, radius: 14 },
    birthday: { side: 68, top: 110, gap: 30, radius: 2 }, receipt: { side: 64, top: 140, gap: 14, radius: 2 },
  };
  const cartoon = CARTOON_TEMPLATES.some(template => template.id === id);
  const composition = original[id] ?? (isCharacterTemplate(id) ? getCharacterComposition() : cartoon ? getCartoonComposition(id as CartoonTemplateId) : getExtraComposition(id as ExtraTemplateId));
  const grid = isCharacterTemplate(id) ? getCharacterComposition().grid : undefined;
  const side = strip ? composition.side : grid?.side ?? 64, top = strip ? composition.top : grid?.top ?? 70, gap = strip ? composition.gap : grid?.gap ?? 24;
  const columns = strip ? 1 : 2, width = (w - side * 2 - (columns - 1) * gap) / columns, height = width / 1.6;
  return Array.from({ length: 4 }, (_, i) => ({
    x: (side + i % columns * (width + gap)) * 2, y: (top + Math.floor(i / columns) * (height + gap)) * 2,
    width: width * 2, height: height * 2, radius: composition.radius * 2,
    rotation: composition.tilted ? [-1.7, 1.4, -1.1, 1.6][i] : 0,
  }));
}

const SERIF = "Georgia, 'Times New Roman', serif", SCRIPT = "'Segoe Script', 'Brush Script MT', cursive", MONO = "'Courier New', monospace", SANS = "Arial, sans-serif";
export function escapeSvg(value: string) { return value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[character]!); }
function text(x: number, y: number, value: string, size: number, color: string, font = SANS, attributes = "") {
  const anchor = attributes.includes("text-anchor=") ? "" : 'text-anchor="middle"';
  return `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-family="${font}" ${anchor} ${attributes}>${escapeSvg(value)}</text>`;
}
function star(x: number, y: number, size: number, color: string, rotate = 0) {
  return `<path d="M0 ${-size} Q${size * .15} ${-size * .15} ${size} 0 Q${size * .15} ${size * .15} 0 ${size} Q${-size * .15} ${size * .15} ${-size} 0 Q${-size * .15} ${-size * .15} 0 ${-size}Z" fill="${color}" transform="translate(${x} ${y}) rotate(${rotate})"/>`;
}
function bow(x: number, y: number, scale = 1, rotate = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${rotate}) scale(${scale})" stroke="#a85573" stroke-width="1.3" stroke-linejoin="round">
    <path d="M-4 5C-21 25-14 54-34 81L-12 75 0 91C12 61 7 28 5 7" fill="url(#satin)"/>
    <path d="M5 5C24 21 15 45 41 66L23 66 18 82C-4 54-6 29-5 5" fill="url(#satin)"/>
    <path d="M0 0C-89-79-112 29-57 30-30 31-16 12 0 0Z" fill="url(#satin)"/>
    <path d="M0 0C89-79 112 29 57 30 30 31 16 12 0 0Z" fill="url(#satin)"/>
    <path d="M-75-20Q-47-17-8 0M75-20Q47-17 8 0M-26 65Q-12 30-2 13M28 57Q10 32 3 14" fill="none" stroke="#fce4ed" stroke-width="4"/>
    <rect x="-10" y="-9" width="20" height="24" rx="8" fill="#d393ab"/>
    <path d="M-3-6V11" stroke="#f9d8e6" stroke-width="3"/>
  </g>`;
}
function cherries(x: number, y: number, scale = 1, rotate = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${rotate}) scale(${scale})">
    <path d="M-24 22Q-21-19 12-48Q13-16 33 18" fill="none" stroke="#536a3a" stroke-width="4"/>
    <path d="M12-48Q-23-64-32-37Q-11-22 12-48" fill="#72854c"/><path d="M-29-40L10-48" stroke="#a6b37a" fill="none"/>
    <circle cx="-25" cy="30" r="24" fill="url(#cherry-red)"/><circle cx="31" cy="29" r="24" fill="url(#cherry-red)"/>
    <path d="M-40 23Q-40 11-28 12M16 22Q17 10 29 11" fill="none" stroke="#f3b3a8" stroke-width="5" stroke-linecap="round"/>
    <path d="M-29 51Q-17 55-9 43M24 51Q39 53 48 40" stroke="#8c1d30" stroke-width="2" fill="none"/>
  </g>`;
}
function branch(x: number, y: number, scale = 1, rotate = 0, color = "#6d8553") {
  let leaves = "";
  for (let i = 0; i < 7; i++) {
    const py = -i * 18, px = Math.sin(i * .5) * 13;
    leaves += `<path d="M${px} ${py}q-43-30-26-40q35 4 26 40M${px} ${py - 8}q39-36 32-49q-35 6-32 49" fill="${color}" opacity="${.68 + i * .04}"/><path d="M${px - 2} ${py - 3}l-20-27m24 18 20-30" stroke="#b8c69a" stroke-width="1"/>`;
  }
  return `<g transform="translate(${x} ${y}) rotate(${rotate}) scale(${scale})"><path d="M0 14Q22-60 2-172" fill="none" stroke="${color}" stroke-width="2"/>${leaves}</g>`;
}
function flower(x: number, y: number, size = 12, color = "#e6c5ca") {
  return `<g transform="translate(${x} ${y})">${Array.from({ length: 6 }, (_, i) => `<ellipse cx="0" cy="${-size * .65}" rx="${size * .45}" ry="${size * .8}" fill="${color}" stroke="#b59192" stroke-width=".7" transform="rotate(${i * 60})"/>`).join("")}<circle r="${size * .28}" fill="#c5a054"/><circle r="${size * .1}" fill="#f8edb5"/></g>`;
}
function shell(x: number, y: number, scale = 1, rotate = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${rotate}) scale(${scale})"><path d="M0 29C-88 11-53-57-32-27-24-76 7-72 13-35 37-62 75-14 27 22L13 37Z" fill="#f8d4bf" stroke="#c78e7e" stroke-width="2"/><path d="M5 28-32-27M6 29 0-51M9 29 13-35M12 28 43-20M-8 25-48-8" fill="none" stroke="#d7a08d" stroke-width="1.5"/><path d="M-12 26Q2 16 18 28L13 37Z" fill="#edb69d"/></g>`;
}

interface SceneOptions { color?: string; caption?: string; date?: string; showDate?: boolean; artworkData?: Record<string, string> }
export function getTemplateScene(id: CuratedTemplateId, layout: "strip" | "grid", options: SceneOptions = {}) {
  const template = TEMPLATES.find(item => item.id === id)!;
  if (!template) throw new Error("Mẫu khung không tồn tại.");
  const strip = layout === "strip", w = strip ? 600 : 800, h = strip ? 1522 : 603;
  const base = options.color && /^#[\da-f]{6}$/i.test(options.color) ? options.color : template.color;
  const ink = base === template.color ? template.ink : getFramePalette(base).ink;
  const slots = getTemplateSlots(id, layout);
  const defs = `<defs>
    <linearGradient id="satin" x2="0" y2="1"><stop stop-color="#bd6a8c"/><stop offset=".3" stop-color="#f5d5e3"/><stop offset=".55" stop-color="#d99eb7"/><stop offset=".8" stop-color="#fbe5ee"/><stop offset="1" stop-color="#b96989"/></linearGradient>
    <radialGradient id="cherry-red" cx=".3" cy=".25"><stop stop-color="#e16c6a"/><stop offset=".5" stop-color="#be3a49"/><stop offset="1" stop-color="#8d2038"/></radialGradient>
    <linearGradient id="night" x2=".8" y2="1"><stop stop-color="${base}"/><stop offset=".48" stop-color="#534274"/><stop offset="1" stop-color="${base}"/></linearGradient>
    <radialGradient id="nebula"><stop stop-color="#b491c5" stop-opacity=".55"/><stop offset="1" stop-color="#7a6bb6" stop-opacity="0"/></radialGradient>
    <linearGradient id="ocean" x2=".5" y2="1"><stop stop-color="${base}"/><stop offset="1" stop-color="#8fb8d1"/></linearGradient>
    <radialGradient id="balloon" cx=".3" cy=".25"><stop stop-color="#ffdfc6"/><stop offset=".35" stop-color="#e8aa99"/><stop offset="1" stop-color="#bd6d91"/></radialGradient>
    <pattern id="graph" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="${ink}" stroke-opacity=".09" stroke-width=".8"/></pattern>
    <pattern id="gingham" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="20" height="40" fill="#c95761" opacity=".15"/><rect width="40" height="20" fill="#c95761" opacity=".15"/><rect width="20" height="20" fill="#c95761" opacity=".2"/></pattern>
    <pattern id="stripes" width="22" height="22" patternUnits="userSpaceOnUse"><rect width="9" height="22" fill="#d49bad" opacity=".18"/></pattern>
    <filter id="paper-shadow" x="-15%" y="-15%" width="130%" height="140%"><feDropShadow dx="1" dy="3" stdDeviation="3" flood-color="#4d3c35" flood-opacity=".17"/></filter>
  </defs>`;
  let background = `<rect width="${w}" height="${h}" fill="${base}"/>`, overlay = "";
  const cx = w / 2;
  let footerY = h - (id === "receipt" && !strip ? 62 : strip ? 83 : 49), footerX = cx, footerWidth = w - 160;
  const caption = options.caption?.trim() || template.caption;
  let footerFont = SCRIPT, footerInk = ink;
  const artwork: TemplateArtwork[] = isCharacterTemplate(id) ? getCharacterArtwork(id, layout) : [];

  if (id === "coquette") {
    background += `<rect width="${w}" height="${h}" fill="url(#stripes)"/><rect x="32" y="17" width="${w - 64}" height="${h - 34}" rx="${(w - 64) / 2}" fill="#fff9f8" fill-opacity=".46" stroke="#b36e89" stroke-width="1"/>`;
    for (let y = 20; y < h - 10; y += 13) background += `<circle cx="25" cy="${y}" r="3.8" fill="#fff9f1" stroke="#d7bcbd" stroke-width=".7"/><circle cx="${w - 25}" cy="${y}" r="3.8" fill="#fff9f1" stroke="#d7bcbd" stroke-width=".7"/>`;
    overlay += bow(strip ? cx : w - 56, strip ? 24 : 23, strip ? .55 : .4, strip ? 0 : 14);
    overlay += text(strip ? cx : cx - 25, strip ? 80 : 43, "tied with love", strip ? 31 : 29, ink, SCRIPT);
    overlay += bow(54, h - 135, .63, -21) + bow(w - 48, strip ? 650 : h - 122, .43, 22);
    overlay += `<path d="M30 116Q63 170 34 235T43 360M${w - 28} ${h - 330}q-45 60-10 118t-3 105" stroke="#c3869e" stroke-width="2" fill="none"/>`;
    overlay += star(w - 45, 135, 12, "#c09a54") + star(40, h - 310, 9, "#c09a54");
  } else if (id === "scrapbook") {
    background += `<rect width="${w}" height="${h}" fill="url(#graph)"/><path d="M18 5 39 12 61 4 88 11 114 4 142 12 172 4 204 10 238 4 269 11 302 5 338 12 373 4 408 11 446 4 480 10 518 4 550 11 588 4V${h - 6}H18Z" fill="#fffcf5" opacity=".5"/>`;
    overlay += text(cx - 30, strip ? 57 : 42, "dear diary,", strip ? 41 : 35, ink, SCRIPT, 'transform="rotate(-3 ' + (cx - 30) + ' 45)"');
    overlay += text(cx + 42, strip ? 82 : 59, "TODAY WAS A GOOD DAY", 9, "#ac684b", MONO, 'letter-spacing="3"');
    overlay += `<g transform="translate(${w - 58} ${h - 116}) rotate(12)"><rect x="-33" y="-45" width="66" height="83" fill="#ead9b6" stroke="#a77854" stroke-width="2" stroke-dasharray="3 3"/><rect x="-25" y="-37" width="50" height="67" fill="#718875"/><path d="M-20 20 0-24 21 20Z" fill="#e4d8ad"/>${text(0, 9, "POST", 10, "#304b69", MONO)}</g>`;
    overlay += `<g transform="translate(48 ${h - 98}) rotate(-14)"><rect x="-25" y="-16" width="116" height="36" fill="#df9b63"/>${text(34, 6, "KEEP THIS", 12, "#fff7e9", MONO, 'letter-spacing="2"')}</g>`;
    overlay += `<path d="M105 ${h - 46}q72 21 142 2m-4-5 10 4-8 7" fill="none" stroke="#a46b4c" stroke-width="2"/>`;
  } else if (id === "cherry") {
    background += `<rect width="${w}" height="${h}" fill="url(#gingham)"/><rect x="41" y="15" width="${w - 82}" height="${h - 30}" rx="22" fill="${base}" stroke="#b45156" stroke-width="1.5"/>`;
    overlay += `<g fill="none" stroke="${ink}" stroke-width="1"><path d="M${cx - 125} 15H${cx + 125}V${strip ? 78 : 55}H${cx - 125}Z"/><path d="M${cx - 120} 20H${cx + 120}V${strip ? 73 : 50}H${cx - 120}Z"/></g>`;
    overlay += text(cx, strip ? 45 : 36, "CHERRY CLUB", strip ? 27 : 23, ink, SERIF, 'font-weight="700" letter-spacing="2"');
    if (strip) overlay += text(cx, 64, "SWEET MOMENTS, FRESHLY MADE", 8, ink, MONO, 'letter-spacing="2"');
    overlay += cherries(61, h - 108, .83, -16) + cherries(w - 41, strip ? 774 : h - 109, .48, 17);
    overlay += `<path d="M99 ${h - 119}q25-18 50 0t50 0m${w - 350} 0q25-18 50 0t50 0" fill="none" stroke="#b45156" stroke-width="1.5"/>`;
    footerFont = SERIF;
  } else if (id === "midnight") {
    background = `<rect width="${w}" height="${h}" fill="url(#night)"/><ellipse cx="${w * .85}" cy="${h * .24}" rx="${w * .8}" ry="${h * .5}" fill="url(#nebula)"/><ellipse cx="0" cy="${h * .78}" rx="${w * .9}" ry="${h * .4}" fill="url(#nebula)"/>`;
    for (let i = 0; i < 110; i++) {
      const x = (i * 137.51 + 17) % w, y = (i * 183.73 + 31) % h;
      background += i % 13 === 0 ? star(x, y, 6 + i % 7, "#e5c992", 20) : `<circle cx="${x}" cy="${y}" r="${i % 3 === 0 ? 1.4 : .7}" fill="#f6e7c4" opacity="${.25 + (i % 5) * .14}"/>`;
    }
    background += `<path d="M30 83 52 174 27 253 54 329M${w - 35} ${h - 340}l-21 67 15 73-26 91" stroke="#e8ce94" stroke-width=".6" fill="none"/>`;
    overlay += text(cx, strip ? 57 : 38, "after hours", strip ? 38 : 34, ink, SERIF, 'font-style="italic"');
    overlay += text(cx, strip ? 76 : 55, "OUR LITTLE UNIVERSE", 8, ink, SANS, 'letter-spacing="4"');
    overlay += `<g transform="translate(65 ${h - 105}) rotate(-25)"><path d="M20-41C-47-53-62 51 10 46 34 45 49 29 45 16 3 37-18-18 20-41Z" fill="#e5c992"/><path d="M-29-25Q-61 2-29 37" fill="none" stroke="#f8e7b5" stroke-width="1"/></g>`;
    overlay += star(w - 55, h - 93, 23, "#e5c992", 20) + star(w - 77, h - 127, 8, "#e5c992");
    footerFont = SERIF;
  } else if (id === "botanical") {
    background += `<rect width="${w}" height="${h}" fill="url(#graph)"/><rect x="23" y="18" width="${w - 46}" height="${h - 36}" rx="${strip ? 150 : 100}" fill="#fffdf0" fill-opacity=".28" stroke="#99a783" stroke-width="1"/>`;
    overlay += branch(39, strip ? 250 : 215, .78, -15) + branch(w - 31, h - 90, .83, 13) + branch(73, h - 28, .55, -37);
    overlay += flower(43, strip ? 125 : 96, 20) + flower(w - 48, h - 148, 25, "#f3e8bd") + flower(w - 25, h - 104, 15, "#e3c5b8");
    overlay += text(cx, strip ? 48 : 31, "THE MEMORY GARDEN", 9, ink, SERIF, 'letter-spacing="3"');
    overlay += text(cx, strip ? 82 : 54, "in full bloom", strip ? 35 : 29, ink, SERIF, 'font-style="italic"');
    overlay += `<g transform="translate(57 ${h - 93}) rotate(-15)"><path d="M-18 20-31 61-5 52 12 64 17 19Z" fill="#b7c19c"/><circle r="29" fill="#6e8055" stroke="#b4bb85" stroke-width="3"/><circle r="22" fill="none" stroke="#c1c99d" stroke-width="1"/><path d="M0 14V-15M0 3q-17-1-14-12 15 0 14 12m0-6q17-1 14-12-15 0-14 12" fill="none" stroke="#dae0b5" stroke-width="2"/></g>`;
    footerFont = SERIF;
  } else if (id === "ocean") {
    background = `<rect width="${w}" height="${h}" fill="url(#ocean)"/>`;
    for (let i = 0; i < 10; i++) background += `<path d="M-20 ${h - 65 - i * 13}Q${w * .2} ${h - 142 - i * 10} ${w * .47} ${h - 69 - i * 12}T${w + 20} ${h - 80 - i * 12}" stroke="${i % 2 ? "#fffaf0" : "#558dab"}" stroke-opacity=".35" fill="none" stroke-width="${i % 3 ? 1 : 3}"/>`;
    background += `<path d="M0 ${h - 30}Q100 ${h - 82} 240 ${h - 35}T${w} ${h - 44}V${h}H0Z" fill="#ead7b4" opacity=".85"/>`;
    overlay += text(cx, strip ? 46 : 28, "THE SUMMER CLUB", 9, ink, SANS, 'letter-spacing="4"');
    overlay += text(cx, strip ? 80 : 54, "meet me by the sea", strip ? 31 : 28, ink, SERIF, 'font-style="italic"');
    overlay += shell(58, h - 109, .73, -18) + shell(w - 43, strip ? 700 : h - 100, .5, 22);
    overlay += `<g transform="translate(${w - 45} 33)"><circle r="21" fill="#e5a46b"/>${Array.from({ length: 12 }, (_, i) => `<path d="M0-27V-34" stroke="#c98c57" stroke-width="1.4" transform="rotate(${i * 30})"/>`).join("")}</g>`;
    overlay += `<path d="M28 ${h - 230}v109m0-48-15-19m15 0 18-23m-18 3-12-17m12 52 15-12" fill="none" stroke="#bc8a78" stroke-width="4" stroke-linecap="round"/>`;
    footerFont = SERIF;
  } else if (id === "birthday") {
    background += `<path d="M0 0H${w}V${h}Q${w * .7} ${h * .68} 0 ${h * .55}Z" fill="#7063b7" opacity=".3"/>`;
    for (let i = 0; i < 120; i++) {
      const x = (i * 113.7 + 19) % w, y = (i * 173.3) % h;
      background += `<path d="M${x} ${y}l${i % 2 ? 4 : -4} 9" stroke="${["#f2c865", "#e6a6b6", "#8dbdd3"][i % 3]}" stroke-width="${i % 3 + 1}"/>`;
    }
    overlay += text(cx, strip ? 45 : 30, "MAKE A WISH", strip ? 29 : 26, ink, SERIF, 'font-weight="700" letter-spacing="2"');
    overlay += text(cx, strip ? 69 : 51, "a little party, a lot of memories", 12, ink, SCRIPT);
    overlay += `<g transform="translate(43 ${h - 135}) rotate(-14)"><path d="M0 30Q-20 62 1 95T-5 145" fill="none" stroke="#f0dbaa"/><ellipse cy="-6" rx="31" ry="42" fill="url(#balloon)"/><path d="M-13-34Q-28-20-22-6" fill="none" stroke="#ffe9d5" stroke-width="4"/><path d="M-5 35 0 29 5 35Z" fill="#bd6d91"/></g>`;
    overlay += `<g transform="translate(${w - 35} ${strip ? 390 : h - 132}) rotate(13)"><path d="M0 30Q-20 75 3 110" stroke="#eddba6" fill="none"/><ellipse rx="26" ry="35" fill="#e8c16b"/><path d="M-9-26Q-23-14-18-4" stroke="#fff0bd" fill="none" stroke-width="4"/></g>`;
    overlay += star(w - 53, h - 57, 24, "#f2c865", 12) + star(48, 58, 15, "#f2c865", 18);
    footerFont = SERIF;
  } else if (id === "receipt") {
    background += `<path d="M20 12H${w - 20}V${h - 12}H20Z" fill="#fffdf7"/><path d="${Array.from({ length: Math.ceil((w - 40) / 12) }, (_, i) => `${i ? "L" : "M"}${20 + i * 12} 12l6 8 6-8`).join("")}" fill="${base}"/>`;
    overlay += text(cx, strip ? 39 : 26, "MỘT CHÚT. PHOTO STORE", 10, ink, MONO, 'letter-spacing="2"');
    overlay += text(cx, strip ? 75 : 49, "GOOD TIMES", strip ? 34 : 28, ink, MONO, 'font-weight="700"');
    if (strip) overlay += text(cx, 99, "QTY: 04   /   PRICE: PRICELESS", 10, ink, MONO);
    overlay += `<path d="M48 ${strip ? 117 : 60}H${w - 48}M48 ${h - (strip ? 131 : 101)}H${w - 48}" stroke="${ink}" stroke-width="1" stroke-dasharray="5 4"/>`;
    for (let i = 0; i < 80; i++) overlay += `<rect x="${cx - 116 + i * 3}" y="${h - (strip ? 40 : 25)}" width="${i % 3 ? 1 : 2.5}" height="${i % 5 ? 17 : 22}" fill="${ink}"/>`;
    overlay += text(cx, h - (strip ? 110 : 88), "TOTAL: ONE VERY HAPPY DAY", 11, ink, MONO, 'font-weight="700"');
    footerFont = MONO;
  } else if (isCharacterTemplate(id)) {
    const art = renderCharacterTemplate(id, { w, h, base, ink, strip });
    background += art.background; overlay += art.overlay; footerFont = art.footerFont;
    footerX = art.footer.x; footerY = art.footer.y; footerWidth = art.footer.width;
    footerInk = art.footerInk;
  } else {
    const artwork = CARTOON_TEMPLATES.some(template => template.id === id)
      ? renderCartoonTemplate(id as CartoonTemplateId, { w, h, base, ink, strip })
      : renderExtraTemplate(id as ExtraTemplateId, { w, h, base, ink, strip });
    background += artwork.background; overlay += artwork.overlay; footerFont = artwork.footerFont;
  }

  let mats = "", placeholder = "", accents = "";
  slots.forEach((slot, i) => {
    const x = slot.x / 2, y = slot.y / 2, sw = slot.width / 2, sh = slot.height / 2;
    const rotate = `rotate(${slot.rotation} ${x + sw / 2} ${y + sh / 2})`;
    if (template.group === "Cartoon") accents += `<rect x="${x - 4}" y="${y - 4}" width="${sw + 8}" height="${sh + 8}" rx="${slot.radius / 2 + 3}" fill="none" stroke="${ink}" stroke-width="${id === "comic-pop" ? 3 : 1.6}" transform="${rotate}"/>`;
    const paper = id === "scrapbook" || id === "postage";
    const pad = paper ? 9 : 5;
    mats += `<g transform="${rotate}"><rect x="${x - pad}" y="${y - pad}" width="${sw + pad * 2}" height="${sh + pad * 2 + (paper ? 10 : 0)}" rx="${slot.radius / 2 + 2}" fill="${["midnight", "birthday", "cinema", "graduation", "christmas", "tet"].includes(id) ? "#d6bd87" : "#fffdf8"}" ${paper ? 'filter="url(#paper-shadow)"' : `stroke="${ink}" stroke-opacity=".3" stroke-width=".7"`}/></g>`;
    if (id === "coquette") accents += `<rect x="${x - 5}" y="${y - 5}" width="${sw + 10}" height="${sh + 10}" rx="24" fill="none" stroke="#d2a3b0" stroke-width="3" stroke-dasharray="1 7" stroke-linecap="round"/>`;
    if (id === "scrapbook") accents += `<g transform="rotate(${i % 2 ? 19 : -18} ${x + sw / 2} ${y})"><path d="M${x + sw / 2 - 38} ${y - 12}l9-2 6 2 8-2 8 2 8-2 8 2 9-2 9 2 8-1v23l-9 2-7-2-9 2-8-2-7 2-8-2-7 2-8-2-8 2Z" fill="${i % 2 ? "#cdad88" : "#a8b9b4"}" opacity=".83"/></g>${text(x + sw - 15, y + sh + 15, `our day / 0${i + 1}`, 7, ink, MONO, `transform="${rotate}" text-anchor="end"`)}`;
    if (id === "receipt") accents += text(x - 15, y + 12, `0${i + 1}`, 8, ink, MONO, 'transform="rotate(-90 ' + (x - 15) + ' ' + (y + 12) + ')"');
    const photoColors = ["#c8c0ba", "#afc2c5", "#d6bdad", "#b9bbc8"];
    // Intentional demo artwork; replaced with the visitor's actual photos in the gallery.
    placeholder += `<g transform="${rotate}"><rect x="${x}" y="${y}" width="${sw}" height="${sh}" rx="${slot.radius / 2}" fill="${photoColors[i]}"/><path d="M${x} ${y + sh}q${sw / 2} ${-sh * .65} ${sw} 0" fill="#ffffff" opacity=".25"/><circle cx="${x + sw * .4}" cy="${y + sh * .38}" r="${sh * .13}" fill="#f6e9de"/><circle cx="${x + sw * .62}" cy="${y + sh * .4}" r="${sh * .12}" fill="#f6e9de"/><path d="M${x + sw * .24} ${y + sh * .77}q${sw * .16} ${-sh * .6} ${sw * .32} 0M${x + sw * .48} ${y + sh * .8}q${sw * .14} ${-sh * .57} ${sw * .3} 0" fill="${ink}" opacity=".35"/>${text(x + sw / 2, y + sh - 18, "YOUR HAPPY MOMENT", 8, "#ffffff", MONO, 'letter-spacing="2"')}</g>`;
  });
  background += mats;
  overlay = accents + overlay;
  const dateLine = options.showDate === false ? "MỘT CHÚT. / PHOTO CLUB" : `${options.date || "YOUR SPECIAL DAY"}  ·  MỘT CHÚT.`;
  const captionSize = Math.min(strip ? 23 : 22, footerWidth / Math.max(1, Array.from(caption).length * .62));
  overlay += text(footerX, footerY, caption, captionSize, footerInk, footerFont, id === "cherry" || id === "botanical" || id === "ocean" ? 'font-style="italic"' : "");
  overlay += text(footerX, footerY + 25, dateLine, strip ? 8 : 8.5, footerInk, id === "receipt" ? MONO : SANS, 'letter-spacing="1.5"');
  const root = (body: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w * 2}" height="${h * 2}" viewBox="0 0 ${w} ${h}">${defs}${body}</svg>`;
  const embedded = artwork.map(asset => options.artworkData?.[asset.source] ? `<image href="${escapeSvg(options.artworkData[asset.source])}" x="${asset.x / 2}" y="${asset.y / 2}" width="${asset.width / 2}" height="${asset.height / 2}" preserveAspectRatio="xMidYMid meet"/>` : "").join("");
  return { width: w * 2, height: h * 2, slots, artwork, background: root(background), previewBase: root(background + placeholder), overlay: root(overlay), preview: root(background + placeholder + embedded + overlay) };
}

export function svgDataUrl(svg: string) { return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`; }
