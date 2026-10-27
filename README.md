# FlowFinance — Premium Expense Tracker & Budget Manager

FlowFinance is a production-quality, full-stack personal finance and wealth operations dashboard inspired by modern Dribbble fintech designs. It combines real-time transaction telemetry, predictive category budgets, deterministic spending insights, interactive charts, and live foreign exchange rate conversion.

Built with **React.js, Node.js, Express.js, MongoDB**, and external exchange-rate APIs.

---

## 📸 Key Highlights & Design System

The visual design follows an exact high-contrast fintech color system:

| Token | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Main Background** | `#101323` | Deep space navy canvas |
| **Cards & Panels** | `#1B2035` | Sleek slate elevated cards |
| **Primary Accent** | `#8B5CF6` | Vivid purple for CTAs, selected tabs & highlights |
| **Income / Positive** | `#42E8B4` | Mint green for cash inflows & safe thresholds |
| **Expense / Negative**| `#FF718B` | Coral pink for outflows & budget overrun alerts |
| **Primary Text** | `#F5F6FF` | Crisp high-legibility heading text |
| **Secondary Text** | `#9299B3` | Muted slate for metadata and labels |
| **Borders** | `#262D4A` | Low-contrast subtle panel dividers |
| **Input Background**| `#15192C` | Recessed input fields |

- **Light Mode Support**: Clean white/slate background (`#F8FAFC`), white cards (`#FFFFFF`), dark typography, and the identical primary purple accent. Zero theme flash on load.
- **Micro-Interactions**: Smooth 150–250ms transitions, custom Recharts tooltips, and non-blocking toast notifications.

---

## 🚀 8 Core Features

### 1. Quick Add Transaction Modal
- Prominent `+ Add Transaction` modal accessible globally from header or floating CTAs.
- Seamless toggle between **Expense** (`#FF718B`) and **Income** (`#42E8B4`).
- Amount input, title/notes, currency selector, and payment method selector.
- Visual category selector with Lucide icons (Food, Shopping, Transport, Bills, Education, Entertainment, Healthcare, Salary, Freelance, Investments, Other).
- Form validation backed by **Zod** and **React Hook Form**.

### 2. Smart Deterministic Spending Insights
- Mathematical analytics calculated directly from user transaction records in MongoDB.
- Month-over-month category variations (e.g., *"Your Food spending increased by 18% compared with last month"*).
- Highest spending category detection with proportional percentage of monthly outlays.
- Budget consumption warnings (e.g., *"You have used 75% of your monthly budget"*).
- Net period savings comparisons (e.g., *"You saved $2,500 more than last month"*).
- Clearly demarcated as verified deterministic database analytics.

### 3. Monthly Budget & Warning System
- Configurable overall monthly budget limit and granular category-specific allowances.
- Dynamic color-coded progress bars:
  - **Safe (<80%)**: Mint Green (`#42E8B4`)
  - **Warning (80%–99%)**: Purple / Amber (`#8B5CF6`)
  - **Exceeded (≥100%)**: Coral Pink (`#FF718B`)
- Displays amount spent, remaining capital, and % consumed.
- Enforces compound index uniqueness `{ user, category, month, year }` on MongoDB.

### 4. Interactive Analytics & Visual Telemetry
- Income vs Expenses Area Chart with dual gradient fills.
- Cumulative Net Cash Flow trajectory line chart.
- Donut chart displaying category spending distribution with percentage legend.
- Dynamic multi-period filters: **7 Days**, **This Month**, **Last Month**, **3 Months**, **This Year**, and **Custom Date Range**.
- Period-over-period comparisons for income, expenses, and savings rates.

### 5. Persistent Dark and Light Mode
- Dark mode default with deep navy `#101323` and `#1B2035`.
- Light mode with `#F8FAFC` background and crisp cards.
- Persisted in localStorage and synchronizable with user account profile preferences.

### 6. Smart Search, Multi-Filter Ledger & Pagination
- Real-time text search querying title and notes.
- Income vs Expense type filters.
- Category filter and Payment Method selector (Debit Card, Credit Card, UPI, Bank Transfer, Cash).
- Date range filtering (From Date, To Date).
- Multi-column sorting: Newest First, Oldest First, Highest Amount, Lowest Amount.
- Clean server-side/client pagination with count statistics.

### 7. Financial Reports & RFC 4180 CSV Export
- One-click CSV export matching all active filters with RFC 4180 standard escaping.
- Comprehensive Monthly Statement generator: printable modal with totals, category breakdown table, and net retention rate ready for PDF printing.
- Strictly protected endpoints ensuring users can only export their own financial data.

### 8. Live Multi-Currency Exchange Converter
- Real-time conversion powered by live bank market rates (USD, EUR, GBP, INR, CAD, AUD, JPY, SGD, AED, CHF, CNY).
- Bidirectional currency swap button (`⇄`).
- Dedicated backend service with in-memory caching (60-minute TTL) and automatic fallback to prevent rate limit starvation.
- Clear separation: conversions are real-time analytical estimates and do not silently mutate stored transactions.

