# Green Garden - MERN Stack E-Commerce Platform

A production-ready, full-stack e-commerce application for plant retailers built with the MERN stack. Features secure authentication, real-time cart management, order processing, and product reviews with a modern, responsive interface.

**Live Application:** https://green-garden-mern.vercel.app

---

## Overview

Green Garden delivers a complete e-commerce solution with JWT authentication, RESTful API architecture, and MongoDB data persistence. Built following industry best practices with microservices deployment architecture.

### Core Capabilities

- **Secure Authentication**: JWT-based authentication with bcrypt password encryption
- **Product Catalog**: Browse and search plant inventory with detailed product pages
- **Shopping Cart**: Real-time cart management with quantity updates and price calculation
- **Order Management**: Complete checkout flow with order tracking and history
- **Review System**: Customer reviews with star ratings and average score calculation
- **Admin Dashboard**: Product and order management for administrators
- **Responsive Design**: Mobile-first UI optimized for all device sizes

---

## Tech Stack

**Frontend**
- React.js 18.x with functional components and hooks
- Redux Toolkit for state management
- React Router v6 for client-side routing
- Axios for HTTP requests with interceptors
- React Hook Form for validation
- Lucide React for icons

**Backend**
- Node.js with Express.js framework
- MongoDB with Mongoose ODM
- JWT for authentication
- bcrypt for password hashing
- CORS middleware

**Deployment**
- Frontend: Vercel (serverless)
- Backend: Render (Node.js container)
- Database: MongoDB Atlas (managed cloud)

---

## Architecture
┌──────────────────────────────────────────────────────┐
│ Client Layer (React SPA) │
│ Redux Store │ React Router │ Axios Client │
└────────────────────────┬─────────────────────────────┘
│ HTTPS/REST
┌────────────────────────▼─────────────────────────────┐
│ API Layer (Express.js) │
│ Routes │ Controllers │ Middleware │ Auth │
└────────────────────────┬─────────────────────────────┘
│
┌────────────────────────▼─────────────────────────────┐
│ Data Layer (MongoDB Atlas) │
│ Users │ Plants │ Orders │ Reviews │
└──────────────────────────────────────────────────────┘

---

## Project Structure

green-garden-mern/
│
├── reactapp/ # Frontend
│ ├── src/
│ │ ├── components/ # React components
│ │ ├── pages/ # Page components
│ │ ├── redux/ # Redux store & slices
│ │ ├── apiConfig.js # API configuration
│ │ └── App.js
│ └── package.json
│
├── nodeapp/ # Backend
│ ├── controllers/ # Business logic
│ ├── models/ # Mongoose schemas
│ │ ├── User.js
│ │ ├── Plant.js
│ │ ├── Order.js
│ │ └── Review.js
│ ├── routes/ # API routes
│ │ ├── userRoutes.js
│ │ ├── plantRoutes.js
│ │ ├── orderRoutes.js
│ │ └── reviewRoutes.js
│ ├── middleware/ # Auth & validation
│ └── index.js
│
└── README.md

---

## Features

### Authentication & Authorization
- User registration with email validation
- JWT token-based authentication
- Password encryption with bcrypt (10 salt rounds)
- Protected routes with authentication middleware
- Role-based access control (user/admin)

### Product Management
- Complete product catalog with search and filtering
- Detailed product pages with images and descriptions
- Admin CRUD operations for inventory
- Image upload and storage
- Category-based organization

### Shopping Cart
- Add/remove items with real-time updates
- Quantity management
- Automatic price calculation
- Cart persistence across sessions

### Order System
- Complete checkout workflow
- Order confirmation and tracking
- Order history for users
- Status management (pending, processing, shipped, delivered)
- Admin order management interface

### Reviews & Ratings
- Star-based rating system (1-5 stars)
- Written reviews for purchased products
- Average rating calculation per product
- User-specific review management

---

## Installation

### Prerequisites

- Node.js >= 14.0.0
- npm >= 6.0.0
- MongoDB Atlas account
- Git

### Setup Instructions

**1. Clone Repository**

```bash
git clone https://github.com/manishpxl/green-garden-mern.git
cd green-garden-mern
```

**2. Backend Setup**

