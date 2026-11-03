<?php
// ==========================================================
// Thynk Digital Solution - Reminders API Endpoint
// Protected: Authentication, CSRF, and Isolation
// ==========================================================

require_once __DIR__ . '/config.php';

$user   = require_auth();
$db     = get_db();
$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;
$isExec = is_admin_or_exec($user);
$userId = $user['id'];

// GET: List reminders
if ($method === 'GET') {
    if ($id) {
        $stmt = $db->prepare("SELECT id, title, description, client_id AS clientId, service_id AS serviceId, assigned_employee_id AS assignedEmployeeId, reminder_date AS reminderDate, reminder_time AS reminderTime, priority, status FROM reminders WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $reminder = $stmt->fetch();
        if (!$reminder) json_error("Reminder not found.", 404);
        if (!$isExec && !empty($reminder['assignedEmployeeId']) && $reminder['assignedEmployeeId'] !== $userId) {
            json_error("Access denied. You can only view your own reminders.", 403);
        }
        json_response(['success' => true, 'data' => $reminder]);
    } else {
        if ($isExec) {
            $stmt = $db->query("SELECT id, title, description, client_id AS clientId, service_id AS serviceId, assigned_employee_id AS assignedEmployeeId, reminder_date AS reminderDate, reminder_time AS reminderTime, priority, status FROM reminders ORDER BY reminder_date ASC, reminder_time ASC");
        } else {
            $stmt = $db->prepare("SELECT id, title, description, client_id AS clientId, service_id AS serviceId, assigned_employee_id AS assignedEmployeeId, reminder_date AS reminderDate, reminder_time AS reminderTime, priority, status FROM reminders WHERE assigned_employee_id = ? OR assigned_employee_id IS NULL OR assigned_employee_id = '' ORDER BY reminder_date ASC, reminder_time ASC");
            $stmt->execute([$userId]);
        }
        $reminders = $stmt->fetchAll();
        json_response(['success' => true, 'data' => $reminders]);
    }
}

// POST: Add new reminder
if ($method === 'POST') {
    verify_csrf();
    $input = get_input();

    $remId = trim($input['id'] ?? '');
    if (empty($remId)) {
        $stmt = $db->query("SELECT id FROM reminders WHERE id LIKE 'REM%'");
        $rows = $stmt->fetchAll();
        $maxNum = 0;
        foreach ($rows as $r) {
            if (preg_match('/REM(\d+)/', $r['id'], $m)) {
                $num = (int)$m[1];
                if ($num > $maxNum) $maxNum = $num;
            }
        }
        $remId = 'REM' . str_pad($maxNum + 1, 3, '0', STR_PAD_LEFT);
    }

    $title = trim($input['title'] ?? '');
    if (empty($title)) {
        json_error("Title is required.", 400);
    }

    $assignedEmp = $input['assignedEmployeeId'] ?? ($input['assigned_employee_id'] ?? $userId);
    if (!$isExec) {
        $assignedEmp = $userId;
    }

    $stmt = $db->prepare("
        INSERT INTO reminders (id, title, description, client_id, service_id, assigned_employee_id, reminder_date, reminder_time, priority, status)
        VALUES (:id, :title, :description, :clientId, :serviceId, :assignedEmployeeId, :reminderDate, :reminderTime, :priority, :status)
    ");

    $stmt->execute([
        ':id'                 => $remId,
        ':title'              => $title,
        ':description'        => $input['description'] ?? '',
        ':clientId'           => $input['clientId'] ?? ($input['client_id'] ?? ''),
        ':serviceId'          => $input['serviceId'] ?? ($input['service_id'] ?? ''),
        ':assignedEmployeeId' => $assignedEmp,
        ':reminderDate'       => $input['reminderDate'] ?? ($input['reminder_date'] ?? date('Y-m-d')),
        ':reminderTime'       => $input['reminderTime'] ?? ($input['reminder_time'] ?? '09:00'),
        ':priority'           => $input['priority'] ?? 'Medium',
        ':status'             => $input['status'] ?? 'Pending'
    ]);

    json_response(['success' => true, 'message' => 'Reminder created successfully.', 'id' => $remId], 201);
}

// PUT: Update reminder
if ($method === 'PUT') {
    verify_csrf();
    $input = get_input();
    $remId = $id ?? ($input['id'] ?? null);
    if (!$remId) {
        json_error("Reminder ID is required for update.", 400);
    }

    $chkStmt = $db->prepare("SELECT * FROM reminders WHERE id = ? LIMIT 1");
    $chkStmt->execute([$remId]);
    $existing = $chkStmt->fetch();
    if (!$existing) {
        json_error("Reminder not found.", 404);
    }

    if (!$isExec && !empty($existing['assigned_employee_id']) && $existing['assigned_employee_id'] !== $userId) {
        json_error("Access denied. You cannot update another employee's reminder.", 403);
    }

    $stmt = $db->prepare("
        UPDATE reminders SET
            title = COALESCE(:title, title),
            description = COALESCE(:description, description),
            client_id = COALESCE(:clientId, client_id),
            service_id = COALESCE(:serviceId, service_id),
            assigned_employee_id = COALESCE(:assignedEmployeeId, assigned_employee_id),
            reminder_date = COALESCE(:reminderDate, reminder_date),
            reminder_time = COALESCE(:reminderTime, reminder_time),
            priority = COALESCE(:priority, priority),
            status = COALESCE(:status, status)
        WHERE id = :id
    ");

    $stmt->execute([
        ':id'                 => $remId,
        ':title'              => $input['title'] ?? null,
        ':description'        => $input['description'] ?? null,
        ':clientId'           => $input['clientId'] ?? ($input['client_id'] ?? null),
        ':serviceId'          => $input['serviceId'] ?? ($input['service_id'] ?? null),
        ':assignedEmployeeId' => $isExec ? ($input['assignedEmployeeId'] ?? ($input['assigned_employee_id'] ?? null)) : null,
        ':reminderDate'       => $input['reminderDate'] ?? ($input['reminder_date'] ?? null),
        ':reminderTime'       => $input['reminderTime'] ?? ($input['reminder_time'] ?? null),
        ':priority'           => $input['priority'] ?? null,
        ':status'             => $input['status'] ?? null
    ]);

    json_response(['success' => true, 'message' => 'Reminder updated successfully.']);
}

// DELETE: Remove reminder
if ($method === 'DELETE') {
    verify_csrf();
    $remId = $id ?? ($_GET['id'] ?? null);
    if (!$remId) {
        json_error("Reminder ID is required for deletion.", 400);
    }

    $chkStmt = $db->prepare("SELECT * FROM reminders WHERE id = ? LIMIT 1");
    $chkStmt->execute([$remId]);
    $existing = $chkStmt->fetch();
    if (!$existing) {
        json_error("Reminder not found.", 404);
    }

    if (!$isExec && !empty($existing['assigned_employee_id']) && $existing['assigned_employee_id'] !== $userId) {
        json_error("Access denied. You cannot delete another employee's reminder.", 403);
    }

    $stmt = $db->prepare("DELETE FROM reminders WHERE id = ?");
    $stmt->execute([$remId]);

    json_response(['success' => true, 'message' => 'Reminder deleted successfully.']);
}

json_error("Unsupported method.", 405);
