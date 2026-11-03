<?php
// ==========================================================
// Thynk Digital Solution - Tasks API Endpoint
// Protected: Authentication, CSRF, and Employee Data Isolation
// ==========================================================

require_once __DIR__ . '/config.php';

$user   = require_auth();
require_module_perm('hrms');
$db     = get_db();
$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;
$isExec = is_admin_or_exec($user);
$userId = $user['id'];

// ----------------------------------------------------------
// GET: List or Retrieve Tasks
// ----------------------------------------------------------
if ($method === 'GET') {
    if ($id) {
        $stmt = $db->prepare("SELECT id, task_name AS taskName, description, client_id AS clientId, service_id AS serviceId, assigned_employee_id AS assignedEmployeeId, priority, start_date AS startDate, due_date AS dueDate, est_hours AS estHours, progress, status, comments, attachments FROM tasks WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row) json_error("Task not found.", 404);

        if (!$isExec && $row['assignedEmployeeId'] !== $userId) {
            json_error("Access denied. You can only view tasks assigned to you.", 403);
        }

        $row['estHours'] = (float)$row['estHours'];
        $row['progress'] = (int)$row['progress'];
        $row['attachments'] = (int)$row['attachments'];
        $row['comments'] = !empty($row['comments']) && is_string($row['comments']) ? (json_decode($row['comments'], true) ?: []) : [];
        json_response(['success' => true, 'data' => $row]);
    } else {
        $query = "SELECT id, task_name AS taskName, description, client_id AS clientId, service_id AS serviceId, assigned_employee_id AS assignedEmployeeId, priority, start_date AS startDate, due_date AS dueDate, est_hours AS estHours, progress, status, comments, attachments FROM tasks WHERE 1=1";
        $params = [];
        $reqEmp = $_GET['assignedEmployeeId'] ?? ($_GET['employee_id'] ?? null);

        if (!$isExec) {
            if ($reqEmp && $reqEmp !== 'all' && $reqEmp !== $userId) {
                json_error("Access denied. You cannot view other employees' tasks.", 403);
            }
            $query .= " AND assigned_employee_id = ?";
            $params[] = $userId;
        } else {
            if ($reqEmp && $reqEmp !== 'all') {
                $query .= " AND assigned_employee_id = ?";
                $params[] = $reqEmp;
            }
        }

        $query .= " ORDER BY id ASC";
        $stmt = $db->prepare($query);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();

        $rows = array_map(function($t) {
            $t['estHours'] = (float)$t['estHours'];
            $t['progress'] = (int)$t['progress'];
            $t['attachments'] = (int)$t['attachments'];
            $t['comments'] = !empty($t['comments']) && is_string($t['comments']) ? (json_decode($t['comments'], true) ?: []) : [];
            return $t;
        }, $rows);

        json_response(['success' => true, 'data' => $rows]);
    }
}

// ----------------------------------------------------------
// POST: Create Task
// ----------------------------------------------------------
if ($method === 'POST') {
    verify_csrf();
    $input = get_input();

    $taskId = trim($input['id'] ?? '');
    if (empty($taskId)) {
        $stmt = $db->query("SELECT id FROM tasks WHERE id LIKE 'T%'");
        $rows = $stmt->fetchAll();
        $maxNum = 0;
        foreach ($rows as $r) {
            if (preg_match('/T(\d+)/', $r['id'], $m)) {
                $num = (int)$m[1];
                if ($num > $maxNum) $maxNum = $num;
            }
        }
        $taskId = 'T' . str_pad($maxNum + 1, 3, '0', STR_PAD_LEFT);
    }

    $assignedEmp = trim($input['assignedEmployeeId'] ?? ($input['assigned_employee_id'] ?? ''));
    if (!$isExec) {
        // Non-admin can only create task assigned to themselves
        if (!empty($assignedEmp) && $assignedEmp !== $userId) {
            json_error("Access denied. Only administrators can assign tasks to other employees.", 403);
        }
        $assignedEmp = $userId;
    } else {
        if (empty($assignedEmp)) $assignedEmp = $userId;
    }

    $taskName = trim($input['taskName'] ?? ($input['task_name'] ?? ''));
    if (empty($taskName)) {
        json_error("Task name is required.", 400);
    }

    $comments = !empty($input['comments']) ? (is_array($input['comments']) ? json_encode($input['comments']) : $input['comments']) : '[]';

    $stmt = $db->prepare("
        INSERT INTO tasks (id, task_name, description, client_id, service_id, assigned_employee_id, priority, start_date, due_date, est_hours, progress, status, comments, attachments)
        VALUES (:id, :taskName, :description, :clientId, :serviceId, :assignedEmployeeId, :priority, :startDate, :dueDate, :estHours, :progress, :status, :comments, :attachments)
    ");

    $stmt->execute([
        ':id'                 => $taskId,
        ':taskName'           => $taskName,
        ':description'        => $input['description'] ?? '',
        ':clientId'           => $input['clientId'] ?? ($input['client_id'] ?? ''),
        ':serviceId'          => $input['serviceId'] ?? ($input['service_id'] ?? ''),
        ':assignedEmployeeId' => $assignedEmp,
        ':priority'           => $input['priority'] ?? 'Medium',
        ':startDate'          => $input['startDate'] ?? ($input['start_date'] ?? date('Y-m-d')),
        ':dueDate'            => $input['dueDate'] ?? ($input['due_date'] ?? date('Y-m-d')),
        ':estHours'           => (float)($input['estHours'] ?? ($input['est_hours'] ?? 0)),
        ':progress'           => (int)($input['progress'] ?? 0),
        ':status'             => $input['status'] ?? 'Pending',
        ':comments'           => $comments,
        ':attachments'        => (int)($input['attachments'] ?? 0)
    ]);

    json_response(['success' => true, 'message' => 'Task created successfully.', 'id' => $taskId], 201);
}

// ----------------------------------------------------------
// PUT: Update Task
// ----------------------------------------------------------
if ($method === 'PUT') {
    verify_csrf();
    $input = get_input();
    $taskId = $id ?? ($input['id'] ?? null);

    if (!$taskId) {
        json_error("Task ID is required for update.", 400);
    }

    $chkStmt = $db->prepare("SELECT * FROM tasks WHERE id = ? LIMIT 1");
    $chkStmt->execute([$taskId]);
    $existing = $chkStmt->fetch();
    if (!$existing) {
        json_error("Task not found.", 404);
    }

    if (!$isExec && $existing['assigned_employee_id'] !== $userId) {
        json_error("Access denied. You cannot modify tasks assigned to other employees.", 403);
    }

    $comments = null;
    if (isset($input['comments'])) {
        $comments = is_array($input['comments']) ? json_encode($input['comments']) : $input['comments'];
    }

    $assignedEmp = $isExec ? ($input['assignedEmployeeId'] ?? ($input['assigned_employee_id'] ?? $existing['assigned_employee_id'])) : $existing['assigned_employee_id'];

    $stmt = $db->prepare("
        UPDATE tasks SET
            task_name = COALESCE(:taskName, task_name),
            description = COALESCE(:description, description),
            client_id = COALESCE(:clientId, client_id),
            service_id = COALESCE(:serviceId, service_id),
            assigned_employee_id = :assignedEmployeeId,
            priority = COALESCE(:priority, priority),
            start_date = COALESCE(:startDate, start_date),
            due_date = COALESCE(:dueDate, due_date),
            est_hours = COALESCE(:estHours, est_hours),
            progress = COALESCE(:progress, progress),
            status = COALESCE(:status, status),
            comments = COALESCE(:comments, comments),
            attachments = COALESCE(:attachments, attachments)
        WHERE id = :id
    ");

    $stmt->execute([
        ':id'                 => $taskId,
        ':taskName'           => $input['taskName'] ?? ($input['task_name'] ?? null),
        ':description'        => $input['description'] ?? null,
        ':clientId'           => $input['clientId'] ?? ($input['client_id'] ?? null),
        ':serviceId'          => $input['serviceId'] ?? ($input['service_id'] ?? null),
        ':assignedEmployeeId' => $assignedEmp,
        ':priority'           => $input['priority'] ?? null,
        ':startDate'          => $input['startDate'] ?? ($input['start_date'] ?? null),
        ':dueDate'            => $input['dueDate'] ?? ($input['due_date'] ?? null),
        ':estHours'           => isset($input['estHours']) ? (float)$input['estHours'] : (isset($input['est_hours']) ? (float)$input['est_hours'] : null),
        ':progress'           => isset($input['progress']) ? (int)$input['progress'] : null,
        ':status'             => $input['status'] ?? null,
        ':comments'           => $comments,
        ':attachments'        => isset($input['attachments']) ? (int)$input['attachments'] : null
    ]);

    json_response(['success' => true, 'message' => 'Task updated successfully.']);
}

// ----------------------------------------------------------
// DELETE: Delete Task (Admin Only)
// ----------------------------------------------------------
if ($method === 'DELETE') {
    require_admin_or_exec($user);
    verify_csrf();

    $taskId = $id ?? ($_GET['id'] ?? null);
    if (!$taskId) {
        json_error("Task ID is required for deletion.", 400);
    }

    $stmt = $db->prepare("DELETE FROM tasks WHERE id = ?");
    $stmt->execute([$taskId]);

    json_response(['success' => true, 'message' => 'Task deleted successfully.']);
}

json_error("Unsupported method.", 405);
