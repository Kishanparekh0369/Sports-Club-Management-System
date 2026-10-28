# Elite Sports Club — RESTful API Documentation

This document outlines the REST API endpoints provided by the **Elite Sports Club Management System** backend server.

- **Base URL**: `http://localhost:5000/api`
- **Content-Type**: `application/json`
- **Authentication**: JWT Bearer Token via `Authorization: Bearer <token>` or HTTP-only cookie.

---

## 1. Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new member account |
| `POST` | `/api/auth/login` | Public | Authenticate user and return JWT token |
| `POST` | `/api/auth/logout` | Public | Invalidate cookie and logout |
| `GET` | `/api/auth/me` | Protected | Fetch currently authenticated user profile |
| `POST` | `/api/auth/forgot-password` | Public | Request password reset token |
| `POST` | `/api/auth/reset-password/:token` | Public | Reset password using valid token |
| `POST` | `/api/auth/change-password` | Protected | Change password with current password verification |

---

## 2. Members Management (`/api/members`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `PUT` | `/api/members/profile/me` | Protected (Member) | Update own profile (name, phone, bio, avatar) |
| `GET` | `/api/members` | Protected (Admin) | Search, filter, and paginate all members |
| `POST` | `/api/members` | Protected (Admin) | Create a new club member directly |
| `GET` | `/api/members/:id` | Protected (Admin) | Retrieve detailed member profile & history |
| `PUT` | `/api/members/:id` | Protected (Admin) | Update member information |
| `PATCH` | `/api/members/:id/status` | Protected (Admin) | Activate or deactivate member account |

---

## 3. Sports Catalogue (`/api/sports`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/sports` | Public | List all sports with category filter & search |
| `GET` | `/api/sports/:id` | Public | View single sport details, coaches & facilities |
| `POST` | `/api/sports` | Protected (Admin) | Add a new sport to catalogue |
| `PUT` | `/api/sports/:id` | Protected (Admin) | Update sport details, rules, pricing & equipment |
| `DELETE` | `/api/sports/:id` | Protected (Admin) | Remove or deactivate sport |

---

## 4. Coaches Directory (`/api/coaches`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/coaches` | Public | List active coaches and specializations |
| `POST` | `/api/coaches` | Protected (Admin) | Add a new certified coach |
| `PUT` | `/api/coaches/:id` | Protected (Admin) | Update coach biography, rating & credentials |
| `DELETE` | `/api/coaches/:id` | Protected (Admin) | Remove coach from active directory |

---

## 5. Facilities & Courts (`/api/facilities`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/facilities` | Public | List all sports courts, turfs, and venues |
| `POST` | `/api/facilities` | Protected (Admin) | Create a new sports facility |
| `PUT` | `/api/facilities/:id` | Protected (Admin) | Update facility details and opening hours |
| `DELETE` | `/api/facilities/:id` | Protected (Admin) | Remove facility record |

---

## 6. Bookings & Reservations (`/api/bookings`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/bookings` | Protected | List bookings (Members see own, Admins see all) |
| `POST` | `/api/bookings` | Protected (Member) | Book sport slot with conflict validation |
| `GET` | `/api/bookings/:id` | Protected | View booking confirmation details |
| `PATCH` | `/api/bookings/:id/status` | Protected (Admin) | Approve, confirm, or reject booking |
| `PATCH` | `/api/bookings/:id/cancel` | Protected | Cancel booking slot |

---

## 7. Tournaments & Events (`/api/events`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/events` | Public | List upcoming and past tournaments |
| `GET` | `/api/events/:id` | Public | View tournament details & bracket capacity |
| `POST` | `/api/events` | Protected (Admin) | Create a new tournament or club event |
| `PUT` | `/api/events/:id` | Protected (Admin) | Update event information and deadlines |
| `POST` | `/api/events/:id/register` | Protected (Member) | Register for tournament (deadline enforced) |
| `DELETE` | `/api/events/:id/register` | Protected (Member) | Withdraw/cancel registration |

---

## 8. Membership Plans & Subscriptions (`/api/memberships` & `/api/membership-plans`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/membership-plans` | Public | List all active membership pricing tiers |
| `POST` | `/api/membership-plans` | Protected (Admin) | Create new membership tier |
| `PUT` | `/api/membership-plans/:id` | Protected (Admin) | Update membership plan benefits & pricing |
| `GET` | `/api/memberships/my` | Protected (Member) | Fetch member's current active membership |
| `POST` | `/api/memberships/checkout` | Protected (Member) | Server-side verified checkout & activation |
| `GET` | `/api/memberships` | Protected (Admin) | List all member subscription records |

---

## 9. Payments & Billing (`/api/payments`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/payments` | Protected (Admin) | View all club payment transactions |
| `GET` | `/api/payments/my` | Protected (Member) | View logged-in member's billing receipts |
| `POST` | `/api/payments/demo-checkout` | Protected (Member) | Process verified demo payment |
| `GET` | `/api/payments/:id` | Protected | View individual payment invoice |

---

## 10. Announcements (`/api/announcements`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/announcements` | Public / Protected | List club announcements targeted to role |
| `POST` | `/api/announcements` | Protected (Admin) | Publish new announcement |
| `PUT` | `/api/announcements/:id` | Protected (Admin) | Update announcement details & priority |
| `DELETE` | `/api/announcements/:id` | Protected (Admin) | Delete announcement |

---

## 11. Notifications (`/api/notifications`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/notifications` | Protected | List user notifications with unread count |
| `PATCH` | `/api/notifications/:id/read` | Protected | Mark single notification as read |
| `PATCH` | `/api/notifications/read-all` | Protected | Mark all user notifications as read |

---

## 12. Analytical Reports (`/api/reports`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/reports/dashboard` | Protected (Admin) | Live KPI metrics and dashboard charts |
| `GET` | `/api/reports/members` | Protected (Admin) | Member growth analytics (CSV export available) |
| `GET` | `/api/reports/bookings` | Protected (Admin) | Facility utilization report |
| `GET` | `/api/reports/payments` | Protected (Admin) | Revenue by month and plan |
| `GET` | `/api/reports/sports` | Protected (Admin) | Most popular sports participation stats |

---

## 13. Contact Inquiries (`/api/contact`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/contact` | Public | Submit contact inquiry message |
| `GET` | `/api/contact` | Protected (Admin) | List member & visitor inquiries |
| `PATCH` | `/api/contact/:id/status`| Protected (Admin) | Mark inquiry as answered or resolved |
