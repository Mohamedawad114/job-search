# 🚀 Job Search Platform (AI-Powered) – Backend

A scalable and production-ready backend system for a job search platform built with **NestJS**, designed to handle real-world use cases including AI-powered CV analysis, real-time communication, and advanced job matching.

---

## 🧠 Key Features

* 🔐 **Authentication & Authorization**

  * Role-based system (User, Company Admin, Super Admin)
  * Secure authentication with hashing and token-based access

* 💼 **Job Management System**

  * Create, update, and manage job postings
  * Advanced filtering (title, description, work type, remote/on-site)

* 🤖 **AI Integration**

  * CV parsing using PDF extraction
  * AI-powered analysis:

    * ATS Score
    * Strengths & Weaknesses
    * Suggestions & Summary
  * Skill matching between user and job requirements

* ⚡ **Performance Optimization**

  * Caching layer for high performance
  * Background processing using BullMQ
  * Optimized database queries with Prisma
  & prisma Transaction

* 💬 **Real-Time Features**

  * Real-time chat system (private & group)
  * Real-time notification system using MongoDB,mongoose

* 📍 **Location Services**

  * Company geolocation using static geocoding(formatted_address,lat,long)

* 📊 **Admin Dashboard**

  * Full control over users, job category, work type, skills

---

## 🏗️ Tech Stack

* **Backend:** NestJS
* **Database:** MySQL (Prisma ORM),mongodb (mongoose ODM)
* **Real-time:** Socket.IO
* **Queue:** BullMQ (Redis)
* **AI:** OpenAI API | google Gemini
* **Notifications:** MongoDB + Mongoose
* **Storage:** AWS S3
* **Containerization:** Docker (multi-stage + docker-compose)
* **Logging:** Pino
* **Documentation:** Swagger , Postman

---

## 🧩 Architecture Highlights

* Modular architecture (Auth, Jobs, Company, AI, Dashboard, etc.)
* Repository Pattern with Prisma& mongoose
* Prisma Middleware for advanced query handling
* Background jobs for heavy operations (AI, emails, async DB tasks)
* Separation of concerns for scalability

---

## 🔍 Advanced Features

* Skill system with relational mapping (UserSkill & JobSkill)
* AI-based skill matching engine
* Search system with multiple filters
* Rate limiting & security best practices (Helmet, hashing, encryption)

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run start:dev

# Run with Docker
docker-compose -f docker-compose-dev.yml up --build
```

---

## 📌 Future Improvements

* Cursor-based pagination
* Full-text search optimization
* Enhanced monitoring & observability
* use graphQl

## Postman Docs
https://documenter.getpostman.com/view/44460916/2sBXijLCgX
---

## Feel free to connect or reach out for collaboration or opportunities.

job-search

├── config/

│   ├── dev.env

│   └── swagger.ts


│
├── prisma/

│   ├── migrations/

│   └── schema.prisma

│
├── src/

│   ├── common/

│   │   ├── DB/                # Mongo models (chat, notification)

│   │   ├── Enum/

│   │   ├── Interfaces/

│   │   ├── Repositories/

│   │   │   ├── mongo/

│   │   │   └── prisma/

│   │   ├── Utils/

│   │   │   ├── hashing/

│   │   │   ├── crypto/

│   │   │   ├── redis/

│   │   │   ├── tokens/

│   │   │   ├── mail/

│   │   │   ├── s3/

│   │   │   └── jobs/         # BullMQ (AI, email, db, maps)

│   │   ├── decorators/

│   │   ├── guards/

│   │   ├── interceptors/

│   │   ├── middlewares/

│   │   └── helpers/

│   │
│   ├── modules/

│   │   ├── auth/

│   │   ├── account/

│   │   ├── profile/

│   │   ├── company/

│   │   ├── job/

│   │   ├── application/

│   │   ├── savedJobs/

│   │   ├── notification/

│   │   ├── workType/

│   │   ├── job-category/

│   │   ├── dashboard/

│   │   ├── reports/

│   │   └── AI/

│   │
│   ├── prisma/

│   │   ├── prisma.module.ts

│   │   └── prisma.service.ts


│   │
│   └── main.ts
│
├── test/
│
├── README.md
├── package.json
└── tsconfig.json
