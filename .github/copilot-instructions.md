# 🎨 UI Design Instructions (Material UI Inspired)

## Overview
When generating UI components, always follow a design style inspired by Material UI (MUI). The goal is to produce clean, modern, accessible, and consistent interfaces based on Material Design principles.

---

## 🧱 Core Design Principles

- Use a **clean, minimal layout** with clear hierarchy
- Prioritize **usability and accessibility**
- Maintain **consistent spacing, typography, and color usage**
- Prefer **component-based structure** over custom one-off styles
- Ensure **responsive design** across screen sizes

---

## 🎯 Components Styling Guidelines

### 1. Surfaces & Elevation
- Use subtle shadows to indicate elevation (cards, modals, dropdowns)
- Avoid excessive shadow depth
- Use flat design where elevation is unnecessary

### 2. Buttons
- Use:
  - `contained` (primary actions)
  - `outlined` (secondary actions)
  - `text` (low emphasis)
- Buttons should have:
  - Rounded corners (4px–8px radius)
  - Padding: `8px 16px`
  - Clear hover and active states

### 3. Forms & Inputs
- Use labeled inputs (label always visible or floating)
- Include validation states (error, success, disabled)
- Maintain consistent spacing between fields
- Inputs should have:
  - Border radius: ~4px
  - Focus states with highlight color

### 4. Cards
- Use cards to group related content
- Include padding (16px–24px)
- Slight elevation (shadow-sm or md)
- Optional header and actions section

### 5. Navigation
- Use top app bars or side navigation
- Highlight active routes
- Keep navigation simple and predictable

---

## 🎨 Color System

- Use a **primary color** for main actions and highlights
- Use a **secondary/accent color** sparingly
- Backgrounds should be light (or dark if dark mode is enabled)
- Ensure **contrast ratios are accessible**

Example:
- Primary: Blue / Indigo
- Secondary: Purple / Teal
- Error: Red
- Warning: Orange
- Success: Green

---

## 🔤 Typography

- Use a clear typographic hierarchy:
  - H1–H6 for headings
  - Body text for content
- Prefer sans-serif fonts (e.g., Roboto, Inter)
- Use consistent font weights:
  - 400 (regular)
  - 500 (medium)
  - 600/700 (bold for headings)

---

## 📏 Spacing & Layout

- Use an **8px spacing system** (8, 16, 24, 32, etc.)
- Keep consistent margins and padding
- Avoid cramped layouts
- Use grid/flex layouts for alignment

---

## 🧩 Behavior & Interaction

- Add hover, focus, and active states to interactive elements
- Use smooth transitions (150ms–300ms ease-in-out)
- Provide feedback for user actions (loading, success, error)

---

## 🌙 Dark Mode (Optional but Preferred)

- Support dark mode where possible
- Use darker backgrounds with lighter text
- Maintain contrast and readability

---

## ♿ Accessibility

- Ensure:
  - Proper label usage
  - Keyboard navigability
  - ARIA attributes where needed
  - Sufficient color contrast

---

## 🛠️ Implementation Notes

- Prefer reusable components
- Avoid inline styles unless necessary
- Use utility classes (e.g., Tailwind) or component props consistently
- Keep logic separate from presentation

---

## ✅ Summary

Copilot should generate UI that:
- Looks like Material UI (MUI)
- Is clean, modern, and consistent
- Uses proper spacing, typography, and colors
- Follows component-based architecture
- Is responsive and accessible
