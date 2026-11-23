"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { TEMPLATES, TEMPLATE_GROUPS, findTemplates, getTemplateScene, svgDataUrl, type PhotoTemplate, type TemplateGroup } from "@/lib/templates";
import { renderPhoto, renderTemplatePreview, type Design, type Photo } from "@/lib/photo";
import Icon from "./icon";

function TemplateThumbnail({ template, design, photos }: { template: PhotoTemplate; design: Design; photos: (Photo | null)[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const artRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const selected = design.template === template.id;
  const color = selected ? design.color : template.color;
  const filter = selected ? design.filter : template.filter;
  const strength = selected ? design.filterStrength : template.strength;
  const caption = selected ? design.caption : "";
  const sticker = selected ? design.sticker : "none";
  const scene = useMemo(() => getTemplateScene(template.id, design.layout, { color, caption, date: design.date, showDate: design.showDate }), [template.id, design.layout, color, caption, design.date, design.showDate]);
  const preview = useMemo(() => svgDataUrl(scene.preview), [scene]);
  const hasArtwork = scene.artwork.length > 0;

  useEffect(() => {
    if (!("IntersectionObserver" in window)) { setVisible(true); return; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: "220px" });
    if (artRef.current) observer.observe(artRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setReady(false);
    const complete = photos.every(Boolean);
    if (!visible || (!complete && !hasArtwork)) return;
    let cancelled = false;
    const staging = document.createElement("canvas");
    const thumbnailDesign: Design = { template: template.id, layout: design.layout, color, filter, filterStrength: strength, frame: "plain", caption, date: design.date, showDate: design.showDate, sticker };
    const render = complete ? renderPhoto(staging, photos as Photo[], thumbnailDesign, 240) : renderTemplatePreview(staging, thumbnailDesign);
    void render.then(() => {
      const canvas = canvasRef.current;
      if (cancelled || !canvas) return;
      canvas.width = staging.width; canvas.height = staging.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(staging, 0, 0); setReady(true);
    }).catch(() => { /* The full-size studio preview reports export errors. */ });
    return () => { cancelled = true; };
  }, [visible, photos, hasArtwork, template.id, design.layout, color, filter, strength, caption, design.date, design.showDate, sticker]);

  return <span ref={artRef} className={`template-art ${design.layout}`}><img src={preview} alt="" hidden={ready} loading="lazy"/><canvas ref={canvasRef} hidden={!ready} aria-hidden="true"/></span>;
}

interface Props { design: Design; photos: (Photo | null)[]; onChange: (design: Design) => void; busy: boolean }
export default function TemplateGallery({ design, photos, onChange, busy }: Props) {
  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState<TemplateGroup>("Tất cả");
  const [query, setQuery] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const active = TEMPLATES.find(template => template.id === design.template);
  const matches = findTemplates(group, query);
  useEffect(() => {
    if (open && !dialogRef.current?.open) dialogRef.current?.showModal();
    else if (!open && dialogRef.current?.open) dialogRef.current.close();
  }, [open]);

  function choose(template: PhotoTemplate) {
    onChange({ ...design, template: template.id, color: template.color, filter: template.filter, filterStrength: template.strength, sticker: "none", frame: "plain" });
    setOpen(false);
  }

  return <section className="setting-section template-section" aria-label="Mẫu ảnh theo chủ đề">
    <div className="template-heading"><span>Bộ sưu tập khung ảnh</span><span>{TEMPLATES.length} thiết kế</span></div>
    <button className="active-template" onClick={() => setOpen(true)} disabled={busy} aria-label="Chọn mẫu khung">
      {active ? <><TemplateThumbnail template={active} design={design} photos={photos}/><span className="active-template-copy"><strong>{active.name}</strong><span>{active.subtitle}</span><span className="template-browse">Khám phá bộ sưu tập <Icon name="image" size={15}/></span></span></> : <span className="active-template-copy"><strong>Khung do bạn phối</strong><span>Chọn một thiết kế có sẵn để thử phong cách mới.</span><span className="template-browse">Khám phá bộ sưu tập <Icon name="image" size={15}/></span></span>}
    </button>
    {active && <button className="text-button custom-template-button" onClick={() => onChange({ ...design, template: "custom", color: "#fffdf8", filter: "original", filterStrength: 1, frame: "plain", sticker: "none" })} disabled={busy}>Tự phối khung</button>}
    <dialog ref={dialogRef} className="template-dialog" aria-labelledby="template-dialog-heading" onCancel={() => setOpen(false)} onClose={() => setOpen(false)}>
      <div className="template-dialog-top"><div><span className="collection-eyebrow">MỘT CHÚT. / FRAME COLLECTION</span><h2 id="template-dialog-heading">Một khung hình, một câu chuyện.</h2><p>Chọn cả một phong cách. Ảnh, lời nhắn và ngày chụp vẫn là của bạn.</p></div><button className="template-dialog-close" onClick={() => setOpen(false)} aria-label="Đóng bộ sưu tập"><Icon name="close"/></button></div>
      <div className="template-search-row"><label className="template-search"><span>Tìm mẫu bạn thích</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Thử: gia đình, khủng long, oval, pastel…"/></label><span className="template-result-count" role="status">{matches.length}/{TEMPLATES.length} mẫu</span></div>
      <div className="template-groups" role="group" aria-label="Chủ đề mẫu khung">{TEMPLATE_GROUPS.map(item => <button key={item} onClick={() => setGroup(item)} aria-pressed={group === item}>{item}<span aria-hidden="true">{item === "Tất cả" ? TEMPLATES.length : TEMPLATES.filter(template => template.group === item).length}</span></button>)}</div>
      <div className="template-gallery">{open && matches.map(template => <button className={`template-card ${design.template === template.id ? "chosen" : ""}`} key={template.id} onClick={() => choose(template)} aria-label={`Mẫu ${template.name}`} aria-pressed={design.template === template.id}>
        <span className={`template-card-stage ${template.id}`}><TemplateThumbnail template={template} design={design} photos={photos}/>{design.template === template.id && <span className="template-current"><Icon name="check" size={13}/>Đang dùng</span>}</span>
        <span className="template-card-copy"><strong>{template.name}{template.isNew && <span className="template-new">Mới</span>}</strong><span>{template.subtitle}</span></span>
      </button>)}</div>
      {matches.length === 0 && <div className="template-empty"><Icon name="image" size={32}/><p>Chưa có mẫu khớp với tìm kiếm của bạn.</p><button className="secondary-button" onClick={() => { setQuery(""); setGroup("Tất cả"); }}>Xem tất cả mẫu</button></div>}
      <p className="template-gallery-note">{photos.every(Boolean) ? "Bạn đang xem các mẫu với chính 4 ảnh của mình." : "Hình người chỉ minh họa vị trí ảnh. Chụp hoặc tải 4 ảnh để xem mẫu với ảnh của bạn."}</p>
    </dialog>
  </section>;
}
