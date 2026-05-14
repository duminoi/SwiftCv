# SwiftCv — Roadmap Cạnh Tranh 6 Giai Đoạn

## Tổng Quan Khoảng Cách vs 10 Đối Thủ Hàng Đầu

| # | Khoảng cách | Mức độ | Tất cả 10 đối thủ đều có |
|---|---|---|---|---|
| 1 | ✅ **AI tích hợp** (Analysis + Rewrite + Suggest) | Đã giải quyết | GPT-4.1, 11 AI agents |
| 2 | ✅ **JD Matching** (match score + keyword gaps) | Đã giải quyết | Grammarly, Jobscan, Rezi, Careerkit |
| 3 | **Không có Backend / Tài khoản** | 🔴 Sống còn | Tất cả 10/10 |
| 4 | **Không có Monetization** | 🔴 Sống còn | $2.95–$149/tháng |
| 5 | ✅ **ATS Scoring cải thiện** (action verbs + metrics + details) | Đã giải quyết | Rezi 1–100 real-time chi tiết |
| 6 | **4 templates** (Resumly có 200+) | 🟡 Trung bình | Trung bình ~50–200 |
| 7 | **2 ngôn ngữ** (EN/VI), Resumly 40+ | 🟡 Trung bình | StylingCV 10+, Resumly 40+ |
| 8 | **Không mobile app** | 🟡 Trung bình | NeuraCV có mobile app |
| 9 | **Không Job Tracker** | 🟢 Thấp | Teal có |
| 10 | **Không Cover Letter** | 🟢 Thấp | Hầu hết đều có |

### Bảng So Sánh Trực Tiếp

| Nền tảng | Điểm mạnh chính | Link |
|---|---|---|
| Rezi | ATS scoring real-time 1–100, keyword targeting, bản lifetime $149 | https://rezi.ai |
| ResuFit | Free plan tốt nhất, ATS scan + keyword optimization | https://resufit.com |
| Kickresume | GPT-4.1, 8M users, template ATS-friendly | https://kickresume.com |
| StylingCV | 11 AI agents, ATS score real-time, 10+ ngôn ngữ | https://stylingcv.com |
| Resumly | 200+ template, 40+ ngôn ngữ, ATS check file-level | https://resumly.ai |
| Grammarly Resume Builder | Alignment score vs JD, feedback cụ thể | https://grammarly.com/resume-builder |
| NeuraCV | ATS scan workflow, mobile app | https://neuracv.com |
| Careerkit | ATS score live, rẻ ($2.95/tháng) | https://careerkit.me |
| Teal | Job tracker + Chrome extension | https://tealhq.com |
| Jobscan | Scan ATS chuyên sâu nhất | https://jobscan.co |

---

## GIAI ĐOẠN 1: Foundation — Sửa Nền Móng (1–2 tuần)

> **Mục tiêu:** Sửa tất cả lỗi hiện hữu, hoàn thiện tính năng đã code dở, chuẩn bị nền cho các phase sau.

### 1.1 Sửa lỗi UI/UX hiện hữu

| # | Task | File | Chi tiết |
|---|---|---|---|
| 1 | **Sửa header hardcoded** | `src/App.tsx:338` | Đang luôn hiện "The International Standard" → đọc `currentTemplate` từ store để hiển thị đúng tên template đang chọn |
| 2 | **Kích hoạt nút Zoom** | `src/App.tsx:431–437` | Zoom in/out buttons không có `onClick` → thêm state `zoomLevel` (0.5–1.5), áp dụng `transform: scale()` lên `.cv-paper` |
| 3 | **Thêm nút Import/Export JSON** | `src/App.tsx` | `importData` và `exportData` đã có trong store, i18n keys đã có → thêm 2 nút vào toolbar (cạnh Download PDF) |
| 4 | **Thêm input Portfolio** | `src/App.tsx:139–142` | Trường `portfolio` đã có trong data model, nhưng không có input field → thêm vào phần Personal |
| 5 | **Kích hoạt Photo Upload** | `src/App.tsx`, `src/components/InputField.tsx` | Thêm input type=file, convert sang base64 lưu vào `personalInfo.photo`, hiển thị trong Standard template |
| 6 | **Kích hoạt Font/Color Settings** | `src/App.tsx` | Thêm tab "Settings" dùng `setPrimaryColor` và `setFontFamily` từ store → truyền props vào templates |
| 7 | **Responsive mobile** | `src/App.tsx:423` | Panel preview đang `hidden md:flex` → thêm chế độ toggle (nút "Preview" trên mobile) |

### 1.2 Cải thiện ATS Scoring (Rule-based)

