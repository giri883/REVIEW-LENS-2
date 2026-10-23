# 🌟 Review Lens – Role-Based Business Reputation & Analytics

> **A smart, modern role-based review platform connecting business owners and customers.** Built with React, TypeScript, and Tailwind CSS.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔑 Demo Login Accounts

Try out both roles immediately using the 1-click demo buttons on the login screen, or enter credentials manually:

| Role | Email | Password | Details |
|---|---|---|---|
| **Business Owner** | `alex.owner@reviewlens.ai` | `owner123` | Apex Bistro & Cafe dashboard |
| **Business Owner** | `sarah.owner@reviewlens.ai` | `owner123` | TechPulse Electronics dashboard |
| **Customer** | `elena.customer@gmail.com` | `customer123` | Explore businesses & post reviews |

---

## 🎯 Key Features

- **Role-Based Authentication**: Seamless toggling between Business Owner and Customer modes.
- **Owner Dashboard**:
  - Real-time rating average and review count calculation.
  - Sentiment analysis distribution (Positive vs Negative).
  - Customer review moderation & filter system (Positive, Negative, Unreplied).
  - Official business owner replies with live synchronization.
  - One-click AI Executive Insights generator.
- **Customer Dashboard**:
  - Business directory exploration with category tags, descriptions, and ratings.
  - Interactive Review Composer with 5-star rating picker and automatic sentiment detection.
  - "My Reviews" history tracker showing owner replies.
- **Zero-Backend Requirement**: Self-contained with persistent browser `localStorage`.
- **All-in-One Architecture**: Complete application logic, styles, and state consolidated into a single clean file.

---

## 📤 How to Push to GitHub

To push this project to a new repository on GitHub:

```bash
# 1. Initialize Git in this directory
git init

# 2. Add all files
git add .

# 3. Commit your files
git commit -m "Initial commit - Review Lens single-folder app"

# 4. Rename main branch
git branch -M main

# 5. Link to your GitHub repository (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 6. Push to GitHub
git push -u origin main
```
