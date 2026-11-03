<?php
// ==========================================================
// Thynk Digital Solution - Employees API Endpoint
// Protected: Authentication, CSRF, and Privilege Enforcement
// ==========================================================

require_once __DIR__ . '/config.php';

$user   = require_auth();
$db     = get_db();
$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;
$isExec = is_admin_or_exec($user);
$userId = $user['id'];

// ----------------------------------------------------------
// GET: List or Retrieve Employees
// ----------------------------------------------------------
if ($method === 'GET') {
    if ($id) {
        if (!$isExec && $id !== $userId) {
            json_error("Access denied. You can only view your own profile.", 403);
        }
        $stmt = $db->prepare("SELECT id, name, phone, email, username, department, designation, role, joining_date AS joiningDate, salary, manager_id AS managerId, status, photo, permissions FROM employees WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $emp = $stmt->fetch();
        if (!$emp) json_error("Employee not found.", 404);
        $emp['salary'] = (float)$emp['salary'];
        $emp['permissions'] = !empty($emp['permissions']) && is_string($emp['permissions']) ? (json_decode($emp['permissions'], true) ?: []) : [];
        json_response(['success' => true, 'data' => $emp]);
    } else {
        if (!$isExec) {
            // Normal employee only gets their own record
            $stmt = $db->prepare("SELECT id, name, phone, email, username, department, designation, role, joining_date AS joiningDate, salary, manager_id AS managerId, status, photo, permissions FROM employees WHERE id = ?");
            $stmt->execute([$userId]);
        } else {
            $stmt = $db->query("SELECT id, name, phone, email, username, department, designation, role, joining_date AS joiningDate, salary, manager_id AS managerId, status, photo, permissions FROM employees ORDER BY id ASC");
        }
        $raw = $stmt->fetchAll();
        $employees = array_map(function($e) {
            $e['salary'] = (float)$e['salary'];
            $e['permissions'] = !empty($e['permissions']) && is_string($e['permissions']) ? (json_decode($e['permissions'], true) ?: []) : [];
            return $e;
        }, $raw);
        json_response(['success' => true, 'data' => $employees]);
    }
}

// ----------------------------------------------------------
// POST: Create Employee (Admin Only)
// ----------------------------------------------------------
if ($method === 'POST') {
    require_admin_or_exec($user);
    verify_csrf();
    $input = get_input();

    $empId = trim($input['id'] ?? '');
    if (empty($empId)) {
        $stmt = $db->query("SELECT id FROM employees WHERE id LIKE 'E%'");
        $rows = $stmt->fetchAll();
        $maxNum = 0;
        foreach ($rows as $r) {
            if (preg_match('/E(\d+)/', $r['id'], $m)) {
                $num = (int)$m[1];
                if ($num > $maxNum) $maxNum = $num;
            }
        }
        $empId = 'E' . str_pad($maxNum + 1, 3, '0', STR_PAD_LEFT);
    }

    $name  = trim($input['name'] ?? '');
    if (empty($name)) {
        $name = "Employee $empId";
    }
    $email = trim($input['email'] ?? '');
    if (empty($email)) {
        $email = strtolower($empId) . '@thynkdigital.in';
    }

    $rawPass = !empty($input['password']) ? $input['password'] : '123456';
    $passwordHash = password_hash($rawPass, PASSWORD_BCRYPT, ['cost' => 12]);

    $perms = !empty($input['permissions']) ? (is_array($input['permissions']) ? json_encode($input['permissions']) : $input['permissions']) : json_encode(['crm'=>false,'hrms'=>false,'accounts'=>false,'marketing'=>false,'admin'=>false]);

    $stmt = $db->prepare("
        INSERT INTO employees (id, name, phone, email, username, password_hash, department, designation, role, joining_date, salary, manager_id, status, photo, permissions)
        VALUES (:id, :name, :phone, :email, :username, :passwordHash, :department, :designation, :role, :joiningDate, :salary, :managerId, :status, :photo, :permissions)
    ");

    $stmt->execute([
        ':id'           => $empId,
        ':name'         => $name,
        ':phone'        => $input['phone'] ?? '',
        ':email'        => $email,
        ':username'     => $input['username'] ?? explode('@', $email)[0],
        ':passwordHash' => $passwordHash,
        ':department'   => $input['department'] ?? 'Development',
        ':designation'  => $input['designation'] ?? 'Employee',
        ':role'         => $input['role'] ?? ($input['designation'] ?? 'Employee'),
        ':joiningDate'  => $input['joiningDate'] ?? ($input['joining_date'] ?? date('Y-m-d')),
        ':salary'       => (float)($input['salary'] ?? 0),
        ':managerId'    => $input['managerId'] ?? ($input['manager_id'] ?? 'Admin'),
        ':status'       => $input['status'] ?? 'Active',
        ':photo'        => $input['photo'] ?? 'https://randomuser.me/api/portraits/men/32.jpg',
        ':permissions'  => $perms
    ]);

    // Create default leave allocation
    $allocStmt = $db->prepare("INSERT IGNORE INTO leave_allocations (employee_id, allocation_type, allowance) VALUES (?, 'monthly', 4)");
    $allocStmt->execute([$empId]);

    json_response(['success' => true, 'message' => 'Employee created successfully.', 'id' => $empId], 201);
}

// ----------------------------------------------------------
// PUT: Update Employee
// ----------------------------------------------------------
if ($method === 'PUT') {
    verify_csrf();
    $input = get_input();
    $targetId = $id ?? ($input['id'] ?? null);

    if (!$targetId) {
        json_error("Employee ID is required for update.", 400);
    }

    $chkStmt = $db->prepare("SELECT * FROM employees WHERE id = ? LIMIT 1");
    $chkStmt->execute([$targetId]);
    $existing = $chkStmt->fetch();
    if (!$existing) {
        json_error("Employee not found.", 404);
    }

    if (!$isExec) {
        // Normal employee can ONLY update their own contact info/photo
        if ($targetId !== $userId) {
            json_error("Access denied. You cannot modify another employee's profile.", 403);
        }

        $stmt = $db->prepare("
            UPDATE employees SET
                phone = COALESCE(:phone, phone),
                photo = COALESCE(:photo, photo)
            WHERE id = :id
        ");
        $stmt->execute([
            ':id'    => $targetId,
            ':phone' => $input['phone'] ?? null,
            ':photo' => $input['photo'] ?? null
        ]);

        json_response(['success' => true, 'message' => 'Profile updated successfully.']);
    }

    // Admin / Executive update: full privileges
    $perms = null;
    if (isset($input['permissions'])) {
        $perms = is_array($input['permissions']) ? json_encode($input['permissions']) : $input['permissions'];
    }

    $stmt = $db->prepare("
        UPDATE employees SET
            name = COALESCE(:name, name),
            phone = COALESCE(:phone, phone),
            email = COALESCE(:email, email),
            username = COALESCE(:username, username),
            department = COALESCE(:department, department),
            designation = COALESCE(:designation, designation),
            role = COALESCE(:role, role),
            joining_date = COALESCE(:joiningDate, joining_date),
            salary = COALESCE(:salary, salary),
            manager_id = COALESCE(:managerId, manager_id),
            status = COALESCE(:status, status),
            photo = COALESCE(:photo, photo),
            permissions = COALESCE(:permissions, permissions)
        WHERE id = :id
    ");

    $stmt->execute([
        ':id'          => $targetId,
        ':name'        => $input['name'] ?? null,
        ':phone'       => $input['phone'] ?? null,
        ':email'       => $input['email'] ?? null,
        ':username'    => $input['username'] ?? null,
        ':department'  => $input['department'] ?? null,
        ':designation' => $input['designation'] ?? null,
        ':role'        => $input['role'] ?? null,
        ':joiningDate' => $input['joiningDate'] ?? ($input['joining_date'] ?? null),
        ':salary'      => isset($input['salary']) ? (float)$input['salary'] : null,
        ':managerId'   => $input['managerId'] ?? ($input['manager_id'] ?? null),
        ':status'      => $input['status'] ?? null,
        ':photo'       => $input['photo'] ?? null,
        ':permissions' => $perms
    ]);

    json_response(['success' => true, 'message' => 'Employee updated successfully.']);
}

// ----------------------------------------------------------
// DELETE: Delete Employee (Admin Only)
// ----------------------------------------------------------
if ($method === 'DELETE') {
    require_admin_or_exec($user);
    verify_csrf();

    $targetId = $id ?? ($_GET['id'] ?? null);
    if (!$targetId) {
        json_error("Employee ID is required for deletion.", 400);
    }
    if ($targetId === 'E001' || $targetId === $userId) {
        json_error("Cannot delete primary administrator or current active user.", 400);
    }

    $stmt = $db->prepare("DELETE FROM employees WHERE id = ?");
    $stmt->execute([$targetId]);

    json_response(['success' => true, 'message' => 'Employee deleted successfully.']);
}

json_error("Unsupported method.", 405);
