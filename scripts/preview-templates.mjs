import { mkdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";
import { TEMPLATES, getTemplateScene, escapeSvg } from "../src/lib/templates.ts";
import { PLAYFUL_TEMPLATES } from "../src/lib/playful-templates.ts";

await mkdir("test-results/templates", { recursive: true });
const tiles = [];
for (const template of TEMPLATES) {
  const artworkData = {};
  for (const asset of getTemplateScene(template.id, "strip").artwork) artworkData[asset.source] = `data:image/png;base64,${(await readFile(`public${asset.source}`)).toString("base64")}`;
  const scene = getTemplateScene(template.id, "strip", { artworkData });
  const grid = getTemplateScene(template.id, "grid", { artworkData });
  await writeFile(`test-results/templates/${template.id}-strip.svg`, scene.preview);
  await writeFile(`test-results/templates/${template.id}-grid.svg`, grid.preview);
  const preview = await sharp(Buffer.from(scene.preview)).resize({ width: 210 }).png().toBuffer();
  const gridPreview = await sharp(Buffer.from(grid.preview)).resize({ width: 280 }).png().toBuffer();
  const label = Buffer.from(`<svg width="280" height="50"><text x="140" y="21" text-anchor="middle" font-family="Arial" font-size="17" fill="#302d3b">${escapeSvg(template.name)}</text><text x="140" y="41" text-anchor="middle" font-family="Arial" font-size="10" fill="#776580">${escapeSvg(template.subtitle)}</text></svg>`);
  tiles.push({ preview, gridPreview, label });
}
async function contactSheet(selected, path) {
  const items = [];
  selected.forEach((tile, index) => {
    const x = index % 4 * 330 + 60, y = Math.floor(index / 4) * 850 + 80;
    items.push({ input: tile.preview, left: x + 35, top: y }, { input: tile.gridPreview, left: x, top: y + 553 }, { input: tile.label, left: x, top: y + 773 });
  });
  await sharp({ create: { width: 1440, height: Math.ceil(selected.length / 4) * 850 + 90, channels: 4, background: "#ece8f0" } }).composite(items).png().toFile(path);
}
await contactSheet(tiles, "test-results/template-collection.png");
await contactSheet(tiles.filter((_, index) => TEMPLATES[index].group === "Cartoon"), "test-results/template-cartoon.png");
await contactSheet(tiles.filter((_, index) => getTemplateScene(TEMPLATES[index].id, "strip").artwork.length > 0), "test-results/template-character-collection.png");
const familyIds = new Set(PLAYFUL_TEMPLATES.map(template => template.id));
const familyTiles = tiles.filter((_, index) => familyIds.has(TEMPLATES[index].id));
await contactSheet(familyTiles, "test-results/template-family-kids.png");
for (let start = 0; start < familyTiles.length; start += 8) await contactSheet(familyTiles.slice(start, start + 8), `test-results/template-family-kids-${start / 8 + 1}.png`);
for (let start = 0; start < tiles.length; start += 8) await contactSheet(tiles.slice(start, start + 8), `test-results/template-collection-${start / 8 + 1}.png`);
console.log(`${TEMPLATES.length} strip SVGs, ${TEMPLATES.length} grid SVGs and ${Math.ceil(tiles.length / 8)} contact sheet pages rendered successfully.`);
