<?php
// ==========================================================
// Thynk Digital Solution - Invoices API Endpoint
// Protected: Authentication, Module Permission (accounts), CSRF
// ==========================================================

require_once __DIR__ . '/config.php';

$user   = require_module_perm('accounts');
$db     = get_db();
$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;

// GET: List all invoices or single invoice
if ($method === 'GET') {
    if ($id) {
        $stmt = $db->prepare("SELECT id, client_id AS clientId, invoice_date AS invoiceDate, due_date AS dueDate, service_id AS serviceId, gross_amount AS grossAmount, gst_rate AS gstRate, gst_amount AS gstAmount, discount, net_amount AS netAmount, status FROM invoices WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $inv = $stmt->fetch();
        if (!$inv) json_error("Invoice not found.", 404);
        $inv['grossAmount'] = (float)$inv['grossAmount'];
        $inv['gstRate']     = (float)$inv['gstRate'];
        $inv['gstAmount']   = (float)$inv['gstAmount'];
        $inv['discount']    = (float)$inv['discount'];
        $inv['netAmount']   = (float)$inv['netAmount'];
        json_response(['success' => true, 'data' => $inv]);
    } else {
        $stmt = $db->query("SELECT id, client_id AS clientId, invoice_date AS invoiceDate, due_date AS dueDate, service_id AS serviceId, gross_amount AS grossAmount, gst_rate AS gstRate, gst_amount AS gstAmount, discount, net_amount AS netAmount, status FROM invoices ORDER BY invoice_date DESC, id DESC");
        $raw = $stmt->fetchAll();
        $invoices = array_map(function($i) {
            $i['grossAmount'] = (float)$i['grossAmount'];
            $i['gstRate']     = (float)$i['gstRate'];
            $i['gstAmount']   = (float)$i['gstAmount'];
            $i['discount']    = (float)$i['discount'];
            $i['netAmount']   = (float)$i['netAmount'];
            return $i;
        }, $raw);
        json_response(['success' => true, 'data' => $invoices]);
    }
}

// POST: Add new invoice
if ($method === 'POST') {
    verify_csrf();
    $input = get_input();

    $invId = trim($input['id'] ?? '');
    if (empty($invId)) {
        $stmt = $db->query("SELECT id FROM invoices WHERE id LIKE 'INV%'");
        $rows = $stmt->fetchAll();
        $maxNum = 0;
        foreach ($rows as $r) {
            if (preg_match('/INV(\d+)/', $r['id'], $m)) {
                $num = (int)$m[1];
                if ($num > $maxNum) $maxNum = $num;
            }
        }
        $invId = 'INV' . str_pad($maxNum + 1, 3, '0', STR_PAD_LEFT);
    }

    $clientId = trim($input['clientId'] ?? ($input['client_id'] ?? ''));
    if (empty($clientId)) {
        json_error("Client ID is required.", 400);
    }

    $gross = (float)($input['grossAmount'] ?? ($input['gross_amount'] ?? 0));
    $gstRate = (float)($input['gstRate'] ?? ($input['gst_rate'] ?? 18));
    $gstAmt = (float)($input['gstAmount'] ?? ($input['gst_amount'] ?? ($gross * ($gstRate / 100))));
    $disc = (float)($input['discount'] ?? 0);
    $net = (float)($input['netAmount'] ?? ($input['net_amount'] ?? ($gross + $gstAmt - $disc)));

    $stmt = $db->prepare("
        INSERT INTO invoices (id, client_id, invoice_date, due_date, service_id, gross_amount, gst_rate, gst_amount, discount, net_amount, status)
        VALUES (:id, :clientId, :invoiceDate, :dueDate, :serviceId, :grossAmount, :gstRate, :gstAmount, :discount, :netAmount, :status)
    ");

    $stmt->execute([
        ':id'          => $invId,
        ':clientId'    => $clientId,
        ':invoiceDate' => $input['invoiceDate'] ?? ($input['invoice_date'] ?? date('Y-m-d')),
        ':dueDate'     => $input['dueDate'] ?? ($input['due_date'] ?? date('Y-m-d', strtotime('+15 days'))),
        ':serviceId'   => $input['serviceId'] ?? ($input['service_id'] ?? ''),
        ':grossAmount' => $gross,
        ':gstRate'     => $gstRate,
        ':gstAmount'   => $gstAmt,
        ':discount'    => $disc,
        ':netAmount'   => $net,
        ':status'      => $input['status'] ?? 'Unpaid'
    ]);

    json_response(['success' => true, 'message' => 'Invoice created successfully.', 'id' => $invId], 201);
}

// PUT: Update invoice
if ($method === 'PUT') {
    verify_csrf();
    $input = get_input();
    $invId = $id ?? ($input['id'] ?? null);
    if (!$invId) {
        json_error("Invoice ID is required for update.", 400);
    }

    $stmt = $db->prepare("
        UPDATE invoices SET
            client_id = COALESCE(:clientId, client_id),
            invoice_date = COALESCE(:invoiceDate, invoice_date),
            due_date = COALESCE(:dueDate, due_date),
            service_id = COALESCE(:serviceId, service_id),
            gross_amount = COALESCE(:grossAmount, gross_amount),
            gst_rate = COALESCE(:gstRate, gst_rate),
            gst_amount = COALESCE(:gstAmount, gst_amount),
            discount = COALESCE(:discount, discount),
            net_amount = COALESCE(:netAmount, net_amount),
            status = COALESCE(:status, status)
        WHERE id = :id
    ");

    $stmt->execute([
        ':id'          => $invId,
        ':clientId'    => $input['clientId'] ?? ($input['client_id'] ?? null),
        ':invoiceDate' => $input['invoiceDate'] ?? ($input['invoice_date'] ?? null),
        ':dueDate'     => $input['dueDate'] ?? ($input['due_date'] ?? null),
        ':serviceId'   => $input['serviceId'] ?? ($input['service_id'] ?? null),
        ':grossAmount' => isset($input['grossAmount']) ? (float)$input['grossAmount'] : (isset($input['gross_amount']) ? (float)$input['gross_amount'] : null),
        ':gstRate'     => isset($input['gstRate']) ? (float)$input['gstRate'] : (isset($input['gst_rate']) ? (float)$input['gst_rate'] : null),
        ':gstAmount'   => isset($input['gstAmount']) ? (float)$input['gstAmount'] : (isset($input['gst_amount']) ? (float)$input['gst_amount'] : null),
        ':discount'    => isset($input['discount']) ? (float)$input['discount'] : null,
        ':netAmount'   => isset($input['netAmount']) ? (float)$input['netAmount'] : (isset($input['net_amount']) ? (float)$input['net_amount'] : null),
        ':status'      => $input['status'] ?? null
    ]);

    json_response(['success' => true, 'message' => 'Invoice updated successfully.']);
}

// DELETE: Remove invoice
if ($method === 'DELETE') {
    verify_csrf();
    $invId = $id ?? ($_GET['id'] ?? null);
    if (!$invId) {
        json_error("Invoice ID is required for deletion.", 400);
    }

    $stmt = $db->prepare("DELETE FROM invoices WHERE id = ?");
    $stmt->execute([$invId]);

    json_response(['success' => true, 'message' => 'Invoice deleted successfully.']);
}

json_error("Unsupported method.", 405);
