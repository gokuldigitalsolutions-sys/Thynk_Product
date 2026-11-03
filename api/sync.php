<?php
// ==========================================================
// Thynk Digital Solution - State Synchronisation Endpoint
// REQUIRES authentication. Returns role-scoped data.
// Normal employees only get their own attendance/leaves/tasks.
// Admins/CEO/CTO get full data.
// ==========================================================

require_once __DIR__ . '/config.php';

$user   = require_auth();
$method = $_SERVER['REQUEST_METHOD'];
$db     = get_db();

$isExec   = is_admin_or_exec($user);
$userId   = $user['id'];
$perms    = $user['permissions'];
if (is_string($perms)) { $perms = json_decode($perms, true) ?: []; }

// Helper: does user have this module permission?
function has_perm($perms, $mod) {
    return !empty($perms[$mod]);
}

// ============================================================
// GET – load full state (role-scoped)
// ============================================================
if ($method === 'GET') {

    // 1. Employees
    if ($isExec) {
        $stmt = $db->query("SELECT id, name, phone, email, username, department, designation, role, joining_date AS joiningDate, salary, manager_id AS managerId, status, photo, permissions FROM employees ORDER BY id ASC");
    } else {
        $stmt = $db->prepare("SELECT id, name, phone, email, username, department, designation, role, joining_date AS joiningDate, salary, manager_id AS managerId, status, photo, permissions FROM employees WHERE id = ?");
        $stmt->execute([$userId]);
    }
    $rawEmployees = $stmt->fetchAll();
    $employees = array_map(function($emp) {
        $emp['salary'] = (float)$emp['salary'];
        if (!empty($emp['permissions']) && is_string($emp['permissions'])) {
            $emp['permissions'] = json_decode($emp['permissions'], true) ?: [];
        }
        return $emp;
    }, $rawEmployees);

    // 2. Clients (CRM module)
    $clients = [];
    if ($isExec || has_perm($perms, 'crm')) {
        $stmt = $db->query("SELECT id, company_name AS companyName, client_name AS clientName, mobile, whatsapp, email, website, category, gst, address, city, state, country, logo, source, assigned_employee_id AS assignedEmployeeId, status, priority, date_created AS dateCreated FROM clients ORDER BY id ASC");
        $clients = $stmt->fetchAll();
    }

    // 3. Leads (CRM module)
    $leads = [];
    if ($isExec || has_perm($perms, 'crm')) {
        $stmt = $db->query("SELECT id, company_name AS companyName, contact_name AS contactName, mobile, email, source, value, status, assigned_employee_id AS assignedEmployeeId, notes, date_created AS dateCreated FROM leads ORDER BY id ASC");
        $rawLeads = $stmt->fetchAll();
        $leads = array_map(fn($l) => array_merge($l, ['value' => (float)$l['value']]), $rawLeads);
    }

    // 4. Services (CRM module)
    $services = [];
    if ($isExec || has_perm($perms, 'crm')) {
        $stmt = $db->query("SELECT id, client_id AS clientId, service_name AS serviceName, package, start_date AS startDate, end_date AS endDate, renewal_date AS renewalDate, assigned_employee_id AS assignedEmployeeId, cost, discount, final_amount AS finalAmount, status, notes FROM services ORDER BY id ASC");
        $rawServices = $stmt->fetchAll();
        $services = array_map(function($s) {
            $s['cost'] = (float)$s['cost']; $s['discount'] = (float)$s['discount']; $s['finalAmount'] = (float)$s['finalAmount'];
            return $s;
        }, $rawServices);
    }

    // 5. Domains (CRM module)
    $domains = [];
    if ($isExec || has_perm($perms, 'crm')) {
        $stmt = $db->query("SELECT id, client_id AS clientId, domain_name AS domainName, registrar, registration_date AS registrationDate, expiry_date AS expiryDate, renewal_date AS renewalDate, auto_renewal AS autoRenewal, status, renewal_cost AS renewalCost, dns_status AS dnsStatus, ssl_status AS sslStatus, nameservers, credentials_placeholder AS credentialsPlaceholder, notes FROM domains ORDER BY id ASC");
        $rawDomains = $stmt->fetchAll();
        $domains = array_map(fn($d) => array_merge($d, ['renewalCost' => (float)$d['renewalCost']]), $rawDomains);
    }

    // 6. Hostings (CRM module)
    $hostings = [];
    if ($isExec || has_perm($perms, 'crm')) {
        $stmt = $db->query("SELECT id, client_id AS clientId, hosting_provider AS hostingProvider, hosting_plan AS hostingPlan, server_type AS serverType, purchase_date AS purchaseDate, expiry_date AS expiryDate, renewal_date AS renewalDate, renewal_cost AS renewalCost, disk_space AS diskSpace, bandwidth, control_panel AS controlPanel, ssl_expiry AS sslExpiry, backup_status AS backupStatus, status, notes FROM hostings ORDER BY id ASC");
        $rawHostings = $stmt->fetchAll();
        $hostings = array_map(fn($h) => array_merge($h, ['renewalCost' => (float)$h['renewalCost']]), $rawHostings);
    }

    // 7. Attendance (own records for employees, all for admins)
    if ($isExec) {
        $stmt = $db->query("SELECT id, employee_id AS employeeId, date, clock_in AS clockIn, clock_out AS clockOut, hours, status, late FROM attendance ORDER BY date DESC, id DESC");
    } else {
        $stmt = $db->prepare("SELECT id, employee_id AS employeeId, date, clock_in AS clockIn, clock_out AS clockOut, hours, status, late FROM attendance WHERE employee_id = ? ORDER BY date DESC, id DESC");
        $stmt->execute([$userId]);
    }
    $rawAtt = $stmt->fetchAll();
    $attendance = array_map(fn($a) => array_merge($a, ['hours' => (float)$a['hours']]), $rawAtt);

    // 8. Leaves (own records for employees, all for admins)
    if ($isExec) {
        $stmt = $db->query("SELECT id, employee_id AS employeeId, leave_type AS leaveType, start_date AS startDate, end_date AS endDate, total_days AS totalDays, reason, status FROM leaves ORDER BY id DESC");
    } else {
        $stmt = $db->prepare("SELECT id, employee_id AS employeeId, leave_type AS leaveType, start_date AS startDate, end_date AS endDate, total_days AS totalDays, reason, status FROM leaves WHERE employee_id = ? ORDER BY id DESC");
        $stmt->execute([$userId]);
    }
    $rawLeaves = $stmt->fetchAll();
    $leaves = array_map(fn($l) => array_merge($l, ['totalDays' => (int)$l['totalDays']]), $rawLeaves);

    // 9. Leave Allocations (own records for employees)
    if ($isExec) {
        $stmt = $db->query("SELECT employee_id AS employeeId, allocation_type AS allocationType, allowance FROM leave_allocations ORDER BY employee_id ASC");
    } else {
        $stmt = $db->prepare("SELECT employee_id AS employeeId, allocation_type AS allocationType, allowance FROM leave_allocations WHERE employee_id = ?");
        $stmt->execute([$userId]);
    }
    $rawAlloc = $stmt->fetchAll();
    $leaveAllocations = array_map(fn($la) => array_merge($la, ['allowance' => (int)$la['allowance']]), $rawAlloc);

    // 10. Tasks (assigned tasks for employees, all for admins)
    if ($isExec) {
        $stmt = $db->query("SELECT id, task_name AS taskName, description, client_id AS clientId, service_id AS serviceId, assigned_employee_id AS assignedEmployeeId, priority, start_date AS startDate, due_date AS dueDate, est_hours AS estHours, progress, status, comments, attachments FROM tasks ORDER BY id ASC");
    } else {
        $stmt = $db->prepare("SELECT id, task_name AS taskName, description, client_id AS clientId, service_id AS serviceId, assigned_employee_id AS assignedEmployeeId, priority, start_date AS startDate, due_date AS dueDate, est_hours AS estHours, progress, status, comments, attachments FROM tasks WHERE assigned_employee_id = ? ORDER BY id ASC");
        $stmt->execute([$userId]);
    }
    $rawTasks = $stmt->fetchAll();
    $tasks = array_map(function($t) {
        $t['estHours'] = (float)$t['estHours'];
        $t['progress'] = (int)$t['progress'];
        $t['attachments'] = (int)$t['attachments'];
        if (!empty($t['comments']) && is_string($t['comments'])) {
            $t['comments'] = json_decode($t['comments'], true) ?: [];
        } elseif (!is_array($t['comments'])) {
            $t['comments'] = [];
        }
        return $t;
    }, $rawTasks);

    // 11. Payments (accounts module)
    $payments = [];
    if ($isExec || has_perm($perms, 'accounts')) {
        $stmt = $db->query("SELECT id, invoice_no AS invoiceNo, client_id AS clientId, amount, date, payment_mode AS paymentMode, transaction_id AS transactionId, received_by_id AS receivedById, remarks FROM payments ORDER BY date DESC, id DESC");
        $rawPay = $stmt->fetchAll();
        $payments = array_map(fn($p) => array_merge($p, ['amount' => (float)$p['amount']]), $rawPay);
    }

    // 12. Invoices (accounts module)
    $invoices = [];
    if ($isExec || has_perm($perms, 'accounts')) {
        $stmt = $db->query("SELECT id, client_id AS clientId, invoice_date AS invoiceDate, due_date AS dueDate, service_id AS serviceId, gross_amount AS grossAmount, gst_rate AS gstRate, gst_amount AS gstAmount, discount, net_amount AS netAmount, status FROM invoices ORDER BY invoice_date DESC, id DESC");
        $rawInv = $stmt->fetchAll();
        $invoices = array_map(function($i) {
            $i['grossAmount'] = (float)$i['grossAmount']; $i['gstRate'] = (float)$i['gstRate'];
            $i['gstAmount'] = (float)$i['gstAmount']; $i['discount'] = (float)$i['discount']; $i['netAmount'] = (float)$i['netAmount'];
            return $i;
        }, $rawInv);
    }

    // 13. Followups (CRM module)
    $followups = [];
    if ($isExec || has_perm($perms, 'crm')) {
        $stmt = $db->query("SELECT id, client_id AS clientId, last_contact AS lastContact, next_followup AS nextFollowup, type, assigned_employee_id AS assignedEmployeeId, status, remarks FROM followups ORDER BY next_followup ASC");
        $followups = $stmt->fetchAll();
    }

    // 14. Reminders (visible to all authenticated users, own reminders for employees)
    if ($isExec) {
        $stmt = $db->query("SELECT id, title, description, client_id AS clientId, service_id AS serviceId, assigned_employee_id AS assignedEmployeeId, reminder_date AS reminderDate, reminder_time AS reminderTime, priority, status FROM reminders ORDER BY reminder_date ASC, reminder_time ASC");
    } else {
        $stmt = $db->prepare("SELECT id, title, description, client_id AS clientId, service_id AS serviceId, assigned_employee_id AS assignedEmployeeId, reminder_date AS reminderDate, reminder_time AS reminderTime, priority, status FROM reminders WHERE assigned_employee_id = ? OR assigned_employee_id IS NULL OR assigned_employee_id = '' ORDER BY reminder_date ASC");
        $stmt->execute([$userId]);
    }
    $reminders = $stmt->fetchAll();

    // 15. Notes (CRM module)
    $notes = [];
    if ($isExec || has_perm($perms, 'crm')) {
        $stmt = $db->query("SELECT id, client_id AS clientId, title, description, tags, created_by_id AS createdById, date_created AS dateCreated, pinned FROM notes ORDER BY pinned DESC, id DESC");
        $rawNotes = $stmt->fetchAll();
        $notes = array_map(function($n) {
            $n['pinned'] = (bool)$n['pinned'];
            if (!empty($n['tags']) && is_string($n['tags'])) { $n['tags'] = json_decode($n['tags'], true) ?: []; }
            elseif (!is_array($n['tags'])) { $n['tags'] = []; }
            return $n;
        }, $rawNotes);
    }

    // 16. Meta Ads (marketing module)
    $metaAds = [];
    if ($isExec || has_perm($perms, 'marketing')) {
        $stmt = $db->query("SELECT id, client_name AS clientName, campaign_name AS campaignName, objective, package_amount AS packageAmount, ad_budget AS adBudget, start_date AS startDate, end_date AS endDate, renewal_date AS renewalDate, status, assigned_employee_id AS assignedEmployeeId, remarks, daily_performance AS dailyPerformance, payments, notes, followups, timeline FROM meta_ads ORDER BY id ASC");
        $rawMeta = $stmt->fetchAll();
        $metaAds = array_map(function($m) {
            $m['packageAmount'] = (float)$m['packageAmount']; $m['adBudget'] = (float)$m['adBudget'];
            foreach (['dailyPerformance', 'payments', 'notes', 'followups', 'timeline'] as $f) {
                $m[$f] = (!empty($m[$f]) && is_string($m[$f])) ? (json_decode($m[$f], true) ?: []) : (is_array($m[$f]) ? $m[$f] : []);
            }
            return $m;
        }, $rawMeta);
    }

    // 17. Google Ads (marketing module)
    $googleAds = [];
    if ($isExec || has_perm($perms, 'marketing')) {
        $stmt = $db->query("SELECT id, client_id AS clientId, campaign_name AS campaignName, objective, package_amount AS packageAmount, ad_budget AS adBudget, start_date AS startDate, end_date AS endDate, reach, clicks, leads, cpl, roas, status, assigned_employee_id AS assignedEmployeeId, notes FROM google_ads ORDER BY id ASC");
        $rawGads = $stmt->fetchAll();
        $googleAds = array_map(function($g) {
            $g['packageAmount'] = (float)$g['packageAmount']; $g['adBudget'] = (float)$g['adBudget'];
            $g['reach'] = (int)$g['reach']; $g['clicks'] = (int)$g['clicks']; $g['leads'] = (int)$g['leads'];
            $g['cpl'] = (float)$g['cpl']; $g['roas'] = (float)$g['roas'];
            return $g;
        }, $rawGads);
    }

    // 18. SEO (marketing module)
    $seo = [];
    if ($isExec || has_perm($perms, 'marketing')) {
        $stmt = $db->query("SELECT id, client_id AS clientId, website_url AS websiteUrl, campaign_name AS campaignName, package, start_date AS startDate, end_date AS endDate, budget, status, report_date AS reportDate, report_frequency AS reportFrequency, target_keywords AS targetKeywords, current_ranking AS currentRanking, articles_published AS articlesPublished, backlinks, report_file AS reportFile, assigned_employee_id AS assignedEmployeeId, progress, notes, keywords, weekly_log AS weeklyLog, uploaded_reports AS uploadedReports, ga4, gsc FROM seo ORDER BY id ASC");
        $rawSeo = $stmt->fetchAll();
        $seo = array_map(function($s) {
            $s['budget'] = (float)$s['budget']; $s['articlesPublished'] = (int)$s['articlesPublished'];
            $s['backlinks'] = (int)$s['backlinks']; $s['progress'] = (int)$s['progress'];
            foreach (['keywords', 'weeklyLog', 'uploadedReports'] as $f) {
                $s[$f] = (!empty($s[$f]) && is_string($s[$f])) ? (json_decode($s[$f], true) ?: []) : (is_array($s[$f]) ? $s[$f] : []);
            }
            foreach (['ga4', 'gsc'] as $f) {
                $s[$f] = (!empty($s[$f]) && is_string($s[$f])) ? (json_decode($s[$f], true) ?: []) : (is_array($s[$f]) ? $s[$f] : []);
            }
            return $s;
        }, $rawSeo);
    }

    // 19. Projects (CRM / all)
    $projects = [];
    if ($isExec || has_perm($perms, 'crm')) {
        $stmt = $db->query("SELECT id, client_id AS clientId, project_name AS projectName, website_type AS websiteType, domain, hosting, start_date AS startDate, delivery_date AS deliveryDate, progress, assigned_developer_id AS assignedDeveloperId, status, notes FROM projects ORDER BY id ASC");
        $rawProj = $stmt->fetchAll();
        $projects = array_map(fn($p) => array_merge($p, ['progress' => (int)$p['progress']]), $rawProj);
    }

    // 20. Canva (all authenticated)
    $stmt = $db->query("SELECT id, client_name AS clientName, email, price, purchase_date AS purchaseDate, renewal_date AS renewalDate, notes FROM canva ORDER BY id ASC");
    $rawCanva = $stmt->fetchAll();
    $canva = array_map(fn($c) => array_merge($c, ['price' => (float)$c['price']]), $rawCanva);

    // 21. Billing Software (accounts module)
    $billingSoftware = [];
    if ($isExec || has_perm($perms, 'accounts') || has_perm($perms, 'crm')) {
        $stmt = $db->query("SELECT id, client_name AS clientName, company_name AS companyName, client_id AS clientId, price, maintenance, purchase_date AS purchaseDate, renewal_date AS renewalDate, notes FROM billing_software ORDER BY id ASC");
        $rawBs = $stmt->fetchAll();
        $billingSoftware = array_map(function($b) {
            $b['price'] = (float)$b['price']; $b['maintenance'] = (float)$b['maintenance'];
            return $b;
        }, $rawBs);
    }

    // 22. Timeline (all authenticated — shows relevant activity)
    $stmt = $db->query("SELECT timestamp, event_type AS eventType, icon, text FROM timeline ORDER BY timestamp DESC LIMIT 200");
    $timeline = $stmt->fetchAll();

    // 23. Notifications (all authenticated)
    $stmt = $db->query("SELECT id, title, message, type, date FROM notifications ORDER BY id DESC");
    $notifications = $stmt->fetchAll();

    // 24. Settings (all authenticated)
    $stmt = $db->query("SELECT setting_key, setting_value FROM settings");
    $rawSettings = $stmt->fetchAll();
    $settings = [];
    foreach ($rawSettings as $s) {
        $val = $s['setting_value'];
        if (is_numeric($val)) $val = $val + 0;
        $settings[$s['setting_key']] = $val;
    }
    if (empty($settings)) {
        $settings = [
            'agencyName'     => 'Thynk Digital Solution',
            'email'          => 'contact@thynkdigital.in',
            'phone'          => '9876543210',
            'website'        => 'https://www.thynkdigital.in',
            'currencySymbol' => '₹',
            'gstPercentage'  => 18
        ];
    }

    json_response([
        'success' => true,
        'data'    => [
            'employees'        => $employees,
            'clients'          => $clients,
            'leads'            => $leads,
            'services'         => $services,
            'domains'          => $domains,
            'hostings'         => $hostings,
            'attendance'       => $attendance,
            'leaves'           => $leaves,
            'leaveAllocations' => $leaveAllocations,
            'tasks'            => $tasks,
            'payments'         => $payments,
            'invoices'         => $invoices,
            'followups'        => $followups,
            'reminders'        => $reminders,
            'notes'            => $notes,
            'metaAds'          => $metaAds,
            'googleAds'        => $googleAds,
            'seo'              => $seo,
            'projects'         => $projects,
            'canva'            => $canva,
            'billingSoftware'  => $billingSoftware,
            'timeline'         => $timeline,
            'notifications'    => $notifications,
            'settings'         => $settings
        ]
    ]);
}

