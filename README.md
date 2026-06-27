# Sales Order Management Workshop App

A modern, dependency-free Sales Order Management app built for a one-day development workshop. It demonstrates the full business flow from customer and product setup to sales order creation, payment tracking, fulfillment status, invoice printing, and dashboard analytics.

## Live Demo

Try the deployed app here:

[https://sales-order-demo.onrender.com](https://sales-order-demo.onrender.com)

## Demo Login

| Role | Email | Password | Access |
| --- | --- | --- | --- |
| Admin | admin@example.com | admin123 | Dashboard, customers, products, orders, invoices |
| Sales User | sales@example.com | sales123 | Dashboard, orders, invoices |

## Project Purpose

This project is designed as a workshop-friendly business application. It keeps the technology simple while still showing realistic sales order workflows, role-based access, dashboard analytics, printable invoices, and modern UI patterns.

The app is ideal for:

- One-day web development workshops
- Beginner-friendly full workflow demonstrations
- Sales order process training
- Static frontend deployment practice
- Teaching local storage, CRUD workflows, and UI state management

## Tech Stack

| Area | Technology |
| --- | --- |
| Frontend | Vanilla HTML, CSS, and JavaScript |
| Framework | No frontend framework |
| Styling | Custom responsive CSS |
| Theme | Light and dark mode using CSS variables |
| Charts | CSS-based dashboard charts |
| State Management | Browser local storage |
| Backend | None |
| Database | Local storage demo data |
| Hosting | Render Static Site |
| Version Control | Git and GitHub |

## Core Features

### Authentication And Roles

- Login screen with demo accounts
- Admin and Sales User roles
- Role-based navigation
- Admin can manage customers and products
- Sales User can focus on sales orders and invoices

### Dashboard

- Total order count
- Open pipeline value
- Collected payment value
- Outstanding receivables
- Order status distribution chart
- Monthly sales chart
- Revenue by product category
- Payment status chart
- Stock risk list
- Recent orders table

### Customer Management

- Add, edit, delete, and view customers
- Search customers by name, company, phone, or email
- Customer fields include name, phone, email, address, company name, and tax ID

### Product Management

- Add, edit, delete, and view products
- Search products by name, SKU, or category
- Product fields include name, SKU, category, unit price, and stock quantity
- Low-stock products are visually highlighted

### Sales Orders

- Create and edit sales orders
- Select a customer
- Add multiple products to an order
- Set quantity, unit price, discount, tax, and notes
- Automatic subtotal, discount, tax, and grand total calculation
- Order statuses: Draft, Pending, Approved, Delivered, Cancelled
- Payment statuses: Unpaid, Partial, Paid
- Search and filter orders by status and date

### Order Detail View

- Customer summary
- Receivable amount
- Payment status
- Fulfillment lifecycle timeline
- Order item summary
- Quick status and payment updates
- Invoice and edit shortcuts

### Invoice And Print View

- Invoice-style sales order view
- Company information
- Customer information
- Order items and totals
- Notes and status
- Browser print support

### User Experience

- Modern business dashboard layout
- Responsive design
- Light mode and dark mode
- Persistent theme preference
- Clean cards, tables, badges, and modals
- Reset demo data option

## How To Run Locally

No installation is required.

1. Clone or download this repository.
2. Open `index.html` in a browser.
3. Log in with one of the demo accounts.

Optional local server:

```powershell
cd C:\Users\HP\Documents\practice
python -m http.server 8090
```

Then open:

```text
http://127.0.0.1:8090/
```

## Folder Structure

```text
sales-order-demo/
  index.html
  styles.css
  app.js
  README.md
  SALES_ORDER_APP_EPICS.md
```

## Data And Persistence

The app uses browser local storage for all demo data. This keeps the workshop setup simple and avoids backend or database configuration.

Stored data includes:

- Logged-in user session
- Customers
- Products
- Sales orders
- Payment status
- Theme preference

Use the `Reset Demo Data` button inside the app to restore the original sample data.

## Deployment

The app is deployed as a Render Static Site.

Live URL:

[https://sales-order-demo.onrender.com](https://sales-order-demo.onrender.com)

Render deployment settings:

| Setting | Value |
| --- | --- |
| Service Type | Static Site |
| Repository | `https://github.com/IftekherFahim27/sales-order-demo` |
| Branch | `main` |
| Build Command | `echo No build needed` |
| Publish Directory | `.` |

## Workshop Learning Outcomes

By studying or building this app, learners can practice:

- Designing a business workflow
- Building CRUD screens
- Managing app state in local storage
- Creating calculated forms
- Building dashboard metrics
- Creating CSS-only charts
- Implementing role-based UI behavior
- Designing modals and printable views
- Deploying a static app to Render

## Current Epic Coverage

- Epic 1: Authentication and role access
- Epic 2: Dashboard
- Epic 3: Customer management
- Epic 4: Product management
- Epic 5: Sales order management
- Epic 6: Invoice and print view
- Epic 7: Search and filters
- Epic 8: Sample data
- Epic 9: Business UI foundation

## Suggested Future Improvements

- Real backend API
- Database persistence with PostgreSQL, SQLite, Supabase, or Firebase
- PDF export
- Stock deduction after delivery
- Customer credit limits
- Approval workflow
- Audit history
- Multi-user account management
- Import and export CSV
- Email invoice sharing

