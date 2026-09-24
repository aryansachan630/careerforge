# CareerForge

A clean, responsive full-stack job application and interview tracker built with React, Express and MongoDB.

## Features

- JWT authentication
- Dashboard with application statistics
- Kanban-style application pipeline
- Add, edit and delete applications
- Search and status filters
- Interview date and notes tracking
- Responsive modern UI
- REST API
- MongoDB support
- Demo/in-memory mode when `MONGO_URI` is not configured

## Stack

**Frontend:** React, Vite, React Router, Axios, Lucide React  
**Backend:** Node.js, Express, JWT, bcryptjs, Mongoose

## Run locally

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

If MongoDB is configured, add your connection string to `.env`. Without it, CareerForge automatically uses in-memory demo storage.

### 2. Frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Then open the URL shown by Vite.

## Demo account

In demo mode, you can register a new account from the UI. The data stays in memory and resets when the backend restarts.

## Project structure

```text
careerforge/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   └── package.json
└── README.md
```
