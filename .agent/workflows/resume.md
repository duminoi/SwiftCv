---
description: Theo dõi và tiếp tục tính năng đang phát triển dở. Context tracking giữa các phiên làm việc.
---

# /resume - Tiếp Tục Tính Năng Đang Làm Dở

$ARGUMENTS

---

## Mục Đích

Workflow này giúp:
1. **Lưu context** tính năng đang làm dở trước khi kết thúc phiên
2. **Load context** khi bắt đầu phiên mới
3. **Theo dõi tiến độ** từng tính năng

---

## Sub-commands

```
/resume              - Xem tính năng đang làm dở
/resume save         - Lưu context trước khi nghỉ
/resume load         - Load context và tiếp tục làm
/resume list         - Liệt kê tất cả tính năng đang pending
/done [id]           - Đánh dấu tính năng hoàn thành
/resume clear [id]   - Xóa context của tính năng
```

---

## File Storage

Context được lưu tại: `docs/RESUME/`

```
docs/
└── RESUME/
    ├── _active.md           # Tính năng đang làm hiện tại
    ├── feature-1.md         # Context tính năng 1
    ├── feature-2.md         # Context tính năng 2
    └── ...
```

---

## Context File Format

### Template: `docs/RESUME/{feature-slug}.md`

```markdown
# Feature: [Tên Tính Năng]

## 📋 Thông Tin Cơ Bản

| Field | Value |
|-------|-------|
| **ID** | feature-slug |
| **Bắt đầu** | 2025-01-15 10:00 |
| **Cập nhật cuối** | 2025-01-15 18:30 |
| **Trạng thái** | 🔄 Đang làm / ⏸️ Tạm dừng / ✅ Hoàn thành |
| **Tiến độ** | 60% |

---

## 🎯 Mục Tiêu

[Mô tả ngắn gọn tính năng cần làm]

---

## ✅ Đã Hoàn Thành

- [x] Task 1 - mô tả ngắn
- [x] Task 2 - mô tả ngắn
- [x] Task 3 - mô tả ngắn

---

## ⏳ Đang Làm Dở

- [ ] Task 4 - mô tả ngắn
  - Sub-task 4.1 ✅
  - Sub-task 4.2 ⏳ ← **ĐANG Ở ĐÂY**
  - Sub-task 4.3

---

## 📝 Còn Lại

- [ ] Task 5
- [ ] Task 6
- [ ] Task 7

---

## 📁 Files Đã Thay Đổi

| File | Trạng thái | Ghi chú |
|------|------------|---------|
| `src/components/Feature.tsx` | ✅ Hoàn thành | Component chính |
| `src/hooks/useFeature.ts` | 🔄 Đang sửa | Logic xử lý |
| `src/api/feature.ts` | ⏳ Chưa làm | API endpoints |

---

## 🧠 Context Quan Trọng

### Decisions Made
- Chọn approach X thay vì Y vì [lý do]
- Dùng library Z cho [mục đích]

### Lưu Ý Kỹ Thuật
- File A phụ thuộc vào B
- Cần chạy migration trước khi test
- API endpoint `/api/xxx` đang mock

### Known Issues
- Bug #123: [mô tả] - chưa fix
- TODO: [việc cần nhớ]

---

## 🚀 Để Tiếp Tục

1. Mở file `src/hooks/useFeature.ts`
2. Tiếp tục từ function `handleSubmit()` line 45
3. Chạy `npm run dev` để test
4. Next step: [mô tả bước tiếp theo]

---

## 💬 Ghi Chú Phiên Trước

[Bất kỳ ghi chú nào từ phiên làm việc trước]
```

---

## Workflow: `/resume save`

Khi user gọi `/resume save`:

1. **Thu thập thông tin**
   - Hỏi: "Bạn đang làm tính năng gì?"
   - Hỏi: "Đang ở bước nào?" (nếu chưa rõ)

