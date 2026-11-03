<?php
// ==========================================================
// Thynk Digital Solution - Canva API Endpoint
// Protected: Authentication and CSRF
// ==========================================================

require_once __DIR__ . '/config.php';

$user   = require_auth();
$db     = get_db();
$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;

// GET: List all Canva subscriptions
if ($method === 'GET') {
    if ($id) {
        $stmt = $db->prepare("SELECT id, client_name AS clientName, email, price, purchase_date AS purchaseDate, renewal_date AS renewalDate, notes FROM canva WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $c = $stmt->fetch();
        if (!$c) json_error("Canva record not found.", 404);
        $c['price'] = (float)$c['price'];
        json_response(['success' => true, 'data' => $c]);
    } else {
        $stmt = $db->query("SELECT id, client_name AS clientName, email, price, purchase_date AS purchaseDate, renewal_date AS renewalDate, notes FROM canva ORDER BY id ASC");
        $raw = $stmt->fetchAll();
        $canva = array_map(function($c) {
            $c['price'] = (float)$c['price'];
            return $c;
        }, $raw);
        json_response(['success' => true, 'data' => $canva]);
    }
}

// POST: Add new Canva record
if ($method === 'POST') {
    verify_csrf();
    $input = get_input();

    $canId = trim($input['id'] ?? '');
    if (empty($canId)) {
        $stmt = $db->query("SELECT id FROM canva WHERE id LIKE 'CAN%'");
        $rows = $stmt->fetchAll();
        $maxNum = 0;
        foreach ($rows as $r) {
            if (preg_match('/CAN(\d+)/', $r['id'], $m)) {
                $num = (int)$m[1];
                if ($num > $maxNum) $maxNum = $num;
            }
        }
        $canId = 'CAN' . str_pad($maxNum + 1, 3, '0', STR_PAD_LEFT);
    }

    $clientName = trim($input['clientName'] ?? ($input['client_name'] ?? ''));
    if (empty($clientName)) {
        json_error("Client name is required.", 400);
    }

    $stmt = $db->prepare("
        INSERT INTO canva (id, client_name, email, price, purchase_date, renewal_date, notes)
        VALUES (:id, :clientName, :email, :price, :purchaseDate, :renewalDate, :notes)
    ");

    $stmt->execute([
        ':id'           => $canId,
        ':clientName'   => $clientName,
        ':email'        => $input['email'] ?? '',
        ':price'        => (float)($input['price'] ?? 499),
        ':purchaseDate' => $input['purchaseDate'] ?? ($input['purchase_date'] ?? date('Y-m-d')),
        ':renewalDate'  => $input['renewalDate'] ?? ($input['renewal_date'] ?? date('Y-m-d', strtotime('+1 year'))),
        ':notes'        => $input['notes'] ?? ''
    ]);

    json_response(['success' => true, 'message' => 'Canva record created successfully.', 'id' => $canId], 201);
}

// PUT: Update Canva record
if ($method === 'PUT') {
    verify_csrf();
    $input = get_input();
    $canId = $id ?? ($input['id'] ?? null);
    if (!$canId) {
        json_error("Canva ID is required for update.", 400);
    }

    $stmt = $db->prepare("
        UPDATE canva SET
            client_name = COALESCE(:clientName, client_name),
            email = COALESCE(:email, email),
            price = COALESCE(:price, price),
            purchase_date = COALESCE(:purchaseDate, purchase_date),
            renewal_date = COALESCE(:renewalDate, renewal_date),
            notes = COALESCE(:notes, notes)
        WHERE id = :id
    ");

    $stmt->execute([
        ':id'           => $canId,
        ':clientName'   => $input['clientName'] ?? ($input['client_name'] ?? null),
        ':email'        => $input['email'] ?? null,
        ':price'        => isset($input['price']) ? (float)$input['price'] : null,
        ':purchaseDate' => $input['purchaseDate'] ?? ($input['purchase_date'] ?? null),
        ':renewalDate'  => $input['renewalDate'] ?? ($input['renewal_date'] ?? null),
        ':notes'        => $input['notes'] ?? null
    ]);

    json_response(['success' => true, 'message' => 'Canva record updated successfully.']);
}

// DELETE: Remove Canva record
if ($method === 'DELETE') {
    verify_csrf();
    $canId = $id ?? ($_GET['id'] ?? null);
    if (!$canId) {
        json_error("Canva ID is required for deletion.", 400);
    }

    $stmt = $db->prepare("DELETE FROM canva WHERE id = ?");
    $stmt->execute([$canId]);

    json_response(['success' => true, 'message' => 'Canva record deleted successfully.']);
}

json_error("Unsupported method.", 405);
