# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

JSON Saver is a client-side web application for saving, editing, and managing JSON documents. All data is stored in browser localStorage with no backend.

## Development Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build (outputs to /dist)
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Tech Stack

- **Next.js 15** with static export (`output: "export"`)
- **React 18** with client-side rendering (`'use client'` directive)
- **TypeScript** with strict mode
- **Tailwind CSS** for styling
- **shadcn/ui** components (built on Radix UI)
- **jsoneditor** library for JSON editing with validation

## Architecture

### Two-Panel Layout
- Left sidebar (33%): Paginated list of saved JSONs
- Right panel (67%): JSON editor with title input and controls
- Panels are resizable via react-resizable-panels

### Key Files
- `src/app/page.tsx` - Main page with layout and state management
- `src/services/JsonManager.ts` - localStorage CRUD operations
- `src/components/json-create/jsonCreate.tsx` - Editor panel with save/delete
- `src/components/jsonEditor.tsx` - Wrapper around jsoneditor (dynamically imported to avoid SSR)
- `src/components/json-previews/` - Sidebar list and preview items

### Data Flow
1. JSONs stored in localStorage as `{ [id]: { id, title, data, lastUpdated } }`
2. `JsonManager` service handles all storage operations
3. Sidebar shows paginated results sorted by lastUpdated (newest first)
4. Editor validates JSON before allowing save

## Path Aliases

`@/*` maps to `./src/*` (configured in tsconfig.json)

## Deployment

GitHub Actions deploys to GitHub Pages on push to `main`:
- Builds to `/dist` folder
- Copies to `use-components` branch
- Base path in production: `/jsonSaver`