// ============================================================
// POST – bulk state import (admin only)
// ============================================================
if ($method === 'POST') {
    require_admin_or_exec($user);
    verify_csrf();

    $input = get_input();
    if (!empty($input['state'])) {
        $st = $input['state'];
        $db->beginTransaction();
        try {
            if (!empty($st['clients']) && is_array($st['clients'])) {
                $cStmt = $db->prepare("INSERT INTO clients (id, company_name, client_name, mobile, whatsapp, email, website, category, gst, address, city, state, country, logo, source, assigned_employee_id, status, priority, date_created)
                    VALUES (:id, :companyName, :clientName, :mobile, :whatsapp, :email, :website, :category, :gst, :address, :city, :state, :country, :logo, :source, :assignedEmployeeId, :status, :priority, :dateCreated)
                    ON DUPLICATE KEY UPDATE company_name=VALUES(company_name), client_name=VALUES(client_name), mobile=VALUES(mobile), email=VALUES(email), status=VALUES(status)");
                foreach ($st['clients'] as $c) {
                    $cStmt->execute([
                        ':id' => $c['id'], ':companyName' => $c['companyName'] ?? '', ':clientName' => $c['clientName'] ?? '',
                        ':mobile' => $c['mobile'] ?? '', ':whatsapp' => $c['whatsapp'] ?? '', ':email' => $c['email'] ?? '',
                        ':website' => $c['website'] ?? '', ':category' => $c['category'] ?? '', ':gst' => $c['gst'] ?? '',
                        ':address' => $c['address'] ?? '', ':city' => $c['city'] ?? '', ':state' => $c['state'] ?? '',
                        ':country' => $c['country'] ?? 'India', ':logo' => $c['logo'] ?? '', ':source' => $c['source'] ?? '',
                        ':assignedEmployeeId' => $c['assignedEmployeeId'] ?? '', ':status' => $c['status'] ?? 'Active',
                        ':priority' => $c['priority'] ?? 'Medium', ':dateCreated' => $c['dateCreated'] ?? ''
                    ]);
                }
            }
            $db->commit();
            json_response(['success' => true, 'message' => 'State synced successfully.']);
        } catch (Exception $e) {
            $db->rollBack();
            json_error("Sync failed: " . $e->getMessage(), 500);
        }
    }
    json_error("No state payload provided.", 400);
}

json_error("Unsupported method.", 405);
