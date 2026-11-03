<?php
// ==========================================================
// Thynk Digital Solution - Notes API Endpoint
// Protected: Authentication, Module Permission (crm), CSRF
// ==========================================================

require_once __DIR__ . '/config.php';

$user   = require_module_perm('crm');
$db     = get_db();
$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;
$userId = $user['id'];

// GET: List all notes or single note
if ($method === 'GET') {
    if ($id) {
        $stmt = $db->prepare("SELECT id, client_id AS clientId, title, description, tags, created_by_id AS createdById, date_created AS dateCreated, pinned FROM notes WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $note = $stmt->fetch();
        if (!$note) json_error("Note not found.", 404);
        $note['pinned'] = (bool)$note['pinned'];
        $note['tags'] = !empty($note['tags']) && is_string($note['tags']) ? (json_decode($note['tags'], true) ?: []) : [];
        json_response(['success' => true, 'data' => $note]);
    } else {
        $stmt = $db->query("SELECT id, client_id AS clientId, title, description, tags, created_by_id AS createdById, date_created AS dateCreated, pinned FROM notes ORDER BY pinned DESC, id DESC");
        $raw = $stmt->fetchAll();
        $notes = array_map(function($n) {
            $n['pinned'] = (bool)$n['pinned'];
            $n['tags'] = !empty($n['tags']) && is_string($n['tags']) ? (json_decode($n['tags'], true) ?: []) : [];
            return $n;
        }, $raw);
        json_response(['success' => true, 'data' => $notes]);
    }
}

// POST: Add new note
if ($method === 'POST') {
    verify_csrf();
    $input = get_input();

    $noteId = trim($input['id'] ?? '');
    if (empty($noteId)) {
        $stmt = $db->query("SELECT id FROM notes WHERE id LIKE 'NOT%'");
        $rows = $stmt->fetchAll();
        $maxNum = 0;
        foreach ($rows as $r) {
            if (preg_match('/NOT(\d+)/', $r['id'], $m)) {
                $num = (int)$m[1];
                if ($num > $maxNum) $maxNum = $num;
            }
        }
        $noteId = 'NOT' . str_pad($maxNum + 1, 3, '0', STR_PAD_LEFT);
    }

    $title = trim($input['title'] ?? '');
    if (empty($title)) {
        json_error("Title is required.", 400);
    }

    $tags = !empty($input['tags']) ? (is_array($input['tags']) ? json_encode($input['tags']) : $input['tags']) : '[]';

    $stmt = $db->prepare("
        INSERT INTO notes (id, client_id, title, description, tags, created_by_id, date_created, pinned)
        VALUES (:id, :clientId, :title, :description, :tags, :createdById, :dateCreated, :pinned)
    ");

    $stmt->execute([
        ':id'          => $noteId,
        ':clientId'    => $input['clientId'] ?? ($input['client_id'] ?? ''),
        ':title'       => $title,
        ':description' => $input['description'] ?? '',
        ':tags'        => $tags,
        ':createdById' => $input['createdById'] ?? ($input['created_by_id'] ?? $userId),
        ':dateCreated' => $input['dateCreated'] ?? ($input['date_created'] ?? date('Y-m-d')),
        ':pinned'      => !empty($input['pinned']) ? 1 : 0
    ]);

    json_response(['success' => true, 'message' => 'Note created successfully.', 'id' => $noteId], 201);
}

// PUT: Update note
if ($method === 'PUT') {
    verify_csrf();
    $input = get_input();
    $noteId = $id ?? ($input['id'] ?? null);
    if (!$noteId) {
        json_error("Note ID is required for update.", 400);
    }

    $tags = null;
    if (isset($input['tags'])) {
        $tags = is_array($input['tags']) ? json_encode($input['tags']) : $input['tags'];
    }

    $pinned = null;
    if (isset($input['pinned'])) {
        $pinned = !empty($input['pinned']) ? 1 : 0;
    }

    $stmt = $db->prepare("
        UPDATE notes SET
            client_id = COALESCE(:clientId, client_id),
            title = COALESCE(:title, title),
            description = COALESCE(:description, description),
            tags = COALESCE(:tags, tags),
            pinned = COALESCE(:pinned, pinned)
        WHERE id = :id
    ");

    $stmt->execute([
        ':id'          => $noteId,
        ':clientId'    => $input['clientId'] ?? ($input['client_id'] ?? null),
        ':title'       => $input['title'] ?? null,
        ':description' => $input['description'] ?? null,
        ':tags'        => $tags,
        ':pinned'      => $pinned
    ]);

    json_response(['success' => true, 'message' => 'Note updated successfully.']);
}

// DELETE: Remove note
if ($method === 'DELETE') {
    verify_csrf();
    $noteId = $id ?? ($_GET['id'] ?? null);
    if (!$noteId) {
        json_error("Note ID is required for deletion.", 400);
    }

    $stmt = $db->prepare("DELETE FROM notes WHERE id = ?");
    $stmt->execute([$noteId]);

    json_response(['success' => true, 'message' => 'Note deleted successfully.']);
}

json_error("Unsupported method.", 405);
