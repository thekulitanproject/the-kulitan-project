# Kulitan Digital Dictionary - Full Project (Starter)

This package is a starter full-stack project for the **Kulitan Digital Dictionary**.

## Structure
- frontend/ - static front-end (HTML/CSS/JS)
- backend/ - Node.js (Express) API
- backend/db.sql - sample SQL to create `words` table and insert example rows

## Quick start (backend)
1. Ensure PostgreSQL is running and create a database `kulitan_dict` (or update env vars).
2. Run the SQL in `backend/db.sql` to create table and seed sample words.
3. In `backend/`:
   - `npm install`
   - configure environment variables (DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT) if needed
   - `npm run dev` (requires nodemon) or `npm start`

## Frontend
Open `frontend/index.html` in a browser. This is a static demo and can be connected to the backend by changing the front-end code to call `/api/words?q=...`.

## Notes
- Images in `frontend/images/` are placeholders. Replace them with optimized .webp/.jpg files.
- This starter is intentionally minimal; extend with real authentication, uploads, admin UI, and deployment configs as needed.

