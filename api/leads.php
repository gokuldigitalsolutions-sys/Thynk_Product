<?php
// ==========================================================
// Thynk Digital Solution - Leads API Endpoint
// Protected: Authentication, Module Permission (crm), CSRF
// ==========================================================

require_once __DIR__ . '/config.php';

$user   = require_module_perm('crm');
$db     = get_db();
$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;

// GET: List all leads or single lead
if ($method === 'GET') {
    if ($id) {
        $stmt = $db->prepare("SELECT id, company_name AS companyName, contact_name AS contactName, mobile, email, source, value, status, assigned_employee_id AS assignedEmployeeId, notes, date_created AS dateCreated FROM leads WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $lead = $stmt->fetch();
        if (!$lead) json_error("Lead not found.", 404);
        $lead['value'] = (float)$lead['value'];
        json_response(['success' => true, 'data' => $lead]);
    } else {
        $stmt = $db->query("SELECT id, company_name AS companyName, contact_name AS contactName, mobile, email, source, value, status, assigned_employee_id AS assignedEmployeeId, notes, date_created AS dateCreated FROM leads ORDER BY id ASC");
        $raw = $stmt->fetchAll();
        $leads = array_map(function($l) {
            $l['value'] = (float)$l['value'];
            return $l;
        }, $raw);
        json_response(['success' => true, 'data' => $leads]);
    }
}

// POST: Add new lead
if ($method === 'POST') {
    verify_csrf();
    $input = get_input();

    $leadId = trim($input['id'] ?? '');
    if (empty($leadId)) {
        $stmt = $db->query("SELECT id FROM leads WHERE id LIKE 'L%'");
        $rows = $stmt->fetchAll();
        $maxNum = 0;
        foreach ($rows as $r) {
            if (preg_match('/L(\d+)/', $r['id'], $m)) {
                $num = (int)$m[1];
                if ($num > $maxNum) $maxNum = $num;
            }
        }
        $leadId = 'L' . str_pad($maxNum + 1, 3, '0', STR_PAD_LEFT);
    }

    $companyName = trim($input['companyName'] ?? ($input['company_name'] ?? ''));
    $contactName = trim($input['contactName'] ?? ($input['contact_name'] ?? ''));

    $stmt = $db->prepare("
        INSERT INTO leads (id, company_name, contact_name, mobile, email, source, value, status, assigned_employee_id, notes, date_created)
        VALUES (:id, :companyName, :contactName, :mobile, :email, :source, :value, :status, :assignedEmployeeId, :notes, :dateCreated)
    ");

    $stmt->execute([
        ':id'                 => $leadId,
        ':companyName'        => $companyName,
        ':contactName'        => $contactName,
        ':mobile'             => $input['mobile'] ?? '',
        ':email'              => $input['email'] ?? '',
        ':source'             => $input['source'] ?? 'Website',
        ':value'              => (float)($input['value'] ?? 0),
        ':status'             => $input['status'] ?? 'New',
        ':assignedEmployeeId' => $input['assignedEmployeeId'] ?? ($input['assigned_employee_id'] ?? $user['id']),
        ':notes'              => $input['notes'] ?? '',
        ':dateCreated'        => $input['dateCreated'] ?? ($input['date_created'] ?? date('Y-m-d'))
    ]);

    json_response(['success' => true, 'message' => 'Lead created successfully.', 'id' => $leadId], 201);
}

// PUT: Update lead
if ($method === 'PUT') {
    verify_csrf();
    $input = get_input();
    $leadId = $id ?? ($input['id'] ?? null);
    if (!$leadId) {
        json_error("Lead ID is required for update.", 400);
    }

    $stmt = $db->prepare("
        UPDATE leads SET
            company_name = COALESCE(:companyName, company_name),
            contact_name = COALESCE(:contactName, contact_name),
            mobile = COALESCE(:mobile, mobile),
            email = COALESCE(:email, email),
            source = COALESCE(:source, source),
            value = COALESCE(:value, value),
            status = COALESCE(:status, status),
            assigned_employee_id = COALESCE(:assignedEmployeeId, assigned_employee_id),
            notes = COALESCE(:notes, notes)
        WHERE id = :id
    ");

    $stmt->execute([
        ':id'                 => $leadId,
        ':companyName'        => $input['companyName'] ?? null,
        ':contactName'        => $input['contactName'] ?? null,
        ':mobile'             => $input['mobile'] ?? null,
        ':email'              => $input['email'] ?? null,
        ':source'             => $input['source'] ?? null,
        ':value'              => isset($input['value']) ? (float)$input['value'] : null,
        ':status'             => $input['status'] ?? null,
        ':assignedEmployeeId' => $input['assignedEmployeeId'] ?? null,
        ':notes'              => $input['notes'] ?? null
    ]);

    json_response(['success' => true, 'message' => 'Lead updated successfully.']);
}

// DELETE: Remove lead
if ($method === 'DELETE') {
    verify_csrf();
    $leadId = $id ?? ($_GET['id'] ?? null);
    if (!$leadId) {
        json_error("Lead ID is required for deletion.", 400);
    }

    $stmt = $db->prepare("DELETE FROM leads WHERE id = ?");
    $stmt->execute([$leadId]);

    json_response(['success' => true, 'message' => 'Lead deleted successfully.']);
}

json_error("Unsupported method.", 405);
