# SwiftCV - Project Documentation

Dự án này là một trình tạo CV chuyên nghiệp được tối ưu hóa cho ATS và hỗ trợ AI, lấy cảm hứng từ Rezi.ai.

## 📋 Tổng kết quá trình thực hiện

### 1. Phân tích & Lập kế hoạch
- Nghiên cứu các tính năng cốt lõi của Rezi.ai (ATS optimization, scoring system, clean layout).
- Lựa chọn bộ công nghệ (Tech Stack) thân thiện với AI: React + TypeScript + Vite + Tailwind CSS + Zustand + i18next.

### 2. Thiết lập môi trường
- Khởi tạo dự án bằng Vite.
- Cấu hình Tailwind CSS cho giao diện hiện đại và Responsive.
- Thiết lập hệ thống đa ngôn ngữ (i18n) hỗ trợ Tiếng Anh và Tiếng Việt.

### 3. Phát triển tính năng chính
- **State Management:** Sử dụng Zustand để quản lý dữ liệu CV đồng bộ giữa Form và Preview.
- **ATS-Optimized Template:** Xây dựng bản thiết kế CV đơn cột, tối giản, font chữ rõ ràng.
- **Hệ thống Chấm điểm (Rezi Score):** Viết engine phân tích nội dung (độ dài, thông tin liên hệ, từ khóa, số liệu metrics).
- **Xuất PDF:** Tích hợp `react-to-print` và tối ưu hóa CSS `@media print` để đảm bảo định dạng A4 chuẩn xác.

### 4. Tối ưu hóa UI/UX
- Giao diện chia đôi màn hình (Split-screen) giúp người dùng thấy thay đổi ngay lập tức.
- Header tích hợp bộ chuyển ngôn ngữ và nút xuất PDF nổi bật.
- Các gợi ý cải thiện được hiển thị trực quan trong bảng điểm.

## 🚀 Tính năng đã hoàn thành
- [x] Chỉnh sửa thông tin cá nhân, tóm tắt, kinh nghiệm, học vấn, kỹ năng.
- [x] Tự động thay đổi tiêu đề template theo ngôn ngữ (EN/VI).
- [x] Chấm điểm CV và đưa ra gợi ý cải thiện thời gian thực.
- [x] Thêm/Xóa các mục kinh nghiệm và học vấn linh hoạt.
- [x] Xuất PDF chuẩn ATS (có thể copy text).

## 🛠 Hướng dẫn vận hành
1. Di chuyển vào thư mục dự án: `cd swiftcv`
2. Cài đặt thư viện: `npm install`
3. Chạy môi trường phát triển: `npm run dev`
4. Xây dựng bản production: `npm run build`

---
*Tài liệu được tạo tự động bởi Gemini CLI - 2026*