| # | Task | File | Chi tiết |
|---|---|---|---|
| 8 | **Tách scoring engine ra module riêng** | `src/store/cvAnalyzer.ts` | Chuẩn bị để sau này thêm trọng số động, keyword matching với JD |
| 9 | **Thêm chi tiết breakdown** | `src/store/cvAnalyzer.ts` | Hiện breakdown chỉ là con số → thêm sub-score: contact completeness, quantifiable metrics count, action verbs count, keyword density |
| 10 | **Thêm action verbs detection** | `src/store/cvAnalyzer.ts` | Kiểm tra bullet points có dùng action verbs mạnh (Led, Spearheaded, Achieved...) → +điểm |

### 1.3 Dọn dẹp kỹ thuật

| # | Task | Chi tiết |
|---|---|---|
| 11 | Xoá boilerplate Vite | `src/App.css`, `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg` |
| 12 | Loại bỏ `lucide-react` khỏi dependencies | Không dùng đến → giảm bundle size |

---

## GIAI ĐOẠN 2: AI Core — Tích Hợp AI Thật (2–3 tuần)

> **Mục tiêu:** Đây là giai đoạn quan trọng nhất. Hiện tại "AI Analysis" là giả (rule-based). Phải có AI thật mới cạnh tranh được với Kickresume (GPT-4.1), StylingCV (11 AI agents).

### 2.1 Quyết định kiến trúc

**Đề xuất: Thêm Vercel Serverless Functions (API Routes)**
- Lý do: Đã deploy trên Vercel, không cần thay đổi hạ tầng
- File: `api/analyze.ts`, `api/generate.ts`, `api/rewrite.ts`
- AI Provider: **Google Gemini 2.5 Pro** (đã có config trong `.opencode/`, rẻ hơn GPT-4, chất lượng ngang ngửa cho text)

### 2.2 Các API Endpoints cần xây dựng

| # | Endpoint | Chức năng | Prompt Engineering |
|---|---|---|---|
| 13 | `POST /api/analyze` | Phân tích CV chi tiết (thay thế `cvAnalyzer.ts`) | Trả về: overall score 1–100, category breakdown, 5–10 suggestions cụ thể kèm vị trí trong CV, keyword recommendations |
| 14 | `POST /api/rewrite-summary` | Viết lại Professional Summary | Input: summary hiện tại + job title → Output: 3 phiên bản ATS-optimized với tone khác nhau |
| 15 | `POST /api/rewrite-bullets` | Viết lại bullet points kinh nghiệm | Input: bullet point gốc → Output: phiên bản dùng action verbs mạnh + thêm quantified metrics (nếu có context) |
| 16 | `POST /api/suggest-skills` | Gợi ý skills dựa trên kinh nghiệm | Input: experience text → Output: 10–15 skills phù hợp industry |
| 17 | `POST /api/generate-summary` | Tạo summary từ đầu | Input: experiences + education + job title → Output: 3–5 câu summary chuyên nghiệp |

### 2.3 Prompt Engineering Strategy

Mỗi API endpoint cần:
- **System prompt** chặt chẽ: "You are an ATS-optimization expert and professional CV writer..."
- **Output format**: JSON với schema cố định (dùng `response_schema` của Gemini)
- **Anti-hallucination**: Prompt yêu cầu chỉ dựa trên input, không bịa đặt thành tích
- **Language detection**: Tự động detect EN/VI để trả lời đúng ngôn ngữ

### 2.4 UI cho AI Features

| # | Task | Chi tiết |
|---|---|---|
| 18 | **Upgrade tab "AI Analysis"** | Hiển thị kết quả từ API với: score breakdown dạng progress bars, suggestions kèm "Apply" button |
| 19 | **Thêm "AI Rewrite" button** | Cạnh mỗi bullet point và summary → gọi API → hiện diff view (cũ vs mới) → user chọn accept/reject |
| 20 | **Loading states** | Skeleton + streaming text effect khi AI đang generate |
| 21 | **Rate limiting UI** | Hiển thị số lần dùng AI còn lại (chuẩn bị cho monetization) |

---

## GIAI ĐOẠN 3: JD Matching — So Khớp Mô Tả Công Việc (2–3 tuần)

> **Mục tiêu:** Đây là tính năng đắt giá nhất mà Jobscan, Grammarly, Rezi đều có. Cho phép user paste JD → AI phân tích mức độ khớp.

### 3.1 Flow người dùng

1. User paste URL hoặc text của Job Description
2. System extract keywords và requirements từ JD
3. AI tính **Match Score** (0–100%) dựa trên: keyword overlap, skill match, experience alignment
4. Hiển thị: missing keywords, suggested additions, section-by-section gap analysis

