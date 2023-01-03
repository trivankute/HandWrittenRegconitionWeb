<?php
include_once('./db.php');
$db = new db();
$conn = $db->connect();
if(isset($_POST['network'])){
    $network = $_POST['network'];
    // check if network already exists
    $sql = "SELECT * FROM network";
    $result = $conn->query($sql);
    $data = $result->fetch(PDO::FETCH_ASSOC);
    if($result && $result->rowCount()){
        // update data equal to $data
        $sql = "UPDATE network SET data='$network' WHERE data='".$data['data']."'";
        $conn->query($sql);
        exit();
    }
    else
    {
        $sql = "INSERT INTO network (data) VALUES ('$network')";
        $conn->query($sql);
    }
}
?>