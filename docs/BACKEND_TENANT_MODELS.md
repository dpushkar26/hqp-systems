# Backend Tenant Models

The following Prisma models are tenant-specific and belong to a `Hotel` (they have a `hotelId` field). Access to these models should go through the `forHotel(hotelId)` Prisma extension to ensure data isolation.

- Customer
- Table
- Session
- MenuCategory
- MenuItem
- Order
- Invoice
- Payment
- RewardRule
- User
- NotificationLog
