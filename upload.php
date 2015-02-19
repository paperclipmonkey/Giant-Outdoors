<?php
    // Saving data from form in to text file in JSON format
    // adds form data into an array

    $name = 'submitted-'.date('m-d-Y_h:i:sa');

    //Lets see if we have a file
    $fcheck = getimagesize($_FILES["fileUpload"]["tmp_name"]);
    if($check !== false) {//File uploading happening and it's an image
      $imageFileType = pathinfo($_FILES["fileUpload"]["tmp_name"],PATHINFO_EXTENSION);
      $target_file = "uploads/" . $name .'.' . $imageFileType;
      move_uploaded_file($_FILES["fileUpload"]["tmp_name"], $target_file);
    }

    $formdata = array();

    foreach($_POST as $key => $value){
      $formdata[$key] = $value;//copy data from $_POST to new array
    }

    // encodes the array into a string in JSON format (JSON_PRETTY_PRINT - uses whitespace in json-string, for human readable)
    $jsondata = json_encode($_POST, JSON_PRETTY_PRINT);

    // saves the json string in "formdata.txt" (in "dirdata" folder)
    // outputs error message if data cannot be saved
    if(file_put_contents('uploads/'.$name.'.json', $jsondata)){
      echo "Thankyou for adding your data to the map. We'll be in contact soon";
    } else {
      http_response_code(500);
      echo 'Unable to save data in ' . $name . ".json\n";
    }
?>