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

- **Buy me a coffee**: mục ủng hộ cuối trang và nút nổi mở QR Techcombank do chủ dự án cung cấp. Có tên chủ tài khoản, sao chép số tài khoản và tải ảnh QR gốc; không yêu cầu mức ủng hộ cố định.
- Thư viện 48 mẫu thiết kế theo 10 nhóm chủ đề, gồm gia đình, trẻ em, dễ thương, cartoon, hoa, trái cây, café, du lịch và các dịp đặc biệt. Mỗi mẫu có nền, typography, bố trí ảnh và minh họa riêng ở cả hai bố cục.
- 16 mẫu mới theo bốn nguồn tham khảo: rạp xiếc, safari, khủng long, nàng tiên cá, phép thuật, vũ trụ, gia đình cáo, hải tặc, album gia đình, kẻ plaid, em bé, trường học, pastel film, hoa oval, pixel và nhật ký ruy băng. Nhóm **Gia đình**, **Trẻ em**, **Dễ thương** giúp tìm nhanh; mẫu mới được ưu tiên đầu thư viện. Mẫu **Bloom & oval** cắt ảnh thành hình bầu dục trong preview và file xuất.
- Nhóm **Cartoon** gồm 8 mẫu, trong đó bốn mẫu lấy cảm hứng từ ảnh chụp Instagram người dùng gửi: Tiệm bánh mùa đông, Biệt đội bay giữa mây, Thỏ ôm tim và Hội bạn bóng bay. Minh họa PNG nhiều chi tiết, nền đậm, tiêu đề lớn và vùng ảnh/lời nhắn riêng.
- Nút **Chọn mẫu khung** mở bộ sưu tập lớn, lọc theo chủ đề; khi đủ 4 ảnh, gallery ghép thử bằng ảnh của bạn. Mặc định dùng mẫu Nơ hồng; chế độ **Tự phối khung** giữ các lựa chọn viền cơ bản.
- Tìm mẫu bằng tiếng Việt có dấu/không dấu hoặc từ khóa như `tet`, `dien anh`, `tot nghiep`. Mẫu mới được đưa lên đầu và có nhãn **Mới**. Thumbnail ảnh thật chỉ ghép khi thư viện mở và thẻ mẫu gần vùng nhìn thấy.
- Cấp quyền camera, chọn thiết bị, xem trước, bật/tắt lật gương.
- Đếm ngược 3 hoặc 5 giây cho từng ảnh; tự chụp 4 ảnh, có thể dừng giữa chừng và chụp tiếp.
- Chụp lại hoặc thay riêng từng ảnh, giữ nguyên 3 ảnh còn lại.
- Chỉnh khung hình từng ảnh ở bước Sáng tạo: phóng to 1–3×, dịch ngang/dọc và đổi vị trí trong bộ 4 ảnh. Xem trước, áp dụng hoặc hủy; giữ nguyên ảnh nguồn để có thể chỉnh lại.
- Tải tối đa 4 ảnh JPG, PNG hoặc WebP, mỗi ảnh tối đa 20 MB. Có thể tải ảnh theo nhiều lượt.
- Bố cục dải dọc hoặc lưới 2 × 2; lời nhắn và ngày chụp.
- 16 bộ lọc chia theo nhóm Nhẹ nhàng, Hoài cổ, Nổi bật và Đơn sắc; chỉnh độ đậm 0–100%, xem mẫu ngay trên ảnh của bạn.
- 24 màu khung và bộ chọn màu tùy ý. Màu chữ trên thành phẩm tự điều chỉnh theo nền.
- Trong chế độ Tự phối: 12 kiểu viền phối độc lập với màu khung gồm tối giản, nét đôi, đường chỉ, ren nhỏ, cuộn phim, caro, confetti, tim nhỏ, vườn hoa, ngàn sao, thư tay và nơ xinh.
- 7 bộ sticker: sao, trái tim, hoa, nơ, cherry, bướm và trăng non; có thể tắt sticker.
- Xem trước thành phẩm và xuất PNG/JPG. Dải dọc: 1200 × 3044 px; lưới: 1600 × 1206 px.
- Camera tự tắt khi chuyển sang chỉnh ảnh, ẩn tab hoặc đóng trang. Không xin quyền microphone.
- Có thông báo lỗi quyền camera, camera đang bận, ảnh hỏng và lỗi xuất file.

Ảnh chỉ lưu trong bộ nhớ của tab, không tải lên máy chủ. Tải thành phẩm về trước khi đóng hoặc tải lại trang. Trên điện thoại, file có thể nằm trong mục Tệp/Tải xuống thay vì tự thêm vào thư viện ảnh.

## Công nghệ và cấu trúc

