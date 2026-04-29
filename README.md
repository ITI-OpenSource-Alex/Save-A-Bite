# LastBite 🛒

## Overview

LastBite is a modern, full-stack e-commerce web application. It features a robust Angular-based frontend and a secure Node.js backend using MongoDB. The application provides a complete user authentication flow, real-time features, advanced role-based access control, and dedicated dashboards for administrators and vendors.

## Technology Stack

### Frontend

- **Framework:** Angular (v21)
- **Styling:** Tailwind CSS
- **UI Components:** Highly customizable inputs utilizing Tailwind and `class-variance-authority` (CVA)
- **Icons:** Lucide Angular
- **Real-time:** Socket.IO Client

### Backend

- **Runtime:** Node.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Security & Auth:** JWT (Access & Refresh tokens), bcrypt (password hashing), crypto
- **Payments:** Stripe API & Webhooks
- **Real-time:** Socket.IO

---

## Key Features

### 1. User Authentication, Authorization & ABAC

- Registration with mandatory email verification.
- Secure login using JWT with short-lived access tokens and long-lived refresh tokens.
- Advanced attribute-based access control to strictly protect endpoints across `user`, `vendor`, `admin`, and `super-admin` roles.
- Token blacklisting for secure logout.

### 2. Vendor Logic & Dedicated Dashboards

- Comprehensive "Become a Vendor" application flow for guests and existing users.
- **Super Admin Dashboard** for reviewing, approving, or rejecting vendor requests, which triggers automated store creation.
- **Dedicated Vendor Dashboard** for independent store management, allowing vendors to perform CRUD operations on their products, manage stock, and set up flash deals/discount percentages.

### 3. Account Management

- Profile updates with dynamic email re-verification if the email address changes.
- "Forgot Password" flow utilizing 6-digit OTPs sent via email.

### 4. Product Discovery, Cart & Promocodes

- Advanced master search interface with dynamic filtering and sorting capabilities.
- Robust shopping cart functionality with integrated Promocode support for applying dynamic discounts to orders.
- Efficient server-side pagination and result limit controls to optimize data transfer.
- Dedicated, modular UI components for product display and search refinement.

### 5. Modern UI/UX

- Reusable, variant-driven UI components (e.g., highly customizable inputs utilizing Tailwind and CVA).
- Automated, SSR-safe unique ID generation for accessibility and DOM element targeting.
- Highly responsive design tailored for various screen sizes using Tailwind CSS utility classes.

### 6. Secure Payments & Checkout

- Integrated **Stripe** payment gateway for secure checkout and transaction processing.
- Robust webhook handling to automatically sync order statuses (e.g., updating order status to PAID).
- Automated post-payment workflows including cart clearing, promo code usage tracking, and triggering real-time success notifications.

### 7. Notifications & Real-time Capabilities

- Automated system email notifications for critical workflows (e.g., vendor request approvals/rejections and OTPs).
- Integrated Socket.IO for live real-time notifications, customer support chat, and instantaneous order updates.

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- Angular CLI (v21+)
- MongoDB (Local or Atlas instance)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables (create a `.env` file based on `.env.example` with your MongoDB URI, JWT secrets, and Email SMTP credentials).
4. Start the development server:
   ```bash
   npm run start:dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Angular development server:
   ```bash
   ng serve
   ```