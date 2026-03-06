# JSON Saver

A client-side web application for saving, editing, and managing JSON documents. No backend, no account — everything is stored locally in your browser.

**Live demo:** [rubendesert.com/json](https://apps.rubendesert.com/json)

---

## Features

- **Save JSON** with a title and automatic timestamp
- **Edit saved JSONs** with syntax highlighting and real-time validation
- **Delete** with confirmation dialog
- **Paginated sidebar** sorted by last updated date
- **Resizable panels** — adjust the sidebar/editor split to your preference
- **100% client-side** — data never leaves your browser (localStorage)

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (static export) |
| UI | React 18, Tailwind CSS, shadcn/ui |
| JSON editor | [jsoneditor](https://github.com/josdejong/jsoneditor) |
| Storage | Browser `localStorage` |
| Deployment | GitHub Pages via GitHub Actions |

## Getting started

```bash
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000).

### Other commands

```bash
npm run build   # Production build → /dist
npm run start   # Start production server
npm run lint    # Run ESLint
```

## Project structure

```
src/
├── app/
│   ├── page.tsx              # Root page — layout and state management
│   └── layout.tsx            # HTML shell, fonts, Toaster
├── components/
│   ├── navbar/Navbar.tsx     # Top bar with "Create new" button
│   ├── sidebar/Sidebar.tsx   # Left panel wrapper
│   ├── json-create/
│   │   └── jsonCreate.tsx    # Editor panel (title input, save/delete)
│   ├── json-previews/
│   │   ├── jsonPreviewsContainer.tsx  # Paginated list
│   │   └── jsonPreviewsItems.tsx      # Individual preview card
│   ├── jsonEditor.tsx        # Wrapper around jsoneditor (dynamic import)
│   └── ErrorBoundary.tsx     # React error boundary
├── hooks/
│   └── usePagination.ts      # Pagination logic over localStorage data
├── services/
│   └── JsonManager.ts        # localStorage CRUD (save, get, delete, paginate)
└── types/
    └── json.ts               # Shared types (JsonFile, EditStatus)
```

## How it works

1. JSONs are stored in `localStorage` under a single key as `{ [id]: { id, title, data, lastUpdated } }`
2. `JsonManager` handles all read/write operations and throws a typed `StorageError` on failure
3. The sidebar loads items in pages of 2, sorted by `lastUpdated` (newest first)
4. Selecting an item loads it into the editor; saving updates the existing record in place
5. Creating a new JSON generates a UUID client-side via `crypto.randomUUID()`

## Deployment

TODO
