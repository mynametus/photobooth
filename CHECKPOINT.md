# Mốc công việc — cập nhật ngày 23/11/2026

Người dùng đã yêu cầu tiếp tục phát triển ngày 23/11/2026, sau đó yêu cầu thêm nhiều filter, màu khung và chi tiết viền. Đã bổ sung chỉnh khung hình/thứ tự ảnh và mở rộng toàn bộ bảng trang trí. Yêu cầu tạm dừng ngày 21/11 không còn áp dụng.

Yêu cầu mới nhất: người dùng cho rằng các viền trước còn đơn điệu và cung cấp Canva, Life4Cuts, TemplatesBooth để nghiên cứu. Đã đọc nguồn, ghi nhận hướng thiết kế trong `docs/DESIGN_REFERENCES.md` và chuyển lựa chọn chính sang thư viện mẫu hoàn chỉnh.

Yêu cầu tiếp theo: người dùng đã thấy 8 mẫu và muốn thêm nhiều mẫu hơn. Đã mở rộng lên **24 mẫu** với 16 thiết kế mới, 6 nhóm chủ đề, tìm kiếm không dấu, nhãn Mới và nạp thumbnail theo vùng nhìn thấy.

Yêu cầu mới nhất: thêm vài mẫu cartoon. Đã thêm **Gấu đi picnic, Hội mèo tinh nghịch, Thỏ trên mây, Chuyện vui bốn ô**, nâng tổng lên **28 mẫu trong 7 nhóm**. Nhóm Cartoon đứng ngay sau Tất cả; 4 mẫu được ưu tiên đầu danh sách tìm kiếm.

Yêu cầu tiếp theo: thêm **Buy me a coffee** với QR của người dùng. Đã thêm `support-coffee.tsx`, section cuối trang, nút nổi, dialog QR, sao chép số tài khoản và tải QR. Ảnh được sao chép nguyên byte từ file đính kèm tới `public/support/techcombank-vu-van-tu.png`; Techcombank, VU VAN TU, tài khoản `19039040162016`. Build/TypeScript đạt; trang và QR trả về 200, ảnh phục vụ khớp SHA-256 ảnh gốc (828 × 1608). Clipboard và thao tác dialog chưa được kiểm thử trong trình duyệt do giới hạn Chrome đã ghi nhận.

Người dùng đồng thời hỏi sao không lấy mẫu từ `https://www.instagram.com/life4cuts.uk/`. Đã thử mở profile và tìm bài công khai nhưng công cụ không tải được nội dung profile. Khi đó các mẫu vẫn là SVG tự dựng và đã đề nghị người dùng gửi ảnh mẫu. Ảnh tham khảo đã được cung cấp ở bước tiếp theo bên dưới.

Người dùng đã gửi ảnh chụp Instagram tại `codex-clipboard-2Xk2UU.png`. Đã xem ảnh và tạo **4 mẫu lấy cảm hứng từ ảnh này**, có minh họa nhân vật PNG nhiều chi tiết bằng imagegen tích hợp: Tiệm bánh mùa đông, Biệt đội bay giữa mây, Thỏ ôm tim, Hội bạn bóng bay. Tổng **32 mẫu, 8 Cartoon**. Đây là mẫu mới của dự án theo hướng màu/bối cảnh trong ảnh tham khảo.

PNG đã lưu trong `public/frames/characters/`; prompt và nguồn công cụ trong `docs/CHARACTER_ASSETS.md`. Không phụ thuộc đường dẫn generated_images. `character-templates.ts` khai báo asset, bố cục riêng cả strip/grid và khoảng dành cho caption. Renderer ghép PNG giữa ảnh và overlay chữ; gallery dùng `renderTemplatePreview` khi chưa chụp đủ ảnh. Không chỉ trông chờ SVG thumbnail vì ảnh SVG dạng data URL không tải tài nguyên PNG ngoài.

## Dự án

