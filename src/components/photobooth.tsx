"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import Icon from "./icon";
import PhotoEditor from "./photo-editor";
import { COLORS, FILTERS, canvasBlob, drawCover, getGeometry, importPhoto, movePhoto, normalizeCrop, renderPhoto, type Design, type Photo, type Sticker } from "@/lib/photo";

type CameraStatus = "off" | "requesting" | "active";
const POSES = ["Một nụ cười thật tự nhiên nhé!", "Thử nghiêng đầu một chút nào.", "Một chiếc trái tim dành cho bạn!", "Tấm cuối rồi, cứ là chính mình."];
const STICKERS: { id: Sticker; name: string; symbol: string }[] = [
  { id: "none", name: "Không", symbol: "—" }, { id: "stars", name: "Lấp lánh", symbol: "✦" },
  { id: "hearts", name: "Trái tim", symbol: "♡" }, { id: "flowers", name: "Hoa nhỏ", symbol: "✿" },
];

function pause(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) { reject(new DOMException("Cancelled", "AbortError")); return; }
    const abort = () => { clearTimeout(timer); reject(new DOMException("Cancelled", "AbortError")); };
    const timer = window.setTimeout(() => { signal.removeEventListener("abort", abort); resolve(); }, ms);
    signal.addEventListener("abort", abort, { once: true });
  });
}

function LayoutMini({ grid = false }: { grid?: boolean }) {
  return <span className={`layout-mini ${grid ? "is-grid" : ""}`} aria-hidden="true">{[0, 1, 2, 3].map(i => <i key={i} />)}</span>;
}

