# Employee Management - Full Stack

## Overview

Full-stack employee management with Flask JWT API backend and React (Vite) frontend.

## Project Timeline

Development period: Approximately 2025 (docs dated 2025-03, backend dated 2025-04; timeline approximate, no Git history).

## Key Features

- JWT authentication with HR and employee roles
- Employee CRUD API
- React dashboards, login, register and route guards

## Technologies

Python, Flask, Flask-JWT-Extended, Flask-SQLAlchemy, Flask-Bcrypt, React, Vite

## Development

Development: AI-assisted. Requirements, database schema, UI direction, customization, debugging, testing and integration were done by the author; AI tooling assisted with scaffolding and boilerplate.

## Screenshots

![Login](screenshots/01-login.png)
![Register](screenshots/02-register.png)

## Installation

Backend:
```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
Frontend:
```
cd frontend/vite-project
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` in `backend/` and set `SECRET_KEY` and `DATABASE_URL`.

## Demo Credentials

Register a fictional demo user (for example Demo User). No real credentials are shipped.

## Limitations

- SQLite default backend; needs a server database for production.

## Future Improvements

- Docker setup and production configs.
