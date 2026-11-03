<?php
// ==========================================================
// Thynk Digital Solution - Settings API Endpoint
// Protected: Authentication (GET), Admin/Exec Only (POST), CSRF
// ==========================================================

require_once __DIR__ . '/config.php';

$user   = require_auth();
$db     = get_db();
$method = $_SERVER['REQUEST_METHOD'];

// GET: Retrieve all settings
if ($method === 'GET') {
    $stmt = $db->query("SELECT setting_key, setting_value FROM settings");
    $raw = $stmt->fetchAll();
    $settings = [];
    foreach ($raw as $s) {
        $val = $s['setting_value'];
        if (is_numeric($val)) $val = $val + 0;
        $settings[$s['setting_key']] = $val;
    }
    json_response(['success' => true, 'data' => $settings]);
}

// POST: Save settings (Admin Only)
if ($method === 'POST') {
    require_admin_or_exec($user);
    verify_csrf();
    $input = get_input();
    $settings = $input['settings'] ?? $input;

    if (!empty($settings) && is_array($settings)) {
        $stmt = $db->prepare("
            INSERT INTO settings (setting_key, setting_value)
            VALUES (:key, :value)
            ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
        ");
        foreach ($settings as $key => $val) {
            $stmt->execute([
                ':key'   => $key,
                ':value' => is_array($val) ? json_encode($val) : (string)$val
            ]);
        }
        json_response(['success' => true, 'message' => 'Settings updated successfully.']);
    }

    json_error("No settings payload provided.", 400);
}

json_error("Unsupported method.", 405);