```bash
cd nodeapp
npm install
```

Create `.env` file in `nodeapp/`:

```env
PORT=8080
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/greenGarden
JWT_SECRET=<your-secure-secret-key>
CLIENT_URL=http://localhost:3000
```

Start backend:

```bash
npm start
```

Backend runs at `http://localhost:8080`

**3. Frontend Setup**

```bash
cd reactapp
npm install
```

Update `src/apiConfig.js` if needed:

```javascript
const apiConfig = {
  baseUrl: process.env.REACT_APP_DB_API_URL || 'http://localhost:8080/api/db',
  fsBaseUrl: process.env.REACT_APP_FS_API_URL || 'http://localhost:8080/api/fs'
};
```

Start frontend:

```bash
npm start
```

Frontend runs at `http://localhost:3000`

---

## API Documentation

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/db/users/register` | Register new user | No |
| POST | `/api/db/users/login` | User login | No |
| GET | `/api/db/users/profile` | Get user profile | Yes |

### Products

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/db/plants` | Get all plants | No |
| GET | `/api/db/plants/:id` | Get plant details | No |
| POST | `/api/db/plants` | Create plant | Admin |
| PUT | `/api/db/plants/:id` | Update plant | Admin |
| DELETE | `/api/db/plants/:id` | Delete plant | Admin |

### Orders

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/db/orders` | Get user orders | Yes |
| POST | `/api/db/orders` | Create order | Yes |
| GET | `/api/db/orders/:id` | Get order details | Yes |
| PUT | `/api/db/orders/:id` | Update order status | Admin |

### Reviews

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/db/reviews/:plantId` | Get product reviews | No |
| POST | `/api/db/reviews` | Create review | Yes |
| DELETE | `/api/db/reviews/:id` | Delete review | Yes |

---

## Environment Variables

### Backend Configuration

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret key | Yes |
| `CLIENT_URL` | Frontend URL for CORS | Yes |

### Frontend Configuration

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_DB_API_URL` | Backend API URL | Optional |
| `REACT_APP_FS_API_URL` | File system API URL | Optional |

---

## Deployment

### Production URLs

- Frontend: https://green-garden-mern.vercel.app
- Backend: https://green-garden-mern.onrender.com

### Deployment Guide

**Vercel (Frontend)**

1. Connect GitHub repository to Vercel
2. Configure build settings:
   - Root Directory: `reactapp`
   - Build Command: `npm run build`
   - Output Directory: `build`
3. Add environment variables
4. Deploy

**Render (Backend)**

1. Create Web Service on Render
2. Connect repository
3. Configure:
   - Root Directory: `nodeapp`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add environment variables
5. Deploy

**MongoDB Atlas (Database)**

1. Create MongoDB Atlas cluster
2. Configure network access (0.0.0.0/0)
3. Create database user
4. Copy connection string to backend env

---

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT tokens with secure secret keys
- CORS configuration with origin whitelist
- Environment variable protection
- Input validation and sanitization
- Protected API routes
- MongoDB injection prevention via Mongoose

---

## Performance Optimizations

- React code splitting and lazy loading
- MongoDB indexing on frequently queried fields
- Database connection pooling
- CDN delivery via Vercel Edge Network
- Optimized bundle sizes

---

## Development

### Available Scripts

**Frontend**

```bash
npm start          # Development server
npm run build      # Production build
npm test           # Run tests
```

**Backend**

```bash
npm start          # Start server
npm run dev        # Development mode with nodemon
```

---

## Contributing

Contributions are welcome. Follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/enhancement`)
3. Commit changes (`git commit -m "Add feature"`)
4. Push to branch (`git push origin feature/enhancement`)
5. Open Pull Request

---

## Known Issues

- Backend on Render free tier may experience cold starts (10-15 seconds)
- Image uploads limited to 50MB

---

## License

This project is open source under the MIT License.

---

## Contact

**Manish Kumar**

- Portfolio: https://manish-kumar-portfolio-website.netlify.app
- GitHub: https://github.com/manishpxl
- LinkedIn: https://linkedin.com/in/manish-kumar-7b0535229
- Twitter: https://x.com/manishpxl

---

*Last Updated: May 2026*