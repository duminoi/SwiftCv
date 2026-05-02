---
name: SwiftCv Material Design 3 System
colors:
  surface: '#F8F9FF'
  surface-dim: '#d8dae0'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3fa'
  surface-container: '#eceef4'
  surface-container-high: '#e6e8ee'
  surface-container-highest: '#e1e2e8'
  on-surface: '#191c20'
  on-surface-variant: '#414750'
  inverse-surface: '#2e3135'
  inverse-on-surface: '#eff0f7'
  outline: '#74777F'
  outline-variant: '#c1c7d2'
  surface-tint: '#0061a4'
  primary: '#00497d'
  on-primary: '#FFFFFF'
  primary-container: '#D1E4FF'
  on-primary-container: '#c0dbff'
  inverse-primary: '#9fcaff'
  secondary: '#535f70'
  on-secondary: '#ffffff'
  secondary-container: '#d7e3f8'
  on-secondary-container: '#596576'
  tertiary: '#52405f'
  on-tertiary: '#ffffff'
  tertiary-container: '#6b5778'
  on-tertiary-container: '#e9d0f7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d1e4ff'
  primary-fixed-dim: '#9fcaff'
  on-primary-fixed: '#001d36'
  on-primary-fixed-variant: '#00497d'
  secondary-fixed: '#d7e3f8'
  secondary-fixed-dim: '#bbc7db'
  on-secondary-fixed: '#101c2b'
  on-secondary-fixed-variant: '#3c4858'
  tertiary-fixed: '#f3daff'
  tertiary-fixed-dim: '#d6bee4'
  on-tertiary-fixed: '#251431'
  on-tertiary-fixed-variant: '#523f5f'
  background: '#f8f9ff'
  on-background: '#191c20'
  surface-variant: '#DFE2EB'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 57px
    fontWeight: '400'
    lineHeight: 64px
    letterSpacing: -0.25px
  headline-md:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: 0.15px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-small:
    fontFamily: Space Grotesk
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.5px
  cv-serif:
    fontFamily: Noto Serif
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.6'
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  container-padding: 2rem
  gutter: 1.5rem
  component-gap: 1rem
  sidebar-width: 280px
  editor-max-width: 800px
---

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
