<?php
include_once('./db.php');
$db = new db();
$conn = $db->connect();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <title>trivan AI</title>
</head>
<body>
    <section class="vh-100">
        <div class="container h-100 d-flex flex-column align-items-center justify-content-center">
            <h4 id="text" style="color:green; display:none;">Add successfully</h4>
            <h4 id="text" style="color:green;">You must be patient, only 200 training datas</h4>
            <h4 id="text" style="">Try it few times if its not correct</h4>
            <canvas id="canvas"></canvas>
            <div class="d-flex mt-2 align-items-center justify-content-center">
                <div class="form-check ms-3">
                  <input class="form-check-input" type="checkbox" value="" id="draw">
                  <label class="form-check-label" for="draw">
                    Draw
                  </label>
                </div>
                <button class="btn btn-success ms-3" id="checkButton" >Check</button>
                <button class="btn btn-success ms-3" id="addButton" disabled>Add</button>
                  <button class="btn btn-success ms-3" id="resetButton">Reset</button>
            </div>
        </div>
    </section>
    <script src="index.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
</body>
</html>