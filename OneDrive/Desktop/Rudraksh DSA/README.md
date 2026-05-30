# 🧘 AlgoZen — Documentation Hub
### "DSA Seekho Jaise Game Khelte Ho"

> India's first AI-powered, gamified DSA learning platform for engineering students.

---

## 📚 Documentation Index

| # | File | Purpose | Size |
|---|------|---------|------|
| 00 | [`00_MASTER_SYSTEM_PROMPT.md`](./00_MASTER_SYSTEM_PROMPT.md) | **AI Context** — Paste into any AI session for full project awareness | 9 KB |
| 01 | [`01_PRD.md`](./01_PRD.md) | **Product Requirements** — Features, gamification, personas, metrics, risks | 15 KB |
| 02 | [`02_TRD.md`](./02_TRD.md) | **Technical Spec** — Architecture, DB schemas, APIs, security, performance | 20 KB |
| 03 | [`03_APP_FLOW.md`](./03_APP_FLOW.md) | **Application Flow** — Routes, user journeys, components, state management | 33 KB |
| 04 | [`04_UIUX_DESIGN_SYSTEM.md`](./04_UIUX_DESIGN_SYSTEM.md) | **Design System** — Colors, typography, components, animations, accessibility | 21 KB |
| 05 | [`05_LAUNCH_PLAYBOOK.md`](./05_LAUNCH_PLAYBOOK.md) | **Launch Ops** — Folder structure, deployment, checklists, GTM, runbooks | 19 KB |
| | **TOTAL** | **Complete production blueprint** | **~118 KB** |

---

## 🎯 How to Use These Docs

### Starting a New AI Coding Session
```
1. Paste 00_MASTER_SYSTEM_PROMPT.md (always)
2. Add the relevant detail file based on your task:
   - Building a feature?     → 01_PRD.md + 02_TRD.md
   - Designing a page?       → 03_APP_FLOW.md + 04_UIUX_DESIGN_SYSTEM.md
   - Setting up infra?       → 02_TRD.md + 05_LAUNCH_PLAYBOOK.md
3. Describe your specific task clearly
```

### Quick Reference
- **What to build?** → `01_PRD.md`
- **How to build it?** → `02_TRD.md`
- **What does the user see?** → `03_APP_FLOW.md`
- **How does it look?** → `04_UIUX_DESIGN_SYSTEM.md`
- **How to deploy?** → `05_LAUNCH_PLAYBOOK.md`

---

## 🛠️ Tech Stack at a Glance

| Layer | Tech |
|-------|------|
| Frontend | React + Vite + TailwindCSS + Zustand + Framer Motion |
| Backend | Node.js + Express + MongoDB + Socket.io |
| Auth | Clerk (10k MAU free) |
| Code Exec | Judge0 (self-hosted Docker) |
| AI | Groq (Llama 3.3 70B) + Gemini 1.5 Flash |
| Hosting | Vercel + Railway + DigitalOcean + Cloudflare |
| Cost | **₹0/month** for first 11 months |

---

## 📁 Project Structure

```
algozen/
├── client/          # React frontend (Vite + TailwindCSS)
├── server/          # Node.js backend (Express + Mongoose)
├── judge0/          # Judge0 Docker config
└── .github/         # CI/CD pipeline
```

---

**AlgoZen v1.0 · May 2026 · Built with ❤️ for Indian students**