---

## 🛠 Project Structure

```text
flowfinance/
├── client/                      # React 18 + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # Reusable Toast, ConfirmModal, LoadingSpinner
│   │   │   ├── layout/          # Sidebar, Header, DashboardLayout
│   │   │   ├── dashboard/       # SummaryCards, Charts, BudgetWidget, Insights
│   │   │   ├── transactions/    # TransactionModal, Filters, TransactionTable
│   │   │   ├── budgets/         # BudgetCard, BudgetModal
│   │   │   └── reports/         # ReportSummaryModal
│   │   ├── context/             # AuthContext, ThemeContext, CurrencyContext, ToastContext
│   │   ├── pages/               # Dashboard, Transactions, Budgets, Analytics, Currency, Reports, Settings, Login, Register
│   │   ├── services/            # Axios API client with JWT interceptor
│   │   ├── utils/               # Formatters & Category Lucide Icon metadata
│   │   ├── App.jsx              # Routes & Protected guards
│   │   └── main.jsx
│   ├── tailwind.config.js       # Design tokens & color palette
│   └── vite.config.js           # Proxy configuration to backend
├── server/                      # Node.js + Express + MongoDB Backend
│   ├── config/                  # MongoDB Mongoose connection
│   ├── controllers/             # Auth, Transactions, Budgets, Analytics, Currency, Reports
│   ├── middleware/              # JWT auth protect & centralized error handler
│   ├── models/                  # User, Transaction, Budget Mongoose schemas
│   ├── routes/                  # Express API route modules
│   ├── services/                # Currency exchange rate service with caching
│   ├── scripts/
│   │   ├── seed.js              # Realistic demo dataset seeder
│   │   └── testIntegration.js   # Automated integration test suite
│   ├── server.js                # Server entrypoint
│   └── .env.example
├── package.json                 # Monorepo runner scripts (concurrently)
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start & Setup Instructions

### 1. Prerequisites
- **Node.js** (v18 or higher; tested on v24.20.0)
- **MongoDB** running locally on port 27017 or a MongoDB Atlas connection string.

### 2. Environment Setup
Copy the example environment file in `server/`:
```bash
cd server
cp .env.example .env
```
Default `.env` configuration:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/flowfinance
JWT_SECRET=flowfinance_super_secret_jwt_key_2026_dev_prod
JWT_EXPIRE=30d
NODE_ENV=development
EXCHANGE_RATE_API_URL=https://open.er-api.com/v6/latest
EXCHANGE_RATE_API_KEY=
```
*(No API key is required; `open.er-api.com` is free and open out of the box).*

### 3. Install Dependencies
From the root directory:
```bash
npm install
npm install --prefix server
npm install --prefix client
```

### 4. Seed Realistic Demo Data
Seed the database with a pre-configured demo account populated with realistic multi-month transactions and budgets:
```bash
npm run seed
```
Demo Credentials:
- **Email:** `demo@flowfinance.com`
- **Password:** `password123`

*(You can also click the prominent "One-Click Demo Account Login" button on the login screen for instant access!)*

### 5. Run the Application
Start both the Express API and Vite React frontend with a single command:
```bash
npm run dev
```
- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

---

## 📡 REST API Reference

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Authenticate user & retrieve JWT | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | **Yes** |
| `PUT` | `/api/auth/profile` | Update profile preferences (currency, theme) | **Yes** |
| `GET` | `/api/transactions` | Query transactions (search, filter, sort, paginate) | **Yes** |
| `POST` | `/api/transactions` | Create a new transaction | **Yes** |
| `GET` | `/api/transactions/:id`| Retrieve single transaction | **Yes** |
| `PUT` | `/api/transactions/:id`| Update transaction | **Yes** |
| `DELETE`| `/api/transactions/:id`| Delete transaction | **Yes** |
| `GET` | `/api/budgets` | Get budgets with live spending progress & alerts | **Yes** |
| `POST` | `/api/budgets` | Set overall or category budget limit | **Yes** |
| `PUT` | `/api/budgets/:id` | Update budget amount | **Yes** |
| `DELETE`| `/api/budgets/:id` | Remove budget limit | **Yes** |
| `GET` | `/api/analytics/summary`| Summary cards metrics & period deltas | **Yes** |
| `GET` | `/api/analytics/spending`| Deterministic smart spending insights | **Yes** |
| `GET` | `/api/analytics/charts` | Timeline, category breakdown, cash flow | **Yes** |
| `GET` | `/api/currency/rates` | Fetch cached live exchange rates against USD | No |
| `GET` | `/api/currency/convert`| Live currency conversion | No |
| `GET` | `/api/reports/export-csv`| RFC 4180 CSV export of filtered transactions | **Yes** |
| `GET` | `/api/reports/summary` | Executive monthly financial statement | **Yes** |

---

## 🧪 Testing

To run the automated API integration test suite covering all 12 core backend endpoints:
```bash
node server/scripts/testIntegration.js
```
All integration tests pass with 100% success verification.
To test frontend production bundling:
```bash
npm run build --prefix client
```
