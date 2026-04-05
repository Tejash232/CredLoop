# 🎓 CredlooP — Student Micro-Economy Platform

A modern, startup-style MVP where students can exchange skills, rent items, and offer services using a **campus credit system** — built with React + Tailwind CSS.

---

## 🎨 Design Theme
Dark theme inspired by **igor.energy** — black background (`#0A0A0A`), **yellow (#F5C800)** as the primary accent, clean cards with subtle borders. Typography uses **Bebas Neue** (display) + **DM Sans** (body).

---

## ⚙️ Tech Stack
- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS v3
- **Routing**: React Router v6
- **Icons**: Lucide React
- **State**: React Context API (in-memory, no backend needed)
- **Fonts**: Google Fonts (Bebas Neue, DM Sans, JetBrains Mono)

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start dev server
```bash
npm run dev
```

### 3. Open in browser
```
http://localhost:5173
```

---

## 🔐 Demo Accounts

| Name | Email | Password | Credits |
|------|-------|----------|---------|
| Aryan Sharma | aryan@iitd.edu | demo123 | 340 |
| Priya Mehta | priya@bits.edu | demo123 | 520 |
| Rahul Nair | rahul@nit.edu | demo123 | 280 |
| Sneha Iyer | sneha@vit.edu | demo123 | 410 |
| Karan Patel | karan@dtu.edu | demo123 | 190 |

Or **sign up** with any `yourname@college.edu` email (6+ char password) — you'll start with 100 credits.

---

## 📦 Features

| Feature | Status |
|---------|--------|
| 🔐 Auth (login/signup with .edu email) | ✅ |
| 👤 User profiles with credits + skills | ✅ |
| 🏪 Marketplace with cards UI | ✅ |
| 🔍 Search + filter + sort | ✅ |
| ➕ Create listings (skills/rentals/services/creative) | ✅ |
| 💳 Credit system (earn/spend on accept) | ✅ |
| 📬 Request / booking system | ✅ |
| ✅ Accept / Reject requests | ✅ |
| ⭐ Ratings & reviews | ✅ |
| 🏆 Leaderboard by credits | ✅ |
| 💡 Recommended listings | ✅ |
| 📱 Mobile responsive | ✅ |

---

## 📁 Folder Structure

```
credloop/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── context/
    │   └── AppContext.jsx       # Global state + business logic
    ├── data/
    │   └── mockData.js          # Sample users, listings, requests
    ├── components/
    │   ├── Navbar.jsx
    │   ├── Notification.jsx
    │   └── ListingCard.jsx
    └── pages/
        ├── LoginPage.jsx
        ├── DashboardPage.jsx
        ├── MarketplacePage.jsx
        ├── ListingDetailPage.jsx
        ├── ProfilePage.jsx
        ├── CreateListingPage.jsx
        ├── RequestsPage.jsx
        └── LeaderboardPage.jsx
```

---

## 🔮 Next Steps (Production)
- Replace in-memory state with **Node.js + Express + MongoDB**
- Add **image upload** via Cloudinary or S3
- Add **real college email verification** via SMTP OTP
- Add **WebSockets** for real-time request notifications
- Add **chat system** between buyer and seller
- Deploy on **Vercel** (frontend) + **Railway** (backend)
