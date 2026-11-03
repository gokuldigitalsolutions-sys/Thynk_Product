<?php
// ==========================================================
// Thynk Digital Solution - Meta Ads API Endpoint
// Protected: Authentication, Module Permission (marketing), CSRF
// ==========================================================

require_once __DIR__ . '/config.php';

$user   = require_module_perm('marketing');
$db     = get_db();
$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;

// GET: List all Meta Ads campaigns or single campaign
if ($method === 'GET') {
    if ($id) {
        $stmt = $db->prepare("SELECT id, client_name AS clientName, campaign_name AS campaignName, objective, package_amount AS packageAmount, ad_budget AS adBudget, start_date AS startDate, end_date AS endDate, renewal_date AS renewalDate, status, assigned_employee_id AS assignedEmployeeId, remarks, daily_performance AS dailyPerformance, payments, notes, followups, timeline FROM meta_ads WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $m = $stmt->fetch();
        if (!$m) json_error("Meta Ads campaign not found.", 404);
        $m['packageAmount'] = (float)$m['packageAmount'];
        $m['adBudget']      = (float)$m['adBudget'];
        foreach (['dailyPerformance', 'payments', 'notes', 'followups', 'timeline'] as $f) {
            $m[$f] = !empty($m[$f]) && is_string($m[$f]) ? (json_decode($m[$f], true) ?: []) : [];
        }
        json_response(['success' => true, 'data' => $m]);
    } else {
        $stmt = $db->query("SELECT id, client_name AS clientName, campaign_name AS campaignName, objective, package_amount AS packageAmount, ad_budget AS adBudget, start_date AS startDate, end_date AS endDate, renewal_date AS renewalDate, status, assigned_employee_id AS assignedEmployeeId, remarks, daily_performance AS dailyPerformance, payments, notes, followups, timeline FROM meta_ads ORDER BY id ASC");
        $raw = $stmt->fetchAll();
        $campaigns = array_map(function($m) {
            $m['packageAmount'] = (float)$m['packageAmount'];
            $m['adBudget']      = (float)$m['adBudget'];
            foreach (['dailyPerformance', 'payments', 'notes', 'followups', 'timeline'] as $f) {
                $m[$f] = !empty($m[$f]) && is_string($m[$f]) ? (json_decode($m[$f], true) ?: []) : [];
            }
            return $m;
        }, $raw);
        json_response(['success' => true, 'data' => $campaigns]);
    }
}

// POST: Add new Meta Ads campaign
if ($method === 'POST') {
    verify_csrf();
    $input = get_input();

    $campId = trim($input['id'] ?? '');
    if (empty($campId)) {
        $stmt = $db->query("SELECT id FROM meta_ads WHERE id LIKE 'MA%'");
        $rows = $stmt->fetchAll();
        $maxNum = 0;
        foreach ($rows as $r) {
            if (preg_match('/MA(\d+)/', $r['id'], $m)) {
                $num = (int)$m[1];
                if ($num > $maxNum) $maxNum = $num;
            }
        }
        $campId = 'MA' . str_pad($maxNum + 1, 3, '0', STR_PAD_LEFT);
    }

    $clientName   = trim($input['clientName'] ?? ($input['client_name'] ?? ''));
    $campaignName = trim($input['campaignName'] ?? ($input['campaign_name'] ?? ''));
    if (empty($clientName) || empty($campaignName)) {
        json_error("Client name and campaign name are required.", 400);
    }

    $stmt = $db->prepare("
        INSERT INTO meta_ads (id, client_name, campaign_name, objective, package_amount, ad_budget, start_date, end_date, renewal_date, status, assigned_employee_id, remarks, daily_performance, payments, notes, followups, timeline)
        VALUES (:id, :clientName, :campaignName, :objective, :packageAmount, :adBudget, :startDate, :endDate, :renewalDate, :status, :assignedEmployeeId, :remarks, :dailyPerformance, :payments, :notes, :followups, :timeline)
    ");

    $stmt->execute([
        ':id'                 => $campId,
        ':clientName'         => $clientName,
        ':campaignName'       => $campaignName,
        ':objective'          => $input['objective'] ?? 'Lead Generation',
        ':packageAmount'      => (float)($input['packageAmount'] ?? ($input['package_amount'] ?? 0)),
        ':adBudget'           => (float)($input['adBudget'] ?? ($input['ad_budget'] ?? 0)),
        ':startDate'          => $input['startDate'] ?? ($input['start_date'] ?? date('Y-m-d')),
        ':endDate'            => $input['endDate'] ?? ($input['end_date'] ?? date('Y-m-d', strtotime('+30 days'))),
        ':renewalDate'        => $input['renewalDate'] ?? ($input['renewal_date'] ?? ''),
        ':status'             => $input['status'] ?? 'Active',
        ':assignedEmployeeId' => $input['assignedEmployeeId'] ?? ($input['assigned_employee_id'] ?? $user['id']),
        ':remarks'            => $input['remarks'] ?? '',
        ':dailyPerformance'   => is_array($input['dailyPerformance'] ?? null) ? json_encode($input['dailyPerformance']) : ($input['daily_performance'] ?? '[]'),
        ':payments'           => is_array($input['payments'] ?? null) ? json_encode($input['payments']) : '[]',
        ':notes'              => is_array($input['notes'] ?? null) ? json_encode($input['notes']) : '[]',
        ':followups'          => is_array($input['followups'] ?? null) ? json_encode($input['followups']) : '[]',
        ':timeline'           => is_array($input['timeline'] ?? null) ? json_encode($input['timeline']) : '[]'
    ]);

    json_response(['success' => true, 'message' => 'Meta Ads campaign created successfully.', 'id' => $campId], 201);
}

// PUT: Update Meta Ads campaign
if ($method === 'PUT') {
    verify_csrf();
    $input = get_input();
    $campId = $id ?? ($input['id'] ?? null);
    if (!$campId) {
        json_error("Campaign ID is required for update.", 400);
    }

    $dp = isset($input['dailyPerformance']) ? (is_array($input['dailyPerformance']) ? json_encode($input['dailyPerformance']) : $input['dailyPerformance']) : null;
    $pm = isset($input['payments']) ? (is_array($input['payments']) ? json_encode($input['payments']) : $input['payments']) : null;
    $nt = isset($input['notes']) ? (is_array($input['notes']) ? json_encode($input['notes']) : $input['notes']) : null;
    $fl = isset($input['followups']) ? (is_array($input['followups']) ? json_encode($input['followups']) : $input['followups']) : null;
    $tl = isset($input['timeline']) ? (is_array($input['timeline']) ? json_encode($input['timeline']) : $input['timeline']) : null;

    $stmt = $db->prepare("
        UPDATE meta_ads SET
            client_name = COALESCE(:clientName, client_name),
            campaign_name = COALESCE(:campaignName, campaign_name),
            objective = COALESCE(:objective, objective),
            package_amount = COALESCE(:packageAmount, package_amount),
            ad_budget = COALESCE(:adBudget, ad_budget),
            start_date = COALESCE(:startDate, start_date),
            end_date = COALESCE(:endDate, end_date),
            renewal_date = COALESCE(:renewalDate, renewal_date),
            status = COALESCE(:status, status),
            assigned_employee_id = COALESCE(:assignedEmployeeId, assigned_employee_id),
            remarks = COALESCE(:remarks, remarks),
            daily_performance = COALESCE(:dailyPerformance, daily_performance),
            payments = COALESCE(:payments, payments),
            notes = COALESCE(:notes, notes),
            followups = COALESCE(:followups, followups),
            timeline = COALESCE(:timeline, timeline)
        WHERE id = :id
    ");

    $stmt->execute([
        ':id'                 => $campId,
        ':clientName'         => $input['clientName'] ?? ($input['client_name'] ?? null),
        ':campaignName'       => $input['campaignName'] ?? ($input['campaign_name'] ?? null),
        ':objective'          => $input['objective'] ?? null,
        ':packageAmount'      => isset($input['packageAmount']) ? (float)$input['packageAmount'] : (isset($input['package_amount']) ? (float)$input['package_amount'] : null),
        ':adBudget'           => isset($input['adBudget']) ? (float)$input['adBudget'] : (isset($input['ad_budget']) ? (float)$input['ad_budget'] : null),
        ':startDate'          => $input['startDate'] ?? ($input['start_date'] ?? null),
        ':endDate'            => $input['endDate'] ?? ($input['end_date'] ?? null),
        ':renewalDate'        => $input['renewalDate'] ?? ($input['renewal_date'] ?? null),
        ':status'             => $input['status'] ?? null,
        ':assignedEmployeeId' => $input['assignedEmployeeId'] ?? ($input['assigned_employee_id'] ?? null),
        ':remarks'            => $input['remarks'] ?? null,
        ':dailyPerformance'   => $dp,
        ':payments'           => $pm,
        ':notes'              => $nt,
        ':followups'          => $fl,
        ':timeline'           => $tl
    ]);

    json_response(['success' => true, 'message' => 'Meta Ads campaign updated successfully.']);
}

// DELETE: Remove Meta Ads campaign
if ($method === 'DELETE') {
    verify_csrf();
    $campId = $id ?? ($_GET['id'] ?? null);
    if (!$campId) {
        json_error("Campaign ID is required for deletion.", 400);
    }

    $stmt = $db->prepare("DELETE FROM meta_ads WHERE id = ?");
    $stmt->execute([$campId]);

    json_response(['success' => true, 'message' => 'Meta Ads campaign deleted successfully.']);
}

json_error("Unsupported method.", 405);
