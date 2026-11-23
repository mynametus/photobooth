# Hướng thiết kế bộ sưu tập photobooth

Cập nhật ngày 23/11/2026 theo các nguồn và ảnh tham khảo người dùng cung cấp.

## Điều rút ra từ nguồn tham khảo

- [Canva — Photo strip templates](https://www.canva.com/templates/s/photo-strip/): danh mục có nhiều ngôn ngữ thiết kế như hóa đơn, phim vintage, bookmark, phối màu playful và dịp sinh nhật. Một mẫu cần có hệ chữ, khoảng ảnh, màu và chi tiết nhận diện đi cùng nhau.
- [Life4Cuts](https://life4cuts.co.uk/) và [gallery](https://life4cuts.co.uk/gallery): trang giới thiệu các khung có chủ đề riêng và trải nghiệm giữ lại bốn khoảnh khắc. Hướng áp dụng là chọn trọn một phong cách, xem thử bằng ảnh của người chụp và giữ bố cục rõ ràng.
- [TemplatesBooth — Canva photo booth templates](https://templatesbooth.com/canva-photo-booth-templates/): tổ chức mẫu theo bố cục và bộ sưu tập sự kiện, hỗ trợ sửa tên, ngày và màu. [Bộ sưu tập wedding](https://templatesbooth.com/collection/wedding/) cho thấy cách triển khai cùng phong cách qua nhiều khổ ảnh, với nhóm botanical, rustic và elegant.

Các trang danh mục và mô tả mẫu đọc được qua công cụ web. Nội dung đầy đủ trong trình biên tập Canva không truy cập được; tải ảnh tham khảo về máy qua mạng hiện tại cũng thất bại. Những nhận định trên dựa vào nội dung danh mục và thông tin hình ảnh do tìm kiếm trả về.

## Bốn nguồn bổ sung cho gia đình và trẻ em

- [TemplatesBooth — Family](https://templatesbooth.com/collection/family/): danh mục gia đình, sinh nhật trẻ em, baby shower và trường học; có hướng pirate, carnival, rustic, plaid và nhiều bố cục. Áp dụng thành rạp xiếc, hải tặc, album nhà mình, kẻ plaid và ngày đầu tới lớp, với bố cục dải dọc/lưới thống nhất.
- [Yeoja Crafts — Cute Photobooth Templates](https://yeojacrafts.gumroad.com/l/xmdye): thông tin và hình được lập chỉ mục cho thấy bộ hơn 20 thiết kế Canva, có phong cách film, pastel, hoa và ô ảnh oval. Trang sản phẩm không trả nội dung trực tiếp; đã tham khảo kết quả tìm kiếm/hình ảnh công khai, không mua hoặc tải bộ gốc. Áp dụng thành Pastel film club, Bloom & oval, Ribbon diary và Pixel crush; ảnh oval được cắt thực trong Canvas.
- [Vivid Curiosity — Kids](https://www.vividcuriosityphotobooths.com/store/kids): danh mục có chủ đề nàng tiên cá, cún, phép thuật và sinh nhật trẻ em. [Trang Wizard](https://www.vividcuriosityphotobooths.com/store/p/wizard-birthday-magic-party-photo-booth-template-canva) mô tả cú, đũa phép, sách và nến. Áp dụng thành các cảnh minh họa nàng tiên cá, cú phù thủy, cún phi hành gia, safari và khủng long của dự án.
- [Pngtree — Photo booth strips](https://pngtree.com/free-png-vectors/photo-booth-strips): các mục PNG/vector nền trong suốt, cartoon và trẻ em gợi ý cách tách lớp trang trí khỏi ảnh. Áp dụng bằng PNG minh họa nền trong suốt, tải cùng website và ghép dưới lớp chữ; không phụ thuộc ảnh từ nguồn ngoài khi người dùng xuất ảnh.

16 mẫu bổ sung là thiết kế mới của dự án. Tám cảnh có nhân vật được tạo bằng `image_gen.imagegen`; prompt đầy đủ và đường dẫn asset ở [FAMILY_ASSETS.md](FAMILY_ASSETS.md).

## Bộ mẫu trong dự án

Các mẫu được dựng bằng SVG gốc và lớp minh họa PNG khi cần, gồm nền, khung giấy, typography và vùng chữ tùy chỉnh. Mỗi mẫu có hai bản bố cục với cùng phong cách.

| Mẫu | Hướng tạo hình | Chi tiết nhận diện |
| --- | --- | --- |
| Nơ hồng | Coquette, romantic | Ruy băng satin có nếp gấp, chuỗi ngọc trai, sọc hồng, ren quanh ảnh, chữ viết tay |
| Nhật ký chúng mình | Scrapbook | Nền giấy kẻ, mép giấy xé, ảnh nghiêng, băng dính, tem thư và ghi chú |
| Cherry café | Café, playful | Caro đỏ, nhãn café hai nét, cherry tô chuyển sắc, nền kem, chữ serif |
| Sau nửa đêm | Celestial | Nền tinh vân, đường chòm sao, sao nhiều cỡ, trăng vàng, viền ảnh ánh kim |
| Khu vườn ký ức | Botanical stationery | Nhánh lá có gân, hoa nhiều cánh, nền giấy kẻ, khung vòm trang trí, dấu sáp |
| The summer club | Coastal | Lớp sóng, bãi cát, vỏ sò có đường khía, san hô, mặt trời màu cam |
| Make a wish | Celebration | Bóng bay chuyển sắc và dây uốn, giấy kim tuyến, sao vàng, tiêu đề sự kiện |
| Hóa đơn niềm vui | Receipt | Mép giấy nhiệt, chữ monospace, số thứ tự, đường xé, tổng kỷ niệm và mã vạch |
| Hẹn mùa anh đào | Spring stationery | Cành anh đào, cánh hoa rơi, quạt giấy, khung vòm hồng |
| Một bó tulip | Flower shop | Bó hoa gói giấy, ruy băng và sọc vàng bơ |
| Cúc nhỏ đầu hè | Daisy garden | Hoa cúc nhiều cánh, đường lượn và bảng màu xanh nắng |
| Thư từ Provence | Lavender letter | Nhánh oải hương, phong bì niêm sáp, dấu thư |
| Strawberry picnic | Picnic | Dâu tây có hạt, khăn caro, hoa trắng và nhãn mứt |
| Matcha & you | Tea club | Bát trà, chổi chasen, lá trà và nhãn tiệm |
| Lemon soda club | Coastal café | Gạch xanh, lát chanh, ly soda và lá chanh |
| Đào ngọt mùa hạ | Fruit market | Đào tô chuyển sắc, lá vườn và nhãn trái cây |
| Passport of us | Travel document | Đường kinh vĩ tuyến, máy bay và dấu nhập cảnh |
| Suất chiếu đôi mình | Cinema | Lỗ cuộn phim, vé rạp và bảng clap |
| Mixtape tình bạn | Music diary | Băng cassette có cuộn băng, equalizer và nốt nhạc |
| Gửi một ngày vui | Postcard | Ảnh nghiêng, tem răng cưa và dấu bưu điện |
| Our next chapter | Graduation | Mũ cử nhân, tua vàng, bằng tốt nghiệp và lá nguyệt quế |
| Ngày mình chung đôi | Wedding stationery | Nhẫn cưới, hoa trắng, lá ép và khung champagne |
| A little Christmas | Holiday gift wrap | Nhánh thông, quả châu và hộp quà có nơ |
| Tết sum vầy | Tết | Hoa mai năm cánh, đèn lồng và bao lì xì |
| Gấu đi picnic | Cartoon picnic | Gấu má hồng ôm giỏ bánh, khăn caro, dấu chân và lời chào |
| Hội mèo tinh nghịch | Cartoon pets | Mèo đeo nơ, đuôi cong, cuộn len và dấu chân |
| Thỏ trên mây | Cartoon dreamland | Thỏ tai hồng ôm tim, mây trắng, cầu vồng và sao |
| Chuyện vui bốn ô | Pop-art comic | Ảnh nghiêng, nét viền đậm, chấm halftone và bong bóng thoại |
| Tiệm bánh mùa đông | Cozy character scene | Hổ con ở quầy bánh, mái hiên sọc, dây đèn và tuyết |
| Biệt đội bay giữa mây | Sky character scene | Rái cá phi công, máy bay xanh, bóng đỏ và mây |
| Thỏ ôm tim | Bold pink character | Thỏ trắng ôm tim đỏ, mèo nhỏ, nền hồng tim và chân tím |
| Hội bạn bóng bay | Sticker character party | Nhóm thú bông, bóng tim, viền sticker trắng và nền turquoise |
| Ngày hội sắc màu | Carnival | Động vật ở rạp xiếc, vòng quay, mái hiên và vé nhỏ |
| Safari nhí | Safari | Sư tử, hươu cao cổ, xe khám phá, dây leo và lá |
| Thung lũng khủng long | Dinosaur storybook | Khủng long con, trứng nở, dương xỉ và đồi xanh |
| Vương quốc san hô | Mermaid lagoon | Nàng tiên cá, rùa biển, ngọc trai, san hô và sóng |
| Học viện phép thuật | Wizard stationery | Cú phù thủy, sách phép, nến, sao vàng và nền xanh đậm |
| Phi hành gia tí hon | Space puppies | Cún phi hành gia, tên lửa, trăng và hành tinh |
| Nhà cáo đi picnic | Family picnic | Gia đình cáo, giỏ picnic, hoa cúc và caro đào |
| Kho báu tuổi thơ | Pirate cove | Hải tặc nhí, thuyền buồm, rương sao và la bàn |
| Album nhà mình | Family scrapbook | Mép giấy xé, ảnh nghiêng, khung polaroid và nhãn nhỏ |
| Ngày đoàn viên | Tartan album | Kẻ plaid nhiều lớp, đường may và trái tim vải |
| Hello baby | Baby stationery | Nền kem, mây trắng, đồ treo nôi và sao nhỏ |
| Ngày đầu tới lớp | School notebook | Giấy kẻ, bút chì, bảng ghi nhớ và nét chữ xanh |
| Pastel film club | Pastel film | Gradient pastel, lỗ cuộn phim và máy ảnh tím |
| Bloom & oval | Floral oval | Ảnh cắt oval, nền sọc hồng, hoa cúc và nơ xanh |
| Pixel crush | Y2K diary | Nền lưới hồng, con trỏ, icon tim và cửa sổ pixel |
| Ribbon diary | Ribbon stationery | Nền giấy ô, ảnh nghiêng, nơ xanh và dấu tròn |

Bốn mẫu Tiệm bánh mùa đông, Biệt đội bay giữa mây, Thỏ ôm tim và Hội bạn bóng bay được phát triển sau khi người dùng gửi ảnh chụp gallery Instagram. Những đặc điểm nhìn thấy được áp dụng gồm màu nền đậm, tiêu đề lớn, minh họa nhiều chi tiết và bối cảnh đi cùng nhân vật. Minh họa mới tạo bằng công cụ imagegen tích hợp; prompt và file được ghi ở [CHARACTER_ASSETS.md](CHARACTER_ASSETS.md).

## Luồng chọn mẫu

Mặc định là Nơ hồng. Nút **Chọn mẫu khung** mở thư viện lớn có nhóm chủ đề. Chọn một mẫu áp dụng phối màu và bộ lọc được thiết kế sẵn; ảnh nguồn, crop và lời nhắn được giữ lại. Có thể đổi bố cục, chỉnh màu, bộ lọc, sticker và ngày chụp sau đó.

Thư viện hiện có 48 mẫu trong 10 nhóm, hỗ trợ tìm kiếm không dấu và các từ khóa phổ biến. 16 mẫu mới đứng đầu; ba nhóm bổ sung là Gia đình (4), Trẻ em (8), Dễ thương (4). Nhóm Cartoon có 8 mẫu; từ khóa `hoat hinh` tìm được cả 8 cảnh mới. Có thể tìm bằng `gia dinh`, `khung long`, `bau duc`, `oval`, `pastel`, `tiem banh` hoặc `hoat hinh`. Gallery chỉ dựng thẻ khi mở và ghép thumbnail khi gần vùng nhìn thấy.

Chế độ **Tự phối khung** chứa các kiểu viền cơ bản và bảng màu của phiên bản trước. Mẫu thiết kế và khung tự phối có thông tin riêng trong bước xuất ảnh.

## Kiểm tra hình ảnh

- `node scripts/preview-templates.mjs` tạo 96 bản SVG minh họa, bảng đủ 48 mẫu, 6 trang bộ sưu tập, bảng Cartoon và bảng 12 mẫu PNG. Hai bảng `test-results/template-family-kids-1.png`, `test-results/template-family-kids-2.png` chứa đủ 16 mẫu mới, đã xem trực tiếp cả dải dọc và lưới. PNG được nhúng vào SVG khi kiểm tra hình vẽ bằng Sharp.
- Các nhân vật trong bảng mẫu là minh họa vị trí ảnh. Trong thư viện app, đủ bốn ảnh sẽ tạo preview bằng ảnh người dùng với cùng renderer xuất ảnh.
- Layer minh họa vị trí ảnh chỉ nằm trong SVG preview; renderer thành phẩm ghép ảnh thật giữa layer nền và layer trang trí.
- Kích thước xuất vẫn là 1200 × 3044 px cho dải dọc và 1600 × 1206 px cho lưới. Vùng crop giữ tỷ lệ 8:5; mẫu oval cắt ellipse bên trong vùng đó, cùng hình học cho placeholder SVG và ảnh Canvas.
- Kiểm tra raster SVG đã thực hiện; thao tác app và camera trên trình duyệt vẫn cần xác minh trong môi trường cho phép khởi chạy Chrome.