### 3.2 Technical Tasks ✅ Hoàn thành

| # | Task | File | Chi tiết |
|---|---|---|---|
| 22 | ✅ **Thêm JD input area** | `src/App.tsx` | Tab mới "Job Match" với textarea paste JD + nút "Analyze Match" |
| 23 | ✅ **API: `/api/match`** | `api/match.ts` | Input: CV data + JD text → Output: match score %, missing keywords, breakdown, suggestions |
| 24 | ✅ **API extract keywords** | `api/gemini.ts` (demo mode) | Extract + compare keywords (merged into /match) |
| 25 | ✅ **UI: Match Dashboard** | `src/App.tsx` | Score + breakdown bars + missing keywords (click-to-add) + matching keywords + suggestions |
| 26 | ✅ **One-click apply** | `src/App.tsx` | Missing keywords có nút "add" → gọi `addSkill()` trực tiếp |

### 3.3 JD Matching UI Flow

```
┌─────────────────────────────────────┐
│  [Paste Job Description...]  [Scan] │
├─────────────────────────────────────┤
│  Match Score: 72%  ●●●●●●○○○○      │
│                                     │
│  Missing Keywords:                  │
│  ✕ Kubernetes    [+ Add to Skills] │
│  ✕ CI/CD         [+ Add to Skills] │
│  ✕ Team Leadership [+ Add to Exp]  │
│                                     │
│  Suggestions:                       │
│  💡 Your experience at X should    │
│     mention "CI/CD pipelines"      │
│     [Rewrite this bullet]          │
└─────────────────────────────────────┘
```

---

## GIAI ĐOẠN 4: Accounts & Cloud — Tài Khoản & Lưu Trữ Đám Mây (2–3 tuần)

> **Mục tiêu:** Tất cả đối thủ đều có cloud save. User hiện tại mất hết data nếu đổi trình duyệt.

### 4.1 Kiến trúc

- **Auth**: Clerk (React SDK, free tier 10K MAU, hỗ trợ Google/GitHub/Magic link)
- **Database**: Vercel Postgres (Serverless SQL, $0 scale-to-zero) hoặc Vercel KV (Redis)
- **API**: Vercel Functions cho CRUD CV data

### 4.2 Tasks

| # | Task | Chi tiết |
|---|---|---|
| 27 | **Integrate Clerk** | Thêm `@clerk/clerk-react`, `<ClerkProvider>`, `<SignIn>`, `<SignUp>`, nút User avatar trên header |
| 28 | **API: `/api/cv/save`** | Lưu CV data lên Vercel Postgres (table: `cvs`: id, user_id, data JSONB, template, updated_at) |
| 29 | **API: `/api/cv/load`** | Load CV data khi user đăng nhập → merge với localStorage (ưu tiên cloud nếu mới hơn) |
| 30 | **API: `/api/cv/list`** | List tất cả CV của user → hỗ trợ nhiều CV |
| 31 | **Multi-CV support** | Thêm dropdown "My CVs" trên header, cho phép tạo mới/switch/xoá CV |
| 32 | **Sync indicator** | Hiển thị trạng thái sync (cloud icon: synced/syncing/error) thay thế "Auto-saved" dot |
| 33 | **Anonymous → Account migration** | Khi user sign up lần đầu, tự động upload CV từ localStorage lên cloud |

---

## GIAI ĐOẠN 5: Monetization — Kiếm Tiền (1–2 tuần)

> **Mục tiêu:** Biến sản phẩm thành business. Tham khảo Careerkit ($2.95/tháng), Rezi ($149 lifetime).

### 5.1 Pricing Tiers Đề Xuất

| Tier | Giá | Tính năng |
|---|---|---|
| **Free** | $0 | 1 CV, 5 AI analyses/tháng, 2 templates, export PDF có watermark |
| **Pro** | $7.99/tháng | Unlimited CVs, unlimited AI, 4 templates, JD matching, export PDF sạch, JSON export |
| **Business** | $14.99/tháng | Tất cả Pro + 10+ templates, priority AI, team sharing, cover letter builder (tương lai) |
| **Lifetime** | $129 một lần | Tất cả Pro + cập nhật trọn đời (chiến lược của Rezi) |

### 5.2 Technical Tasks

| # | Task | Chi tiết |
|---|---|---|
| 34 | **Tích hợp Stripe** | `@stripe/stripe-js`, Stripe Checkout, Webhook handler trên Vercel |
| 35 | **API: `/api/stripe/checkout`** | Tạo Stripe Checkout Session → redirect user |
| 36 | **API: `/api/stripe/webhook`** | Nhận event `checkout.session.completed` → update user tier trong DB |
| 37 | **Usage tracking** | Đếm số lần gọi AI API/user/tháng → lưu trong Vercel KV |
| 38 | **Feature gating** | Middleware kiểm tra tier trước khi cho gọi AI API → trả lỗi 402 nếu hết quota |
| 39 | **Pricing page** | Thêm page `/pricing` hoặc modal hiển thị 3 tiers |
| 40 | **Upgrade prompts** | Khi free user hết quota → hiện upgrade modal thay vì chặn cứng |

