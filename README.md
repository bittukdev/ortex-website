# Ortex Industries - Custom Apparel Manufacturer Website

A premium, interactive clone of the Ortex Industries merchandise website, built with HTML, Vanilla CSS, and JavaScript.

---

## 🌟 Enhanced Features

1. **Modern Responsive Design**: Fully responsive layout with glassmorphic elements, vibrant royal-blue and orange accent coloring, and custom typography (`DM Sans`).
2. **Interactive Theme Switcher**: Toggle between a clean, bright Light Mode and a modern, high-contrast Dark Mode (stored in browser state).
3. **Product Catalog Tabs**: Dynamic switching between customized apparel sections (T-Shirts, Caps, and Campaign/Flags) with smooth transition animations.
4. **Interactive Lead Capture Form**: 
   - Pre-fills category inputs when users click "Inquire" on specific items.
   - Includes validation for email patterns and phone numbers.
5. **Auto Quote Receipt Generator**: On successful form submission, the site generates a unique B2B quote reference (e.g. `QT-2026-X`) and shows a receipt popup with target specs.
6. **WhatsApp Support Integration**: Directly formats and forwards the quote receipt details to WhatsApp support.
7. **Simulated CRM leads Dashboard**:
   - Access the dashboard via the **Dashboard** link in the nav bar or the **Admin Leads Dashboard** link in the footer.
   - Displays a structured database table of all generated queries stored in `localStorage`.
   - Offers options to **export submissions as JSON** or clear the entries.

---

## 📂 Project Structure

- [index.html](file:///D:/CODE/t-shirts/index.html) - Structural HTML template with product lists and contact modals.
- [style.css](file:///D:/CODE/t-shirts/style.css) - Premium responsive design stylesheets and utility classes.
- [app.js](file:///D:/CODE/t-shirts/app.js) - Client-side state, scroll indicator hooks, receipt generator, and CMS dashboards.
- `images/` - Auto-generated high-fidelity product and layout photos.

---

## 🚀 Running Locally

This project is configured with a lightweight development environment using **Vite**.

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open the printed localhost URL in your browser.

3. **Production Build**:
   ```bash
   npm run build
   ```
   Generates a static optimized bundle in the `dist` directory.
