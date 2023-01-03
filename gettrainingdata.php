<?php
include_once('./db.php');
$db = new db();
$conn = $db->connect();
// get all training data
$sql = "SELECT * FROM trainingdata";
$stmt = $conn->prepare($sql);
$stmt->execute();
$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($result);
exit();

?>