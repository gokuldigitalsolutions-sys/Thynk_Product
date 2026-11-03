<?php
// ==========================================================
// Thynk Digital Solution - CRM & HRMS Backend Configuration
// Secure Authentication, CSRF Protection, and Role-Based Access
// ==========================================================

// Prevent PHP notices/warnings from corrupting JSON responses
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', '0');

// Start session securely with cookie flags
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', '1');
    ini_set('session.use_only_cookies', '1');
    ini_set('session.cookie_samesite', 'Lax');
    session_start();
}

// Generate CSRF token if not already in session
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// Set request method default for CLI testing
if (empty($_SERVER['REQUEST_METHOD'])) {
    $_SERVER['REQUEST_METHOD'] = 'GET';
}

// Output headers in web server environment
if (php_sapi_name() !== 'cli') {
    header('Content-Type: application/json; charset=utf-8');
    
    // Allow CORS dynamically for requesting origin
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (!empty($origin)) {
        header("Access-Control-Allow-Origin: {$origin}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-CSRF-Token');
    }

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

// Database Credentials (Supports environment variables or direct values)
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('DB_NAME') ?: 'thynk_crm_db');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') !== false ? getenv('DB_PASS') : '');

/**
 * Get PDO Database Connection
 */
function get_db() {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            json_error("Database connection error: " . $e->getMessage(), 500);
        }
    }
    return $pdo;
}

/**
 * Send JSON Success Response
 */
function json_response($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/**
 * Send JSON Error Response
 */
function json_error($message, $status = 400, $details = null) {
    http_response_code($status);
    $payload = [
        'success' => false,
        'error'   => $message
    ];
    if ($details !== null) {
        $payload['details'] = $details;
    }
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/**
 * Get Request Body as JSON / Array
 */
function get_input() {
    $raw = file_get_contents('php://input');
    if (!empty($raw)) {
        $decoded = json_decode($raw, true);
        if (is_array($decoded)) {
            return $decoded;
        }
    }
    return $_POST;
}

/**
 * Get Logged In User from Session
 */
function auth_user() {
    if (!empty($_SESSION['thynk_user'])) {
        return $_SESSION['thynk_user'];
    }
    return null;
}

/**
 * Require User to be Authenticated (HTTP 401 on failure)
 */
function require_auth() {
    $user = auth_user();
    if (!$user) {
        json_error("Unauthorized. Please log in to access this resource.", 401);
    }
    return $user;
}

/**
 * Check if user is Admin, CEO, CTO, or Executive
 */
function is_admin_or_exec($user = null) {
    if ($user === null) {
        $user = auth_user();
    }
    if (!$user) return false;
    
    // E001 is default Administrator
    if (($user['id'] ?? '') === 'E001') return true;
    
    $role = strtolower(trim($user['role'] ?? ''));
    $desig = strtolower(trim($user['designation'] ?? ''));
    $execTitles = ['admin', 'administrator', 'ceo', 'cto', 'chief executive officer', 'chief technology officer', 'director', 'founder'];
    
    foreach ($execTitles as $t) {
        if ($role === $t || $desig === $t || strpos($role, 'admin') !== false || strpos($desig, 'admin') !== false || strpos($desig, 'ceo') !== false || strpos($desig, 'cto') !== false) {
            return true;
        }
    }
    
    $perms = $user['permissions'] ?? [];
    if (is_string($perms)) {
        $perms = json_decode($perms, true) ?: [];
    }
    if (!empty($perms['admin'])) return true;
    
    return false;
}

/**
 * Require Admin, CEO, or CTO privileges (HTTP 403 on failure)
 */
function require_admin_or_exec($user = null) {
    $currentUser = $user ?: require_auth();
    if (!is_admin_or_exec($currentUser)) {
        json_error("Access denied. Admin, CEO, or CTO permission required.", 403);
    }
    return $currentUser;
}

/**
 * Require Module-Specific Permissions
 */
function require_module_perm($module) {
    $user = require_auth();
    if (is_admin_or_exec($user)) return $user;

    $perms = $user['permissions'] ?? [];
    if (is_string($perms)) {
        $perms = json_decode($perms, true) ?: [];
    }

    if (empty($perms[$module])) {
        json_error("Access denied. Permission for module '{$module}' is required.", 403);
    }
    return $user;
}

/**
 * Get CSRF Token
 */
function get_csrf_token() {
    return $_SESSION['csrf_token'] ?? '';
}

/**
 * Verify CSRF Token on State-Changing Requests (POST, PUT, DELETE)
 */
function verify_csrf() {
    $method = $_SERVER['REQUEST_METHOD'];
    if (in_array($method, ['POST', 'PUT', 'DELETE'])) {
        $headerToken = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
        if (empty($headerToken)) {
            $input = get_input();
            $headerToken = $input['csrf_token'] ?? ($input['csrfToken'] ?? ($_POST['csrf_token'] ?? ''));
        }

        $sessionToken = $_SESSION['csrf_token'] ?? '';
        if (empty($sessionToken) || empty($headerToken) || !hash_equals($sessionToken, $headerToken)) {
            json_error("CSRF token validation failed. Request rejected.", 403);
        }
    }
}
