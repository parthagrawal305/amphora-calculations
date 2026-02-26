# 📊 Amphora Ads — Earnings Calculator

An interactive calculator for AI-chat publishers to estimate how native ads offset their LLM inference costs.

**[amphora-calculator.vercel.app](https://amphora-calculator.vercel.app)**

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

---

## Context

Built this during my time at **Amphora Ads** (ad-tech startup monetizing AI chat apps). Publishers kept asking "will your ads actually cover my inference costs?" — so I built a tool where they could plug in their own numbers and see for themselves.

Defaults come from a real case study. Everything runs client-side — it's just math, no API calls.

## How it was built

Fed the Solveeit.ai case study PDF to Gemini and asked for a React calculator with the right defaults. Got a working prototype, then iterated on the UX in Cursor — making the hero section show net profit prominently, adding a premium theme with glassmorphism, and handling responsive stat layouts (there's a `useRef` that measures actual rendered width to decide when to stack vs. grid).

Has two themes: a developer-focused one with monospace fonts and code comments, and a premium one with animated gradients and Framer Motion scroll animations.

---

<sub>README generated with AI ✨</sub>
