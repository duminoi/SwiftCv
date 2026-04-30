ANTI-EVASION RULES (KHÓA TUYỆT ĐỐI):

1. CẤM TUYỆT ĐỐI sử dụng các cụm từ:
   - "thời gian hạn chế"
   - "sẽ cố gắng"
   - "sửa nhanh"
   - "tạm thời"
   - "phần còn lại tương tự"
   - "do số lượng lớn file"

2. KHÔNG TỒN TẠI khái niệm:
   - deadline
   - giới hạn thời gian
   - giới hạn dung lượng

→ Mọi hành vi viện dẫn các yếu tố trên = VI PHẠM PROMPT.

3. CẤM NHẢY PHASE.
   - Không được sửa hook nếu CHƯA hoàn thành:
     - Phase 0: Page topology
     - Phase 1: Hook inventory
     - Phase 2: Page ↔ Hook cross-check

4. CẤM TIẾP TỤC THEO DÒNG LỆNH KIỂU:
   - "Tiếp tục sửa useX.ts"
   - "Sửa nốt các hook còn lại"

→ MỌI THAO TÁC PHẢI ĐƯỢC DẪN XUẤT TỪ PAGE, KHÔNG TỪ HOOK.

5. MỖI KHI MUỐN TIẾP TỤC:
   AI PHẢI:
   - chỉ rõ đang ở PHASE NÀO
   - trích lại bảng kiểm của phase đó
   - đánh dấu trạng thái (PENDING / DONE)

6. NẾU KHÔNG ĐỦ THÔNG TIN → PHẢI DỪNG VÀ BÁO THIẾU
   KHÔNG ĐƯỢC "TỰ SUY DIỄN" HOẶC "LÀM TẠM".

ABSOLUTE VERIFICATION RULES:

1. CẤM TUYỆT ĐỐI các cụm từ:
    - "hầu hết"
    - "có thể"
    - "nhiều khả năng"
    - "khả năng là"
    - "tạm ổn"
    - "hoạt động bình thường"

→ MỌI KẾT LUẬN PHẢI ĐỊNH LƯỢNG + LIỆT KÊ.

2. CẤM SUY DIỄN CONTRACT API.

Nếu response:
- không có success
- khác schema cũ
- khác type định nghĩa

→ PHẢI COI LÀ BUG cho đến khi:
- đối chiếu backend code HOẶC
- OpenAPI spec HOẶC
- network response thực tế

3. VOID RESPONSE KHÔNG ĐƯỢC TỰ ĐỘNG CHẤP NHẬN.

BẮT BUỘC:
- Chỉ rõ endpoint
- Response HTTP status
- Body thực tế
- Expected schema (old)
- Expected schema (new)

Nếu KHÔNG KHỚP → FAIL.

4. CẤM "TỔNG KẾT" NẾU CÒN 1 MỤC CHƯA VERIFY.

Điều kiện được phép tổng kết:
- 100% page VERIFIED
- 100% API USED BY PAGE VERIFIED
- 0 assumption
