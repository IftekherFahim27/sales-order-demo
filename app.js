const USERS = [
  { id: "u1", name: "Workshop Admin", email: "admin@example.com", password: "admin123", role: "Admin" },
  { id: "u2", name: "Sales User", email: "sales@example.com", password: "sales123", role: "Sales User" },
];

const STORAGE_KEY = "sales-order-workshop-state-v1";
const SESSION_KEY = "sales-order-workshop-user-v1";
const THEME_KEY = "sales-order-workshop-theme-v1";
const STATUSES = ["Draft", "Pending", "Approved", "Delivered", "Cancelled"];
const STATUS_COLORS = {
  Draft: "#94a3b8",
  Pending: "#f59e0b",
  Approved: "#2563eb",
  Delivered: "#16a34a",
  Cancelled: "#ef4444",
};

const seedState = {
  customers: [
    { id: "c1", name: "Sarah Ahmed", phone: "+8801700000001", email: "sarah@brightretail.com", address: "Banani, Dhaka", companyName: "Bright Retail Ltd", taxId: "TAX-1001" },
    { id: "c2", name: "Rahim Khan", phone: "+8801700000002", email: "rahim@khantraders.com", address: "Agrabad, Chattogram", companyName: "Khan Traders", taxId: "TAX-1002" },
    { id: "c3", name: "Nusrat Jahan", phone: "+8801700000003", email: "nusrat@urbanmart.com", address: "Dhanmondi, Dhaka", companyName: "Urban Mart", taxId: "TAX-1003" },
    { id: "c4", name: "David Miller", phone: "+8801700000004", email: "david@globalsupply.com", address: "Gulshan, Dhaka", companyName: "Global Supply Co", taxId: "TAX-1004" },
    { id: "c5", name: "Farhana Islam", phone: "+8801700000005", email: "farhana@freshbasket.com", address: "Sylhet Sadar, Sylhet", companyName: "Fresh Basket", taxId: "TAX-1005" },
  ],
  products: [
    { id: "p1", name: "Office Chair", sku: "CHR-001", category: "Furniture", unitPrice: 8500, stockQuantity: 20 },
    { id: "p2", name: "Work Desk", sku: "DSK-001", category: "Furniture", unitPrice: 14500, stockQuantity: 10 },
    { id: "p3", name: "Wireless Mouse", sku: "ACC-001", category: "Accessories", unitPrice: 1200, stockQuantity: 75 },
    { id: "p4", name: "Mechanical Keyboard", sku: "ACC-002", category: "Accessories", unitPrice: 4500, stockQuantity: 30 },
    { id: "p5", name: "LED Monitor 24 Inch", sku: "MON-001", category: "Electronics", unitPrice: 18500, stockQuantity: 15 },
    { id: "p6", name: "Laptop Stand", sku: "ACC-003", category: "Accessories", unitPrice: 2200, stockQuantity: 40 },
    { id: "p7", name: "Printer Paper Pack", sku: "STA-001", category: "Stationery", unitPrice: 650, stockQuantity: 120 },
    { id: "p8", name: "USB-C Hub", sku: "ACC-004", category: "Accessories", unitPrice: 3200, stockQuantity: 25 },
  ],
  orders: [],
};

seedState.orders = [
  makeOrder("SO-1001", "c1", "Approved", "2026-06-20", [{ productId: "p1", quantity: 4 }, { productId: "p3", quantity: 8 }], "Office setup order"),
  makeOrder("SO-1002", "c2", "Pending", "2026-06-21", [{ productId: "p5", quantity: 2 }], "Waiting for approval"),
  makeOrder("SO-1003", "c3", "Delivered", "2026-06-22", [{ productId: "p7", quantity: 20 }, { productId: "p8", quantity: 5 }], "Delivered to retail branch"),
  makeOrder("SO-1004", "c4", "Draft", "2026-06-23", [{ productId: "p2", quantity: 3 }, { productId: "p6", quantity: 6 }], ""),
  makeOrder("SO-1005", "c5", "Cancelled", "2026-06-24", [{ productId: "p4", quantity: 5 }], "Customer postponed purchase"),
];

let state = loadState();
let currentUser = loadSession();
let currentPage = "dashboard";
let modal = null;
let currentTheme = localStorage.getItem(THEME_KEY) || "light";
applyTheme();

