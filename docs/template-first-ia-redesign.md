# Plan: Template-First Onboarding + IA Restructure

## Goal
Chuyển SwiftCV sang flow **Template-First** (chọn template trước khi nhập liệu), phân loại template theo category, và restructure IA sidebar.

---

## Tasks

- [x] **Task 1: Define template metadata (category, tags, premium flag)**
  - `src/data/templateMeta.ts` — TemplateMeta interface, TEMPLATE_META mapping, CATEGORY_ORDER

- [x] **Task 2: Build TemplateOnboarding component (full-screen picker)**
  - `src/components/TemplateOnboarding.tsx` — filter bar, grid thumbnails, sticky Start Building button

- [x] **Task 3: Integrate onboarding into App.tsx flow**
  - Check `cvs.length === 0` → render onboarding → `createCV` + `setTemplate` → editor

- [x] **Task 4: Restructure Sidebar IA — 3 groups with Design FIRST**
  - Design: Design/Settings/Upgrade (TOP — template-first)
  - Content: Info/Work/Edu/Skills (middle)
  - Tools: AI/Match/Jobs/Cover (bottom)
  - Renamed "Templates" → "Design"
  - Mobile: Design first in bottom nav

- [x] **Task 5: Upgrade Template Gallery UI**
  - Filter bar (All | ATS | Modern | Creative | Minimal | Professional)
  - Larger thumbnails (~144-176px), hover lift effect, ring + scale on selected
  - Pro lock overlay with backdrop blur

- [x] **Task 6: Quick Template Switcher in preview header**
  - Dropdown next to zoom controls, lists all templates with mini color preview

- [x] **Task 7: Add i18n keys (en + vi)**
  - onboarding.title/subtitle/startBuilding
  - categories.* labels
  - sidebar.content/tools/design
  - sections.design

- [x] **Task 8: Responsive & accessibility**
  - Mobile bottom nav restructured with 3 groups
  - Onboarding responsive: 1-col mobile, sticky button

- [x] **Task 9: Verify end-to-end flow**
  - Scenario A: New user → onboarding → select template → editor ✅
  - Scenario B: Existing user → editor directly ✅
  - Scenario C: Create new CV → Design tab opens ✅