- Thư mục: `D:\working\photobooth\photobooth-web`.
- Tên giao diện: **Một chút. — Photobooth online**.
- Stack đã thống nhất: Next.js, React, TypeScript, Tailwind CSS, getUserMedia và Canvas 2D.
- Giai đoạn 1 đã có mã nguồn và bản production tại `out/`; còn cần xác minh trên trình duyệt và camera thật.
- Chưa thiết lập Git repository cục bộ, chưa commit hoặc push mã nguồn.

## Phần đã xây dựng

- Giao diện tiếng Việt, phong cách pastel, responsive cho desktop và điện thoại.
- 32 mẫu có chủ đề, trong đó 8 Cartoon. SVG có layer nền/ảnh/trang trí và 4 mẫu dùng thêm PNG nền trong suốt; hỗ trợ dải dọc/lưới.
- `src/lib/cartoon-templates.ts` chứa nhân vật gấu, mèo, thỏ và đồ họa pop-art; có phối cảnh, nét viền và bố cục riêng. Có thể tìm `gau`, `meo`, `tho`, `truyen tranh`, `hoat hinh` hoặc lọc Cartoon.
- `src/lib/template-extras.ts` chứa 16 mẫu bổ sung; `findTemplates()` hỗ trợ tìm kiếm theo tiền tố từ, bỏ dấu tiếng Việt, từ khóa đồng nghĩa và nhóm chủ đề. Mẫu mới hiện trước, giữ nguyên mẫu mặc định Nơ hồng.
- Gallery chỉ dựng các thẻ khi mở; IntersectionObserver trì hoãn ghép ảnh thật đến khi thumbnail gần vùng nhìn thấy, giúp giảm công việc khi thư viện có nhiều mẫu.
- Mặc định Nơ hồng. Nút **Chọn mẫu khung** mở gallery lớn có nhóm chủ đề; có đủ 4 ảnh thì thumbnail được render bằng ảnh thật. Khi đổi mẫu giữ nguyên ảnh nguồn, crop và lời nhắn.
- **Tinh chỉnh màu & bộ lọc** nằm trong phần mở rộng. **Tự phối khung** chuyển sang bộ viền cơ bản cũ, còn các lựa chọn filter/màu/sticker được giữ để tùy chỉnh.
- Luồng 3 bước: chụp ảnh, trang trí, tải thành phẩm.
- Camera: cấp quyền, chọn thiết bị, lật gương, đếm ngược 3/5 giây, tùy chọn âm thanh.
- Tự chụp 4 ảnh; dừng giữa chừng, chụp tiếp, chụp lại riêng từng ảnh.
- Ở bước Sáng tạo, mỗi ảnh có nút **Chỉnh ảnh**: phóng to 1–3×, dịch ngang/dọc, chọn vị trí trong bộ 4 ảnh, đặt lại, áp dụng hoặc hủy.
- Lưu crop dưới dạng thông số trên từng ảnh, giữ nguyên ảnh nguồn. Khi đổi thứ tự, crop đi cùng ảnh; các ảnh khác giữ nguyên thứ tự tương đối.
- Preview ghép ảnh và xuất PNG/JPG dùng chung phép crop. Thumbnail phản ánh crop bằng object-position và zoom.
- Tải ảnh JPG/PNG/WebP từ thiết bị, theo nhiều lượt hoặc thay từng vị trí; giới hạn 20 MB/ảnh.
- Bố cục dải dọc và lưới 2 × 2; 16 bộ lọc có nhóm và độ đậm 0–100%, 24 màu khung và chọn màu tùy ý.
- 12 kiểu viền: tối giản, nét đôi, đường chỉ, ren, cuộn phim, caro, confetti, trái tim, hoa, sao, thư tay và nơ. Hoa văn nằm ngoài vùng ảnh và vùng lời nhắn.
- 7 bộ sticker cùng lựa chọn tắt; lời nhắn và ngày chụp. Màu chữ tự chọn theo độ tương phản nền.
- `src/lib/filters.ts` dùng chung ma trận màu cho SVG preview và pixel xuất ảnh. `src/lib/frames.ts` chứa bảng màu, viền và sticker. Bảng chọn nằm ở `src/components/design-controls.tsx`.
- Ghép ảnh ngay trên thiết bị, xuất PNG/JPG; chỉ cho xuất khi bản xem trước hiện tại đã hoàn tất.
- Dải ảnh xuất 1200 × 3044 px; lưới xuất 1600 × 1206 px.
- Camera tắt khi chuyển sang trang trí hoặc ẩn tab; không thu âm, không tải ảnh lên máy chủ.
- Hướng dẫn, thông báo quyền riêng tư, xác nhận trước khi xóa ảnh và xử lý các lỗi chính.
- README hướng dẫn chạy, cấu trúc mã nguồn và phạm vi giai đoạn sau.

