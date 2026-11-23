import type { Filter } from "./filters.ts";

export type CartoonTemplateId = "bear-picnic" | "kitty-club" | "bunny-cloud" | "comic-pop";
export const CARTOON_TEMPLATES: { id: CartoonTemplateId; name: string; subtitle: string; group: "Cartoon"; color: string; ink: string; filter: Filter; strength: number; caption: string }[] = [
  { id: "bear-picnic", name: "Gấu đi picnic", subtitle: "Gấu bông · giỏ bánh · khăn picnic", group: "Cartoon", color: "#f8e5c4", ink: "#74523f", filter: "cream", strength: .35, caption: "a bear-y lovely day together" },
  { id: "kitty-club", name: "Hội mèo tinh nghịch", subtitle: "Mèo má hồng · cuộn len · dấu chân", group: "Cartoon", color: "#eee2f2", ink: "#644b72", filter: "rose", strength: .25, caption: "the purr-fect little moments" },
  { id: "bunny-cloud", name: "Thỏ trên mây", subtitle: "Thỏ tai hồng · cầu vồng · sao bay", group: "Cartoon", color: "#e0edf8", ink: "#506b91", filter: "dreamy", strength: .25, caption: "some bunny is happy with you" },
  { id: "comic-pop", name: "Chuyện vui bốn ô", subtitle: "Pop-art · chấm halftone · bong bóng thoại", group: "Cartoon", color: "#ffe49c", ink: "#33313f", filter: "vivid", strength: .25, caption: "four panels, one awesome story" },
];

export function getCartoonComposition(id: CartoonTemplateId) {
  return { side: id === "comic-pop" ? 66 : id === "kitty-club" ? 72 : 78, top: 116, gap: 30, radius: id === "comic-pop" ? 3 : 20, tilted: id === "comic-pop" };
}

