<?php
// ==========================================================
// Thynk Digital Solution - Domains API Endpoint
// Protected: Authentication, Module Permission (crm), CSRF
// ==========================================================

require_once __DIR__ . '/config.php';

$user   = require_module_perm('crm');
$db     = get_db();
$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;

// GET: List all domains or single domain
if ($method === 'GET') {
    if ($id) {
        $stmt = $db->prepare("SELECT id, client_id AS clientId, domain_name AS domainName, registrar, registration_date AS registrationDate, expiry_date AS expiryDate, renewal_date AS renewalDate, auto_renewal AS autoRenewal, status, renewal_cost AS renewalCost, dns_status AS dnsStatus, ssl_status AS sslStatus, nameservers, credentials_placeholder AS credentialsPlaceholder, notes FROM domains WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $domain = $stmt->fetch();
        if (!$domain) json_error("Domain not found.", 404);
        $domain['renewalCost'] = (float)$domain['renewalCost'];
        json_response(['success' => true, 'data' => $domain]);
    } else {
        $stmt = $db->query("SELECT id, client_id AS clientId, domain_name AS domainName, registrar, registration_date AS registrationDate, expiry_date AS expiryDate, renewal_date AS renewalDate, auto_renewal AS autoRenewal, status, renewal_cost AS renewalCost, dns_status AS dnsStatus, ssl_status AS sslStatus, nameservers, credentials_placeholder AS credentialsPlaceholder, notes FROM domains ORDER BY id ASC");
        $raw = $stmt->fetchAll();
        $domains = array_map(function($d) {
            $d['renewalCost'] = (float)$d['renewalCost'];
            return $d;
        }, $raw);
        json_response(['success' => true, 'data' => $domains]);
    }
}

// POST: Add new domain
if ($method === 'POST') {
    verify_csrf();
    $input = get_input();

    $domId = trim($input['id'] ?? '');
    if (empty($domId)) {
        $stmt = $db->query("SELECT id FROM domains WHERE id LIKE 'DOM%'");
        $rows = $stmt->fetchAll();
        $maxNum = 0;
        foreach ($rows as $r) {
            if (preg_match('/DOM(\d+)/', $r['id'], $m)) {
                $num = (int)$m[1];
                if ($num > $maxNum) $maxNum = $num;
            }
        }
        $domId = 'DOM' . str_pad($maxNum + 1, 3, '0', STR_PAD_LEFT);
    }

    $clientId = trim($input['clientId'] ?? ($input['client_id'] ?? ''));
    $domainName = trim($input['domainName'] ?? ($input['domain_name'] ?? ''));
    if (empty($clientId) || empty($domainName)) {
        json_error("Client ID and domain name are required.", 400);
    }

    $stmt = $db->prepare("
        INSERT INTO domains (id, client_id, domain_name, registrar, registration_date, expiry_date, renewal_date, auto_renewal, status, renewal_cost, dns_status, ssl_status, nameservers, credentials_placeholder, notes)
        VALUES (:id, :clientId, :domainName, :registrar, :registrationDate, :expiryDate, :renewalDate, :autoRenewal, :status, :renewalCost, :dnsStatus, :sslStatus, :nameservers, :credentialsPlaceholder, :notes)
    ");

    $stmt->execute([
        ':id'                     => $domId,
        ':clientId'               => $clientId,
        ':domainName'             => $domainName,
        ':registrar'              => $input['registrar'] ?? '',
        ':registrationDate'       => $input['registrationDate'] ?? ($input['registration_date'] ?? date('Y-m-d')),
        ':expiryDate'             => $input['expiryDate'] ?? ($input['expiry_date'] ?? date('Y-m-d')),
        ':renewalDate'            => $input['renewalDate'] ?? ($input['renewal_date'] ?? ''),
        ':autoRenewal'            => $input['autoRenewal'] ?? ($input['auto_renewal'] ?? 'No'),
        ':status'                 => $input['status'] ?? 'Active',
        ':renewalCost'            => (float)($input['renewalCost'] ?? ($input['renewal_cost'] ?? 0)),
        ':dnsStatus'              => $input['dnsStatus'] ?? ($input['dns_status'] ?? 'Active'),
        ':sslStatus'              => $input['sslStatus'] ?? ($input['ssl_status'] ?? 'Active'),
        ':nameservers'            => $input['nameservers'] ?? '',
        ':credentialsPlaceholder' => $input['credentialsPlaceholder'] ?? ($input['credentials_placeholder'] ?? ''),
        ':notes'                  => $input['notes'] ?? ''
    ]);

    json_response(['success' => true, 'message' => 'Domain registered successfully.', 'id' => $domId], 201);
}

// PUT: Update domain
if ($method === 'PUT') {
    verify_csrf();
    $input = get_input();
    $domId = $id ?? ($input['id'] ?? null);
    if (!$domId) {
        json_error("Domain ID is required for update.", 400);
    }

    $stmt = $db->prepare("
        UPDATE domains SET
            client_id = COALESCE(:clientId, client_id),
            domain_name = COALESCE(:domainName, domain_name),
            registrar = COALESCE(:registrar, registrar),
            registration_date = COALESCE(:registrationDate, registration_date),
            expiry_date = COALESCE(:expiryDate, expiry_date),
            renewal_date = COALESCE(:renewalDate, renewal_date),
            auto_renewal = COALESCE(:autoRenewal, auto_renewal),
            status = COALESCE(:status, status),
            renewal_cost = COALESCE(:renewalCost, renewal_cost),
            dns_status = COALESCE(:dnsStatus, dns_status),
            ssl_status = COALESCE(:sslStatus, ssl_status),
            nameservers = COALESCE(:nameservers, nameservers),
            credentials_placeholder = COALESCE(:credentialsPlaceholder, credentials_placeholder),
            notes = COALESCE(:notes, notes)
        WHERE id = :id
    ");

    $stmt->execute([
        ':id'                     => $domId,
        ':clientId'               => $input['clientId'] ?? ($input['client_id'] ?? null),
        ':domainName'             => $input['domainName'] ?? ($input['domain_name'] ?? null),
        ':registrar'              => $input['registrar'] ?? null,
        ':registrationDate'       => $input['registrationDate'] ?? ($input['registration_date'] ?? null),
        ':expiryDate'             => $input['expiryDate'] ?? ($input['expiry_date'] ?? null),
        ':renewalDate'            => $input['renewalDate'] ?? ($input['renewal_date'] ?? null),
        ':autoRenewal'            => $input['autoRenewal'] ?? ($input['auto_renewal'] ?? null),
        ':status'                 => $input['status'] ?? null,
        ':renewalCost'            => isset($input['renewalCost']) ? (float)$input['renewalCost'] : (isset($input['renewal_cost']) ? (float)$input['renewal_cost'] : null),
        ':dnsStatus'              => $input['dnsStatus'] ?? ($input['dns_status'] ?? null),
        ':sslStatus'              => $input['sslStatus'] ?? ($input['ssl_status'] ?? null),
        ':nameservers'            => $input['nameservers'] ?? null,
        ':credentialsPlaceholder' => $input['credentialsPlaceholder'] ?? ($input['credentials_placeholder'] ?? null),
        ':notes'                  => $input['notes'] ?? null
    ]);

    json_response(['success' => true, 'message' => 'Domain updated successfully.']);
}

// DELETE: Remove domain
if ($method === 'DELETE') {
    verify_csrf();
    $domId = $id ?? ($_GET['id'] ?? null);
    if (!$domId) {
        json_error("Domain ID is required for deletion.", 400);
    }

    $stmt = $db->prepare("DELETE FROM domains WHERE id = ?");
    $stmt->execute([$domId]);

    json_response(['success' => true, 'message' => 'Domain deleted successfully.']);
}

json_error("Unsupported method.", 405);
