<?php
session_start();
session_unset();  // καθαρίζει όλες τις μεταβλητές session
session_destroy(); // καταστρέφει τη session

header("Location: login.html"); // επιστροφή στη σελίδα login
exit;
?>
