# Forkcast

A phone-first family dinner planner and grocery list. Plan the week's dinners, spin for ideas when nobody can decide, and turn the plan into an aisle-sorted shopping list in one tap.

## What it does

- **Tonight**: tonight's dinner on a plate, tomorrow's on deck, the week at a glance, and how much of the list is left.
- **Week**: plan each night, flip between weeks, mark meals cooked, and **Fill open nights** (keeps Monday through Thursday quick and favors hearted meals).
- **Groceries**: a receipt-style list grouped by aisle. Planned dinners add their ingredients and duplicates are combined (2 lb + 1.5 lb ground beef becomes 3.5 lb). One-tap staples include baby and household items. Check items off as they go in the cart and share the list by text.
- **Meals**: 16 family dinners to start, tagged Toddler-approved, High protein, Slow cooker, and more. Heart favorites, add your own, and edit anything.
- **Spin**: dinner roulette with filters for favorites, quick meals, toddler-approved, or high protein.

Everything is saved on the device (localStorage). Settings has backup export and import for moving data to another phone.

## Run it

No build step. Serve the folder with any static server:

```sh
npx serve .
```

## Put it on an iPhone

1. Host it with GitHub Pages: repo **Settings → Pages → Build and deployment**, source **Deploy from a branch**, pick the branch and `/ (root)`.
2. Open the Pages URL in Safari, tap **Share → Add to Home Screen**.

It launches full screen like an app and works offline in the store.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | App shell and tab bar |
| `css/styles.css` | Design tokens (dark and light), components |
| `js/seed.js` | Starter meals, staples, aisles, tags |
| `js/app.js` | State, rendering, interactions |
| `sw.js`, `manifest.webmanifest`, `icons/` | Home Screen install and offline support |