export default function Photobooth() {
  const [step, setStep] = useState(1);
  const [photos, setPhotos] = useState<(Photo | null)[]>([null, null, null, null]);
  const [design, setDesign] = useState<Design>({ layout: "strip", filter: "original", color: COLORS[0].value, caption: "", date: "", showDate: true, sticker: "none" });
  const [seconds, setSeconds] = useState(3);
  const [mirror, setMirror] = useState(true);
  const [sound, setSound] = useState(false);
  const [camera, setCamera] = useState<CameraStatus>("off");
  const [ready, setReady] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [device, setDevice] = useState("");
  const [capturing, setCapturing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [shot, setShot] = useState(0);
  const [flash, setFlash] = useState(false);
  const [retake, setRetake] = useState<number | null>(null);
  const [editing, setEditing] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [rendering, setRendering] = useState(false);
  const [rendered, setRendered] = useState<{ design: Design; photos: (Photo | null)[] } | null>(null);
  const [exporting, setExporting] = useState(false);
  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const [dialog, setDialog] = useState<"help" | "privacy" | "reset" | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadSlotRef = useRef<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestRef = useRef(0);
  const captureRef = useRef<AbortController | null>(null);
  const importRef = useRef(0);
  const audioRef = useRef<AudioContext | null>(null);
  const downloadUrls = useRef<Set<string>>(new Set());
  const complete = photos.every(Boolean);
  const count = photos.filter(Boolean).length;
  const busy = capturing || importing;
  const previewReady = rendered?.design === design && rendered?.photos === photos;
  const filter = FILTERS.find(item => item.id === design.filter)!;

  useEffect(() => {
    setDesign(current => ({ ...current, date: new Intl.DateTimeFormat("vi-VN").format(new Date()) }));
    const urls = downloadUrls.current;
    return () => {
      requestRef.current += 1; importRef.current += 1;
      captureRef.current?.abort();
      streamRef.current?.getTracks().forEach(track => track.stop());
      void audioRef.current?.close();
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const stopCamera = useCallback(() => {
    requestRef.current += 1;
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    setCamera("off"); setReady(false);
  }, []);

  useEffect(() => {
    if (camera !== "active" || step !== 1 || !videoRef.current) return;
    const video = videoRef.current;
    video.srcObject = streamRef.current;
    void video.play().catch(() => { setError("Không phát được camera. Hãy thử bật lại camera."); stopCamera(); });
  }, [camera, step, stopCamera]);

  useEffect(() => {
    const onHidden = () => {
      if (document.hidden) { captureRef.current?.abort(); stopCamera(); }
    };
    document.addEventListener("visibilitychange", onHidden);
    return () => document.removeEventListener("visibilitychange", onHidden);
  }, [stopCamera]);

  useEffect(() => {
    const node = dialogRef.current;
    if (dialog && node && !node.open) node.showModal();
    else if (!dialog && node?.open) node.close();
  }, [dialog]);

  useEffect(() => {
    if (step === 1 || !complete) return;
    let cancelled = false;
    setRendering(true); setRendered(null); setError("");
    const staging = document.createElement("canvas");
    void renderPhoto(staging, photos as Photo[], design).then(() => {
      if (cancelled || !canvasRef.current) return;
      const canvas = canvasRef.current;
      canvas.width = staging.width; canvas.height = staging.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Không thể tạo ảnh xem trước.");
      ctx.drawImage(staging, 0, 0);
      setRendered({ design, photos });
    }).catch(err => { if (!cancelled) setError(err instanceof Error ? err.message : "Không thể ghép ảnh."); })
      .finally(() => { if (!cancelled) setRendering(false); });
    return () => { cancelled = true; };
  }, [photos, design, step, complete]);

  async function startCamera(selected = device) {
    if (capturing || importing) return;
    stopCamera(); setError(""); setNotice("");
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      setError("Camera cần HTTPS hoặc localhost. Bạn vẫn có thể tải ảnh từ thiết bị."); return;
    }
    const request = ++requestRef.current;
    setCamera("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { ...(selected ? { deviceId: { exact: selected } } : { facingMode: "user" }), width: { ideal: 1920 }, height: { ideal: 1200 } }, audio: false,
      });
      if (request !== requestRef.current) { stream.getTracks().forEach(track => track.stop()); return; }
      streamRef.current = stream;
      stream.getVideoTracks()[0].addEventListener("ended", () => {
        if (streamRef.current === stream) { captureRef.current?.abort(); stopCamera(); setError("Camera đã ngắt kết nối. Hãy bật lại hoặc tải ảnh từ máy."); }
      });
      setCamera("active");
      const cameras = (await navigator.mediaDevices.enumerateDevices().catch(() => [])).filter(item => item.kind === "videoinput");
      if (request === requestRef.current) {
        setDevices(cameras);
        setDevice(stream.getVideoTracks()[0].getSettings().deviceId || selected);
      }
    } catch (err) {
      if (request !== requestRef.current) return;
      stopCamera();
      const name = err instanceof DOMException ? err.name : "";
      if (name === "NotFoundError" || name === "OverconstrainedError") setDevice("");
      setError(name === "NotAllowedError" ? "Bạn chưa cấp quyền camera. Hãy cho phép trong trình duyệt hoặc tải ảnh từ thiết bị."
        : name === "NotFoundError" ? "Không tìm thấy camera. Bạn có thể tải ảnh từ thiết bị."
        : name === "NotReadableError" ? "Camera có thể đang được ứng dụng khác sử dụng. Hãy đóng ứng dụng đó và thử lại."
        : "Không mở được camera. Hãy chọn camera khác, thử lại hoặc tải ảnh từ thiết bị.");
    }
  }

  function goToStep(next: number) {
    if (busy || (next > 1 && !complete)) return;
    setError(""); setNotice(""); setRetake(null);
    if (next !== 1) stopCamera();
    setStep(next);
  }

  function playShutter() {
    if (!sound || !audioRef.current) return;
    const context = audioRef.current;
    const oscillator = context.createOscillator(), gain = context.createGain();
    oscillator.type = "triangle"; oscillator.frequency.setValueAtTime(680, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(180, context.currentTime + .09);
    gain.gain.setValueAtTime(.08, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + .1);
    oscillator.connect(gain); gain.connect(context.destination);
    oscillator.start(); oscillator.stop(context.currentTime + .11);
  }

  async function capture() {
    if (!ready || captureRef.current || importing) return;
    const controller = new AbortController(); captureRef.current = controller;
    setCapturing(true); setError(""); setNotice("");
    if (sound) {
      try { audioRef.current ??= new AudioContext(); await audioRef.current.resume(); } catch { /* Sound is optional. */ }
    }
    const draft = [...photos];
    const slots = retake !== null ? [retake] : draft.flatMap((photo, i) => photo ? [] : [i]);
    try {
      for (const index of slots) {
        setShot(index);
        for (let remaining = seconds; remaining > 0; remaining--) { setCountdown(remaining); await pause(1000, controller.signal); }
        setCountdown(null);
        const video = videoRef.current;
        if (!video || video.readyState < 2 || !streamRef.current?.active) throw new Error("Camera chưa sẵn sàng. Hãy bật lại camera.");
        const canvas = document.createElement("canvas");
        canvas.width = 1600; canvas.height = 1000;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Không thể chụp ảnh trên trình duyệt này.");
        if (mirror) { ctx.translate(canvas.width, 0); ctx.scale(-1, 1); }
        drawCover(ctx, video, video.videoWidth, video.videoHeight, 0, 0, canvas.width, canvas.height);
        draft[index] = { id: crypto.randomUUID(), source: canvas.toDataURL("image/jpeg", .95) };
        setPhotos([...draft]); setFlash(true); playShutter();
        await pause(180, controller.signal); setFlash(false);
        if (index !== slots[slots.length - 1]) await pause(350, controller.signal);
      }
      setRetake(null);
      if (draft.every(Boolean)) { stopCamera(); setStep(2); }
    } catch (err) {
      if (!(err instanceof DOMException && err.name === "AbortError")) setError(err instanceof Error ? err.message : "Chụp ảnh thất bại. Hãy thử lại.");
    } finally {
      captureRef.current = null; setCapturing(false); setCountdown(null); setFlash(false);
    }
  }

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []); event.target.value = "";
    if (!files.length || busy) return;
    const target = uploadSlotRef.current; uploadSlotRef.current = null;
    const slots = retake !== null ? [retake] : target !== null ? [target] : photos.flatMap((photo, i) => photo ? [] : [i]);
    if (files.length > slots.length) { setError(`Bạn chỉ cần chọn ${slots.length} ảnh cho các vị trí còn lại.`); return; }
    const request = ++importRef.current;
    setImporting(true); setError(""); setNotice("");
    try {
      const imported = await Promise.all(files.map(importPhoto));
      if (request !== importRef.current) return;
      const draft = [...photos]; imported.forEach((photo, i) => { draft[slots[i]] = photo; });
      setPhotos(draft); setRetake(null);
      if (draft.every(Boolean)) { stopCamera(); setStep(2); }
    } catch (err) { if (request === importRef.current) setError(err instanceof Error ? err.message : "Không đọc được ảnh."); }
    finally { if (request === importRef.current) setImporting(false); }
  }

  async function download() {
    if (!complete || !previewReady || rendering || exporting || !canvasRef.current) return;
    setExporting(true); setError(""); setNotice("");
    try {
      const blob = await canvasBlob(canvasRef.current, format);
      const url = URL.createObjectURL(blob); downloadUrls.current.add(url);
      const link = document.createElement("a"); link.href = url;
      link.download = `mot-chut-${new Date().toISOString().slice(0, 10)}.${format === "jpeg" ? "jpg" : "png"}`;
      document.body.append(link); link.click(); link.remove();
      window.setTimeout(() => { URL.revokeObjectURL(url); downloadUrls.current.delete(url); }, 60_000);
      setNotice("Ảnh đã sẵn sàng tải xuống. Nếu ảnh mở ở tab mới, hãy nhấn giữ để lưu vào thiết bị.");
    } catch (err) { setError(err instanceof Error ? err.message : "Không thể tải ảnh. Hãy thử lại."); }
    finally { setExporting(false); }
  }

  function reset() {
    captureRef.current?.abort(); stopCamera(); importRef.current += 1;
    setPhotos([null, null, null, null]); setStep(1); setRetake(null); setEditing(null); setRendered(null); setError(""); setNotice(""); setDialog(null);
    setDesign(current => ({ ...current, date: new Intl.DateTimeFormat("vi-VN").format(new Date()) }));
  }

  function applyPhotoEdit(photo: Photo, position: number) {
    if (editing === null || !complete) return;
    const updated = [...photos] as Photo[];
    updated[editing] = photo;
    setPhotos(movePhoto(updated, editing, position));
    setEditing(null); setError(""); setNotice("Đã cập nhật khung hình và thứ tự ảnh.");
  }

  function chooseRetake(index: number) {
    if (busy) return;
    setRetake(index); setStep(1); setError(""); setNotice("");
  }

  function chooseUpload(index: number | null = null) {
    uploadSlotRef.current = index;
    if (fileRef.current) {
      fileRef.current.multiple = index === null && retake === null;
      fileRef.current.click();
    }
  }

  const g = getGeometry(design.layout);
  return <>
    <header className="site-header">
      <a className="brand" href="/" aria-label="Một chút — Trang chủ"><span className="brand-mark"><i/><i/><i/><i/></span>một chút<span className="brand-dot">.</span></a>
      <nav aria-label="Điều hướng chính"><a href="#studio" className="nav-active">Studio</a><button onClick={() => setDialog("help")}>Cách chụp</button></nav>
      <button className="privacy-pill" onClick={() => setDialog("privacy")}><Icon name="shield" size={16}/><span>Khoảnh khắc của riêng bạn</span></button>
    </header>

    <main>
      <section className="intro" aria-labelledby="main-heading">
        <div className="intro-copy"><div className="eyebrow"><span/> CHIẾC PHOTOBOOTH NHỎ CỦA BẠN</div>
          <h1 id="main-heading">Một chút tạo dáng.<br/><span>Thật nhiều niềm vui.</span><svg className="heading-star" viewBox="0 0 50 56" aria-hidden="true"><path d="m25 2 5 19 18 7-18 5-5 21-6-21L2 28l17-7Z" fill="#efcc67" stroke="#c4a13f" strokeWidth="1.5"/></svg></h1>
          <p>Gom những khoảnh khắc đáng yêu vào một dải ảnh.<br className="desktop-break"/> Chỉ cần bạn, một chiếc camera và một nụ cười.</p>
        </div>
        <div className="intro-note" aria-hidden="true"><span className="note-spark">✧</span><div className="note-paper"><span>cười lên nhé!</span><svg viewBox="0 0 100 80"><path d="M28 38v-8m44 8v-8M27 50q23 28 46 0" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/><path d="m42 11 8 7 8-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg><small>you look lovely today</small></div><span className="note-caption">một chút là đủ vui ♡</span></div>
      </section>

      <section id="studio" className="studio" aria-label="Studio chụp ảnh">
        <div className="studio-top"><div className="steps" aria-label="Các bước chụp ảnh">{["Chụp ảnh", "Sáng tạo", "Lưu kỷ niệm"].map((label, i) => <button key={label} aria-current={step === i + 1 ? "step" : undefined} className={`step ${step === i + 1 ? "current" : ""} ${step > i + 1 ? "done" : ""}`} onClick={() => goToStep(i + 1)} disabled={busy || (i > 0 && !complete)}><span>{step > i + 1 ? <Icon name="check" size={14}/> : i + 1}</span>{label}</button>)}</div>
          <button className="text-button reset-button" onClick={() => count ? setDialog("reset") : reset()} disabled={busy}><Icon name="refresh" size={15}/>Bắt đầu lại</button>
        </div>

        <div className="studio-body">
          <div className="workspace">
            <div className="workspace-label"><span className="flex items-center gap-2"><Icon name={step === 1 ? "camera" : "image"} size={17}/>{step === 1 ? "Góc nhỏ của bạn" : "Kỷ niệm của bạn"}</span><span className={`camera-state ${ready ? "on" : ""}`}><i/>{step !== 1 ? "Ảnh xem trước" : camera === "requesting" ? "Đang kết nối" : ready ? "Camera đã sẵn sàng" : "Camera chưa bật"}</span></div>

            {step === 1 ? <div className={`viewfinder ${ready ? "live" : ""}`}>
              <video ref={videoRef} autoPlay playsInline muted onLoadedData={() => setReady(true)} onError={() => { setError("Camera không phát được hình. Hãy bật lại camera hoặc tải ảnh."); stopCamera(); }} style={{ transform: mirror ? "scaleX(-1)" : "none", filter: filter.css, opacity: ready ? 1 : 0 }} aria-label="Hình ảnh trực tiếp từ camera"/>
              {!ready && <div className="camera-placeholder"><div className="camera-art" aria-hidden="true"><span className="art-spark one">✦</span><Icon name="camera" size={62}/><span className="art-spark two">✧</span><span className="art-heart">♡</span></div><h2>{camera === "requesting" ? "Chờ camera một chút nhé…" : "Xin chào, người đáng yêu!"}</h2><p>{camera === "requesting" ? "Cho phép truy cập camera trong trình duyệt để bắt đầu." : "Bật camera, thả lỏng và cứ là chính mình."}</p><button className="primary-button camera-start" onClick={() => void startCamera()} disabled={camera === "requesting" || busy}><Icon name="camera" size={18}/>{camera === "requesting" ? "Đang chờ cấp quyền…" : "Bật camera"}</button><span className="permission-note">Chỉ sử dụng camera, không thu âm</span></div>}
              <div className="viewfinder-corner tl"/><div className="viewfinder-corner tr"/><div className="viewfinder-corner bl"/><div className="viewfinder-corner br"/>
              {ready && !capturing && <span className="live-label">{retake !== null ? `Chụp lại ảnh ${retake + 1}` : "Một nụ cười là đủ xinh"}</span>}
              {capturing && <div className="countdown-layer"><span className="shot-label">ẢNH {shot + 1} / 4</span>{countdown !== null && <strong key={`${shot}-${countdown}`}>{countdown}</strong>}<span className="pose-tip">{POSES[shot]}</span></div>}
              {flash && <div className="shutter-flash"/>}
            </div> : <div className={`result-stage ${design.layout}`} aria-busy={rendering}><div className="result-grid"/><canvas ref={canvasRef} aria-label="Thành phẩm photobooth" role="img" data-testid="result-canvas" style={{ aspectRatio: `${g.width} / ${g.height}` }}/><span className="result-note">{step === 2 ? "một chút sáng tạo, một chiếc ảnh xinh ✧" : "mang niềm vui này về nhé ♡"}</span>{rendering && <span className="render-status" role="status">Đang ghép ảnh…</span>}</div>}

            {step === 1 && <div className="camera-toolbar"><div className="flex items-center gap-2"><button className={`tool-button ${mirror ? "selected" : ""}`} onClick={() => setMirror(!mirror)} disabled={busy} aria-pressed={mirror}><Icon name="flip" size={16}/>Lật gương</button><label className="timer-control"><Icon name="timer" size={16}/><select aria-label="Thời gian đếm ngược" value={seconds} onChange={e => setSeconds(Number(e.target.value))} disabled={busy}><option value={3}>3 giây</option><option value={5}>5 giây</option></select></label></div><button className="text-button" onClick={() => setDialog("help")} aria-label="Hướng dẫn chụp"><Icon name="help" size={18}/></button></div>}

            <div className="photos-heading"><span>{step === 1 ? "Những khoảnh khắc của bạn" : "Chỉnh khung hình, đổi thứ tự hoặc chụp lại từng ảnh."}</span><span>{count}/4 ảnh</span></div>
            <div className="photo-tray">{photos.map((photo, index) => {
              const crop = normalizeCrop(photo?.crop);
              const origin = `${crop.x * 100}% ${crop.y * 100}%`;
              return <div className="photo-card" key={index}><button className={`photo-slot ${photo ? "filled" : ""} ${retake === index ? "retaking" : ""} ${capturing && shot === index ? "shooting" : ""}`} disabled={busy} onClick={() => photo ? chooseRetake(index) : chooseUpload(index)} aria-label={photo ? `Chụp lại ảnh ${index + 1}` : `Thêm ảnh ${index + 1}`}>
                {photo ? <><img src={photo.source} alt={`Ảnh ${index + 1} đã chụp`} style={{ filter: filter.css, objectPosition: origin, transformOrigin: origin, transform: `scale(${crop.zoom})` }}/><span className="retake-label"><Icon name="refresh" size={15}/>Chụp lại</span></> : <><Icon name="image" size={22}/><span>Ảnh {index + 1}</span></>}
                <small>{String(index + 1).padStart(2, "0")}</small></button>
                {step === 2 && photo && <button className="photo-edit-button" onClick={() => setEditing(index)} aria-label={`Chỉnh khung hình ảnh ${index + 1}`}><Icon name="image" size={15}/>Chỉnh ảnh</button>}
              </div>;
            })}</div>

            {retake !== null && <div className="retake-notice"><span>Đang thay ảnh {retake + 1}. Các ảnh khác được giữ lại.</span><button onClick={() => setRetake(null)} disabled={busy}>Hủy chọn</button></div>}
            {step === 1 && <div className="capture-actions">{capturing ? <button className="primary-button capture-button" onClick={() => captureRef.current?.abort()}><Icon name="stop"/>Dừng chụp</button> : <button className="primary-button capture-button" onClick={() => complete && retake === null ? goToStep(2) : void capture()} disabled={importing || ((!ready || camera !== "active") && !(complete && retake === null))}><Icon name={complete && retake === null ? "sparkles" : "camera"}/>{importing ? "Đang đọc ảnh…" : retake !== null ? `Chụp lại ảnh ${retake + 1}` : complete ? "Trang trí ảnh" : count ? `Chụp ${4 - count} ảnh còn lại` : "Bắt đầu chụp"}{!complete && !importing && retake === null && <span>4 ảnh · tự động</span>}</button>}
              <button className="upload-button" onClick={() => chooseUpload()} disabled={busy || (complete && retake === null)}><Icon name="upload" size={16}/>{retake !== null ? "Thay bằng ảnh từ máy" : "Hoặc tải ảnh từ thiết bị"}</button></div>}
          </div>

          <aside className="settings-panel" aria-label="Tùy chỉnh ảnh"><div className="panel-heading"><span className="panel-icon"><Icon name={step === 3 ? "download" : "sparkles"} size={20}/></span><div><h2>{step === 3 ? "Mang kỷ niệm về" : "Thêm một chút riêng"}</h2><p>{step === 3 ? "Ảnh xinh đã sẵn sàng rồi." : "Chiếc ảnh này mang màu sắc của bạn."}</p></div></div>
            {step !== 3 ? <>
              <fieldset className="setting-section" disabled={busy}><legend>Bố cục ảnh<span>4 khoảnh khắc</span></legend><div className="layout-options">{(["strip", "grid"] as const).map(layout => <button key={layout} onClick={() => setDesign({ ...design, layout })} aria-pressed={design.layout === layout} className={`layout-option ${design.layout === layout ? "chosen" : ""}`}><LayoutMini grid={layout === "grid"}/><span>{layout === "strip" ? "Dải ảnh dọc" : "Lưới 2 × 2"}</span>{design.layout === layout && <span className="choice-check"><Icon name="check" size={11}/></span>}</button>)}</div></fieldset>
              <fieldset className="setting-section" disabled={busy}><legend>Bộ lọc<span>Mood hôm nay?</span></legend><div className="filter-options">{FILTERS.map(item => <button key={item.id} aria-pressed={design.filter === item.id} onClick={() => setDesign({ ...design, filter: item.id })} className={`filter-option ${design.filter === item.id ? "chosen" : ""}`}><span className={`filter-sample ${item.id}`} style={{ filter: item.css }}><span className="sample-sun"/><span className="sample-mountain"/></span><span>{item.name}</span></button>)}</div></fieldset>
              <fieldset className="setting-section" disabled={busy}><legend>Màu khung<span>{COLORS.find(color => color.value === design.color)?.name}</span></legend><div className="color-options">{COLORS.map(color => <button key={color.value} aria-label={`Khung ${color.name}`} aria-pressed={design.color === color.value} className={`color-swatch ${design.color === color.value ? "chosen" : ""}`} style={{ background: color.value, color: color.value === "#25252d" ? "white" : "#534866" }} onClick={() => setDesign({ ...design, color: color.value })}>{design.color === color.value && <Icon name="check" size={17}/>}</button>)}</div></fieldset>
              <fieldset className="setting-section" disabled={busy}><legend>Chút đáng yêu</legend><div className="sticker-options">{STICKERS.map(sticker => <button key={sticker.id} aria-pressed={design.sticker === sticker.id} className={design.sticker === sticker.id ? "chosen" : ""} onClick={() => setDesign({ ...design, sticker: sticker.id })}><span>{sticker.symbol}</span>{sticker.name}</button>)}</div></fieldset>
              <div className="setting-section caption-section"><label htmlFor="caption">Lời nhắn nhỏ<span>{design.caption.length}/50</span></label><input id="caption" maxLength={50} placeholder="một chút. thật vui." value={design.caption} onChange={e => setDesign({ ...design, caption: e.target.value })} disabled={busy}/><label className="checkbox-label"><input type="checkbox" checked={design.showDate} onChange={e => setDesign({ ...design, showDate: e.target.checked })} disabled={busy}/>In ngày chụp lên ảnh</label></div>
              {step === 1 ? <div className="panel-tip"><Icon name="sun" size={20}/><p>Một chút ánh sáng tự nhiên sẽ giúp ảnh của bạn xinh hơn đấy!</p></div> : <div className="panel-bottom"><button className="primary-button full-width" onClick={() => goToStep(3)} disabled={!previewReady || rendering || !!error}><Icon name="check" size={18}/>Ưng rồi, lưu ảnh thôi</button><button className="text-button" onClick={() => goToStep(1)}>Quay lại chụp ảnh</button></div>}
            </> : <>
              <div className="export-summary"><span className="export-check"><Icon name="check" size={25}/></span><h3>Một chiếc kỷ niệm xinh!</h3><p>4 khoảnh khắc, một câu chuyện của bạn.</p></div>
              <fieldset className="setting-section"><legend>Định dạng ảnh</legend><div className="format-options">{(["png", "jpeg"] as const).map(item => <button key={item} aria-pressed={format === item} className={format === item ? "chosen" : ""} onClick={() => setFormat(item)}><strong>{item === "png" ? "PNG" : "JPG"}</strong><span>{item === "png" ? "Giữ nét đẹp nhất" : "Dễ dàng chia sẻ"}</span></button>)}</div></fieldset>
              <dl className="export-details"><div><dt>Kích thước</dt><dd>{g.width} × {g.height} px</dd></div><div><dt>Bố cục</dt><dd>{design.layout === "strip" ? "Dải ảnh dọc" : "Lưới 2 × 2"}</dd></div><div><dt>Bộ lọc</dt><dd>{filter.name}</dd></div></dl>
              <button className="primary-button full-width download-button" onClick={() => void download()} disabled={!previewReady || rendering || exporting || !!error}><Icon name="download" size={19}/>{exporting ? "Đang chuẩn bị ảnh…" : `Tải ảnh ${format === "png" ? "PNG" : "JPG"}`}</button><button className="text-button edit-back" onClick={() => goToStep(2)}>Chỉnh thêm một chút</button>
              <div className="save-tip"><Icon name="heart" size={22}/><p>Gửi cho người đã cùng bạn tạo nên khoảnh khắc này nhé.</p></div>
            </>}
            {step === 1 && <details className="advanced-settings"><summary>Cài đặt camera</summary><label htmlFor="camera-device">Camera đang dùng</label><select id="camera-device" value={device} disabled={busy || !devices.length} onChange={e => { setDevice(e.target.value); void startCamera(e.target.value); }}>{!devices.length && <option value="">Bật camera để chọn</option>}{devices.map((item, i) => <option key={item.deviceId} value={item.deviceId}>{item.label || `Camera ${i + 1}`}</option>)}</select><label className="checkbox-label"><input type="checkbox" checked={sound} onChange={e => setSound(e.target.checked)} disabled={busy}/>Âm thanh khi chụp</label>{camera !== "off" && <button className="text-button" onClick={stopCamera} disabled={busy}>Tắt camera</button>}</details>}
          </aside>
        </div>
        {(error || notice) && <div className={`feedback ${error ? "error" : "success"}`} role={error ? "alert" : "status"}><Icon name={error ? "help" : "check"} size={18}/><span>{error || notice}</span><button onClick={() => { setError(""); setNotice(""); }} aria-label="Đóng thông báo"><Icon name="close" size={16}/></button></div>}
        <div className="studio-footer"><span><Icon name="shield" size={15}/>Ảnh ở trên thiết bị của bạn. Luôn là vậy.</span><span>Không đăng nhập · Không lưu ảnh lên máy chủ</span></div>
      </section>

      <section className="little-guide" aria-label="Ba bước đơn giản"><div><span className="guide-icon lilac"><Icon name="camera" size={21}/></span><div><h3>Cứ tự nhiên thôi</h3><p>Một mình hay cùng hội bạn đều vui.</p></div></div><div><span className="guide-icon pink"><Icon name="sparkles" size={21}/></span><div><h3>Thêm màu của bạn</h3><p>Chọn khung, bộ lọc và lời nhắn riêng.</p></div></div><div><span className="guide-icon yellow"><Icon name="download" size={21}/></span><div><h3>Giữ lại thật lâu</h3><p>Tải ảnh về, chia sẻ niềm vui.</p></div></div></section>
    </main>

    <footer className="site-footer"><a className="footer-brand" href="/">một chút.</a><p>Một chiếc photobooth nhỏ, những niềm vui to.</p><span>Made for your little happy moments <span className="footer-heart">♡</span></span></footer>
    {editing !== null && photos[editing] && <PhotoEditor photo={photos[editing]} index={editing} filter={filter.css} onClose={() => setEditing(null)} onApply={applyPhotoEdit}/>}
    <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple={retake === null} onChange={e => void upload(e)} hidden aria-label="Chọn ảnh từ thiết bị"/>
    <dialog ref={dialogRef} className="info-dialog" onCancel={() => setDialog(null)} onClose={() => setDialog(null)} onClick={e => { if (e.target === e.currentTarget) setDialog(null); }}><div className="dialog-content"><button className="dialog-close" onClick={() => setDialog(null)} aria-label="Đóng"><Icon name="close"/></button><span className="dialog-icon"><Icon name={dialog === "privacy" ? "shield" : dialog === "reset" ? "refresh" : "camera"} size={28}/></span><h2>{dialog === "privacy" ? "Khoảnh khắc của riêng bạn" : dialog === "reset" ? "Bắt đầu một kỷ niệm mới?" : "Một chút hướng dẫn"}</h2>
      {dialog === "privacy" ? <><p>Ảnh được chụp, trang trí và ghép ngay trong trình duyệt. Website không tải ảnh của bạn lên máy chủ và không thu âm.</p><p>Ảnh chỉ nằm trong phiên đang mở. Tải ảnh về trước khi tải lại hoặc đóng trang nhé.</p><p>Camera tự tắt khi bạn chuyển sang trang trí hoặc rời tab.</p><button className="primary-button full-width" onClick={() => setDialog(null)}>Mình hiểu rồi</button></> : dialog === "reset" ? <><p>4 ảnh hiện tại sẽ được xóa khỏi phiên này. Nhớ tải thành phẩm về trước nếu bạn muốn giữ lại nhé.</p><div className="dialog-actions"><button className="secondary-button" onClick={() => setDialog(null)}>Giữ ảnh hiện tại</button><button className="primary-button" onClick={reset}>Bắt đầu lại</button></div></> : <><ol><li><strong>Sẵn sàng tạo dáng.</strong> Bật camera, cho phép truy cập và chọn đếm ngược 3 hoặc 5 giây.</li><li><strong>Chụp 4 khoảnh khắc.</strong> Máy tự chụp lần lượt. Chọn một ảnh đã chụp để chụp lại riêng tấm đó.</li><li><strong>Thêm chút riêng.</strong> Chọn bố cục, bộ lọc, màu khung, sticker và một lời nhắn.</li><li><strong>Lưu kỷ niệm.</strong> Tải PNG hoặc JPG về máy. Trên điện thoại, ảnh có thể nằm trong mục Tệp/Tải xuống.</li></ol><p>Không có camera? Chọn tối đa 4 ảnh JPG, PNG hoặc WebP từ thiết bị, mỗi ảnh dưới 20 MB.</p><button className="primary-button full-width" onClick={() => setDialog(null)}>Sẵn sàng rồi!</button></>}
    </div></dialog>
  </>;
}
