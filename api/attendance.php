<?php
// ==========================================================
// Thynk Digital Solution - Attendance API Endpoint
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
// GET: List or Retrieve Attendance
// ----------------------------------------------------------
if ($method === 'GET') {
    if ($id) {
        $stmt = $db->prepare("SELECT id, employee_id AS employeeId, date, clock_in AS clockIn, clock_out AS clockOut, hours, status, late FROM attendance WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row) {
            json_error("Attendance record not found.", 404);
        }
        // Employee Isolation: Check ownership
        if (!$isExec && $row['employeeId'] !== $userId) {
            json_error("Access denied. You can only view your own attendance.", 403);
        }
        $row['hours'] = (float)$row['hours'];
        json_response(['success' => true, 'data' => $row]);
    } else {
        $query = "SELECT id, employee_id AS employeeId, date, clock_in AS clockIn, clock_out AS clockOut, hours, status, late FROM attendance WHERE 1=1";
        $params = [];

        $reqEmployeeId = $_GET['employeeId'] ?? ($_GET['employee_id'] ?? null);
        $date = $_GET['date'] ?? null;

        if (!$isExec) {
            // Normal employee: Strictly isolated to own records
            if ($reqEmployeeId && $reqEmployeeId !== 'all' && $reqEmployeeId !== $userId) {
                json_error("Access denied. You cannot view another employee's attendance.", 403);
            }
            $query .= " AND employee_id = ?";
            $params[] = $userId;
        } else {
            if ($reqEmployeeId && $reqEmployeeId !== 'all') {
                $query .= " AND employee_id = ?";
                $params[] = $reqEmployeeId;
            }
        }

        if ($date) {
            $query .= " AND date = ?";
            $params[] = $date;
        }

        $query .= " ORDER BY date DESC, id DESC";
        $stmt = $db->prepare($query);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();
        $rows = array_map(function($r) {
            $r['hours'] = (float)$r['hours'];
            return $r;
        }, $rows);

        json_response(['success' => true, 'data' => $rows]);
    }
}

