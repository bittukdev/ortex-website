# Ortex Industries Clone - Developer Documentation

This document describes the codebase architecture, design system, interactive scripts, and data flow of the Ortex Industries merchandise website clone.

---

## 📂 Codebase Overview

The project is structured as a single-page B2B catalog application using modern client-side technologies:

1. **[index.html](file:///D:/CODE/t-shirts/index.html)**: The structural markup of the landing page, product categories, customization grids, OEM service cards, and interactive quote/admin dashboard modal overlays.
2. **[style.css](file:///D:/CODE/t-shirts/style.css)**: A responsive, CSS custom property-driven design system supporting Light and Dark modes.
3. **[app.js](file:///D:/CODE/t-shirts/app.js)**: Component lifecycles, form validation, Simulated quote calculator, and Local Storage CRM tables.
4. **[package.json](file:///D:/CODE/t-shirts/package.json)**: Vite bundler project scripts and dev dependency targets.

---

## 🎨 Styling & Design Tokens (`style.css`)

The style configuration uses **CSS Variables** defined on `:root` and overridden under `body.dark-mode`.

### Theme Custom Properties

| Token Name | Light Mode Value (Default) | Dark Mode Value | Purpose |
| :--- | :--- | :--- | :--- |
| `--primary` | `hsl(217, 91%, 35%)` (Royal Blue) | `hsl(217, 91%, 60%)` | Branding primary elements and CTAs |
| `--accent` | `hsl(24, 95%, 53%)` (Vivid Orange) | `hsl(24, 95%, 53%)` | Accent borders, badges, active tabs |
| `--whatsapp` | `hsl(142, 70%, 45%)` (Green) | `hsl(142, 70%, 45%)` | Floating button, chat supports |
| `--bg` | `#f8fafc` | `#0b0f19` | Main layout background |
| `--bg-card` | `#ffffff` | `#151d30` | Interactive card and modal background |
| `--border` | `#e2e8f0` | `#1e293b` | Borders, grid dividers |
| `--text` | `#0f172a` | `#f8fafc` | Main body typography color |
| `--text-muted` | `#64748b` | `#94a3b8` | Subtitles, label text |

### Component Classes

- **Layout grids**: `.values-grid` (4-column metrics grid), `.product-grid` (split media-content grid), `.contact-grid` (form-info split).
- **Glassmorphic Badge**: `.card-glass-badge` overlays raw layouts using `backdrop-filter: blur(8px)`.
- **Floating Action Button**: `.whatsapp-btn-float` incorporates a keyframe animation `bounce-pulse` that pulses the box-shadow boundary.

---

## ⚙️ Interactive Core (`app.js`)

The application logic operates inside a `DOMContentLoaded` event listener, orchestrating client-side events.

### Key Logic Hooks & Code Symbols

#### 📱 Mobile Navigation Drawer
- **Trigger**: `.mobile-menu-toggle` (hamburger bar animation).
- **Drawer**: `.mobile-drawer`.
- **Target Function**: `toggleMobileMenu()` — toggles `.open` state, animates menu bars into a cross, and toggles body overflow scroll.

#### 🌓 Theme Switcher
- **Action**: Event listener on `#theme-toggle` switching classes `.light-mode` and `.dark-mode`.
- **Persistence**: Writes `light` or `dark` to `localStorage.setItem('theme', value)`.

#### 👁️ ScrollSpy Section Highlighter
- **Action**: Scroll event listener running `changeActiveLink()`.
- **Logic**: Compares `window.scrollY` offset to section `offsetTop` to dynamically toggle the `.active` class on corresponding nav anchors.

#### 📋 Client-Side leads capture Form
- **Form ID**: `#contact-form`
- **Validation**: Enforces email patterns and matches mobile phone numbers to a 10-digit format (`/^\d{10}$/`).
- **Data Flow**:
  1. Compiles form data into a Lead object.
  2. Generates a unique reference ID using `generateQuoteId()`: `QT-{YYYYMMDD}-{random_digits}`.
  3. Prepend-inserts lead data into a list, saving to `localStorage` under `"contactSubmissions"`.
  4. Populates quotation text elements in `#quote-modal` and opens the modal.
  5. Formats WhatsApp request queries using `encodeURIComponent(payload)` for the `#modal-whatsapp-send` CTA link.

#### 📊 CRM leads Dashboard Overlay
- **Modal ID**: `#admin-modal`
- **Triggers**: `.admin-trigger` in navbar and `#admin-trigger-hidden` in footer.
- **Functions**:
  - `renderLeadsTable()`: Pulls submissions list from local storage, dynamically templates table row markup `<tr>`, and injects it into `#leads-table-body`.
  - **Export Action**: Creates a browser-compatible `Blob` out of JSON leads strings and generates a transient link to auto-download `ortex_leads_export_{date}.json`.
  - **Clear Action**: Deletes stored entries and calls `renderLeadsTable()` to update views.

---

## 📈 Integration & Data Schemas

### Submissions Database JSON Schema
Leads are saved in local storage under `contactSubmissions` using the following schema format:

```json
[
  {
    "id": "QT-20260706-538",
    "timestamp": "7/6/2026, 11:17:42 PM",
    "name": "Jane Doe",
    "email": "jane@company.com",
    "phone": "9211947188",
    "company": "Acme Merchandise Ltd",
    "product": "Customized T-Shirts",
    "quantity": "500",
    "message": "We need custom embroidery of our brand emblem on the left chest."
  }
]
```
