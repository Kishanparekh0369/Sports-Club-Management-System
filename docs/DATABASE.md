# Elite Sports Club — Database Schema & Data Models

The system uses **MongoDB** as its primary NoSQL database with **Mongoose ODM** for schema definition, relationships, and validation.

---

## 1. Entity-Relationship Overview

```
User (Member / Admin)
 ├── 1:N ──> Booking (sport, facility, date, timeSlot)
 ├── 1:N ──> Membership (plan, startDate, endDate, status)
 ├── 1:N ──> Payment (amount, method, reference, type)
 ├── 1:N ──> Notification (title, message, isRead)
 └── M:N ──> Event (tournament participants)

Sport
 ├── 1:N ──> Facility (courts, arenas, pools)
 ├── M:N ──> Coach (specialized trainers)
 └── 1:N ──> Event (tournaments & leagues)

MembershipPlan
 └── 1:N ──> Membership (subscribed members)
```

---

## 2. Collections & Field Specifications

### 1. `users`
- `_id`: ObjectId
- `name`: String, required, trim, max 100 chars
- `email`: String, required, unique, lowercase, regex validated
- `phone`: String, required, trim
- `password`: String, select: false, hashed via bcryptjs (10 salt rounds)
- `role`: Enum `['member', 'admin']`, default: `'member'`
- `status`: Enum `['active', 'inactive']`, default: `'active'`
- `avatar`: String (URL)
- `bio`: String, max 300 chars
- `resetPasswordToken`: String, select: false
- `resetPasswordExpire`: Date, select: false
- `timestamps`: `createdAt`, `updatedAt`

### 2. `sports`
- `_id`: ObjectId
- `name`: String, required, unique, trim
- `category`: Enum `['Outdoor', 'Indoor', 'Racket', 'Aquatic', 'Fitness', 'Combat', 'Other']`
- `description`: String, required
- `image`: String (URL)
- `price`: Number, required (court/session fee)
- `capacity`: Number, default: 20
- `facilities`: Array of ObjectId refs to `Facility`
- `coaches`: Array of ObjectId refs to `Coach`
- `rules`: Array of Strings (safety regulations)
- `amenities`: Array of Strings
- `status`: Enum `['active', 'inactive']`

### 3. `coaches`
- `_id`: ObjectId
- `name`: String, required
- `email`: String, required, unique
- `phone`: String, required
- `specialization`: String, required
- `experience`: Number (years of experience)
- `bio`: String
- `photo`: String (URL)
- `rating`: Number (1.0 to 5.0)
- `certifications`: Array of Strings
- `status`: Enum `['active', 'inactive']`

### 4. `facilities`
- `_id`: ObjectId
- `name`: String, required, unique
- `description`: String
- `courtNumber`: String (e.g. "Centre Court", "Field A")
- `capacity`: Number, default: 10
- `openingHours`: `{ start: '06:00', end: '22:00' }`
- `availabilityStatus`: Enum `['available', 'maintenance', 'reserved']`
- `sport`: ObjectId ref to `Sport`
- `sportName`: String
- `image`: String (URL)

### 5. `bookings`
- `_id`: ObjectId
- `member`: ObjectId ref to `User`, required
- `sport`: ObjectId ref to `Sport`, required
- `facility`: ObjectId ref to `Facility`, required
- `date`: Date, required (no past dates permitted)
- `startTime`: String (`HH:mm`), required
- `endTime`: String (`HH:mm`), required
- `price`: Number, calculated server-side
- `status`: Enum `['pending', 'confirmed', 'cancelled', 'rejected', 'completed']`
- `notes`: String
- **Index**: Compound unique or conflict query on `{ facility: 1, date: 1, status: 1 }`

### 6. `membershipplans`
- `_id`: ObjectId
- `name`: String, required, unique
- `tagline`: String
- `durationMonths`: Number, required (1, 3, 6, 12)
- `price`: Number, required
- `benefits`: Array of Strings
- `badge`: String (e.g. "Flexible", "Recommended", "VIP")
- `isPopular`: Boolean, default: false
- `status`: Enum `['active', 'inactive']`

### 7. `memberships`
- `_id`: ObjectId
- `user`: ObjectId ref to `User`, required
- `plan`: ObjectId ref to `MembershipPlan`, required
- `planName`: String
- `startDate`: Date, required
- `endDate`: Date, required (computed server-side: startDate + durationMonths)
- `pricePaid`: Number, verified against plan on server
- `status`: Enum `['active', 'expired', 'cancelled']`
- `paymentReference`: String

### 8. `events`
- `_id`: ObjectId
- `title`: String, required, trim
- `description`: String, required
- `sport`: ObjectId ref to `Sport`, required
- `venue`: String, required
- `eventDate`: Date, required
- `startTime`: String, required
- `endTime`: String, required
- `registrationDeadline`: Date, required
- `capacity`: Number, required
- `prizePool`: String
- `registrationFee`: Number, default: 0
- `image`: String (URL)
- `status`: Enum `['upcoming', 'ongoing', 'completed', 'cancelled']`
- `participants`: Array of `{ user: ObjectId, registeredAt: Date, status: String }`

### 9. `payments`
- `_id`: ObjectId
- `paymentReference`: String, required, unique
- `member`: ObjectId ref to `User`, required
- `amount`: Number, required (validated on server)
- `currency`: String, default: `'USD'`
- `paymentMethod`: String (e.g. `'Credit Card (Demo)'`, `'PayPal (Demo)'`)
- `type`: Enum `['membership', 'booking', 'event', 'other']`
- `relatedId`: ObjectId
- `description`: String
- `status`: Enum `['completed', 'pending', 'failed', 'refunded']`
- `isDemo`: Boolean, default: true

### 10. `announcements`
- `_id`: ObjectId
- `title`: String, required
- `message`: String, required
- `audience`: Enum `['all', 'members', 'coaches']`
- `priority`: Enum `['low', 'medium', 'high']`
- `status`: Enum `['draft', 'published', 'archived']`
- `expiresAt`: Date
- `createdBy`: ObjectId ref to `User`

### 11. `notifications`
- `_id`: ObjectId
- `user`: ObjectId ref to `User`, required, indexed
- `title`: String, required
- `message`: String, required
- `type`: Enum `['system', 'booking', 'event', 'membership', 'payment']`
- `isRead`: Boolean, default: false
- `link`: String

### 12. `contactmessages`
- `_id`: ObjectId
- `name`: String, required
- `email`: String, required
- `phone`: String
- `subject`: String, required
- `message`: String, required
- `status`: Enum `['unread', 'read', 'replied']`
