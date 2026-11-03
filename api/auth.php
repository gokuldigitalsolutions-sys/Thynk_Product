<?php
// ==========================================================
// Thynk Digital Solution - Authentication Endpoint
// All plain-text password fallbacks removed.
// Only password_verify() against stored bcrypt hash is used.
// ==========================================================

require_once __DIR__ . '/config.php';

$db = get_db();
$action = $_GET['action'] ?? ($_POST['action'] ?? 'check');

// ----------------------------------------------------------
// LOGIN
// ----------------------------------------------------------
if ($action === 'login') {
    $input = get_input();
    $loginUser = strtolower(trim($input['username'] ?? ($input['email'] ?? '')));
    $password  = $input['password'] ?? '';

    if (empty($loginUser) || $password === '') {
        json_error("Username/Email and password are required.", 400);
    }

    // Look up employee by email, username, or ID
    $stmt = $db->prepare("
        SELECT * FROM employees
        WHERE LOWER(email) = ? OR LOWER(username) = ? OR LOWER(id) = ?
        LIMIT 1
    ");
    $stmt->execute([$loginUser, $loginUser, $loginUser]);
    $emp = $stmt->fetch();

    if (!$emp) {
        json_error("Invalid credentials.", 401);
    }

    $hash = $emp['password_hash'] ?? '';

    // Only accept bcrypt hashes — no plain-text fallback
    $authenticated = false;
    if (!empty($hash) && (str_starts_with($hash, '$2y$') || str_starts_with($hash, '$2a$'))) {
        $authenticated = password_verify($password, $hash);
    } else {
        // Hash is missing or not bcrypt — upgrade on first login attempt
        // We cannot verify without a proper hash; reject and ask admin to reset
        json_error("Your account password needs to be reset by an administrator.", 401);
    }

    if (!$authenticated) {
        json_error("Invalid credentials.", 401);
    }

    // Decode permissions
    $perms = [];
    if (!empty($emp['permissions'])) {
        $perms = is_string($emp['permissions']) ? (json_decode($emp['permissions'], true) ?: []) : $emp['permissions'];
    }
    // Ensure admin users always get full permissions
    if (empty($perms)) {
        $isExec = (
            $emp['id'] === 'E001' ||
            in_array(strtolower($emp['role'] ?? ''), ['admin', 'administrator', 'ceo', 'cto']) ||
            stripos($emp['designation'] ?? '', 'ceo') !== false ||
            stripos($emp['designation'] ?? '', 'cto') !== false ||
            stripos($emp['designation'] ?? '', 'admin') !== false
        );
        $perms = $isExec
            ? ['crm' => true, 'hrms' => true, 'accounts' => true, 'marketing' => true, 'admin' => true]
            : ['crm' => false, 'hrms' => true, 'accounts' => false, 'marketing' => false, 'admin' => false];
    }

    $userSession = [
        'id'          => $emp['id'],
        'name'        => $emp['name'],
        'email'       => $emp['email'],
        'role'        => $emp['role'] ?: ($emp['designation'] ?: 'Employee'),
        'designation' => $emp['designation'] ?? '',
        'department'  => $emp['department'] ?? '',
        'photo'       => $emp['photo'] ?? '',
        'permissions' => $perms
    ];

    $_SESSION['thynk_user'] = $userSession;

    // Regenerate session ID on login to prevent session fixation
    session_regenerate_id(true);

    json_response([
        'success'    => true,
        'message'    => 'Logged in successfully.',
        'user'       => $userSession,
        'csrf_token' => get_csrf_token()
    ]);
}

// ----------------------------------------------------------
// LOGOUT
// ----------------------------------------------------------
if ($action === 'logout') {
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
    }
    session_destroy();
    json_response(['success' => true, 'message' => 'Logged out successfully.']);
}

// ----------------------------------------------------------
// CHECK (returns session state + CSRF token for frontend)
// ----------------------------------------------------------
if ($action === 'check') {
    $user = auth_user();
    if ($user) {
        json_response([
            'authenticated' => true,
            'user'          => $user,
            'csrf_token'    => get_csrf_token()
        ]);
    } else {
        json_response([
            'authenticated' => false,
            'user'          => null
        ]);
    }
}

// ----------------------------------------------------------
// CHANGE PASSWORD (authenticated users only)
// ----------------------------------------------------------
if ($action === 'change_password') {
    $user  = require_auth();
    verify_csrf();
    $input = get_input();

    $currentPass = $input['currentPassword'] ?? ($input['current_password'] ?? '');
    $newPass     = $input['newPassword']     ?? ($input['new_password']     ?? '');

    if (empty($newPass)) {
        json_error("New password cannot be empty.", 400);
    }
    if (strlen($newPass) < 6) {
        json_error("New password must be at least 6 characters long.", 400);
    }

    // Fetch stored hash
    $stmt = $db->prepare("SELECT password_hash FROM employees WHERE id = ? LIMIT 1");
    $stmt->execute([$user['id']]);
    $row = $stmt->fetch();
    $storedHash = $row['password_hash'] ?? '';

    // Verify current password using bcrypt only
    $validCurrent = false;
    if (!empty($storedHash) && (str_starts_with($storedHash, '$2y$') || str_starts_with($storedHash, '$2a$'))) {
        $validCurrent = password_verify($currentPass, $storedHash);
    }

    if (!$validCurrent) {
        json_error("Incorrect current password.", 400);
    }

    // Store new bcrypt hash
    $newHash = password_hash($newPass, PASSWORD_BCRYPT, ['cost' => 12]);
    $upStmt = $db->prepare("UPDATE employees SET password_hash = ? WHERE id = ?");
    $upStmt->execute([$newHash, $user['id']]);

    json_response(['success' => true, 'message' => 'Password updated successfully.']);
}

// ----------------------------------------------------------
// ADMIN: Reset any employee's password (admin only)
// ----------------------------------------------------------
if ($action === 'reset_password') {
    $admin = require_admin_or_exec();
    verify_csrf();
    $input = get_input();

    $targetId = trim($input['employeeId'] ?? ($input['employee_id'] ?? ''));
    $newPass  = $input['newPassword'] ?? ($input['new_password'] ?? '');

    if (empty($targetId) || empty($newPass)) {
        json_error("Employee ID and new password are required.", 400);
    }
    if (strlen($newPass) < 6) {
        json_error("New password must be at least 6 characters.", 400);
    }

    $newHash = password_hash($newPass, PASSWORD_BCRYPT, ['cost' => 12]);
    $stmt = $db->prepare("UPDATE employees SET password_hash = ? WHERE id = ?");
    $stmt->execute([$newHash, $targetId]);

    json_response(['success' => true, 'message' => "Password reset for employee {$targetId}."]);
}

json_error("Invalid action requested.", 400);
