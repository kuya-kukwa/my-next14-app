# My Next14 App

This repository contains a Next.js + Tailwind CSS starter configured for a small marketing site with modular UI components and form pages (sign in / sign up).

## Quick start

Prerequisites

- Node.js 18+ (recommended)
- npm (or yarn / pnpm)

Install dependencies

```powershell
npm install
```

Run development server

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

## Project structure (important folders)

- `src/components/` — UI components (forms, sections, layout)
- `src/styles/` — global CSS and design tokens (Tailwind tokens live here)
- `public/images/` — static images used by the site (backgrounds, avatars)

## Notes & troubleshooting

- Background images and static assets should be placed under `public/`. For example, the site expects a hot accent image at `public/images/signin/HOT_RED.png`. If you see 404s like `/images/signin/HOT_RED.png`, add the file to that folder or update the component path.

- Tailwind and CSS token changes (for example the `--radius-lg` token) sometimes require restarting the dev server and clearing Next's cache. If styles don't update after editing `tailwind.config.ts` or `src/styles/globals.css`, try:

```powershell
rm -Recurse -Force .next; npm run dev
```

- If a global CSS rule (for example a global `h3` color) is overriding Tailwind utilities, look in `src/styles/globals.css` for the rule and either remove it or increase utility specificity where appropriate.

## Contributing / git workflow

- Branch naming: use short descriptive branches like `feature/inputs-rounded` or `fix/avatar-border`.
- The current working branch used during UI work is `week-1`.
- To create a pull request from the command line you can use GitHub CLI or open the PR on the web. Example:

```powershell
git checkout -b feature/update-readme
git add README.md
git commit -m "docs: update README with project quick-start"
git push -u origin feature/update-readme
# then open a PR on GitHub or run: gh pr create --base main --head feature/update-readme --web
```

## Why this README was updated

The previous README contained the default create-next-app text. This project includes several custom conventions (design tokens in `src/styles/globals.css`, component patterns in `src/components/*`, and a Tailwind config in `tailwind.config.ts`) so this file was updated to capture the project's quick-start steps and common troubleshooting tips.

## Contact

If you want me to commit and push this README to `week-1` and open a PR, reply "Please commit & push" and I'll run the git commands for you.
