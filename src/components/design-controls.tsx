"use client";

import { useEffect, useRef, useState } from "react";
import { FILTERS, FILTER_GROUPS, getFilterMatrix, type Filter, type FilterGroup } from "@/lib/filters";
import { COLORS, FRAMES, STICKERS, drawFrame, getFramePalette, type FrameStyle } from "@/lib/frames";
import { getGeometry, type Design, type Photo } from "@/lib/photo";
import Icon from "./icon";

export function FilterDefinitions({ prefix, filter, strength }: { prefix: string; filter: Filter; strength: number }) {
  return <svg className="filter-definitions" width="0" height="0" aria-hidden="true" focusable="false"><defs>
    {FILTERS.map(item => <filter key={item.id} id={`${prefix}-${item.id}`} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values={item.matrix.join(" ")}/></filter>)}
    <filter id={`${prefix}-current`} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values={getFilterMatrix(filter, strength).join(" ")}/></filter>
  </defs></svg>;
}

function FrameSample({ style, color }: { style: FrameStyle; color: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current, ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const g = getGeometry("grid"), palette = getFramePalette(color);
    ctx.save(); ctx.scale(canvas.width / g.width, canvas.height / g.height);
    drawFrame(ctx, g, color, style);
    ctx.fillStyle = palette.soft;
    for (let i = 0; i < 4; i++) ctx.fillRect(g.margin + i % 2 * (g.photoWidth + g.gap), g.margin + Math.floor(i / 2) * (g.photoHeight + g.gap), g.photoWidth, g.photoHeight);
    ctx.fillStyle = palette.accent; ctx.fillRect(g.width * .35, g.height - 125, g.width * .3, 14);
    ctx.restore();
  }, [style, color]);
  return <canvas ref={ref} width={160} height={121} aria-hidden="true"/>;
}

interface Props { design: Design; onChange: (design: Design) => void; busy: boolean; sample: Photo | null; filterPrefix: string }

export default function DesignControls({ design, onChange, busy, sample, filterPrefix }: Props) {
  const [group, setGroup] = useState<FilterGroup>("Tất cả");
  const filters = FILTERS.filter(item => group === "Tất cả" || item.group === group);
  const colorName = COLORS.find(color => color.value === design.color)?.name ?? design.color.toUpperCase();
  const filterName = FILTERS.find(item => item.id === design.filter)?.name;
  return <>
    <fieldset className="setting-section filter-section" disabled={busy}>
      <legend>Bộ lọc<span>{FILTERS.length} sắc thái</span></legend>
      <div className="filter-groups" role="group" aria-label="Nhóm bộ lọc">{FILTER_GROUPS.map(item => <button key={item} aria-pressed={group === item} onClick={() => setGroup(item)}>{item}</button>)}</div>
      <div className="filter-options">{filters.map(item => <button key={item.id} aria-pressed={design.filter === item.id} onClick={() => onChange({ ...design, filter: item.id })} className={`filter-option ${design.filter === item.id ? "chosen" : ""}`}>
        <span className="filter-sample" style={{ filter: item.id === "original" ? "none" : `url(#${filterPrefix}-${item.id})` }}>{sample ? <img src={sample.source} alt=""/> : <><span className="sample-sun"/><span className="sample-mountain"/></>}</span>
        <span>{item.name}</span>
      </button>)}</div>
      <div className="filter-strength"><label htmlFor="filter-strength">Độ đậm · {filterName}<output>{Math.round(design.filterStrength * 100)}%</output></label><input id="filter-strength" type="range" min={0} max={100} value={Math.round(design.filterStrength * 100)} disabled={design.filter === "original"} onChange={event => onChange({ ...design, filterStrength: Number(event.target.value) / 100 })}/></div>
    </fieldset>
    <fieldset className="setting-section color-section" disabled={busy}>
      <legend>Màu khung<span>{colorName}</span></legend>
      <div className="color-options">{COLORS.map(color => <button key={color.value} title={color.name} aria-label={`Khung ${color.name}`} aria-pressed={design.color === color.value} className={`color-swatch ${design.color === color.value ? "chosen" : ""}`} style={{ background: color.value, color: getFramePalette(color.value).ink }} onClick={() => onChange({ ...design, color: color.value })}>{design.color === color.value && <Icon name="check" size={17}/>}</button>)}</div>
      <label className="custom-color" htmlFor="custom-frame-color"><input id="custom-frame-color" type="color" value={design.color} onChange={event => onChange({ ...design, color: event.target.value })}/><span>Màu khung tùy chọn</span><span>{design.color.toUpperCase()}</span></label>
    </fieldset>
    {design.template === "custom" && <fieldset className="setting-section frame-section" disabled={busy}>
      <legend>Chi tiết viền<span>{FRAMES.length} kiểu phối</span></legend>
      <div className="frame-options">{FRAMES.map(frame => <button key={frame.id} aria-label={`Viền ${frame.name}`} aria-pressed={design.frame === frame.id} className={`frame-option ${design.frame === frame.id ? "chosen" : ""}`} onClick={() => onChange({ ...design, frame: frame.id })}>
        <FrameSample style={frame.id} color={design.color}/><span>{frame.name}</span>{design.frame === frame.id && <span className="frame-choice-check"><Icon name="check" size={12}/></span>}
      </button>)}</div>
      <p className="decoration-hint">Phối mọi kiểu viền với màu khung và sticker bạn thích.</p>
    </fieldset>}
    <fieldset className="setting-section sticker-section" disabled={busy}><legend>Chút đáng yêu<span>{STICKERS.length - 1} bộ sticker</span></legend><div className="sticker-options">{STICKERS.map(sticker => <button key={sticker.id} aria-pressed={design.sticker === sticker.id} className={design.sticker === sticker.id ? "chosen" : ""} onClick={() => onChange({ ...design, sticker: sticker.id })}><span aria-hidden="true">{sticker.symbol}</span>{sticker.name}</button>)}</div></fieldset>
  </>;
}
