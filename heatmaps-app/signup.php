<?php
$conn = new mysqli("localhost", "root", "", "heatmaps_db");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $email = $_POST["email"];
  $password = password_hash($_POST["password"], PASSWORD_DEFAULT);

  $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
  $check->bind_param("s", $email);
  $check->execute();
  $check->store_result();

  if ($check->num_rows > 0) {
    echo "<script>alert('❌ Το email χρησιμοποιείται ήδη. Δοκιμάστε άλλο.'); window.location.href='signup.html';</script>";
    exit;
  }

  $stmt = $conn->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
  $stmt->bind_param("ss", $email, $password);
  $stmt->execute();

  echo "<script>alert('✅ Εγγραφή επιτυχής! Μπορείς να συνδεθείς.'); window.location.href='login.html';</script>";
}
?>