const FONT = "'Trebuchet MS', Arial, sans-serif";
function label(x: number, y: number, text: string, size: number, color: string, extra = "") {
  return `<text x="${x}" y="${y}" text-anchor="middle" font-family="${FONT}" font-size="${size}" fill="${color}" font-weight="700" ${extra}>${text}</text>`;
}
function bear(x: number, y: number, scale = 1, tilt = 0, basket = false) {
  return `<g transform="translate(${x} ${y}) rotate(${tilt}) scale(${scale})" stroke="#805b43" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <ellipse cy="39" rx="32" ry="39" fill="#cfaa7f"/><ellipse cx="-23" cy="69" rx="15" ry="12" fill="#dcb88e"/><ellipse cx="23" cy="69" rx="15" ry="12" fill="#dcb88e"/>
    <circle cx="-27" cy="-30" r="15" fill="#cfaa7f"/><circle cx="27" cy="-30" r="15" fill="#cfaa7f"/><circle cx="-27" cy="-30" r="8" fill="#e9c49a" stroke="none"/><circle cx="27" cy="-30" r="8" fill="#e9c49a" stroke="none"/>
    <ellipse cy="-5" rx="39" ry="34" fill="#dcb88e"/><ellipse cy="6" rx="18" ry="14" fill="#f7e1bc" stroke="none"/>
    <g fill="#594133" stroke="none"><ellipse cx="-14" cy="-10" rx="3" ry="4"/><ellipse cx="14" cy="-10" rx="3" ry="4"/><path d="M-5 0Q0-4 5 0L0 6Z"/></g><path d="M0 6v4m0-1q-5 6-10 1m10-1q5 6 10 1" fill="none" stroke-width="1.6"/>
    <g fill="#e2a29a" stroke="none" opacity=".8"><ellipse cx="-26" cy="2" rx="8" ry="5"/><ellipse cx="26" cy="2" rx="8" ry="5"/></g>
    ${basket ? `<path d="M-30 31H30L24 64H-24Z" fill="#c28d58"/><path d="M-20 30Q0-2 20 30" fill="none" stroke="#a97648" stroke-width="4"/><path d="M-25 41H25M-24 51H24M-14 33V63M0 32V64M14 33V63" stroke="#edc791" stroke-width="1.5"/><path d="M-15 29Q-19 7-3 12 0-2 13 14 24 11 20 29" fill="#f5d09c"/>` : `<ellipse cy="39" rx="18" ry="23" fill="#f4dabb" stroke="none"/>`}
    <ellipse cx="-31" cy="30" rx="12" ry="18" fill="#dcb88e" transform="rotate(-25 -31 30)"/><ellipse cx="31" cy="30" rx="12" ry="18" fill="#dcb88e" transform="rotate(25 31 30)"/>
  </g>`;
}
function cat(x: number, y: number, scale = 1, tilt = 0, fill = "#edc29b") {
  return `<g transform="translate(${x} ${y}) rotate(${tilt}) scale(${scale})" stroke="#8c6c77" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">
    <path d="M23 43Q67 31 54 5 44-9 38 6" fill="none" stroke="${fill}" stroke-width="13"/><ellipse cy="40" rx="29" ry="36" fill="${fill}"/><ellipse cx="-16" cy="66" rx="13" ry="8" fill="#fff1dd"/><ellipse cx="16" cy="66" rx="13" ry="8" fill="#fff1dd"/>
    <path d="M-34-13-32-49-11-30Q0-34 11-30L32-49 34-13Q49 22 0 29-49 22-34-13Z" fill="${fill}"/>
    <path d="M-27-22-26-39-16-28M27-22 26-39 16-28" fill="#e9a7b4" stroke="none"/>
    <path d="M-23-7q8-9 15 0m16 0q8-9 15 0" fill="none"/><path d="M-4 1H4L0 6Z" fill="#966e7f" stroke="none"/><path d="M0 6v4m0-1q-5 5-9 0m9 0q5 5 9 0" fill="none" stroke-width="1.5"/>
    <path d="M-26 2-43-2m17 10-16 4M26 2 43-2M26 8 42 12" stroke-width="1.5"/>
    <g fill="#e2a0ad" stroke="none"><ellipse cx="-25" cy="4" rx="7" ry="4"/><ellipse cx="25" cy="4" rx="7" ry="4"/></g><path d="M-12 24 0 31 12 24 10 39 0 33-10 39Z" fill="#ae8ac1"/>
  </g>`;
}
function bunny(x: number, y: number, scale = 1, tilt = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${tilt}) scale(${scale})" stroke="#899bb4" stroke-width="2.3" stroke-linecap="round">
    <ellipse cy="39" rx="27" ry="33" fill="#fffaf1"/><ellipse cx="-19" cy="63" rx="15" ry="9" fill="#fffaf1"/><ellipse cx="19" cy="63" rx="15" ry="9" fill="#fffaf1"/>
    <ellipse cx="-17" cy="-40" rx="12" ry="37" fill="#fffaf1" transform="rotate(-12 -17 -40)"/><ellipse cx="17" cy="-40" rx="12" ry="37" fill="#fffaf1" transform="rotate(12 17 -40)"/>
    <ellipse cx="-17" cy="-43" rx="5" ry="25" fill="#eebcc6" stroke="none" transform="rotate(-12 -17 -40)"/><ellipse cx="17" cy="-43" rx="5" ry="25" fill="#eebcc6" stroke="none" transform="rotate(12 17 -40)"/>
    <ellipse rx="35" ry="29" fill="#fffaf1"/><ellipse cx="-13" cy="-5" rx="2.7" ry="4" fill="#6c7894" stroke="none"/><ellipse cx="13" cy="-5" rx="2.7" ry="4" fill="#6c7894" stroke="none"/>
    <path d="M-4 3Q0 0 4 3L0 7Z" fill="#c995a9" stroke="none"/><path d="M0 7v3m0-1q-4 5-8 0m8 0q4 5 8 0" fill="none" stroke-width="1.3"/>
    <ellipse cx="-23" cy="6" rx="7" ry="4" fill="#eebcc6" stroke="none"/><ellipse cx="23" cy="6" rx="7" ry="4" fill="#eebcc6" stroke="none"/>
    <path d="M-21 36Q-11 20 0 35 11 20 21 36L0 56Z" fill="#d4c6e9" stroke="#b3a3cc"/><ellipse cx="-22" cy="34" rx="8" ry="13" fill="#fffaf1"/><ellipse cx="22" cy="34" rx="8" ry="13" fill="#fffaf1"/>
  </g>`;
}
function cloud(x: number, y: number, scale = 1) {
  return `<path d="M-36 11C-55-6-32-26-20-18-13-48 21-43 25-21 49-31 62 0 40 12Z" fill="#fffdf6" stroke="#b9cedb" stroke-width="1.5" transform="translate(${x} ${y}) scale(${scale})"/>`;
}
function spark(x: number, y: number, color: string) {
  return `<path d="M0-9 3-3 10 0 3 3 0 10-3 3-10 0-3-3Z" fill="${color}" transform="translate(${x} ${y})"/>`;
}
function speech(x: number, y: number, word: string, fill: string, scale = 1, tilt = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${tilt}) scale(${scale})"><path d="M-34-18H34V13H4L-7 26-10 13H-34Z" fill="${fill}" stroke="#33313f" stroke-width="2.5"/>${label(0, 4, word, 13, "#33313f")}</g>`;
}