- Next.js App Router, React, TypeScript strict.
- Tailwind CSS biên dịch bằng Node API trước `dev`/`build`, cùng CSS riêng cho giao diện studio. Không dùng CDN hoặc font từ bên ngoài.
- `getUserMedia()` cho camera; Canvas 2D để crop, ghép và xuất ảnh.
- Bộ lọc preview dùng SVG color matrix; ảnh xuất dùng cùng ma trận sRGB để xử lý pixel, không phụ thuộc `CanvasRenderingContext2D.filter`. Độ đậm được trộn với ảnh gốc bằng cùng công thức.
- Hoa văn viền được vẽ bằng Canvas, cắt theo vùng khung để không phủ lên ảnh hoặc vùng chữ; hỗ trợ cả hai bố cục.
- Mẫu theo chủ đề dùng SVG gốc chia layer nền/trang trí, với ảnh Canvas được crop và xoay theo vị trí trong thiết kế. Gallery dùng cùng renderer ở kích thước nhỏ. Ảnh minh họa vị trí không đi vào thành phẩm.
- 12 mẫu minh họa chi tiết thêm lớp PNG nền trong suốt từ `public/frames/characters/` và `public/frames/family/`, tải từ cùng website và cache trong phiên. Gallery dựng đầy đủ minh họa ngay cả khi chưa có ảnh chụp. Asset và prompt imagegen được ghi trong `docs/CHARACTER_ASSETS.md` và `docs/FAMILY_ASSETS.md`.
- Next.js static export; chưa cần database, API server hoặc biến môi trường.

```text
src/app/                     Trang chủ, layout, metadata và CSS
src/components/photobooth.tsx Luồng chụp, trạng thái camera và tùy chỉnh
src/components/photo-editor.tsx Chỉnh khung hình và thứ tự từng ảnh
src/components/design-controls.tsx Bảng chọn bộ lọc, màu, viền và sticker
src/components/template-gallery.tsx Thư viện mẫu theo chủ đề và ảnh xem thử
src/components/support-coffee.tsx Mục ủng hộ, QR, sao chép tài khoản và tải QR
public/support/              Ảnh QR gốc do người dùng cung cấp
src/components/icon.tsx       Icon SVG dùng chung
src/lib/photo.ts             Xử lý ảnh, bố cục, bộ lọc và xuất file
src/lib/filters.ts           Preset, ma trận màu và độ đậm bộ lọc
src/lib/frames.ts            Bảng màu, tương phản chữ, hoa văn viền và sticker
src/lib/templates.ts         Bộ sưu tập, vị trí ảnh và các layer SVG của mẫu
src/lib/template-extras.ts   Minh họa, phối màu và bố cục của 16 mẫu bổ sung
src/lib/cartoon-templates.ts Nhân vật và thiết kế của 4 mẫu Cartoon
src/lib/character-templates.ts 4 mẫu minh họa chi tiết và vị trí PNG
public/frames/characters/    4 PNG nền trong suốt dùng trong app
src/lib/playful-templates.ts 16 mẫu gia đình, trẻ em và pastel; bố cục oval
public/frames/family/        8 PNG minh họa nhiều chi tiết mới
docs/FAMILY_ASSETS.md        Prompt và đường dẫn 8 asset mới
docs/DESIGN_REFERENCES.md     Nguồn tham khảo và hướng thiết kế
scripts/preview-templates.mjs Tạo bảng mẫu để kiểm tra hình vẽ SVG
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

E2E bao gồm tải ảnh, ghép ảnh, kiểm tra pixel bộ lọc/màu khung, nhóm và độ đậm bộ lọc, màu tùy chọn, toàn bộ 12 viền ở cả hai bố cục, chỉnh khung hình và đổi thứ tự, hủy chỉnh sửa, file PNG/JPG tải xuống, camera giả lập, chụp lại từng tấm, hủy chụp, từ chối quyền và viewport điện thoại. Ảnh chụp màn hình kiểm thử được ghi vào `test-results/`.

### Trạng thái xác minh trong môi trường phát triển

Cập nhật ngày 23/11/2026: 18/18 kiểm thử xử lý ảnh/tìm mẫu/asset/oval, TypeScript và production build đã chạy thành công. Đã raster hóa đủ 96 bố cục của 48 mẫu. Hai bảng riêng `test-results/template-family-kids-1.png` và `test-results/template-family-kids-2.png` đã được xem trực tiếp, gồm đủ 16 mẫu mới ở cả dải dọc và lưới. PNG gốc giữ alpha và nằm ngoài vùng ảnh trong cả hai bố cục. HTTP localhost trả về 200 với bộ đếm 48/48, toàn bộ JS/CSS, 8 PNG mới và QR ủng hộ. Kiểm thử E2E trước đó đã bị môi trường Windows chặn khởi chạy Chrome (`spawn EPERM`). Các ca kiểm thử mới cho minh họa và cắt oval đã được cập nhật, kiểm tra cú pháp, chưa xác minh bằng trình duyệt. Cần kiểm tra thêm bằng camera thật, đặc biệt SVG filter trên Safari/iPhone và thao tác lưu ảnh trên điện thoại.

Sites đã được đăng ký và giữ ID trong `.openai/hosting.json`, nhưng chưa publish. Lần trước kết nối Git bị chặn bởi proxy; ngày 23/11 thử mở source bằng credential mới vẫn thất bại với `Unable to prepare the Site.`. Không có URL online đã được xác minh cho bản này.

## Phạm vi giai đoạn sau

Chưa triển khai tài khoản, lưu ảnh online, chỉnh sticker tự do, GIF hoặc phòng chụp từ xa. Có thể bổ sung Supabase và chức năng máy chủ khi bước sang giai đoạn 2.
