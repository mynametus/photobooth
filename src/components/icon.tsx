type Name = "camera" | "sparkles" | "download" | "upload" | "shield" | "timer" | "flip" | "refresh" | "check" | "close" | "help" | "sun" | "heart" | "flower" | "image" | "stop" | "coffee" | "copy";
const paths: Record<Name, React.ReactNode> = {
  camera: <><path d="M8 5 6 8H3v12h18V8h-3l-2-3Z"/><circle cx="12" cy="14" r="4"/></>,
  sparkles: <><path d="m12 3 2.3 6.7L21 12l-6.7 2.3L12 21l-2.3-6.7L3 12l6.7-2.3Z"/><path d="m20 2 .5 1.5L22 4l-1.5.5L20 6l-.5-1.5L18 4l1.5-.5Z"/></>,
  download: <><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/></>,
  upload: <><path d="M12 16V3m-5 5 5-5 5 5M4 16v5h16v-5"/></>,
  shield: <><path d="m12 3 8 3v6c0 5-8 9-8 9S4 17 4 12V6Z"/><path d="m8 12 3 3 5-6"/></>,
  timer: <><circle cx="12" cy="14" r="8"/><path d="M12 10v4l3 2M9 2h6m-3 0v4m5 1 2-2"/></>,
  flip: <><path d="M3 8h14l-4-4M21 16H7l4 4M3 8v9m18-1V7"/></>,
  refresh: <><path d="M20 8a8 8 0 0 0-14-3L3 8m0-5v5h5m-4 8a8 8 0 0 0 14 3l3-3m0 5v-5h-5"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  close: <path d="m6 6 12 12M6 18 18 6"/>,
  help: <><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4 2c-1 .6-1.5 1-1.5 2M12 17h.01"/></>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/></>,
  heart: <path d="M12 21 3.5 12.5A5.5 5.5 0 0 1 12 5.7a5.5 5.5 0 0 1 8.5 6.8Z"/>,
  flower: <><path d="M12 8C6 0 0 9 8 12c-8 6 1 12 4 4 6 8 12-1 4-4 8-6-1-12-4-4Z"/><circle cx="12" cy="12" r="2"/></>,
  image: <><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 6-6 4 4 3-3 5 5"/></>,
  stop: <rect x="6" y="6" width="12" height="12" rx="2"/>,
  coffee: <><path d="M4 9h12v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5ZM16 10h2a3 3 0 1 1 0 6h-2M7 2v3m4-3v3m4-3v3M2 21h17"/></>,
  copy: <><rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V3H3v13h5"/></>,
};
export default function Icon({ name, size = 20, className = "" }: { name: Name; size?: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>{paths[name]}</svg>;
}
