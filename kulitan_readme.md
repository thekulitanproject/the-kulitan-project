# Kulitan Digital Dictionary

A complete full stack project that serves as a learning hub for the Kulitan script. This README provides a comprehensive guide to installation, structure, usage, development workflow, and troubleshooting.

---

## Overview

The Kulitan Digital Dictionary is a dynamic web application built to preserve, teach, and celebrate the Kapampángan script. The platform features:

- A clean, responsive frontend
- A backend API for words, meanings, pronunciations, and SVG Kulitan characters
- Language packs for Kapampángan and English
- A structured flow of pages containing the dictionary, root words, and pronunciation guides

---

## Features

### Core Features
- Home page with learning sections
- Dictionary listing of words
- Search and filter functionality
- SVG based Kulitan characters with optional shadows
- Full bilingual support (EN / KP)
- Backend REST API with Express and PostgreSQL
- Auto reload on changes via nodemon

### Technical Features
- Modular folder structure
- Language packs controlled by JavaScript
- Automatic routing for backend API
- Frontend served through local dev server

---

## Project Structure

```
kulitan_full_project/
│
├── backend/
│   ├── server.js
│   ├── database.js
│   ├── controllers/
│   ├── routes/
│   └── sql/
│
├── frontend/
│   ├── index.html
│   ├── assets/
│   ├── js/
│   └── language_pack/
│
├── words.json
├── README.md
└── package.json
```

---

## Requirements
- Node.js v18 or higher
- PostgreSQL
- npm or yarn

---

## Installation

### 1. Clone the Project
```
git clone <repository-url>
cd kulitan_full_project
```

### 2. Install Dependencies
```
npm install
```

This installs:
- Express
- Nodemon
- PostgreSQL client libraries
- serve for frontend development
- npm-run-all for parallel running

### 3. Setup Database
Create a PostgreSQL database:
```
CREATE DATABASE kulitan_db;
```

Then create your table:
```
CREATE TABLE words (
    id SERIAL PRIMARY KEY,
    kulitan TEXT NOT NULL,
    romanized TEXT NOT NULL,
    meaning TEXT NOT NULL
);
```

### 4. Configure Backend
Edit `backend/database.js` to match your local database credentials.

---

## Running the Project

### Single Command
```
npm-run-all --parallel backend frontend
```
This launches:
- Backend on http://localhost:5000
- Frontend on http://localhost:3000 (or fallback port)

### Separate Commands
#### Start Backend
```
npm run backend
```
#### Start Frontend
```
npm run frontend
```

---

## Using the API

### GET All Words
```
GET /api/words
```

### POST New Word
```
POST /api/words
{
  "kulitan": "<svg or text>",
  "romanized": "word",
  "meaning": "definition"
}
```

---

## Language System
The frontend does not rely on direct HTML content. Text is controlled through language pack JSON files inside:
```
frontend/language_pack/
```
Files include:
- en.json
- kp.json

To add new text, update JSON instead of editing HTML.

---

## Troubleshooting

### Error: `relation "words" does not exist`
Cause: database table is missing.
Fix: create the table as shown in the installation section.

### Error: `Missing parameter name at index 1: *`
Cause: your route used an invalid wildcard.
Fix: use:
```
app.get("/*", ...)
```
Instead of:
```
app.get("*", ...)
```

### Frontend does not reflect text changes
Cause: text comes from JavaScript language packs.
Fix: update language JSON instead.

---

## Future Plans
- Search autocomplete
- Audio pronunciation
- Offline mode
- PDF export for learners
- Community submission system

---

## Credits
This project was built to preserve and celebrate Kapampángan culture. Thank you for supporting the revival of Kulitan.

---

## License
MIT License

