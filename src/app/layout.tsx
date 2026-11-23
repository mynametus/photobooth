import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Một chút. — Photobooth online",
  description: "Một chiếc photobooth nhỏ, những niềm vui to. Chụp 4 ảnh, chọn khung và tải về ngay trên trình duyệt.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
