import type { Filter } from "./filters.ts";

export type ExtraTemplateId = "sakura" | "tulip" | "daisy" | "lavender" | "strawberry" | "matcha" | "lemon" | "peach" | "passport" | "cinema" | "cassette" | "postage" | "graduation" | "wedding" | "christmas" | "tet";
interface ExtraTemplate {
  id: ExtraTemplateId; name: string; subtitle: string;
  group: "Hoa & trái cây" | "Đi chơi" | "Nhật ký" | "Tiệc vui" | "Lãng mạn" | "Lễ hội";
  color: string; ink: string; filter: Filter; strength: number; caption: string;
}
export const EXTRA_TEMPLATES: ExtraTemplate[] = [
  { id: "sakura", name: "Hẹn mùa anh đào", subtitle: "Cánh hoa bay · quạt giấy · hồng phai", group: "Hoa & trái cây", color: "#fae9e8", ink: "#934b67", filter: "rose", strength: .45, caption: "a little spring, a little us" },
  { id: "tulip", name: "Một bó tulip", subtitle: "Hoa bọc giấy · sọc bơ · ruy băng", group: "Hoa & trái cây", color: "#fff2cd", ink: "#855451", filter: "cream", strength: .5, caption: "flowers for your lovely day" },
  { id: "daisy", name: "Cúc nhỏ đầu hè", subtitle: "Cúc trắng · nắng vàng · đường lượn", group: "Hoa & trái cây", color: "#edf2d7", ink: "#58663a", filter: "warm", strength: .3, caption: "you make ordinary days bloom" },
  { id: "lavender", name: "Thư từ Provence", subtitle: "Oải hương · giấy thư · tem tím", group: "Hoa & trái cây", color: "#ede6f5", ink: "#675184", filter: "dreamy", strength: .35, caption: "slow days & lavender dreams" },
  { id: "strawberry", name: "Strawberry picnic", subtitle: "Dâu tây · khăn picnic · nhãn mứt", group: "Hoa & trái cây", color: "#ffe9e3", ink: "#a33f4a", filter: "peach", strength: .45, caption: "the sweetest little memories" },
  { id: "matcha", name: "Matcha & you", subtitle: "Chổi chasen · bát trà · nhãn tiệm", group: "Đi chơi", color: "#e2e8c9", ink: "#465b37", filter: "mint", strength: .3, caption: "a perfect little matcha moment" },
  { id: "lemon", name: "Lemon soda club", subtitle: "Chanh vàng · gạch biển · bọt soda", group: "Hoa & trái cây", color: "#fff4bf", ink: "#356a87", filter: "vivid", strength: .3, caption: "a squeeze of sunshine" },
  { id: "peach", name: "Đào ngọt mùa hạ", subtitle: "Vườn đào · lá xanh · nhãn trái cây", group: "Hoa & trái cây", color: "#f8dfd0", ink: "#9a5846", filter: "peach", strength: .4, caption: "life is peachy with you" },
  { id: "passport", name: "Passport of us", subtitle: "Dấu nhập cảnh · bản đồ · vé bay", group: "Đi chơi", color: "#e5e3d2", ink: "#324e61", filter: "retro", strength: .5, caption: "collect moments, wherever we go" },
  { id: "cinema", name: "Suất chiếu đôi mình", subtitle: "Vé rạp · cuộn phim · bảng clap", group: "Đi chơi", color: "#2d2932", ink: "#f5ddb1", filter: "film", strength: .5, caption: "our favorite scene, on repeat" },
  { id: "cassette", name: "Mixtape tình bạn", subtitle: "Băng cassette · equalizer · nhãn 90s", group: "Nhật ký", color: "#eac9bb", ink: "#57415f", filter: "retro", strength: .5, caption: "the soundtrack to our good days" },
  { id: "postage", name: "Gửi một ngày vui", subtitle: "Tem răng cưa · dấu bưu điện · thư xanh", group: "Nhật ký", color: "#dfe9ed", ink: "#3b5a71", filter: "fade", strength: .35, caption: "sending you a little happiness" },
  { id: "graduation", name: "Our next chapter", subtitle: "Mũ cử nhân · bằng tốt nghiệp · nguyệt quế", group: "Tiệc vui", color: "#213b47", ink: "#e7d29d", filter: "original", strength: 1, caption: "the best is still ahead of us" },
  { id: "wedding", name: "Ngày mình chung đôi", subtitle: "Nhẫn cưới · hoa trắng · thiệp champagne", group: "Lãng mạn", color: "#f3ebe0", ink: "#81654d", filter: "cream", strength: .45, caption: "all the little forevers" },
  { id: "christmas", name: "A little Christmas", subtitle: "Nhánh thông · quả châu · giấy gói quà", group: "Lễ hội", color: "#294b41", ink: "#f4e2b7", filter: "warm", strength: .3, caption: "warm hearts & merry little moments" },
  { id: "tet", name: "Tết sum vầy", subtitle: "Hoa mai · đèn lồng · bao lì xì", group: "Lễ hội", color: "#9c353a", ink: "#f5d796", filter: "warm", strength: .35, caption: "gom niềm vui, giữ lộc đầu năm" },
];

