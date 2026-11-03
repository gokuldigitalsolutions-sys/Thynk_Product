<?php
/**
 * Comprehensive Security & Functionality Verification Test Suite
 */

define('TEST_BASE_URL', 'http://127.0.0.1:8000/api');

function make_http_request($url, $method = 'GET', $data = null, $cookies = [], $headers = []) {
    $ch = curl_init($url);
    $reqHeaders = [
        'Accept: application/json'
    ];
    if ($data !== null) {
        $reqHeaders[] = 'Content-Type: application/json';
        curl_setopt($ch, CURLOPT_POSTFIELDS, is_string($data) ? $data : json_encode($data));
    }
    foreach ($headers as $k => $v) {
        $reqHeaders[] = "{$k}: {$v}";
    }

    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $reqHeaders);

    if (!empty($cookies)) {
        $cookieStr = '';
        foreach ($cookies as $k => $v) {
            $cookieStr .= "{$k}={$v}; ";
        }
        curl_setopt($ch, CURLOPT_COOKIE, rtrim($cookieStr, '; '));
    }

    $raw = curl_exec($ch);
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $headerText = substr($raw, 0, $headerSize);
    $bodyText = substr($raw, $headerSize);

    // Extract cookies
    $respCookies = [];
    if (preg_match_all('/^Set-Cookie:\s*([^;]+)/mi', $headerText, $matches)) {
        foreach ($matches[1] as $c) {
            $parts = explode('=', $c, 2);
            if (count($parts) === 2) {
                $respCookies[trim($parts[0])] = trim($parts[1]);
            }
        }
    }

    $json = json_decode($bodyText, true);

    return [
        'code'    => $httpCode,
        'headers' => $headerText,
        'cookies' => $respCookies,
        'body'    => $bodyText,
        'json'    => $json
    ];
}

$results = [];
function assert_test($name, $condition, $details = '') {
    global $results;
    if ($condition) {
        echo "[PASS] {$name}\n";
        $results[] = ['name' => $name, 'status' => 'PASS'];
    } else {
        echo "[FAIL] {$name}: {$details}\n";
        $results[] = ['name' => $name, 'status' => 'FAIL', 'details' => $details];
    }
}

echo "=== STARTING SECURITY & ACCESS CONTROL TESTS ===\n\n";

// ----------------------------------------------------
// TEST 1: Unauthenticated Requests Must Return 401
// ----------------------------------------------------
$unauthSync = make_http_request(TEST_BASE_URL . '/sync.php');
assert_test("Unauthenticated GET sync.php returns 401", $unauthSync['code'] === 401, "Got {$unauthSync['code']}");

$unauthClients = make_http_request(TEST_BASE_URL . '/clients.php');
assert_test("Unauthenticated GET clients.php returns 401/403", in_array($unauthClients['code'], [401, 403]), "Got {$unauthClients['code']}");

$unauthAttendance = make_http_request(TEST_BASE_URL . '/attendance.php');
assert_test("Unauthenticated GET attendance.php returns 401", $unauthAttendance['code'] === 401, "Got {$unauthAttendance['code']}");

$unauthTasks = make_http_request(TEST_BASE_URL . '/tasks.php');
assert_test("Unauthenticated GET tasks.php returns 401", $unauthTasks['code'] === 401, "Got {$unauthTasks['code']}");

// ----------------------------------------------------
// TEST 2: Bad Password Login Fails
// ----------------------------------------------------
$badLogin = make_http_request(TEST_BASE_URL . '/auth.php?action=login', 'POST', [
    'username' => 'neha@thynkdigital.in',
    'password' => 'WrongPassword123'
]);
assert_test("Bad password login returns 401", $badLogin['code'] === 401, "Got {$badLogin['code']}");

// ----------------------------------------------------
// TEST 3: Employee Login (Neha - E002)
// ----------------------------------------------------
$empLogin = make_http_request(TEST_BASE_URL . '/auth.php?action=login', 'POST', [
    'username' => 'neha@thynkdigital.in',
    'password' => '123456'
]);
assert_test("Employee Neha login returns 200", $empLogin['code'] === 200, "Got {$empLogin['code']}");
$empCookies = $empLogin['cookies'];
$empCsrf = $empLogin['json']['csrf_token'] ?? '';
assert_test("Login returns CSRF token", !empty($empCsrf), "CSRF token missing");
assert_test("Session cookie returned", !empty($empCookies['PHPSESSID']), "PHPSESSID missing");

