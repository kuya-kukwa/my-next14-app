# My Next.js App (Next 15 / React 19)

This repository contains a Next.js (v15) + Tailwind CSS starter configured for a marketing site with modular UI components and auth forms (sign in / sign up). It uses TypeScript and the `pages` router pattern by default.

## Quick start

Prerequisites

- Node.js 18+ (recommended)
- npm (or yarn / pnpm)

Install dependencies

```powershell
npm install
```

Run development server (Turbopack)

```powershell
npm run dev
# open http://localhost:3000
```

Build for production

```powershell
npm run build
npm start
```

Run tests

```powershell
npm run test
```

Run lint

```powershell
npm run lint
```

This project includes several custom conventions: design tokens in `src/styles/globals.css`, components in `src/components/*`, a Tailwind v4 config in `tailwind.config.ts`, and forms with React Hook Form. This README captures the project's quick-start steps and common troubleshooting tips.

### Notes

- Background images and static assets should live under `public/`. For example `public/images/signin/HOT_RED.png` is used on the sign-in background.
- To clear the local Next.js cache on Windows PowerShell:

```powershell
rm -Recurse -Force .next; npm run dev
```

- If a global CSS rule is overriding Tailwind utilities, look in `src/styles/globals.css` and increase specificity if needed.

### Quick UI note

- Inputs in forms use `rounded-xl` and a subtle glass border `border-2 border-red-500/60` by default. Focus rings use the main red token (`focus:ring-2 focus:ring-red-600`).

If you want me to commit and push this README to `week-1` and open a PR, reply "Please commit & push" and I'll run the git commands for you.
