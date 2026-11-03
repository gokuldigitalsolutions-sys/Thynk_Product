# Thynk Digital Solution - Agency CRM & HRMS Operating System

Complete Enterprise CRM & HRMS platform for digital agencies, powered by **Cloudflare Workers (Hono) + Cloudflare D1 (Serverless SQLite)** with modern responsive interface and Workers Static Assets.

- **Official Production URL:** [https://project.thynkdigitalsolutions.com](https://project.thynkdigitalsolutions.com)
- **Edge Development URL:** [https://thynk-crm-workers.gokul-digitalsolutions.workers.dev](https://thynk-crm-workers.gokul-digitalsolutions.workers.dev)
- **Local Development URL:** [http://localhost:8080](http://localhost:8080)

---

## ⚡ Cloudflare Workers & Cloudflare D1 Deployment

### Architecture
- **Runtime**: Cloudflare Workers with TypeScript & [Hono](https://hono.dev/)
- **Database**: Cloudflare D1 (serverless SQLite at edge) with 24 relational tables
- **Frontend**: Cloudflare Workers Static Assets (`public/` directory with `index.html`)
- **Authentication**: Stateless JWT in `HttpOnly` secure cookies with WebCrypto HMAC-SHA256
- **CI/CD**: Automated GitHub Actions (`.github/workflows/deploy.yml`)

---

### Step 1: Create Cloudflare D1 Database
In your Cloudflare Dashboard (or via terminal):
```bash
npx wrangler d1 create thynk-crm-d1
```
Copy the generated `database_id` into [wrangler.jsonc](file:///d:/Antigravity/Anti%20Thynk%20Product/Anti%20Thynk%20Saas%20Product%20%282%29/Anti%20Thynk%20Product/Anti%20Thynk%20Product/wrangler.jsonc):
```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "thynk-crm-d1",
    "database_id": "<PASTE_YOUR_DATABASE_ID_HERE>"
  }
]
```

### Step 2: Configure GitHub Repository Secrets
In your GitHub repository (`Thynk-Product-2026`):
1. Go to **Settings** > **Secrets and variables** > **Actions** > **New repository secret**.
2. Add:
   - `CLOUDFLARE_API_TOKEN`: Cloudflare API token with Workers and D1 Edit permissions.
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare Account ID (found on your dashboard URL or Workers overview).

### Step 3: Seed Database (Optional / Initial Setup)
Apply initial schema and seed data to your Cloudflare D1 database:
```bash
# Apply schema migrations
npx wrangler d1 migrations apply thynk-crm-d1 --remote

# Seed initial CRM employees, clients, and demo records
npx wrangler d1 execute thynk-crm-d1 --remote --file=seed.sql
```

### Step 4: Deploy
Pushing to the `main` branch automatically triggers the GitHub Actions workflow to build, run D1 migrations, and deploy to your Cloudflare Worker URL.

---

## System Requirements (Legacy Local PHP/XAMPP)
- **XAMPP** (Apache 2.4+ with PHP 7.4 / 8.0+ and MySQL / MariaDB 10.4+)
- Modern web browser (Chrome, Firefox, Edge, Safari)

---

## Local Setup Instructions with XAMPP

### Step 1: Place Project in XAMPP `htdocs`
Copy or link the project folder into your XAMPP web root directory:
```
C:\xampp\htdocs\Anti-Thynk-Product\
```
*(Or keep in your workspace and configure an Apache VirtualHost / Alias)*

### Step 2: Start Apache and MySQL
1. Open **XAMPP Control Panel**.
2. Click **Start** next to **Apache**.
3. Click **Start** next to **MySQL**.

### Step 3: Import MySQL Database
1. Open your browser and navigate to **phpMyAdmin**:
   ```
   http://localhost/phpmyadmin/
   ```
2. Click on the **Import** tab at the top.
3. Click **Choose File** and select the `database.sql` file from the project root:
   ```
   database.sql
   ```
4. Click **Go** (or **Import**) at the bottom.
5. The database `thynk_crm_db` and all 24 relational tables with initial seed data will be created automatically.

### Step 4: Open Application
In your browser, visit:
```
http://localhost/Anti-Thynk-Product/
```
*(Or your configured local Apache URL / port)*

---

## Default Login Credentials

### Administrator / Leadership
- **Email / Username**: `admin@thynkdigital.in` or `admin`
- **Password**: `admin123`
- **Role**: Administrator (Full access to all CRM, HRMS, Accounts, Billing, Ads, SEO, Reports, and System Settings)

### System Access
| Name | Email / Username | Default Password | Department / Role |
|---|---|---|---|
| **Gokul R** | `admin@thynkdigital.in` (`admin`) | `admin123` | Lead Web Developer (Administrator) |

> **Security & Access Control**:
> - Passwords use native `password_hash()` and `password_verify()` with bcrypt (`PASSWORD_BCRYPT`).
> - Every API endpoint enforces session-based authentication and CSRF token protection (`X-CSRF-Token`).
> - Administrators have complete access across all modules and system controls.

---

## Changing Passwords
Any logged-in user or employee can securely change their own password at any time:
1. Click on the user avatar in the top-right corner.
2. Select **Change Password**.
3. Enter your current password and new password (minimum 6 characters).
4. Click **Update Password** — it is immediately hashed and saved in MySQL.

---

## Architecture & Data Flow

```
Web Browser (Modern Frosted Glass SaaS UI)
    ↓
JavaScript Frontend Controller (js/app.js + js/api.js)
    ↓  Async REST API (JSON)
PHP Backend (api/*.php) with PDO & Prepared Statements
    ↓  Session & Role-Based Permissions
MySQL Database (thynk_crm_db - 24 Tables)
```

### MySQL Single Source of Truth
- All data modifications (Add, Edit, Delete, Attendance clock-in, Leave requests, Tasks, Services, Payments, Invoices, Notes, Ads campaigns, SEO reports) are persisted to the MySQL database.
- Refreshing the page, logging in from another device/browser, or clearing local storage will always retrieve the live, persistent data from MySQL.

---

## API Endpoints Reference (`/api/`)
- `api/auth.php`: Login, Logout, Session check, Password change
- `api/sync.php`: Full state synchronization from MySQL
- `api/clients.php`: Clients management
- `api/leads.php`: Leads pipeline
- `api/employees.php`: Employees HRMS & permissions
- `api/attendance.php`: Attendance logging & time tracking
- `api/leaves.php`: Leave applications & dynamic quota allocations
- `api/tasks.php`: Task tracking & comments
- `api/services.php`: Services & contracts
- `api/domains.php`: Domain registrations
- `api/hostings.php`: Hosting accounts
- `api/payments.php`: Payments ledger
- `api/invoices.php`: Billing & GST invoices
- `api/followups.php`: Client follow-ups
- `api/reminders.php`: Scheduler & alerts
- `api/notes.php`: CRM notes
- `api/meta_ads.php`: Meta Ads campaigns & daily performance
- `api/google_ads.php`: Google Ads campaigns
- `api/seo.php`: SEO campaigns, ranking keywords, logs
- `api/projects.php`: Web development projects
- `api/canva.php`: Canva subscriptions
- `api/billing_software.php`: Software billing subscriptions
- `api/timeline.php`: Audit timeline logs (30-day window)
- `api/notifications.php`: In-app system alerts
- `api/settings.php`: Agency configuration settings
- `api/migrate.php`: State migration & bulk import tool

---

## License & Copyright
© 2026 Thynk Digital Solution. All rights reserved.