interface ArtOptions { w: number; h: number; base: string; ink: string; strip: boolean }
export function renderCartoonTemplate(id: CartoonTemplateId, { w, h, ink, strip }: ArtOptions) {
  const cx = w / 2;
  let background = "", overlay = "";
  const heading = (main: string, sub: string) => label(cx, strip ? 59 : 36, main, strip ? 29 : 25, ink) + label(cx, strip ? 82 : 54, sub, 8, ink, 'letter-spacing="2"');
  const footerCharacterY = h - (strip ? 130 : 70);
  if (id === "bear-picnic") {
    background += `<defs><pattern id="picnic-check" width="48" height="48" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="#a5b79a" opacity=".25"/><rect x="24" y="24" width="24" height="24" fill="#a5b79a" opacity=".25"/></pattern></defs><rect width="${w}" height="${h}" fill="url(#picnic-check)"/><rect x="30" y="18" width="${w - 60}" height="${h - 36}" rx="25" fill="#fff5dc" fill-opacity=".55" stroke="#ae916e" stroke-width="2"/>`;
    overlay += heading("bear-y happy days", "THE COZY LITTLE PICNIC CLUB");
    overlay += bear(63, footerCharacterY, strip ? 1 : .65, -9, true) + bear(w - 35, strip ? 682 : h - 148, .48, 12);
    overlay += speech(39, 176, "HI!", "#fff5d7", .65, -10) + spark(w - 43, 135, "#d1a25a");
    for (let y = 300; y < h - 230; y += 260) overlay += `<g transform="translate(31 ${y}) rotate(-13)"><ellipse rx="10" ry="8" fill="#c5a176"/><circle cx="-8" cy="-11" r="4" fill="#c5a176"/><circle cy="-14" r="4" fill="#c5a176"/><circle cx="8" cy="-11" r="4" fill="#c5a176"/></g>`;
  } else if (id === "kitty-club") {
    background += `<rect x="24" y="19" width="${w - 48}" height="${h - 38}" rx="30" fill="#fff4e9" fill-opacity=".3" stroke="#b6a1bf" stroke-width="2"/>`;
    overlay += heading("the purr-fect crew", "SMALL PAWS / BIG HAPPY MOMENTS");
    overlay += cat(62, footerCharacterY, strip ? .96 : .64, -10) + cat(w - 38, strip ? 740 : h - 145, .53, 13, "#d8c5de");
    overlay += `<g transform="translate(${w - 49} ${h - 79})"><circle r="24" fill="#c399bc" stroke="#8c6c93" stroke-width="2"/><path d="M-20-11Q3-6 18 14M-24 0Q-5 9 7 22M-7-23Q-1-5 23 3M-15 18Q-12 2 15-16" fill="none" stroke="#e8d4e6" stroke-width="2"/><path d="M23 4q34-15 13-44t4-36" fill="none" stroke="#a17caa" stroke-width="2"/></g>`;
    overlay += speech(38, 164, "MEOW", "#fff1d3", .65, -10);
    for (let y = 300; y < h - 220; y += 250) overlay += `<g fill="#b89dc7" transform="translate(${w - 27} ${y}) rotate(16)"><ellipse rx="9" ry="7"/><ellipse cx="-9" cy="-10" rx="3" ry="4"/><ellipse cy="-13" rx="3" ry="4"/><ellipse cx="9" cy="-10" rx="3" ry="4"/></g>`;
  } else if (id === "bunny-cloud") {
    background += `<path d="M0 0H${w}V${h}H0Z" fill="url(#graph)" opacity=".5"/>`;
    for (let y = 155; y < h - 180; y += 220) background += cloud(26, y, .63) + cloud(w - 25, y + 100, .52);
    overlay += heading("some bunny loves you", "A LITTLE CLOUD OF HAPPINESS");
    overlay += bunny(62, footerCharacterY + 13, strip ? .98 : .62, -9) + cloud(62, h - (strip ? 42 : 25), strip ? .85 : .65);
    overlay += `<g transform="translate(${w - 53} ${h - 92})"><path d="M-30 8V-3a30 30 0 0 1 60 0V8" fill="none" stroke="#e7b1bd" stroke-width="8"/><path d="M-21 8V-3a21 21 0 0 1 42 0V8" fill="none" stroke="#eed3a0" stroke-width="7"/><path d="M-13 8V-3a13 13 0 0 1 26 0V8" fill="none" stroke="#b3c9b6" stroke-width="6"/>${cloud(-30, 14, .35)}${cloud(30, 14, .35)}</g>`;
    overlay += spark(37, 118, "#d9b979") + spark(w - 35, strip ? 646 : 158, "#c2a8d7") + spark(w - 45, 34, "#d9b979");
  } else {
    background += `<defs><pattern id="comic-dots" width="13" height="13" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.5" fill="#ce9872" opacity=".38"/></pattern></defs><rect width="${w}" height="${h}" fill="url(#comic-dots)"/><path d="M0 20 44 0 0 100ZM${w} ${h - 160}l-50 30 50 70Z" fill="#d97d79"/><path d="M0 ${h - 150}l40 24-40 65Z" fill="#78b9bb"/><rect x="15" y="15" width="${w - 30}" height="${h - 30}" fill="none" stroke="${ink}" stroke-width="3"/>`;
    overlay += heading("OUR LITTLE COMIC", "FOUR PANELS / ONE AWESOME DAY");
    overlay += speech(47, h - 120, "SNAP!", "#8ac6ca", .9, -12) + speech(w - 48, strip ? 649 : h - 123, "WOW!", "#edb1aa", .8, 13);
    overlay += `<g transform="translate(${w - 50} ${h - 65})"><path d="M0-35 8-15 27-26 22-6 40 0 21 9 26 29 7 20 0 40-9 19-28 26-22 7-40 0-20-9-27-28-7-19Z" fill="#f1a692" stroke="${ink}" stroke-width="2.5"/>${label(0, 5, "YAY!", 14, ink)}</g>`;
    overlay += spark(35, 118, "#74b4bb") + spark(w - 35, 119, "#d78079");
  }
  return { background, overlay, footerFont: FONT };
}
