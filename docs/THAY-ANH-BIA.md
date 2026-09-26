# Thay ảnh bìa sách

## 1. Thêm ảnh

Đặt ảnh của bạn vào `assets/covers/`, ví dụ:

- `assets/covers/chibi-animals.webp`
- `assets/covers/kpop-coloring.jpg`

Nên dùng ảnh mặt trước, không có nền bên ngoài bìa. Bìa mẫu có tỷ lệ 600 × 780. Ảnh khác tỷ lệ hiện được cắt vừa khung bằng `object-fit: cover`.

## 2. Đổi một dòng cho mỗi sách

Mở `src/data.js`, tìm sách cần thay rồi sửa:

```js
coverImage: './assets/covers/chibi-animals.webp',
```

Tên sách sửa tại `title`, màu gáy tại `color`, giới thiệu tại `description`. Giữ nguyên `id` nếu muốn giữ các liên kết, danh sách yêu thích và tranh đã lưu.

Ảnh mới tự xuất hiện ở Hero, danh mục kéo ngang, chi tiết sản phẩm, hộp mở khi cuộn và hình bật ra khi hover thể loại. Không cần chỉnh từng animation.

## 3. Muốn hiển thị bìa vuông?

Thêm vào cuối `src/motion.css`:

```css
.image-cover { aspect-ratio: 1; }
.image-cover img { object-fit: contain; }
.scene-book, .genre-floater { aspect-ratio: 1; }
```

Kiểm tra lại phần hộp mở khi cuộn vì bố cục hiện tối ưu cho bìa dọc.

## 4. Chạy bản mới

Trong Terminal ở thư mục dự án:

```sh
git pull origin main
npm ci
npm run dev
```

Mở `http://localhost:3000`. Nếu đã chạy server, dừng bằng Ctrl+C rồi chạy lại. Dùng Ctrl+F5 để tải lại ảnh và CSS nếu trình duyệt đang giữ bản cũ.

## 5. Thay trang tô màu

Ảnh bìa là ảnh thông thường. Trang tương tác trong sách là SVG có các vùng kín, khai báo ở `src/art.js`. Thay ảnh bìa không thay nội dung tô màu. Không thể dùng trực tiếp ảnh JPG/PNG làm trang tô từng vùng trong engine hiện tại; cần chuẩn bị SVG phân vùng tương ứng.


## Danh mục sách thật (cập nhật)
Ba bìa người dùng cung cấp được lưu dạng WebP trong `assets/covers/`. Dữ liệu và mô tả đầy đủ nằm trong `src/data.js`. `coverWidth` / `coverHeight` giữ nguyên tỷ lệ bìa; cập nhật cả hai khi thay ảnh.

- K-Pop Warrior: 60 trang (40 chính + 20 bonus), 8.5 × 8.5 inch.
- Everything Chibi: 50 con vật; chưa có số trang và khổ sách.
- Vehicles: 40 phương tiện, 10 bước mỗi bài theo mô tả được cung cấp, tuổi 8+. Không suy ra số trang từ số bài. Bìa gốc có dòng “120 step-by-step drawing lessons”; giữ nguyên ảnh gốc, không sửa chữ trên bìa.

Chưa có trang ruột hoặc link mua: minh họa tô màu được ghi rõ là studio demo, không phải trang sách thật. Điền `amazonUrl` khi có đường dẫn chính thức.
