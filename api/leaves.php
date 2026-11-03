<?php
// ==========================================================
// Thynk Digital Solution - Leaves & Allocations API Endpoint
// Protected: Authentication, CSRF, and Employee Data Isolation
// ==========================================================

require_once __DIR__ . '/config.php';

$user   = require_auth();
require_module_perm('hrms');
$db     = get_db();
$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;
$action = $_GET['action'] ?? null;
$isExec = is_admin_or_exec($user);
$userId = $user['id'];

// ----------------------------------------------------------
// LEAVE ALLOCATIONS ACTION
// ----------------------------------------------------------
if ($action === 'allocations') {
    if ($method === 'GET') {
        $reqEmp = $_GET['employeeId'] ?? ($_GET['employee_id'] ?? null);
        if (!$isExec) {
            if ($reqEmp && $reqEmp !== $userId) {
                json_error("Access denied. You can only view your own leave allocations.", 403);
            }
            $stmt = $db->prepare("SELECT employee_id AS employeeId, allocation_type AS allocationType, allowance FROM leave_allocations WHERE employee_id = ?");
            $stmt->execute([$userId]);
        } else {
            if ($reqEmp) {
                $stmt = $db->prepare("SELECT employee_id AS employeeId, allocation_type AS allocationType, allowance FROM leave_allocations WHERE employee_id = ?");
                $stmt->execute([$reqEmp]);
            } else {
                $stmt = $db->query("SELECT employee_id AS employeeId, allocation_type AS allocationType, allowance FROM leave_allocations ORDER BY employee_id ASC");
            }
        }
        $rows = $stmt->fetchAll();
        $rows = array_map(fn($r) => array_merge($r, ['allowance' => (int)$r['allowance']]), $rows);
        json_response(['success' => true, 'data' => $rows]);
    }

    if ($method === 'POST') {
        require_admin_or_exec($user);
        verify_csrf();
        $input = get_input();
        $empId = trim($input['employeeId'] ?? ($input['employee_id'] ?? ''));
        $type  = trim($input['allocationType'] ?? ($input['allocation_type'] ?? 'monthly'));
        $allow = (int)($input['allowance'] ?? 4);

        if (empty($empId)) {
            json_error("Employee ID is required.", 400);
        }

        $stmt = $db->prepare("
            INSERT INTO leave_allocations (employee_id, allocation_type, allowance)
            VALUES (:empId, :type, :allow)
            ON DUPLICATE KEY UPDATE allocation_type=VALUES(allocation_type), allowance=VALUES(allowance)
        ");
        $stmt->execute([':empId' => $empId, ':type' => $type, ':allow' => $allow]);
        json_response(['success' => true, 'message' => 'Leave allocation saved.']);
    }

    json_error("Unsupported method for allocations.", 405);
}

// ----------------------------------------------------------
// GET: List or Retrieve Leaves
// ----------------------------------------------------------
if ($method === 'GET') {
    if ($id) {
        $stmt = $db->prepare("SELECT id, employee_id AS employeeId, leave_type AS leaveType, start_date AS startDate, end_date AS endDate, total_days AS totalDays, reason, status FROM leaves WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row) json_error("Leave record not found.", 404);
        if (!$isExec && $row['employeeId'] !== $userId) {
            json_error("Access denied. You can only view your own leaves.", 403);
        }
        $row['totalDays'] = (int)$row['totalDays'];
        json_response(['success' => true, 'data' => $row]);
    } else {
        $query = "SELECT id, employee_id AS employeeId, leave_type AS leaveType, start_date AS startDate, end_date AS endDate, total_days AS totalDays, reason, status FROM leaves WHERE 1=1";
        $params = [];
        $reqEmp = $_GET['employeeId'] ?? ($_GET['employee_id'] ?? null);

        if (!$isExec) {
            if ($reqEmp && $reqEmp !== 'all' && $reqEmp !== $userId) {
                json_error("Access denied. You cannot view another employee's leaves.", 403);
            }
            $query .= " AND employee_id = ?";
            $params[] = $userId;
        } else {
            if ($reqEmp && $reqEmp !== 'all') {
                $query .= " AND employee_id = ?";
                $params[] = $reqEmp;
            }
        }

        $query .= " ORDER BY id DESC";
        $stmt = $db->prepare($query);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();
        $rows = array_map(fn($r) => array_merge($r, ['totalDays' => (int)$r['totalDays']]), $rows);
        json_response(['success' => true, 'data' => $rows]);
    }
}

// ----------------------------------------------------------
// POST: Apply for Leave
// ----------------------------------------------------------
if ($method === 'POST') {
    verify_csrf();
    $input = get_input();

    $leaveId = trim($input['id'] ?? '');
    if (empty($leaveId)) {
        $stmt = $db->query("SELECT id FROM leaves WHERE id LIKE 'L%'");
        $rows = $stmt->fetchAll();
        $maxNum = 0;
        foreach ($rows as $r) {
            if (preg_match('/L(\d+)/', $r['id'], $m)) {
                $num = (int)$m[1];
                if ($num > $maxNum) $maxNum = $num;
            }
        }
        $leaveId = 'L' . str_pad($maxNum + 1, 3, '0', STR_PAD_LEFT);
    }

    $targetEmpId = trim($input['employeeId'] ?? ($input['employee_id'] ?? ''));
    if (!$isExec) {
        if (!empty($targetEmpId) && $targetEmpId !== $userId) {
            json_error("Access denied. You cannot apply for leave on behalf of other employees.", 403);
        }
        $targetEmpId = $userId;
        $status = 'Pending';
    } else {
        if (empty($targetEmpId)) $targetEmpId = $userId;
        $status = trim($input['status'] ?? 'Pending');
    }

    $leaveType = trim($input['leaveType'] ?? ($input['leave_type'] ?? 'Casual Leave'));
    $startDate = trim($input['startDate'] ?? ($input['start_date'] ?? date('Y-m-d')));
    $endDate   = trim($input['endDate'] ?? ($input['end_date'] ?? date('Y-m-d')));
    $totalDays = (int)($input['totalDays'] ?? ($input['total_days'] ?? 1));
    $reason    = trim($input['reason'] ?? '');

    $stmt = $db->prepare("
        INSERT INTO leaves (id, employee_id, leave_type, start_date, end_date, total_days, reason, status)
        VALUES (:id, :employeeId, :leaveType, :startDate, :endDate, :totalDays, :reason, :status)
        ON DUPLICATE KEY UPDATE leave_type=VALUES(leave_type), start_date=VALUES(start_date), end_date=VALUES(end_date), total_days=VALUES(total_days), reason=VALUES(reason), status=VALUES(status)
    ");

    $stmt->execute([
        ':id'         => $leaveId,
        ':employeeId' => $targetEmpId,
        ':leaveType'  => $leaveType,
        ':startDate'  => $startDate,
        ':endDate'    => $endDate,
        ':totalDays'  => $totalDays,
        ':reason'     => $reason,
        ':status'     => $status
    ]);

    json_response(['success' => true, 'message' => 'Leave application submitted.', 'id' => $leaveId], 201);
}

// ----------------------------------------------------------
// PUT: Update Leave (Approve/Reject or Edit)
// ----------------------------------------------------------
if ($method === 'PUT') {
    verify_csrf();
    $input = get_input();
    $leaveId = $id ?? ($input['id'] ?? null);

    if (!$leaveId) {
        json_error("Leave ID is required for update.", 400);
    }

    $chkStmt = $db->prepare("SELECT * FROM leaves WHERE id = ? LIMIT 1");
    $chkStmt->execute([$leaveId]);
    $existing = $chkStmt->fetch();
    if (!$existing) {
        json_error("Leave record not found.", 404);
    }

    if (!$isExec) {
        // Normal employee: can only edit own PENDING leave, cannot approve/reject
        if ($existing['employee_id'] !== $userId) {
            json_error("Access denied. You cannot modify another employee's leave.", 403);
        }
        if ($existing['status'] !== 'Pending') {
            json_error("Access denied. You cannot modify a leave that has already been processed.", 403);
        }
        $status = 'Pending';
    } else {
        $status = $input['status'] ?? $existing['status'];
    }

    $stmt = $db->prepare("
        UPDATE leaves SET
            leave_type = COALESCE(:leaveType, leave_type),
            start_date = COALESCE(:startDate, start_date),
            end_date = COALESCE(:endDate, end_date),
            total_days = COALESCE(:totalDays, total_days),
            reason = COALESCE(:reason, reason),
            status = :status
        WHERE id = :id
    ");

    $stmt->execute([
        ':id'        => $leaveId,
        ':leaveType' => $input['leaveType'] ?? ($input['leave_type'] ?? null),
        ':startDate' => $input['startDate'] ?? ($input['start_date'] ?? null),
        ':endDate'   => $input['endDate'] ?? ($input['end_date'] ?? null),
        ':totalDays' => isset($input['totalDays']) ? (int)$input['totalDays'] : (isset($input['total_days']) ? (int)$input['total_days'] : null),
        ':reason'    => $input['reason'] ?? null,
        ':status'    => $status
    ]);

    json_response(['success' => true, 'message' => 'Leave updated successfully.']);
}

// ----------------------------------------------------------
// DELETE: Delete / Cancel Leave
// ----------------------------------------------------------
if ($method === 'DELETE') {
    verify_csrf();
    $leaveId = $id ?? ($_GET['id'] ?? null);
    if (!$leaveId) {
        json_error("Leave ID is required for deletion.", 400);
    }

    $chkStmt = $db->prepare("SELECT employee_id, status FROM leaves WHERE id = ? LIMIT 1");
    $chkStmt->execute([$leaveId]);
    $existing = $chkStmt->fetch();
    if (!$existing) {
        json_error("Leave record not found.", 404);
    }

    if (!$isExec) {
        if ($existing['employee_id'] !== $userId) {
            json_error("Access denied. You cannot cancel another employee's leave.", 403);
        }
        if ($existing['status'] !== 'Pending') {
            json_error("Access denied. Only pending leave requests can be cancelled.", 403);
        }
    }

    $stmt = $db->prepare("DELETE FROM leaves WHERE id = ?");
    $stmt->execute([$leaveId]);

    json_response(['success' => true, 'message' => 'Leave application deleted.']);
}

json_error("Unsupported method.", 405);
