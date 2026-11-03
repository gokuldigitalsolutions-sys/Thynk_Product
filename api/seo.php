<?php
// ==========================================================
// Thynk Digital Solution - SEO Management API Endpoint
// Protected: Authentication, Module Permission (marketing), CSRF
// ==========================================================

require_once __DIR__ . '/config.php';

$user   = require_module_perm('marketing');
$db     = get_db();
$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;

// GET: List SEO campaigns or single campaign
if ($method === 'GET') {
    if ($id) {
        $stmt = $db->prepare("SELECT id, client_id AS clientId, website_url AS websiteUrl, campaign_name AS campaignName, package, start_date AS startDate, end_date AS endDate, budget, status, report_date AS reportDate, report_frequency AS reportFrequency, target_keywords AS targetKeywords, current_ranking AS currentRanking, articles_published AS articlesPublished, backlinks, report_file AS reportFile, assigned_employee_id AS assignedEmployeeId, progress, notes, keywords, weekly_log AS weeklyLog, uploaded_reports AS uploadedReports, ga4, gsc FROM seo WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $s = $stmt->fetch();
        if (!$s) json_error("SEO campaign not found.", 404);
        $s['budget']            = (float)$s['budget'];
        $s['articlesPublished'] = (int)$s['articlesPublished'];
        $s['backlinks']         = (int)$s['backlinks'];
        $s['progress']          = (int)$s['progress'];
        foreach (['keywords', 'weeklyLog', 'uploadedReports'] as $f) {
            $s[$f] = !empty($s[$f]) && is_string($s[$f]) ? (json_decode($s[$f], true) ?: []) : [];
        }
        foreach (['ga4', 'gsc'] as $f) {
            $s[$f] = !empty($s[$f]) && is_string($s[$f]) ? (json_decode($s[$f], true) ?: []) : [];
        }
        json_response(['success' => true, 'data' => $s]);
    } else {
        $stmt = $db->query("SELECT id, client_id AS clientId, website_url AS websiteUrl, campaign_name AS campaignName, package, start_date AS startDate, end_date AS endDate, budget, status, report_date AS reportDate, report_frequency AS reportFrequency, target_keywords AS targetKeywords, current_ranking AS currentRanking, articles_published AS articlesPublished, backlinks, report_file AS reportFile, assigned_employee_id AS assignedEmployeeId, progress, notes, keywords, weekly_log AS weeklyLog, uploaded_reports AS uploadedReports, ga4, gsc FROM seo ORDER BY id ASC");
        $raw = $stmt->fetchAll();
        $seoList = array_map(function($s) {
            $s['budget']            = (float)$s['budget'];
            $s['articlesPublished'] = (int)$s['articlesPublished'];
            $s['backlinks']         = (int)$s['backlinks'];
            $s['progress']          = (int)$s['progress'];
            foreach (['keywords', 'weeklyLog', 'uploadedReports'] as $f) {
                $s[$f] = !empty($s[$f]) && is_string($s[$f]) ? (json_decode($s[$f], true) ?: []) : [];
            }
            foreach (['ga4', 'gsc'] as $f) {
                $s[$f] = !empty($s[$f]) && is_string($s[$f]) ? (json_decode($s[$f], true) ?: []) : [];
            }
            return $s;
        }, $raw);
        json_response(['success' => true, 'data' => $seoList]);
    }
}

// POST: Add new SEO campaign
if ($method === 'POST') {
    verify_csrf();
    $input = get_input();

    $seoId = trim($input['id'] ?? '');
    if (empty($seoId)) {
        $stmt = $db->query("SELECT id FROM seo WHERE id LIKE 'SEO%'");
        $rows = $stmt->fetchAll();
        $maxNum = 0;
        foreach ($rows as $r) {
            if (preg_match('/SEO(\d+)/', $r['id'], $m)) {
                $num = (int)$m[1];
                if ($num > $maxNum) $maxNum = $num;
            }
        }
        $seoId = 'SEO' . str_pad($maxNum + 1, 3, '0', STR_PAD_LEFT);
    }

    $clientId     = trim($input['clientId'] ?? ($input['client_id'] ?? ''));
    $campaignName = trim($input['campaignName'] ?? ($input['campaign_name'] ?? ''));
    if (empty($clientId) || empty($campaignName)) {
        json_error("Client ID and campaign name are required.", 400);
    }

    $stmt = $db->prepare("
        INSERT INTO seo (id, client_id, website_url, campaign_name, package, start_date, end_date, budget, status, report_date, report_frequency, target_keywords, current_ranking, articles_published, backlinks, report_file, assigned_employee_id, progress, notes, keywords, weekly_log, uploaded_reports, ga4, gsc)
        VALUES (:id, :clientId, :websiteUrl, :campaignName, :package, :startDate, :endDate, :budget, :status, :reportDate, :reportFrequency, :targetKeywords, :currentRanking, :articlesPublished, :backlinks, :reportFile, :assignedEmployeeId, :progress, :notes, :keywords, :weeklyLog, :uploadedReports, :ga4, :gsc)
    ");

    $stmt->execute([
        ':id'                 => $seoId,
        ':clientId'           => $clientId,
        ':websiteUrl'         => $input['websiteUrl'] ?? ($input['website_url'] ?? ''),
        ':campaignName'       => $campaignName,
        ':package'            => $input['package'] ?? 'Standard',
        ':startDate'          => $input['startDate'] ?? ($input['start_date'] ?? date('Y-m-d')),
        ':endDate'            => $input['endDate'] ?? ($input['end_date'] ?? date('Y-m-d', strtotime('+30 days'))),
        ':budget'             => (float)($input['budget'] ?? 0),
        ':status'             => $input['status'] ?? 'Active',
        ':reportDate'         => $input['reportDate'] ?? ($input['report_date'] ?? ''),
        ':reportFrequency'    => $input['reportFrequency'] ?? ($input['report_frequency'] ?? 'Monthly'),
        ':targetKeywords'     => $input['targetKeywords'] ?? ($input['target_keywords'] ?? ''),
        ':currentRanking'     => $input['currentRanking'] ?? ($input['current_ranking'] ?? ''),
        ':articlesPublished'  => (int)($input['articlesPublished'] ?? ($input['articles_published'] ?? 0)),
        ':backlinks'          => (int)($input['backlinks'] ?? 0),
        ':reportFile'         => $input['reportFile'] ?? ($input['report_file'] ?? ''),
        ':assignedEmployeeId' => $input['assignedEmployeeId'] ?? ($input['assigned_employee_id'] ?? $user['id']),
        ':progress'           => (int)($input['progress'] ?? 0),
        ':notes'              => $input['notes'] ?? '',
        ':keywords'           => is_array($input['keywords'] ?? null) ? json_encode($input['keywords']) : ($input['keywords'] ?? '[]'),
        ':weeklyLog'          => is_array($input['weeklyLog'] ?? null) ? json_encode($input['weeklyLog']) : ($input['weekly_log'] ?? '[]'),
        ':uploadedReports'    => is_array($input['uploadedReports'] ?? null) ? json_encode($input['uploadedReports']) : ($input['uploaded_reports'] ?? '[]'),
        ':ga4'                => is_array($input['ga4'] ?? null) ? json_encode($input['ga4']) : ($input['ga4'] ?? '{}'),
        ':gsc'                => is_array($input['gsc'] ?? null) ? json_encode($input['gsc']) : ($input['gsc'] ?? '{}')
    ]);

    json_response(['success' => true, 'message' => 'SEO campaign created successfully.', 'id' => $seoId], 201);
}

// PUT: Update SEO campaign
if ($method === 'PUT') {
    verify_csrf();
    $input = get_input();
    $seoId = $id ?? ($input['id'] ?? null);
    if (!$seoId) {
        json_error("SEO Campaign ID is required for update.", 400);
    }

    $kw = isset($input['keywords']) ? (is_array($input['keywords']) ? json_encode($input['keywords']) : $input['keywords']) : null;
    $wl = isset($input['weeklyLog']) ? (is_array($input['weeklyLog']) ? json_encode($input['weeklyLog']) : $input['weeklyLog']) : null;
    $ur = isset($input['uploadedReports']) ? (is_array($input['uploadedReports']) ? json_encode($input['uploadedReports']) : $input['uploadedReports']) : null;
    $g4 = isset($input['ga4']) ? (is_array($input['ga4']) ? json_encode($input['ga4']) : $input['ga4']) : null;
    $gs = isset($input['gsc']) ? (is_array($input['gsc']) ? json_encode($input['gsc']) : $input['gsc']) : null;

    $stmt = $db->prepare("
        UPDATE seo SET
            client_id = COALESCE(:clientId, client_id),
            website_url = COALESCE(:websiteUrl, website_url),
            campaign_name = COALESCE(:campaignName, campaign_name),
            package = COALESCE(:package, package),
            start_date = COALESCE(:startDate, start_date),
            end_date = COALESCE(:endDate, end_date),
            budget = COALESCE(:budget, budget),
            status = COALESCE(:status, status),
            report_date = COALESCE(:reportDate, report_date),
            report_frequency = COALESCE(:reportFrequency, report_frequency),
            target_keywords = COALESCE(:targetKeywords, target_keywords),
            current_ranking = COALESCE(:currentRanking, current_ranking),
            articles_published = COALESCE(:articlesPublished, articles_published),
            backlinks = COALESCE(:backlinks, backlinks),
            report_file = COALESCE(:reportFile, report_file),
            assigned_employee_id = COALESCE(:assignedEmployeeId, assigned_employee_id),
            progress = COALESCE(:progress, progress),
            notes = COALESCE(:notes, notes),
            keywords = COALESCE(:keywords, keywords),
            weekly_log = COALESCE(:weeklyLog, weekly_log),
            uploaded_reports = COALESCE(:uploadedReports, uploaded_reports),
            ga4 = COALESCE(:ga4, ga4),
            gsc = COALESCE(:gsc, gsc)
        WHERE id = :id
    ");

    $stmt->execute([
        ':id'                 => $seoId,
        ':clientId'           => $input['clientId'] ?? ($input['client_id'] ?? null),
        ':websiteUrl'         => $input['websiteUrl'] ?? ($input['website_url'] ?? null),
        ':campaignName'       => $input['campaignName'] ?? ($input['campaign_name'] ?? null),
        ':package'            => $input['package'] ?? null,
        ':startDate'          => $input['startDate'] ?? ($input['start_date'] ?? null),
        ':endDate'            => $input['endDate'] ?? ($input['end_date'] ?? null),
        ':budget'             => isset($input['budget']) ? (float)$input['budget'] : null,
        ':status'             => $input['status'] ?? null,
        ':reportDate'         => $input['reportDate'] ?? ($input['report_date'] ?? null),
        ':reportFrequency'    => $input['reportFrequency'] ?? ($input['report_frequency'] ?? null),
        ':targetKeywords'     => $input['targetKeywords'] ?? ($input['target_keywords'] ?? null),
        ':currentRanking'     => $input['currentRanking'] ?? ($input['current_ranking'] ?? null),
        ':articlesPublished'  => isset($input['articlesPublished']) ? (int)$input['articlesPublished'] : null,
        ':backlinks'          => isset($input['backlinks']) ? (int)$input['backlinks'] : null,
        ':reportFile'         => $input['reportFile'] ?? ($input['report_file'] ?? null),
        ':assignedEmployeeId' => $input['assignedEmployeeId'] ?? ($input['assigned_employee_id'] ?? null),
        ':progress'           => isset($input['progress']) ? (int)$input['progress'] : null,
        ':notes'              => $input['notes'] ?? null,
        ':keywords'           => $kw,
        ':weeklyLog'          => $wl,
        ':uploadedReports'    => $ur,
        ':ga4'                => $g4,
        ':gsc'                => $gs
    ]);

    json_response(['success' => true, 'message' => 'SEO campaign updated successfully.']);
}

// DELETE: Remove SEO campaign
if ($method === 'DELETE') {
    verify_csrf();
    $seoId = $id ?? ($_GET['id'] ?? null);
    if (!$seoId) {
        json_error("SEO Campaign ID is required for deletion.", 400);
    }

    $stmt = $db->prepare("DELETE FROM seo WHERE id = ?");
    $stmt->execute([$seoId]);

    json_response(['success' => true, 'message' => 'SEO campaign deleted successfully.']);
}

json_error("Unsupported method.", 405);
