# Sales Order Management App - Epic And User Story Plan

## Product Goal

Build a practical Sales Order Management app for a one-day development workshop. The app should demonstrate the full workflow of managing customers, products, sales orders, invoices, search, filtering, and simple role-based access.

## Target Users

- Admin: manages customers, products, and all sales orders.
- Sales User: creates, edits, views, and tracks sales orders.

## Suggested Workshop Tech Stack

- Frontend: React or Next.js
- Styling: Tailwind CSS
- Backend: Next.js API routes or Node.js with Express
- Database: Local JSON storage, SQLite, Supabase, or Firebase
- Authentication: Simple demo login with hardcoded users or local database users

## Sample Roles

| Role | Email | Password | Access |
| --- | --- | --- | --- |
| Admin | admin@example.com | admin123 | Dashboard, customers, products, orders, invoices |
| Sales User | sales@example.com | sales123 | Dashboard, orders, invoices |

## Epic 1: Authentication And Role Access

### Story 1.1: User Login

As a user, I want to log in with my email and password so that I can access the sales order system securely.

#### Acceptance Criteria

- User can open a login screen.
- User can enter email and password.
- Valid credentials redirect user to the dashboard.
- Invalid credentials show a clear error message.
- Logged-in user information is stored during the session.

#### Development Tasks

- Create login page.
- Create demo users.
- Add login validation.
- Store user session in local storage or app state.
- Add logout button.

### Story 1.2: Role-Based Navigation

As an admin, I want full access to customers, products, and sales orders so that I can manage business data.

As a sales user, I want limited access so that I can focus on creating and managing orders.

#### Acceptance Criteria

- Admin can access dashboard, customers, products, orders, and invoices.
- Sales User can access dashboard, orders, and invoices.
- Sales User cannot add, edit, or delete products and customers.
- Restricted pages show a permission message or redirect to dashboard.

#### Development Tasks

- Add role field to user data.
- Create protected route logic.
- Hide restricted navigation links by role.
- Add permission checks before create, update, and delete actions.

## Epic 2: Dashboard

### Story 2.1: Sales Summary Dashboard

As a user, I want to see sales order statistics so that I can quickly understand business activity.

#### Acceptance Criteria

- Dashboard shows total number of sales orders.
- Dashboard shows counts for Draft, Pending, Approved, Delivered, and Cancelled orders.
- Dashboard shows total revenue from approved or delivered orders.
- Dashboard shows recent sales orders.
- Dashboard displays at least one simple chart or visual summary.

#### Development Tasks

- Create dashboard page.
- Calculate order counts by status.
- Calculate total revenue.
- Build recent orders table.
- Add simple chart using cards, progress bars, or a chart library.

## Epic 3: Customer Management

### Story 3.1: View Customer List

As an admin, I want to view all customers so that I can manage customer information.

#### Acceptance Criteria

- Customer list displays name, phone, email, company name, and tax ID.
- Customer list supports basic search by name, company, phone, or email.
- Empty state is shown when no customers exist.

#### Development Tasks

- Create customers page.
- Create customer table.
- Add search input.
- Load sample customer data.

### Story 3.2: Add Customer

As an admin, I want to add a customer so that I can use the customer in sales orders.

#### Acceptance Criteria

- Admin can open an add customer form.
- Required fields are validated.
- New customer appears in the customer list.
- Customer is available when creating sales orders.

#### Customer Fields

- Name
- Phone
- Email
- Address
- Company Name
- Tax ID

#### Development Tasks

- Create customer form.
- Add form validation.
- Save customer data.
- Refresh customer list after save.

### Story 3.3: Edit And Delete Customer

As an admin, I want to edit or delete customer records so that customer information stays accurate.

#### Acceptance Criteria

- Admin can edit existing customer information.
- Admin can delete a customer.
- App confirms before deleting a customer.
- Deleted customer is removed from the customer list.

#### Development Tasks

- Add edit action.
- Add delete action.
- Add confirmation dialog.
- Update customer data store.

## Epic 4: Product Management

### Story 4.1: View Product List

As an admin, I want to view all products so that I can manage items available for sale.

#### Acceptance Criteria

- Product list displays product name, SKU, category, unit price, and stock quantity.
- Product list supports search by product name, SKU, or category.
- Low stock products are visually highlighted.

#### Development Tasks

- Create products page.
- Create product table.
- Add product search.
- Load sample product data.
- Add low stock indicator.

### Story 4.2: Add Product

As an admin, I want to add products so that sales users can include them in orders.

#### Acceptance Criteria

- Admin can add product name, SKU, category, unit price, and stock quantity.
- Unit price must be greater than or equal to zero.
- Stock quantity must be greater than or equal to zero.
- New product appears in the product list and order form.

