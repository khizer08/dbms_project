<?php
// Database configuration
$servername = "localhost";
$username = "root";
$password = "Surjo@14";
$dbname = "ironpulse_gym";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . $conn->connect_error
    ]));
}

// Set headers for JSON response
header('Content-Type: application/json');

// Initialize response array
$response = [
    'success' => false,
    'message' => '',
    'errors' => []
];

// Only process POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize and validate input data
    $member_name = trim($_POST['member_name'] ?? '');
    $member_age = intval($_POST['member_age'] ?? 0);
    $member_gender = trim($_POST['member_gender'] ?? '');
    $member_phone = trim($_POST['member_phone'] ?? '');
    $member_email = trim($_POST['member_email'] ?? '');
    $membership_plan = trim($_POST['membership_plan'] ?? '');
    $assigned_trainer = !empty($_POST['assigned_trainer']) ? intval($_POST['assigned_trainer']) : null;

    // Validate inputs (same as before)
    // ... [keep the same validation code from previous version] ...

    // Only proceed if validation passed
    if (empty($response['errors'])) {
        try {
            // Generate unique member ID (IPG = IronPulse Gym)
            $member_prefix = 'IPG';
            $random_number = mt_rand(10000, 99999);
            $member_id = $member_prefix . date('Ym') . $random_number;

            // Calculate membership dates based on plan
            $start_date = date('Y-m-d');
            $end_date = date('Y-m-d');
            
            switch ($membership_plan) {
                case 'Monthly':
                    $end_date = date('Y-m-d', strtotime('+1 month'));
                    break;
                case 'Quarterly':
                    $end_date = date('Y-m-d', strtotime('+3 months'));
                    break;
                case 'Yearly':
                    $end_date = date('Y-m-d', strtotime('+1 year'));
                    break;
            }

            // Begin transaction
            $conn->begin_transaction();

            // Prepare SQL statement
            $stmt = $conn->prepare("INSERT INTO members 
                (member_id, name, age, gender, phone, email, membership_plan, 
                assigned_trainer_id, join_date, membership_start, membership_end) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)");

            // Bind parameters
            $stmt->bind_param("ssissssiss", 
                $member_id,
                $member_name, 
                $member_age, 
                $member_gender, 
                $member_phone, 
                $member_email, 
                $membership_plan, 
                $assigned_trainer,
                $start_date,
                $end_date);

            // Execute query
            if ($stmt->execute()) {
                // Create a membership record in a separate table (recommended)
                $member_db_id = $stmt->insert_id;
                
                $stmt2 = $conn->prepare("INSERT INTO membership_history 
                    (member_id, plan_type, start_date, end_date, is_active) 
                    VALUES (?, ?, ?, ?, 1)");
                $stmt2->bind_param("isss", $member_db_id, $membership_plan, $start_date, $end_date);
                $stmt2->execute();
                $stmt2->close();

                $conn->commit();
                
                $response['success'] = true;
                $response['message'] = 'Member added successfully!';
                $response['member_id'] = $member_id;
                $response['membership_end'] = $end_date;
            } else {
                $conn->rollback();
                $response['message'] = 'Error adding member: ' . $stmt->error;
            }

            $stmt->close();
        } catch (Exception $e) {
            $conn->rollback();
            $response['message'] = 'Database error: ' . $e->getMessage();
        }
    } else {
        $response['message'] = 'Please correct the errors in the form';
    }
} else {
    $response['message'] = 'Invalid request method';
}

// Close connection
$conn->close();

// Return JSON response
echo json_encode($response);
?>