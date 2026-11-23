# Mốc công việc — cập nhật ngày 23/11/2026

Người dùng đã yêu cầu tiếp tục phát triển ngày 23/11/2026. Đã tiếp tục từ giai đoạn 1 và bổ sung chỉnh khung hình/thứ tự ảnh. Yêu cầu tạm dừng ngày 21/11 không còn áp dụng.

## Dự án

- Thư mục: `D:\working\photobooth\photobooth-web`.
- Tên giao diện: **Một chút. — Photobooth online**.
- Stack đã thống nhất: Next.js, React, TypeScript, Tailwind CSS, getUserMedia và Canvas 2D.
- Giai đoạn 1 đã có mã nguồn và bản production tại `out/`; còn cần xác minh trên trình duyệt và camera thật.
- Chưa thiết lập Git repository cục bộ, chưa commit hoặc push mã nguồn.

## Phần đã xây dựng

- Giao diện tiếng Việt, phong cách pastel, responsive cho desktop và điện thoại.
- Luồng 3 bước: chụp ảnh, trang trí, tải thành phẩm.
- Camera: cấp quyền, chọn thiết bị, lật gương, đếm ngược 3/5 giây, tùy chọn âm thanh.
- Tự chụp 4 ảnh; dừng giữa chừng, chụp tiếp, chụp lại riêng từng ảnh.
- Ở bước Sáng tạo, mỗi ảnh có nút **Chỉnh ảnh**: phóng to 1–3×, dịch ngang/dọc, chọn vị trí trong bộ 4 ảnh, đặt lại, áp dụng hoặc hủy.
- Lưu crop dưới dạng thông số trên từng ảnh, giữ nguyên ảnh nguồn. Khi đổi thứ tự, crop đi cùng ảnh; các ảnh khác giữ nguyên thứ tự tương đối.
- Preview ghép ảnh và xuất PNG/JPG dùng chung phép crop. Thumbnail phản ánh crop bằng object-position và zoom.
- Tải ảnh JPG/PNG/WebP từ thiết bị, theo nhiều lượt hoặc thay từng vị trí; giới hạn 20 MB/ảnh.
- Bố cục dải dọc và lưới 2 × 2; 4 bộ lọc, 6 màu khung, sticker, lời nhắn và ngày chụp.
- Ghép ảnh ngay trên thiết bị, xuất PNG/JPG; chỉ cho xuất khi bản xem trước hiện tại đã hoàn tất.
- Dải ảnh xuất 1200 × 3044 px; lưới xuất 1600 × 1206 px.
- Camera tắt khi chuyển sang trang trí hoặc ẩn tab; không thu âm, không tải ảnh lên máy chủ.
- Hướng dẫn, thông báo quyền riêng tư, xác nhận trước khi xóa ảnh và xử lý các lỗi chính.
- README hướng dẫn chạy, cấu trúc mã nguồn và phạm vi giai đoạn sau.

## Kết quả kiểm tra gần nhất

- `npm.cmd test`: **9/9 kiểm thử xử lý ảnh đạt**, thêm crop ở mép ảnh, giới hạn crop và đổi thứ tự giữ nguyên dữ liệu nguồn.
- `npm.cmd run typecheck`: **đạt**.
- `npm.cmd run build`: **đạt**, tạo static export trong `out/`.
- HTTP localhost: **200**.
- Kiểm tra 8 tài nguyên JS/CSS được tham chiếu trong HTML: **tất cả trả về 200**.
- Bộ kiểm thử Playwright đã thử lại ngày 23/11 nhưng **chưa chạy được**: môi trường chặn khởi chạy Chrome (`spawn EPERM`). Không coi đây là kết quả xác nhận camera hoặc giao diện bằng trình duyệt.
- Đã thêm E2E cho crop ảnh dọc, kiểm tra pixel thành phẩm, hủy chỉnh sửa và đổi thứ tự trên viewport điện thoại. Đã kiểm tra cú pháp; chưa chạy được trên trình duyệt.
- Build cập nhật được lưu trong `out/`. Dùng `npm.cmd start` để xem lại.

## Tình trạng Sites

- Đã đăng ký Site một lần; giữ nguyên ID trong `.openai/hosting.json`.
- Project ID: `appgprj_6b01656afe648191aa6e307326a6aa3a`.
- Quyền truy cập được xác nhận là chỉ chủ sở hữu.
- **Chưa publish và chưa có URL online được xác minh.**
- Source helper không chạy được Git từ Node trong môi trường hiện tại; thử Git trực tiếp cũng không kết nối được qua proxy tới dịch vụ Git.
- Ngày 23/11 đã gọi `get_site`, xác nhận vẫn chưa có phiên bản xuất bản và quyền chỉ chủ sở hữu; đã lấy credential mới và thử source helper, nhận `Unable to prepare the Site.`. Chưa đồng bộ hoặc publish bản chỉnh sửa mới.
- Không đăng ký Site mới khi tiếp tục. Đọc manifest, lấy credential mới nếu cần và giữ credential trong bộ nhớ; không ghi token ra file.

## Lưu ý môi trường

- Dùng `npm.cmd` trong PowerShell vì `npm.ps1` bị chính sách thực thi chặn.
- Thư viện đã cài trong `node_modules/`; phiên bản được khóa trong `package-lock.json`.
- Mạng npm không truy cập được trong phiên này; thư viện đã được khôi phục từ tarball có sẵn trong cache cục bộ. Cache ghi được của tác vụ nằm tại `D:\working\photobooth\.npm-cache`.
- Script hỗ trợ và log môi trường nằm trong `.sites-runtime/`, đã được gitignore; không phải mã ứng dụng.
- Next.js dùng worker threads và TypeScript API để build được trong môi trường Windows hiện tại.
- Tailwind được biên dịch trước dev/build. Nếu thêm utility mới khi dev đang chạy, chạy lại `node scripts/tailwind.mjs`.

## Khi tiếp tục

1. Đọc checkpoint này và README; kiểm tra thay đổi mới của người dùng trước khi chỉnh sửa.
2. Chạy bản hiện tại để duyệt giao diện desktop/điện thoại và thử camera thật.
3. Chạy Playwright trong môi trường cho phép Chrome; sửa lỗi quan sát được nếu có. Kiểm tra thêm Safari/iPhone, crop/lật ảnh, quyền camera và lưu file trên điện thoại.
   - Với trình chỉnh ảnh mới: thử ảnh dọc, zoom, dịch ngang/dọc ở hai mép, áp dụng/hủy/Escape, di chuyển từ vị trí đầu đến cuối, chụp lại ảnh đã crop và so sánh PNG/JPG tải xuống.
4. Khi kết nối Git hoạt động, đồng bộ đúng source/build rồi publish cùng Site đã đăng ký nếu vẫn thuộc phạm vi được yêu cầu.
5. Chưa bắt đầu giai đoạn 2: tài khoản, lưu ảnh online, GIF, sticker kéo thả và phòng chụp từ xa.

## Lệnh chạy lại

```powershell
cd D:\working\photobooth\photobooth-web
npm.cmd run dev
```

Hoặc xem bản production đã build:

```powershell
cd D:\working\photobooth\photobooth-web
npm.cmd start
```

Mặc định truy cập `http://127.0.0.1:3000`.
