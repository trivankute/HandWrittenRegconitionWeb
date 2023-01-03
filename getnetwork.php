<?php
include_once('./db.php');
$db = new db();
$conn = $db->connect();
// get data from network
$sql = "SELECT * FROM network";
$result = $conn->query($sql);
$data = $result->fetch(PDO::FETCH_ASSOC);
if($result && $result->rowCount()){
    echo json_encode($data['data']);
    exit();
}
else
{
    echo json_encode(["status"=>"error", "data"=>["msg"=>"No data found"]]);
    exit();
}

?>