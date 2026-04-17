---
title: "Mall & More: Building a Full-Stack E-Commerce Platform"
tags: [NextJS, FastAPI, PostgreSQL, Docker, TypeScript, Ecommerce]
description: "A deep dive into building a single-vendor B2C e-commerce platform with Next.js 14, FastAPI, PostgreSQL — architecture, features, deployment, and 20 screenshots."
---

## The Project

Mall & More is a complete single-vendor B2C e-commerce platform — from storefront to admin panel, product catalog to order tracking. Built for the European market: multi-language (Finnish, Swedish, English, Chinese), EUR pricing, and a single Docker container deployment.

**Source code:** [github.com/hongyusu/site-ecommerce](https://github.com/hongyusu/site-ecommerce)

## Architecture

```
Browser  ->  Nginx (:80)  ->  Next.js (:3000)   # Frontend
                           ->  FastAPI (:8000)   # Backend API
                                   |
                              PostgreSQL (:5432)
                              Redis (:6379)
```

All services run in a single Docker container managed by supervisord. One `docker run` to deploy.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript 5, Tailwind CSS 3.4 |
| State | Zustand (client), React Query (server), Axios |
| i18n | next-intl — FI/SV/EN/ZH with locale-prefixed routes |
| Backend | FastAPI 0.109, Python 3.12, SQLAlchemy 2.0, Pydantic v2 |
| Auth | JWT (python-jose), bcrypt, role-based access |
| Database | PostgreSQL 15, Redis 7 |
| Email | Resend API (falls back to console logging) |
| Infrastructure | Docker, Nginx, supervisord, Docker Compose |

## Storefront

### Homepage & Product Catalog

![Homepage](/images/ecommerce/1.jpg)

The homepage features 39 products across 24 categories (8 top-level + 16 subcategories). Products can be searched with autocomplete, sorted by price/name/rating, and filtered by price range and stock availability.

![Product browsing](/images/ecommerce/0.jpg)

### Product Detail & Variants

![Product Detail](/images/ecommerce/3.jpg)

Product pages show images, descriptions, specifications, pricing, stock status, and customer reviews. Seven products support variants — sizes, storage options, or colors — each with independent stock tracking.

![Product Variants in Chinese](/images/ecommerce/10.jpg)

The full UI works in four languages. Here's the same product page in Chinese, demonstrating the i18n system with locale-prefixed routing (`/zh/products/...`).

### Shopping Cart & Checkout

![Shopping Cart](/images/ecommerce/8.jpg)

The cart validates stock in real-time — if a product goes out of stock or the requested quantity exceeds inventory, the user is notified immediately. Coupon codes (WELCOME10, SUMMER20, FREESHIP, SAVE50) can be applied.

![Checkout](/images/ecommerce/7.jpg)

Checkout is a multi-step flow: select or add a shipping address, review the order summary, and confirm. Order confirmation emails are sent via the Resend API.

### Orders & Tracking

![Order Detail](/images/ecommerce/6.jpg)

Customers can view order history with full details — items, quantities, prices, shipping address, and tracking information. Public order tracking is available by order number + email (no login required).

### Reviews & Wishlist

![Reviews in Chinese](/images/ecommerce/9.jpg)

The review system supports ratings and text reviews. The database is seeded with 142 reviews. Customers can also save products to their wishlist.

### More Storefront Views

![Storefront view](/images/ecommerce/11.jpg)

![Product grid](/images/ecommerce/12.jpg)

![Mobile responsive](/images/ecommerce/13.jpg)

![User profile](/images/ecommerce/14.jpg)

## Admin Panel

The admin interface provides complete control over the store.

### Dashboard & Analytics

![Admin Dashboard](/images/ecommerce/15.jpg)

The dashboard shows KPIs, revenue trends, top products, and order distribution at a glance.

### Inventory Management

![Admin Inventory](/images/ecommerce/2.jpg)

Admins can view all products with stock levels, adjust inventory (+/- quantities), update pricing, and toggle product visibility.

### Order Management

![Admin Orders](/images/ecommerce/4.jpg)

Order management shows all customer orders with status tracking. Admins can update order status (pending → processing → shipped → delivered) and add tracking numbers.

### User & Coupon Management

![Admin Users](/images/ecommerce/5.jpg)

User management allows viewing all registered customers, searching by name or email, and toggling account active status.

![Admin view](/images/ecommerce/16.jpg)

![Coupon management](/images/ecommerce/17.jpg)

### More Admin Views

![Admin analytics](/images/ecommerce/18.jpg)

![Admin detail](/images/ecommerce/19.jpg)

## Database

13 tables covering the complete e-commerce domain: `users`, `products`, `product_images`, `product_variants`, `product_reviews`, `categories`, `carts`, `cart_items`, `orders`, `order_items`, `addresses`, `coupons`, `wishlist_items`.

Migrations managed by Alembic. The seed script creates a complete demo store on first boot — 39 products, 24 categories, 29 variants, 142 reviews, 6 users, and 4 coupon codes.

## API Design

40+ REST endpoints under `/api/v1/`, organized by domain:

| Module | Endpoints | Key Routes |
|--------|-----------|------------|
| Auth | 7 | register, login, verify email, password reset |
| Products | 5 | list, autocomplete, CRUD, reviews |
| Cart | 5 | get, clear, add/update/remove items |
| Orders | 5 | create, list, detail, track, admin status |
| Inventory | 5 | list, stats, stock adjust, pricing, toggle |
| Coupons | 5 | CRUD, validate code |
| Addresses | 5 | CRUD |
| Variants | 3 | list, create, update |
| Admin | 3 | users, toggle active, analytics |

Full interactive documentation at `/docs` (Swagger UI).

## Key Technical Decisions

**Next.js App Router over Pages Router.** Server components reduced client-side JavaScript. Locale-prefixed routing (`/fi/`, `/sv/`, `/en/`, `/zh/`) was cleaner with the nested layout system.

**Zustand + React Query instead of Redux.** Zustand handles client state (auth, cart, wishlist) with minimal boilerplate. React Query manages server state with automatic caching and optimistic updates.

**FastAPI over Express/Node.** Python's SQLAlchemy + Alembic + Pydantic ecosystem is more mature for data operations. FastAPI's automatic OpenAPI docs eliminated manual API documentation.

**Single Docker container.** For a small B2C site, supervisord manages all five processes (Nginx, Next.js, FastAPI, PostgreSQL, Redis) in one container. One command to deploy.

**Docker Compose for development.** Multi-container setup with hot reload for both frontend and backend during development.

## Deployment

```bash
# All-in-one (production/demo)
docker build -f Dockerfile.allinone -t ecommerce .
docker run -d -p 80:80 ecommerce

# With persistent data
docker run -d -p 80:80 \
  -v ecommerce-pgdata:/var/lib/postgresql/15/main \
  -v ecommerce-redis:/var/lib/redis \
  ecommerce

# Development (hot reload)
docker compose up --build
```

The entrypoint script automatically runs database migrations and seeds demo data on first boot. No `.env` configuration required for demo — all environment variables have sensible defaults.

## What I'd Do Differently

**Payment integration.** No Stripe or payment processing yet — the biggest gap for production use.

**Image CDN.** Product images served from the same container. A CDN would improve performance.

**Search.** Currently SQL LIKE queries. Meilisearch or Elasticsearch would be better for a larger catalog.

**Testing.** Good coverage through manual testing and seed data, but automated integration tests would improve maintainability.

## Technical Stack

- Next.js 14 (App Router) — frontend with SSR
- TypeScript 5 + Tailwind CSS 3.4 — UI
- Zustand + React Query — state management
- next-intl — internationalization (4 languages)
- FastAPI 0.109 — REST API backend
- SQLAlchemy 2.0 + Alembic — ORM and migrations
- Pydantic v2 — request/response validation
- PostgreSQL 15 — primary database
- Redis 7 — caching
- JWT + bcrypt — authentication
- Resend — transactional email
- Docker + supervisord — single-container deployment
- Docker Compose — multi-container development
- Nginx — reverse proxy