// ----------------------------------------------------------
// POST: Clock-in / Add Attendance
// ----------------------------------------------------------
if ($method === 'POST') {
    verify_csrf();
    $input = get_input();

    $attId = trim($input['id'] ?? '');
    if (empty($attId)) {
        $stmt = $db->query("SELECT id FROM attendance WHERE id LIKE 'A%'");
        $rows = $stmt->fetchAll();
        $maxNum = 0;
        foreach ($rows as $r) {
            if (preg_match('/A(\d+)/', $r['id'], $m)) {
                $num = (int)$m[1];
                if ($num > $maxNum) $maxNum = $num;
            }
        }
        $attId = 'A' . str_pad($maxNum + 1, 3, '0', STR_PAD_LEFT);
    }

    $targetEmpId = trim($input['employeeId'] ?? ($input['employee_id'] ?? ''));
    if (!$isExec) {
        // Enforce employee isolation
        if (!empty($targetEmpId) && $targetEmpId !== $userId) {
            json_error("Access denied. You cannot record attendance for other employees.", 403);
        }
        $targetEmpId = $userId;
    } else {
        if (empty($targetEmpId)) $targetEmpId = $userId;
    }

    $logDate  = trim($input['date'] ?? date('Y-m-d'));
    $clockIn  = trim($input['clockIn'] ?? ($input['clock_in'] ?? ''));
    $clockOut = trim($input['clockOut'] ?? ($input['clock_out'] ?? ''));
    $hours    = (float)($input['hours'] ?? 0);
    $status   = trim($input['status'] ?? 'Present');
    $late     = trim($input['late'] ?? 'No');

    // Auto calculate hours
    if ($hours <= 0 && !empty($clockIn) && !empty($clockOut)) {
        $inParts = explode(':', $clockIn);
        $outParts = explode(':', $clockOut);
        if (count($inParts) >= 2 && count($outParts) >= 2) {
            $inMin = ((int)$inParts[0]) * 60 + (int)$inParts[1];
            $outMin = ((int)$outParts[0]) * 60 + (int)$outParts[1];
            if ($outMin >= $inMin) {
                $hours = round(($outMin - $inMin) / 60, 2);
            }
        }
    }

    $stmt = $db->prepare("
        INSERT INTO attendance (id, employee_id, date, clock_in, clock_out, hours, status, late)
        VALUES (:id, :employeeId, :date, :clockIn, :clockOut, :hours, :status, :late)
        ON DUPLICATE KEY UPDATE clock_in=VALUES(clock_in), clock_out=VALUES(clock_out), hours=VALUES(hours), status=VALUES(status), late=VALUES(late)
    ");

    $stmt->execute([
        ':id'         => $attId,
        ':employeeId' => $targetEmpId,
        ':date'       => $logDate,
        ':clockIn'    => $clockIn,
        ':clockOut'   => $clockOut,
        ':hours'      => $hours,
        ':status'     => $status,
        ':late'       => $late
    ]);

    json_response(['success' => true, 'message' => 'Attendance logged successfully.', 'id' => $attId], 201);
}

// ----------------------------------------------------------
// PUT: Update Attendance
// ----------------------------------------------------------
if ($method === 'PUT') {
    verify_csrf();
    $input = get_input();
    $attId = $id ?? ($input['id'] ?? null);

    if (!$attId) {
        json_error("Attendance ID is required for update.", 400);
    }

    // Verify ownership
    $chkStmt = $db->prepare("SELECT employee_id FROM attendance WHERE id = ? LIMIT 1");
    $chkStmt->execute([$attId]);
    $existing = $chkStmt->fetch();
    if (!$existing) {
        json_error("Attendance record not found.", 404);
    }

    if (!$isExec && $existing['employee_id'] !== $userId) {
        json_error("Access denied. You cannot modify another employee's attendance.", 403);
    }

    $hours = isset($input['hours']) ? (float)$input['hours'] : null;
    $clockIn = $input['clockIn'] ?? ($input['clock_in'] ?? null);
    $clockOut = $input['clockOut'] ?? ($input['clock_out'] ?? null);

    if ($hours === null && $clockIn !== null && $clockOut !== null) {
        $inParts = explode(':', $clockIn);
        $outParts = explode(':', $clockOut);
        if (count($inParts) >= 2 && count($outParts) >= 2) {
            $inMin = ((int)$inParts[0]) * 60 + (int)$inParts[1];
            $outMin = ((int)$outParts[0]) * 60 + (int)$outParts[1];
            if ($outMin >= $inMin) {
                $hours = round(($outMin - $inMin) / 60, 2);
            }
        }
    }

    $newEmpId = $isExec ? ($input['employeeId'] ?? ($input['employee_id'] ?? $existing['employee_id'])) : $existing['employee_id'];

    $stmt = $db->prepare("
        UPDATE attendance SET
            employee_id = :employeeId,
            date = COALESCE(:date, date),
            clock_in = COALESCE(:clockIn, clock_in),
            clock_out = COALESCE(:clockOut, clock_out),
            hours = COALESCE(:hours, hours),
            status = COALESCE(:status, status),
            late = COALESCE(:late, late)
        WHERE id = :id
    ");

    $stmt->execute([
        ':id'         => $attId,
        ':employeeId' => $newEmpId,
        ':date'       => $input['date'] ?? null,
        ':clockIn'    => $clockIn,
        ':clockOut'   => $clockOut,
        ':hours'      => $hours,
        ':status'     => $input['status'] ?? null,
        ':late'       => $input['late'] ?? null
    ]);

    json_response(['success' => true, 'message' => 'Attendance updated successfully.']);
}

// ----------------------------------------------------------
// DELETE: Delete Attendance
// ----------------------------------------------------------
if ($method === 'DELETE') {
    verify_csrf();
    $attId = $id ?? ($_GET['id'] ?? null);
    if (!$attId) {
        json_error("Attendance ID is required for deletion.", 400);
    }

    $chkStmt = $db->prepare("SELECT employee_id FROM attendance WHERE id = ? LIMIT 1");
    $chkStmt->execute([$attId]);
    $existing = $chkStmt->fetch();
    if (!$existing) {
        json_error("Attendance record not found.", 404);
    }

    if (!$isExec && $existing['employee_id'] !== $userId) {
        json_error("Access denied. You cannot delete another employee's attendance.", 403);
    }

    $stmt = $db->prepare("DELETE FROM attendance WHERE id = ?");
    $stmt->execute([$attId]);

    json_response(['success' => true, 'message' => 'Attendance deleted successfully.']);
}

json_error("Unsupported method.", 405);
