<?php
// ==========================================================
// Thynk Digital Solution - Timeline API Endpoint
// Protected: Authentication and CSRF
// ==========================================================

require_once __DIR__ . '/config.php';

$user   = require_auth();
$db     = get_db();
$method = $_SERVER['REQUEST_METHOD'];

// GET: List recent timeline entries
if ($method === 'GET') {
    $stmt = $db->query("SELECT timestamp, event_type AS eventType, icon, text FROM timeline ORDER BY timestamp DESC LIMIT 200");
    $timeline = $stmt->fetchAll();
    json_response(['success' => true, 'data' => $timeline]);
}

// POST: Add new timeline entry
if ($method === 'POST') {
    verify_csrf();
    $input = get_input();

    $text = trim($input['text'] ?? '');
    if (empty($text)) {
        json_error("Text is required for timeline entry.", 400);
    }

    $stmt = $db->prepare("
        INSERT INTO timeline (timestamp, event_type, icon, text)
        VALUES (:timestamp, :eventType, :icon, :text)
    ");

    $stmt->execute([
        ':timestamp' => $input['timestamp'] ?? date('Y-m-d H:i:s'),
        ':eventType' => $input['eventType'] ?? ($input['event_type'] ?? 'info'),
        ':icon'      => $input['icon'] ?? 'fa-info-circle',
        ':text'      => $text
    ]);

    json_response(['success' => true, 'message' => 'Timeline event recorded.']);
}

json_error("Unsupported method.", 405);
