<?php
// ==========================================================
// Thynk Digital Solution - Payments API Endpoint
// Protected: Authentication, Module Permission (accounts), CSRF
// ==========================================================

require_once __DIR__ . '/config.php';

$user   = require_module_perm('accounts');
$db     = get_db();
$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;

// GET: List all payments or single payment
if ($method === 'GET') {
    if ($id) {
        $stmt = $db->prepare("SELECT id, invoice_no AS invoiceNo, client_id AS clientId, amount, date, payment_mode AS paymentMode, transaction_id AS transactionId, received_by_id AS receivedById, remarks FROM payments WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $payment = $stmt->fetch();
        if (!$payment) json_error("Payment not found.", 404);
        $payment['amount'] = (float)$payment['amount'];
        json_response(['success' => true, 'data' => $payment]);
    } else {
        $stmt = $db->query("SELECT id, invoice_no AS invoiceNo, client_id AS clientId, amount, date, payment_mode AS paymentMode, transaction_id AS transactionId, received_by_id AS receivedById, remarks FROM payments ORDER BY date DESC, id DESC");
        $raw = $stmt->fetchAll();
        $payments = array_map(function($p) {
            $p['amount'] = (float)$p['amount'];
            return $p;
        }, $raw);
        json_response(['success' => true, 'data' => $payments]);
    }
}

// POST: Add new payment
if ($method === 'POST') {
    verify_csrf();
    $input = get_input();

    $payId = trim($input['id'] ?? '');
    if (empty($payId)) {
        $stmt = $db->query("SELECT id FROM payments WHERE id LIKE 'PAY%'");
        $rows = $stmt->fetchAll();
        $maxNum = 0;
        foreach ($rows as $r) {
            if (preg_match('/PAY(\d+)/', $r['id'], $m)) {
                $num = (int)$m[1];
                if ($num > $maxNum) $maxNum = $num;
            }
        }
        $payId = 'PAY' . str_pad($maxNum + 1, 3, '0', STR_PAD_LEFT);
    }

    $clientId = trim($input['clientId'] ?? ($input['client_id'] ?? ''));
    $amount = (float)($input['amount'] ?? 0);
    if (empty($clientId) || $amount <= 0) {
        json_error("Valid client ID and positive payment amount are required.", 400);
    }

    $stmt = $db->prepare("
        INSERT INTO payments (id, invoice_no, client_id, amount, date, payment_mode, transaction_id, received_by_id, remarks)
        VALUES (:id, :invoiceNo, :clientId, :amount, :date, :paymentMode, :transactionId, :receivedById, :remarks)
    ");

    $stmt->execute([
        ':id'            => $payId,
        ':invoiceNo'     => $input['invoiceNo'] ?? ($input['invoice_no'] ?? ''),
        ':clientId'      => $clientId,
        ':amount'        => $amount,
        ':date'          => $input['date'] ?? date('Y-m-d'),
        ':paymentMode'   => $input['paymentMode'] ?? ($input['payment_mode'] ?? 'Bank Transfer'),
        ':transactionId' => $input['transactionId'] ?? ($input['transaction_id'] ?? ''),
        ':receivedById'  => $input['receivedById'] ?? ($input['received_by_id'] ?? $user['id']),
        ':remarks'       => $input['remarks'] ?? ''
    ]);

    json_response(['success' => true, 'message' => 'Payment recorded successfully.', 'id' => $payId], 201);
}

// PUT: Update payment
if ($method === 'PUT') {
    verify_csrf();
    $input = get_input();
    $payId = $id ?? ($input['id'] ?? null);
    if (!$payId) {
        json_error("Payment ID is required for update.", 400);
    }

    $stmt = $db->prepare("
        UPDATE payments SET
            invoice_no = COALESCE(:invoiceNo, invoice_no),
            client_id = COALESCE(:clientId, client_id),
            amount = COALESCE(:amount, amount),
            date = COALESCE(:date, date),
            payment_mode = COALESCE(:paymentMode, payment_mode),
            transaction_id = COALESCE(:transactionId, transaction_id),
            received_by_id = COALESCE(:receivedById, received_by_id),
            remarks = COALESCE(:remarks, remarks)
        WHERE id = :id
    ");

    $stmt->execute([
        ':id'            => $payId,
        ':invoiceNo'     => $input['invoiceNo'] ?? ($input['invoice_no'] ?? null),
        ':clientId'      => $input['clientId'] ?? ($input['client_id'] ?? null),
        ':amount'        => isset($input['amount']) ? (float)$input['amount'] : null,
        ':date'          => $input['date'] ?? null,
        ':paymentMode'   => $input['paymentMode'] ?? ($input['payment_mode'] ?? null),
        ':transactionId' => $input['transactionId'] ?? ($input['transaction_id'] ?? null),
        ':receivedById'  => $input['receivedById'] ?? ($input['received_by_id'] ?? null),
        ':remarks'       => $input['remarks'] ?? null
    ]);

    json_response(['success' => true, 'message' => 'Payment updated successfully.']);
}

// DELETE: Remove payment
if ($method === 'DELETE') {
    verify_csrf();
    $payId = $id ?? ($_GET['id'] ?? null);
    if (!$payId) {
        json_error("Payment ID is required for deletion.", 400);
    }

    $stmt = $db->prepare("DELETE FROM payments WHERE id = ?");
    $stmt->execute([$payId]);

    json_response(['success' => true, 'message' => 'Payment deleted successfully.']);
}

json_error("Unsupported method.", 405);
