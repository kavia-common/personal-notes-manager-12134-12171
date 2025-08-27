# Notes App Frontend (Qwik)

A minimalistic light-themed notes application built with Qwik + Qwik City.

Features:
- User registration and authentication
- Create, edit, delete notes
- List and search notes
- Sidebar navigation, top bar with user info, main area with notes and editor

Theme:
- Primary: #1976d2
- Accent: #ffca28
- Secondary: #424242

## Quick Start

1) Install dependencies
   npm install

2) Configure environment
   Copy .env.example to .env and set:
   - VITE_API_BASE_URL: Base URL of your backend notes API
   - VITE_SITE_URL: Your site URL (optional)

3) Develop
   npm start
   App runs on http://localhost:3000

4) Preview production build
   npm run preview

5) Build
   npm run build

## Structure

- src/lib: api, auth, notes service functions (PUBLIC_INTERFACE)
- src/components: UI components (TopBar, Sidebar, NoteList, NoteEditor)
- src/routes:
  - /auth (login, register)
  - /app (secured area with layout, list/editor, new, search)
  - index.tsx redirects to /auth or /app based on token presence

## Environment Variables

See .env.example
- VITE_API_BASE_URL: URL of backend API (e.g., http://localhost:8000)
- VITE_SITE_URL: Site URL for redirects if needed

Do not commit real secrets. The orchestrator will populate the actual .env.

## Expected Backend API

The frontend expects a backend providing these endpoints (JWT bearer auth):

Auth:
- POST /auth/register { name, email, password } -> { token, user }
- POST /auth/login { email, password } -> { token, user }
- GET /auth/me (Authorization: Bearer <token>) -> user

Notes:
- GET /notes[?q=...] -> Note[]
- GET /notes/:id -> Note
- POST /notes { title, content, tags? } -> Note
- PUT /notes/:id { title?, content?, tags? } -> Note
- DELETE /notes/:id -> 204

Note type:
{
  id: string,
  title: string,
  content: string,
  tags?: string[],
  created_at?: string,
  updated_at?: string
}

## Security

- Tokens are stored in localStorage for demo purposes.
- Consider HTTP-only cookies for production.

## Development Notes

- Styling resides in src/global.css using the minimalistic light theme.
- Layout grid is defined by .app-shell with sidebar, top bar, and main content.
- All network calls use src/lib/api.ts which reads VITE_API_BASE_URL.