## Kết quả kiểm tra gần nhất

- `npm.cmd test`: **17/17 kiểm thử đạt**, bao gồm crop, đổi thứ tự, filter, tương phản chữ, vị trí ảnh trong 64 bố cục, escape SVG, tìm kiếm và asset PNG tồn tại/giữ RGBA/nằm ngoài vùng ảnh.
- `npm.cmd run typecheck`: **đạt**.
- `npm.cmd run build`: **đạt**, tạo static export trong `out/`.
- HTTP localhost: **200**.
- Bản 32 mẫu: HTTP localhost **200**, bộ đếm catalogue **32/32**. 9 tài nguyên JS/CSS/icon, 4 PNG nhân vật và QR ủng hộ đều trả về **200**. Dùng lại server có sẵn trên cổng 3000, không dừng tiến trình không xác định chủ sở hữu.
- `node scripts/preview-templates.mjs`: tạo đủ 64 SVG, có nhúng PNG khi cần, bảng đầy đủ và bảng riêng `test-results/template-character-collection.png`; đã xem trực tiếp 4 mẫu mới ở cả hai bố cục. Đây là QA hình vẽ SVG/PNG bằng Sharp, chưa phải kiểm tra app trong trình duyệt.
- Bộ kiểm thử Playwright đã thử lại ngày 23/11 nhưng **chưa chạy được**: môi trường chặn khởi chạy Chrome (`spawn EPERM`). Không coi đây là kết quả xác nhận camera hoặc giao diện bằng trình duyệt.
- Đã thêm E2E cho crop ảnh dọc, kiểm tra pixel thành phẩm, hủy chỉnh sửa và đổi thứ tự trên viewport điện thoại. Đã kiểm tra cú pháp; chưa chạy được trên trình duyệt.
- Đã thêm E2E cho nhóm/độ đậm filter, màu tùy chọn, sticker mới và cả 12 viền ở hai bố cục; kiểm tra các viền khác nhau và không thay đổi pixel bên trong ảnh. Chưa chạy được trên trình duyệt.
- E2E duyệt toàn bộ catalogue ở hai bố cục; đã bổ sung tìm kiếm, nhóm Lễ hội, trạng thái không có kết quả, nhãn Mới và chỉ dựng gallery khi mở. Chưa chạy được trên trình duyệt.
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
   - Với bảng trang trí: kiểm tra SVG filter trên ảnh/video ở Chrome và Safari, độ đậm 0/50/100%, màu tùy chọn, các viền ở hai bố cục và file xuất. Kiểm tra vùng preview sticky trên desktop khi bảng chọn dài.
   - Với bộ sưu tập: mở gallery khi chưa có ảnh để kiểm tra 4 thumbnail PNG chi tiết, sau đó thử ảnh thật, nhóm Cartoon, chuyển giữa 32 mẫu và hai bố cục, crop/xoay trong scrapbook/postage/comic, font hệ thống, layer SVG/PNG và file xuất. Xem bảng mẫu và tài liệu tham khảo trước khi sửa phong cách.
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
