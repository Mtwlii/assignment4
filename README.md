# Assignment 4 — Node.js, Express, MySQL

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Update the MySQL credentials in `db.js` (host, user, password) to match your local MySQL setup.

3. Run the server:
   ```
   node server.js
   ```
   This automatically creates the `store_db` database and the `Products`, `Suppliers`, and `Sales` tables if they don't exist yet.

## Endpoints Overview

### Products
- `POST   /products`        — create a product
- `GET    /products`        — get all products
- `GET    /products/:id`    — get a product by ID
- `PUT    /products/:id`    — update a product
- `DELETE /products/:id`    — delete a product

### Suppliers
- `POST   /suppliers`       — create a supplier
- `GET    /suppliers`       — get all suppliers
- `PUT    /suppliers/:id`   — update a supplier
- `DELETE /suppliers/:id`   — delete a supplier

### Sales
- `POST   /sales`                      — record a sale
- `GET    /sales`                      — get all sales
- `GET    /sales/product/:productId`   — get sales for a specific product

### Schema modifications (Task 5)
- `POST   /schema/add-category`
- `DELETE /schema/remove-category`
- `PUT    /schema/contact-number-type`
- `PUT    /schema/productname-not-null`

### Seed data & specific updates (Tasks 6-8)
- `POST   /seed`                — inserts FreshFoods supplier, Milk/Bread/Eggs products, and the Milk sale
- `PUT    /products/bread/price` — sets Bread's price to 25.00
- `DELETE /products/eggs`        — deletes the Eggs product

### Reports (Tasks 9-13)
- `GET /reports/quantity-sold`         — total quantity sold per product
- `GET /reports/highest-stock`         — product with the highest stock
- `GET /reports/suppliers-starting-f`  — suppliers whose name starts with 'F'
- `GET /reports/never-sold`            — products that have never been sold
- `GET /reports/sales-details`         — all sales joined with product name

### Admin / Permissions (Tasks 14-16)
- `POST /admin/create-store-manager`   — creates the `store_manager` MySQL user with SELECT, INSERT, UPDATE
- `POST /admin/revoke-update`          — revokes UPDATE from `store_manager`
- `POST /admin/grant-delete-sales`     — grants DELETE on Sales only to `store_manager`

## Suggested test order

1. `POST /seed` (Task 6) — populates the initial data
2. Try the CRUD endpoints for Products/Suppliers/Sales
3. Try the schema modification endpoints
4. Try the report endpoints
5. Try the admin permission endpoints last (they create/modify a real MySQL user)

## Bonus

See `bonus.txt` for the LeetCode 1581 solution
("Customer Who Visited but Did Not Make Any Transactions").
