<?php
// ==========================================================
// Thynk Digital Solution - Services API Endpoint
// Protected: Authentication, Module Permission (crm), CSRF
// ==========================================================

require_once __DIR__ . '/config.php';

$user   = require_module_perm('crm');
$db     = get_db();
$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;

// GET: List all services or single service
if ($method === 'GET') {
    if ($id) {
        $stmt = $db->prepare("SELECT id, client_id AS clientId, service_name AS serviceName, package, start_date AS startDate, end_date AS endDate, renewal_date AS renewalDate, assigned_employee_id AS assignedEmployeeId, cost, discount, final_amount AS finalAmount, status, notes FROM services WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $service = $stmt->fetch();
        if (!$service) json_error("Service not found.", 404);
        $service['cost'] = (float)$service['cost'];
        $service['discount'] = (float)$service['discount'];
        $service['finalAmount'] = (float)$service['finalAmount'];
        json_response(['success' => true, 'data' => $service]);
    } else {
        $stmt = $db->query("SELECT id, client_id AS clientId, service_name AS serviceName, package, start_date AS startDate, end_date AS endDate, renewal_date AS renewalDate, assigned_employee_id AS assignedEmployeeId, cost, discount, final_amount AS finalAmount, status, notes FROM services ORDER BY id ASC");
        $raw = $stmt->fetchAll();
        $services = array_map(function($s) {
            $s['cost'] = (float)$s['cost'];
            $s['discount'] = (float)$s['discount'];
            $s['finalAmount'] = (float)$s['finalAmount'];
            return $s;
        }, $raw);
        json_response(['success' => true, 'data' => $services]);
    }
}

// POST: Add new service
if ($method === 'POST') {
    verify_csrf();
    $input = get_input();

    $srvId = trim($input['id'] ?? '');
    if (empty($srvId)) {
        $stmt = $db->query("SELECT id FROM services WHERE id LIKE 'S%'");
        $rows = $stmt->fetchAll();
        $maxNum = 0;
        foreach ($rows as $r) {
            if (preg_match('/S(\d+)/', $r['id'], $m)) {
                $num = (int)$m[1];
                if ($num > $maxNum) $maxNum = $num;
            }
        }
        $srvId = 'S' . str_pad($maxNum + 1, 3, '0', STR_PAD_LEFT);
    }

    $clientId = trim($input['clientId'] ?? ($input['client_id'] ?? ''));
    $serviceName = trim($input['serviceName'] ?? ($input['service_name'] ?? ''));
    if (empty($clientId) || empty($serviceName)) {
        json_error("Client ID and service name are required.", 400);
    }

    $cost = (float)($input['cost'] ?? 0);
    $discount = (float)($input['discount'] ?? 0);
    $finalAmount = isset($input['finalAmount']) ? (float)$input['finalAmount'] : (isset($input['final_amount']) ? (float)$input['final_amount'] : ($cost - $discount));

    $stmt = $db->prepare("
        INSERT INTO services (id, client_id, service_name, package, start_date, end_date, renewal_date, assigned_employee_id, cost, discount, final_amount, status, notes)
        VALUES (:id, :clientId, :serviceName, :package, :startDate, :endDate, :renewalDate, :assignedEmployeeId, :cost, :discount, :finalAmount, :status, :notes)
    ");

    $stmt->execute([
        ':id'                 => $srvId,
        ':clientId'           => $clientId,
        ':serviceName'        => $serviceName,
        ':package'            => $input['package'] ?? '',
        ':startDate'          => $input['startDate'] ?? ($input['start_date'] ?? date('Y-m-d')),
        ':endDate'            => $input['endDate'] ?? ($input['end_date'] ?? date('Y-m-d')),
        ':renewalDate'        => $input['renewalDate'] ?? ($input['renewal_date'] ?? ''),
        ':assignedEmployeeId' => $input['assignedEmployeeId'] ?? ($input['assigned_employee_id'] ?? $user['id']),
        ':cost'               => $cost,
        ':discount'           => $discount,
        ':finalAmount'        => $finalAmount,
        ':status'             => $input['status'] ?? 'Active',
        ':notes'              => $input['notes'] ?? ''
    ]);

    json_response(['success' => true, 'message' => 'Service created successfully.', 'id' => $srvId], 201);
}

// PUT: Update service
if ($method === 'PUT') {
    verify_csrf();
    $input = get_input();
    $srvId = $id ?? ($input['id'] ?? null);
    if (!$srvId) {
        json_error("Service ID is required for update.", 400);
    }

    $cost = isset($input['cost']) ? (float)$input['cost'] : null;
    $discount = isset($input['discount']) ? (float)$input['discount'] : null;
    $finalAmount = isset($input['finalAmount']) ? (float)$input['finalAmount'] : (isset($input['final_amount']) ? (float)$input['final_amount'] : null);

    $stmt = $db->prepare("
        UPDATE services SET
            client_id = COALESCE(:clientId, client_id),
            service_name = COALESCE(:serviceName, service_name),
            package = COALESCE(:package, package),
            start_date = COALESCE(:startDate, start_date),
            end_date = COALESCE(:endDate, end_date),
            renewal_date = COALESCE(:renewalDate, renewal_date),
            assigned_employee_id = COALESCE(:assignedEmployeeId, assigned_employee_id),
            cost = COALESCE(:cost, cost),
            discount = COALESCE(:discount, discount),
            final_amount = COALESCE(:finalAmount, final_amount),
            status = COALESCE(:status, status),
            notes = COALESCE(:notes, notes)
        WHERE id = :id
    ");

    $stmt->execute([
        ':id'                 => $srvId,
        ':clientId'           => $input['clientId'] ?? ($input['client_id'] ?? null),
        ':serviceName'        => $input['serviceName'] ?? ($input['service_name'] ?? null),
        ':package'            => $input['package'] ?? null,
        ':startDate'          => $input['startDate'] ?? ($input['start_date'] ?? null),
        ':endDate'            => $input['endDate'] ?? ($input['end_date'] ?? null),
        ':renewalDate'        => $input['renewalDate'] ?? ($input['renewal_date'] ?? null),
        ':assignedEmployeeId' => $input['assignedEmployeeId'] ?? ($input['assigned_employee_id'] ?? null),
        ':cost'               => $cost,
        ':discount'           => $discount,
        ':finalAmount'        => $finalAmount,
        ':status'             => $input['status'] ?? null,
        ':notes'              => $input['notes'] ?? null
    ]);

    json_response(['success' => true, 'message' => 'Service updated successfully.']);
}

// DELETE: Remove service
if ($method === 'DELETE') {
    verify_csrf();
    $srvId = $id ?? ($_GET['id'] ?? null);
    if (!$srvId) {
        json_error("Service ID is required for deletion.", 400);
    }

    $stmt = $db->prepare("DELETE FROM services WHERE id = ?");
    $stmt->execute([$srvId]);

    json_response(['success' => true, 'message' => 'Service deleted successfully.']);
}

json_error("Unsupported method.", 405);
