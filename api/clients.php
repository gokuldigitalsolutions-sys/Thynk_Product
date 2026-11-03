<?php
// ==========================================================
// Thynk Digital Solution - Clients API Endpoint
// Protected: Authentication, Module Permission (crm), CSRF
// ==========================================================

require_once __DIR__ . '/config.php';

$user   = require_module_perm('crm');
$db     = get_db();
$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;

// GET: List all clients or single client
if ($method === 'GET') {
    if ($id) {
        $stmt = $db->prepare("SELECT id, company_name AS companyName, client_name AS clientName, mobile, whatsapp, email, website, category, gst, address, city, state, country, logo, source, assigned_employee_id AS assignedEmployeeId, status, priority, date_created AS dateCreated FROM clients WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $client = $stmt->fetch();
        if (!$client) {
            json_error("Client not found.", 404);
        }
        json_response(['success' => true, 'data' => $client]);
    } else {
        $stmt = $db->query("SELECT id, company_name AS companyName, client_name AS clientName, mobile, whatsapp, email, website, category, gst, address, city, state, country, logo, source, assigned_employee_id AS assignedEmployeeId, status, priority, date_created AS dateCreated FROM clients ORDER BY id ASC");
        $clients = $stmt->fetchAll();
        json_response(['success' => true, 'data' => $clients]);
    }
}

// POST: Add new client
if ($method === 'POST') {
    verify_csrf();
    $input = get_input();
    
    $clientId = trim($input['id'] ?? '');
    if (empty($clientId)) {
        $stmt = $db->query("SELECT id FROM clients WHERE id LIKE 'C%'");
        $rows = $stmt->fetchAll();
        $maxNum = 0;
        foreach ($rows as $r) {
            if (preg_match('/C(\d+)/', $r['id'], $m)) {
                $num = (int)$m[1];
                if ($num > $maxNum) $maxNum = $num;
            }
        }
        $clientId = 'C' . str_pad($maxNum + 1, 3, '0', STR_PAD_LEFT);
    }

    $companyName = trim($input['companyName'] ?? ($input['company_name'] ?? ''));
    $clientName  = trim($input['clientName'] ?? ($input['client_name'] ?? ''));
    if (empty($companyName) && empty($clientName)) {
        json_error("Company name or client name is required.", 400);
    }
    if (empty($companyName)) $companyName = $clientName;
    if (empty($clientName)) $clientName = $companyName;

    $stmt = $db->prepare("
        INSERT INTO clients (id, company_name, client_name, mobile, whatsapp, email, website, category, gst, address, city, state, country, logo, source, assigned_employee_id, status, priority, date_created)
        VALUES (:id, :companyName, :clientName, :mobile, :whatsapp, :email, :website, :category, :gst, :address, :city, :state, :country, :logo, :source, :assignedEmployeeId, :status, :priority, :dateCreated)
    ");

    $stmt->execute([
        ':id'                 => $clientId,
        ':companyName'        => $companyName,
        ':clientName'         => $clientName,
        ':mobile'             => $input['mobile'] ?? '',
        ':whatsapp'           => $input['whatsapp'] ?? ($input['mobile'] ?? ''),
        ':email'              => $input['email'] ?? '',
        ':website'            => $input['website'] ?? '',
        ':category'           => $input['category'] ?? '',
        ':gst'                => $input['gst'] ?? '',
        ':address'            => $input['address'] ?? '',
        ':city'               => $input['city'] ?? '',
        ':state'              => $input['state'] ?? '',
        ':country'            => $input['country'] ?? 'India',
        ':logo'               => $input['logo'] ?? strtoupper(substr($companyName, 0, 1)),
        ':source'             => $input['source'] ?? 'Direct',
        ':assignedEmployeeId' => $input['assignedEmployeeId'] ?? ($input['assigned_employee_id'] ?? $user['id']),
        ':status'             => $input['status'] ?? 'Active',
        ':priority'           => $input['priority'] ?? 'Medium',
        ':dateCreated'        => $input['dateCreated'] ?? ($input['date_created'] ?? date('Y-m-d'))
    ]);

    json_response(['success' => true, 'message' => 'Client created successfully.', 'id' => $clientId, 'data' => $input], 201);
}

// PUT: Update existing client
if ($method === 'PUT') {
    verify_csrf();
    $input = get_input();
    $clientId = $id ?? ($input['id'] ?? null);
    if (!$clientId) {
        json_error("Client ID is required for update.", 400);
    }

    $stmt = $db->prepare("
        UPDATE clients SET
            company_name = COALESCE(:companyName, company_name),
            client_name = COALESCE(:clientName, client_name),
            mobile = COALESCE(:mobile, mobile),
            whatsapp = COALESCE(:whatsapp, whatsapp),
            email = COALESCE(:email, email),
            website = COALESCE(:website, website),
            category = COALESCE(:category, category),
            gst = COALESCE(:gst, gst),
            address = COALESCE(:address, address),
            city = COALESCE(:city, city),
            state = COALESCE(:state, state),
            country = COALESCE(:country, country),
            logo = COALESCE(:logo, logo),
            source = COALESCE(:source, source),
            assigned_employee_id = COALESCE(:assignedEmployeeId, assigned_employee_id),
            status = COALESCE(:status, status),
            priority = COALESCE(:priority, priority)
        WHERE id = :id
    ");

    $stmt->execute([
        ':id'                 => $clientId,
        ':companyName'        => $input['companyName'] ?? null,
        ':clientName'         => $input['clientName'] ?? null,
        ':mobile'             => $input['mobile'] ?? null,
        ':whatsapp'           => $input['whatsapp'] ?? null,
        ':email'              => $input['email'] ?? null,
        ':website'            => $input['website'] ?? null,
        ':category'           => $input['category'] ?? null,
        ':gst'                => $input['gst'] ?? null,
        ':address'            => $input['address'] ?? null,
        ':city'               => $input['city'] ?? null,
        ':state'              => $input['state'] ?? null,
        ':country'            => $input['country'] ?? null,
        ':logo'               => $input['logo'] ?? null,
        ':source'             => $input['source'] ?? null,
        ':assignedEmployeeId' => $input['assignedEmployeeId'] ?? null,
        ':status'             => $input['status'] ?? null,
        ':priority'           => $input['priority'] ?? null
    ]);

    json_response(['success' => true, 'message' => 'Client updated successfully.']);
}

// DELETE: Remove client
if ($method === 'DELETE') {
    verify_csrf();
    $clientId = $id ?? ($_GET['id'] ?? null);
    if (!$clientId) {
        json_error("Client ID is required for deletion.", 400);
    }

    $stmt = $db->prepare("DELETE FROM clients WHERE id = ?");
    $stmt->execute([$clientId]);

    json_response(['success' => true, 'message' => 'Client deleted successfully.']);
}

json_error("Unsupported method.", 405);