---

## GIAI ĐOẠN 6: Ecosystem — Hệ Sinh Thái (4–6 tuần)

> **Mục tiêu:** Mở rộng ra ngoài CV builder, tiến tới nền tảng job search toàn diện như Teal.

### 6.1 Cover Letter Builder (2 tuần)

| # | Task | Chi tiết |
|---|---|---|
| 41 | **Cover letter data model** | Mở rộng `CVStore` thêm `coverLetters: CoverLetter[]` |
| 42 | **Cover letter template** | 2 templates: Professional (formal) và Modern (casual) |
| 43 | **AI Generate cover letter** | `POST /api/generate-cover-letter` → input: CV data + JD → output: full cover letter |
| 44 | **Cover letter UI** | Tab mới "Cover Letter" trong editor, preview bên phải |

### 6.2 Template Expansion (2 tuần)

| # | Task | Chi tiết |
|---|---|---|
| 45 | **Thêm 6 templates mới** | 2-column Modern, Timeline, Functional (skills-based), Academic, Federal (USA Jobs), Infographic |
| 46 | **Template marketplace infrastructure** | Hệ thống template registry (metadata: name, thumbnail, category, premium flag) |
| 47 | **Template preview thumbnails** | Generate thumbnail từ template thật → hiển thị trong grid chọn template |

### 6.3 More Languages (1 tuần)

| # | Task | Chi tiết |
|---|---|---|
| 48 | **Thêm 6 ngôn ngữ** | Nhật, Hàn, Trung, Tây Ban Nha, Pháp, Đức → translate i18n keys |
| 49 | **AI multi-language support** | Prompt AI trả lời bằng ngôn ngữ của user |

### 6.4 LinkedIn Import (1 tuần)

| # | Task | Chi tiết |
|---|---|---|
| 50 | **LinkedIn PDF import** | Cho phép upload LinkedIn profile PDF → extract text → AI parse thành CV data |
| 51 | **LinkedIn URL scraping** | (Optional) Input LinkedIn URL → scrape public profile → fill CV form |

### 6.5 Nâng cao (nếu có resources)

| # | Task | Chi tiết |
|---|---|---|
| 52 | **Job Tracker** | Kanban board: Saved → Applied → Interview → Offer → Rejected |
| 53 | **Chrome Extension** | Quick-capture job listings, auto-fill application forms |
| 54 | **PWA / Mobile** | Service worker + manifest để cài như app, offline support |
| 55 | **File-level ATS check** | Upload PDF CV → AI scan format (font embedding, table structure, keyword density trong file) |

---

## Thứ Tự Ưu Tiên & Timeline

```
Tuần 1–2    ████████████  Phase 1: Foundation (bugs + UI hoàn thiện)
Tuần 3–5    ██████████████████  Phase 2: AI Core (API + prompt engineering)
Tuần 6–8    ██████████████████  Phase 3: JD Matching ✅
Tuần 9–11   ██████████████████  Phase 4: Accounts & Cloud
Tuần 12–13  ████████████  Phase 5: Monetization (Stripe)
Tuần 14–19  ████████████████████████████████  Phase 6: Ecosystem
```

**MVP có thể launch sau Phase 3** (tuần 8) — lúc này SwiftCv đã có: AI thật, JD Matching, UI hoàn chỉnh. Đủ sức cạnh tranh với nhóm trung bình (Careerkit, NeuraCV).

**Public launch sau Phase 5** (tuần 13) — có đủ auth + payment để ra thị trường.

---

## Tổng Kết: 55 Tasks / 6 Phases

| Phase | Mục tiêu chính | Tasks | Impact |
|---|---|---|---|---|
| 1 | ✅ Sửa nền móng | 1–12 | Loại bỏ "technical debt", UI hoàn chỉnh |
| 2 | ✅ **AI Core** | 13–21 | AI Analysis + Rewrite + Suggest Skills + demo mode |
| 3 | ✅ **JD Matching** | 22–26 | Match score + keyword gaps + one-click apply |
| 4 | Accounts & Cloud | 27–33 | User retention, cross-device |
| 5 | Monetization | 34–40 | Biến thành business |
| 6 | Ecosystem | 41–55 | Mở rộng ra cover letter, templates, languages |
