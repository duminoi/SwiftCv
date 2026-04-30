---
description: Giải thích chi tiết luồng hoạt động của code kèm sơ đồ tổng quan và comment chi tiết
---

# Quy trình Giải thích Luồng Code (Explain Code Flow)

Quy trình này giúp user hiểu rõ luồng hoạt động của một tính năng hoặc một đoạn code phức tạp thông qua sơ đồ trực quan và giải thích chi tiết từng bước.

## Bước 1: Tiếp nhận và Phân tích Yêu cầu
1. Xác định rõ tính năng, API, hoặc luồng logic mà user muốn tìm hiểu.
2. Tìm kiếm và đọc hiểu các file code liên quan (Controller, Service, Model, View file, v.v.).

## Bước 2: Tạo Sơ đồ Tổng quan (ASCII Art Flowchart)
Tạo sơ đồ dạng **ASCII Art** để thể hiện luồng đi tổng quan. Sơ đồ ASCII giúp dễ dàng hiển thị trong mọi môi trường mà không phụ thuộc vào plugin render (như Mermaid).

**Quy tắc vẽ sơ đồ:**
- **Layout:** Dọc (Top-Down) để dễ đọc trên thiết bị di động và terminal.
- **Box:** Sử dụng các ký tự `+`, `-`, `|` để tạo khung.
- **Arrow:** Sử dụng `|`, `v`, `-->`, `<--` để điều hướng.
- **Layer:** Phân chia rõ ràng Frontend, Backend, Database.

**Template chuẩn:**
```text
      [🖥️ Frontend Layer]
      +---------------------+
      |   User Interface    | (Component UI)
      +----------+----------+
                 | 1. User Action
                 v
      +---------------------+
      |     Custom Hook     | (Logic Handle)
      +----------+----------+
                 | 2. HTTP Request
                 v
      [⚙️ Backend Layer]
      +---------------------+
      |    API Endpoint     | (Route Handler)
      +----------+----------+
                 |
                 v
      +---------------------+
      |     Controller      | (Validation)
      +----------+----------+
                 | 3. Validated DTO
                 v
      +---------------------+
      |       Service       | (Business Logic)
      +----------+----------+
                 | 4. Query Data
                 v
        [🗄️ Data Layer]
      +---------------------+
      |     Repository      |
      +----------+----------+
                 | 5. CRUD
      +----------v----------+
      |      Database       |
      +---------------------+
```

## Bước 3: Giải thích Chi tiết Từng Bước
Phân rã luồng hoạt động thành các bước logic tuần tự. Với mỗi bước, cung cấp thông tin theo cấu trúc bắt buộc sau:

### [Bước X]: [Tên hành động]

- **File:** `[Đường dẫn file (tương đối hoặc tuyệt đối)]`
- **Logic:**
  - Mô tả ngắn gọn input, xử lý nghiệp vụ, và output.
  - Giải thích "tại sao" lại làm như vậy (nếu code phức tạp).
- **Code:**
  - Copy đoạn code gốc quan trọng nhất của bước này.
  - **BẮT BUỘC:** Chèn comment tiếng Việt (`// ...`) vào trực tiếp code để giải thích dòng code đó làm gì.

*Ví dụ template:*

### Bước 2: Kiểm tra tồn kho
- **File:** `api/services/order.service.ts`
- **Logic:** Hệ thống kiểm tra số lượng tồn kho thực tế của sản phẩm. Nếu số lượng trong kho nhỏ hơn số lượng khách đặt, hệ thống sẽ chặn và báo lỗi ngay lập tức.
- **Code:**
```typescript
async validateStock(itemId: string, quantity: number) {
    // 1. Lấy thông tin inventory từ DB
    const stock = await inventoryRepo.getStock(itemId);
    
    // 2. So sánh với số lượng khách đặt
    if (stock.available < quantity) {
        // ❌ Nếu không đủ hàng -> Ném lỗi kèm thông báo chi tiết
        throw new Error(`Sản phẩm ${projectId} không đủ hàng. Còn: ${stock.available}`);
    }

    // ✅ Đủ hàng -> Trả về true để tiếp tục
    return true;
}
```

## Bước 4: Kiểm tra và Tổng hợp
1. Rà soát lại xem sơ đồ và code có khớp nhau không.
2. Đảm bảo ngôn ngữ giải thích dễ hiểu, tự nhiên (Tiếng Việt).
3. Đảm bảo đã chèn comment tiếng Việt vào trong các block code.
