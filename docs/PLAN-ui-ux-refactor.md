# PLAN: UI/UX Refactor — SwiftCv 2.0

## Goal

Nâng cấp SwiftCv từ SPA monolithic lên chuẩn chuyên nghiệp ngang Resume.io/Novoresume/Canva qua 6 tuần, tập trung vào UI Minimal Clean, auth Clerk, router React Router, ảnh thật template preview, CL builder matching, và 1-click tailor CV-to-JD bằng AI.

---

## Dependency Graph

```
Week 1 (UI tokens + layout)
  └─> Week 2 (Auth + Onboarding) ──> Week 3 (Router + pages)
        └─> Week 4 (Template preview ảnh thật)
        └─> Week 5 (Cover letter matching)   (song song với Week 4)
        └─> Week 6 (1-click tailor CV → JD)  (song song với Week 5)
```

- **Week 1** là foundation — tất cả các week sau phụ thuộc vào design system mới
- **Week 2 → 3** là structural — tạo route và auth trước khi thêm feature
- **Week 4, 5, 6** có thể chạy song song sau khi Week 3 hoàn tất

---

## Week 1: UI Redesign — Tokens + Layout + Minimal Clean

**Mục tiêu:** Thay toàn bộ design tokens, layout grid, typography, màu sắc sang phong cách Minimal Clean.

### Tasks

- [ ] **T1.1** Redesign `tailwind.config.js` tokens
  - Files: `tailwind.config.js`
  - Màu: `#2563EB` (primary), `#0F172A` (on-surface), `#F8FAFC` (background), neutral grays
  - Spacing: `gutter: 1rem`, component-gap: `1rem`, sidebar-width: `240px`
  - Typography: Inter (body headings), Geist Mono (mono), font scale `text-sm`→`text-2xl`
  - Radius: `DEFAULT: 0.75rem`, `lg: 1rem`, `full: 9999px`
  - Shadow: `sm: 0 1px 2px`, `md: 0 4px 12px`, `lg: 0 8px 24px`
  - Verify: `npm run dev`, inspect elements thấy màu/font mới

- [ ] **T1.2** Redesign `src/index.css` — sạch, tối giản
  - Files: `src/index.css`
  - Bỏ custom scrollbar styling cũ, thay bằng native + `scrollbar-thin`
  - Thêm dark mode CSS variables (`:root` + `.dark`)
  - Thêm responsive utilities mới: container max-width, section spacing
  - Verify: Mở browser, chụp ảnh home page thấy layout sạch hơn

- [ ] **T1.3** Redesign top bar + sidebar navigation
  - Files: `src/App.tsx` (header section ~lines 0-200)
  - Header: 56px cao, background `white/80` + `backdrop-blur`, logo text, CV selector dropdown
  - Sidebar: 56px wide icons, nhóm Design/Content/Tools rõ ràng, active state pill màu primary
  - Verify: Click từng tab, thấy active state, hover state, animation mượt

- [ ] **T1.4** Redesign left panel (editor form area)
  - Files: `src/App.tsx` (form sections for personal, experience, education, skills)
  - Input style: border-bottom minimal, label float lên trên khi focus
  - Card: `rounded-lg`, `bg-white`, `shadow-sm`, `p-6`
  - Button: `rounded-full`, `bg-primary text-white`, `h-10`, `px-6`
  - Verify: Điền form Personal Info, thấy input đẹp, nhãn rõ ràng

- [ ] **T1.5** Redesign right panel (CV preview area)
  - Files: `src/App.tsx` (preview panel section)
  - Paper: `bg-white`, `shadow-lg`, `rounded-lg`, scale controls
  - Toolbar: template switcher dropdown, zoom slider, download button — gọn trên 1 hàng
  - Verify: Preview CV, zoom in/out, switch template thấy mượt

- [ ] **T1.6** Redesign AI feature cards (Analysis, Match, Cover Letter, Job Tracker)
  - Files: `src/App.tsx` (AI sections)
  - Score gauge giữ nguyên logic, redesign style cho sạch hơn
  - Cards thống nhất: `rounded-xl`, `bg-white`, `p-5`, `shadow-sm`, icon + title + description
  - Verify: Vào tab Analysis, giao diện card gọn, dễ đọc

