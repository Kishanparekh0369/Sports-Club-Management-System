# Elite Sports Club — Testing Documentation

This document describes the testing strategy, test suite coverage, and instructions for running automated tests for the **Elite Sports Club Management System**.

---

## 1. Test Architecture & Stack

- **Test Runner**: Jest (`v29.7.0`)
- **API Testing**: Supertest (`v7.0.0`)
- **Environment**: Node.js (`cross-env NODE_ENV=test`)
- **Database**: Dedicated test database (`elite_sports_club_test`), ensuring that development/seed data is untouched.
- **Teardown**: Automated cleanup in `afterAll` hook to prevent test pollution.

---

## 2. Test Suites & Assertions

All tests are located in `server/tests/api.test.js`.

### Suite 1: Health Check & Public Endpoints
- `GET /api/health`: Verifies backend service status returns `healthy` with HTTP 200.
- `GET /api/sports`: Verifies public sports catalogue returns an array of sports.

### Suite 2: Authentication & Authorization Security
- `POST /api/auth/register`: Verifies member registration returns HTTP 201 with default role `member`.
- `POST /api/auth/register` (Duplicate): Verifies rejection of duplicate email with HTTP 400.
- `POST /api/auth/login` (Invalid Credentials): Verifies invalid password rejection with HTTP 401.
- `GET /api/members` (Member Token): Verifies member cannot access admin endpoint; returns HTTP 403 Forbidden.
- `GET /api/members` (Admin Token): Verifies administrator successfully accesses admin-only endpoint with HTTP 200.

### Suite 3: Booking Management & Conflict Prevention
- `POST /api/bookings` (Valid Slot): Verifies successful reservation of an open court/time slot.
- `POST /api/bookings` (Overlapping Slot): Verifies backend conflict detection rejects overlapping reservation for the same facility on the same date with HTTP 400.

### Suite 4: Tournament & Event Registration Constraints
- `POST /api/events/:id/register`: Verifies authenticated member registration in upcoming tournament.
- `POST /api/events/:id/register` (Duplicate): Verifies backend constraint preventing duplicate registration by the same member; returns HTTP 400.

### Suite 5: Membership Checkout & Server-Side Price Verification
- `POST /api/memberships/checkout`: Verifies server-side price calculation. Even if a malicious client sends `amount: 1`, the server calculates the true plan price ($39) from MongoDB and records the correct payment amount.

---

## 3. Running the Test Suite

From the root project directory:

```bash
npm run test
```

Or run directly inside the `server/` directory:

```bash
cd server
npm test
```

### Expected Output

```
PASS tests/api.test.js
  1. Health Check & Public Endpoints
    √ GET /api/health should return status healthy
    √ GET /api/sports should return sports array
  2. Authentication & Authorization Security
    √ should register a new member successfully
    √ should reject duplicate email registration
    √ should reject login with wrong password
    √ should prevent member from accessing admin-only routes
    √ should allow admin to access admin-only routes
  3. Booking Management & Conflict Prevention
    √ should allow member to book an available slot
    √ should REJECT overlapping booking for the same facility and date
  4. Event Registration Constraints
    √ should allow member to register for an upcoming event
    √ should REJECT duplicate event registration by same member
  5. Membership Checkout & Server-Side Price Verification
    √ should verify plan and activate membership calculating price server-side

Test Suites: 1 passed, 1 total
Tests:       12 passed, 12 total
Snapshots:   0 total
Time:        ~38-40s
Ran all test suites.
```