#### Development Tasks

- Create product form.
- Add validation for price and quantity.
- Save product data.
- Refresh product list after save.

### Story 4.3: Edit And Delete Product

As an admin, I want to edit or delete products so that the product catalog stays current.

#### Acceptance Criteria

- Admin can edit product details.
- Admin can delete products.
- App confirms before deleting a product.
- Deleted product is no longer selectable in new sales orders.

#### Development Tasks

- Add edit product action.
- Add delete product action.
- Add delete confirmation.
- Update product data store.

## Epic 5: Sales Order Management

### Story 5.1: Create Sales Order

As a sales user, I want to create a sales order so that I can record a customer purchase.

#### Acceptance Criteria

- User can create a new sales order.
- User can select a customer.
- User can add one or more products.
- User can set quantity, unit price, discount, tax, and notes.
- App automatically calculates subtotal, discount, tax, and grand total.
- New order is saved with an order number and date.
- Default status is Draft or Pending.

#### Development Tasks

- Create sales order form.
- Add customer selector.
- Add product selector.
- Add dynamic order item rows.
- Add calculation logic.
- Save order data.
- Generate order number.

### Story 5.2: View Sales Orders

As a user, I want to view all sales orders so that I can track order activity.

#### Acceptance Criteria

- Order list displays order number, date, customer, status, and grand total.
- User can open order details.
- Recent orders appear first.
- Status is visually clear.

#### Development Tasks

- Create orders page.
- Create order table.
- Add status badges.
- Add order details view.

### Story 5.3: Edit Sales Order

As a user, I want to edit a sales order so that I can correct order details before delivery.

#### Acceptance Criteria

- User can edit customer, products, quantities, discount, tax, notes, and status.
- Totals recalculate after edits.
- Updated order details are saved.
- Delivered or Cancelled orders can be locked or show a warning before editing.

#### Development Tasks

- Reuse sales order form for edit mode.
- Load existing order data.
- Update calculation logic.
- Save edited order.

### Story 5.4: Update Order Status

As a user, I want to update order status so that the business can track progress.

#### Acceptance Criteria

- Available statuses are Draft, Pending, Approved, Delivered, and Cancelled.
- User can update status from order list or detail page.
- Dashboard counts update after status changes.
- Cancelled orders are excluded from revenue.

#### Development Tasks

- Add status dropdown.
- Update order status data.
- Refresh dashboard calculations.
- Apply revenue calculation rule.

## Epic 6: Invoice And Print View

### Story 6.1: Generate Invoice View

As a user, I want to view a sales order as an invoice so that I can share or print it for the customer.

#### Acceptance Criteria

- Invoice shows company information.
- Invoice shows customer information.
- Invoice shows order number, date, status, and notes.
- Invoice shows all order items with quantity, unit price, discount, tax, and line total.
- Invoice shows subtotal, total discount, tax, and grand total.

#### Development Tasks

- Create invoice page or modal.
- Add invoice layout.
- Add company profile section.
- Add order totals section.
- Link invoice view from order details.

### Story 6.2: Print Or Export Invoice

As a user, I want to print or export a sales order invoice so that I can keep a business record.

#### Acceptance Criteria

- User can click a Print button.
- Browser print dialog opens.
- Invoice layout is clean in print mode.
- Optional PDF export works if time allows.

#### Development Tasks

- Add print button.
- Add print-specific CSS.
- Hide navigation and action buttons while printing.
- Optional: add PDF export library.

## Epic 7: Search And Filters

### Story 7.1: Search Sales Orders

As a user, I want to search sales orders so that I can find specific orders quickly.

#### Acceptance Criteria

- User can search by order number.
- User can search by customer name.
- User can search by product name.
- Search results update clearly.

#### Development Tasks

- Add search input to orders page.
- Implement search across order number, customer, and product names.
- Add empty search result state.

### Story 7.2: Filter Sales Orders

As a user, I want to filter sales orders by status and date so that I can review relevant orders.

#### Acceptance Criteria

- User can filter by status.
- User can filter by start date and end date.
- User can clear all filters.
- Filtered totals remain accurate.

#### Development Tasks

- Add status filter.
- Add date range filter.
- Add clear filters button.
- Apply combined search and filter logic.

## Epic 8: Data And Sample Content

### Story 8.1: Seed Sample Data

As a workshop participant, I want sample customers, products, and orders so that I can test the app immediately.

#### Acceptance Criteria

- App includes at least 5 sample customers.
- App includes at least 8 sample products.
- App includes at least 5 sample sales orders with different statuses.
- Dashboard has useful data on first launch.

#### Development Tasks

- Create sample customer data.
- Create sample product data.
- Create sample order data.
- Load seed data on first app start.

### Sample Customers