function makeOrder(orderNumber, customerId, status, orderDate, rawItems, notes) {
  const items = rawItems.map((raw) => {
    const product = seedState.products.find((item) => item.id === raw.productId);
    return calculateLine({
      productId: product.id,
      productName: product.name,
      quantity: raw.quantity,
      unitPrice: product.unitPrice,
      discount: raw.discount || 0,
      tax: raw.tax || 5,
    });
  });
  const totals = calculateTotals(items);
  return {
    id: crypto.randomUUID(),
    orderNumber,
    customerId,
    orderDate,
    status,
    items,
    notes,
    ...totals,
  };
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedState));
    return structuredClone(seedState);
  }
  return JSON.parse(saved);
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadSession() {
  const saved = localStorage.getItem(SESSION_KEY);
  return saved ? JSON.parse(saved) : null;
}

function saveSession(user) {
  currentUser = user;
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function applyTheme() {
  document.documentElement.dataset.theme = currentTheme;
}

function toggleTheme() {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_KEY, currentTheme);
  applyTheme();
  render();
}

function money(value) {
  return new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(value || 0);
}

function byId(id) {
  return document.getElementById(id);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[char]);
}

function canManageMasterData() {
  return currentUser?.role === "Admin";
}

function calculateLine(item) {
  const quantity = Number(item.quantity) || 0;
  const unitPrice = Number(item.unitPrice) || 0;
  const discount = Number(item.discount) || 0;
  const tax = Number(item.tax) || 0;
  const base = quantity * unitPrice;
  const discountAmount = base * (discount / 100);
  const taxable = base - discountAmount;
  const taxAmount = taxable * (tax / 100);
  return {
    ...item,
    quantity,
    unitPrice,
    discount,
    tax,
    lineTotal: Math.max(0, taxable + taxAmount),
  };
}

function calculateTotals(items) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const discountTotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice * (item.discount / 100), 0);
  const taxTotal = items.reduce((sum, item) => {
    const base = item.quantity * item.unitPrice;
    return sum + (base - base * (item.discount / 100)) * (item.tax / 100);
  }, 0);
  return {
    subtotal,
    discountTotal,
    taxTotal,
    grandTotal: Math.max(0, subtotal - discountTotal + taxTotal),
  };
}

