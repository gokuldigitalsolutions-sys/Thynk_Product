-- ==========================================================
-- Thynk Digital Solution - CRM & HRMS Production Database
-- Target Production Database: u672129978_thynkproduct
-- Compatible with MySQL 5.7+ / 8.0+ / MariaDB 10.4+ (Hostinger / cPanel)
-- Character Set: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `u672129978_thynkproduct` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `u672129978_thynkproduct`;

-- 1. EMPLOYEES & AUTH
CREATE TABLE IF NOT EXISTS `employees` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(50) DEFAULT '',
  `username` VARCHAR(100) DEFAULT '',
  `password_hash` VARCHAR(255) NOT NULL,
  `department` VARCHAR(100) DEFAULT '',
  `designation` VARCHAR(100) DEFAULT '',
  `role` VARCHAR(100) DEFAULT 'Employee',
  `joining_date` VARCHAR(50) DEFAULT '',
  `salary` DECIMAL(12, 2) DEFAULT 0.00,
  `manager_id` VARCHAR(50) DEFAULT 'Admin',
  `status` VARCHAR(50) DEFAULT 'Active',
  `photo` TEXT DEFAULT NULL,
  `permissions` LONGTEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_emp_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. CLIENTS
CREATE TABLE IF NOT EXISTS `clients` (
  `id` VARCHAR(50) NOT NULL,
  `company_name` VARCHAR(255) NOT NULL,
  `client_name` VARCHAR(150) NOT NULL,
  `mobile` VARCHAR(50) DEFAULT '',
  `whatsapp` VARCHAR(50) DEFAULT '',
  `email` VARCHAR(150) DEFAULT '',
  `website` VARCHAR(255) DEFAULT '',
  `category` VARCHAR(100) DEFAULT '',
  `gst` VARCHAR(100) DEFAULT '',
  `address` TEXT DEFAULT NULL,
  `city` VARCHAR(100) DEFAULT '',
  `state` VARCHAR(100) DEFAULT '',
  `country` VARCHAR(100) DEFAULT 'India',
  `logo` VARCHAR(50) DEFAULT '',
  `source` VARCHAR(100) DEFAULT '',
  `assigned_employee_id` VARCHAR(50) DEFAULT '',
  `status` VARCHAR(50) DEFAULT 'Active',
  `priority` VARCHAR(50) DEFAULT 'Medium',
  `date_created` VARCHAR(50) DEFAULT '',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. LEADS
CREATE TABLE IF NOT EXISTS `leads` (
  `id` VARCHAR(50) NOT NULL,
  `company_name` VARCHAR(255) NOT NULL,
  `contact_name` VARCHAR(150) NOT NULL,
  `mobile` VARCHAR(50) DEFAULT '',
  `email` VARCHAR(150) DEFAULT '',
  `source` VARCHAR(100) DEFAULT '',
  `value` DECIMAL(12, 2) DEFAULT 0.00,
  `status` VARCHAR(50) DEFAULT 'Hot',
  `assigned_employee_id` VARCHAR(50) DEFAULT '',
  `notes` TEXT DEFAULT NULL,
  `date_created` VARCHAR(50) DEFAULT '',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. SERVICES
CREATE TABLE IF NOT EXISTS `services` (
  `id` VARCHAR(50) NOT NULL,
  `client_id` VARCHAR(50) NOT NULL,
  `service_name` VARCHAR(255) NOT NULL,
  `package` VARCHAR(255) DEFAULT '',
  `start_date` VARCHAR(50) DEFAULT '',
  `end_date` VARCHAR(50) DEFAULT '',
  `renewal_date` VARCHAR(50) DEFAULT '',
  `assigned_employee_id` VARCHAR(50) DEFAULT '',
  `cost` DECIMAL(12, 2) DEFAULT 0.00,
  `discount` DECIMAL(12, 2) DEFAULT 0.00,
  `final_amount` DECIMAL(12, 2) DEFAULT 0.00,
  `status` VARCHAR(50) DEFAULT 'Running',
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. DOMAINS
CREATE TABLE IF NOT EXISTS `domains` (
  `id` VARCHAR(50) NOT NULL,
  `client_id` VARCHAR(50) DEFAULT '',
  `domain_name` VARCHAR(255) NOT NULL,
  `registrar` VARCHAR(100) DEFAULT '',
  `registration_date` VARCHAR(50) DEFAULT '',
  `expiry_date` VARCHAR(50) DEFAULT '',
  `renewal_date` VARCHAR(50) DEFAULT '',
  `auto_renewal` VARCHAR(20) DEFAULT 'No',
  `status` VARCHAR(50) DEFAULT 'Active',
  `renewal_cost` DECIMAL(12, 2) DEFAULT 0.00,
  `dns_status` VARCHAR(50) DEFAULT 'OK',
  `ssl_status` VARCHAR(50) DEFAULT 'Active',
  `nameservers` VARCHAR(255) DEFAULT '',
  `credentials_placeholder` TEXT DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. HOSTINGS
CREATE TABLE IF NOT EXISTS `hostings` (
  `id` VARCHAR(50) NOT NULL,
  `client_id` VARCHAR(50) DEFAULT '',
  `hosting_provider` VARCHAR(100) DEFAULT '',
  `hosting_plan` VARCHAR(100) DEFAULT '',
  `server_type` VARCHAR(50) DEFAULT 'Linux',
  `purchase_date` VARCHAR(50) DEFAULT '',
  `expiry_date` VARCHAR(50) DEFAULT '',
  `renewal_date` VARCHAR(50) DEFAULT '',
  `renewal_cost` DECIMAL(12, 2) DEFAULT 0.00,
  `disk_space` VARCHAR(100) DEFAULT '',
  `bandwidth` VARCHAR(100) DEFAULT '',
  `control_panel` VARCHAR(100) DEFAULT 'hPanel',
  `ssl_expiry` VARCHAR(50) DEFAULT '',
  `backup_status` VARCHAR(100) DEFAULT 'Weekly Auto',
  `status` VARCHAR(50) DEFAULT 'Active',
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. ATTENDANCE
CREATE TABLE IF NOT EXISTS `attendance` (
  `id` VARCHAR(50) NOT NULL,
  `employee_id` VARCHAR(50) NOT NULL,
  `date` VARCHAR(50) NOT NULL,
  `clock_in` VARCHAR(50) DEFAULT '',
  `clock_out` VARCHAR(50) DEFAULT '',
  `hours` DECIMAL(6, 2) DEFAULT 0.00,
  `status` VARCHAR(50) DEFAULT 'Present',
  `late` VARCHAR(20) DEFAULT 'No',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_att_emp_date` (`employee_id`, `date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. LEAVES
CREATE TABLE IF NOT EXISTS `leaves` (
  `id` VARCHAR(50) NOT NULL,
  `employee_id` VARCHAR(50) NOT NULL,
  `leave_type` VARCHAR(100) NOT NULL,
  `start_date` VARCHAR(50) NOT NULL,
  `end_date` VARCHAR(50) NOT NULL,
  `total_days` INT DEFAULT 1,
  `reason` TEXT DEFAULT NULL,
  `status` VARCHAR(50) DEFAULT 'Pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_leave_emp` (`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. LEAVE ALLOCATIONS
CREATE TABLE IF NOT EXISTS `leave_allocations` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `employee_id` VARCHAR(50) NOT NULL,
  `allocation_type` VARCHAR(50) DEFAULT 'monthly',
  `allowance` INT DEFAULT 4,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_alloc_emp` (`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. TASKS
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` VARCHAR(50) NOT NULL,
  `task_name` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `client_id` VARCHAR(50) DEFAULT '',
  `service_id` VARCHAR(50) DEFAULT '',
  `assigned_employee_id` VARCHAR(50) DEFAULT '',
  `priority` VARCHAR(50) DEFAULT 'Medium',
  `start_date` VARCHAR(50) DEFAULT '',
  `due_date` VARCHAR(50) DEFAULT '',
  `est_hours` DECIMAL(6, 2) DEFAULT 0.00,
  `progress` INT DEFAULT 0,
  `status` VARCHAR(50) DEFAULT 'Pending',
  `comments` LONGTEXT DEFAULT NULL,
  `attachments` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_task_emp` (`assigned_employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. PAYMENTS
CREATE TABLE IF NOT EXISTS `payments` (
  `id` VARCHAR(50) NOT NULL,
  `invoice_no` VARCHAR(100) DEFAULT '',
  `client_id` VARCHAR(50) NOT NULL,
  `amount` DECIMAL(12, 2) NOT NULL,
  `date` VARCHAR(50) NOT NULL,
  `payment_mode` VARCHAR(100) DEFAULT 'Bank Transfer',
  `transaction_id` VARCHAR(100) DEFAULT '',
  `received_by_id` VARCHAR(50) DEFAULT '',
  `remarks` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. INVOICES
CREATE TABLE IF NOT EXISTS `invoices` (
  `id` VARCHAR(50) NOT NULL,
  `client_id` VARCHAR(50) NOT NULL,
  `invoice_date` VARCHAR(50) NOT NULL,
  `due_date` VARCHAR(50) NOT NULL,
  `service_id` VARCHAR(50) DEFAULT '',
  `gross_amount` DECIMAL(12, 2) NOT NULL,
  `gst_rate` DECIMAL(5, 2) DEFAULT 18.00,
  `gst_amount` DECIMAL(12, 2) DEFAULT 0.00,
  `discount` DECIMAL(12, 2) DEFAULT 0.00,
  `net_amount` DECIMAL(12, 2) NOT NULL,
  `status` VARCHAR(50) DEFAULT 'Pending Payment',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. FOLLOWUPS
CREATE TABLE IF NOT EXISTS `followups` (
  `id` VARCHAR(50) NOT NULL,
  `client_id` VARCHAR(50) NOT NULL,
  `last_contact` VARCHAR(50) DEFAULT '',
  `next_followup` VARCHAR(50) NOT NULL,
  `type` VARCHAR(50) DEFAULT 'WhatsApp',
  `assigned_employee_id` VARCHAR(50) DEFAULT '',
  `status` VARCHAR(50) DEFAULT 'Pending',
  `remarks` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. REMINDERS
CREATE TABLE IF NOT EXISTS `reminders` (
  `id` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `client_id` VARCHAR(50) DEFAULT '',
  `service_id` VARCHAR(50) DEFAULT '',
  `assigned_employee_id` VARCHAR(50) DEFAULT '',
  `reminder_date` VARCHAR(50) NOT NULL,
  `reminder_time` VARCHAR(50) DEFAULT '10:00',
  `priority` VARCHAR(50) DEFAULT 'Medium',
  `status` VARCHAR(50) DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. NOTES
CREATE TABLE IF NOT EXISTS `notes` (
  `id` VARCHAR(50) NOT NULL,
  `client_id` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `tags` LONGTEXT DEFAULT NULL,
  `created_by_id` VARCHAR(50) DEFAULT '',
  `date_created` VARCHAR(50) DEFAULT '',
  `pinned` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. META ADS
CREATE TABLE IF NOT EXISTS `meta_ads` (
  `id` VARCHAR(50) NOT NULL,
  `client_name` VARCHAR(255) NOT NULL,
  `campaign_name` VARCHAR(255) NOT NULL,
  `objective` VARCHAR(100) DEFAULT 'Lead Generation',
  `package_amount` DECIMAL(12, 2) DEFAULT 0.00,
  `ad_budget` DECIMAL(12, 2) DEFAULT 0.00,
  `start_date` VARCHAR(50) DEFAULT '',
  `end_date` VARCHAR(50) DEFAULT '',
  `renewal_date` VARCHAR(50) DEFAULT '',
  `status` VARCHAR(50) DEFAULT 'Running',
  `assigned_employee_id` VARCHAR(50) DEFAULT '',
  `remarks` TEXT DEFAULT NULL,
  `daily_performance` LONGTEXT DEFAULT NULL,
  `payments` LONGTEXT DEFAULT NULL,
  `notes` LONGTEXT DEFAULT NULL,
  `followups` LONGTEXT DEFAULT NULL,
  `timeline` LONGTEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. GOOGLE ADS
CREATE TABLE IF NOT EXISTS `google_ads` (
  `id` VARCHAR(50) NOT NULL,
  `client_id` VARCHAR(50) DEFAULT '',
  `campaign_name` VARCHAR(255) NOT NULL,
  `objective` VARCHAR(100) DEFAULT 'Sales / Signups',
  `package_amount` DECIMAL(12, 2) DEFAULT 0.00,
  `ad_budget` DECIMAL(12, 2) DEFAULT 0.00,
  `start_date` VARCHAR(50) DEFAULT '',
  `end_date` VARCHAR(50) DEFAULT '',
  `reach` INT DEFAULT 0,
  `clicks` INT DEFAULT 0,
  `leads` INT DEFAULT 0,
  `cpl` DECIMAL(10, 2) DEFAULT 0.00,
  `roas` DECIMAL(6, 2) DEFAULT 0.00,
  `status` VARCHAR(50) DEFAULT 'Running',
  `assigned_employee_id` VARCHAR(50) DEFAULT '',
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. SEO CAMPAIGNS
CREATE TABLE IF NOT EXISTS `seo` (
  `id` VARCHAR(50) NOT NULL,
  `client_id` VARCHAR(50) DEFAULT '',
  `website_url` VARCHAR(255) DEFAULT '',
  `campaign_name` VARCHAR(255) NOT NULL,
  `package` VARCHAR(100) DEFAULT 'Gold',
  `start_date` VARCHAR(50) DEFAULT '',
  `end_date` VARCHAR(50) DEFAULT '',
  `budget` DECIMAL(12, 2) DEFAULT 0.00,
  `status` VARCHAR(50) DEFAULT 'Active',
  `report_date` VARCHAR(50) DEFAULT '',
  `report_frequency` VARCHAR(50) DEFAULT 'Monthly',
  `target_keywords` VARCHAR(255) DEFAULT '',
  `current_ranking` VARCHAR(100) DEFAULT '',
  `articles_published` INT DEFAULT 0,
  `backlinks` INT DEFAULT 0,
  `report_file` VARCHAR(255) DEFAULT '',
  `assigned_employee_id` VARCHAR(50) DEFAULT '',
  `progress` INT DEFAULT 0,
  `notes` TEXT DEFAULT NULL,
  `keywords` LONGTEXT DEFAULT NULL,
  `weekly_log` LONGTEXT DEFAULT NULL,
  `uploaded_reports` LONGTEXT DEFAULT NULL,
  `ga4` LONGTEXT DEFAULT NULL,
  `gsc` LONGTEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 19. PROJECTS
CREATE TABLE IF NOT EXISTS `projects` (
  `id` VARCHAR(50) NOT NULL,
  `client_id` VARCHAR(50) DEFAULT '',
  `project_name` VARCHAR(255) NOT NULL,
  `website_type` VARCHAR(100) DEFAULT 'Custom Website Development',
  `domain` VARCHAR(255) DEFAULT '',
  `hosting` VARCHAR(100) DEFAULT 'Hostinger',
  `start_date` VARCHAR(50) DEFAULT '',
  `delivery_date` VARCHAR(50) DEFAULT '',
  `progress` INT DEFAULT 0,
  `assigned_developer_id` VARCHAR(50) DEFAULT '',
  `status` VARCHAR(50) DEFAULT 'Running',
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 20. CANVA SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS `canva` (
  `id` VARCHAR(50) NOT NULL,
  `client_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(150) DEFAULT '',
  `price` DECIMAL(10, 2) DEFAULT 499.00,
  `purchase_date` VARCHAR(50) DEFAULT '',
  `renewal_date` VARCHAR(50) DEFAULT '',
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 21. BILLING SOFTWARE SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS `billing_software` (
  `id` VARCHAR(50) NOT NULL,
  `client_name` VARCHAR(255) DEFAULT '',
  `company_name` VARCHAR(255) NOT NULL,
  `client_id` VARCHAR(50) DEFAULT '',
  `price` DECIMAL(10, 2) DEFAULT 0.00,
  `maintenance` DECIMAL(10, 2) DEFAULT 0.00,
  `purchase_date` VARCHAR(50) DEFAULT '',
  `renewal_date` VARCHAR(50) DEFAULT '',
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 22. TIMELINE EVENTS
CREATE TABLE IF NOT EXISTS `timeline` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `timestamp` VARCHAR(50) NOT NULL,
  `event_type` VARCHAR(50) DEFAULT 'info',
  `icon` VARCHAR(50) DEFAULT 'fa-info-circle',
  `text` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 23. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `type` VARCHAR(50) DEFAULT 'info',
  `date` VARCHAR(50) DEFAULT '',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 24. SETTINGS
CREATE TABLE IF NOT EXISTS `settings` (
  `setting_key` VARCHAR(100) NOT NULL,
  `setting_value` TEXT DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- SEED DATA INSERTION
-- Default admin & initial records from mock seed
-- ==========================================================

-- Seed Employees (All passwords hashed with bcrypt: 'admin123' for Admin/CEO/CTO, '123456' for Employees)
INSERT INTO `employees` (`id`, `name`, `email`, `phone`, `username`, `password_hash`, `department`, `designation`, `role`, `joining_date`, `salary`, `manager_id`, `status`, `photo`, `permissions`)
VALUES
('E001', 'Ankit Kumar', 'admin@thynkdigital.in', '9876598765', 'admin', '$2y$10$CwxDbwNh5H2AhJ/Air2ArOISiY9zOH4wkddxZXBEMx2ZclBGIT2uq', 'Development', 'Lead Web Developer', 'Administrator', '2023-05-15', 75000.00, 'Admin', 'Active', 'https://randomuser.me/api/portraits/men/32.jpg', '{\"crm\":true,\"hrms\":true,\"accounts\":true,\"marketing\":true,\"admin\":true}'),
('E002', 'Neha Sharma', 'neha@thynkdigital.in', '9811223344', 'neha', '$2y$10$3SUI8p9zQwsmapk1nGx.5OGcEhAExbBf.12tYMfq38vRK5CO5PrLy', 'Digital Marketing', 'Meta Ads Specialist', 'Employee', '2024-02-01', 45000.00, 'Admin', 'Active', 'https://randomuser.me/api/portraits/women/44.jpg', '{\"crm\":true,\"hrms\":true,\"accounts\":false,\"marketing\":true,\"admin\":false}'),
('E003', 'Sneha Patel', 'sneha@thynkdigital.in', '9900991122', 'sneha', '$2y$10$3SUI8p9zQwsmapk1nGx.5OGcEhAExbBf.12tYMfq38vRK5CO5PrLy', 'Client Relations', 'Account Manager', 'Employee', '2024-09-10', 40000.00, 'Admin', 'Active', 'https://randomuser.me/api/portraits/women/68.jpg', '{\"crm\":true,\"hrms\":true,\"accounts\":true,\"marketing\":false,\"admin\":false}'),
('E004', 'Deepak Rawat', 'deepak@thynkdigital.in', '8877665544', 'deepak', '$2y$10$3SUI8p9zQwsmapk1nGx.5OGcEhAExbBf.12tYMfq38vRK5CO5PrLy', 'Digital Marketing', 'SEO Lead', 'Employee', '2024-01-20', 50000.00, 'Admin', 'Active', 'https://randomuser.me/api/portraits/men/85.jpg', '{\"crm\":false,\"hrms\":true,\"accounts\":false,\"marketing\":true,\"admin\":false}'),
('E005', 'Rahul Verma', 'ceo@thynkdigital.in', '9876500001', 'ceo', '$2y$10$CwxDbwNh5H2AhJ/Air2ArOISiY9zOH4wkddxZXBEMx2ZclBGIT2uq', 'Executive', 'Chief Executive Officer', 'CEO', '2022-01-01', 150000.00, 'Admin', 'Active', 'https://randomuser.me/api/portraits/men/11.jpg', '{\"crm\":true,\"hrms\":true,\"accounts\":true,\"marketing\":true,\"admin\":true}'),
('E006', 'Rajesh Nair', 'cto@thynkdigital.in', '9876500002', 'cto', '$2y$10$CwxDbwNh5H2AhJ/Air2ArOISiY9zOH4wkddxZXBEMx2ZclBGIT2uq', 'Technology', 'Chief Technology Officer', 'CTO', '2022-01-01', 140000.00, 'Admin', 'Active', 'https://randomuser.me/api/portraits/men/22.jpg', '{\"crm\":true,\"hrms\":true,\"accounts\":true,\"marketing\":true,\"admin\":true}')
ON DUPLICATE KEY UPDATE `password_hash`=VALUES(`password_hash`), `permissions`=VALUES(`permissions`), `role`=VALUES(`role`), `designation`=VALUES(`designation`);

-- Seed Clients
INSERT INTO `clients` (`id`, `company_name`, `client_name`, `mobile`, `whatsapp`, `email`, `website`, `category`, `gst`, `address`, `city`, `state`, `country`, `logo`, `source`, `assigned_employee_id`, `status`, `priority`, `date_created`)
VALUES
('C001', 'Zenith Tech Labs', 'Rahul Sen', '9876501234', '9876501234', 'rahul@zenithlabs.com', 'https://www.zenithlabs.com', 'IT Services', '27AAAAA1111A1Z1', '402, Supreme Chambers, Andheri West', 'Mumbai', 'Maharashtra', 'India', 'Z', 'Google Ads', 'E001', 'Active', 'High', '2025-01-10'),
('C002', 'Bella Vita Salon & Spa', 'Priya Nair', '9820011223', '9820011223', 'priya@bellavitasalon.in', 'https://www.bellavitasalon.in', 'Beauty & Wellness', '27BBBBB2222B2Z2', 'G-12, Ground Floor, Galleria Mall', 'Bengaluru', 'Karnataka', 'India', 'B', 'Instagram Outreach', 'E003', 'Active', 'Medium', '2025-03-15'),
('C003', 'Nutan Builders & Developers', 'Amit Shah', '9930055443', '9930055443', 'info@nutanbuilders.com', 'https://www.nutanbuilders.com', 'Real Estate', '', '101, Nutan Heights, SV Road, Bandra', 'Mumbai', 'Maharashtra', 'India', 'N', 'Referral', 'E002', 'Active', 'High', '2024-11-20'),
('C004', 'Globex Logistics', 'John D''Souza', '9167008899', '9167008899', 'operations@globexlogistics.co.in', 'https://www.globexlogistics.co.in', 'Logistics', '27CCCCC3333C3Z3', 'Building No. 5, Sector 17, Vashi', 'Navi Mumbai', 'Maharashtra', 'India', 'G', 'LinkedIn', 'E004', 'Inactive', 'Low', '2024-05-05'),
('C006', 'ABC Builders', 'Rakesh Gupta', '9911223344', '9911223344', 'info@abcbuilders.com', 'https://www.abcbuilders.com', 'Real Estate', '27ABCB1234A1Z1', 'Building B, Central Avenue', 'Mumbai', 'Maharashtra', 'India', 'A', 'Referral', 'E002', 'Active', 'Medium', '2026-01-01'),
('C008', 'RIG Fabrication', 'Ravi', '9988776655', '9988776655', 'contact@rigearthing.com', 'https://www.rigearthing.com/', 'Industrial Manufacturing', '27RIGE1234C1Z1', 'GIDC Industrial Estate', 'Vadodara', 'Gujarat', 'India', 'R', 'Google Search', 'E001', 'Active', 'High', '2024-05-15'),
('C009', 'Indus Dental Care', 'Sudharshan', '9876123456', '9876123456', 'appointments@indusdentalcare.com', 'https://www.indusdentalcare.com/', 'Healthcare', '27INDD1234D1Z1', 'Flat 2, Prime Avenue, MG Road', 'Pune', 'Maharashtra', 'India', 'I', 'Instagram Outreach', 'E003', 'Active', 'Medium', '2024-10-28'),
('C010', 'Agtechnosolutions', 'Arun', '9821102233', '9821102233', 'arun@agtechnosolutions.in', 'https://agtechnosolutions.in/', 'IT Services', '', '12, Tech Park, Phase 1', 'Chennai', 'Tamil Nadu', 'India', 'A', 'Referral', 'E001', 'Active', 'Medium', '2026-06-06'),
('C011', 'Indus Flooring', 'Sudharshan', '9834455667', '9834455667', 'sudharshan@indusconcretepolishing.com', 'https://indusconcretepolishing.com/', 'Flooring & Construction', '', 'Industrial Area Gate 3', 'Coimbatore', 'Tamil Nadu', 'India', 'I', 'Google Search', 'E003', 'Active', 'Medium', '2025-07-16'),
('C012', 'Thynk Digital', 'Gokul', '9876543210', '9876543210', 'gokul@thynkdigitalsolutions.com', 'https://www.thynkdigitalsolutions.com/', 'Digital Agency', '', 'Main Road, Cross 2', 'Coimbatore', 'Tamil Nadu', 'India', 'T', 'Direct', 'E002', 'Active', 'High', '2025-08-27'),
('C013', 'MPS Hospital .IN', 'Manikandan', '9812233445', '9812233445', 'manikandan@mpshospitals.in', 'https://mpshospitals.in/', 'Healthcare', '', 'MPS Road, City Center', 'Salem', 'Tamil Nadu', 'India', 'M', 'Referral', 'E004', 'Active', 'Medium', '2024-09-08'),
('C014', 'MPS Hospital .com', 'Manikandan', '9812233445', '9812233445', 'manikandan@mpshospitals.com', 'https://mpshospitals.com/', 'Healthcare', '', 'MPS Road, City Center', 'Salem', 'Tamil Nadu', 'India', 'M', 'Referral', 'E004', 'Active', 'Medium', '2024-09-08'),
('C015', 'Wincube Solutions', 'Raj Kumar', '9894455667', '9894455667', 'rajkumar@wincube5s.com', 'https://www.wincube5s.com/', 'Consulting', '', '5S Office Block, G-3', 'Erode', 'Tamil Nadu', 'India', 'W', 'LinkedIn Outreach', 'E002', 'Active', 'Medium', '2026-06-28')
ON DUPLICATE KEY UPDATE `company_name`=VALUES(`company_name`);

-- Seed Leads
INSERT INTO `leads` (`id`, `company_name`, `contact_name`, `mobile`, `email`, `source`, `value`, `status`, `assigned_employee_id`, `notes`, `date_created`)
VALUES
('L001', 'Nexus Retailers', 'Ananya Sharma', '9876543210', 'contact@nexusretail.com', 'Website Inquiry', 45000.00, 'Hot', 'E002', 'Very interested in Meta Ads packages.', '2026-06-15'),
('L002', 'Apex Wellness Cafe', 'Rohan Verma', '9812345678', 'info@apexwellness.in', 'Instagram DM', 30000.00, 'Warm', 'E003', 'Needs logo and local SEO optimization.', '2026-06-20'),
('L003', 'Trident Logistics', 'Vikram Malhotra', '8888777766', 'v.malhotra@tridentlog.com', 'LinkedIn Outreach', 120000.00, 'Cold', 'E001', 'Sent agency pitch deck. Waiting for reply.', '2026-06-10'),
('L004', 'Saffron Spices Co.', 'Pooja Patel', '7776665554', 'sales@saffronspices.com', 'Referral', 85000.00, 'Hot', 'E004', 'Needs Website development and SEO package.', '2026-06-25'),
('L005', 'Zenith Realties', 'Kabir Mehta', '9900990099', 'info@zenithrealty.in', 'Google Search', 200000.00, 'Warm', 'E002', 'Inquired about Meta + Google Ads lead generation.', '2026-06-22')
ON DUPLICATE KEY UPDATE `company_name`=VALUES(`company_name`);

-- Seed Services
INSERT INTO `services` (`id`, `client_id`, `service_name`, `package`, `start_date`, `end_date`, `renewal_date`, `assigned_employee_id`, `cost`, `discount`, `final_amount`, `status`, `notes`)
VALUES
('S001', 'C001', 'Meta Ads Management', 'Growth Pro', '2026-01-10', '2026-07-10', '2026-07-10', 'E002', 60000.00, 5000.00, 55000.00, 'Running', 'Focus on B2B courses.'),
('S002', 'C001', 'SEO Management', 'Enterprise SEO', '2026-01-10', '2027-01-10', '2027-01-10', 'E004', 120000.00, 10000.00, 110000.00, 'Running', 'Targeting high value IT keywords globally.'),
('S003', 'C008', 'Hosting Renewal', 'RIG Earthing Hosting', '2023-05-15', '2024-05-15', '2024-05-15', 'E001', 2557.00, 0.00, 2557.00, 'Expired', 'Domain: rigearthing.com'),
('S004', 'C010', 'Domain Renewal', 'Agtechno Domain & Hosting', '2026-06-06', '2027-06-06', '2027-06-06', 'E001', 3800.00, 0.00, 3800.00, 'Running', 'Domain: agtechnosolutions.in'),
('S005', 'C002', 'Social Media Management', 'Essential Branding', '2026-03-15', '2026-09-15', '2026-09-15', 'E003', 35000.00, 2000.00, 33000.00, 'Running', '12 Posts/month + Reels editing.'),
('S006', 'C002', 'Meta Ads Management', 'Starter Lead Gen', '2026-03-20', '2026-06-20', '2026-07-20', 'E003', 25000.00, 0.00, 25000.00, 'Expired', 'Beauty package lead generation.'),
('S007', 'C003', 'Website Development', 'Custom WordPress Portal', '2026-05-10', '2026-07-15', '2026-07-15', 'E001', 150000.00, 15000.00, 135000.00, 'Running', 'RERA compliant builder site with inventory listing.'),
('S008', 'C011', 'Hosting Renewal', 'Indus Concrete Hosting', '2024-07-16', '2025-07-16', '2025-07-16', 'E001', 2440.00, 0.00, 2440.00, 'Expired', 'Domain: indusconcretepolishing.com'),
('S009', 'C012', 'Domain Renewal', 'Thynk Domain & Hosting', '2024-08-27', '2025-08-27', '2025-08-27', 'E001', 2440.00, 0.00, 2440.00, 'Expired', 'Domain: thynkdigitalsolutions.com'),
('S010', 'C004', 'Google Ads Management', 'B2B Standard', '2025-05-05', '2026-05-05', '2026-05-05', 'E004', 40000.00, 4000.00, 36000.00, 'Expired', 'Paused since client account inactive.')
ON DUPLICATE KEY UPDATE `service_name`=VALUES(`service_name`);

-- Seed Domains
INSERT INTO `domains` (`id`, `client_id`, `domain_name`, `registrar`, `registration_date`, `expiry_date`, `renewal_date`, `auto_renewal`, `status`, `renewal_cost`, `dns_status`, `ssl_status`, `nameservers`, `credentials_placeholder`, `notes`)
VALUES
('D001', 'C008', 'rigearthing.com', 'GoDaddy', '2023-05-15', '2024-05-15', '2024-05-15', 'No', 'Expired', 1200.00, 'OK', 'Expired', 'ns1.godaddy.com, ns2.godaddy.com', 'Managed on client profile', 'Payment Status: Paid. Remarks: 2,557'),
('D002', 'C010', 'agtechnosolutions.in', 'Hostinger', '2026-06-06', '2027-06-06', '2027-06-06', 'Yes', 'Active', 1300.00, 'OK', 'Active', 'ns1.dns-serv.com, ns2.dns-serv.com', 'Username: agtechno | Pass: **********', 'Purchased Date: 06/06/2026. Payment Status: Paid.'),
('D003', 'C011', 'indusconcretepolishing.com', 'Namecheap', '2024-07-16', '2025-07-16', '2025-07-16', 'No', 'Expired', 1000.00, 'OK', 'Expired', 'dns1.namecheaphosting.com, dns2.namecheaphosting.com', 'Managed on client profile', 'Yearly Maintenance: 5000. Remarks: 2440.'),
('D004', 'C012', 'thynkdigitalsolutions.com', 'GoDaddy', '2024-08-27', '2025-08-27', '2025-08-27', 'No', 'Expired', 1000.00, 'OK', 'Expired', 'ns3.godaddy.com, ns4.godaddy.com', 'Managed on client profile', 'Remarks: 2440.'),
('D005', 'C013', 'mpshospitals.in', 'Hostinger', '2023-09-08', '2024-09-08', '2024-09-08', 'No', 'Expired', 1261.00, 'OK', 'Expired', 'ns1.hostinger.com, ns2.hostinger.com', 'Username: mpshosp | Pass: **********', 'Remarks: 1951 + 1261 (1261 domain, 1951 hosting).'),
('D006', 'C014', 'mpshospitals.com', 'Hostinger', '2023-09-08', '2024-09-08', '2024-09-08', 'No', 'Expired', 1179.00, 'OK', 'Expired', 'ns1.hostinger.com, ns2.hostinger.com', 'Username: mpshosp | Pass: **********', 'Remarks: 1179.'),
('D007', 'C009', 'indusdentalcare.com', 'GoDaddy', '2023-10-28', '2024-10-28', '2024-10-28', 'No', 'Expired', 1200.00, 'OK', 'Expired', 'ns5.godaddy.com, ns6.godaddy.com', 'Managed on client profile', 'Remarks: 2522.'),
('D008', 'C015', 'wincube5s.com', 'Hostinger', '2025-11-02', '2026-11-02', '2026-11-02', 'Yes', 'Active', 1440.00, 'OK', 'Active', 'ns1.hostinger.com, ns2.hostinger.com', 'Username: wincube | Pass: **********', 'Remarks: 1,440.')
ON DUPLICATE KEY UPDATE `domain_name`=VALUES(`domain_name`);

-- Seed Hostings
INSERT INTO `hostings` (`id`, `client_id`, `hosting_provider`, `hosting_plan`, `server_type`, `purchase_date`, `expiry_date`, `renewal_date`, `renewal_cost`, `disk_space`, `bandwidth`, `control_panel`, `ssl_expiry`, `backup_status`, `status`, `notes`)
VALUES
('H001', 'C008', 'Hostinger', 'Premium Shared Hosting', 'Linux', '2023-05-15', '2024-05-15', '2024-05-15', 1357.00, '100 GB SSD', 'Unlimited', 'hPanel', '2024-05-15', 'Weekly Auto', 'Expired', 'Remarks: 2,557. Payment Status: Paid.'),
('H002', 'C010', 'Hostinger', 'Cloud Startup', 'Linux', '2026-06-06', '2027-06-06', '2027-06-06', 2500.00, '200 GB SSD', 'Unlimited', 'hPanel', '2027-06-06', 'Daily Auto', 'Active', 'Purchased Date: 06/06/2026. Payment Status: Paid.'),
('H003', 'C011', 'Hostinger', 'Premium Shared', 'Linux', '2024-07-16', '2025-07-16', '2025-07-16', 1440.00, '100 GB', 'Unlimited', 'hPanel', '2025-07-16', 'Weekly Auto', 'Expired', 'Yearly Maintenance: 5000. Remarks: 2440.'),
('H004', 'C012', 'Hostinger', 'Cloud Professional', 'Linux', '2024-08-27', '2025-08-27', '2025-08-27', 1440.00, '250 GB', 'Unlimited', 'hPanel', '2025-08-27', 'Daily Auto', 'Expired', 'Remarks: 2440.'),
('H005', 'C013', 'Hostinger', 'Premium Shared', 'Linux', '2023-09-08', '2024-09-08', '2024-09-08', 1951.00, '100 GB', 'Unlimited', 'hPanel', '2024-09-08', 'Weekly Auto', 'Expired', 'Remarks: 1951 + 1261 (1951 hosting, 1261 domain).'),
('H006', 'C014', 'Hostinger', 'Premium Shared', 'Linux', '2023-09-08', '2024-09-08', '2024-09-08', 0.00, '100 GB', 'Unlimited', 'hPanel', '2024-09-08', 'Weekly Auto', 'Expired', 'Remarks: 1179.'),
('H007', 'C009', 'Hostinger', 'Premium Shared', 'Linux', '2023-10-28', '2024-10-28', '2024-10-28', 1322.00, '100 GB', 'Unlimited', 'hPanel', '2024-10-28', 'Weekly Auto', 'Expired', 'Remarks: 2522.'),
('H008', 'C015', 'Hostinger', 'Single Shared', 'Linux', '2025-11-02', '2026-11-02', '2026-11-02', 0.00, '50 GB', '100 GB', 'hPanel', '2026-11-02', 'Weekly Auto', 'Active', 'Remarks: 1,440.')
ON DUPLICATE KEY UPDATE `hosting_provider`=VALUES(`hosting_provider`);

-- Seed Attendance
INSERT INTO `attendance` (`id`, `employee_id`, `date`, `clock_in`, `clock_out`, `hours`, `status`, `late`)
VALUES
('A001', 'E001', '2026-06-26', '09:15', '18:30', 9.25, 'Present', 'No'),
('A002', 'E002', '2026-06-26', '09:48', '18:00', 8.20, 'Late Entry', 'Yes'),
('A003', 'E003', '2026-06-26', '09:05', '18:00', 8.92, 'Present', 'No'),
('A004', 'E004', '2026-06-26', '', '', 0.00, 'Absent', 'No'),
('A005', 'E001', '2026-06-25', '09:08', '18:15', 9.12, 'Present', 'No'),
('A006', 'E002', '2026-06-25', '09:20', '18:05', 8.75, 'Present', 'No'),
('A007', 'E003', '2026-06-25', '09:02', '18:10', 9.13, 'Present', 'No'),
('A008', 'E004', '2026-06-25', '09:12', '18:00', 8.80, 'Present', 'No')
ON DUPLICATE KEY UPDATE `status`=VALUES(`status`);

-- Seed Leaves
INSERT INTO `leaves` (`id`, `employee_id`, `leave_type`, `start_date`, `end_date`, `total_days`, `reason`, `status`)
VALUES
('L01', 'E002', 'Sick Leave', '2026-06-12', '2026-06-13', 2, 'Viral fever', 'Approved'),
('L02', 'E004', 'Casual Leave', '2026-06-29', '2026-06-30', 2, 'Family event out of town', 'Approved'),
('L03', 'E001', 'Privilege Leave', '2026-07-15', '2026-07-20', 5, 'Summer vacation trip', 'Pending')
ON DUPLICATE KEY UPDATE `status`=VALUES(`status`);

-- Seed Leave Allocations
INSERT INTO `leave_allocations` (`employee_id`, `allocation_type`, `allowance`)
VALUES
('E001', 'monthly', 4),
('E002', 'monthly', 4),
('E003', 'monthly', 4),
('E004', 'monthly', 4)
ON DUPLICATE KEY UPDATE `allowance`=VALUES(`allowance`);

-- Seed Tasks
INSERT INTO `tasks` (`id`, `task_name`, `description`, `client_id`, `service_id`, `assigned_employee_id`, `priority`, `start_date`, `due_date`, `est_hours`, `progress`, `status`, `comments`, `attachments`)
VALUES
('T001', 'Set up Nutan builders database schema', 'Design proper RERA inventory mappings.', 'C003', 'S007', 'E001', 'High', '2026-05-15', '2026-06-15', 12.00, 100, 'Completed', '[]', 0),
('T002', 'Design site mockups for Amit feedback', 'Develop mobile prototypes.', 'C003', 'S007', 'E001', 'High', '2026-06-10', '2026-06-28', 20.00, 85, 'In Progress', '[]', 1),
('T003', 'Review Zenith Lead quality logs', 'Evaluate target filters optimization.', 'C001', 'S001', 'E002', 'Medium', '2026-06-20', '2026-06-28', 6.00, 60, 'In Progress', '[]', 0),
('T005', 'Perform audit on Zenith target IT keywords', 'Determine backlink gap vs main competitors.', 'C001', 'S002', 'E004', 'High', '2026-06-22', '2026-06-27', 10.00, 90, 'Review', '[]', 2)
ON DUPLICATE KEY UPDATE `task_name`=VALUES(`task_name`);

-- Seed Payments
INSERT INTO `payments` (`id`, `invoice_no`, `client_id`, `amount`, `date`, `payment_mode`, `transaction_id`, `received_by_id`, `remarks`)
VALUES
('PAY001', 'INV-2026-001', 'C001', 30000.00, '2026-01-12', 'Bank Transfer', 'TXN987654321A', 'E001', 'First advance payment for Meta Ads Setup'),
('PAY002', 'INV-2026-001', 'C001', 25000.00, '2026-02-15', 'UPI / GPay', 'TXN123456789B', 'E001', 'Final settlement for invoice 001'),
('PAY003', 'INV-2026-002', 'C001', 50000.00, '2026-01-20', 'Bank Transfer', 'TXN345678901C', 'E001', 'First milestone payment for Enterprise SEO'),
('PAY004', 'INV-2026-003', 'C002', 15000.00, '2026-03-18', 'UPI / PhonePe', 'TXN555666777D', 'E003', 'Social Media branding start budget'),
('PAY005', 'INV-2026-004', 'C003', 70000.00, '2026-05-12', 'Bank Transfer', 'TXN777888999E', 'E001', 'Advance for WordPress Portal')
ON DUPLICATE KEY UPDATE `amount`=VALUES(`amount`);

-- Seed Invoices
INSERT INTO `invoices` (`id`, `client_id`, `invoice_date`, `due_date`, `service_id`, `gross_amount`, `gst_rate`, `gst_amount`, `discount`, `net_amount`, `status`)
VALUES
('INV-2026-001', 'C001', '2026-01-10', '2026-01-20', 'S001', 55000.00, 18.00, 9900.00, 0.00, 64900.00, 'Paid'),
('INV-2026-002', 'C001', '2026-01-10', '2026-01-25', 'S002', 110000.00, 18.00, 19800.00, 5000.00, 124800.00, 'Partial'),
('INV-2026-003', 'C002', '2026-03-15', '2026-03-30', 'S005', 33000.00, 18.00, 5940.00, 0.00, 38940.00, 'Partial'),
('INV-2026-004', 'C003', '2026-05-10', '2026-05-25', 'S007', 135000.00, 18.00, 24300.00, 10000.00, 149300.00, 'Partial'),
('INV-2026-005', 'C004', '2025-05-05', '2025-05-20', 'S010', 36000.00, 18.00, 6480.00, 0.00, 42480.00, 'Pending Payment')
ON DUPLICATE KEY UPDATE `gross_amount`=VALUES(`gross_amount`);

-- Seed Followups
INSERT INTO `followups` (`id`, `client_id`, `last_contact`, `next_followup`, `type`, `assigned_employee_id`, `status`, `remarks`)
VALUES
('F001', 'C001', '2026-06-20', '2026-07-02', 'WhatsApp', 'E002', 'Pending', 'Ask about Lead Quality reports reviews.'),
('F002', 'C002', '2026-06-18', '2026-06-27', 'Phone Call', 'E003', 'Pending', 'Follow-up regarding salon campaign renewal budget.'),
('F003', 'C003', '2026-06-25', '2026-06-28', 'Meeting', 'E001', 'Pending', 'Review website landing pages structure.')
ON DUPLICATE KEY UPDATE `status`=VALUES(`status`);

-- Seed Reminders
INSERT INTO `reminders` (`id`, `title`, `description`, `client_id`, `service_id`, `assigned_employee_id`, `reminder_date`, `reminder_time`, `priority`, `status`)
VALUES
('R001', 'RIG Fabrication Hosting Expired', 'RIG Fabrication hosting has expired. Follow up with Ravi for payment of ₹2,557.', 'C008', 'S003', 'E001', '2026-06-28', '11:00', 'High', 'Active'),
('R002', 'Client Call - Priya Nair', 'Discuss Salon Meta Ads packages renewal budgets.', 'C002', 'S006', 'E003', '2026-06-27', '15:30', 'Medium', 'Active'),
('R003', 'Agtechnosolutions Domain & Hosting Active', 'Agtechnosolutions domain & hosting active until June 2027.', 'C010', 'S004', 'E001', '2026-07-12', '10:00', 'High', 'Active'),
('R004', 'Generate Monthly SEO Report', 'Publish monthly IT keywords report card.', 'C001', 'S002', 'E004', '2026-07-01', '18:00', 'Medium', 'Active')
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- Seed Notes
INSERT INTO `notes` (`id`, `client_id`, `title`, `description`, `tags`, `created_by_id`, `date_created`, `pinned`)
VALUES
('N001', 'C001', 'B2B Meta Ads Strategy', 'Targeting CEOs, CTOs, and HR heads. Ad creative must emphasize efficiency gains.', '[\"Strategy\", \"Ads\"]', 'E002', '2026-06-18 10:20:00', 1),
('N002', 'C001', 'SEO Keyword Refinement', 'Include terms like AI staff augmentation and cloud consulting firms explicitly in future blog briefs.', '[\"SEO\", \"Content\"]', 'E004', '2026-06-22 14:15:00', 0),
('N003', 'C003', 'Website Styling Preferences', 'Amit prefers minimal layout, white backgrounds with blue accents, and responsive maps widget.', '[\"WebDev\", \"Styling\"]', 'E001', '2026-05-15 16:45:00', 1)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- Seed Meta Ads
INSERT INTO `meta_ads` (`id`, `client_name`, `campaign_name`, `objective`, `package_amount`, `ad_budget`, `start_date`, `end_date`, `renewal_date`, `status`, `assigned_employee_id`, `remarks`, `daily_performance`, `payments`, `notes`, `followups`, `timeline`)
VALUES
('MC001', 'RIG Fabrication', 'Earthing Leads', 'Lead Generation', 15000.00, 10000.00, '2026-07-01', '2026-07-31', '2026-07-31', 'Running', 'E002', 'Good response so far',
 '[{\"date\":\"2026-07-01\",\"adSpend\":350,\"reach\":2850,\"clicks\":78,\"leads\":6,\"remarks\":\"Good response\"},{\"date\":\"2026-07-02\",\"adSpend\":420,\"reach\":3420,\"clicks\":95,\"leads\":9,\"remarks\":\"CPL improved\"},{\"date\":\"2026-07-03\",\"adSpend\":380,\"reach\":3100,\"clicks\":82,\"leads\":7,\"remarks\":\"Stable performance\"}]',
 '[{\"date\":\"2026-07-01\",\"amount\":5000,\"mode\":\"UPI\",\"transactionId\":\"TXN123\",\"remarks\":\"Advance\"},{\"date\":\"2026-07-10\",\"amount\":5000,\"mode\":\"Bank Transfer\",\"transactionId\":\"TXN155\",\"remarks\":\"Second Payment\"},{\"date\":\"2026-07-28\",\"amount\":5000,\"mode\":\"Cash\",\"transactionId\":\"TXN199\",\"remarks\":\"Final Payment\"}]',
 '[{\"id\":\"MN101\",\"title\":\"Budget Adjustment\",\"description\":\"Increased daily budget limit to capture peak hour traffic.\",\"date\":\"2026-07-02 10:00\",\"createdBy\":\"Neha Sharma\",\"priority\":\"Medium\",\"tags\":\"Budget\"},{\"id\":\"MN102\",\"title\":\"Creative Refresh\",\"description\":\"Uploaded new Earth-rod product display banners.\",\"date\":\"2026-07-05 14:30\",\"createdBy\":\"Neha Sharma\",\"priority\":\"Low\",\"tags\":\"Creative\"}]',
 '[{\"id\":\"MF101\",\"date\":\"2026-07-01\",\"nextFollowup\":\"2026-07-05\",\"type\":\"WhatsApp\",\"summary\":\"Sent onboarding checklist for Meta campaign\",\"assignedEmployeeId\":\"E002\",\"status\":\"Completed\"},{\"id\":\"MF102\",\"date\":\"2026-07-05\",\"nextFollowup\":\"2026-07-15\",\"type\":\"Phone Call\",\"summary\":\"Reviewed week 1 leads sheet with client\",\"assignedEmployeeId\":\"E002\",\"status\":\"Completed\"}]',
 '[{\"timestamp\":\"2026-07-01 09:00:00\",\"text\":\"Campaign Created\",\"icon\":\"fa-plus\",\"eventType\":\"create\"},{\"timestamp\":\"2026-07-01 18:30:00\",\"text\":\"Daily Performance Added\",\"icon\":\"fa-chart-line\",\"eventType\":\"performance\"},{\"timestamp\":\"2026-07-02 10:00:00\",\"text\":\"Budget Increased to ₹500/day\",\"icon\":\"fa-arrow-up\",\"eventType\":\"budget\"},{\"timestamp\":\"2026-07-05 12:00:00\",\"text\":\"₹5,000 Payment Received\",\"icon\":\"fa-receipt\",\"eventType\":\"payment\"}]'),
('MC002', 'RIG Fabrication', 'Lightning Arrestor', 'WhatsApp Leads', 20000.00, 12000.00, '2026-06-15', '2026-07-15', '2026-07-15', 'Completed', 'E002', 'High conversions',
 '[{\"date\":\"2026-06-15\",\"adSpend\":400,\"reach\":3100,\"clicks\":88,\"leads\":8,\"remarks\":\"Launched successfully\"},{\"date\":\"2026-06-16\",\"adSpend\":410,\"reach\":3200,\"clicks\":90,\"leads\":9,\"remarks\":\"Consistent response\"}]',
 '[{\"date\":\"2026-06-15\",\"amount\":10000,\"mode\":\"UPI\",\"transactionId\":\"TXN150\",\"remarks\":\"50% Advance\"},{\"date\":\"2026-07-15\",\"amount\":10000,\"mode\":\"UPI\",\"transactionId\":\"TXN151\",\"remarks\":\"Final Settlement\"}]',
 '[]', '[]',
 '[{\"timestamp\":\"2026-06-15 09:30:00\",\"text\":\"Campaign Created\",\"icon\":\"fa-plus\",\"eventType\":\"create\"}]'),
('MC003', 'RIG Fabrication', 'GI Strip Campaign', 'Messages', 10000.00, 7000.00, '2026-08-01', '2026-08-31', '2026-08-31', 'Scheduled', 'E002', 'Banners approved by client',
 '[]',
 '[{\"date\":\"2026-06-25\",\"amount\":5000,\"mode\":\"UPI\",\"transactionId\":\"TXN180\",\"remarks\":\"Initial token booking amount\"}]',
 '[]', '[]',
 '[{\"timestamp\":\"2026-06-25 11:00:00\",\"text\":\"Campaign Scheduled & Token Received\",\"icon\":\"fa-calendar\",\"eventType\":\"schedule\"}]'),
('MC004', 'Indus Dental Care', 'Dental Implants Campaign', 'Lead Generation', 12000.00, 8000.00, '2026-02-01', '2026-02-28', '2026-02-28', 'Completed', 'E002', 'Satisfactory cost per lead',
 '[{\"date\":\"2026-02-01\",\"adSpend\":300,\"reach\":2100,\"clicks\":60,\"leads\":5,\"remarks\":\"Initial launch\"},{\"date\":\"2026-02-02\",\"adSpend\":320,\"reach\":2400,\"clicks\":72,\"leads\":6,\"remarks\":\"Cost per lead stable\"}]',
 '[{\"date\":\"2026-02-01\",\"amount\":6000,\"mode\":\"UPI\",\"transactionId\":\"TXN201\",\"remarks\":\"First Milestone\"},{\"date\":\"2026-02-20\",\"amount\":6000,\"mode\":\"Bank Transfer\",\"transactionId\":\"TXN202\",\"remarks\":\"Final Settlement\"}]',
 '[]', '[]',
 '[{\"timestamp\":\"2026-02-01 10:00:00\",\"text\":\"Campaign Created\",\"icon\":\"fa-plus\",\"eventType\":\"create\"}]'),
('MC005', 'Indus Dental Care', 'Teeth Whitening Promo', 'WhatsApp Leads', 13000.00, 9000.00, '2026-03-01', '2026-03-31', '2026-03-31', 'Completed', 'E002', 'Full advance paid',
 '[{\"date\":\"2026-03-01\",\"adSpend\":250,\"reach\":1800,\"clicks\":50,\"leads\":4,\"remarks\":\"Good response\"}]',
 '[{\"date\":\"2026-03-01\",\"amount\":13000,\"mode\":\"Bank Transfer\",\"transactionId\":\"TXN301\",\"remarks\":\"Full Advance Package Cost\"}]',
 '[]', '[]',
 '[{\"timestamp\":\"2026-03-01 09:00:00\",\"text\":\"Campaign Created\",\"icon\":\"fa-plus\",\"eventType\":\"create\"}]')
ON DUPLICATE KEY UPDATE `campaign_name`=VALUES(`campaign_name`);

-- Seed Google Ads
INSERT INTO `google_ads` (`id`, `client_id`, `campaign_name`, `objective`, `package_amount`, `ad_budget`, `start_date`, `end_date`, `reach`, `clicks`, `leads`, `cpl`, `roas`, `status`, `assigned_employee_id`, `notes`)
VALUES
('G001', 'C001', 'Zenith - Cloud Services Search', 'Sales / Signups', 40000.00, 25000.00, '2026-05-15', '2026-08-15', 35000, 1890, 95, 263.15, 2.80, 'Running', 'E004', 'High competition keywords targeting enterprise accounts.')
ON DUPLICATE KEY UPDATE `campaign_name`=VALUES(`campaign_name`);

-- Seed SEO
INSERT INTO `seo` (`id`, `client_id`, `website_url`, `campaign_name`, `package`, `start_date`, `end_date`, `budget`, `status`, `report_date`, `report_frequency`, `target_keywords`, `current_ranking`, `articles_published`, `backlinks`, `report_file`, `assigned_employee_id`, `progress`, `notes`, `keywords`, `weekly_log`, `uploaded_reports`, `ga4`, `gsc`)
VALUES
('SEO01', 'C001', 'https://www.zenithlabs.com', 'Zenith Tech Labs SEO', 'Gold', '2026-01-10', '2026-07-10', 60000.00, 'Active', '2026-06-30', 'Monthly', 'enterprise it consulting services, offshore cloud developer', 'Page 1 - Rank 4, Page 1 - Rank 8', 14, 120, 'zenith_labs_seo_may_2026.pdf', 'E004', 75, 'Organic traffic increased by 22% month-on-month.',
 '[{\"id\":\"KW001\",\"keyword\":\"enterprise it consulting services\",\"targetUrl\":\"https://www.zenithlabs.com/services\",\"searchEngine\":\"Google\",\"location\":\"Global\",\"device\":\"Desktop\",\"currentRank\":4,\"previousRank\":7,\"searchVolume\":1200,\"difficulty\":65,\"status\":\"Improved\"},{\"id\":\"KW002\",\"keyword\":\"offshore cloud developer\",\"targetUrl\":\"https://www.zenithlabs.com/cloud\",\"searchEngine\":\"Google\",\"location\":\"US\",\"device\":\"Desktop\",\"currentRank\":8,\"previousRank\":8,\"searchVolume\":850,\"difficulty\":58,\"status\":\"No Change\"},{\"id\":\"KW003\",\"keyword\":\"it outsourcing solutions\",\"targetUrl\":\"https://www.zenithlabs.com/outsourcing\",\"searchEngine\":\"Google\",\"location\":\"Global\",\"device\":\"Mobile\",\"currentRank\":12,\"previousRank\":9,\"searchVolume\":1500,\"difficulty\":72,\"status\":\"Dropped\"}]',
 '[{\"weekDate\":\"2026-06-15\",\"keyword\":\"enterprise it consulting services\",\"prevRank\":7,\"currRank\":6,\"rankChange\":1,\"status\":\"Improved\",\"remarks\":\"Backlink index update helped.\"},{\"weekDate\":\"2026-06-15\",\"keyword\":\"offshore cloud developer\",\"prevRank\":8,\"currRank\":8,\"rankChange\":0,\"status\":\"Stable\",\"remarks\":\"No rank fluctuations.\"},{\"weekDate\":\"2026-06-22\",\"keyword\":\"enterprise it consulting services\",\"prevRank\":6,\"currRank\":4,\"rankChange\":2,\"status\":\"Improved\",\"remarks\":\"New article indexed.\"},{\"weekDate\":\"2026-06-22\",\"keyword\":\"it outsourcing solutions\",\"prevRank\":9,\"currRank\":12,\"rankChange\":-3,\"status\":\"Dropped\",\"remarks\":\"Competitors bids increased.\"}]',
 '[{\"uploadDate\":\"2026-05-31\",\"fileName\":\"zenith_labs_seo_may_2026.pdf\",\"fileSize\":\"1.8 MB\",\"notes\":\"Monthly executive summary report\",\"type\":\"ga4\"},{\"uploadDate\":\"2026-06-15\",\"fileName\":\"gsc_clicks_mid_june.csv\",\"fileSize\":\"450 KB\",\"notes\":\"Mid-month click index raw dump\",\"type\":\"gsc\"}]',
 '{\"users\":4800,\"sessions\":6200,\"engagedSessions\":3900,\"views\":12500,\"bounceRate\":37.5,\"avgEngagementTime\":145,\"conversions\":310}',
 '{\"totalClicks\":2100,\"totalImpressions\":48000,\"avgCtr\":4.38,\"avgPosition\":12.4,\"topQueries\":[{\"query\":\"enterprise cloud consulting\",\"clicks\":420,\"impressions\":3200},{\"query\":\"hire offshore developers\",\"clicks\":310,\"impressions\":4500},{\"query\":\"it outsourcing services global\",\"clicks\":180,\"impressions\":2100}],\"topPages\":[{\"page\":\"/services/cloud-consulting\",\"clicks\":850,\"impressions\":9800},{\"page\":\"/careers/offshore-developer\",\"clicks\":620,\"impressions\":12000},{\"page\":\"/blog/it-outsourcing-guide\",\"clicks\":410,\"impressions\":8400}]}'),
('SEO002', 'C009', 'https://www.indusdentalcare.com', 'Indus Dental Care SEO', 'Silver', '2026-02-15', '2026-08-15', 35000.00, 'Active', '2026-07-02', 'Weekly', 'Target Keywords', 'Page 1 - Rank 10+', 0, 0, '', '', 0, 'Auto-synchronized from Service Contract.',
 '[{\"id\":\"KW004\",\"keyword\":\"Target Keywords\",\"targetUrl\":\"https://www.indusdentalcare.com\",\"searchEngine\":\"Google\",\"location\":\"Local\",\"device\":\"Mobile\",\"currentRank\":11,\"previousRank\":15,\"searchVolume\":500,\"difficulty\":32,\"status\":\"Improved\"}]',
 '[{\"weekDate\":\"2026-06-20\",\"keyword\":\"Target Keywords\",\"prevRank\":15,\"currRank\":11,\"rankChange\":4,\"status\":\"Improved\",\"remarks\":\"Local business listing verified.\"}]',
 '[]',
 '{\"users\":1200,\"sessions\":1600,\"engagedSessions\":950,\"views\":2800,\"bounceRate\":40.5,\"avgEngagementTime\":98,\"conversions\":45}',
 '{\"totalClicks\":320,\"totalImpressions\":9500,\"avgCtr\":3.37,\"avgPosition\":22.8,\"topQueries\":[{\"query\":\"best dentist in location\",\"clicks\":120,\"impressions\":1800},{\"query\":\"indus dental care appointments\",\"clicks\":95,\"impressions\":500}],\"topPages\":[{\"page\":\"/\",\"clicks\":210,\"impressions\":3800},{\"page\":\"/book-appointment\",\"clicks\":90,\"impressions\":2500}]}')
ON DUPLICATE KEY UPDATE `campaign_name`=VALUES(`campaign_name`);

-- Seed Projects
INSERT INTO `projects` (`id`, `client_id`, `project_name`, `website_type`, `domain`, `hosting`, `start_date`, `delivery_date`, `progress`, `assigned_developer_id`, `status`, `notes`)
VALUES
('P001', 'C003', 'Nutan Custom Builders Portal', 'Real Estate Portal', 'nutanbuilders.com', 'Hostinger Cloud', '2026-05-10', '2026-07-15', 80, 'E001', 'Running', 'WordPress setup done, frontend template integrated. Listing API in development.')
ON DUPLICATE KEY UPDATE `project_name`=VALUES(`project_name`);

-- Seed Canva
INSERT INTO `canva` (`id`, `client_name`, `email`, `price`, `purchase_date`, `renewal_date`, `notes`)
VALUES
('CAN001', 'Thynk Digital', 'gokul.digitalsolutions@gmail.com', 499.00, '2025-07-25', '2026-07-25', 'Main agency account'),
('CAN002', 'Elakiya', 'elakiyamanikandann@gmail.com', 499.00, '2025-08-24', '2026-08-24', ''),
('CAN003', 'Vignesh', 'vigneshraja5148@gmail.com', 499.00, '2025-09-12', '2026-09-12', ''),
('CAN004', 'Sowmiya', 'sowmiya.thynkdigital@gmail.com', 499.00, '2026-01-07', '2027-01-07', ''),
('CAN005', 'Thirsha', 'thirsha.thynkdigital@gmail.com', 499.00, '2026-02-08', '2027-02-08', '')
ON DUPLICATE KEY UPDATE `client_name`=VALUES(`client_name`);

-- Seed Billing Software
INSERT INTO `billing_software` (`id`, `client_name`, `company_name`, `client_id`, `price`, `maintenance`, `purchase_date`, `renewal_date`, `notes`)
VALUES
('BS001', 'Hasmi', 'Sree Balaji Textile Spares', '', 3500.00, 2500.00, '2026-04-01', '2027-04-01', ''),
('BS002', 'Hasmi', 'Dhanam Jayam Engineering', '', 2500.00, 2500.00, '2026-04-01', '2027-04-01', ''),
('BS003', '', 'Jai Matrimony', '', 15000.00, 3500.00, '2026-06-01', '2027-06-01', '')
ON DUPLICATE KEY UPDATE `company_name`=VALUES(`company_name`);

-- Seed Timeline
INSERT INTO `timeline` (`timestamp`, `event_type`, `icon`, `text`)
VALUES
('2026-06-26 11:30:00', 'payment', 'fa-receipt', 'Recorded payment of ₹70,000 for Nutan Builders (Invoice #INV-2026-004)'),
('2026-06-26 10:15:00', 'client', 'fa-user-plus', 'Added client Zenith Tech Labs (Rahul Sen)'),
('2026-06-25 15:45:00', 'service', 'fa-cube', 'Created service Meta Ads Management for Zenith Tech Labs'),
('2026-06-24 17:00:00', 'task', 'fa-check-double', 'Ankit Kumar completed task ''Set up Nutan builders database schema''');

-- Seed Notifications
INSERT INTO `notifications` (`id`, `title`, `message`, `type`, `date`)
VALUES
('N1', 'RIG Fabrication Expired', 'Hosting for RIG Fabrication expired on May 15, 2024.', 'danger', 'May 15'),
('N2', 'Payment Received', '₹3,800 received from Arun (Agtechnosolutions).', 'success', 'June 6'),
('N3', 'Leave Request', 'Ankit Kumar requested 5 days leave starting July 15.', 'info', 'June 25')
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- Seed Settings
INSERT INTO `settings` (`setting_key`, `setting_value`)
VALUES
('agencyName', 'Thynk Digital Solution'),
('email', 'contact@thynkdigital.in'),
('phone', '9876543210'),
('website', 'https://www.thynkdigital.in'),
('currencySymbol', '₹'),
('gstPercentage', '18')
ON DUPLICATE KEY UPDATE `setting_value`=VALUES(`setting_value`);