| Name | Company | Phone | Email | Tax ID |
| --- | --- | --- | --- | --- |
| Sarah Ahmed | Bright Retail Ltd | +8801700000001 | sarah@brightretail.com | TAX-1001 |
| Rahim Khan | Khan Traders | +8801700000002 | rahim@khantraders.com | TAX-1002 |
| Nusrat Jahan | Urban Mart | +8801700000003 | nusrat@urbanmart.com | TAX-1003 |
| David Miller | Global Supply Co | +8801700000004 | david@globalsupply.com | TAX-1004 |
| Farhana Islam | Fresh Basket | +8801700000005 | farhana@freshbasket.com | TAX-1005 |

### Sample Products

| Product Name | SKU | Category | Unit Price | Stock |
| --- | --- | --- | --- | --- |
| Office Chair | CHR-001 | Furniture | 8500 | 20 |
| Work Desk | DSK-001 | Furniture | 14500 | 10 |
| Wireless Mouse | ACC-001 | Accessories | 1200 | 75 |
| Mechanical Keyboard | ACC-002 | Accessories | 4500 | 30 |
| LED Monitor 24 Inch | MON-001 | Electronics | 18500 | 15 |
| Laptop Stand | ACC-003 | Accessories | 2200 | 40 |
| Printer Paper Pack | STA-001 | Stationery | 650 | 120 |
| USB-C Hub | ACC-004 | Accessories | 3200 | 25 |

## Epic 9: UI And App Experience

### Story 9.1: Professional Business Layout

As a user, I want a clean business interface so that I can use the app comfortably during daily work.

#### Acceptance Criteria

- App has a consistent sidebar or top navigation.
- Pages use clear headings and actions.
- Tables are readable.
- Forms are easy to scan.
- Buttons and statuses use consistent colors.
- App works on desktop and tablet-sized screens.

#### Development Tasks

- Build main app layout.
- Add navigation.
- Create reusable table, form, button, status badge, and card components.
- Add responsive styles.

## MVP Priority

### Must Have For One-Day Workshop

- Login with Admin and Sales User
- Dashboard summary
- Customer CRUD for Admin
- Product CRUD for Admin
- Create, edit, and list sales orders
- Automatic order total calculation
- Status management
- Invoice print view
- Search and status filter
- Sample data

### Nice To Have If Time Allows

- PDF export
- Charts with a chart library
- Date range analytics
- Stock deduction after order approval or delivery
- Order activity timeline
- Dark mode
- Backend database persistence

## Suggested One-Day Workshop Schedule

| Time | Module | Outcome |
| --- | --- | --- |
| 09:00 - 09:30 | App overview and setup | Project runs locally |
| 09:30 - 10:30 | Layout and authentication | Login, roles, navigation |
| 10:30 - 11:30 | Sample data and dashboard | Summary cards and recent orders |
| 11:30 - 12:30 | Customer management | Customer list and form |
| 12:30 - 13:30 | Lunch | Break |
| 13:30 - 14:30 | Product management | Product list and form |
| 14:30 - 16:00 | Sales order workflow | Create, edit, calculate totals |
| 16:00 - 16:45 | Invoice and print view | Printable invoice |
| 16:45 - 17:15 | Search, filters, polish | Usable order tracking |
| 17:15 - 17:30 | Review and next steps | Deployment and improvement ideas |

## Recommended Folder Structure

```text
sales-order-app/
  src/
    app/
      login/
      dashboard/
      customers/
      products/
      orders/
      invoices/
    components/
      layout/
      ui/
      customers/
      products/
      orders/
      invoices/
    data/
      sample-customers.ts
      sample-products.ts
      sample-orders.ts
    lib/
      auth.ts
      calculations.ts
      storage.ts
      permissions.ts
    types/
      customer.ts
      product.ts
      order.ts
      user.ts
```

## Core Data Models

### User

```ts
type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "Admin" | "Sales User";
};
```

### Customer

```ts
type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  companyName: string;
  taxId: string;
};
```

### Product

```ts
type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  unitPrice: number;
  stockQuantity: number;
};
```

### Sales Order

```ts
type SalesOrder = {
  id: string;
  orderNumber: string;
  customerId: string;
  orderDate: string;
  status: "Draft" | "Pending" | "Approved" | "Delivered" | "Cancelled";
  items: SalesOrderItem[];
  notes?: string;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
};
```

### Sales Order Item

```ts
type SalesOrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  lineTotal: number;
};
```

## Definition Of Done

- App runs locally without errors.
- User can log in and log out.
- Role permissions work.
- Dashboard shows real calculations from order data.
- Admin can manage customers and products.
- User can create, edit, search, filter, and view sales orders.
- Invoice view is printable.
- Sample data is included.
- Setup instructions are documented.

