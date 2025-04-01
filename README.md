# 🧅 the-shallot

This is a demo app that showcases how AI-generated rewrites can subtly (or dramatically) alter the framing of political news. It fetches top headlines from select political news sources, rewrites them through OpenAI, and displays different "slants" — neutral, conservative (pro-Trump), and progressive (anti-Trump).

---

## 🔧 Features

- 📰 Real political news from trusted and partisan sources
- 🤖 AI rewrites using OpenAI API
- 🎭 Toggle between neutral, conservative, and progressive perspectives
- 🧠 Slant persists across pages using React context
- 🕒 Automatic hourly cache refresh using Vercel scheduled functions
- 💻 Fully responsive design using Tailwind CSS

---

## 🚀 Deployment

This app is built with Vite + React and designed for simple deployment to **Vercel**.

### 1. Clone the repo
```
git clone https://github.com/yourusername/slanted-news-demo.git
cd slanted-news-demo
```

### 2. Install dependencies
```
npm install
```

### 3. Set environment variables
Create a `.env.local` file in the root:
```
VITE_OPENAI_API_KEY=your_openai_key
VITE_NEWS_API_KEY=your_newsapi_key
```

### 4. Test locally
```
npm run dev
```
Then visit: [http://localhost:5173](http://localhost:5173)

### 5. Deploy to Vercel
- Push to GitHub
- Connect repo to Vercel
- Set the same env vars in Vercel Dashboard
- Vercel will auto-deploy the frontend and schedule the backend refresh every hour

---

## 🧠 Architecture Overview

- **Frontend**: React + Vite + React Router + Tailwind CSS
- **State**: Managed with React Context
- **Backend**: `/api/refresh-cache.js` (runs hourly on Vercel)
- **Data**: Cached in `public/cache/articles.json`

---

## 📦 Scripts

- `npm run dev` — local development
- `npm run build` — production build
- `npm run preview` — preview production locally
- `node scripts/refreshLocal.js` — manually generate articles locally

---

## ⚠️ Disclaimer
This app is for educational purposes only. It demonstrates how framing and slant can affect perception, and how AI might be misused to subtly shift narratives.

---

## 📬 Feedback or Contributions?
Open an issue or pull request. This is a living demo — your input is welcome!
