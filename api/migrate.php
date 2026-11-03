<?php
// ==========================================================
// Thynk Digital Solution - Data Migration & Sync Endpoint
// Protected: Requires authentication + CSRF verification.
// Admins/CEO/CTO can migrate all entities.
// Normal employees can only sync their scoped data (attendance, leaves, tasks).
// ==========================================================

require_once __DIR__ . '/config.php';

$user = require_auth();
verify_csrf();

$db = get_db();
$input = get_input();
$state = !empty($input['state']) ? $input['state'] : $input;

if (empty($state) || !is_array($state)) {
    json_error("Valid state payload is required.", 400);
}

$isExec = is_admin_or_exec($user);
$userId = $user['id'];

$db->beginTransaction();

try {
    // 1. Employees (Admin / Exec only)
    if ($isExec && !empty($state['employees']) && is_array($state['employees'])) {
        $stmt = $db->prepare("
            INSERT INTO employees (id, name, phone, email, username, password_hash, department, designation, role, joining_date, salary, manager_id, status, photo, permissions)
            VALUES (:id, :name, :phone, :email, :username, :passwordHash, :department, :designation, :role, :joiningDate, :salary, :managerId, :status, :photo, :permissions)
            ON DUPLICATE KEY UPDATE name=VALUES(name), phone=VALUES(phone), department=VALUES(department), designation=VALUES(designation), salary=VALUES(salary), status=VALUES(status), permissions=VALUES(permissions)
        ");
        foreach ($state['employees'] as $e) {
            $perms = !empty($e['permissions']) ? (is_array($e['permissions']) ? json_encode($e['permissions']) : $e['permissions']) : null;
            $rawPass = !empty($e['password']) ? $e['password'] : '123456';
            $passHash = (str_starts_with($rawPass, '$2y$') || str_starts_with($rawPass, '$2a$')) ? $rawPass : password_hash($rawPass, PASSWORD_BCRYPT);
            $stmt->execute([
                ':id'           => $e['id'],
                ':name'         => $e['name'] ?? '',
                ':phone'        => $e['phone'] ?? '',
                ':email'        => $e['email'] ?? '',
                ':username'     => $e['username'] ?? explode('@', $e['email'] ?? '')[0],
                ':passwordHash' => $passHash,
                ':department'   => $e['department'] ?? 'Development',
                ':designation'  => $e['designation'] ?? 'Employee',
                ':role'         => $e['role'] ?? ($e['designation'] ?? 'Employee'),
                ':joiningDate'  => $e['joiningDate'] ?? ($e['joining_date'] ?? date('Y-m-d')),
                ':salary'       => (float)($e['salary'] ?? 0),
                ':managerId'    => $e['managerId'] ?? ($e['manager_id'] ?? 'Admin'),
                ':status'       => $e['status'] ?? 'Active',
                ':photo'        => $e['photo'] ?? 'https://randomuser.me/api/portraits/men/32.jpg',
                ':permissions'  => $perms
            ]);
        }
    }

    // 2. Clients (Admin or users with CRM perm)
    if ($isExec && !empty($state['clients']) && is_array($state['clients'])) {
        $stmt = $db->prepare("
            INSERT INTO clients (id, company_name, client_name, mobile, whatsapp, email, website, category, gst, address, city, state, country, logo, source, assigned_employee_id, status, priority, date_created)
            VALUES (:id, :companyName, :clientName, :mobile, :whatsapp, :email, :website, :category, :gst, :address, :city, :state, :country, :logo, :source, :assignedEmployeeId, :status, :priority, :dateCreated)
            ON DUPLICATE KEY UPDATE company_name=VALUES(company_name), client_name=VALUES(client_name), mobile=VALUES(mobile), email=VALUES(email), status=VALUES(status), priority=VALUES(priority)
        ");
        foreach ($state['clients'] as $c) {
            $comp = $c['companyName'] ?? ($c['company_name'] ?? '');
            $cli  = $c['clientName'] ?? ($c['client_name'] ?? '');
            if (empty($comp)) $comp = $cli;
            if (empty($cli)) $cli = $comp;
            if (empty($comp)) continue;

            $stmt->execute([
                ':id'                 => $c['id'],
                ':companyName'        => $comp,
                ':clientName'         => $cli,
                ':mobile'             => $c['mobile'] ?? '',
                ':whatsapp'           => $c['whatsapp'] ?? ($c['mobile'] ?? ''),
                ':email'              => $c['email'] ?? '',
                ':website'            => $c['website'] ?? '',
                ':category'           => $c['category'] ?? '',
                ':gst'                => $c['gst'] ?? '',
                ':address'            => $c['address'] ?? '',
                ':city'               => $c['city'] ?? '',
                ':state'              => $c['state'] ?? '',
                ':country'            => $c['country'] ?? 'India',
                ':logo'               => $c['logo'] ?? strtoupper(substr($comp, 0, 1)),
                ':source'             => $c['source'] ?? 'Direct',
                ':assignedEmployeeId' => $c['assignedEmployeeId'] ?? ($c['assigned_employee_id'] ?? 'E001'),
                ':status'             => $c['status'] ?? 'Active',
                ':priority'           => $c['priority'] ?? 'Medium',
                ':dateCreated'        => $c['dateCreated'] ?? ($c['date_created'] ?? date('Y-m-d'))
            ]);
        }
    }

    // 3. Leads (Admin / Exec only)
    if ($isExec && isset($state['leads']) && is_array($state['leads'])) {
        $validLeadIds = [];
        $stmt = $db->prepare("
            INSERT INTO leads (id, company_name, contact_name, mobile, email, source, value, status, assigned_employee_id, notes, date_created)
            VALUES (:id, :companyName, :contactName, :mobile, :email, :source, :value, :status, :assignedEmployeeId, :notes, :dateCreated)
            ON DUPLICATE KEY UPDATE company_name=VALUES(company_name), contact_name=VALUES(contact_name), status=VALUES(status), value=VALUES(value)
        ");
        foreach ($state['leads'] as $l) {
            if (!empty($l['id'])) {
                $validLeadIds[] = $l['id'];
                $stmt->execute([
                    ':id'                 => $l['id'],
                    ':companyName'        => $l['companyName'] ?? ($l['company_name'] ?? ''),
                    ':contactName'        => $l['contactName'] ?? ($l['contact_name'] ?? ''),
                    ':mobile'             => $l['mobile'] ?? '',
                    ':email'              => $l['email'] ?? '',
                    ':source'             => $l['source'] ?? 'Website',
                    ':value'              => (float)($l['value'] ?? 0),
                    ':status'             => $l['status'] ?? 'New',
                    ':assignedEmployeeId' => $l['assignedEmployeeId'] ?? ($l['assigned_employee_id'] ?? 'E001'),
                    ':notes'              => $l['notes'] ?? '',
                    ':dateCreated'        => $l['dateCreated'] ?? ($l['date_created'] ?? date('Y-m-d'))
                ]);
            }
        }
        // Prune deleted leads so MySQL never preserves removed leads
        if (!empty($validLeadIds)) {
            $inClause = implode(',', array_fill(0, count($validLeadIds), '?'));
            $pruneStmt = $db->prepare("DELETE FROM leads WHERE id NOT IN ($inClause)");
            $pruneStmt->execute($validLeadIds);
        } else {
            $db->exec("DELETE FROM leads");
        }
    }

    // 4. Services (Admin / Exec only)
    if ($isExec && !empty($state['services']) && is_array($state['services'])) {
        $stmt = $db->prepare("
            INSERT INTO services (id, client_id, service_name, package, start_date, end_date, renewal_date, assigned_employee_id, cost, discount, final_amount, status, notes)
            VALUES (:id, :clientId, :serviceName, :package, :startDate, :endDate, :renewalDate, :assignedEmployeeId, :cost, :discount, :finalAmount, :status, :notes)
            ON DUPLICATE KEY UPDATE service_name=VALUES(service_name), package=VALUES(package), status=VALUES(status), final_amount=VALUES(final_amount)
        ");
        foreach ($state['services'] as $s) {
            $stmt->execute([
                ':id'                 => $s['id'],
                ':clientId'           => $s['clientId'] ?? ($s['client_id'] ?? ''),
                ':serviceName'        => $s['serviceName'] ?? ($s['service_name'] ?? ''),
                ':package'            => $s['package'] ?? '',
                ':startDate'          => $s['startDate'] ?? ($s['start_date'] ?? date('Y-m-d')),
                ':endDate'            => $s['endDate'] ?? ($s['end_date'] ?? date('Y-m-d')),
                ':renewalDate'        => $s['renewalDate'] ?? ($s['renewal_date'] ?? ''),
                ':assignedEmployeeId' => $s['assignedEmployeeId'] ?? ($s['assigned_employee_id'] ?? 'E001'),
                ':cost'               => (float)($s['cost'] ?? 0),
                ':discount'           => (float)($s['discount'] ?? 0),
                ':finalAmount'        => (float)($s['finalAmount'] ?? ($s['final_amount'] ?? 0)),
                ':status'             => $s['status'] ?? 'Active',
                ':notes'              => $s['notes'] ?? ''
            ]);
        }
    }

    // 5. Domains (Admin / Exec only)
    if ($isExec && !empty($state['domains']) && is_array($state['domains'])) {
        $stmt = $db->prepare("
            INSERT INTO domains (id, client_id, domain_name, registrar, registration_date, expiry_date, renewal_date, auto_renewal, status, renewal_cost, dns_status, ssl_status, nameservers, credentials_placeholder, notes)
            VALUES (:id, :clientId, :domainName, :registrar, :registrationDate, :expiryDate, :renewalDate, :autoRenewal, :status, :renewalCost, :dnsStatus, :sslStatus, :nameservers, :credentialsPlaceholder, :notes)
            ON DUPLICATE KEY UPDATE domain_name=VALUES(domain_name), registrar=VALUES(registrar), status=VALUES(status), expiry_date=VALUES(expiry_date)
        ");
        foreach ($state['domains'] as $d) {
            $stmt->execute([
                ':id'                     => $d['id'],
                ':clientId'               => $d['clientId'] ?? ($d['client_id'] ?? ''),
                ':domainName'             => $d['domainName'] ?? ($d['domain_name'] ?? ''),
                ':registrar'              => $d['registrar'] ?? '',
                ':registrationDate'       => $d['registrationDate'] ?? ($d['registration_date'] ?? date('Y-m-d')),
                ':expiryDate'             => $d['expiryDate'] ?? ($d['expiry_date'] ?? date('Y-m-d')),
                ':renewalDate'            => $d['renewalDate'] ?? ($d['renewal_date'] ?? ''),
                ':autoRenewal'            => $d['autoRenewal'] ?? ($d['auto_renewal'] ?? 'No'),
                ':status'                 => $d['status'] ?? 'Active',
                ':renewalCost'            => (float)($d['renewalCost'] ?? ($d['renewal_cost'] ?? 0)),
                ':dnsStatus'              => $d['dnsStatus'] ?? ($d['dns_status'] ?? 'Active'),
                ':sslStatus'              => $d['sslStatus'] ?? ($d['ssl_status'] ?? 'Active'),
                ':nameservers'            => $d['nameservers'] ?? '',
                ':credentialsPlaceholder' => $d['credentialsPlaceholder'] ?? ($d['credentials_placeholder'] ?? ''),
                ':notes'                  => $d['notes'] ?? ''
            ]);
        }
    }

    // 6. Hostings (Admin / Exec only)
    if ($isExec && !empty($state['hostings']) && is_array($state['hostings'])) {
        $stmt = $db->prepare("
            INSERT INTO hostings (id, client_id, hosting_provider, hosting_plan, server_type, purchase_date, expiry_date, renewal_date, renewal_cost, disk_space, bandwidth, control_panel, ssl_expiry, backup_status, status, notes)
            VALUES (:id, :clientId, :hostingProvider, :hostingPlan, :serverType, :purchaseDate, :expiryDate, :renewalDate, :renewalCost, :diskSpace, :bandwidth, :controlPanel, :sslExpiry, :backupStatus, :status, :notes)
            ON DUPLICATE KEY UPDATE hosting_provider=VALUES(hosting_provider), hosting_plan=VALUES(hosting_plan), status=VALUES(status), expiry_date=VALUES(expiry_date)
        ");
        foreach ($state['hostings'] as $h) {
            $stmt->execute([
                ':id'              => $h['id'],
                ':clientId'        => $h['clientId'] ?? ($h['client_id'] ?? ''),
                ':hostingProvider' => $h['hostingProvider'] ?? ($h['hosting_provider'] ?? ''),
                ':hostingPlan'     => $h['hostingPlan'] ?? ($h['hosting_plan'] ?? ''),
                ':serverType'      => $h['serverType'] ?? ($h['server_type'] ?? 'Shared'),
                ':purchaseDate'    => $h['purchaseDate'] ?? ($h['purchase_date'] ?? date('Y-m-d')),
                ':expiryDate'      => $h['expiryDate'] ?? ($h['expiry_date'] ?? date('Y-m-d')),
                ':renewalDate'     => $h['renewalDate'] ?? ($h['renewal_date'] ?? ''),
                ':renewalCost'     => (float)($h['renewalCost'] ?? ($h['renewal_cost'] ?? 0)),
                ':diskSpace'       => $h['diskSpace'] ?? ($h['disk_space'] ?? ''),
                ':bandwidth'       => $h['bandwidth'] ?? '',
                ':controlPanel'    => $h['controlPanel'] ?? ($h['control_panel'] ?? ''),
                ':sslExpiry'       => $h['sslExpiry'] ?? ($h['ssl_expiry'] ?? ''),
                ':backupStatus'    => $h['backupStatus'] ?? ($h['backup_status'] ?? 'Enabled'),
                ':status'          => $h['status'] ?? 'Active',
                ':notes'           => $h['notes'] ?? ''
            ]);
        }
    }

    // 7. Attendance (Employees can only sync their OWN attendance; Admin can sync all)
    if (!empty($state['attendance']) && is_array($state['attendance'])) {
        $stmt = $db->prepare("
            INSERT INTO attendance (id, employee_id, date, clock_in, clock_out, hours, status, late)
            VALUES (:id, :employeeId, :date, :clockIn, :clockOut, :hours, :status, :late)
            ON DUPLICATE KEY UPDATE clock_in=VALUES(clock_in), clock_out=VALUES(clock_out), hours=VALUES(hours), status=VALUES(status), late=VALUES(late)
        ");
        foreach ($state['attendance'] as $a) {
            $attEmpId = $a['employeeId'] ?? ($a['employee_id'] ?? '');
            // Data Isolation: Normal employees cannot touch other employees' records
            if (!$isExec && $attEmpId !== $userId) {
                continue;
            }
            $stmt->execute([
                ':id'         => $a['id'],
                ':employeeId' => $attEmpId ?: $userId,
                ':date'       => $a['date'] ?? date('Y-m-d'),
                ':clockIn'    => $a['clockIn'] ?? ($a['clock_in'] ?? ''),
                ':clockOut'   => $a['clockOut'] ?? ($a['clock_out'] ?? ''),
                ':hours'      => (float)($a['hours'] ?? 0),
                ':status'     => $a['status'] ?? 'Present',
                ':late'       => $a['late'] ?? 'No'
            ]);
        }
    }

    // 8. Leaves (Employees can only sync their OWN leaves; Admin can sync all)
    if (!empty($state['leaves']) && is_array($state['leaves'])) {
        $stmt = $db->prepare("
            INSERT INTO leaves (id, employee_id, leave_type, start_date, end_date, total_days, reason, status)
            VALUES (:id, :employeeId, :leaveType, :startDate, :endDate, :totalDays, :reason, :status)
            ON DUPLICATE KEY UPDATE leave_type=VALUES(leave_type), start_date=VALUES(start_date), end_date=VALUES(end_date), total_days=VALUES(total_days), reason=VALUES(reason), status=VALUES(status)
        ");
        foreach ($state['leaves'] as $l) {
            $leaveEmpId = $l['employeeId'] ?? ($l['employee_id'] ?? '');
            // Data Isolation: Normal employees cannot touch other employees' records
            if (!$isExec && $leaveEmpId !== $userId) {
                continue;
            }
            $leaveStatus = $isExec ? ($l['status'] ?? 'Pending') : 'Pending';
            $stmt->execute([
                ':id'         => $l['id'],
                ':employeeId' => $leaveEmpId ?: $userId,
                ':leaveType'  => $l['leaveType'] ?? ($l['leave_type'] ?? 'Casual Leave'),
                ':startDate'  => $l['startDate'] ?? ($l['start_date'] ?? date('Y-m-d')),
                ':endDate'    => $l['endDate'] ?? ($l['end_date'] ?? date('Y-m-d')),
                ':totalDays'  => (int)($l['totalDays'] ?? ($l['total_days'] ?? 1)),
                ':reason'     => $l['reason'] ?? '',
                ':status'     => $leaveStatus
            ]);
        }
    }

    // 9. Leave Allocations (Admin / Exec only)
    if ($isExec && !empty($state['leaveAllocations']) && is_array($state['leaveAllocations'])) {
        $stmt = $db->prepare("
            INSERT INTO leave_allocations (employee_id, allocation_type, allowance)
            VALUES (:employeeId, :allocationType, :allowance)
            ON DUPLICATE KEY UPDATE allowance=VALUES(allowance)
        ");
        foreach ($state['leaveAllocations'] as $la) {
            $stmt->execute([
                ':employeeId'     => $la['employeeId'] ?? ($la['employee_id'] ?? ''),
                ':allocationType' => $la['allocationType'] ?? ($la['allocation_type'] ?? 'monthly'),
                ':allowance'      => (int)($la['allowance'] ?? 4)
            ]);
        }
    }

    // 10. Tasks (Employees can only update tasks assigned to them; Admin can sync all)
    if (!empty($state['tasks']) && is_array($state['tasks'])) {
        $stmt = $db->prepare("
            INSERT INTO tasks (id, task_name, description, client_id, service_id, assigned_employee_id, priority, start_date, due_date, est_hours, progress, status, comments, attachments)
            VALUES (:id, :taskName, :description, :clientId, :serviceId, :assignedEmployeeId, :priority, :startDate, :dueDate, :estHours, :progress, :status, :comments, :attachments)
            ON DUPLICATE KEY UPDATE progress=VALUES(progress), status=VALUES(status), comments=VALUES(comments)
        ");
        foreach ($state['tasks'] as $t) {
            $taskEmpId = $t['assignedEmployeeId'] ?? ($t['assigned_employee_id'] ?? '');
            if (!$isExec && $taskEmpId !== $userId) {
                continue;
            }
            $comms = !empty($t['comments']) ? (is_array($t['comments']) ? json_encode($t['comments']) : $t['comments']) : '[]';
            $stmt->execute([
                ':id'                 => $t['id'],
                ':taskName'           => $t['taskName'] ?? ($t['task_name'] ?? ''),
                ':description'        => $t['description'] ?? '',
                ':clientId'           => $t['clientId'] ?? ($t['client_id'] ?? ''),
                ':serviceId'          => $t['serviceId'] ?? ($t['service_id'] ?? ''),
                ':assignedEmployeeId' => $taskEmpId ?: $userId,
                ':priority'           => $t['priority'] ?? 'Medium',
                ':startDate'          => $t['startDate'] ?? ($t['start_date'] ?? date('Y-m-d')),
                ':dueDate'            => $t['dueDate'] ?? ($t['due_date'] ?? date('Y-m-d')),
                ':estHours'           => (float)($t['estHours'] ?? ($t['est_hours'] ?? 0)),
                ':progress'           => (int)($t['progress'] ?? 0),
                ':status'             => $t['status'] ?? 'Pending',
                ':comments'           => $comms,
                ':attachments'        => (int)($t['attachments'] ?? 0)
            ]);
        }
    }

    // 11. Payments (Admin / Exec only)
    if ($isExec && !empty($state['payments']) && is_array($state['payments'])) {
        $stmt = $db->prepare("
            INSERT INTO payments (id, invoice_no, client_id, amount, date, payment_mode, transaction_id, received_by_id, remarks)
            VALUES (:id, :invoiceNo, :clientId, :amount, :date, :paymentMode, :transactionId, :receivedById, :remarks)
            ON DUPLICATE KEY UPDATE amount=VALUES(amount), date=VALUES(date), payment_mode=VALUES(payment_mode)
        ");
        foreach ($state['payments'] as $p) {
            $stmt->execute([
                ':id'            => $p['id'],
                ':invoiceNo'     => $p['invoiceNo'] ?? ($p['invoice_no'] ?? ''),
                ':clientId'      => $p['clientId'] ?? ($p['client_id'] ?? ''),
                ':amount'        => (float)($p['amount'] ?? 0),
                ':date'          => $p['date'] ?? date('Y-m-d'),
                ':paymentMode'   => $p['paymentMode'] ?? ($p['payment_mode'] ?? 'Bank Transfer'),
                ':transactionId' => $p['transactionId'] ?? ($p['transaction_id'] ?? ''),
                ':receivedById'  => $p['receivedById'] ?? ($p['received_by_id'] ?? 'E001'),
                ':remarks'       => $p['remarks'] ?? ''
            ]);
        }
    }

    // 12. Invoices (Admin / Exec only)
    if ($isExec && !empty($state['invoices']) && is_array($state['invoices'])) {
        $stmt = $db->prepare("
            INSERT INTO invoices (id, client_id, invoice_date, due_date, service_id, gross_amount, gst_rate, gst_amount, discount, net_amount, status)
            VALUES (:id, :clientId, :invoiceDate, :dueDate, :serviceId, :grossAmount, :gstRate, :gstAmount, :discount, :netAmount, :status)
            ON DUPLICATE KEY UPDATE gross_amount=VALUES(gross_amount), gst_amount=VALUES(gst_amount), net_amount=VALUES(net_amount), status=VALUES(status)
        ");
        foreach ($state['invoices'] as $inv) {
            $stmt->execute([
                ':id'          => $inv['id'],
                ':clientId'    => $inv['clientId'] ?? ($inv['client_id'] ?? ''),
                ':invoiceDate' => $inv['invoiceDate'] ?? ($inv['invoice_date'] ?? date('Y-m-d')),
                ':dueDate'     => $inv['dueDate'] ?? ($inv['due_date'] ?? date('Y-m-d')),
                ':serviceId'   => $inv['serviceId'] ?? ($inv['service_id'] ?? ''),
                ':grossAmount' => (float)($inv['grossAmount'] ?? ($inv['gross_amount'] ?? 0)),
                ':gstRate'     => (float)($inv['gstRate'] ?? ($inv['gst_rate'] ?? 18)),
                ':gstAmount'   => (float)($inv['gstAmount'] ?? ($inv['gst_amount'] ?? 0)),
                ':discount'    => (float)($inv['discount'] ?? 0),
                ':netAmount'   => (float)($inv['netAmount'] ?? ($inv['net_amount'] ?? 0)),
                ':status'      => $inv['status'] ?? 'Unpaid'
            ]);
        }
    }

    // 13. Followups (Admin / Exec only)
    if ($isExec && !empty($state['followups']) && is_array($state['followups'])) {
        $stmt = $db->prepare("
            INSERT INTO followups (id, client_id, last_contact, next_followup, type, assigned_employee_id, status, remarks)
            VALUES (:id, :clientId, :lastContact, :nextFollowup, :type, :assignedEmployeeId, :status, :remarks)
            ON DUPLICATE KEY UPDATE next_followup=VALUES(next_followup), status=VALUES(status), remarks=VALUES(remarks)
        ");
        foreach ($state['followups'] as $f) {
            $stmt->execute([
                ':id'                 => $f['id'],
                ':clientId'           => $f['clientId'] ?? ($f['client_id'] ?? ''),
                ':lastContact'        => $f['lastContact'] ?? ($f['last_contact'] ?? date('Y-m-d')),
                ':nextFollowup'       => $f['nextFollowup'] ?? ($f['next_followup'] ?? date('Y-m-d')),
                ':type'               => $f['type'] ?? 'Call',
                ':assignedEmployeeId' => $f['assignedEmployeeId'] ?? ($f['assigned_employee_id'] ?? 'E001'),
                ':status'             => $f['status'] ?? 'Scheduled',
                ':remarks'            => $f['remarks'] ?? ''
            ]);
        }
    }

    // 14. Reminders (Admin or scoped to assigned user)
    if (!empty($state['reminders']) && is_array($state['reminders'])) {
        $stmt = $db->prepare("
            INSERT INTO reminders (id, title, description, client_id, service_id, assigned_employee_id, reminder_date, reminder_time, priority, status)
            VALUES (:id, :title, :description, :clientId, :serviceId, :assignedEmployeeId, :reminderDate, :reminderTime, :priority, :status)
            ON DUPLICATE KEY UPDATE status=VALUES(status), reminder_date=VALUES(reminder_date)
        ");
        foreach ($state['reminders'] as $r) {
            $remEmpId = $r['assignedEmployeeId'] ?? ($r['assigned_employee_id'] ?? '');
            if (!$isExec && !empty($remEmpId) && $remEmpId !== $userId) {
                continue;
            }
            $stmt->execute([
                ':id'                 => $r['id'],
                ':title'              => $r['title'] ?? '',
                ':description'        => $r['description'] ?? '',
                ':clientId'           => $r['clientId'] ?? ($r['client_id'] ?? ''),
                ':serviceId'          => $r['serviceId'] ?? ($r['service_id'] ?? ''),
                ':assignedEmployeeId' => $remEmpId ?: $userId,
                ':reminderDate'       => $r['reminderDate'] ?? ($r['reminder_date'] ?? date('Y-m-d')),
                ':reminderTime'       => $r['reminderTime'] ?? ($r['reminder_time'] ?? '09:00'),
                ':priority'           => $r['priority'] ?? 'Medium',
                ':status'             => $r['status'] ?? 'Pending'
            ]);
        }
    }

    // 15. Notes (Admin / Exec only)
    if ($isExec && !empty($state['notes']) && is_array($state['notes'])) {
        $stmt = $db->prepare("
            INSERT INTO notes (id, client_id, title, description, tags, created_by_id, date_created, pinned)
            VALUES (:id, :clientId, :title, :description, :tags, :createdById, :dateCreated, :pinned)
            ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), pinned=VALUES(pinned)
        ");
        foreach ($state['notes'] as $n) {
            $tags = !empty($n['tags']) ? (is_array($n['tags']) ? json_encode($n['tags']) : $n['tags']) : '[]';
            $stmt->execute([
                ':id'          => $n['id'],
                ':clientId'    => $n['clientId'] ?? ($n['client_id'] ?? ''),
                ':title'       => $n['title'] ?? '',
                ':description' => $n['description'] ?? '',
                ':tags'        => $tags,
                ':createdById' => $n['createdById'] ?? ($n['created_by_id'] ?? $userId),
                ':dateCreated' => $n['dateCreated'] ?? ($n['date_created'] ?? date('Y-m-d')),
                ':pinned'      => !empty($n['pinned']) ? 1 : 0
            ]);
        }
    }

    // 16. Meta Ads (Admin / Exec only)
    if ($isExec && !empty($state['metaAds']) && is_array($state['metaAds'])) {
        $stmt = $db->prepare("
            INSERT INTO meta_ads (id, client_name, campaign_name, objective, package_amount, ad_budget, start_date, end_date, renewal_date, status, assigned_employee_id, remarks, daily_performance, payments, notes, followups, timeline)
            VALUES (:id, :clientName, :campaignName, :objective, :packageAmount, :adBudget, :startDate, :endDate, :renewalDate, :status, :assignedEmployeeId, :remarks, :dailyPerformance, :payments, :notes, :followups, :timeline)
            ON DUPLICATE KEY UPDATE campaign_name=VALUES(campaign_name), status=VALUES(status), package_amount=VALUES(package_amount)
        ");
        foreach ($state['metaAds'] as $m) {
            $stmt->execute([
                ':id'                 => $m['id'],
                ':clientName'         => $m['clientName'] ?? ($m['client_name'] ?? ''),
                ':campaignName'       => $m['campaignName'] ?? ($m['campaign_name'] ?? ''),
                ':objective'          => $m['objective'] ?? '',
                ':packageAmount'      => (float)($m['packageAmount'] ?? ($m['package_amount'] ?? 0)),
                ':adBudget'           => (float)($m['adBudget'] ?? ($m['ad_budget'] ?? 0)),
                ':startDate'          => $m['startDate'] ?? ($m['start_date'] ?? date('Y-m-d')),
                ':endDate'            => $m['endDate'] ?? ($m['end_date'] ?? date('Y-m-d')),
                ':renewalDate'        => $m['renewalDate'] ?? ($m['renewal_date'] ?? ''),
                ':status'             => $m['status'] ?? 'Active',
                ':assignedEmployeeId' => $m['assignedEmployeeId'] ?? ($m['assigned_employee_id'] ?? 'E001'),
                ':remarks'            => $m['remarks'] ?? '',
                ':dailyPerformance'   => is_array($m['dailyPerformance'] ?? null) ? json_encode($m['dailyPerformance']) : ($m['daily_performance'] ?? '[]'),
                ':payments'           => is_array($m['payments'] ?? null) ? json_encode($m['payments']) : '[]',
                ':notes'              => is_array($m['notes'] ?? null) ? json_encode($m['notes']) : '[]',
                ':followups'          => is_array($m['followups'] ?? null) ? json_encode($m['followups']) : '[]',
                ':timeline'           => is_array($m['timeline'] ?? null) ? json_encode($m['timeline']) : '[]'
            ]);
        }
    }

    // 17. Google Ads (Admin / Exec only)
    if ($isExec && !empty($state['googleAds']) && is_array($state['googleAds'])) {
        $stmt = $db->prepare("
            INSERT INTO google_ads (id, client_id, campaign_name, objective, package_amount, ad_budget, start_date, end_date, reach, clicks, leads, cpl, roas, status, assigned_employee_id, notes)
            VALUES (:id, :clientId, :campaignName, :objective, :packageAmount, :adBudget, :startDate, :endDate, :reach, :clicks, :leads, :cpl, :roas, :status, :assignedEmployeeId, :notes)
            ON DUPLICATE KEY UPDATE campaign_name=VALUES(campaign_name), status=VALUES(status)
        ");
        foreach ($state['googleAds'] as $g) {
            $stmt->execute([
                ':id'                 => $g['id'],
                ':clientId'           => $g['clientId'] ?? ($g['client_id'] ?? ''),
                ':campaignName'       => $g['campaignName'] ?? ($g['campaign_name'] ?? ''),
                ':objective'          => $g['objective'] ?? '',
                ':packageAmount'      => (float)($g['packageAmount'] ?? ($g['package_amount'] ?? 0)),
                ':adBudget'           => (float)($g['adBudget'] ?? ($g['ad_budget'] ?? 0)),
                ':startDate'          => $g['startDate'] ?? ($g['start_date'] ?? date('Y-m-d')),
                ':endDate'            => $g['endDate'] ?? ($g['end_date'] ?? date('Y-m-d')),
                ':reach'              => (int)($g['reach'] ?? 0),
                ':clicks'             => (int)($g['clicks'] ?? 0),
                ':leads'              => (int)($g['leads'] ?? 0),
                ':cpl'                => (float)($g['cpl'] ?? 0),
                ':roas'               => (float)($g['roas'] ?? 0),
                ':status'             => $g['status'] ?? 'Active',
                ':assignedEmployeeId' => $g['assignedEmployeeId'] ?? ($g['assigned_employee_id'] ?? 'E001'),
                ':notes'              => $g['notes'] ?? ''
            ]);
        }
    }

    // 18. SEO (Admin / Exec only)
    if ($isExec && !empty($state['seo']) && is_array($state['seo'])) {
        $stmt = $db->prepare("
            INSERT INTO seo (id, client_id, website_url, campaign_name, package, start_date, end_date, budget, status, report_date, report_frequency, target_keywords, current_ranking, articles_published, backlinks, report_file, assigned_employee_id, progress, notes, keywords, weekly_log, uploaded_reports, ga4, gsc)
            VALUES (:id, :clientId, :websiteUrl, :campaignName, :package, :startDate, :endDate, :budget, :status, :reportDate, :reportFrequency, :targetKeywords, :currentRanking, :articlesPublished, :backlinks, :reportFile, :assignedEmployeeId, :progress, :notes, :keywords, :weeklyLog, :uploadedReports, :ga4, :gsc)
            ON DUPLICATE KEY UPDATE campaign_name=VALUES(campaign_name), progress=VALUES(progress), status=VALUES(status)
        ");
        foreach ($state['seo'] as $s) {
            $stmt->execute([
                ':id'                 => $s['id'],
                ':clientId'           => $s['clientId'] ?? ($s['client_id'] ?? ''),
                ':websiteUrl'         => $s['websiteUrl'] ?? ($s['website_url'] ?? ''),
                ':campaignName'       => $s['campaignName'] ?? ($s['campaign_name'] ?? ''),
                ':package'            => $s['package'] ?? '',
                ':startDate'          => $s['startDate'] ?? ($s['start_date'] ?? date('Y-m-d')),
                ':endDate'            => $s['endDate'] ?? ($s['end_date'] ?? date('Y-m-d')),
                ':budget'             => (float)($s['budget'] ?? 0),
                ':status'             => $s['status'] ?? 'Active',
                ':reportDate'         => $s['reportDate'] ?? ($s['report_date'] ?? ''),
                ':reportFrequency'    => $s['reportFrequency'] ?? ($s['report_frequency'] ?? 'Monthly'),
                ':targetKeywords'     => $s['targetKeywords'] ?? ($s['target_keywords'] ?? ''),
                ':currentRanking'     => $s['currentRanking'] ?? ($s['current_ranking'] ?? ''),
                ':articlesPublished'  => (int)($s['articlesPublished'] ?? ($s['articles_published'] ?? 0)),
                ':backlinks'          => (int)($s['backlinks'] ?? 0),
                ':reportFile'         => $s['reportFile'] ?? ($s['report_file'] ?? ''),
                ':assignedEmployeeId' => $s['assignedEmployeeId'] ?? ($s['assigned_employee_id'] ?? 'E001'),
                ':progress'           => (int)($s['progress'] ?? 0),
                ':notes'              => $s['notes'] ?? '',
                ':keywords'           => is_array($s['keywords'] ?? null) ? json_encode($s['keywords']) : ($s['keywords'] ?? '[]'),
                ':weeklyLog'          => is_array($s['weeklyLog'] ?? null) ? json_encode($s['weeklyLog']) : ($s['weekly_log'] ?? '[]'),
                ':uploadedReports'    => is_array($s['uploadedReports'] ?? null) ? json_encode($s['uploadedReports']) : ($s['uploaded_reports'] ?? '[]'),
                ':ga4'                => is_array($s['ga4'] ?? null) ? json_encode($s['ga4']) : ($s['ga4'] ?? '{}'),
                ':gsc'                => is_array($s['gsc'] ?? null) ? json_encode($s['gsc']) : ($s['gsc'] ?? '{}')
            ]);
        }
    }

    // 19. Projects (Admin / Exec only)
    if ($isExec && !empty($state['projects']) && is_array($state['projects'])) {
        $stmt = $db->prepare("
            INSERT INTO projects (id, client_id, project_name, website_type, domain, hosting, start_date, delivery_date, progress, assigned_developer_id, status, notes)
            VALUES (:id, :clientId, :projectName, :websiteType, :domain, :hosting, :startDate, :deliveryDate, :progress, :assignedDeveloperId, :status, :notes)
            ON DUPLICATE KEY UPDATE project_name=VALUES(project_name), progress=VALUES(progress), status=VALUES(status)
        ");
        foreach ($state['projects'] as $pr) {
            $stmt->execute([
                ':id'                  => $pr['id'],
                ':clientId'            => $pr['clientId'] ?? ($pr['client_id'] ?? ''),
                ':projectName'         => $pr['projectName'] ?? ($pr['project_name'] ?? ''),
                ':websiteType'         => $pr['websiteType'] ?? ($pr['website_type'] ?? 'Custom'),
                ':domain'              => $pr['domain'] ?? '',
                ':hosting'             => $pr['hosting'] ?? '',
                ':startDate'           => $pr['startDate'] ?? ($pr['start_date'] ?? date('Y-m-d')),
                ':deliveryDate'        => $pr['deliveryDate'] ?? ($pr['delivery_date'] ?? date('Y-m-d')),
                ':progress'            => (int)($pr['progress'] ?? 0),
                ':assignedDeveloperId' => $pr['assignedDeveloperId'] ?? ($pr['assigned_developer_id'] ?? 'E001'),
                ':status'              => $pr['status'] ?? 'In Progress',
                ':notes'               => $pr['notes'] ?? ''
            ]);
        }
    }

    // 20. Canva (Admin / Exec only)
    if ($isExec && !empty($state['canva']) && is_array($state['canva'])) {
        $stmt = $db->prepare("
            INSERT INTO canva (id, client_name, email, price, purchase_date, renewal_date, notes)
            VALUES (:id, :clientName, :email, :price, :purchaseDate, :renewalDate, :notes)
            ON DUPLICATE KEY UPDATE price=VALUES(price), renewal_date=VALUES(renewal_date)
        ");
        foreach ($state['canva'] as $can) {
            $stmt->execute([
                ':id'           => $can['id'],
                ':clientName'   => $can['clientName'] ?? ($can['client_name'] ?? ''),
                ':email'        => $can['email'] ?? '',
                ':price'        => (float)($can['price'] ?? 499),
                ':purchaseDate' => $can['purchaseDate'] ?? ($can['purchase_date'] ?? date('Y-m-d')),
                ':renewalDate'  => $can['renewalDate'] ?? ($can['renewal_date'] ?? date('Y-m-d')),
                ':notes'        => $can['notes'] ?? ''
            ]);
        }
    }

    // 21. Billing Software (Admin / Exec only)
    if ($isExec && !empty($state['billingSoftware']) && is_array($state['billingSoftware'])) {
        $stmt = $db->prepare("
            INSERT INTO billing_software (id, client_name, company_name, client_id, price, maintenance, purchase_date, renewal_date, notes)
            VALUES (:id, :clientName, :companyName, :clientId, :price, :maintenance, :purchaseDate, :renewalDate, :notes)
            ON DUPLICATE KEY UPDATE price=VALUES(price), maintenance=VALUES(maintenance), renewal_date=VALUES(renewal_date)
        ");
        foreach ($state['billingSoftware'] as $bs) {
            $stmt->execute([
                ':id'           => $bs['id'],
                ':clientName'   => $bs['clientName'] ?? ($bs['client_name'] ?? ''),
                ':companyName'  => $bs['companyName'] ?? ($bs['company_name'] ?? ''),
                ':clientId'     => $bs['clientId'] ?? ($bs['client_id'] ?? ''),
                ':price'        => (float)($bs['price'] ?? 0),
                ':maintenance'  => (float)($bs['maintenance'] ?? 0),
                ':purchaseDate' => $bs['purchaseDate'] ?? ($bs['purchase_date'] ?? date('Y-m-d')),
                ':renewalDate'  => $bs['renewalDate'] ?? ($bs['renewal_date'] ?? date('Y-m-d')),
                ':notes'        => $bs['notes'] ?? ''
            ]);
        }
    }

    // 22. Settings (Admin / Exec only)
    if ($isExec && !empty($state['settings']) && is_array($state['settings'])) {
        $stmt = $db->prepare("
            INSERT INTO settings (setting_key, setting_value)
            VALUES (:key, :val)
            ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value)
        ");
        foreach ($state['settings'] as $k => $v) {
            $stmt->execute([
                ':key' => $k,
                ':val' => is_array($v) ? json_encode($v) : (string)$v
            ]);
        }
    }

    $db->commit();
    json_response(['success' => true, 'message' => 'State synchronization completed successfully.']);
} catch (Exception $e) {
    $db->rollBack();
    json_error("Migration failed: " . $e->getMessage(), 500);
}
