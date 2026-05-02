# SwiftCv Design Specification

## Brand Vibe & Identity
**SwiftCv** is a premium, AI-powered tool for career advancement. The identity is professional, trustworthy, and forward-thinking.
*   **Keywords:** Airy, Precise, Empowering, Intelligent.
*   **Visual Language:** Material Design 3 (Material You), utilizing dynamic color tokens, soft shadows, and generous whitespace.

## Full Color Palette (Material Design 3 Based)
*   **Primary:** `#0061A4` (Deep Blue - Trust & Authority)
*   **On Primary:** `#FFFFFF`
*   **Primary Container:** `#D1E4FF`
*   **Secondary:** `#535F70` (Slate - Professionalism)
*   **Tertiary:** `#6B5778` (Plum - Creative intelligence)
*   **Surface:** `#F8F9FF` (Lightest Blue/Grey - Background)
*   **Surface Variant:** `#DFE2EB` (Dividers & Subtle accents)
*   **Outline:** `#74777F` (Input borders)

## Typography Scale
*   **UI Text:** 'Inter' (San-serif)
    *   *Display Large:* 57px, Regular
    *   *Headline Medium:* 28px, Medium
    *   *Title Medium:* 16px, Medium (Buttons/Tabs)
    *   *Body Medium:* 14px, Regular (Form labels/Text)
*   **Technical/Data:** 'Geist Mono'
    *   *Label Small:* 11px, Medium
*   **CV Content (Elegant):** 'Lora' (Serif) or 'Inter' (San-serif) depending on template.

## Component Specifications
*   **Buttons:** M3 Stadium shape (Full rounded). Primary for main actions (Download), Outlined for secondary (Import/Export).
*   **Cards:** Extra-large rounded corners (28px). Subtle elevation (Level 1) or Outlined for form sections.
*   **Inputs:** Outlined Material-style with floating labels. 8px corner radius.
*   **Navigation:** Vertical sidebar tabs with active indicator pill.
*   **Preview Canvas:** Floating "Paper" effect with elevation Level 2 and soft shadows.

## User Flow: The Split-Screen Editor
1.  **Sidebar:** Quick navigation between sections (Personal, Experience, Education, Skills, AI Analysis).
2.  **Editor Panel:** Clean, grouped form inputs.
3.  **Preview Panel:** Real-time updates with template switching.
