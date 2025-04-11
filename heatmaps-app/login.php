<?php
session_start(); // ΠΡΕΠΕΙ να είναι στην αρχή!
require('config.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $stmt = $conn->prepare("SELECT * FROM users WHERE email=?");
    $stmt->bind_param("s", $email);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();

        if (password_verify($password, $user['password'])) {
            $_SESSION["user"] = $email; // αποθηκεύουμε ποιος χρήστης συνδέθηκε
            header("Location: maps.php"); // προστατευμένη σελίδα
            exit;
        } else {
            echo "<script>alert('❌ Λάθος κωδικός!'); window.location='login.html';</script>";
        }
    } else {
        echo "<script>alert('❌ Δεν βρέθηκε χρήστης με αυτό το email!'); window.location='login.html';</script>";
    }

    $stmt->close();
    $conn->close();
}
?>