2. **Phân tích context**
   - Scan các files đã thay đổi gần đây
   - Xác định files liên quan đến tính năng
   - Ghi nhận tiến độ

3. **Tạo/cập nhật context file**
   - Tạo `docs/RESUME/{feature-slug}.md`
   - Cập nhật `docs/RESUME/_active.md`

4. **Confirm**
   ```
   ✅ Đã lưu context tính năng: [tên]
   
   📊 Tiến độ: 60%
   ⏸️ Dừng tại: [mô tả]
   📁 Files liên quan: 5
   
   Để tiếp tục: /resume load
   ```

---

## Workflow: `/resume load` hoặc `/resume`

Khi user bắt đầu phiên mới:

1. **Check active feature**
   - Đọc `docs/RESUME/_active.md`
   - Nếu có → hiển thị summary

2. **Display context**
   ```markdown
   ## 🔄 Tiếp Tục: [Tên Tính Năng]
   
   **Tiến độ:** ████████░░ 80%
   **Cập nhật cuối:** 2 giờ trước
   
   ### Bạn đang ở đâu:
   - Task: [tên task]
   - File: `src/hooks/useFeature.ts`
   - Vị trí: function `handleSubmit()` line 45
   
   ### Next Steps:
   1. [Bước tiếp theo 1]
   2. [Bước tiếp theo 2]
   
   ### Quick Links:
   - [Mở file chính](file:///....)
   - [Xem plan](file:///docs/RESUME/feature.md)
   
   Bắt đầu tiếp tục? (y/n)
   ```

3. **Mở files liên quan**
   - Suggest mở file đang làm dở
   - Di chuyển cursor đến vị trí cần thiết

---

## Workflow: `/resume list`

Hiển thị tất cả tính năng đang pending:

```markdown
## 📋 Tính Năng Đang Pending

| # | Tên | Tiến độ | Cập nhật | Trạng thái |
|---|-----|---------|----------|------------|
| 1 | user-authentication | ████████░░ 80% | 2h ago | 🔄 Active |
| 2 | dark-mode | ████░░░░░░ 40% | 2d ago | ⏸️ Paused |
| 3 | export-pdf | ██░░░░░░░░ 20% | 1w ago | ⏸️ Paused |

Để tiếp tục: `/resume load [tên-feature]`
Để đánh dấu xong: `/done [tên-feature]`
```

---

## Workflow: `/done [id]`

Đánh dấu tính năng hoàn thành:

1. Cập nhật status → ✅ Hoàn thành
2. Move file sang `docs/RESUME/archive/`
3. Clear `_active.md` nếu là feature active

```
✅ Đã hoàn thành: [tên tính năng]

📊 Thống kê:
- Thời gian: 3 ngày
- Files thay đổi: 12
- Tasks hoàn thành: 8/8

Đã archive sang: docs/RESUME/archive/
```

---

## Auto-Save Reminder

Khi phát hiện user sắp kết thúc phiên (nói "bye", "tạm biệt", "nghỉ", "stop"):

```
💡 Nhắc nhở: Bạn đang làm dở tính năng [tên].

Bạn muốn lưu context trước khi nghỉ không?
- `/resume save` - Lưu context
- `/resume` - Xem context hiện tại
- Bỏ qua - Tiếp tục nghỉ
```

---

## Key Principles

- **Atomic saves** - Lưu ngay khi có thay đổi quan trọng
- **Rich context** - Ghi đủ chi tiết để "future self" hiểu
- **Quick resume** - Tối đa 2 phút để quay lại làm việc
- **Progress visibility** - Luôn thấy rõ tiến độ

---

## Examples

```
/resume                     - Xem feature đang làm dở
/resume save               - Lưu context trước khi nghỉ
/resume load auth-feature  - Load context feature cụ thể
/resume list               - Xem tất cả features pending
/done auth-feature         - Đánh dấu hoàn thành
```
