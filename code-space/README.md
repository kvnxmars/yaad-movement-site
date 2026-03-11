# Stringz Site

Overview
--------

This repository contains a small multi-part site with a static frontend, a Vite-based `admin` app, and a Node.js `backend` that provides a simple API and file uploads.

Prerequisites
-------------

- Node.js (16+ recommended)
- npm (or yarn)

Quick start
-----------

Backend (API + uploads)

1. Open a terminal and change into the backend folder:

   cd code-space/backend
2. Install dependencies and start the server:

   npm install
   npm start

The backend uses Express and listens on the port configured in `index.js` (default: 3000 if not changed).

Admin (Vite + React)

1. Open a terminal and change into the admin folder:

   cd code-space/admin
2. Install dependencies and run the dev server:

   npm install
   npm run dev

This starts the Vite dev server (see `admin/package.json` scripts: `dev`, `build`, `preview`).

Frontend (static)

The top-level `code-space/index.html` and `code-space/frontend` contain the static frontend assets. You can open `code-space/index.html` directly in a browser for a static preview, or configure the backend to serve the `public/` folder.

Project structure
-----------------

- code-space/
  - index.html — main static landing page
  - admin/ — Vite + React admin app (dev: `npm run dev`)
  - backend/ — Node/Express API and upload endpoints (start: `npm start`)
  - api/ — lightweight serverless-style endpoints
  - frontend/ — static CSS and media used by the site
  - public/ — shared public assets
  - media-space/ — additional media files

Notes
-----

- If you host the frontend and admin separately, ensure CORS is configured in the backend (the backend already includes `cors` in dependencies).
- Check `backend/index.js` for the configured port and any environment variables you may want to set.

Contact
-------

For questions about this repository, open an issue or contact the maintainer.
