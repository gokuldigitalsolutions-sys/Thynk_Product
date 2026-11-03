<?php
// ==========================================================
// Thynk Digital Solution - Hostings API Endpoint
// Protected: Authentication, Module Permission (crm), CSRF
// ==========================================================

require_once __DIR__ . '/config.php';

$user   = require_module_perm('crm');
$db     = get_db();
$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;

// GET: List all hostings or single hosting
if ($method === 'GET') {
    if ($id) {
        $stmt = $db->prepare("SELECT id, client_id AS clientId, hosting_provider AS hostingProvider, hosting_plan AS hostingPlan, server_type AS serverType, purchase_date AS purchaseDate, expiry_date AS expiryDate, renewal_date AS renewalDate, renewal_cost AS renewalCost, disk_space AS diskSpace, bandwidth, control_panel AS controlPanel, ssl_expiry AS sslExpiry, backup_status AS backupStatus, status, notes FROM hostings WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $hosting = $stmt->fetch();
        if (!$hosting) json_error("Hosting not found.", 404);
        $hosting['renewalCost'] = (float)$hosting['renewalCost'];
        json_response(['success' => true, 'data' => $hosting]);
    } else {
        $stmt = $db->query("SELECT id, client_id AS clientId, hosting_provider AS hostingProvider, hosting_plan AS hostingPlan, server_type AS serverType, purchase_date AS purchaseDate, expiry_date AS expiryDate, renewal_date AS renewalDate, renewal_cost AS renewalCost, disk_space AS diskSpace, bandwidth, control_panel AS controlPanel, ssl_expiry AS sslExpiry, backup_status AS backupStatus, status, notes FROM hostings ORDER BY id ASC");
        $raw = $stmt->fetchAll();
        $hostings = array_map(function($h) {
            $h['renewalCost'] = (float)$h['renewalCost'];
            return $h;
        }, $raw);
        json_response(['success' => true, 'data' => $hostings]);
    }
}

// POST: Add new hosting
if ($method === 'POST') {
    verify_csrf();
    $input = get_input();

    $hostId = trim($input['id'] ?? '');
    if (empty($hostId)) {
        $stmt = $db->query("SELECT id FROM hostings WHERE id LIKE 'HST%'");
        $rows = $stmt->fetchAll();
        $maxNum = 0;
        foreach ($rows as $r) {
            if (preg_match('/HST(\d+)/', $r['id'], $m)) {
                $num = (int)$m[1];
                if ($num > $maxNum) $maxNum = $num;
            }
        }
        $hostId = 'HST' . str_pad($maxNum + 1, 3, '0', STR_PAD_LEFT);
    }

    $clientId = trim($input['clientId'] ?? ($input['client_id'] ?? ''));
    $provider = trim($input['hostingProvider'] ?? ($input['hosting_provider'] ?? ''));
    if (empty($clientId) || empty($provider)) {
        json_error("Client ID and hosting provider are required.", 400);
    }

    $stmt = $db->prepare("
        INSERT INTO hostings (id, client_id, hosting_provider, hosting_plan, server_type, purchase_date, expiry_date, renewal_date, renewal_cost, disk_space, bandwidth, control_panel, ssl_expiry, backup_status, status, notes)
        VALUES (:id, :clientId, :hostingProvider, :hostingPlan, :serverType, :purchaseDate, :expiryDate, :renewalDate, :renewalCost, :diskSpace, :bandwidth, :controlPanel, :sslExpiry, :backupStatus, :status, :notes)
    ");

    $stmt->execute([
        ':id'              => $hostId,
        ':clientId'        => $clientId,
        ':hostingProvider' => $provider,
        ':hostingPlan'     => $input['hostingPlan'] ?? ($input['hosting_plan'] ?? ''),
        ':serverType'      => $input['serverType'] ?? ($input['server_type'] ?? 'Shared'),
        ':purchaseDate'    => $input['purchaseDate'] ?? ($input['purchase_date'] ?? date('Y-m-d')),
        ':expiryDate'      => $input['expiryDate'] ?? ($input['expiry_date'] ?? date('Y-m-d')),
        ':renewalDate'     => $input['renewalDate'] ?? ($input['renewal_date'] ?? ''),
        ':renewalCost'     => (float)($input['renewalCost'] ?? ($input['renewal_cost'] ?? 0)),
        ':diskSpace'       => $input['diskSpace'] ?? ($input['disk_space'] ?? ''),
        ':bandwidth'       => $input['bandwidth'] ?? '',
        ':controlPanel'    => $input['controlPanel'] ?? ($input['control_panel'] ?? ''),
        ':sslExpiry'       => $input['sslExpiry'] ?? ($input['ssl_expiry'] ?? ''),
        ':backupStatus'    => $input['backupStatus'] ?? ($input['backup_status'] ?? 'Enabled'),
        ':status'          => $input['status'] ?? 'Active',
        ':notes'           => $input['notes'] ?? ''
    ]);

    json_response(['success' => true, 'message' => 'Hosting record created successfully.', 'id' => $hostId], 201);
}

// PUT: Update hosting
if ($method === 'PUT') {
    verify_csrf();
    $input = get_input();
    $hostId = $id ?? ($input['id'] ?? null);
    if (!$hostId) {
        json_error("Hosting ID is required for update.", 400);
    }

    $stmt = $db->prepare("
        UPDATE hostings SET
            client_id = COALESCE(:clientId, client_id),
            hosting_provider = COALESCE(:hostingProvider, hosting_provider),
            hosting_plan = COALESCE(:hostingPlan, hosting_plan),
            server_type = COALESCE(:serverType, server_type),
            purchase_date = COALESCE(:purchaseDate, purchase_date),
            expiry_date = COALESCE(:expiryDate, expiry_date),
            renewal_date = COALESCE(:renewalDate, renewal_date),
            renewal_cost = COALESCE(:renewalCost, renewal_cost),
            disk_space = COALESCE(:diskSpace, disk_space),
            bandwidth = COALESCE(:bandwidth, bandwidth),
            control_panel = COALESCE(:controlPanel, control_panel),
            ssl_expiry = COALESCE(:sslExpiry, ssl_expiry),
            backup_status = COALESCE(:backupStatus, backup_status),
            status = COALESCE(:status, status),
            notes = COALESCE(:notes, notes)
        WHERE id = :id
    ");

    $stmt->execute([
        ':id'              => $hostId,
        ':clientId'        => $input['clientId'] ?? ($input['client_id'] ?? null),
        ':hostingProvider' => $input['hostingProvider'] ?? ($input['hosting_provider'] ?? null),
        ':hostingPlan'     => $input['hostingPlan'] ?? ($input['hosting_plan'] ?? null),
        ':serverType'      => $input['serverType'] ?? ($input['server_type'] ?? null),
        ':purchaseDate'    => $input['purchaseDate'] ?? ($input['purchase_date'] ?? null),
        ':expiryDate'      => $input['expiryDate'] ?? ($input['expiry_date'] ?? null),
        ':renewalDate'     => $input['renewalDate'] ?? ($input['renewal_date'] ?? null),
        ':renewalCost'     => isset($input['renewalCost']) ? (float)$input['renewalCost'] : (isset($input['renewal_cost']) ? (float)$input['renewal_cost'] : null),
        ':diskSpace'       => $input['diskSpace'] ?? ($input['disk_space'] ?? null),
        ':bandwidth'       => $input['bandwidth'] ?? null,
        ':controlPanel'    => $input['controlPanel'] ?? ($input['control_panel'] ?? null),
        ':sslExpiry'       => $input['sslExpiry'] ?? ($input['ssl_expiry'] ?? null),
        ':backupStatus'    => $input['backupStatus'] ?? ($input['backup_status'] ?? null),
        ':status'          => $input['status'] ?? null,
        ':notes'           => $input['notes'] ?? null
    ]);

    json_response(['success' => true, 'message' => 'Hosting updated successfully.']);
}

// DELETE: Remove hosting
if ($method === 'DELETE') {
    verify_csrf();
    $hostId = $id ?? ($_GET['id'] ?? null);
    if (!$hostId) {
        json_error("Hosting ID is required for deletion.", 400);
    }

    $stmt = $db->prepare("DELETE FROM hostings WHERE id = ?");
    $stmt->execute([$hostId]);

    json_response(['success' => true, 'message' => 'Hosting deleted successfully.']);
}

json_error("Unsupported method.", 405);