// ----------------------------------------------------
// TEST 4: Employee Data Isolation (Attendance)
// ----------------------------------------------------
$nehaAtt = make_http_request(TEST_BASE_URL . '/attendance.php', 'GET', null, $empCookies);
assert_test("Neha gets attendance with 200", $nehaAtt['code'] === 200, "Got {$nehaAtt['code']}");
$allNeha = true;
if (!empty($nehaAtt['json']['data'])) {
    foreach ($nehaAtt['json']['data'] as $rec) {
        if ($rec['employeeId'] !== 'E002') {
            $allNeha = false;
            break;
        }
    }
}
assert_test("Neha only sees her own attendance records (E002)", $allNeha, "Found records of other employees");

// Neha tries to access Sneha's attendance (E003) -> must return 403
$nehaSnehaAtt = make_http_request(TEST_BASE_URL . '/attendance.php?employeeId=E003', 'GET', null, $empCookies);
assert_test("Neha accessing Sneha's attendance (E003) returns 403", $nehaSnehaAtt['code'] === 403, "Got {$nehaSnehaAtt['code']}");

// ----------------------------------------------------
// TEST 5: Employee Data Isolation (Tasks)
// ----------------------------------------------------
$nehaTasks = make_http_request(TEST_BASE_URL . '/tasks.php', 'GET', null, $empCookies);
assert_test("Neha gets tasks with 200", $nehaTasks['code'] === 200, "Got {$nehaTasks['code']}");
$allNehaTasks = true;
if (!empty($nehaTasks['json']['data'])) {
    foreach ($nehaTasks['json']['data'] as $rec) {
        if ($rec['assignedEmployeeId'] !== 'E002') {
            $allNehaTasks = false;
            break;
        }
    }
}
assert_test("Neha only sees tasks assigned to E002", $allNehaTasks, "Found other employees' tasks");

// ----------------------------------------------------
// TEST 6: CSRF Protection on State Changes
// ----------------------------------------------------
// State change POST without CSRF header should return 403
$csrfFailPost = make_http_request(TEST_BASE_URL . '/tasks.php', 'POST', [
    'taskName' => 'Unauthorized CSRF Task'
], $empCookies, []); // No CSRF header
assert_test("POST without CSRF header rejected with 403", $csrfFailPost['code'] === 403, "Got {$csrfFailPost['code']}");

// State change POST with correct CSRF header should succeed
$csrfPassPost = make_http_request(TEST_BASE_URL . '/tasks.php', 'POST', [
    'taskName' => 'Authorized Task for Neha'
], $empCookies, ['X-CSRF-Token' => $empCsrf]);
assert_test("POST with valid CSRF header succeeds with 201", $csrfPassPost['code'] === 201, "Got {$csrfPassPost['code']}");
$createdTaskId = $csrfPassPost['json']['id'] ?? null;

// ----------------------------------------------------
// TEST 7: Role Isolation on sync.php for Normal Employee
// ----------------------------------------------------
$nehaSync = make_http_request(TEST_BASE_URL . '/sync.php', 'GET', null, $empCookies);
assert_test("Neha sync.php returns 200", $nehaSync['code'] === 200, "Got {$nehaSync['code']}");
$syncData = $nehaSync['json']['data'] ?? [];
$syncEmpCount = count($syncData['employees'] ?? []);
assert_test("Neha sync.php returns only her employee profile (1 record)", $syncEmpCount === 1, "Got {$syncEmpCount} employees");
assert_test("Neha cannot see accounts/invoices in sync", empty($syncData['invoices']), "Invoices present for non-accounts employee");

// ----------------------------------------------------
// TEST 8: Admin Login & Full State Access (Ankit - E001)
// ----------------------------------------------------
$adminLogin = make_http_request(TEST_BASE_URL . '/auth.php?action=login', 'POST', [
    'username' => 'admin@thynkdigital.in',
    'password' => 'admin123'
]);
assert_test("Admin login returns 200", $adminLogin['code'] === 200, "Got {$adminLogin['code']}");
$adminCookies = $adminLogin['cookies'];
$adminCsrf = $adminLogin['json']['csrf_token'] ?? '';