function render() {
  if (!currentUser) {
    renderLogin();
    return;
  }

  const pages = {
    dashboard: "Dashboard",
    customers: "Customers",
    products: "Products",
    orders: "Sales Orders",
  };

  document.title = `${pages[currentPage] || "Sales Orders"} - Sales Order Management`;
  applyTheme();
  byId("app").innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand">
          <span class="brand-mark">SF</span>
          <strong>SalesFlow</strong>
          <span>Order management workshop</span>
        </div>
        <nav class="nav">
          ${navButton("dashboard", "Dashboard")}
          ${canManageMasterData() ? navButton("customers", "Customers") : ""}
          ${canManageMasterData() ? navButton("products", "Products") : ""}
          ${navButton("orders", "Sales Orders")}
        </nav>
        <div class="user-card">
          <div class="avatar">${escapeHtml(currentUser.name.slice(0, 1))}</div>
          <div>
            <strong>${escapeHtml(currentUser.name)}</strong>
            <span>${escapeHtml(currentUser.role)}</span>
          </div>
          <button class="btn sidebar-btn" onclick="logout()">Logout</button>
        </div>
      </aside>
      <main class="main">
        <header class="topbar">
          <div>
            <p class="eyebrow">Sales order workspace</p>
            <h1>${pages[currentPage] || "Dashboard"}</h1>
          </div>
          <div class="actions">
            <button class="theme-toggle" onclick="toggleTheme()" title="Toggle theme">
              <span>${currentTheme === "dark" ? "Light" : "Dark"}</span>
            </button>
            <button class="btn" onclick="resetDemoData()">Reset Demo Data</button>
          </div>
        </header>
        <section class="content">${renderPage()}</section>
      </main>
    </div>
    ${modal || ""}
  `;
}

function navButton(page, label) {
  return `<button class="${currentPage === page ? "active" : ""}" onclick="go('${page}')">${label}</button>`;
}

function go(page) {
  currentPage = page;
  modal = null;
  render();
}

function renderLogin() {
  applyTheme();
  byId("app").innerHTML = `
    <div class="login-shell">
      <section class="login-hero">
        <div class="login-badge">One-day workshop MVP</div>
        <h1>Sales Order Management</h1>
        <p>Create customers, manage products, build sales orders, and print invoices in one focused workshop app.</p>
      </section>
      <section class="login-panel">
        <div class="login-actions">
          <button class="theme-toggle" onclick="toggleTheme()" title="Toggle theme">${currentTheme === "dark" ? "Light" : "Dark"}</button>
        </div>
        <h2>Sign in</h2>
        <p class="hint">Use one of the workshop demo accounts to continue.</p>
        <form onsubmit="login(event)">
          <div class="field">
            <label>Email</label>
            <input id="email" type="email" value="admin@example.com" required />
          </div>
          <div class="field">
            <label>Password</label>
            <input id="password" type="password" value="admin123" required />
          </div>
          <button class="btn primary" style="width:100%">Login</button>
          <p id="login-error" class="error"></p>
        </form>
        <div class="demo-box">
          <strong>Admin:</strong> admin@example.com / admin123<br />
          <strong>Sales User:</strong> sales@example.com / sales123
        </div>
      </section>
    </div>
  `;
}

function login(event) {
  event.preventDefault();
  const email = byId("email").value.trim();
  const password = byId("password").value;
  const user = USERS.find((item) => item.email === email && item.password === password);
  if (!user) {
    byId("login-error").textContent = "Invalid email or password.";
    return;
  }
  const { password: _password, ...safeUser } = user;
  saveSession(safeUser);
  currentPage = "dashboard";
  render();
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
  currentUser = null;
  render();
}

function resetDemoData() {
  if (!confirm("Reset all workshop data to the original sample data?")) return;
  state = structuredClone(seedState);
  saveState();
  modal = null;
  render();
}

function renderPage() {
  if (currentPage === "customers") return canManageMasterData() ? renderCustomers() : renderNoAccess();
  if (currentPage === "products") return canManageMasterData() ? renderProducts() : renderNoAccess();
  if (currentPage === "orders") return renderOrders();
  return renderDashboard();
}

function renderNoAccess() {
  return `<div class="card"><div class="empty">You do not have permission to access this page.</div></div>`;
}

function renderDashboard() {
  const counts = Object.fromEntries(STATUSES.map((status) => [status, state.orders.filter((order) => order.status === status).length]));
  const revenue = state.orders.filter((order) => ["Approved", "Delivered"].includes(order.status)).reduce((sum, order) => sum + order.grandTotal, 0);
  const openRevenue = state.orders.filter((order) => ["Draft", "Pending", "Approved"].includes(order.status)).reduce((sum, order) => sum + order.grandTotal, 0);
  const avgOrder = state.orders.length ? state.orders.reduce((sum, order) => sum + order.grandTotal, 0) / state.orders.length : 0;
  const recent = [...state.orders].sort((a, b) => b.orderDate.localeCompare(a.orderDate)).slice(0, 5);
  const maxCount = Math.max(1, ...Object.values(counts));
  const statusTotal = Math.max(1, state.orders.length);
  const statusGradient = buildStatusGradient(counts, statusTotal);
  const monthly = revenueByMonth();
  const category = revenueByCategory();
  const maxMonthly = Math.max(1, ...monthly.map((item) => item.total));
  const maxCategory = Math.max(1, ...category.map((item) => item.total));

  return `
    <section class="dashboard-hero">
      <div>
        <p class="eyebrow">Live business snapshot</p>
        <h2>Track orders, revenue, and fulfillment from one calm workspace.</h2>
      </div>
      <div class="hero-total">
        <span>Qualified Revenue</span>
        <strong>${money(revenue)}</strong>
      </div>
    </section>
    <div class="grid cols-4">
      ${metricCard("Total Orders", state.orders.length, "All sales orders", "trend-up")}
      ${metricCard("Open Pipeline", money(openRevenue), "Draft, pending, approved", "trend-warn")}
      ${metricCard("Delivered", counts.Delivered, "Completed orders", "trend-good")}
      ${metricCard("Avg Order", money(avgOrder), "Across all statuses", "trend-info")}
    </div>
    <div class="grid dashboard-grid" style="margin-top:18px">
      <div class="card chart-card">
        <div class="card-body">
          <div class="section-head">
            <div>
              <p class="eyebrow">Order health</p>
              <h2>Status Distribution</h2>
            </div>
          </div>
          <div class="donut-layout">
            <div class="donut" style="background:${statusGradient}">
              <div class="donut-hole">
                <strong>${state.orders.length}</strong>
                <span>Orders</span>
              </div>
            </div>
            <div class="status-legend">
              ${STATUSES.map((status) => `
                <div>
                  <span class="legend-dot" style="background:${STATUS_COLORS[status]}"></span>
                  <span>${status}</span>
                  <strong>${counts[status]}</strong>
                </div>
              `).join("")}
            </div>
          </div>
          <div class="chart-bars">
            ${STATUSES.map((status) => `
              <div class="bar-line">
                <span>${status}</span>
                <div class="bar-track"><div class="bar-fill" style="width:${(counts[status] / maxCount) * 100}%;background:${STATUS_COLORS[status]}"></div></div>
                <strong>${counts[status]}</strong>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
      <div class="card chart-card">
        <div class="card-body">
          <div class="section-head">
            <div>
              <p class="eyebrow">Revenue rhythm</p>
              <h2>Monthly Sales</h2>
            </div>
          </div>
          <div class="column-chart">
            ${monthly.map((item) => `
              <div class="column-item">
                <div class="column-track"><div class="column-fill" style="height:${Math.max(8, (item.total / maxMonthly) * 100)}%"></div></div>
                <span>${item.label}</span>
                <strong>${money(item.total)}</strong>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
      <div class="card chart-card">
        <div class="card-body">
          <div class="section-head">
            <div>
              <p class="eyebrow">Catalog signal</p>
              <h2>Revenue By Category</h2>
            </div>
          </div>
          <div class="ranked-bars">
            ${category.map((item) => `
              <div class="ranked-row">
                <div>
                  <strong>${escapeHtml(item.label)}</strong>
                  <span>${money(item.total)}</span>
                </div>
                <div class="bar-track"><div class="bar-fill category" style="width:${(item.total / maxCategory) * 100}%"></div></div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
      <div class="card chart-card">
        <div class="card-body">
          <div class="section-head">
            <div>
              <p class="eyebrow">Latest activity</p>
              <h2>Recent Orders</h2>
            </div>
          </div>
          ${renderOrderTable(recent, false)}
        </div>
      </div>
    </div>
  `;
}

function metricCard(label, value, detail, tone) {
  return `
    <div class="card metric ${tone}">
      <div class="card-body">
        <div class="metric-icon"></div>
        <span>${label}</span>
        <strong>${value}</strong>
        <small>${detail}</small>
      </div>
    </div>
  `;
}

function buildStatusGradient(counts, total) {
  let cursor = 0;
  const stops = STATUSES.map((status) => {
    const start = cursor;
    const end = cursor + (counts[status] / total) * 100;
    cursor = end;
    return `${STATUS_COLORS[status]} ${start}% ${end}%`;
  });
  return `conic-gradient(${stops.join(", ")})`;
}

function revenueByMonth() {
  const revenueOrders = state.orders.filter((order) => order.status !== "Cancelled");
  const grouped = revenueOrders.reduce((map, order) => {
    const label = new Date(`${order.orderDate}T00:00:00`).toLocaleDateString("en-US", { month: "short" });
    map[label] = (map[label] || 0) + order.grandTotal;
    return map;
  }, {});
  const labels = [...new Set(revenueOrders.map((order) => new Date(`${order.orderDate}T00:00:00`).toLocaleDateString("en-US", { month: "short" })))];
  return (labels.length ? labels : ["Jun"]).map((label) => ({ label, total: grouped[label] || 0 }));
}

function revenueByCategory() {
  const grouped = {};
  state.orders.filter((order) => order.status !== "Cancelled").forEach((order) => {
    order.items.forEach((item) => {
      const product = state.products.find((entry) => entry.id === item.productId);
      const category = product?.category || "Other";
      grouped[category] = (grouped[category] || 0) + item.lineTotal;
    });
  });
  const rows = Object.entries(grouped).map(([label, total]) => ({ label, total })).sort((a, b) => b.total - a.total);
  return rows.length ? rows.slice(0, 5) : [{ label: "No sales", total: 0 }];
}

function renderCustomers() {
  const query = (byId("customer-search")?.value || "").toLowerCase();
  const rows = state.customers.filter((customer) => [customer.name, customer.companyName, customer.phone, customer.email].join(" ").toLowerCase().includes(query));
  return `
    <div class="toolbar">
      <input id="customer-search" class="search-input" style="max-width:380px" placeholder="Search customers" value="${escapeHtml(query)}" oninput="render()" />
      <button class="btn primary" onclick="openCustomerForm()">Add Customer</button>
    </div>
    <div class="card table-wrap">
      <table>
        <thead><tr><th>Name</th><th>Company</th><th>Contact</th><th>Tax ID</th><th>Actions</th></tr></thead>
        <tbody>
          ${rows.map((customer) => `
            <tr>
              <td><strong>${escapeHtml(customer.name)}</strong><br><span style="color:var(--muted)">${escapeHtml(customer.address)}</span></td>
              <td>${escapeHtml(customer.companyName)}</td>
              <td>${escapeHtml(customer.phone)}<br>${escapeHtml(customer.email)}</td>
              <td>${escapeHtml(customer.taxId)}</td>
              <td class="actions">
                <button class="btn small" onclick="openCustomerForm('${customer.id}')">Edit</button>
                <button class="btn small danger" onclick="deleteCustomer('${customer.id}')">Delete</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      ${rows.length ? "" : `<div class="empty">No customers found.</div>`}
    </div>
  `;
}

function renderProducts() {
  const query = (byId("product-search")?.value || "").toLowerCase();
  const rows = state.products.filter((product) => [product.name, product.sku, product.category].join(" ").toLowerCase().includes(query));
  return `
    <div class="toolbar">
      <input id="product-search" class="search-input" style="max-width:380px" placeholder="Search products" value="${escapeHtml(query)}" oninput="render()" />
      <button class="btn primary" onclick="openProductForm()">Add Product</button>
    </div>
    <div class="card table-wrap">
      <table>
        <thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>Unit Price</th><th>Stock</th><th>Actions</th></tr></thead>
        <tbody>
          ${rows.map((product) => `
            <tr>
              <td><strong>${escapeHtml(product.name)}</strong></td>
              <td>${escapeHtml(product.sku)}</td>
              <td>${escapeHtml(product.category)}</td>
              <td>${money(product.unitPrice)}</td>
              <td>${product.stockQuantity < 15 ? `<span class="badge Pending">${product.stockQuantity} low</span>` : product.stockQuantity}</td>
              <td class="actions">
                <button class="btn small" onclick="openProductForm('${product.id}')">Edit</button>
                <button class="btn small danger" onclick="deleteProduct('${product.id}')">Delete</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      ${rows.length ? "" : `<div class="empty">No products found.</div>`}
    </div>
  `;
}

function renderOrders() {
  const search = (byId("order-search")?.value || "").toLowerCase();
  const status = byId("status-filter")?.value || "";
  const from = byId("from-filter")?.value || "";
  const to = byId("to-filter")?.value || "";
  const rows = filteredOrders(search, status, from, to);
  return `
    <div class="toolbar">
      <div class="actions" style="flex:1">
        <input id="order-search" class="search-input" style="max-width:300px" placeholder="Search orders, customers, products" value="${escapeHtml(search)}" oninput="render()" />
        <select id="status-filter" onchange="render()">
          <option value="">All statuses</option>
          ${STATUSES.map((item) => `<option ${status === item ? "selected" : ""}>${item}</option>`).join("")}
        </select>
        <input id="from-filter" type="date" value="${escapeHtml(from)}" onchange="render()" />
        <input id="to-filter" type="date" value="${escapeHtml(to)}" onchange="render()" />
        <button class="btn" onclick="clearOrderFilters()">Clear</button>
      </div>
      <button class="btn primary" onclick="openOrderForm()">New Order</button>
    </div>
    <div class="card table-wrap">${renderOrderTable(rows, true)}${rows.length ? "" : `<div class="empty">No sales orders found.</div>`}</div>
  `;
}

function filteredOrders(search, status, from, to) {
  return [...state.orders]
    .sort((a, b) => b.orderDate.localeCompare(a.orderDate))
    .filter((order) => {
      const customer = state.customers.find((item) => item.id === order.customerId);
      const haystack = [order.orderNumber, customer?.name, customer?.companyName, ...order.items.map((item) => item.productName)].join(" ").toLowerCase();
      return (!search || haystack.includes(search))
        && (!status || order.status === status)
        && (!from || order.orderDate >= from)
        && (!to || order.orderDate <= to);
    });
}

function renderOrderTable(rows, showActions) {
  return `
    <div class="table-wrap">
      <table>
        <thead><tr><th>Order</th><th>Date</th><th>Customer</th><th>Status</th><th>Total</th>${showActions ? "<th>Actions</th>" : ""}</tr></thead>
        <tbody>
          ${rows.map((order) => {
            const customer = state.customers.find((item) => item.id === order.customerId);
            return `
              <tr>
                <td><strong>${escapeHtml(order.orderNumber)}</strong></td>
                <td>${escapeHtml(order.orderDate)}</td>
                <td>${escapeHtml(customer?.companyName || "Unknown")}<br><span style="color:var(--muted)">${escapeHtml(customer?.name || "")}</span></td>
                <td><span class="badge ${order.status}">${order.status}</span></td>
                <td>${money(order.grandTotal)}</td>
                ${showActions ? `
                  <td class="actions">
                    <button class="btn small" onclick="openInvoice('${order.id}')">Invoice</button>
                    <button class="btn small" onclick="openOrderForm('${order.id}')">Edit</button>
                  </td>
                ` : ""}
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function clearOrderFilters() {
  byId("order-search").value = "";
  byId("status-filter").value = "";
  byId("from-filter").value = "";
  byId("to-filter").value = "";
  render();
}

function openCustomerForm(id) {
  const item = state.customers.find((customer) => customer.id === id) || {};
  modal = modalShell(id ? "Edit Customer" : "Add Customer", `
    <form onsubmit="saveCustomer(event, '${id || ""}')">
      <div class="grid cols-2">
        ${inputField("name", "Name", item.name, true)}
        ${inputField("companyName", "Company Name", item.companyName, true)}
        ${inputField("phone", "Phone", item.phone, true)}
        ${inputField("email", "Email", item.email, true, "email")}
        ${inputField("taxId", "Tax ID", item.taxId)}
      </div>
      ${textField("address", "Address", item.address)}
      <div class="actions"><button class="btn primary">Save Customer</button><button type="button" class="btn" onclick="closeModal()">Cancel</button></div>
    </form>
  `);
  render();
}

function saveCustomer(event, id) {
  event.preventDefault();
  const form = new FormData(event.target);
  const customer = {
    id: id || crypto.randomUUID(),
    name: form.get("name").trim(),
    phone: form.get("phone").trim(),
    email: form.get("email").trim(),
    address: form.get("address").trim(),
    companyName: form.get("companyName").trim(),
    taxId: form.get("taxId").trim(),
  };
  state.customers = id ? state.customers.map((item) => item.id === id ? customer : item) : [...state.customers, customer];
  saveState();
  closeModal();
}

function deleteCustomer(id) {
  if (!confirm("Delete this customer? Existing orders will keep their order data but may show Unknown customer.")) return;
  state.customers = state.customers.filter((customer) => customer.id !== id);
  saveState();
  render();
}

function openProductForm(id) {
  const item = state.products.find((product) => product.id === id) || {};
  modal = modalShell(id ? "Edit Product" : "Add Product", `
    <form onsubmit="saveProduct(event, '${id || ""}')">
      <div class="grid cols-2">
        ${inputField("name", "Product Name", item.name, true)}
        ${inputField("sku", "SKU", item.sku, true)}
        ${inputField("category", "Category", item.category, true)}
        ${inputField("unitPrice", "Unit Price", item.unitPrice, true, "number", "0")}
        ${inputField("stockQuantity", "Stock Quantity", item.stockQuantity, true, "number", "0")}
      </div>
      <div class="actions"><button class="btn primary">Save Product</button><button type="button" class="btn" onclick="closeModal()">Cancel</button></div>
    </form>
  `);
  render();
}

function saveProduct(event, id) {
  event.preventDefault();
  const form = new FormData(event.target);
  const product = {
    id: id || crypto.randomUUID(),
    name: form.get("name").trim(),
    sku: form.get("sku").trim(),
    category: form.get("category").trim(),
    unitPrice: Number(form.get("unitPrice")) || 0,
    stockQuantity: Number(form.get("stockQuantity")) || 0,
  };
  state.products = id ? state.products.map((item) => item.id === id ? product : item) : [...state.products, product];
  saveState();
  closeModal();
}

function deleteProduct(id) {
  if (!confirm("Delete this product? Existing orders will keep the product name already saved.")) return;
  state.products = state.products.filter((product) => product.id !== id);
  saveState();
  render();
}

function openOrderForm(id) {
  const order = state.orders.find((item) => item.id === id) || {
    customerId: state.customers[0]?.id || "",
    status: "Draft",
    orderDate: new Date().toISOString().slice(0, 10),
    notes: "",
    items: [blankOrderItem()],
  };
  modal = modalShell(id ? "Edit Sales Order" : "Create Sales Order", orderFormHtml(order, id));
  render();
  updateOrderPreview();
}

function blankOrderItem() {
  const product = state.products[0];
  return product ? calculateLine({ productId: product.id, productName: product.name, quantity: 1, unitPrice: product.unitPrice, discount: 0, tax: 5 }) : calculateLine({ productId: "", productName: "", quantity: 1, unitPrice: 0, discount: 0, tax: 5 });
}

function orderFormHtml(order, id) {
  return `
    <form id="order-form" oninput="updateOrderPreview()" onchange="updateOrderPreview()" onsubmit="saveOrder(event, '${id || ""}')">
      <div class="grid cols-2">
        <div class="field">
          <label>Customer</label>
          <select name="customerId" required>
            ${state.customers.map((customer) => `<option value="${customer.id}" ${order.customerId === customer.id ? "selected" : ""}>${escapeHtml(customer.companyName)} - ${escapeHtml(customer.name)}</option>`).join("")}
          </select>
        </div>
        <div class="field">
          <label>Status</label>
          <select name="status">${STATUSES.map((status) => `<option ${order.status === status ? "selected" : ""}>${status}</option>`).join("")}</select>
        </div>
        ${inputField("orderDate", "Order Date", order.orderDate, true, "date")}
      </div>
      <h3>Order Items</h3>
      <div id="order-items" class="order-items">
        ${order.items.map((item, index) => orderItemRow(item, index)).join("")}
      </div>
      <button type="button" class="btn" style="margin-top:12px" onclick="addOrderItem()">Add Item</button>
      ${textField("notes", "Notes", order.notes)}
      <div id="order-totals" class="totals"></div>
      <div class="actions" style="margin-top:18px"><button class="btn primary">Save Order</button><button type="button" class="btn" onclick="closeModal()">Cancel</button></div>
    </form>
  `;
}

function orderItemRow(item, index) {
  return `
    <div class="order-row" data-row="${index}">
      <div class="field">
        <label>Product</label>
        <select name="productId" onchange="fillProductPrice(this)">
          ${state.products.map((product) => `<option value="${product.id}" ${item.productId === product.id ? "selected" : ""}>${escapeHtml(product.name)}</option>`).join("")}
        </select>
      </div>
      ${inputField("quantity", "Qty", item.quantity, true, "number", "1")}
      ${inputField("unitPrice", "Price", item.unitPrice, true, "number", "0")}
      ${inputField("discount", "Disc %", item.discount, false, "number", "0")}
      ${inputField("tax", "Tax %", item.tax, false, "number", "0")}
      <button type="button" class="btn danger" onclick="removeOrderItem(this)">Remove</button>
    </div>
  `;
}

function fillProductPrice(select) {
  const product = state.products.find((item) => item.id === select.value);
  const row = select.closest(".order-row");
  if (product && row) {
    row.querySelector('[name="unitPrice"]').value = product.unitPrice;
  }
  updateOrderPreview();
}

function addOrderItem() {
  const container = byId("order-items");
  container.insertAdjacentHTML("beforeend", orderItemRow(blankOrderItem(), container.children.length));
  updateOrderPreview();
}

function removeOrderItem(button) {
  const container = byId("order-items");
  if (container.children.length <= 1) return;
  button.closest(".order-row").remove();
  updateOrderPreview();
}

function readOrderItems() {
  return [...document.querySelectorAll(".order-row")].map((row) => {
    const productId = row.querySelector('[name="productId"]').value;
    const product = state.products.find((item) => item.id === productId);
    return calculateLine({
      productId,
      productName: product?.name || "Unknown product",
      quantity: row.querySelector('[name="quantity"]').value,
      unitPrice: row.querySelector('[name="unitPrice"]').value,
      discount: row.querySelector('[name="discount"]').value,
      tax: row.querySelector('[name="tax"]').value,
    });
  });
}

function updateOrderPreview() {
  const target = byId("order-totals");
  if (!target) return;
  const totals = calculateTotals(readOrderItems());
  target.innerHTML = `
    <div><span>Subtotal</span><strong>${money(totals.subtotal)}</strong></div>
    <div><span>Discount</span><strong>${money(totals.discountTotal)}</strong></div>
    <div><span>Tax</span><strong>${money(totals.taxTotal)}</strong></div>
    <div class="grand"><span>Grand Total</span><strong>${money(totals.grandTotal)}</strong></div>
  `;
}

function saveOrder(event, id) {
  event.preventDefault();
  const form = new FormData(event.target);
  const items = readOrderItems();
  const totals = calculateTotals(items);
  const existing = state.orders.find((order) => order.id === id);
  const order = {
    id: id || crypto.randomUUID(),
    orderNumber: existing?.orderNumber || nextOrderNumber(),
    customerId: form.get("customerId"),
    orderDate: form.get("orderDate"),
    status: form.get("status"),
    items,
    notes: form.get("notes").trim(),
    ...totals,
  };
  state.orders = id ? state.orders.map((item) => item.id === id ? order : item) : [...state.orders, order];
  saveState();
  currentPage = "orders";
  closeModal();
}

function nextOrderNumber() {
  const max = state.orders.reduce((highest, order) => {
    const number = Number(order.orderNumber.replace(/\D/g, ""));
    return Math.max(highest, number || 1000);
  }, 1000);
  return `SO-${max + 1}`;
}

function openInvoice(id) {
  const order = state.orders.find((item) => item.id === id);
  const customer = state.customers.find((item) => item.id === order.customerId);
  modal = modalShell(`Invoice ${order.orderNumber}`, `
    <div class="toolbar no-print"><button class="btn primary" onclick="window.print()">Print Invoice</button></div>
    <section class="invoice">
      <div class="invoice-head">
        <div>
          <h2>SalesFlow Trading</h2>
          <div class="muted">House 12, Road 7, Dhaka<br>support@salesflow.test<br>+880 1700 000 000</div>
        </div>
        <div style="text-align:right">
          <h2>Invoice</h2>
          <div class="muted">${escapeHtml(order.orderNumber)}<br>${escapeHtml(order.orderDate)}<br><span class="badge ${order.status}">${order.status}</span></div>
        </div>
      </div>
      <div class="grid cols-2" style="margin-bottom:20px">
        <div>
          <strong>Bill To</strong>
          <div class="muted">${escapeHtml(customer?.companyName || "Unknown")}<br>${escapeHtml(customer?.name || "")}<br>${escapeHtml(customer?.address || "")}<br>${escapeHtml(customer?.email || "")}</div>
        </div>
        <div>
          <strong>Notes</strong>
          <div class="muted">${escapeHtml(order.notes || "No notes")}</div>
        </div>
      </div>
      <table>
        <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Discount</th><th>Tax</th><th>Total</th></tr></thead>
        <tbody>
          ${order.items.map((item) => `
            <tr>
              <td>${escapeHtml(item.productName)}</td>
              <td>${item.quantity}</td>
              <td>${money(item.unitPrice)}</td>
              <td>${item.discount}%</td>
              <td>${item.tax}%</td>
              <td>${money(item.lineTotal)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      <div class="totals" style="margin-top:22px">
        <div><span>Subtotal</span><strong>${money(order.subtotal)}</strong></div>
        <div><span>Discount</span><strong>${money(order.discountTotal)}</strong></div>
        <div><span>Tax</span><strong>${money(order.taxTotal)}</strong></div>
        <div class="grand"><span>Grand Total</span><strong>${money(order.grandTotal)}</strong></div>
      </div>
    </section>
  `);
  render();
}

function modalShell(title, body) {
  return `
    <div class="modal-backdrop">
      <div class="modal">
        <div class="modal-header">
          <h2>${escapeHtml(title)}</h2>
          <button class="btn" onclick="closeModal()">Close</button>
        </div>
        <div class="modal-body">${body}</div>
      </div>
    </div>
  `;
}

function closeModal() {
  modal = null;
  render();
}

function inputField(name, label, value = "", required = false, type = "text", min = "") {
  return `
    <div class="field">
      <label>${label}</label>
      <input name="${name}" type="${type}" value="${escapeHtml(value)}" ${required ? "required" : ""} ${min !== "" ? `min="${min}"` : ""} />
    </div>
  `;
}

function textField(name, label, value = "") {
  return `
    <div class="field">
      <label>${label}</label>
      <textarea name="${name}" rows="3">${escapeHtml(value)}</textarea>
    </div>
  `;
}

render();
