<?php
include_once('./db.php');
$db = new db();
$conn = $db->connect();
// add input output to table trainingdata
if(isset($_POST['input']) && isset($_POST['output'])){
    $input = $_POST['input'];
    $output = $_POST['output'];
    $sql = "INSERT INTO trainingdata (input, output) VALUES (:input, :output)";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':input', $input);
    $stmt->bindParam(':output', $output);
    $stmt->execute();
    echo json_encode(["status"=>"success", "data"=>["msg"=>"Data added successfully"]]);
    exit();
}
?>