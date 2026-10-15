# ecommerce-app


A REST API for an e-commerce store, built with Node.js, Express, TypeScript and MongoDB. It covers authentication, a product catalog, a shopping cart and transactional order creation.

> **Status:** backend through orders is complete. Payments (Razorpay) are designed but not yet implemented. A React frontend is planned.

## Features

- **Auth:** register, login with a JWT stored in an httpOnly cookie, role-based access (`user` / `admin`)
- **Catalog:** category and product CRUD (admin only), public product listing with pagination
- **Cart:** add, update quantity and remove items, with totals calculated on the server
- **Orders:** checkout converts the cart into an order inside a MongoDB transaction, with an atomic stock decrement
- **Order history:** paginated list of your own orders, and a single-order lookup scoped to the owner

## Tech stack

| Layer | Choice |
|---|---|
| Runtime | Bun / Node.js, TypeScript |
| Server | Express |
| Database | MongoDB Atlas + Mongoose |
| Validation | Zod |
| Auth | JWT, bcrypt, httpOnly cookies |
| API testing | Hoppscotch |

## Getting started

### Prerequisites

- Bun (or Node.js 18+)
- A MongoDB Atlas cluster. A replica set is required because checkout uses transactions, so a standalone local MongoDB will not work.

### Setup

```bash
git clone <repo-url>
cd <project-folder>
bun install
```

Create a `.env` file:

```
PORT=3000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/ecommerceapp
SECRET=<a long random string>
NODE_ENV=development
```

Include the database name at the end of `MONGO_URI`, otherwise Mongoose writes to a database called `test`.

Start the server:

```bash
bun run dev
```

## API overview

Paths are shown relative to the server root. Routes marked **auth** need the login cookie, and routes marked **admin** also need the `admin` role.

### Auth

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/register` | public | Create an account |
| POST | `/login` | public | Log in and receive the auth cookie |

### Categories

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/categories` | public | List categories |
| POST | `/categories` | admin | Create a category |
| PUT | `/categories/:id` | admin | Update a category |
| DELETE | `/categories/:id` | admin | Delete a category |

### Products

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/products` | public | Paginated list of active products (`?page=1&limit=12`) |
| GET | `/products/:slug` | public | One product |
| POST | `/products` | admin | Create a product |
| PUT | `/products/:id` | admin | Update a product |
| DELETE | `/products/:id` | admin | Delete a product |

### Cart

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/cart` | auth | Cart with current prices, line totals and a total |
| POST | `/cart/items` | auth | Add a product (`product_id`, `quantity`) |
| PUT | `/cart/items/:productId` | auth | Set a line's quantity |
| DELETE | `/cart/items/:productId` | auth | Remove one line |
| DELETE | `/cart` | auth | Clear the cart |

### Orders

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/orders` | auth | Create an order from the cart (body: `shippingAddress`) |
| GET | `/orders` | auth | Your orders, newest first (`?page=1&limit=10`) |
| GET | `/order/:id` | auth | One of your orders |

Example checkout body:

```json
{
  "shippingAddress": {
    "name": "Surya",
    "line1": "12 Example Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "phone": "9999999999"
  }
}
```

## Data model

| Collection | Key fields | Notes |
|---|---|---|
| users | name, email, password hash, role | Email is unique |
| categories | name, slug | Slug is unique |
| products | title, slug, description, price, stock, images, category, isActive | Price is an integer in paise. Category is a reference. |
| carts | user, items (product, quantity) | One cart per user. No prices stored. |
| orders | user, items, total, shippingAddress, status, paymentId | Items are snapshots of title and price at purchase time |

Order status values: `pending`, `paid`, `shipped`, `delivered`, `cancelled`.

## Design decisions

**Prices are integers in paise.** Floating-point money causes rounding errors. The model rejects decimals for price, stock and quantity.

**The server is the authority on prices.** The cart stores only a product id and a quantity. Prices are read from the product on every request, and a client can never send a price or a total.

**Orders snapshot title and price.** Each order line copies the product's title and price at purchase time, so editing a product later never changes what a past customer paid.

**Checkout is all-or-nothing.** `POST /orders` runs inside a MongoDB transaction. For each cart line it decrements stock with a conditional update (`stock >= quantity`), builds the order, and deletes the cart. If any item is unavailable, the whole transaction rolls back and no stock is lost.

**Stock updates are atomic.** Checking and decrementing stock is one operation, so two buyers cannot both take the last item. The transaction guarantees the other writes do not survive a failure, and the atomic update is what prevents overselling.

**Order access is scoped to the owner.** Looking up another user's order returns 404, the same response as a missing order, so order ids cannot be probed.

**Login does not reveal which part was wrong.** A wrong email and a wrong password return the same response.

## Known limitations and planned work

- **Payments are not implemented.** Orders are created as `pending`. Razorpay integration (create payment, verify signature, webhook) is planned.
- **Stock is held for unpaid orders.** Stock is taken when the order is created. Once payments exist, unpaid orders should expire and return their stock.
- **No automated tests yet.** Planned: tests for the checkout rollback, auth protection and payment webhook idempotency.
- **Errors are handled per route.** A central error handler is planned.
- **No frontend yet.** A React frontend is planned.
- **Cookie settings are development-friendly.** `sameSite: 'strict'` and `secure` tied to `NODE_ENV` will need revisiting when the API and frontend are deployed on separate domains.

## Roadmap

- [x] Authentication and role-based access
- [x] Categories and products
- [x] Cart
- [x] Orders with transactional stock handling
- [ ] React frontend
- [ ] Payments (Razorpay)
- [ ] Tests
- [ ] Central error handling, rate limiting, security headers
- [ ] Deployment