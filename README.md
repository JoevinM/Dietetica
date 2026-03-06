# Dietetica

> End-of-program project — Holberton School

Dietetica is a web platform designed to connect **dietitians with their clients**. The dietitian has a public showcase (articles, contact info), while clients can register and log their daily health data. The dietitian can then monitor each client's progress through a dedicated dashboard.

---

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Database Diagram](#database-diagram)
- [Getting Started](#getting-started)
- [Testing](#testing)
- [Team](#team)

---

## About the Project

Dietetica bridges the gap between nutrition professionals and their patients. It provides:
- A **public-facing showcase** for the dietitian (articles, services, contact)
- A **client portal** where users can log their weight, caloric intake, and physical activity
- A **dietitian dashboard** to monitor all clients and their health entries

---

## Features

### Authentication
- User registration and login (JWT-based authentication — token stored in an HTTP cookie)
- Role-based access control (RBAC) with 3 roles:

| Role | Permissions |
|---|---|
| `CLIENT` | Register, login, log personal health entries (weight, calories, activity) |
| `DIETITIAN` | View assigned clients and their entries |
| `ADMIN` | Full access — manage dietitians, delete users / dietitians / articles |

### Client Dashboard
- Log daily entries: **weight**, **calories**, and **physical activity**
- Visualize personal progress over time

### Dietitian Space
- View list of all registered clients
- Access each client's health entries and track their progress

### Public Showcase
- Dietitian's presentation page
- Blog articles on nutrition and health
- Contact form

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, JavaScript, CSS |
| **Backend** | Node.js, Express |
| **Database** | PostgreSQL + Prisma ORM |
| **Containerization** | Docker, Docker Compose |
| **Version Control** | Git, GitHub |

---

## Architecture

```
Dietetica/
├── front-end/          # React application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Application pages
│   │   └── services/   # API calls
│   └── Dockerfile
│
├── back-end/           # Node.js / Express API
│   ├── src/
│   │   ├── routes/     # API endpoints
│   │   ├── controllers/# Business logic
│   │   ├── middleware/ # Auth, error handling
│   │   └── prisma/     # DB schema & migrations
│   └── Dockerfile
│
└── docker-compose.yml  # Orchestrates all services
```

**Communication flow:**

```
[React Frontend] <--HTTP/REST--> [Express API] <--Prisma ORM--> [PostgreSQL DB]
```

All services are containerized and orchestrated via **Docker Compose**.

---

## Database Diagram

> The database is managed with **Prisma ORM** connected to **PostgreSQL**.

Main entities:

```
Dietician
├── id             (UUID)
├── first_name
├── last_name
├── email          (unique)
├── password       (hashed)
├── bio            (optional)
├── admin          (Boolean — true = admin role)
├── created_at
├── users[]        → User[]
├── appointments[] → Appointment[]
└── newsletters[]  → Newsletter[]

User
├── id             (UUID)
├── first_name
├── last_name
├── email          (unique)
├── password       (hashed)
├── height         (optional)
├── birth_date     (optional)
├── created_at
├── dietician_id   (FK → Dietician, optional)
├── daily_entries[] → DailyEntry[]
└── appointments[] → Appointment[]

DailyEntry
├── id             (UUID)
├── user_id        (FK → User, cascade delete)
├── date
├── weight         (optional)
├── calories       (optional)
├── activity       (optional)
├── notes          (optional)
└── [unique: user_id + date]

Newsletter
├── id             (UUID)
├── dietician_id   (FK → Dietician, cascade delete)
├── title
├── content
└── created_at

Appointment
├── id              (UUID)
├── user_id         (FK → User, cascade delete)
├── dietician_id    (FK → Dietician, cascade delete)
├── date
├── start_time
├── end_time
├── google_event_id (optional)
└── status          (default: "confirmed")
```

**Relations:**
```
Dietician (1) ──── (N) User
Dietician (1) ──── (N) Newsletter
Dietician (1) ──── (N) Appointment
User      (1) ──── (N) DailyEntry
User      (1) ──── (N) Appointment
```

---

## Getting Started

### Prerequisites
- [Docker](https://www.docker.com/) installed
- [Node.js](https://nodejs.org/) (v18+)

### First Launch

```bash
# 1. Clone the repository
git clone https://github.com/JoevinM/Dietetica.git
cd Dietetica

# 2. Navigate to back-end folder
cd back-end

# 3. Install dependencies
npm install

# 4. Build and start all containers
docker compose up --build
```

### Subsequent Launches

```bash
docker-compose start
```

### Initialize the Database

Once inside the backend container:

```bash
# Run migrations
npx prisma migrate dev --name init

# Pull current DB schema
npx prisma db pull

# Generate Prisma client
npx prisma generate

# (Optional) Open visual DB explorer
npx prisma studio --browser none
```

---

## Testing

Testing was conducted at multiple levels:

- **Manual testing** — All user flows tested via browser (registration, login, dashboard entries, dietitian view)
- **API testing** — Endpoints tested with [Postman](https://www.postman.com/) for all CRUD operations
- **Integration testing** — Verified frontend ↔ backend ↔ database communication end-to-end
- **Role-based access** — Validated that CLIENT, DIETITIAN and ADMIN only access authorized routes

---

## Team

| Name | Role | GitHub |
|---|---|---|
| **Antoine** | Project Manager & Full-stack Developer | [@CoqAntoine](https://github.com/CoqAntoine) |
| **Joevin** | Full-stack Developer (Frontend), Scribe & UI/UX | [@JoevinM](https://github.com/JoevinM) |
| **Matis** | Full-stack Developer (Backend), Logic & Architecture | [@niimatik](https://github.com/niimatik) |

---

## License

This project is licensed under the [MIT License](./LICENSE).

---

*Holberton School — End of Program Project — 2026*