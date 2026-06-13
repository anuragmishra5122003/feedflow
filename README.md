# FeedFlow 🚀
### Your Feed. Your Way.

FeedFlow is a mobile application that automatically personalizes your Instagram feed based on your interests — no manual effort required.

![FeedFlow](https://img.shields.io/badge/Platform-Android-green) ![Expo](https://img.shields.io/badge/Built%20with-Expo-blue) ![Firebase](https://img.shields.io/badge/Backend-Firebase-orange) ![Node.js](https://img.shields.io/badge/Automation-Node.js-yellow)

---

## 📲 Download APK

👉 **[Download FeedFlow APK](https://expo.dev/accounts/anuragflexop/projects/feedflow/builds/17b50c10-8970-44d1-a0db-62763b8bb335)**

---

## 🎯 What It Does

FeedFlow trains Instagram's algorithm to show you what you actually want to see — automatically, without you doing anything manually.

1. **You select your interests** → AI, Tech, Startups, Fitness, Business, Travel and more
2. **It works in the background** → A smart automation bot logs into Instagram and engages with content matching your preferences
3. **Instagram notices** → Consistent engagement signals the algorithm to show more relevant content
4. **Your feed transforms** → Less junk, more of what you care about

---

## ✨ Features

- 🔐 **Secure Authentication** — Email/password login with Firebase Auth
- 🎯 **Interest Selection** — Choose topics to see more of and topics to avoid
- 🤖 **Smart Automation** — Playwright-powered bot that interacts with Instagram on your behalf
- 📊 **Real-time Analytics** — Live tracking of automation actions, feed score, and progress
- 📱 **Beautiful UI** — Dark themed, modern design with smooth animations
- ⚙️ **Full Control** — Start/stop automation anytime from the app
- 🔄 **Instagram Connect** — Step-by-step connection flow with status tracking

---

## 📱 App Screens

| Screen | Description |
|--------|-------------|
| Onboarding | 4-slide intro explaining the product |
| Login / Sign Up | Firebase-powered authentication |
| Home Dashboard | Personalization score, stats, recent activity |
| Interests | Select topics to follow and avoid |
| Analytics | Live automation logs, charts, topic breakdown |
| Settings | Profile, Instagram connection, automation controls |
| Connect Instagram | Step-by-step Instagram account connection |

---

## 🛠️ Tech Stack

### Mobile App
- **React Native** + **Expo SDK 56**
- **Expo Router** — file-based navigation
- **Firebase Auth** — user authentication
- **Firestore** — per-user data storage
- **AsyncStorage** — session persistence

### Backend
- **Node.js** + **Express** — REST API
- **Playwright** — browser automation
- **Deployed on Render** — free tier, always online

### Database
- **Firebase Firestore** — stores user preferences, stats, Instagram connection status

---

## 🚀 How It Works

```
User selects interests in app
        ↓
App sends preferences to backend (Render)
        ↓
Backend launches invisible Chromium browser
        ↓
Logs into Instagram with provided credentials
        ↓
Searches hashtags based on selected topics
        ↓
Likes relevant posts automatically
        ↓
Instagram algorithm learns your preferences
        ↓
App shows real-time progress and activity logs
```

---

## 🔧 Run Locally

### Prerequisites
- Node.js 18+
- Expo Go app on your phone
- Firebase project

### Mobile App

```bash
git clone https://github.com/anuragmishra5122003/feedflow.git
cd feedflow
npm install --legacy-peer-deps
npx expo start
```

### Backend

```bash
cd feedflow-backend-new
npm install
npx playwright install chromium
```

Create `.env` file:
```
PORT=3001
IG_USERNAME=your_instagram_username
IG_PASSWORD=your_instagram_password
```

```bash
node server.js
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/status` | Get automation status |
| POST | `/start` | Start automation |
| POST | `/stop` | Stop automation |
| POST | `/connect` | Connect Instagram account |
| GET | `/logs` | Get activity logs |

---

## 🏗️ Project Structure

```
FeedFlow/
├── app/
│   ├── (auth)/
│   │   ├── index.js          ← Onboarding
│   │   └── login.js          ← Login/Signup
│   ├── (tabs)/
│   │   ├── home.js           ← Dashboard
│   │   ├── preferences.js    ← Interest Selection
│   │   ├── analytics.js      ← Analytics
│   │   └── settings.js       ← Settings
│   └── connect.js            ← Instagram Connect
├── constants/
│   ├── colors.js             ← App theme
│   └── api.js                ← Backend URLs
├── context/
│   └── AuthContext.js        ← Auth state
├── firebase/
│   └── config.js             ← Firebase config
└── feedflow-backend-new/
    ├── server.js             ← Express API
    └── automation.js         ← Playwright bot
```

---

## 🔒 Security

- Passwords are never stored in plain text
- Firebase handles all authentication securely
- Backend environment variables kept private via `.env`
- `.gitignore` excludes all sensitive files

---

## 📊 Live Backend

Backend deployed on Render:
```
https://feedflow-backend-xbhd.onrender.com/status
```

---

## 👨‍💻 Built By

**Anurag Mishra** — Full Stack Developer & AI Integration Developer

Built for the FeedFlow Hackathon Challenge as a demonstration of practical Instagram feed personalization through intelligent automation.

---

## ⚠️ Disclaimer

This app is built for educational and demonstration purposes. Use with a test Instagram account. Automated interactions may violate Instagram's Terms of Service.
