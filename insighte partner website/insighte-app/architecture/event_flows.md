# Event Flows

## Architecture Principle
All critical events are published to an event queue. Notifications, analytics, and secondary service updates are triggered by consuming these events — they are **never hardcoded inside booking or payment logic**.

---

## Core Event Map

| Event | Published By | Consumed By |
|---|---|---|
| `booking.created` | Booking Service | Notification Service, Analytics |
| `payment.initiated` | Payment Service | Analytics |
| `payment.success` | Payment Service (webhook) | Booking Service, Notification Service |
| `payment.failed` | Payment Service (webhook) | Notification Service |
| `booking.confirmed` | Booking Service | Notification Service, Analytics |
| `booking.cancelled` | Booking Service | Notification Service, Analytics |
| `booking.rescheduled` | Booking Service | Notification Service, Analytics |
| `session.completed` | Booking Service | Notes Service, Reviews Service, Notification Service |
| `notes.published` | Notes Service | Notification Service |
| `review.submitted` | Reviews Service | Admin Service, Analytics |
| `provider.approved` | Admin Service | Notification Service |
| `refund.processed` | Payment Service | Notification Service, Analytics |

---

## End-to-End Parent Booking Flow

```mermaid
sequenceDiagram
    autonumber
    actor Parent
    participant App as Parent App
    participant Search as Search Service
    participant Booking as Booking Service
    participant Payment as Payment Service
    participant Notify as Notification Service
    participant Provider as Provider App
    participant Notes as Session Notes Service

    Parent->>App: Search by service, location, experience
    App->>Search: Fetch providers + filters
    Search-->>App: Ranked provider list
    Parent->>App: Open provider profile
    Parent->>App: Select slot and mode
    App->>Booking: Create provisional booking
    Booking-->>App: Booking draft + payable amount
    Parent->>App: Confirm and pay
    App->>Payment: Initiate first-session payment
    Payment-->>App: Payment success (client)
    Payment->>Booking: payment.success event via webhook
    Booking->>Notify: booking.confirmed event
    Notify->>Provider: Push / WhatsApp / email alert
    Notify->>Parent: Confirmation + reminder
    Provider->>Provider: Conduct session online/offline
    Provider->>Notes: Add public and private notes
    Notes->>Notify: notes.published event
    Notify->>Parent: Session summary available
```

---

## Provider Onboarding Flow

```mermaid
flowchart LR
    A[Provider signs up] --> B[Complete KYC and profile]
    B --> C[Admin review]
    C -->|Approved| D[Set services, price, availability]
    C -->|Rejected or Changes required| B
    D --> E[Receive booking notification]
    E --> F[Accept / reschedule / decline]
    F --> G[Conduct session]
    G --> H[Add public notes]
    G --> I[Add private notes]
    H --> J[Parent views session summary]
    I --> K[Private storage with audit trail]
    J --> L[Review request sent to parent]
```

---

## Admin Ops Flow

```mermaid
flowchart TB
    P1[Provider application submitted] --> P2[Ops verifies docs]
    P2 --> P3{Eligible?}
    P3 -->|Yes| P4[Assign category: Partner / Independent / Royale]
    P4 --> P5[Publish profile]
    P3 -->|No| P6[Reject or request edits]

    B1[Booking issue raised] --> B2[Support ticket created]
    B2 --> B3[Ops reviews payment, booking, notes]
    B3 --> B4{Resolution type}
    B4 -->|Refund| B5[Payment service executes refund]
    B4 -->|Reschedule| B6[Booking updated]
    B4 -->|Escalation| B7[Clinical or admin escalation]
```

---

## Notification Channel Strategy

| Event | Channel | Recipient |
|---|---|---|
| `booking.confirmed` | WhatsApp + Email | Parent, Provider |
| `booking.cancelled` | WhatsApp + Email | Parent, Provider |
| `booking.rescheduled` | WhatsApp | Parent |
| `payment.failed` | Email + Push | Parent |
| `session.completed` | Push | Parent (review prompt) |
| `notes.published` | Push + Email | Parent |
| `provider.approved` | Email | Provider |
| `refund.processed` | Email | Parent |

---

## Notes Visibility Flow

```
Provider writes note
    ├── is_private = false → visible to Parent, Provider, Admin
    └── is_private = true  → visible to Provider (own) + Admin only

RLS enforced at DB level:
    SELECT * FROM session_notes
    WHERE booking_id = :id
      AND (is_private = false
           OR (auth.uid() = provider_user_id)
           OR (auth.role() = 'admin'))
```

---

## Reminder / Nudge Events

| Trigger | Timing | Action |
|---|---|---|
| Session starts in 24h | -24h from `scheduled_at` | Push to parent + provider |
| Session starts in 1h | -1h from `scheduled_at` | WhatsApp to parent |
| Notes not submitted | +48h after `session.completed` | Nudge to provider |
| Review not submitted | +72h after `session.completed` | Nudge to parent |
