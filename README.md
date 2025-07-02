# TremoCsv

Ứng dụng xuất danh sách file trong thư mục ra file CSV (hỗ trợ tiếng Việt, chọn loại file, cột xuất ra, v.v.)

## Yêu cầu
- Node.js >= 16
- npm >= 8

## Cài đặt
1. Tải mã nguồn về máy
2. Mở terminal tại thư mục dự án
3. Cài đặt các package cần thiết:
   ```
   npm install
   ```

## Chạy ứng dụng (chế độ dev)
```
npm start
```

## Đóng gói thành file cài đặt Windows (.exe installer)
1. Đảm bảo đã cài đủ các package:
   ```
   npm install
   ```
2. Build file cài đặt:
   ```
   npm run pack
   ```
3. File cài đặt sẽ nằm trong thư mục `dist/` (ví dụ: `TremoCsv Setup 1.0.0.exe`)

## Tính năng
- Chọn thư mục nguồn, loại file, cột xuất ra
- Hỗ trợ xuất tiếng Việt chuẩn (UTF-8 BOM)
- Đóng gói thành file cài đặt chuyên nghiệp

## Lưu ý
- Nếu muốn đổi icon, thay file `icon.ico` ở thư mục gốc
- Nếu gặp lỗi thiếu file, hãy kiểm tra lại các file nguồn (`main.js`, `preload.js`, `index.html`, `renderer.js`)

---
Mọi thắc mắc vui lòng liên hệ tác giả hoặc tạo issue trên repository! 