<?php
// ==========================================================
// Thynk Digital Solution - Followups API Endpoint
// Protected: Authentication, Module Permission (crm), CSRF
// ==========================================================

require_once __DIR__ . '/config.php';

$user   = require_module_perm('crm');
$db     = get_db();
$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;

// GET: List all followups or single followup
if ($method === 'GET') {
    if ($id) {
        $stmt = $db->prepare("SELECT id, client_id AS clientId, last_contact AS lastContact, next_followup AS nextFollowup, type, assigned_employee_id AS assignedEmployeeId, status, remarks FROM followups WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $followup = $stmt->fetch();
        if (!$followup) json_error("Followup not found.", 404);
        json_response(['success' => true, 'data' => $followup]);
    } else {
        $stmt = $db->query("SELECT id, client_id AS clientId, last_contact AS lastContact, next_followup AS nextFollowup, type, assigned_employee_id AS assignedEmployeeId, status, remarks FROM followups ORDER BY next_followup ASC");
        $followups = $stmt->fetchAll();
        json_response(['success' => true, 'data' => $followups]);
    }
}

// POST: Add new followup
if ($method === 'POST') {
    verify_csrf();
    $input = get_input();

    $folId = trim($input['id'] ?? '');
    if (empty($folId)) {
        $stmt = $db->query("SELECT id FROM followups WHERE id LIKE 'FOL%'");
        $rows = $stmt->fetchAll();
        $maxNum = 0;
        foreach ($rows as $r) {
            if (preg_match('/FOL(\d+)/', $r['id'], $m)) {
                $num = (int)$m[1];
                if ($num > $maxNum) $maxNum = $num;
            }
        }
        $folId = 'FOL' . str_pad($maxNum + 1, 3, '0', STR_PAD_LEFT);
    }

    $clientId = trim($input['clientId'] ?? ($input['client_id'] ?? ''));
    if (empty($clientId)) {
        json_error("Client ID is required.", 400);
    }

    $stmt = $db->prepare("
        INSERT INTO followups (id, client_id, last_contact, next_followup, type, assigned_employee_id, status, remarks)
        VALUES (:id, :clientId, :lastContact, :nextFollowup, :type, :assignedEmployeeId, :status, :remarks)
    ");

    $stmt->execute([
        ':id'                 => $folId,
        ':clientId'           => $clientId,
        ':lastContact'        => $input['lastContact'] ?? ($input['last_contact'] ?? date('Y-m-d')),
        ':nextFollowup'       => $input['nextFollowup'] ?? ($input['next_followup'] ?? date('Y-m-d', strtotime('+7 days'))),
        ':type'               => $input['type'] ?? 'Call',
        ':assignedEmployeeId' => $input['assignedEmployeeId'] ?? ($input['assigned_employee_id'] ?? $user['id']),
        ':status'             => $input['status'] ?? 'Scheduled',
        ':remarks'            => $input['remarks'] ?? ''
    ]);

    json_response(['success' => true, 'message' => 'Followup created successfully.', 'id' => $folId], 201);
}

// PUT: Update followup
if ($method === 'PUT') {
    verify_csrf();
    $input = get_input();
    $folId = $id ?? ($input['id'] ?? null);
    if (!$folId) {
        json_error("Followup ID is required for update.", 400);
    }

    $stmt = $db->prepare("
        UPDATE followups SET
            client_id = COALESCE(:clientId, client_id),
            last_contact = COALESCE(:lastContact, last_contact),
            next_followup = COALESCE(:nextFollowup, next_followup),
            type = COALESCE(:type, type),
            assigned_employee_id = COALESCE(:assignedEmployeeId, assigned_employee_id),
            status = COALESCE(:status, status),
            remarks = COALESCE(:remarks, remarks)
        WHERE id = :id
    ");

    $stmt->execute([
        ':id'                 => $folId,
        ':clientId'           => $input['clientId'] ?? ($input['client_id'] ?? null),
        ':lastContact'        => $input['lastContact'] ?? ($input['last_contact'] ?? null),
        ':nextFollowup'       => $input['nextFollowup'] ?? ($input['next_followup'] ?? null),
        ':type'               => $input['type'] ?? null,
        ':assignedEmployeeId' => $input['assignedEmployeeId'] ?? ($input['assigned_employee_id'] ?? null),
        ':status'             => $input['status'] ?? null,
        ':remarks'            => $input['remarks'] ?? null
    ]);

    json_response(['success' => true, 'message' => 'Followup updated successfully.']);
}

// DELETE: Remove followup
if ($method === 'DELETE') {
    verify_csrf();
    $folId = $id ?? ($_GET['id'] ?? null);
    if (!$folId) {
        json_error("Followup ID is required for deletion.", 400);
    }

    $stmt = $db->prepare("DELETE FROM followups WHERE id = ?");
    $stmt->execute([$folId]);

    json_response(['success' => true, 'message' => 'Followup deleted successfully.']);
}

json_error("Unsupported method.", 405);