export function getExtraComposition(id: ExtraTemplateId) {
  const side = ({ sakura: 76, tulip: 72, daisy: 66, lavender: 78, strawberry: 66, matcha: 62, lemon: 70, peach: 70, passport: 70, cinema: 64, cassette: 68, postage: 74, graduation: 66, wedding: 80, christmas: 76, tet: 78 })[id];
  return { side, top: id === "passport" ? 124 : id === "wedding" ? 122 : 112, gap: id === "cinema" ? 18 : id === "matcha" ? 20 : 28, radius: ["sakura", "daisy", "strawberry", "peach", "wedding"].includes(id) ? 18 : 3, tilted: id === "postage" };
}

const SERIF = "Georgia, serif", SCRIPT = "'Segoe Script', 'Brush Script MT', cursive", MONO = "'Courier New', monospace", SANS = "Arial, sans-serif";
const esc = (value: string) => value.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!);
function t(x: number, y: number, value: string, size: number, color: string, font = SERIF, extra = "") {
  return `<text x="${x}" y="${y}" text-anchor="middle" font-family="${font}" font-size="${size}" fill="${color}" ${extra}>${esc(value)}</text>`;
}
function petals(x: number, y: number, size: number, color: string, count = 5, center = "#e4bb61") {
  return `<g transform="translate(${x} ${y})">${Array.from({ length: count }, (_, i) => `<ellipse cy="${-size * .52}" rx="${size * .36}" ry="${size * .58}" fill="${color}" stroke="#8a666333" stroke-width=".7" transform="rotate(${i * 360 / count})"/>`).join("")}<circle r="${size * .18}" fill="${center}"/></g>`;
}
function leaf(x: number, y: number, scale = 1, rotate = 0, fill = "#758965") {
  return `<g transform="translate(${x} ${y}) rotate(${rotate}) scale(${scale})"><path d="M0 0Q-25-44 5-62Q30-26 0 0Z" fill="${fill}"/><path d="M0 0 5-51" stroke="#d4dcb1" stroke-width="1"/></g>`;
}
function strawberry(x: number, y: number, scale = 1, rotate = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${rotate}) scale(${scale})"><path d="M0 42C-73-11-39-53 0-32 39-53 73-11 0 42Z" fill="#cf5d60" stroke="#a23c4b" stroke-width="2"/><path d="M-6-29-28-44-10-43 0-60 8-42 29-47 15-28 0-34Z" fill="#6e8c55"/>${[-17, 0, 17].map((px, i) => `<g fill="#ffe7b1"><ellipse cx="${px}" cy="-14" rx="2" ry="3"/><ellipse cx="${px + (i - 1) * -5}" cy="2" rx="2" ry="3"/><ellipse cx="${px / 2}" cy="17" rx="2" ry="3"/></g>`).join("")}<path d="M-29-17Q-33-30-22-31" fill="none" stroke="#f5ada4" stroke-width="4" stroke-linecap="round"/></g>`;
}
function citrus(x: number, y: number, radius: number) {
  return `<g transform="translate(${x} ${y})"><circle r="${radius}" fill="#eab94a"/><circle r="${radius - 3}" fill="#fff4c8"/>${Array.from({ length: 8 }, (_, i) => `<path d="M2-3 7 ${-radius + 8}Q${radius * .56} ${-radius + 7} ${radius * .65} ${-radius * .67}Z" fill="#f1cf60" transform="rotate(${i * 45})"/>`).join("")}</g>`;
}
function peachFruit(x: number, y: number, scale = 1, rotate = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${rotate}) scale(${scale})"><path d="M0-25C-59-53-71 34-3 45 61 43 67-51 0-25Z" fill="url(#peach-fruit)" stroke="#cf8c73" stroke-width="1"/><path d="M0-24Q-18 12-3 40" stroke="#d18f76" fill="none" stroke-width="2"/><path d="M0-27Q-7-45 0-56" stroke="#986b42" fill="none" stroke-width="3"/>${leaf(2, -36, .65, 65, "#7d9467")}</g>`;
}
function tulip(x: number, y: number, scale = 1, rotate = 0, color = "#d98691") {
  return `<g transform="translate(${x} ${y}) rotate(${rotate}) scale(${scale})"><path d="M0 70Q-8 21 0-15" stroke="#6e8b58" stroke-width="3" fill="none"/><path d="M0 53Q-29 50-24 14 1 31 0 53M-1 68Q30 46 22 27 4 39-1 68" fill="#8b9e66"/><path d="M0-10Q-31-9-24-48L-10-39 0-57 11-39 25-47Q30-10 0-10Z" fill="${color}" stroke="#b66f81" stroke-width="1"/><path d="M0-14-10-39M0-14 11-39" stroke="#f4c5c3" fill="none"/></g>`;
}
function lavender(x: number, y: number, scale = 1, rotate = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${rotate}) scale(${scale})"><path d="M0 30Q-8-38 2-102" stroke="#779074" stroke-width="2" fill="none"/>${Array.from({ length: 7 }, (_, i) => `<g transform="translate(${Math.sin(i) * 3} ${-i * 12 - 12})"><ellipse cx="-5" rx="5" ry="8" fill="${i % 2 ? "#a294c5" : "#8275ab"}" transform="rotate(-28)"/><ellipse cx="5" cy="-4" rx="5" ry="8" fill="#b0a3cf" transform="rotate(28)"/></g>`).join("")}</g>`;
}
function pine(x: number, y: number, scale = 1, rotate = 0) {
  let needles = "";
  for (let i = 0; i < 12; i++) needles += `<path d="M${i * 8} 0l-7-21m10 20 5-25m-9 25-4 19m12-18 7 20" stroke="${i % 2 ? "#78916f" : "#9eab83"}" stroke-width="2"/>`;
  return `<g transform="translate(${x} ${y}) rotate(${rotate}) scale(${scale})"><path d="M-10 0H108" stroke="#b39a68" stroke-width="3"/>${needles}</g>`;
}
function stamp(x: number, y: number, color: string, label: string, rotation = -15) {
  return `<g transform="translate(${x} ${y}) rotate(${rotation})"><circle r="34" fill="none" stroke="${color}" stroke-width="1.5"/><circle r="29" fill="none" stroke="${color}" stroke-width=".7"/>${t(0, -4, label, 8, color, MONO)}${t(0, 10, "MỘT CHÚT.", 7, color, MONO)}<path d="M35-14q15 6 31 0t31 0M35-3q15 6 31 0t31 0M35 8q15 6 31 0t31 0" stroke="${color}" fill="none" stroke-width="1"/></g>`;
}

