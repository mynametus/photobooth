"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "./icon";

const ACCOUNT_NUMBER = "19039040162016";
const QR_IMAGE = "/support/techcombank-vu-van-tu.png";

export default function SupportCoffee({ disabled = false }: { disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const [copying, setCopying] = useState(false);
  const [message, setMessage] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const accountRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) dialog.showModal();
    else if (!open && dialog?.open) dialog.close();
  }, [open]);

  function showSupport() { setMessage(""); setOpen(true); }

  async function copyAccount() {
    if (copying) return;
    setCopying(true); setMessage("");
    try {
      await navigator.clipboard.writeText(ACCOUNT_NUMBER);
      setMessage("Đã sao chép số tài khoản.");
    } catch {
      accountRef.current?.focus(); accountRef.current?.select();
      setMessage("Số tài khoản đã được chọn. Bạn có thể sao chép thủ công nhé.");
    } finally { setCopying(false); }
  }

  return <>
    <section className="coffee-section" id="ung-ho" aria-labelledby="coffee-section-heading">
      <div className="coffee-section-art" aria-hidden="true"><span>♡</span><Icon name="coffee" size={56}/><span>✧</span></div>
      <div className="coffee-section-copy"><span className="coffee-eyebrow">CẢM ƠN VÌ ĐÃ GHÉ CHƠI</span><h2 id="coffee-section-heading">Một chút cà phê,<br/>thêm nhiều niềm vui.</h2><p>Nếu bạn thích chiếc photobooth nhỏ này, bạn có thể mời mình một ly cà phê để tiếp tục làm thêm những khung ảnh xinh.</p></div>
      <div className="coffee-section-action"><button className="coffee-button" onClick={showSupport} disabled={disabled}><Icon name="coffee" size={20}/>Buy me a coffee</button><span>Một lời động viên nhỏ cũng thật đáng quý ♡</span></div>
    </section>

    <button className="coffee-floating" onClick={showSupport} disabled={disabled} aria-label="Mở mã QR ủng hộ" title="Buy me a coffee"><Icon name="coffee" size={22}/><span>Buy me a coffee</span></button>

    <dialog ref={dialogRef} className="coffee-dialog" aria-labelledby="coffee-dialog-heading" onCancel={() => setOpen(false)} onClose={() => setOpen(false)}>
      <button className="coffee-dialog-close" onClick={() => setOpen(false)} aria-label="Đóng mã QR ủng hộ"><Icon name="close" size={21}/></button>
      <div className="coffee-dialog-heading"><span className="coffee-dialog-icon"><Icon name="coffee" size={27}/></span><div><h2 id="coffee-dialog-heading">Buy me a coffee</h2><p>Mời một ly cà phê, gửi một chút yêu thương.</p></div></div>
      <div className="coffee-dialog-body">
        <figure className="coffee-qr"><img src={QR_IMAGE} width={828} height={1608} loading="lazy" alt="Mã VietQR Techcombank của VU VAN TU, số tài khoản 19039040162016"/><figcaption>Quét QR bằng ứng dụng ngân hàng của bạn.</figcaption></figure>
        <div className="coffee-bank"><span className="coffee-eyebrow">GỬI MỘT CHÚT ỦNG HỘ</span><h3>Cảm ơn bạn<br/>thật nhiều!</h3><p>Sự ủng hộ của bạn giúp mình tiếp tục chăm chút cho một chút. và tạo thêm những kỷ niệm xinh.</p>
          <dl><div><dt>Ngân hàng</dt><dd>Techcombank</dd></div><div><dt>Chủ tài khoản</dt><dd>VU VAN TU</dd></div></dl>
          <label htmlFor="support-account">Số tài khoản</label><input ref={accountRef} id="support-account" readOnly value="1903 9040 1620 16" onFocus={event => event.currentTarget.select()} onClick={event => event.currentTarget.select()}/>
          <button className="coffee-button coffee-copy" onClick={() => void copyAccount()} disabled={copying}><Icon name="copy" size={17}/>{copying ? "Đang sao chép…" : "Sao chép số tài khoản"}</button>
          <a className="coffee-download" href={QR_IMAGE} download="mot-chut-ung-ho-vietqr.png"><Icon name="download" size={16}/>Tải mã QR về máy</a>
          <p className="coffee-amount-note">Bạn tùy chọn mức ủng hộ. Cảm ơn vì đã đồng hành cùng mình ♡</p>
          <p className="coffee-copy-status" role="status">{message}</p>
        </div>
      </div>
    </dialog>
  </>;
}
