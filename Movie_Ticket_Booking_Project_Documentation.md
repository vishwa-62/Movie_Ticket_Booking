# Movie Ticket Booking Management Application

## Project Overview

The Movie Ticket Booking Management Application is a Pega-based case management application that automates the complete movie ticket booking lifecycle, from booking request and availability checking through customer confirmation, booking execution, resolution, and customer notification.

## Objectives

- Automate the movie ticket booking process.
- Maintain reusable Movie and Show data objects.
- Calculate total booking cost automatically.
- Capture customer confirmation before processing.
- Allocate seats and generate ticket information.
- Route bookings automatically based on Show Type.
- Apply SLA goals and deadlines.
- Notify customers automatically after successful booking.

## Case Lifecycle

Booking Request → Availability → Approval → Booking Execution → Case Resolution → Customer Notification

## Reusable Data Objects

### Movie
- Movie Name
- Genre

### Show
- Show Date
- Show Time
- Seat Capacity
- Show Type

These reusable data objects are associated with the Movie Ticket Request case type.

## Availability Stage

The Availability stage validates show and seat availability.

### Booking Cost Calculation

Total Cost = Ticket Price × Number of Tickets

The calculated Total Cost is stored in the case for review and further processing.

## Customer Approval

The Approval stage captures customer confirmation.

The customer reviews:
- Movie Name
- Show Timing
- Number of Tickets
- Total Cost

The Booking Status property records the customer's decision.

Confirmed bookings proceed to ticket processing. Cancelled requests are resolved without further action.

## Booking Execution

The Booking Execution stage handles final booking activities.

Properties maintained:
- Booking Confirmation Status
- Seat Numbers
- Ticket ID

Seats are allocated and booking information is recorded for tracking.

## Automatic Queue Routing

Business logic routes bookings based on Show Type:

Show Type = Premium → PremiumShowQueue

All other Show Types → StandardShowQueue

This routing is automated without manual intervention.

## SLA Configuration

A Custom SLA is configured for the Movie Ticket Request case.

- Calculate time from: This case
- Goal: 1 day
- Deadline: 2 days
- Deadline urgency increase: 10

The goal and deadline are measured from case creation. Missing the goal flags the case as approaching the deadline, while missing the deadline increases case urgency.

## Customer Correspondence

An automated email notification is configured for the Customer after successful booking completion.

### Subject

Movie Ticket Booking Confirmed

### Email

Dear [Customer Name],

Your movie ticket booking has been successfully confirmed.

Case ID: [Case ID]
Movie Name: [Movie Name]
Show Date & Time: [Show Date] [Show Time]
Number of Tickets: [Number of Tickets]
Seat Numbers: [Seat Numbers]
Total Cost: [Total Cost]

Please arrive at the theatre before show time and present your booking details at entry.

Thank you for choosing our services.
Enjoy your movie!

— CineWave Entertainment Booking Support Team

## Important Case Properties

| Property | Purpose |
|---|---|
| Movie Name | Selected movie |
| Genre | Movie category |
| Show Date | Date of the show |
| Show Time | Time of the show |
| Show Type | Premium / Standard |
| Seat Capacity | Available capacity |
| Ticket Price | Price per ticket |
| Number of Tickets | Tickets requested |
| Total Cost | Calculated booking cost |
| Booking Status | Customer decision |
| Booking Confirmation Status | Final booking status |
| Seat Numbers | Allocated seats |
| Ticket ID | Generated ticket identifier |

## Key Business Rules

### Total Cost
Total Cost = Ticket Price × Number of Tickets

### Queue Routing
Premium Show → PremiumShowQueue
Other Shows → StandardShowQueue

## Automation

The application automates:
- Booking cost calculation
- Customer approval processing
- Seat allocation
- Ticket ID generation
- Work queue routing
- SLA tracking
- Customer email notification

## End-to-End Flow

Customer submits booking request
→ Booking Request
→ Availability
→ Calculate Total Cost
→ Customer Review
→ Customer Approval
→ Confirmed / Cancelled
→ Booking Execution
→ Allocate Seats
→ Generate Ticket
→ Route based on Show Type
→ Case Completion
→ Automated Email
→ Customer receives booking details

## Technology

- Pega Platform
- Pega App Studio
- Case Management
- Business Rules
- Service-Level Agreement (SLA)
- Work Queues
- Automated Correspondence
- Reusable Data Objects

## Benefits

- Faster ticket booking processing
- Reduced manual intervention
- Accurate booking cost calculation
- Automated queue assignment
- Better SLA monitoring
- Improved customer visibility
- Consistent booking notifications
- Centralized case tracking

## Conclusion

The Movie Ticket Booking Management Application provides an automated end-to-end solution for managing movie ticket requests using Pega case management, business rules, SLA configuration, automated routing, reusable data objects, and customer correspondence.