- [ ] **T1.7** Redesign pricing tab
  - Files: `src/App.tsx` (pricing section)
  - 4 tier cards so sánh ngang, highlight tier phổ biến (Pro), free badge trên Free tier
  - Verify: Pricing tab hiển thị đẹp trên desktop + mobile

---

## Week 2: Auth (Clerk) + Onboarding Wizard Flow

**Mục tiêu:** Thêm đăng nhập/đăng ký qua Clerk, onboarding wizard 3 bước cho user mới.

### Tasks

- [ ] **T2.1** Install + configure Clerk
  - Install: `@clerk/clerk-react`
  - Files: `src/main.tsx` (wrap app `<ClerkProvider>`), `.env` (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
  - Verify: App khởi động không lỗi, Clerk provider active

- [ ] **T2.2** Create SignIn + SignUp pages
  - Files: `src/pages/SignIn.tsx`, `src/pages/SignUp.tsx` (hoặc inline trong App.tsx tạm)
  - Dùng Clerk `<SignIn>` / `<SignUp>` component hoặc custom UI
  - Verify: Click "Sign in", hiện modal/page đăng nhập Clerk, login thành công

- [ ] **T2.3** Add auth guard to App.tsx
  - Files: `src/App.tsx`
  - Nếu `!isSignedIn`, render SignIn page thay vì main editor
  - Hiển thị user avatar + name trên header khi đã login
  - Verify: Chưa login → thấy SignIn. Login rồi → vào app bình thường

- [ ] **T2.4** Create Onboarding Gateway modal
  - Files: `src/components/OnboardingGateway.tsx`
  - User mới (chưa có CV) thấy modal: "What do you want to do?"
  - Options: [Create New CV] [Upload Existing CV] [Import from LinkedIn]
  - Verify: User mới login → thấy modal chọn action

- [ ] **T2.5** Redesign template picker onboarding
  - Files: `src/components/TemplateOnboarding.tsx`
  - Thay colored blocks → ảnh thật (dùng static SVG/PNG preview), lấy từ tuần 4
  - Category filter pills: All / ATS-Friendly / Modern / Creative / Minimal / Professional
  - Grid responsive: 2 cols mobile, 3 cols tablet, 4 cols desktop
  - Verify: Chọn template, thấy preview đẹp, click "Start Building" → vào editor

- [ ] **T2.6** Create Upload Existing CV flow
  - Files: `src/components/CVUpload.tsx`
  - Upload PDF/DOCX, gọi AI parse API (`/api/analyze.ts` mở rộng) để extract CV data
  - Verify: Upload file PDF, data tự động fill vào form

- [ ] **T2.7** Link user data to Clerk userId
  - Files: `src/store/useCVStore.ts`, `src/services/api.ts`
  - Thay `ANON_USER` = `'anonymous'` → dùng `user.id` từ Clerk
  - CV save/load API dùng userId thay vì anonymous
  - Verify: Tạo CV khi login, logout, login lại → CV vẫn còn

---

## Week 3: Split App.tsx → Router + Pages + Components

**Mục tiêu:** Tách file 2000 dòng thành cấu trúc route-based với lazy loading.

### Tasks

- [ ] **T3.1** Install React Router v7
  - Install: `react-router-dom`
  - Files: `src/main.tsx` (add `<BrowserRouter>`)
  - Verify: App khởi động không lỗi

- [ ] **T3.2** Define route structure
  - Files: `src/router.tsx`
  ```text
  / → AppLayout (protected)
    / → CVEditor (editor + preview)
    /analysis → AIAnalysis
    /match → JDMatch
    /jobs → JobTracker
    /cover-letter → CoverLetter
    /pricing → Pricing
    /settings → Settings
  /sign-in → SignIn
  /sign-up → SignUp
  /onboarding → Onboarding (new user)
  ```
  - Verify: Gõ URL `/analysis`, `/match`, v.v. → render đúng page

- [ ] **T3.3** Extract AppLayout component
  - Files: `src/layouts/AppLayout.tsx`
  - Chứa: Header + Sidebar + `<Outlet />`
  - Copy từ `App.tsx` phần header + sidebar
  - Verify: Layout render đúng, sidebar navigation hoạt động

- [ ] **T3.4** Extract CVEditor page
  - Files: `src/pages/CVEditor.tsx`
  - Chứa: Left panel (tabs: personal, experience, education, skills, design) + Right panel (CV preview)
  - Copy từ `App.tsx` phần main editor
  - Verify: Editor hoạt động, fill form, preview cập nhật real-time

- [ ] **T3.5** Extract tool pages (Analysis, Match, JobTracker, CoverLetter, Pricing, Settings)
  - Files: `src/pages/AIAnalysis.tsx`, `src/pages/JDMatch.tsx`, `src/pages/JobTracker.tsx`, `src/pages/CoverLetter.tsx`, `src/pages/Pricing.tsx`, `src/pages/Settings.tsx`
  - Mỗi page copy logic từ `App.tsx` phần tương ứng
  - Verify: Click từng tab sidebar, page load đúng

- [ ] **T3.6** Extract shared components
  - Files: `src/components/InputField.tsx`, `src/components/ScoreGauge.tsx`, `src/components/CVCanvas.tsx`, `src/components/CanvasToolbar.tsx`
  - Các component inline trong `App.tsx` tách ra file riêng
  - Verify: Compile không lỗi, UI không thay đổi

- [ ] **T3.7** Lazy load pages
  - Files: `src/router.tsx`
  - Dùng `React.lazy()` + `<Suspense>` cho tất cả pages
  - Verify: Bundle size giảm (kiểm tra `npm run build`)

- [ ] **T3.8** Cleanup App.tsx
  - Files: `src/App.tsx`
  - Code cũ < 50 dòng, chỉ là `<ClerkProvider>` + `<BrowserRouter>` wrapper
  - Verify: `findstr /N "function" src\App.tsx` thấy ít hơn 5 functions

---

## Week 4: Template Preview Ảnh Thật

**Mục tiêu:** Thay thế colored blocks trong template picker bằng ảnh thật mẫu CV.

### Tasks

- [ ] **T4.1** Generate template screenshots (offline)
  - Dùng Puppeteer/Playwright chụp ảnh từng template với data mẫu
  - Files: `public/previews/template-{name}.webp` (16 ảnh, ~30KB mỗi ảnh)
  - Size: 400x565px, WebP format, quality 85%
  - Verify: Mở file ảnh thấy đẹp, sắc nét

- [ ] **T4.2** Update TemplateOnboarding component
  - Files: `src/components/TemplateOnboarding.tsx`
  - `<img>` thay vì `<div>` colored blocks
  - Hover effect: scale 1.02 + shadow-lg + border primary
  - Verify: Template picker hiển thị ảnh thật thay vì blocks

- [ ] **T4.3** Add quick template switcher tooltip
  - Files: `src/components/CVCanvas.tsx`
  - Khi hover template thumbnail trong toolbar, hiển thị preview nhỏ (200x280px)
  - Verify: Hover template trong toolbar → thấy preview popup

- [ ] **T4.4** Update templateMeta.ts với thumbnail paths
  - Files: `src/data/templateMeta.ts`
  - Thêm field `thumbnail: '/previews/template-standard.webp'` cho từng template
  - Verify: Template list có thumbnail path

---

## Week 5: Cover Letter Builder Matching Template

**Mục tiêu:** Cover letter tự động match style/template với CV đang chọn.

### Tasks

- [ ] **T5.1** Create cover letter templates (3 styles)
  - Files: `src/components/cover-letter-templates/ProfessionalCL.tsx`, `ModernCL.tsx`, `MinimalCL.tsx`
  - Mỗi template là React component render A4 letter với data: `{ personalInfo, company, position, content }`
  - Style match với CV template hiện tại (primaryColor, fontFamily)
  - Verify: Render CL component, thấy letter đẹp, khớp màu CV

- [ ] **T5.2** Create cover letter editor page
  - Files: `src/pages/CoverLetter.tsx`
  - Layout: Left — form (company name, hiring manager, letter content với TipTap editor), Right — preview
  - "Generate with AI" button gọi `/api/rewrite.ts` để sinh nội dung
  - Download PDF button
  - Verify: Điền form, bấm generate, preview cập nhật

- [ ] **T5.3** Auto-fill from CV + JD
  - Files: `src/pages/CoverLetter.tsx`, `src/services/api.ts`
  - Khi user paste JD link/text, AI sinh CL matching cả CV data + JD keywords
  - Verify: Paste JD, bấm generate → CL chứa keywords từ JD

- [ ] **T5.4** Add cover letter tab to sidebar (Tools group)
  - Files: `src/layouts/AppLayout.tsx`
  - Thêm icon "description" vào sidebar Tools group
  - Route: `/cover-letter`
  - Verify: Click tab Cover Letter → vào page

---

## Week 6: 1-Click Tailor CV → Job Description

**Mục tiêu:** Paste JD link/text, AI tự động tối ưu CV content theo JD.

### Tasks

- [ ] **T6.1** Create `/api/tailor.ts` endpoint
  - Files: `api/tailor.ts`, `server/dev.ts`
  - Input: `{ cvData, jobDescription }`
  - AI prompt: "Rewrite this CV to match the job description. Update summary, bullet points, and skills to highlight relevant experience. Keep truthful content only."
  - Output: `{ tailoredCV: CVData, changes: [] }` (danh sách thay đổi để user review)
  - Verify: Gọi API với CV data + JD mẫu → trả về tailored CV

- [ ] **T6.2** Create TailorReview modal
  - Files: `src/components/TailorReview.tsx`
  - Hiển thị diff giữa CV gốc và tailored: highlight text thay đổi (màu xanh), text xóa (màu đỏ gạch ngang)
  - Button: [Accept All] [Accept per-section] [Reject]
  - Verify: Chạy tailor, thấy diff modal, accept/reject hoạt động

- [ ] **T6.3** Integrate into CVEditor page
  - Files: `src/pages/CVEditor.tsx`
  - Thêm "Tailor to JD" button trên toolbar preview panel
  - Flow: Click → paste JD → AI tailor → review diff → apply
  - Verify: Tailor flow hoạt động end-to-end

- [ ] **T6.4** Add "Tailor to Job" to JobTracker
  - Files: `src/pages/JobTracker.tsx`
  - Mỗi job card: thêm button "Tailor CV" → tự động tailor CV cho job đó
  - Verify: Click "Tailor CV" trên job card → tailor modal mở, JD tự fill

---

## Done When

- [ ] App sử dụng auth Clerk, user phải login mới vào được editor
- [ ] New user thấy onboarding wizard (Create new / Upload / Import)
- [ ] App.tsx < 50 dòng, tất cả nội dung trong pages/ + components/
- [ ] Routes hoạt động: `/analysis`, `/match`, `/jobs`, `/cover-letter`, `/pricing`, `/settings`
- [ ] Template picker hiển thị ảnh thật (16 ảnh WebP)
- [ ] Cover letter builder hoạt động: generate + preview + download PDF
- [ ] 1-click tailor CV → JD hoạt động: paste JD → review diff → apply
- [ ] Design system Minimal Clean áp dụng toàn bộ app
- [ ] Mobile responsive: sidebar → bottom nav, layout đẹp trên điện thoại
- [ ] `npm run build` không lỗi
- [ ] `npm run dev` chạy bình thường

---

## Risk Notes

- **R1:** Clerk integration có thể xung đột với Vercel serverless. Giải pháp: dùng `@clerk/nextjs` nếu deploy Next.js, hoặc giữ Clerk client-side only
- **R2:** Template screenshots cần design data mẫu chuẩn. Dùng Puppeteer script tự động
- **R3:** AI tailor có thể thay đổi nội dung không trung thực. Cần prompt chặt + review step
- **R4:** App.tsx tách ra có thể gây lỗi state sharing. Dùng Zustand store global để tránh
- **R5:** Dark mode cần test cẩn thận với tất cả template components
