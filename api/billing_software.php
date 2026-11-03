<?php
// ==========================================================
// Thynk Digital Solution - Billing Software API Endpoint
// Protected: Authentication, Module Permission (accounts/crm), CSRF
// ==========================================================

require_once __DIR__ . '/config.php';

$user   = require_auth();
$db     = get_db();
$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;

// GET: List all billing software or single
if ($method === 'GET') {
    if ($id) {
        $stmt = $db->prepare("SELECT id, client_name AS clientName, company_name AS companyName, client_id AS clientId, price, maintenance, purchase_date AS purchaseDate, renewal_date AS renewalDate, notes FROM billing_software WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $b = $stmt->fetch();
        if (!$b) json_error("Billing Software record not found.", 404);
        $b['price'] = (float)$b['price'];
        $b['maintenance'] = (float)$b['maintenance'];
        json_response(['success' => true, 'data' => $b]);
    } else {
        $stmt = $db->query("SELECT id, client_name AS clientName, company_name AS companyName, client_id AS clientId, price, maintenance, purchase_date AS purchaseDate, renewal_date AS renewalDate, notes FROM billing_software ORDER BY id ASC");
        $raw = $stmt->fetchAll();
        $bsList = array_map(function($b) {
            $b['price'] = (float)$b['price'];
            $b['maintenance'] = (float)$b['maintenance'];
            return $b;
        }, $raw);
        json_response(['success' => true, 'data' => $bsList]);
    }
}

// POST: Add new billing software
if ($method === 'POST') {
    verify_csrf();
    $input = get_input();

    $bsId = trim($input['id'] ?? '');
    if (empty($bsId)) {
        $stmt = $db->query("SELECT id FROM billing_software WHERE id LIKE 'BS%'");
        $rows = $stmt->fetchAll();
        $maxNum = 0;
        foreach ($rows as $r) {
            if (preg_match('/BS(\d+)/', $r['id'], $m)) {
                $num = (int)$m[1];
                if ($num > $maxNum) $maxNum = $num;
            }
        }
        $bsId = 'BS' . str_pad($maxNum + 1, 3, '0', STR_PAD_LEFT);
    }

    $companyName = trim($input['companyName'] ?? ($input['company_name'] ?? ''));
    $clientName  = trim($input['clientName'] ?? ($input['client_name'] ?? ''));
    if (empty($companyName) && empty($clientName)) {
        json_error("Company name or client name is required.", 400);
    }

    $stmt = $db->prepare("
        INSERT INTO billing_software (id, client_name, company_name, client_id, price, maintenance, purchase_date, renewal_date, notes)
        VALUES (:id, :clientName, :companyName, :clientId, :price, :maintenance, :purchaseDate, :renewalDate, :notes)
    ");

    $stmt->execute([
        ':id'           => $bsId,
        ':clientName'   => $clientName ?: $companyName,
        ':companyName'  => $companyName ?: $clientName,
        ':clientId'     => $input['clientId'] ?? ($input['client_id'] ?? ''),
        ':price'        => (float)($input['price'] ?? 0),
        ':maintenance'  => (float)($input['maintenance'] ?? 0),
        ':purchaseDate' => $input['purchaseDate'] ?? ($input['purchase_date'] ?? date('Y-m-d')),
        ':renewalDate'  => $input['renewalDate'] ?? ($input['renewal_date'] ?? date('Y-m-d', strtotime('+1 year'))),
        ':notes'        => $input['notes'] ?? ''
    ]);

    json_response(['success' => true, 'message' => 'Billing software created successfully.', 'id' => $bsId], 201);
}

// PUT: Update billing software
if ($method === 'PUT') {
    verify_csrf();
    $input = get_input();
    $bsId = $id ?? ($input['id'] ?? null);
    if (!$bsId) {
        json_error("Billing Software ID is required for update.", 400);
    }

    $stmt = $db->prepare("
        UPDATE billing_software SET
            client_name = COALESCE(:clientName, client_name),
            company_name = COALESCE(:companyName, company_name),
            client_id = COALESCE(:clientId, client_id),
            price = COALESCE(:price, price),
            maintenance = COALESCE(:maintenance, maintenance),
            purchase_date = COALESCE(:purchaseDate, purchase_date),
            renewal_date = COALESCE(:renewalDate, renewal_date),
            notes = COALESCE(:notes, notes)
        WHERE id = :id
    ");

    $stmt->execute([
        ':id'           => $bsId,
        ':clientName'   => $input['clientName'] ?? ($input['client_name'] ?? null),
        ':companyName'  => $input['companyName'] ?? ($input['company_name'] ?? null),
        ':clientId'     => $input['clientId'] ?? ($input['client_id'] ?? null),
        ':price'        => isset($input['price']) ? (float)$input['price'] : null,
        ':maintenance'  => isset($input['maintenance']) ? (float)$input['maintenance'] : null,
        ':purchaseDate' => $input['purchaseDate'] ?? ($input['purchase_date'] ?? null),
        ':renewalDate'  => $input['renewalDate'] ?? ($input['renewal_date'] ?? null),
        ':notes'        => $input['notes'] ?? null
    ]);

    json_response(['success' => true, 'message' => 'Billing software updated successfully.']);
}

// DELETE: Remove billing software
if ($method === 'DELETE') {
    verify_csrf();
    $bsId = $id ?? ($_GET['id'] ?? null);
    if (!$bsId) {
        json_error("Billing Software ID is required for deletion.", 400);
    }

    $stmt = $db->prepare("DELETE FROM billing_software WHERE id = ?");
    $stmt->execute([$bsId]);

    json_response(['success' => true, 'message' => 'Billing software deleted successfully.']);
}

json_error("Unsupported method.", 405);
