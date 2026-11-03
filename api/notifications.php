<?php
// ==========================================================
// Thynk Digital Solution - Notifications API Endpoint
// Protected: Authentication and CSRF
// ==========================================================

require_once __DIR__ . '/config.php';

$user   = require_auth();
$db     = get_db();
$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;

// GET: List notifications
if ($method === 'GET') {
    $stmt = $db->query("SELECT id, title, message, type, date FROM notifications ORDER BY id DESC LIMIT 50");
    $notifications = $stmt->fetchAll();
    json_response(['success' => true, 'data' => $notifications]);
}

// POST: Add notification
if ($method === 'POST') {
    verify_csrf();
    $input = get_input();

    $title   = trim($input['title'] ?? '');
    $message = trim($input['message'] ?? '');
    if (empty($title) || empty($message)) {
        json_error("Title and message are required.", 400);
    }

    $stmt = $db->prepare("
        INSERT INTO notifications (title, message, type, date)
        VALUES (:title, :message, :type, :date)
    ");

    $stmt->execute([
        ':title'   => $title,
        ':message' => $message,
        ':type'    => $input['type'] ?? 'info',
        ':date'    => $input['date'] ?? 'Just Now'
    ]);

    json_response(['success' => true, 'message' => 'Notification created.']);
}

// DELETE: Remove notification
if ($method === 'DELETE') {
    verify_csrf();
    $notifId = $id ?? ($_GET['id'] ?? null);
    if (!$notifId) {
        json_error("Notification ID is required.", 400);
    }

    $stmt = $db->prepare("DELETE FROM notifications WHERE id = ?");
    $stmt->execute([$notifId]);

    json_response(['success' => true, 'message' => 'Notification deleted.']);
}

json_error("Unsupported method.", 405);