interface ArtOptions { w: number; h: number; base: string; ink: string; strip: boolean }
export function renderExtraTemplate(id: ExtraTemplateId, { w, h, base, ink, strip }: ArtOptions) {
  const cx = w / 2;
  let background = "", overlay = "", footerFont = SCRIPT;
  const title = (main: string, sub: string, font = SERIF) => t(cx, strip ? 58 : 38, main, strip ? 34 : 28, ink, font, font === SERIF ? 'font-style="italic"' : "") + t(cx, strip ? 80 : 55, sub, 8, ink, SANS, 'letter-spacing="2.5"');
  const frame = (stroke = ink, radius = 0) => `<rect x="22" y="18" width="${w - 44}" height="${h - 36}" rx="${radius}" fill="none" stroke="${stroke}" stroke-width="1"/>`;
  const softPanel = `<rect x="38" y="14" width="${w - 76}" height="${h - 28}" rx="18" fill="#fffdf5" fill-opacity=".35"/>`;

  if (id === "sakura") {
    background += `<path d="M0 0H${w}V${h}H0Z" fill="url(#stripes)" opacity=".32"/>${softPanel}${frame("#c38b9e", 125)}`;
    overlay += title("sakura days", "MEET ME WHERE THE BLOSSOMS FALL");
    overlay += `<path d="M-5 269Q76 173 32 89M30 160 64 128M22 194 66 181M${w + 5} ${h - 254}q-72 74-41 177m-7-60-34-23" fill="none" stroke="#a67b76" stroke-width="3"/>`;
    [[30, 138, 18], [52, 177, 13], [24, 214, 20], [w - 35, h - 137, 23], [w - 65, h - 178, 16]].forEach(([x, y, s]) => { overlay += petals(x, y, s, "#f6bccd"); });
    for (let i = 0; i < 18; i++) background += `<ellipse cx="${(i * 137 + 21) % w}" cy="${(i * 157 + 30) % h}" rx="3" ry="6" fill="#d89caf" opacity=".55" transform="rotate(${i * 19} ${(i * 137 + 21) % w} ${(i * 157 + 30) % h})"/>`;
    overlay += `<g transform="translate(58 ${h - 99}) rotate(-20)"><path d="M0 28-45-22Q0-68 45-22Z" fill="#f2d5d7" stroke="#ba8b9e"/>${[-40, -20, 0, 20, 40].map(a => `<path d="M0 28V-41" stroke="#c79cad" transform="rotate(${a} 0 28)"/>`).join("")}</g>`;
  } else if (id === "tulip") {
    for (let x = 0; x < w; x += 28) background += `<rect x="${x}" width="11" height="${h}" fill="#dbc784" opacity=".15"/>`;
    background += softPanel + frame("#c6ad7e", 100);
    overlay += title("a bunch of happiness", "FRESH FLOWERS & FRESH MEMORIES", SCRIPT);
    overlay += `<g transform="translate(57 ${h - 138}) rotate(-12)"><path d="M-38-5 40-6 17 83-11 84Z" fill="#e5cfb0" stroke="#bba68a"/>${tulip(-16, -24, .67, -15)}${tulip(8, -44, .78, 8, "#eab78c")}${tulip(27, -16, .62, 18)}<path d="M-18 36q24-10 43 0m-25-3-10 23m13-23 18 16" fill="none" stroke="#a47278" stroke-width="3"/></g>`;
    overlay += tulip(w - 33, strip ? 566 : h - 149, .55, 15);
  } else if (id === "daisy") {
    background += `<path d="M35 25Q${cx} 6 ${w - 35} 25V${h - 25}Q${cx} ${h - 6} 35 ${h - 25}Z" fill="#fff8dd" fill-opacity=".42" stroke="#a5b07c" stroke-width="1"/>`;
    overlay += title("hello, sunshine", "A POCKET FULL OF DAISY DAYS", SCRIPT);
    for (let y = 120; y < h - 170; y += 170) overlay += `<path d="M24 ${y}q28 25 0 50t0 50M${w - 24} ${y + 35}q-28 25 0 50t0 50" stroke="#afbd88" fill="none" stroke-width="1.5"/>`;
    overlay += petals(52, h - 120, 30, "#fffdf5", 12) + petals(29, h - 76, 18, "#fffdf5", 11) + petals(w - 39, h - 130, 25, "#fffdf5", 12) + petals(37, 91, 18, "#fffdf5", 10);
    overlay += leaf(w - 47, h - 76, .65, 35) + leaf(70, h - 72, .6, -40);
  } else if (id === "lavender") {
    background += `<rect width="${w}" height="${h}" fill="url(#graph)"/>${frame("#a79abb", 120)}`;
    overlay += title("letters from Provence", "LAVENDER FIELDS & UNHURRIED DAYS");
    overlay += lavender(37, 260, .84, -12) + lavender(53, 240, .7, 9) + lavender(w - 42, h - 63, 1.1, 13) + lavender(w - 68, h - 69, .87, -8);
    overlay += `<g transform="translate(51 ${h - 103}) rotate(-13)"><rect x="-30" y="-31" width="90" height="62" fill="#f9f2e8" stroke="#b2a4be"/><path d="M-30-31 15 2 60-31M-30 31 0 0m60 31L30 0" fill="none" stroke="#b2a4be"/><circle cx="15" cy="2" r="10" fill="#9b84b5"/></g>`;
    overlay += stamp(w - 58, 39, "#8c79a6", "PROVENCE", 15);
  } else if (id === "strawberry") {
    background += `<rect width="${w}" height="${h}" fill="url(#gingham)"/>${softPanel}${frame("#bf7581", 25)}`;
    overlay += title("strawberry picnic", "HOMEMADE HAPPINESS / EST. TODAY", SCRIPT);
    overlay += strawberry(49, h - 114, .8, -17) + strawberry(w - 35, strip ? 708 : h - 139, .56, 15);
    overlay += `<g transform="translate(${w - 49} 34) rotate(14)"><rect x="-29" y="-15" width="58" height="30" rx="10" fill="#f9f1dc" stroke="#b36973"/>${t(0, 4, "SWEET", 8, "#9c4555", MONO)}</g>`;
    for (let y = 170; y < h - 200; y += 230) overlay += petals(30, y, 11, "#fff7e2", 5);
  } else if (id === "matcha") {
    background += `<rect x="24" y="15" width="${w - 48}" height="${h - 30}" rx="120" fill="#f7f4dc" fill-opacity=".4" stroke="#899a68" stroke-width="1"/><path d="M35 30H${w - 35}M35 ${h - 30}H${w - 35}" stroke="#899a68" stroke-width="1"/>`;
    overlay += title("matcha & you", "THE SLOW AFTERNOON TEA CLUB", SCRIPT);
    overlay += `<g transform="translate(55 ${h - 117}) rotate(-10)"><ellipse rx="43" ry="15" fill="#faf4db" stroke="#8b9771"/><path d="M-43 0Q-35 52 0 49 35 52 43 0" fill="#d3d8ba" stroke="#8b9771"/><ellipse rx="35" ry="10" fill="#8f9f67"/><path d="M-22 1q20-13 42 0" fill="none" stroke="#c7d29d" stroke-width="2"/></g>`;
    overlay += `<g transform="translate(${w - 42} ${h - 122}) rotate(20)"><path d="M-7-45H7V-16L18 35Q0 45-18 35L-7-16Z" fill="#cab48a" stroke="#9f8d63"/>${[-13, -8, -3, 3, 8, 13].map(x => `<path d="M${x} 34 ${x * .45} -15" stroke="#f0deb3" stroke-width="1"/>`).join("")}</g>`;
    overlay += leaf(33, 159, .7, -20) + leaf(w - 28, 228, .6, 20);
  } else if (id === "lemon") {
    background += `<defs><pattern id="blue-tile" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="none" stroke="#7ba2b8" stroke-width="1"/><path d="M0 20H40M20 0V40" stroke="#7ba2b8" stroke-width=".6"/></pattern></defs><rect width="${w}" height="${h}" fill="url(#blue-tile)" opacity=".37"/>${softPanel}`;
    overlay += title("lemon soda club", "FRESHLY SQUEEZED HAPPY MOMENTS");
    overlay += citrus(51, h - 124, 34) + citrus(w - 42, h - 99, 25) + leaf(76, h - 139, .75, 52);
    overlay += `<g transform="translate(${w - 41} 127) rotate(10)"><path d="M-18-25H18L13 39H-13Z" fill="#fff9df" fill-opacity=".75" stroke="#8ca8ad"/><path d="M-15-4H15L11 34H-11Z" fill="#ead174"/><path d="M6-5V-46H22" fill="none" stroke="#5d92a8" stroke-width="3"/><circle cx="-5" cy="12" r="2" fill="#fff8de"/><circle cx="4" cy="21" r="3" fill="#fff8de"/></g>`;
  } else if (id === "peach") {
    background += `<path d="M25 18H${w - 25}V${h - 18}H25Z" fill="#fff6e6" fill-opacity=".28" stroke="#d0a489" stroke-width="1"/><path d="M38 28H${w - 38}M38 ${h - 28}H${w - 38}" stroke="#d0a489"/>`;
    background += `<defs><radialGradient id="peach-fruit" cx=".3" cy=".3"><stop stop-color="#ffd4a9"/><stop offset=".65" stop-color="#eaa78b"/><stop offset="1" stop-color="#d7847b"/></radialGradient></defs>`;
    overlay += title("peachy little days", "PICKED FRESH FROM OUR MEMORY ORCHARD");
    overlay += peachFruit(55, h - 111, .83, -12) + peachFruit(w - 37, strip ? 654 : h - 119, .58, 18) + leaf(33, 160, .8, -15);
    overlay += `<g transform="translate(${w - 55} 40) rotate(12)"><ellipse rx="32" ry="20" fill="#f8eac8" stroke="#c4936c"/>${t(0, -2, "SWEET", 9, "#a1694c", MONO)}${t(0, 10, "MEMORIES", 6, "#a1694c", MONO)}</g>`;
  } else if (id === "passport") {
    background += `<rect width="${w}" height="${h}" fill="url(#graph)"/><g fill="none" stroke="#67808b" stroke-opacity=".23"><ellipse cx="${cx}" cy="${h * .48}" rx="${w * .45}" ry="${w * .45}"/>${[-2, -1, 0, 1, 2].map(i => `<ellipse cx="${cx}" cy="${h * .48}" rx="${55 + Math.abs(i) * 70}" ry="${w * .45}"/><path d="M20 ${h * .48 + i * 70}H${w - 20}"/>`).join("")}</g>${frame("#82918b", 8)}`;
    overlay += title("passport of us", "VALID FOR EVERY ADVENTURE", MONO);
    overlay += stamp(55, h - 125, "#9d665e", "ARRIVED") + stamp(w - 47, strip ? 449 : h - 113, "#60777d", "EXPLORE", 16);
    overlay += `<g transform="translate(${w - 52} 37) rotate(-19)"><path d="m-34 3 31-7 4-23 6-1 5 22 28 9-2 6-30-2-5 14-5 1-1-16-30 2Z" fill="#60777d"/></g>`;
    footerFont = MONO;
  } else if (id === "cinema") {
    background += `<rect x="9" y="0" width="36" height="${h}" fill="#19181e"/><rect x="${w - 45}" y="0" width="36" height="${h}" fill="#19181e"/>`;
    for (let y = 15; y < h; y += 39) background += `<rect x="20" y="${y}" width="14" height="22" rx="2" fill="#ecdfbd"/><rect x="${w - 34}" y="${y}" width="14" height="22" rx="2" fill="#ecdfbd"/>`;
    overlay += title("our little movie", "FOUR SCENES / ONE BEAUTIFUL STORY");
    overlay += `<g transform="translate(58 ${h - 114}) rotate(-12)"><rect x="-34" y="-17" width="70" height="48" rx="3" fill="#e6dac0" stroke="#17171c" stroke-width="2"/><path d="M-34-29H36V-16H-34Z" fill="#23222a" transform="rotate(-12 -34 -16)"/>${[-20, 0, 20].map(x => `<path d="M${x}-30 ${x - 9}-16" stroke="#f5e5c6" stroke-width="7" transform="rotate(-12 -34 -16)"/>`).join("")}${t(0, 6, "TAKE 04", 10, "#33313b", MONO)}</g>`;
    overlay += `<g transform="translate(${w - 57} ${h - 108}) rotate(10)"><path d="M-31-15H31V18H-31Z" fill="#b77b6d" stroke="#e8c49b" stroke-dasharray="3 3"/>${t(0, 5, "ADMIT TWO", 8, "#fff1ca", MONO)}</g>`;
    footerFont = SERIF;
  } else if (id === "cassette") {
    background += `<path d="M0 36H${w}M0 ${h - 30}H${w}" stroke="#8d7a93" stroke-width="1"/>`;
    for (let y = 120; y < h - 190; y += 120) background += `<path d="M27 ${y}v21m7-34v45m7-26v16M${w - 27} ${y + 35}v21m-7-34v45m-7-26v16" stroke="#bd877f" stroke-width="3"/>`;
    overlay += title("our friendship mixtape", "SIDE A: GOOD DAYS / SIDE B: EVEN BETTER", SCRIPT);
    overlay += `<g transform="translate(63 ${h - 116}) rotate(-12)"><rect x="-51" y="-32" width="102" height="65" rx="6" fill="#806375" stroke="#57415f" stroke-width="2"/><rect x="-43" y="-25" width="86" height="34" rx="3" fill="#eadbbd"/><path d="M-25 22-19 9H19L25 22Z" fill="#c8b0a9"/><circle cx="-22" cy="-5" r="10" fill="#806375"/><circle cx="22" cy="-5" r="10" fill="#806375"/><path d="M-12-11H12M-12 1H12" stroke="#806375" stroke-width="2"/><circle cx="-22" cy="-5" r="4" fill="#d6bcae"/><circle cx="22" cy="-5" r="4" fill="#d6bcae"/></g>`;
    overlay += `<path d="M${w - 51} ${h - 140}v50q-20-8-22 6t22 0v-73l29-6v49q-20-8-22 6t22 0v-70Z" fill="#8d617b"/>`;
  } else if (id === "postage") {
    background += `<path d="M0 0H${w}V${h}H0Z" fill="url(#graph)"/>${frame("#7c97a1", 3)}`;
    for (let x = 26; x < w - 20; x += 15) background += `<circle cx="${x}" cy="25" r="3" fill="${base}" stroke="#90a6ad" stroke-width=".6"/><circle cx="${x}" cy="${h - 25}" r="3" fill="${base}" stroke="#90a6ad" stroke-width=".6"/>`;
    overlay += title("a letter to remember", "SPECIAL DELIVERY / HANDLE WITH LOVE");
    overlay += stamp(56, h - 114, "#9f726d", "AIR MAIL") + stamp(w - 65, 35, "#6b8695", "POST CARD", 12);
    overlay += `<g transform="translate(${w - 47} ${h - 113}) rotate(13)"><rect x="-30" y="-40" width="60" height="80" fill="#eddfc8" stroke="#728d93" stroke-width="2" stroke-dasharray="2 3"/><rect x="-23" y="-32" width="46" height="64" fill="#9eb6b4"/><path d="M-20 26 1-18 20 26Z" fill="#f2e8cb"/>${t(0, 24, "04", 9, "#576d79", MONO)}</g>`;
    footerFont = SERIF;
  } else if (id === "graduation") {
    background += frame("#baaa79", 3) + `<rect x="29" y="25" width="${w - 58}" height="${h - 50}" fill="none" stroke="#baaa79" stroke-width=".5"/>`;
    overlay += title("the next chapter", "DREAM BIG / REMEMBER THIS DAY");
    overlay += `<g transform="translate(57 ${h - 123}) rotate(-12)"><path d="M-46-7 0-27 46-7 0 14Z" fill="#28313a" stroke="#d7bf82" stroke-width="2"/><path d="M-27 2V21Q0 36 27 21V2" fill="#34424b" stroke="#d7bf82"/><path d="M8-6 38 5V40" fill="none" stroke="#e6c477" stroke-width="2"/><path d="M34 37H42L45 54H31Z" fill="#c6a55e"/></g>`;
    overlay += `<g transform="translate(${w - 51} ${h - 115}) rotate(19)"><rect x="-29" y="-13" width="58" height="26" rx="9" fill="#f0e4c5" stroke="#bfaa79"/><path d="M-4-14V15H4V-14M0 9-10 32 0 27 9 32 3 9" fill="#a56a67"/></g>`;
    for (let y = 160; y < h - 210; y += 230) overlay += leaf(34, y, .4, -20, "#a49669") + leaf(w - 34, y + 50, .4, 20, "#a49669");
    footerFont = SERIF;
  } else if (id === "wedding") {
    background += `<rect x="23" y="18" width="${w - 46}" height="${h - 36}" rx="${strip ? 150 : 90}" fill="#fffaf1" fill-opacity=".42" stroke="#b8a589" stroke-width="1"/><rect x="31" y="25" width="${w - 62}" height="${h - 50}" rx="${strip ? 145 : 85}" fill="none" stroke="#b8a589" stroke-width=".5"/>`;
    overlay += title("always & forever", "TWO HEARTS / ONE BEAUTIFUL STORY", SCRIPT);
    overlay += `<g transform="translate(63 ${h - 118}) rotate(-15)"><circle cx="-11" r="23" fill="none" stroke="#c5a365" stroke-width="6"/><circle cx="15" cy="11" r="23" fill="none" stroke="#d7ba80" stroke-width="5"/><path d="M-19-25-12-34-5-25-12-19Z" fill="#fffef2" stroke="#bca074"/></g>`;
    overlay += leaf(w - 30, h - 82, .95, 13, "#a4af8e") + leaf(w - 64, h - 79, .7, -25, "#b5bea0") + petals(w - 45, h - 143, 25, "#fffdf1", 8) + petals(w - 23, h - 103, 16, "#f3e4d2", 7);
    overlay += petals(35, 99, 19, "#fffaf0", 8) + leaf(31, 154, .6, -20, "#a4af8e");
  } else if (id === "christmas") {
    background += frame("#b6a377", 3);
    for (let i = 0; i < 60; i++) background += `<circle cx="${(i * 157 + 21) % w}" cy="${(i * 191 + 13) % h}" r="${i % 3 ? 1 : 2}" fill="#e8dcb7" opacity=".45"/>`;
    overlay += title("a little Christmas", "MERRY MOMENTS / WARM HEARTS", SCRIPT);
    overlay += pine(0, 118, 1, -18) + pine(w - 110, 115, 1, 18) + pine(15, h - 116, 1, -42);
    overlay += `<g transform="translate(${w - 47} ${h - 113})"><path d="M0-64V-25" stroke="#c5ad70"/><circle r="27" fill="#b76662" stroke="#ddbe8a" stroke-width="1"/><path d="M-20-5Q0-20 20-5M-23 6Q0-9 23 6" stroke="#e4bd9a" fill="none"/><rect x="-7" y="-33" width="14" height="9" rx="2" fill="#bdad78"/></g>`;
    overlay += `<g transform="translate(56 ${h - 109}) rotate(-13)"><rect x="-29" y="-20" width="58" height="44" fill="#ad5d57" stroke="#dcbd88"/><path d="M-4-20V24H4V-20M-29-4H29V4H-29" fill="#dfc991"/><path d="M0-20C-36-44-26-56 0-25 27-56 36-44 0-20Z" fill="none" stroke="#e4d09c" stroke-width="3"/></g>`;
  } else {
    background += frame("#d5b476", 25) + `<rect x="30" y="26" width="${w - 60}" height="${h - 52}" rx="20" fill="none" stroke="#d5b476" stroke-width=".5"/>`;
    overlay += title("Tết sum vầy", "XUÂN AN VUI / KỶ NIỆM ĐONG ĐẦY", SERIF);
    overlay += `<path d="M-5 250Q67 189 31 91M32 171 61 147M${w + 5} ${h - 221}q-54 41-34 121" fill="none" stroke="#bea064" stroke-width="3"/>`;
    overlay += petals(37, 130, 20, "#edcb72", 5, "#a46342") + petals(57, 174, 15, "#f2d587", 5, "#a46342") + petals(24, 211, 19, "#eac46a", 5, "#a46342");
    overlay += `<g transform="translate(${w - 47} 129)"><path d="M0-87V-43" stroke="#e2bf78"/><path d="M-17-43H17V-35H-17Z" fill="#d6ad60"/><ellipse rx="29" ry="38" fill="#c65d48" stroke="#e4bc6f"/><path d="M-10-35Q-24 0-10 35M10-35Q24 0 10 35M0-38V38" stroke="#e5bc73" fill="none"/><path d="M-15 35H15V43H-15Z" fill="#d6ad60"/><path d="M-5 43V67M0 43V73M5 43V67" stroke="#ddb569" stroke-width="2"/></g>`;
    overlay += `<g transform="translate(60 ${h - 119}) rotate(-14)"><rect x="-25" y="-36" width="50" height="78" rx="3" fill="#bc5147" stroke="#e7c17e"/><path d="M-24-34 0-17 24-34" fill="none" stroke="#e7c17e"/><path d="M0-4 16 12 0 28-16 12Z" fill="#e0b86d"/>${t(0, 17, "LỘC", 9, "#9c353a", SERIF)}</g>`;
    overlay += petals(w - 34, h - 119, 25, "#edcb72", 5, "#a46342");
    footerFont = SERIF;
  }
  return { background, overlay, footerFont };
}