$adminSync = make_http_request(TEST_BASE_URL . '/sync.php', 'GET', null, $adminCookies);
assert_test("Admin sync.php returns 200", $adminSync['code'] === 200, "Got {$adminSync['code']}");
$adminSyncData = $adminSync['json']['data'] ?? [];
$adminEmpCount = count($adminSyncData['employees'] ?? []);
assert_test("Admin sync.php returns all employees (>= 4)", $adminEmpCount >= 4, "Got {$adminEmpCount} employees");
assert_test("Admin sync.php returns invoices and clients", !empty($adminSyncData['clients']) && !empty($adminSyncData['invoices']), "Admin missing data");

// ----------------------------------------------------
// TEST 9: CEO Login (Rahul - E005)
// ----------------------------------------------------
$ceoLogin = make_http_request(TEST_BASE_URL . '/auth.php?action=login', 'POST', [
    'username' => 'ceo@thynkdigital.in',
    'password' => 'admin123'
]);
assert_test("CEO login returns 200", $ceoLogin['code'] === 200, "Got {$ceoLogin['code']}");
$ceoCookies = $ceoLogin['cookies'];
$ceoSync = make_http_request(TEST_BASE_URL . '/sync.php', 'GET', null, $ceoCookies);
assert_test("CEO has full executive access to all employees", count($ceoSync['json']['data']['employees'] ?? []) >= 4);

// ----------------------------------------------------
// TEST 10: CTO Login (Rajesh - E006)
// ----------------------------------------------------
$ctoLogin = make_http_request(TEST_BASE_URL . '/auth.php?action=login', 'POST', [
    'username' => 'cto@thynkdigital.in',
    'password' => 'admin123'
]);
assert_test("CTO login returns 200", $ctoLogin['code'] === 200, "Got {$ctoLogin['code']}");

// ----------------------------------------------------
// TEST 11: Password Change Workflow for Employee
// ----------------------------------------------------
// Change Neha's password from 123456 to NehaSecure#2026
$changePass = make_http_request(TEST_BASE_URL . '/auth.php?action=change_password', 'POST', [
    'currentPassword' => '123456',
    'newPassword'     => 'NehaSecure#2026'
], $empCookies, ['X-CSRF-Token' => $empCsrf]);
assert_test("Employee password change succeeds", $changePass['code'] === 200, "Got {$changePass['code']}");

// Login with new password
$newPassLogin = make_http_request(TEST_BASE_URL . '/auth.php?action=login', 'POST', [
    'username' => 'neha@thynkdigital.in',
    'password' => 'NehaSecure#2026'
]);
assert_test("Login with new password succeeds", $newPassLogin['code'] === 200, "Got {$newPassLogin['code']}");

// Login with old password fails
$oldPassLogin = make_http_request(TEST_BASE_URL . '/auth.php?action=login', 'POST', [
    'username' => 'neha@thynkdigital.in',
    'password' => '123456'
]);
assert_test("Login with old password is now rejected (401)", $oldPassLogin['code'] === 401, "Got {$oldPassLogin['code']}");

// Reset password back to 123456 via admin reset action
$adminReset = make_http_request(TEST_BASE_URL . '/auth.php?action=reset_password', 'POST', [
    'employeeId'  => 'E002',
    'newPassword' => '12345678'
], $adminCookies, ['X-CSRF-Token' => $adminCsrf]);
assert_test("Admin reset password succeeds", $adminReset['code'] === 200, "Got {$adminReset['code']}");

// Reset back to standard 123456
$db = new PDO("mysql:host=localhost;port=3306;dbname=thynk_crm_db;charset=utf8mb4", "root", "");
$h = password_hash("123456", PASSWORD_BCRYPT);
$db->prepare("UPDATE employees SET password_hash = ? WHERE id = 'E002'")->execute([$h]);

// Cleanup test task
if ($createdTaskId) {
    make_http_request(TEST_BASE_URL . "/tasks.php?id={$createdTaskId}", 'DELETE', null, $adminCookies, ['X-CSRF-Token' => $adminCsrf]);
}

echo "\n=== ALL VERIFICATION TESTS FINISHED ===\n";
$passCount = count(array_filter($results, fn($r) => $r['status'] === 'PASS'));
$failCount = count(array_filter($results, fn($r) => $r['status'] === 'FAIL'));
echo "Total Passed: {$passCount} / " . count($results) . "\n";
echo "Total Failed: {$failCount}\n";
