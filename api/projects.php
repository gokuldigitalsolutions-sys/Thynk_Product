<?php
// ==========================================================
// Thynk Digital Solution - Projects API Endpoint
// Protected: Authentication, Module Permission (crm), CSRF
// ==========================================================

require_once __DIR__ . '/config.php';

$user   = require_module_perm('crm');
$db     = get_db();
$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;

// GET: List all projects or single project
if ($method === 'GET') {
    if ($id) {
        $stmt = $db->prepare("SELECT id, client_id AS clientId, project_name AS projectName, website_type AS websiteType, domain, hosting, start_date AS startDate, delivery_date AS deliveryDate, progress, assigned_developer_id AS assignedDeveloperId, status, notes FROM projects WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $project = $stmt->fetch();
        if (!$project) json_error("Project not found.", 404);
        $project['progress'] = (int)$project['progress'];
        json_response(['success' => true, 'data' => $project]);
    } else {
        $stmt = $db->query("SELECT id, client_id AS clientId, project_name AS projectName, website_type AS websiteType, domain, hosting, start_date AS startDate, delivery_date AS deliveryDate, progress, assigned_developer_id AS assignedDeveloperId, status, notes FROM projects ORDER BY id ASC");
        $raw = $stmt->fetchAll();
        $projects = array_map(function($p) {
            $p['progress'] = (int)$p['progress'];
            return $p;
        }, $raw);
        json_response(['success' => true, 'data' => $projects]);
    }
}

// POST: Add new project
if ($method === 'POST') {
    verify_csrf();
    $input = get_input();

    $projId = trim($input['id'] ?? '');
    if (empty($projId)) {
        $stmt = $db->query("SELECT id FROM projects WHERE id LIKE 'PRJ%'");
        $rows = $stmt->fetchAll();
        $maxNum = 0;
        foreach ($rows as $r) {
            if (preg_match('/PRJ(\d+)/', $r['id'], $m)) {
                $num = (int)$m[1];
                if ($num > $maxNum) $maxNum = $num;
            }
        }
        $projId = 'PRJ' . str_pad($maxNum + 1, 3, '0', STR_PAD_LEFT);
    }

    $clientId    = trim($input['clientId'] ?? ($input['client_id'] ?? ''));
    $projectName = trim($input['projectName'] ?? ($input['project_name'] ?? ''));
    if (empty($clientId) || empty($projectName)) {
        json_error("Client ID and project name are required.", 400);
    }

    $stmt = $db->prepare("
        INSERT INTO projects (id, client_id, project_name, website_type, domain, hosting, start_date, delivery_date, progress, assigned_developer_id, status, notes)
        VALUES (:id, :clientId, :projectName, :websiteType, :domain, :hosting, :startDate, :deliveryDate, :progress, :assignedDeveloperId, :status, :notes)
    ");

    $stmt->execute([
        ':id'                  => $projId,
        ':clientId'            => $clientId,
        ':projectName'         => $projectName,
        ':websiteType'         => $input['websiteType'] ?? ($input['website_type'] ?? 'Custom'),
        ':domain'              => $input['domain'] ?? '',
        ':hosting'             => $input['hosting'] ?? '',
        ':startDate'           => $input['startDate'] ?? ($input['start_date'] ?? date('Y-m-d')),
        ':deliveryDate'        => $input['deliveryDate'] ?? ($input['delivery_date'] ?? date('Y-m-d', strtotime('+30 days'))),
        ':progress'            => (int)($input['progress'] ?? 0),
        ':assignedDeveloperId' => $input['assignedDeveloperId'] ?? ($input['assigned_developer_id'] ?? $user['id']),
        ':status'              => $input['status'] ?? 'In Progress',
        ':notes'               => $input['notes'] ?? ''
    ]);

    json_response(['success' => true, 'message' => 'Project created successfully.', 'id' => $projId], 201);
}

// PUT: Update project
if ($method === 'PUT') {
    verify_csrf();
    $input = get_input();
    $projId = $id ?? ($input['id'] ?? null);
    if (!$projId) {
        json_error("Project ID is required for update.", 400);
    }

    $stmt = $db->prepare("
        UPDATE projects SET
            client_id = COALESCE(:clientId, client_id),
            project_name = COALESCE(:projectName, project_name),
            website_type = COALESCE(:websiteType, website_type),
            domain = COALESCE(:domain, domain),
            hosting = COALESCE(:hosting, hosting),
            start_date = COALESCE(:startDate, start_date),
            delivery_date = COALESCE(:deliveryDate, delivery_date),
            progress = COALESCE(:progress, progress),
            assigned_developer_id = COALESCE(:assignedDeveloperId, assigned_developer_id),
            status = COALESCE(:status, status),
            notes = COALESCE(:notes, notes)
        WHERE id = :id
    ");

    $stmt->execute([
        ':id'                  => $projId,
        ':clientId'            => $input['clientId'] ?? ($input['client_id'] ?? null),
        ':projectName'         => $input['projectName'] ?? ($input['project_name'] ?? null),
        ':websiteType'         => $input['websiteType'] ?? ($input['website_type'] ?? null),
        ':domain'              => $input['domain'] ?? null,
        ':hosting'             => $input['hosting'] ?? null,
        ':startDate'           => $input['startDate'] ?? ($input['start_date'] ?? null),
        ':deliveryDate'        => $input['deliveryDate'] ?? ($input['delivery_date'] ?? null),
        ':progress'            => isset($input['progress']) ? (int)$input['progress'] : null,
        ':assignedDeveloperId' => $input['assignedDeveloperId'] ?? ($input['assigned_developer_id'] ?? null),
        ':status'              => $input['status'] ?? null,
        ':notes'               => $input['notes'] ?? null
    ]);

    json_response(['success' => true, 'message' => 'Project updated successfully.']);
}

// DELETE: Remove project
if ($method === 'DELETE') {
    verify_csrf();
    $projId = $id ?? ($_GET['id'] ?? null);
    if (!$projId) {
        json_error("Project ID is required for deletion.", 400);
    }

    $stmt = $db->prepare("DELETE FROM projects WHERE id = ?");
    $stmt->execute([$projId]);

    json_response(['success' => true, 'message' => 'Project deleted successfully.']);
}

json_error("Unsupported method.", 405);
