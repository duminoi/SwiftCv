# SwiftCV - Tài liệu Dự án

Dự án này là một trình tạo CV chuyên nghiệp được tối ưu hóa cho ATS (Applicant Tracking System) và hỗ trợ AI, lấy cảm hứng từ các nền tảng như Rezi.ai.

## 📋 Tổng kết quá trình thực hiện

### 1. Phân tích & Lập kế hoạch
- **Mục tiêu:** Tạo ra một công cụ xây dựng CV đơn giản, hiệu quả, tập trung vào nội dung và khả năng vượt qua các bộ lọc ATS.
- **Cảm hứng:** Rezi.ai (hệ thống chấm điểm, bố cục tối giản).
- **Chiến lược:** Sử dụng kiến trúc Client-side hoàn toàn để đảm bảo tính riêng tư của dữ liệu.

### 2. Bộ công nghệ (Tech Stack) thực tế
- **Frontend:** React 18 + TypeScript + Vite.
- **Styling:** Tailwind CSS v4 (sử dụng engine mới nhất) + Lucide React (Icons).
- **Quản lý trạng thái (State):** Zustand + Persist Middleware (tự động lưu dữ liệu vào LocalStorage).
- **Đa ngôn ngữ:** i18next + react-i18next (Hỗ trợ Tiếng Anh & Tiếng Việt).
- **Xử lý PDF:** `react-to-print` với cấu hình `@media print` tối ưu cho khổ A4.

### 3. Các tính năng cốt lõi đã triển khai
- **Trình chỉnh sửa thời gian thực (Live Editor):**
    - Chia đôi màn hình: Bên trái chỉnh sửa, bên phải xem trước kết quả ngay lập tức.
    - Quản lý các mục: Thông tin cá nhân, Tóm tắt, Kinh nghiệm, Học vấn, Kỹ năng.
- **Hệ thống chấm điểm thông minh (Rezi Score):**
    - Phân tích nội dung theo 5 tiêu chí: Liên hệ, Tóm tắt, Kinh nghiệm, Học vấn, Kỹ năng/Từ khóa.
    - Kiểm tra từ khóa chuyên ngành (Keywords optimization).
    - Đưa ra gợi ý cải thiện chi tiết (ví dụ: bổ sung số liệu metrics, độ dài tóm tắt).
- **Tùy biến giao diện chuyên nghiệp:**
    - **4 Mẫu CV (Templates):** Modern (Hiện đại), Minimal (Tối giản), Professional (Chuyên nghiệp), Creative (Sáng tạo - 2 cột).
    - **Cá nhân hóa:** Thay đổi màu sắc chủ đạo và phông chữ (Sans-serif, Serif, Monospace).
- **Quản lý dữ liệu:**
    - Xuất/Nhập dữ liệu dưới dạng file JSON để lưu trữ hoặc chuyển đổi thiết bị.
    - Tính năng làm mới toàn bộ (Reset) dữ liệu.

### 4. Tối ưu hóa ATS & In ấn
- Thiết kế CV sử dụng phông chữ tiêu chuẩn, cấu trúc rõ ràng giúp parser của ATS dễ dàng trích xuất thông tin.
- PDF được xuất ra giữ nguyên định dạng văn bản (không phải dạng ảnh), cho phép copy-paste text - một yếu tố quan trọng của chuẩn ATS.

## 🚀 Tính năng đã hoàn thành
- [x] Chỉnh sửa đa mục: Thông tin cá nhân, tóm tắt, kinh nghiệm, học vấn, kỹ năng.
- [x] Tự động chuyển đổi ngôn ngữ giao diện và nội dung template (EN/VI).
- [x] Hệ thống chấm điểm Rezi Score thời gian thực với phân tích từ khóa.
- [x] 4 mẫu Template chuyên nghiệp có thể chuyển đổi linh hoạt.
- [x] Tùy chỉnh màu sắc và phông chữ.
- [x] Nhập/Xuất JSON và Reset dữ liệu.
- [x] Xuất PDF chuẩn A4, tối ưu hóa cho ATS.

## 🛠 Hướng dẫn vận hành
1. Di chuyển vào thư mục dự án: `cd swiftcv`
2. Cài đặt thư viện: `npm install`
3. Chạy môi trường phát triển: `npm run dev`
4. Xây dựng bản production: `npm run build`

---
*Tài liệu được cập nhật dựa trên mã nguồn thực tế - 2026*
