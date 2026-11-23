# Một chút. — Photobooth online

Giai đoạn 1 của website photobooth: chụp 4 ảnh bằng camera hoặc chọn ảnh từ thiết bị, trang trí và tải thành phẩm. Giao diện tiếng Việt, responsive, xử lý ảnh hoàn toàn trên trình duyệt.

## Chạy dự án

Dùng Node.js 24 trở lên.

```powershell
cd D:\working\photobooth\photobooth-web
npm.cmd ci
npm.cmd run dev
```

Mở địa chỉ được Next.js in ra, thường là `http://127.0.0.1:3000`.
Trong PowerShell có chính sách chặn file `.ps1`, dùng `npm.cmd` thay cho `npm`.

Build và xem bản production:

```powershell
npm.cmd run build
npm.cmd start
```

`npm start` phục vụ thư mục `out/` tại `http://127.0.0.1:3000`. Có thể đổi cổng bằng `npm.cmd start -- --port 3001`.
Do sử dụng static export, không chạy `next start`. Đưa nội dung `out/` lên hosting có HTTPS để sử dụng camera ngoài localhost.

## Chức năng

- Cấp quyền camera, chọn thiết bị, xem trước, bật/tắt lật gương.
- Đếm ngược 3 hoặc 5 giây cho từng ảnh; tự chụp 4 ảnh, có thể dừng giữa chừng và chụp tiếp.
- Chụp lại hoặc thay riêng từng ảnh, giữ nguyên 3 ảnh còn lại.
- Chỉnh khung hình từng ảnh ở bước Sáng tạo: phóng to 1–3×, dịch ngang/dọc và đổi vị trí trong bộ 4 ảnh. Xem trước, áp dụng hoặc hủy; giữ nguyên ảnh nguồn để có thể chỉnh lại.
- Tải tối đa 4 ảnh JPG, PNG hoặc WebP, mỗi ảnh tối đa 20 MB. Có thể tải ảnh theo nhiều lượt.
- Bố cục dải dọc hoặc lưới 2 × 2; 4 bộ lọc, 6 màu khung, sticker, lời nhắn và ngày chụp.
- Xem trước thành phẩm và xuất PNG/JPG. Dải dọc: 1200 × 3044 px; lưới: 1600 × 1206 px.
- Camera tự tắt khi chuyển sang chỉnh ảnh, ẩn tab hoặc đóng trang. Không xin quyền microphone.
- Có thông báo lỗi quyền camera, camera đang bận, ảnh hỏng và lỗi xuất file.

Ảnh chỉ lưu trong bộ nhớ của tab, không tải lên máy chủ. Tải thành phẩm về trước khi đóng hoặc tải lại trang. Trên điện thoại, file có thể nằm trong mục Tệp/Tải xuống thay vì tự thêm vào thư viện ảnh.

## Công nghệ và cấu trúc

- Next.js App Router, React, TypeScript strict.
- Tailwind CSS biên dịch bằng Node API trước `dev`/`build`, cùng CSS riêng cho giao diện studio. Không dùng CDN hoặc font từ bên ngoài.
- `getUserMedia()` cho camera; Canvas 2D để crop, ghép và xuất ảnh.
- Bộ lọc xuất ảnh dùng xử lý pixel để hỗ trợ trình duyệt chưa có `CanvasRenderingContext2D.filter`.
- Next.js static export; chưa cần database, API server hoặc biến môi trường.

```text
src/app/                     Trang chủ, layout, metadata và CSS
src/components/photobooth.tsx Luồng chụp, trạng thái camera và tùy chỉnh
src/components/photo-editor.tsx Chỉnh khung hình và thứ tự từng ảnh
src/components/icon.tsx       Icon SVG dùng chung
src/lib/photo.ts             Xử lý ảnh, bố cục, bộ lọc và xuất file
scripts/tailwind.mjs          Biên dịch Tailwind từ mã nguồn TypeScript
scripts/serve.mjs             Server localhost cho bản static
tests/photo.test.mjs          Kiểm thử crop, kích thước, đầu vào và xuất file
tests/photobooth.test.mjs     Kiểm thử trình duyệt với Playwright
.openai/hosting.json          Cấu hình Sites của dự án
```

CSS riêng cập nhật qua Next.js HMR. Nếu thêm utility Tailwind mới khi dev server đang chạy, chạy `node scripts/tailwind.mjs` để tạo lại CSS; production build luôn tạo lại toàn bộ.

## Kiểm tra

```powershell
npm.cmd test
npm.cmd run typecheck
npm.cmd run build
```

Kiểm thử trình duyệt cần bản production đang phục vụ trên cổng 3000 và Google Chrome đã cài:

```powershell
# Terminal 1
npm.cmd start
# Terminal 2
npm.cmd run test:e2e
```

Dùng `TEST_BASE_URL` nếu chạy cổng khác, `TEST_BROWSER_CHANNEL=msedge` để dùng Edge, hoặc `TEST_CDP_URL` để kết nối với một trình duyệt kiểm thử đã mở cổng debug. Không dùng hồ sơ trình duyệt cá nhân cho kiểm thử tự động.

E2E bao gồm tải ảnh, ghép ảnh, kiểm tra pixel bộ lọc/màu khung, chỉnh khung hình và đổi thứ tự, hủy chỉnh sửa, file PNG/JPG tải xuống, camera giả lập, chụp lại từng tấm, hủy chụp, từ chối quyền và viewport điện thoại. Ảnh chụp màn hình kiểm thử được ghi vào `test-results/`.

### Trạng thái xác minh trong môi trường phát triển

Cập nhật ngày 23/11/2026: 9/9 kiểm thử xử lý ảnh, TypeScript và production build đã chạy thành công. HTTP localhost và 8 tài nguyên JS/CSS trong HTML trả về 200. Kiểm thử E2E đã thử lại nhưng chưa chạy được vì môi trường Windows hiện tại chặn khởi chạy Chrome (`spawn EPERM`). Các ca kiểm thử chỉnh ảnh mới đã được thêm và kiểm tra cú pháp, chưa xác minh bằng trình duyệt. Cần kiểm tra thêm bằng camera thật, đặc biệt Safari/iPhone và thao tác lưu ảnh trên điện thoại.

Sites đã được đăng ký và giữ ID trong `.openai/hosting.json`, nhưng chưa publish. Lần trước kết nối Git bị chặn bởi proxy; ngày 23/11 thử mở source bằng credential mới vẫn thất bại với `Unable to prepare the Site.`. Không có URL online đã được xác minh cho bản này.

## Phạm vi giai đoạn sau

Chưa triển khai tài khoản, lưu ảnh online, chỉnh sticker tự do, GIF hoặc phòng chụp từ xa. Có thể bổ sung Supabase và chức năng máy chủ khi bước sang giai đoạn 2.
