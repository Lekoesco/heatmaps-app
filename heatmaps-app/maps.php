<?php
session_start();
if (!isset($_SESSION["user"])) {
  header("Location: login.html");
  exit;
}
?>
<!DOCTYPE html>
<html lang="el">
<head>
  <meta charset="UTF-8" />
  <title>Heatmaps App</title>
  <link rel="stylesheet" href="assets/css/styles.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body class="dark-mode">

  <button id="burger-menu" onclick="toggleSidebar()">☰</button>

  <div id="map"></div>


<div id="search-box">
    <input type="text" id="autocomplete" placeholder="🔍 Αναζήτηση προορισμού...">
  </div>
  
  <!-- Πλευρικό μενού -->
  <div class="sidebar" id="sidebar">
    <button id="traffic-b"><i class="fa-solid fa-traffic-light"></i> Εναλλαγή Κυκλοφορίας</button>
    <select id="travel-mode">
      <option value="DRIVE">🚗 Αυτοκίνητο</option>
      <option value="WALK">🚶‍♂️ Περπάτημα</option>
    </select>
    <button onclick="calculateRoute()"><i class="fa-solid fa-route"></i> Υπολογισμός Διαδρομής</button>
    <button id="reset-map"><i class="fa-solid fa-arrows-rotate"></i> Επαναφορά Χάρτη</button>
    <button onclick="window.location.href='logout.php'">
  <i class="fa-solid fa-sign-out-alt"></i> Αποσύνδεση
</button>

  </div>

  <!-- Καιρός -->
  <div id="weather-panel" class="floating-weather"></div>

  <script src="assets/js/scripts.js"></script>
  <script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAUJt1EB3nSL3D9FUXk5S0eeSTdSZPrMvY&libraries=geometry,places&callback=initMap">
  </script>

</body>
</html>
