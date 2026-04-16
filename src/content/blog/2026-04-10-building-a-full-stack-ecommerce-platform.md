---
title: "Building a Full-Stack E-Commerce Platform from Scratch"
tags: [NextJS, FastAPI, PostgreSQL, Docker, TypeScript, Ecommerce]
description: "A deep dive into building a single-vendor B2C e-commerce platform with Next.js 14, FastAPI, PostgreSQL — covering architecture, features, and deployment."
---

## The Project

I built a complete single-vendor B2C e-commerce platform — from storefront to admin panel, from product catalog to order tracking. The goal was to create a production-ready system that covers everything a small business would need to sell online in Europe: multi-language support, EUR pricing, shopping cart, checkout, order management, and inventory control.

The entire stack runs in a single Docker container for easy deployment.

**Source code:** [github.com/hongyusu/site-ecommerce](https://github.com/hongyusu/site-ecommerce)

## Architecture

```
┌────────────┐     ┌────────────┐     ┌────────────┐
│   Nginx    │────▶│  Next.js   │     │  FastAPI    │
│   :80      │     │  :3000     │     │  :8000      │
│            │────▶│            │────▶│             │
└────────────┘     └────────────┘     └──────┬──────┘
                                             │
                                    ┌────────┴────────┐
                                    │  PostgreSQL 15   │
                                    │  Redis 7         │
                                    └─────────────────┘
```

Nginx serves as the reverse proxy, routing requests to the Next.js frontend or the FastAPI backend. All services — Nginx, Next.js, FastAPI, PostgreSQL, and Redis — run in a single Docker container managed by supervisord.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React 18, TypeScript 5, Tailwind CSS |
| State | Zustand (client state), React Query (server state) |
| i18n | next-intl — Finnish, Swedish, English, Chinese |
| Backend | Python 3.12, FastAPI, SQLAlchemy 2.0, Alembic |
| Auth | JWT tokens with bcrypt password hashing |
| Database | PostgreSQL 15, Redis 7 (caching) |
| Email | Resend API (transactional emails) |
| Infrastructure | Docker, Nginx, supervisord |

## Storefront

The customer-facing storefront supports the full shopping journey.

### Homepage & Product Catalog

![Homepage](/images/ecommerce/1.png)

The homepage features a product grid with 39 products across 24 categories (8 top-level + 16 subcategories). Products can be searched with autocomplete, sorted by price/name/rating, and filtered by price range and stock availability.

### Product Detail & Variants

![Product Detail](/images/ecommerce/3.png)

Product pages show full details: images, descriptions, specifications, pricing, and stock status. Seven products support variants — sizes, storage options, or color selections — each with independent stock tracking.

![Product Variants in Chinese](/images/ecommerce/10.png)

The entire UI works in four languages. Here's the same product page in Chinese, demonstrating the i18n system built with next-intl and locale-prefixed routing (`/zh/products/...`).

### Shopping Cart & Checkout

![Shopping Cart](/images/ecommerce/8.png)

The cart validates stock in real-time — if a product goes out of stock or the requested quantity exceeds available inventory, the user is notified immediately. Coupon codes (WELCOME10, SUMMER20, FREESHIP, SAVE50) can be applied at this stage.

![Checkout](/images/ecommerce/7.png)

Checkout is a multi-step flow: select or add a shipping address, review the order summary, and confirm. Order confirmation emails are sent via the Resend API (or printed to console in development mode).

### Orders & Reviews

![Order Detail](/images/ecommerce/6.png)

Customers can view their order history with full details — items, quantities, prices, shipping address, and tracking information. Public order tracking is also available by order number + email (no login required).

![Reviews in Chinese](/images/ecommerce/9.png)

The review system supports ratings and text reviews. The database is seeded with 142 reviews across products. Customers can write their own reviews for products they've purchased.

## Admin Panel

The admin interface provides complete control over the store.

### Inventory Management

![Admin Inventory](/images/ecommerce/2.png)

Admins can view all products with stock levels, adjust inventory (+/- quantities), update pricing, and toggle product visibility. Low-stock products are highlighted.

### Order Management

![Admin Orders](/images/ecommerce/4.png)

Order management shows all customer orders with status tracking. Admins can update order status (pending → processing → shipped → delivered) and add tracking numbers. The dashboard also includes KPIs and analytics — revenue trends, top products, and order distribution.

### User Management

![Admin Users](/images/ecommerce/5.png)

User management allows viewing all registered customers, searching by name or email, and toggling account active status. The system supports role-based access: regular users see the storefront, admins see both storefront and admin panel.

## Key Technical Decisions

**Next.js App Router over Pages Router.** The App Router's server components reduced client-side JavaScript significantly. Locale-prefixed routing (`/fi/`, `/sv/`, `/en/`, `/zh/`) was cleaner to implement with the App Router's nested layout system.

**Zustand + React Query instead of Redux.** Zustand handles client state (auth, cart, wishlist) with minimal boilerplate. React Query manages all server state with automatic caching, refetching, and optimistic updates. No Redux complexity needed.

**FastAPI over Express/Node.** Python's ecosystem for data operations (SQLAlchemy, Alembic, Pydantic) is more mature than the Node equivalent. FastAPI's automatic OpenAPI docs and Pydantic validation eliminated a lot of manual work.

**Single Docker container.** For a small B2C site, splitting into microservices adds operational complexity without benefit. Supervisord manages all five processes (Nginx, Next.js, FastAPI, PostgreSQL, Redis) in one container. One `docker run` to deploy.

**Resend for email.** Simple API, generous free tier (100 emails/day), and good deliverability. The system gracefully degrades to console logging when no API key is configured.

## Database

11 tables covering the complete e-commerce domain:

- `users` — accounts with roles (customer/admin)
- `products`, `product_images`, `product_variants` — catalog with variant support
- `categories` — hierarchical (parent/child)
- `product_reviews` — ratings + text reviews
- `carts`, `cart_items` — persistent shopping cart
- `orders`, `order_items` — order history with status tracking
- `addresses` — saved shipping addresses
- `coupons` — discount codes with usage limits
- `wishlist_items` — save for later

Migrations managed by Alembic. The seed script creates a complete demo store on first boot — 39 products, 24 categories, 142 reviews, 6 users, and 4 coupon codes.

## API Design

The backend exposes 35+ REST endpoints under `/api/v1/`, organized by domain:

- **Auth** — register, login, email verification, password reset
- **Products** — CRUD, search autocomplete, reviews
- **Cart** — add/update/remove items with stock validation
- **Orders** — create, track, admin status updates
- **Inventory** — stock adjustment, pricing, toggle visibility
- **Coupons** — validation and CRUD
- **Admin** — user management, analytics

All endpoints use Pydantic models for request/response validation. JWT tokens handle authentication, with role-based middleware separating customer and admin access.

## Deployment

The all-in-one Docker container makes deployment straightforward:

```bash
docker build -f Dockerfile.allinone -t ecommerce .
docker run -d -p 80:80 ecommerce
```

The entrypoint script automatically runs database migrations and seeds demo data on first boot. For persistent data, mount volumes for PostgreSQL and Redis.

## What I'd Do Differently

**Payment integration.** The current version stops at order creation — no Stripe or payment processing. This is the biggest gap for production use.

**Image CDN.** Product images are served from the same container. A CDN (Cloudflare, Vercel Image Optimization) would improve performance significantly.

**Testing.** The API has good coverage through manual testing and the seed data, but automated integration tests would make the system more maintainable.

**Search.** The current search is SQL LIKE queries. For a larger catalog, Elasticsearch or Meilisearch would provide better relevance and performance.

## Technical Stack

- Next.js 14 (App Router) — frontend with SSR
- React 18 + TypeScript 5 — UI components
- Tailwind CSS — styling
- Zustand — client state management
- React Query — server state and caching
- next-intl — internationalization (4 languages)
- FastAPI — REST API backend
- SQLAlchemy 2.0 + Alembic — ORM and migrations
- PostgreSQL 15 — primary database
- Redis 7 — caching
- JWT + bcrypt — authentication
- Resend — transactional email
- Docker + supervisord — single-container deployment
- Nginx — reverse proxy
