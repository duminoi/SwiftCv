---
description: Code review workflow using code-review-checklist skill. Review files or folders for quality, security, and best practices.
---

# /review - Code Review Workflow

## Usage

```bash
/review                     # Review file đang mở
/review src/services        # Review cả folder
/review UserService.ts      # Review file cụ thể
```

## Workflow Steps

### Step 1: Xác định scope
- Nếu không có argument → review file đang active
- Nếu có file path → review file đó
- Nếu có folder path → list files và hỏi user muốn review file nào hoặc review tất cả

### Step 2: Đọc skill code-review-checklist
// turbo
Đọc file `.agent/skills/code-review-checklist/SKILL.md` để load checklist

### Step 3: Phân tích code
Với mỗi file cần review:
1. Đọc toàn bộ nội dung file
2. Xác định loại file (TypeScript, JavaScript, Python, etc.)
3. Phân tích theo từng mục trong checklist

### Step 4: Tạo báo cáo review
Output format:

```markdown
## 📋 Code Review: [filename]

### Summary
- Total issues: X
- 🔴 Blocking: X
- 🟡 Suggestions: X  
- 🟢 Nits: X
- ❓ Questions: X

### Issues Found

#### 🔴 BLOCKING (Phải sửa)
- [Line X] Mô tả vấn đề
  ```code snippet```
  **Fix:** Gợi ý cách sửa

#### 🟡 SUGGESTION (Nên sửa)
- [Line X] Mô tả vấn đề

#### 🟢 NIT (Tùy chọn)
- [Line X] Mô tả vấn đề

#### ❓ QUESTION (Cần giải thích)
- [Line X] Câu hỏi

### ✅ Passed Checks
- Correctness: ✅/⚠️/❌
- Security: ✅/⚠️/❌
- Performance: ✅/⚠️/❌
- Code Quality: ✅/⚠️/❌
- Testing: ✅/⚠️/❌
- Documentation: ✅/⚠️/❌
```

### Step 5: Hỏi follow-up
Sau khi review xong, hỏi user:
1. Có muốn tôi tự động fix các issues 🔴 BLOCKING không?
2. Có file nào khác cần review không?

## Checklist Categories

### Correctness
- [ ] Code does what it's supposed to do
- [ ] Edge cases handled
- [ ] Error handling in place
- [ ] No obvious bugs

### Security
- [ ] Input validated and sanitized
- [ ] No SQL/NoSQL injection vulnerabilities
- [ ] No XSS or CSRF vulnerabilities
- [ ] No hardcoded secrets or sensitive credentials
- [ ] Protection against Prompt Injection (if AI-related)

### Performance
- [ ] No N+1 queries
- [ ] No unnecessary loops
- [ ] Appropriate caching
- [ ] Bundle size impact considered

### Code Quality
- [ ] Clear naming
- [ ] DRY - no duplicate code
- [ ] SOLID principles followed
- [ ] Appropriate abstraction level

### Testing
- [ ] Unit tests for new code
- [ ] Edge cases tested
- [ ] Tests readable and maintainable

### Documentation
- [ ] Complex logic commented
- [ ] Public APIs documented
- [ ] README updated if needed

## Anti-Patterns to Flag

```typescript
// ❌ Magic numbers → 🟡 SUGGESTION
if (status === 3) { ... }

// ❌ Deep nesting → 🟡 SUGGESTION
if (a) { if (b) { if (c) { ... } } }

// ❌ Long functions (100+ lines) → 🟡 SUGGESTION

// ❌ any type → 🟢 NIT
const data: any = ...

// ❌ Hardcoded secrets → 🔴 BLOCKING
const apiKey = "sk-abc123..."
```
