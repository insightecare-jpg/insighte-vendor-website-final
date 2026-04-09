# API Contracts

## Conventions

- All endpoints are prefixed `/api/v1/`
- Auth headers: `Authorization: Bearer <jwt>`
- Error response format: `{ error: { code: string, message: string } }`
- Success response format: `{ data: T, meta?: { page, total } }`

---

## Auth `/auth/`

| Method | Path | Role | Description |
|---|---|---|---|
| POST | `/auth/otp/request` | Public | Request OTP to phone |
| POST | `/auth/otp/verify` | Public | Verify OTP, return JWT |
| POST | `/auth/google` | Public | Google OAuth login |
| POST | `/auth/logout` | Any | Invalidate session |
| GET | `/auth/me` | Any | Get current user profile |

---

## Users `/users/`

| Method | Path | Role | Description |
|---|---|---|---|
| GET | `/users/me` | Any | Own user record |
| PATCH | `/users/me` | Any | Update own profile |
| GET | `/users/me/children` | Parent | List child profiles |
| POST | `/users/me/children` | Parent | Create child profile |
| PATCH | `/users/me/children/:id` | Parent | Update child profile |
| DELETE | `/users/me/children/:id` | Parent | Delete child profile |

---

## Providers `/providers/`

| Method | Path | Role | Description |
|---|---|---|---|
| GET | `/providers` | Public | List/search providers |
| GET | `/providers/:id` | Public | Provider public profile |
| POST | `/providers` | Provider | Create own profile |
| PATCH | `/providers/me` | Provider | Update own profile |
| GET | `/providers/me/availability` | Provider | Own availability slots |
| POST | `/providers/me/availability` | Provider | Add availability slot |
| DELETE | `/providers/me/availability/:id` | Provider | Remove slot |
| PATCH | `/providers/:id/approve` | Admin | Approve provider |
| PATCH | `/providers/:id/tier` | Admin | Assign tier |

---

## Search `/search/`

| Method | Path | Role | Description |
|---|---|---|---|
| GET | `/search/providers` | Public | Search providers with filters |

**Query Parameters:**
```
service, location, experience_min, experience_max,
price_min, price_max, category, mode, language,
gender, verified, age_group, sort, page, limit
```

---

## Bookings `/bookings/`

| Method | Path | Role | Description |
|---|---|---|---|
| POST | `/bookings` | Parent | Create draft booking |
| GET | `/bookings` | Parent/Provider | List own bookings |
| GET | `/bookings/:id` | Parent/Provider/Admin | Get booking detail |
| PATCH | `/bookings/:id/confirm` | System (post-payment) | Mark confirmed |
| PATCH | `/bookings/:id/cancel` | Parent/Provider/Admin | Cancel booking |
| PATCH | `/bookings/:id/reschedule` | Provider | Propose new slot |
| PATCH | `/bookings/:id/complete` | Provider/Admin | Mark completed |
| GET | `/bookings/:id/notes` | Parent/Provider/Admin | Get session notes |

---

## Payments `/payments/`

| Method | Path | Role | Description |
|---|---|---|---|
| POST | `/payments/order` | Parent | Create Razorpay order |
| POST | `/payments/webhooks/razorpay` | System | Razorpay webhook |
| GET | `/payments/:id/invoice` | Parent/Admin | Download invoice |
| POST | `/payments/:id/refund` | Admin | Initiate refund |

---

## Notes `/notes/`

| Method | Path | Role | Description |
|---|---|---|---|
| POST | `/notes` | Provider | Create note |
| GET | `/notes/:bookingId` | Parent/Provider/Admin | Get notes for booking |
| PATCH | `/notes/:id` | Provider | Update note |
| DELETE | `/notes/:id` | Provider/Admin | Delete note |

**Visibility rule enforced via RLS:**
- `is_private = false` → all roles with booking access
- `is_private = true` → provider (own) + admin only

---

## Reviews `/reviews/`

| Method | Path | Role | Description |
|---|---|---|---|
| POST | `/reviews` | Parent | Submit review |
| GET | `/reviews/provider/:providerId` | Public | Provider's public reviews |
| PATCH | `/reviews/:id/moderate` | Admin | Flag/approve review |

---

## Admin `/admin/`

| Method | Path | Role | Description |
|---|---|---|---|
| GET | `/admin/dashboard` | Admin | Ops overview stats |
| GET | `/admin/providers/pending` | Admin | Providers awaiting approval |
| PATCH | `/admin/providers/:id/approve` | Admin | Approve provider |
| PATCH | `/admin/providers/:id/reject` | Admin | Reject provider |
| GET | `/admin/bookings` | Admin | All bookings with filters |
| GET | `/admin/payments` | Admin | Payment and payout summary |
| POST | `/admin/refunds` | Admin | Issue refund |
| GET | `/admin/reviews/flagged` | Admin | Flagged reviews |
| GET | `/admin/tickets` | Admin | Support tickets |
