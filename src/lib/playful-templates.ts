import type { Filter } from "./filters.ts";
import type { TemplateArtwork } from "./character-templates.ts";

export type PlayfulTemplateId = "carnival-pals" | "safari-family" | "dino-valley" | "mermaid-lagoon" | "wizard-owls" | "space-puppies" | "family-foxes" | "pirate-cove" | "family-album" | "family-plaid" | "baby-cloud" | "school-days" | "pastel-film" | "oval-bloom" | "pixel-crush" | "ribbon-diary";
interface PlayfulTemplate { id: PlayfulTemplateId; name: string; subtitle: string; group: "Gia đình" | "Trẻ em" | "Dễ thương"; color: string; ink: string; filter: Filter; strength: number; caption: string }
export const PLAYFUL_TEMPLATES: PlayfulTemplate[] = [
  { id: "carnival-pals", name: "Ngày hội sắc màu", subtitle: "Rạp xiếc · thú bông · vé hội chợ", group: "Trẻ em", color: "#f7dec9", ink: "#934858", filter: "warm", strength: .2, caption: "step right up to a happy day" },
  { id: "safari-family", name: "Safari nhí", subtitle: "Sư tử · hươu cao cổ · xe khám phá", group: "Trẻ em", color: "#dce8c6", ink: "#416a4b", filter: "cream", strength: .25, caption: "wild little moments together" },
  { id: "dino-valley", name: "Thung lũng khủng long", subtitle: "Khủng long con · trứng nở · vườn dương xỉ", group: "Trẻ em", color: "#d5ebe0", ink: "#406f65", filter: "mint", strength: .2, caption: "roar means i love you" },
  { id: "mermaid-lagoon", name: "Vương quốc san hô", subtitle: "Nàng tiên cá · rùa biển · ngọc trai", group: "Trẻ em", color: "#cfe8f1", ink: "#62668f", filter: "cool", strength: .2, caption: "a sea of happy memories" },
  { id: "wizard-owls", name: "Học viện phép thuật", subtitle: "Cú phù thủy · sách phép · vạc ánh sáng", group: "Trẻ em", color: "#333651", ink: "#f1d89e", filter: "film", strength: .2, caption: "a little magic in every moment" },
  { id: "space-puppies", name: "Phi hành gia tí hon", subtitle: "Cún phi hành gia · tên lửa · hành tinh", group: "Trẻ em", color: "#29284f", ink: "#f0ddba", filter: "original", strength: 1, caption: "you are our whole universe" },
  { id: "family-foxes", name: "Nhà cáo đi picnic", subtitle: "Gia đình cáo · giỏ picnic · hoa cúc", group: "Gia đình", color: "#f7e4cd", ink: "#8a5847", filter: "cream", strength: .3, caption: "our favorite place is together" },
  { id: "pirate-cove", name: "Kho báu tuổi thơ", subtitle: "Hải tặc nhí · thuyền buồm · rương sao", group: "Trẻ em", color: "#cbe3df", ink: "#486b75", filter: "warm", strength: .2, caption: "the real treasure is being together" },
  { id: "family-album", name: "Album nhà mình", subtitle: "Ảnh polaroid · giấy xé · ghi chú viết tay", group: "Gia đình", color: "#efe5d7", ink: "#7d604e", filter: "film", strength: .35, caption: "a little chapter of our family" },
  { id: "family-plaid", name: "Ngày đoàn viên", subtitle: "Kẻ plaid · trái tim vải · đường may", group: "Gia đình", color: "#e8e4d1", ink: "#5b6e52", filter: "warm", strength: .25, caption: "home is wherever we are together" },
  { id: "baby-cloud", name: "Hello baby", subtitle: "Mây sữa · đồ treo nôi · sao nhỏ", group: "Gia đình", color: "#f7e9da", ink: "#8c7867", filter: "cream", strength: .3, caption: "tiny hands, a whole lot of love" },
  { id: "school-days", name: "Ngày đầu tới lớp", subtitle: "Bút màu · trang vở · bảng ghi nhớ", group: "Trẻ em", color: "#eee5c5", ink: "#4f6b54", filter: "original", strength: 1, caption: "small steps, big bright dreams" },
  { id: "pastel-film", name: "Pastel film club", subtitle: "Film lavender · máy ảnh · gradient pastel", group: "Dễ thương", color: "#e6e2f5", ink: "#6b5c8c", filter: "dreamy", strength: .25, caption: "keep a little color in your day" },
  { id: "oval-bloom", name: "Bloom & oval", subtitle: "Ô ảnh oval · hoa cúc · ren hồng", group: "Dễ thương", color: "#f4e0e8", ink: "#975c75", filter: "rose", strength: .2, caption: "bloom softly, smile brightly" },
  { id: "pixel-crush", name: "Pixel crush", subtitle: "Cửa sổ desktop · tim pixel · sticker Y2K", group: "Dễ thương", color: "#efa5ca", ink: "#68436e", filter: "original", strength: 1, caption: "saved to my favorite memories" },
  { id: "ribbon-diary", name: "Ribbon diary", subtitle: "Nơ xanh · giấy kẻ · con dấu nhật ký", group: "Dễ thương", color: "#fff0cb", ink: "#637f97", filter: "cream", strength: .2, caption: "a page full of little happy things" },
];
const ILLUSTRATED_IDS = new Set<PlayfulTemplateId>(["carnival-pals", "safari-family", "dino-valley", "mermaid-lagoon", "wizard-owls", "space-puppies", "family-foxes", "pirate-cove"]);
export function isPlayfulTemplate(id: string): id is PlayfulTemplateId { return PLAYFUL_TEMPLATES.some(template => template.id === id); }
export function isPlayfulIllustrated(id: PlayfulTemplateId) { return ILLUSTRATED_IDS.has(id); }
export function getPlayfulComposition(id: PlayfulTemplateId) {
  if (isPlayfulIllustrated(id)) return { side: 105, top: 168, gap: 26, radius: 12, tilted: false, shape: undefined, grid: { side: 90, top: 108, gap: 24 } };
  return { side: id === "oval-bloom" ? 82 : 72, top: 112, gap: id === "family-album" ? 36 : 26, radius: id === "baby-cloud" ? 24 : 3, tilted: id === "family-album" || id === "ribbon-diary", shape: id === "oval-bloom" ? "oval" as const : undefined, grid: undefined };
}
export function getPlayfulArtwork(id: PlayfulTemplateId, layout: "strip" | "grid"): TemplateArtwork[] {
  if (!isPlayfulIllustrated(id)) return [];
  return [{ source: `/frames/family/${id}.png`, x: layout === "strip" ? 150 : 12, y: layout === "strip" ? 2460 : 1014, width: layout === "strip" ? 900 : 430, height: layout === "strip" ? 460 : 180 }];
}
const FONT = "'Trebuchet MS',Arial,sans-serif", SERIF = "Georgia,serif", SCRIPT = "'Segoe Script','Brush Script MT',cursive", MONO = "'Courier New',monospace";
function escape(value: string) { return value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char]!); }
function text(x: number, y: number, value: string, size: number, color: string, font = FONT, extra = "") {
  return `<text x="${x}" y="${y}" text-anchor="middle" font-family="${font}" font-size="${size}" fill="${color}" ${extra}>${escape(value)}</text>`;
}
function flower(x: number, y: number, size: number, color = "#fff8dc") {
  return `<g transform="translate(${x} ${y})">${Array.from({ length: 8 }, (_, i) => `<ellipse cy="${-size * .55}" rx="${size * .3}" ry="${size * .6}" fill="${color}" stroke="#b99d9033" stroke-width=".8" transform="rotate(${i * 45})"/>`).join("")}<circle r="${size * .23}" fill="#d8b06b"/></g>`;
}
function leaf(x: number, y: number, size: number, rotate: number, color = "#83a173") {
  return `<g transform="translate(${x} ${y}) rotate(${rotate})"><path d="M0 0Q${-size} ${-size} 0 ${-size * 2}Q${size} ${-size} 0 0Z" fill="${color}"/><path d="M0 0V${-size * 1.8}" stroke="#c6d5a4" stroke-width="1"/></g>`;
}
function cloud(x: number, y: number, scale = 1) {
  return `<path d="M-42 13C-64-9-37-32-20-20-11-57 25-45 29-22 64-35 76 5 50 14Z" fill="#fffaf0" stroke="#c1d1d4" stroke-width="1" transform="translate(${x} ${y}) scale(${scale})"/>`;
}
function bow(x: number, y: number, scale = 1, rotate = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${rotate}) scale(${scale})" stroke="#718a9f" stroke-width="2" stroke-linejoin="round"><path d="M0 0C-65-55-75 30-27 13L0 0C65-55 75 30 27 13Z" fill="#c4d7e4"/><path d="M-5 5-26 61-9 56 0 69 9 14 20 58 34 49 43 56 7 5" fill="#b0c9db"/><rect x="-7" y="-7" width="14" height="18" rx="5" fill="#8ba8bf"/></g>`;
}
interface ArtOptions { w: number; h: number; base: string; ink: string; strip: boolean }
export function renderPlayfulTemplate(id: PlayfulTemplateId, { w, h, base, ink, strip }: ArtOptions) {
  const cx = w / 2, detailed = isPlayfulIllustrated(id);
  let background = "", overlay = "", footerFont = SCRIPT;
  const heading = (title: string, sub: string, font = FONT) => text(cx, strip ? (detailed ? 94 : 58) : (detailed ? 67 : 39), title, strip ? 33 : 28, ink, font, font === FONT ? 'font-weight="800"' : 'font-style="italic"') + text(cx, strip ? (detailed ? 122 : 81) : (detailed ? 89 : 56), sub, 8, ink, FONT, 'letter-spacing="2"');
  const border = `<rect x="24" y="18" width="${w - 48}" height="${h - 36}" rx="14" fill="none" stroke="${ink}" stroke-opacity=".4" stroke-width="1"/>`;
  if (id === "carnival-pals") {
    for (let x = 0; x < w; x += 50) background += `<path d="M${x} 0h50v34q-25 20-50 0Z" fill="${x % 100 ? "#e6b361" : "#b76467"}"/>`;
    background += border;
    overlay += heading("CARNIVAL OF SMILES", "ONE TICKET / A WHOLE LOT OF HAPPY");
    for (let y = 210; y < h - 220; y += 160) background += `<path d="M24 ${y}h27v22H24Z" fill="#dca574" stroke="#fff0ce" stroke-width="1" stroke-dasharray="3 2"/>`;
  } else if (id === "safari-family") {
    background += border;
    for (let y = 185; y < h - 120; y += 185) background += leaf(23, y, 32, -18) + leaf(w - 24, y + 70, 25, 25, "#91ad7b");
    overlay += heading("LITTLE SAFARI CLUB", "OUR WILDEST HAPPY MEMORIES");
    background += `<path d="M31 140q22 17 0 42t0 46M${w - 32} ${h - 370}q-25 20-3 47t-1 52" fill="none" stroke="#9fa277" stroke-width="2" stroke-dasharray="4 5"/>`;
  } else if (id === "dino-valley") {
    background += border + `<path d="M0 ${h - 80}q100-25 200 0t200 0t200 0V${h}H0Z" fill="#a8cbb1" fill-opacity=".4"/>`;
    overlay += heading("ROAR-SOME MEMORIES", "BIG FRIENDS / TINY HAPPY ADVENTURES");
    for (let y = 240; y < h - 240; y += 200) background += `<g fill="#79a799" opacity=".55" transform="translate(32 ${y}) rotate(-15)"><ellipse rx="8" ry="12"/><circle cx="-8" cy="-14" r="4"/><circle cy="-18" r="4"/><circle cx="8" cy="-14" r="4"/></g>`;
    background += leaf(w - 28, 265, 34, 16, "#a2bc8c");
  } else if (id === "mermaid-lagoon") {
    for (let y = 180; y < h - 90; y += 105) background += `<path d="M0 ${y}q25-20 50 0t50 0t50 0t50 0t50 0t50 0t50 0t50 0t50 0t50 0t50 0t50 0t50 0t50 0t50 0t50 0" fill="none" stroke="#8dbcc9" stroke-width="1" opacity=".3"/>`;
    overlay += heading("UNDER THE SEA", "PEARLS, FRIENDS & HAPPY LITTLE TALES");
    for (let y = 210; y < h - 250; y += 160) background += `<circle cx="30" cy="${y}" r="8" fill="none" stroke="#fffaf2" stroke-width="2"/><circle cx="${w - 26}" cy="${y + 70}" r="5" fill="none" stroke="#fffaf2" stroke-width="2"/>`;
  } else if (id === "wizard-owls") {
    background += border;
    for (let i = 0; i < 85; i++) background += `<path d="M${(i * 127 + 19) % w} ${(i * 177 + 28) % h}v${i % 4 ? 2 : 6}m-3-3h6" stroke="#e7c482" stroke-width="${i % 4 ? .5 : 1}" opacity=".55"/>`;
    overlay += heading("A LITTLE MAGIC", "THE SECRET SCHOOL OF HAPPY MEMORIES");
    background += `<path d="M25 195v50m0-35 5-12 5 12-5 6Z" stroke="#e7c482" fill="#efcf8d"/>`;
  } else if (id === "space-puppies") {
    background += `<g fill="none" stroke="#9394b8" stroke-opacity=".35"><ellipse cx="${cx}" cy="${h * .47}" rx="${w * .65}" ry="${h * .38}" transform="rotate(-15 ${cx} ${h * .47})"/><ellipse cx="${cx}" cy="${h * .6}" rx="${w * .55}" ry="${h * .25}" transform="rotate(20 ${cx} ${h * .6})"/></g>`;
    for (let i = 0; i < 90; i++) background += `<circle cx="${(i * 131 + 29) % w}" cy="${(i * 173 + 54) % h}" r="${i % 5 ? .8 : 2}" fill="#efe1ba" opacity=".65"/>`;
    overlay += heading("TINY SPACE EXPLORERS", "A WHOLE UNIVERSE OF HAPPY");
    background += `<g transform="translate(${w - 39} 170) rotate(-25)"><circle r="21" fill="#b4a0bf"/><ellipse rx="36" ry="8" fill="none" stroke="#e6c49b" stroke-width="4"/></g>`;
  } else if (id === "family-foxes") {
    background += `<rect width="${w}" height="${h}" fill="url(#gingham)" opacity=".7"/><rect x="36" y="18" width="${w - 72}" height="${h - 36}" rx="110" fill="${base}" fill-opacity=".72" stroke="#b88e71"/>`;
    overlay += heading("OUR LITTLE FAMILY", "TOGETHER IS OUR FAVORITE PLACE", SERIF);
    background += flower(31, 210, 17) + flower(w - 27, strip ? 740 : 230, 14);
  } else if (id === "pirate-cove") {
    background += `<rect width="${w}" height="${h}" fill="url(#graph)"/>${border}<path d="M32 185q29 20 0 55t0 55M${w - 33} ${h - 390}q-24 20-1 45t0 50" fill="none" stroke="#be9f72" stroke-dasharray="5 5" stroke-width="2"/>`;
    overlay += heading("TREASURED MOMENTS", "A MAP TO OUR HAPPIEST DAYS");
    background += `<g transform="translate(${w - 43} 177)"><circle r="23" fill="#f4e7c2" stroke="#a99270"/><path d="M0-17 6 0 0 17-6 0Z" fill="#b97b69"/><path d="M-17 0 0-5 17 0 0 5Z" fill="#6d9295"/></g>`;
  } else if (id === "family-album") {
    background += `<rect width="${w}" height="${h}" fill="url(#graph)" opacity=".35"/><path d="M18 9 35 16 57 7 80 15 103 8 126 16 150 8 174 14 200 7 230 15 260 7 290 16 320 8 350 15 380 7 410 16 440 8 470 15 500 7 530 15 555 8 582 15V${h - 10}H18Z" fill="#fff9eb" opacity=".5"/>`;
    overlay += heading("our family album", "LITTLE DAYS WE WILL KEEP FOREVER", SCRIPT);
    overlay += `<g transform="translate(58 ${h - 112}) rotate(-12)"><rect x="-30" y="-30" width="72" height="82" fill="#fff8e9" stroke="#b7a38c"/><rect x="-22" y="-22" width="56" height="47" fill="#b6c0aa"/><path d="M-18 18 0-9 29 18Z" fill="#e0d1ad"/>${text(7, 43, "home", 11, ink, SCRIPT)}</g>`;
    footerFont = SCRIPT;
  } else if (id === "family-plaid") {
    background += `<defs><pattern id="family-tartan" width="72" height="72" patternUnits="userSpaceOnUse"><rect width="24" height="72" fill="#91a284" opacity=".28"/><rect width="72" height="24" fill="#aa826d" opacity=".15"/><path d="M35 0V72M0 35H72M42 0V72M0 42H72" stroke="#819476" stroke-width="1"/></pattern></defs><rect width="${w}" height="${h}" fill="url(#family-tartan)"/><rect x="40" y="18" width="${w - 80}" height="${h - 36}" rx="16" fill="${base}" fill-opacity=".65" stroke="#8ea07d" stroke-dasharray="4 3"/>`;
    overlay += heading("all together now", "WOVEN WITH LOVE / OUR FAMILY STORY", SCRIPT);
    overlay += `<path d="M57 ${h - 85}c-70-43-42-91 0-56 42-35 70 13 0 56Z" fill="#b58b7b" stroke="#fff1d9" stroke-width="2" stroke-dasharray="3 3"/>`;
  } else if (id === "baby-cloud") {
    background += border;
    overlay += heading("hello, little sunshine", "TINY MOMENTS / THE BIGGEST LOVE", SERIF);
    for (let y = 170; y < h - 180; y += 210) background += cloud(26, y, .55) + cloud(w - 27, y + 90, .45);
    overlay += `<g transform="translate(52 ${h - 116})"><path d="M-34-43Q0-57 34-43M0-52v34m-27-27v38m54-38v38" fill="none" stroke="#bda386" stroke-width="1.5"/><path d="M-27-10-21 0-27 11-33 0Z" fill="#d6bf8c"/><circle cy="-11" r="12" fill="#d4c6bd"/><path d="M25-16c-20-6-22 25-3 24 7 0 10-3 12-7-19 7-19-15-9-17Z" fill="#d5b76e"/></g>`;
    footerFont = SERIF;
  } else if (id === "school-days") {
    background += `<defs><pattern id="notebook" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M0 29H30" stroke="#9eb5a7" stroke-width=".8"/></pattern></defs><rect width="${w}" height="${h}" fill="url(#notebook)"/><path d="M39 0V${h}" stroke="#cb9a8b"/>`;
    overlay += heading("our bright little days", "LEARN / LAUGH / MAKE A MEMORY", FONT);
    overlay += `<g transform="translate(43 ${h - 115}) rotate(-18)"><path d="M-9-63H9V36L0 55-9 36Z" fill="#d3aa65" stroke="#987f5a"/><path d="M-5-60V35H5V-60" fill="#edcc80"/><path d="M-9 36 0 55 9 36Z" fill="#eedcc0"/><path d="M-3 49 0 55 3 49Z" fill="#64594a"/></g>`;
    overlay += `<g transform="translate(${w - 51} ${h - 119}) rotate(12)"><rect x="-24" y="-34" width="48" height="66" rx="4" fill="#9bb49b" stroke="#6b8c77"/><path d="M-16-26V25M-10-12H16M-10-3H16M-10 6H10" stroke="#fff1ca" stroke-width="1.5"/></g>`;
  } else if (id === "pastel-film") {
    background += `<defs><linearGradient id="pastel-reel" x2=".5" y2="1"><stop stop-color="${base}"/><stop offset=".5" stop-color="#e9dce9"/><stop offset="1" stop-color="#cfe4de"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#pastel-reel)"/>`;
    for (let y = 14; y < h; y += 43) background += `<rect x="18" y="${y}" width="18" height="26" rx="2" fill="#fffaf0" opacity=".85"/><rect x="${w - 36}" y="${y}" width="18" height="26" rx="2" fill="#fffaf0" opacity=".85"/>`;
    overlay += heading("pastel film club", "A SOFT LITTLE ROLL OF HAPPY", SERIF);
    overlay += `<g transform="translate(58 ${h - 111}) rotate(-12)"><path d="M-35-19H-18L-11-29H12L19-19H35V25H-35Z" fill="#b7a2ce" stroke="#7f719b" stroke-width="2"/><circle r="17" fill="#e6e1ef" stroke="#7f719b" stroke-width="2"/><circle r="10" fill="#a3bac4"/><rect x="-28" y="-13" width="10" height="6" rx="1" fill="#fff9de"/></g>`;
    footerFont = SERIF;
  } else if (id === "oval-bloom") {
    background += `<rect width="${w}" height="${h}" fill="url(#stripes)"/>${border}`;
    overlay += heading("bloom & smile", "OUR LITTLE OVAL OF HAPPINESS", SCRIPT);
    for (let y = 133; y < h - 140; y += 220) overlay += flower(35, y, 20) + flower(w - 32, y + 100, 15, "#f9f1da");
    overlay += bow(57, h - 113, .75, -15) + flower(w - 44, h - 112, 24);
  } else if (id === "pixel-crush") {
    background += `<defs><pattern id="pixel-grid" width="26" height="26" patternUnits="userSpaceOnUse"><path d="M26 0H0V26" stroke="#fff3f4" stroke-width="1" fill="none" opacity=".35"/></pattern></defs><rect width="${w}" height="${h}" fill="url(#pixel-grid)"/>`;
    overlay += heading("pixel crush.exe", "SAVE THIS MOMENT / FAVORITES ONLY", MONO);
    overlay += `<g transform="translate(54 ${h - 116}) rotate(-8)"><rect x="-32" y="-28" width="85" height="61" rx="3" fill="#f8d7e4" stroke="#7f5b8b" stroke-width="2"/><path d="M-32-14H53" stroke="#7f5b8b" stroke-width="2"/>${text(39, -19, "x", 11, ink, MONO)}<path d="M-9-4H1V4H9V-4H19V4H26V14H18V22H3V14H-9Z" fill="#cb759e"/></g>`;
    overlay += `<path d="M${w - 43} ${h - 128}v37l9-9 9 16 7-4-9-16h13Z" fill="#fff6ea" stroke="#86618d" stroke-width="2"/>`;
    footerFont = MONO;
  } else {
    background += `<rect width="${w}" height="${h}" fill="url(#graph)"/>${border}`;
    overlay += heading("ribbon diary", "A SMALL NOTE FROM A HAPPY DAY", SCRIPT);
    overlay += bow(strip ? cx : w - 57, strip ? 24 : 26, strip ? .45 : .37, strip ? 0 : 15) + bow(52, h - 119, .9, -16);
    overlay += `<g transform="translate(${w - 52} ${h - 118}) rotate(13)"><circle r="28" fill="#e6d8b1" stroke="#9eabac" stroke-width="1.5" stroke-dasharray="2 3"/><circle r="22" fill="none" stroke="#9eabac"/>${text(0, 4, "LOVE", 9, ink, SERIF)}</g>`;
  }
  return { background, overlay, footerFont: detailed ? FONT : footerFont, footer: detailed ? { x: strip ? cx : 538, width: strip ? 480 : 460, y: h - (strip ? 37 : 50) } : undefined };
}
