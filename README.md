# Sunrise Real Estate

A full-stack real estate platform that enables users to discover properties, explore detailed listings, and submit inquiries through a modern web interface, while providing administrators with a secure dashboard for managing listings, customer inquiries, and property media.

---

## Overview

Sunrise Real Estate was developed as a full-stack web application that simulates a modern property management platform. The project focuses on building a scalable backend architecture alongside a clean and responsive frontend experience.

Instead of placing all logic inside route handlers, the backend follows a layered architecture by separating routes, controllers, services, middleware, and database models. This makes the application easier to maintain, extend, and test as it grows.

---

## Features

### User Features

- Browse available properties
- View complete property details
- Responsive property gallery
- Submit property inquiries
- Modern responsive interface

### Admin Features

- Secure administrator authentication
- Add new properties
- Edit existing listings
- Delete properties
- Upload and manage property images
- Manage customer inquiries

---

## Architecture

```text
                     ┌──────────────────────────────┐
                     │         Frontend             │
                     │     HTML • CSS • JS          │
                     └──────────────┬───────────────┘
                                    │
                              HTTP Requests
                                    │
                                    ▼
                     ┌──────────────────────────────┐
                     │       Express.js API         │
                     └──────────────┬───────────────┘
                                    │
        ┌──────────────┬────────────┴─────────────┬──────────────┐
        ▼              ▼                          ▼              ▼
     Routes       Middleware                Controllers      Services
                     │                                            │
                     ▼                                            ▼
         JWT • Helmet • CORS                             Business Logic
         Rate Limiting
                                    │
                                    ▼
                               Mongoose ODM
                                    │
                 ┌──────────────────┴──────────────────┐
                 ▼                                     ▼
             MongoDB                              Cloudinary
                                              Property Images
```

---

## Technology Stack

| Category | Technologies |
|----------|--------------|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Token (JWT) |
| Cloud Storage | Cloudinary |
| File Upload | Multer |
| Security | Helmet, CORS, Express Rate Limit |
| Version Control | Git, GitHub |

---

## Backend Design

The backend follows a modular architecture where each layer has a single responsibility.

```
sunrise-backend/
│
├── config/          # Database and cloud configuration
├── controllers/     # Request handling
├── middleware/      # Authentication and security
├── models/          # Database schemas
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Helper utilities
│
├── server.js
├── package.json
└── .env.example
```

---

## Security

The application incorporates several backend security practices including:

- JWT-based authentication
- Protected administrator routes
- Helmet security headers
- Cross-Origin Resource Sharing (CORS)
- API rate limiting
- Environment variable configuration
- Secure media management through Cloudinary

---

## Project Structure

```
Sunrise/
│
├── sunrise-real-estate-v6.html
│
└── sunrise-backend/
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── services/
    ├── utils/
    └── server.js
```

---

## Getting Started

### Clone the repository

```bash
git clone https://github.com/modidiya10-maker/sunrise-real-estate.git
```

### Navigate to the backend

```bash
cd sunrise-real-estate/sunrise-backend
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env` file based on `.env.example`.

```env
PORT=

MONGO_URI=

JWT_SECRET=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

### Start the development server

```bash
npm run dev
```

or

```bash
npm start
```

---

## Future Enhancements

- User accounts and authentication
- Property bookmarking
- Advanced search and filtering
- Google Maps integration
- Email notifications
- Property scheduling system
- Analytics dashboard
- Docker support
- CI/CD pipeline
- Automated testing

---

## License

This project is licensed under the MIT License.
