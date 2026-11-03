<?php
// ==========================================================
// Thynk Digital Solution - Google Ads API Endpoint
// Protected: Authentication, Module Permission (marketing), CSRF
// ==========================================================

require_once __DIR__ . '/config.php';

$user   = require_module_perm('marketing');
$db     = get_db();
$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;

// GET: List all Google Ads campaigns or single campaign
if ($method === 'GET') {
    if ($id) {
        $stmt = $db->prepare("SELECT id, client_id AS clientId, campaign_name AS campaignName, objective, package_amount AS packageAmount, ad_budget AS adBudget, start_date AS startDate, end_date AS endDate, reach, clicks, leads, cpl, roas, status, assigned_employee_id AS assignedEmployeeId, notes FROM google_ads WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $g = $stmt->fetch();
        if (!$g) json_error("Google Ads campaign not found.", 404);
        $g['packageAmount'] = (float)$g['packageAmount'];
        $g['adBudget']      = (float)$g['adBudget'];
        $g['reach']         = (int)$g['reach'];
        $g['clicks']        = (int)$g['clicks'];
        $g['leads']         = (int)$g['leads'];
        $g['cpl']           = (float)$g['cpl'];
        $g['roas']          = (float)$g['roas'];
        json_response(['success' => true, 'data' => $g]);
    } else {
        $stmt = $db->query("SELECT id, client_id AS clientId, campaign_name AS campaignName, objective, package_amount AS packageAmount, ad_budget AS adBudget, start_date AS startDate, end_date AS endDate, reach, clicks, leads, cpl, roas, status, assigned_employee_id AS assignedEmployeeId, notes FROM google_ads ORDER BY id ASC");
        $raw = $stmt->fetchAll();
        $campaigns = array_map(function($g) {
            $g['packageAmount'] = (float)$g['packageAmount'];
            $g['adBudget']      = (float)$g['adBudget'];
            $g['reach']         = (int)$g['reach'];
            $g['clicks']        = (int)$g['clicks'];
            $g['leads']         = (int)$g['leads'];
            $g['cpl']           = (float)$g['cpl'];
            $g['roas']          = (float)$g['roas'];
            return $g;
        }, $raw);
        json_response(['success' => true, 'data' => $campaigns]);
    }
}

// POST: Add new Google Ads campaign
if ($method === 'POST') {
    verify_csrf();
    $input = get_input();

    $campId = trim($input['id'] ?? '');
    if (empty($campId)) {
        $stmt = $db->query("SELECT id FROM google_ads WHERE id LIKE 'GA%'");
        $rows = $stmt->fetchAll();
        $maxNum = 0;
        foreach ($rows as $r) {
            if (preg_match('/GA(\d+)/', $r['id'], $m)) {
                $num = (int)$m[1];
                if ($num > $maxNum) $maxNum = $num;
            }
        }
        $campId = 'GA' . str_pad($maxNum + 1, 3, '0', STR_PAD_LEFT);
    }

    $clientId     = trim($input['clientId'] ?? ($input['client_id'] ?? ''));
    $campaignName = trim($input['campaignName'] ?? ($input['campaign_name'] ?? ''));
    if (empty($clientId) || empty($campaignName)) {
        json_error("Client ID and campaign name are required.", 400);
    }

    $stmt = $db->prepare("
        INSERT INTO google_ads (id, client_id, campaign_name, objective, package_amount, ad_budget, start_date, end_date, reach, clicks, leads, cpl, roas, status, assigned_employee_id, notes)
        VALUES (:id, :clientId, :campaignName, :objective, :packageAmount, :adBudget, :startDate, :endDate, :reach, :clicks, :leads, :cpl, :roas, :status, :assignedEmployeeId, :notes)
    ");

    $stmt->execute([
        ':id'                 => $campId,
        ':clientId'           => $clientId,
        ':campaignName'       => $campaignName,
        ':objective'          => $input['objective'] ?? 'Lead Generation',
        ':packageAmount'      => (float)($input['packageAmount'] ?? ($input['package_amount'] ?? 0)),
        ':adBudget'           => (float)($input['adBudget'] ?? ($input['ad_budget'] ?? 0)),
        ':startDate'          => $input['startDate'] ?? ($input['start_date'] ?? date('Y-m-d')),
        ':endDate'            => $input['endDate'] ?? ($input['end_date'] ?? date('Y-m-d', strtotime('+30 days'))),
        ':reach'              => (int)($input['reach'] ?? 0),
        ':clicks'             => (int)($input['clicks'] ?? 0),
        ':leads'              => (int)($input['leads'] ?? 0),
        ':cpl'                => (float)($input['cpl'] ?? 0),
        ':roas'               => (float)($input['roas'] ?? 0),
        ':status'             => $input['status'] ?? 'Active',
        ':assignedEmployeeId' => $input['assignedEmployeeId'] ?? ($input['assigned_employee_id'] ?? $user['id']),
        ':notes'              => $input['notes'] ?? ''
    ]);

    json_response(['success' => true, 'message' => 'Google Ads campaign created successfully.', 'id' => $campId], 201);
}

// PUT: Update Google Ads campaign
if ($method === 'PUT') {
    verify_csrf();
    $input = get_input();
    $campId = $id ?? ($input['id'] ?? null);
    if (!$campId) {
        json_error("Campaign ID is required for update.", 400);
    }

    $stmt = $db->prepare("
        UPDATE google_ads SET
            client_id = COALESCE(:clientId, client_id),
            campaign_name = COALESCE(:campaignName, campaign_name),
            objective = COALESCE(:objective, objective),
            package_amount = COALESCE(:packageAmount, package_amount),
            ad_budget = COALESCE(:adBudget, ad_budget),
            start_date = COALESCE(:startDate, start_date),
            end_date = COALESCE(:endDate, end_date),
            reach = COALESCE(:reach, reach),
            clicks = COALESCE(:clicks, clicks),
            leads = COALESCE(:leads, leads),
            cpl = COALESCE(:cpl, cpl),
            roas = COALESCE(:roas, roas),
            status = COALESCE(:status, status),
            assigned_employee_id = COALESCE(:assignedEmployeeId, assigned_employee_id),
            notes = COALESCE(:notes, notes)
        WHERE id = :id
    ");

    $stmt->execute([
        ':id'                 => $campId,
        ':clientId'           => $input['clientId'] ?? ($input['client_id'] ?? null),
        ':campaignName'       => $input['campaignName'] ?? ($input['campaign_name'] ?? null),
        ':objective'          => $input['objective'] ?? null,
        ':packageAmount'      => isset($input['packageAmount']) ? (float)$input['packageAmount'] : (isset($input['package_amount']) ? (float)$input['package_amount'] : null),
        ':adBudget'           => isset($input['adBudget']) ? (float)$input['adBudget'] : (isset($input['ad_budget']) ? (float)$input['ad_budget'] : null),
        ':startDate'          => $input['startDate'] ?? ($input['start_date'] ?? null),
        ':endDate'            => $input['endDate'] ?? ($input['end_date'] ?? null),
        ':reach'              => isset($input['reach']) ? (int)$input['reach'] : null,
        ':clicks'             => isset($input['clicks']) ? (int)$input['clicks'] : null,
        ':leads'              => isset($input['leads']) ? (int)$input['leads'] : null,
        ':cpl'                => isset($input['cpl']) ? (float)$input['cpl'] : null,
        ':roas'               => isset($input['roas']) ? (float)$input['roas'] : null,
        ':status'             => $input['status'] ?? null,
        ':assignedEmployeeId' => $input['assignedEmployeeId'] ?? ($input['assigned_employee_id'] ?? null),
        ':notes'              => $input['notes'] ?? null
    ]);

    json_response(['success' => true, 'message' => 'Google Ads campaign updated successfully.']);
}

// DELETE: Remove Google Ads campaign
if ($method === 'DELETE') {
    verify_csrf();
    $campId = $id ?? ($_GET['id'] ?? null);
    if (!$campId) {
        json_error("Campaign ID is required for deletion.", 400);
    }

    $stmt = $db->prepare("DELETE FROM google_ads WHERE id = ?");
    $stmt->execute([$campId]);

    json_response(['success' => true, 'message' => 'Google Ads campaign deleted successfully.']);
}

json_error("Unsupported method.", 405);
