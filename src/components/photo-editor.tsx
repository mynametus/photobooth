"use client";

import { useEffect, useRef, useState } from "react";
import { DEFAULT_CROP, drawCover, loadImage, normalizeCrop, type Photo, type PhotoCrop } from "@/lib/photo";
import Icon from "./icon";

interface Props {
  photo: Photo;
  index: number;
  filter: string;
  onClose: () => void;
  onApply: (photo: Photo, position: number) => void;
}

export default function PhotoEditor({ photo, index, filter, onClose, onApply }: Props) {
  const [crop, setCrop] = useState(() => normalizeCrop(photo.crop));
  const [position, setPosition] = useState(index);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
    let cancelled = false;
    void loadImage(photo.source).then(image => { if (!cancelled) setImage(image); })
      .catch(() => { if (!cancelled) setError("Không đọc được ảnh. Hãy đóng và thử lại."); });
    return () => { cancelled = true; };
  }, [photo.source]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!image || !canvas) return;
    try {
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Trình duyệt không hỗ trợ chỉnh ảnh.");
      drawCover(ctx, image, image.naturalWidth, image.naturalHeight, 0, 0, canvas.width, canvas.height, crop);
    } catch {
      setError("Không thể tạo ảnh xem trước. Hãy đóng và thử lại.");
    }
  }, [image, crop]);

  function changeCrop(key: keyof PhotoCrop, value: number) {
    setCrop(current => ({ ...current, [key]: value }));
  }

  return <dialog ref={dialogRef} className="info-dialog photo-editor" aria-labelledby="photo-editor-heading" onCancel={onClose} onClose={onClose}>
    <form className="dialog-content" onSubmit={event => { event.preventDefault(); if (image && !error) onApply({ ...photo, crop }, position); }}>
      <button type="button" className="dialog-close" onClick={onClose} aria-label="Đóng chỉnh ảnh"><Icon name="close"/></button>
      <h2 id="photo-editor-heading">Chỉnh ảnh {index + 1}</h2>
      <p>Giữ trọn nụ cười trong khung. Bạn có thể phóng to, dịch ảnh và đổi thứ tự.</p>
      <div className="crop-preview" aria-busy={!image && !error}>
        <canvas ref={canvasRef} width={800} height={500} style={{ filter }} role="img" aria-label={`Khung hình ảnh ${index + 1} sau chỉnh sửa`}/>
        {!image && !error && <span role="status">Đang đọc ảnh…</span>}
      </div>
      {error && <p role="alert">{error}</p>}
      <fieldset className="crop-controls" disabled={!image || !!error}>
        <legend className="sr-only">Khung hình và thứ tự ảnh</legend>
        <label htmlFor="crop-zoom">Phóng to <output>{crop.zoom.toFixed(2)}×</output></label>
        <input id="crop-zoom" type="range" min={1} max={3} step={.05} value={crop.zoom} onChange={event => changeCrop("zoom", Number(event.target.value))}/>
        <label htmlFor="crop-x">Vị trí ngang <output>{Math.round(crop.x * 100)}%</output></label>
        <input id="crop-x" type="range" min={0} max={100} value={crop.x * 100} onChange={event => changeCrop("x", Number(event.target.value) / 100)}/>
        <label htmlFor="crop-y">Vị trí dọc <output>{Math.round(crop.y * 100)}%</output></label>
        <input id="crop-y" type="range" min={0} max={100} value={crop.y * 100} onChange={event => changeCrop("y", Number(event.target.value) / 100)}/>
        <label htmlFor="photo-position">Vị trí trong bộ ảnh</label>
        <select id="photo-position" value={position} onChange={event => setPosition(Number(event.target.value))}>
          {[0, 1, 2, 3].map(value => <option value={value} key={value}>Ảnh {value + 1}{value === index ? " (hiện tại)" : ""}</option>)}
        </select>
        <button type="button" className="text-button crop-reset" onClick={() => { setCrop({ ...DEFAULT_CROP }); setPosition(index); }}>Đặt lại chỉnh sửa</button>
      </fieldset>
      <div className="dialog-actions"><button type="button" className="secondary-button" onClick={onClose}>Hủy</button><button type="submit" className="primary-button" disabled={!image || !!error}><Icon name="check" size={17}/>Áp dụng</button></div>
    </form>
  </dialog>;
}
