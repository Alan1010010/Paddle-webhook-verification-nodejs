<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <h1>Hello</h1>
    <?php
      // Your Paddle 'Public Key'
      $public_key_string = '-----BEGIN PUBLIC KEY-----
    f70b241cfe9694d388da5af21d374b4ba8d92bc189681b2ebd
    -----END PUBLIC KEY-----';

      $public_key = openssl_get_publickey($public_key_string);

      // Get the p_signature parameter & base64 decode it.
      $signature = base64_decode($_POST['p_signature']);

      // Get the fields sent in the request, and remove the p_signature parameter
      $fields = $_POST;
      unset($fields['p_signature']);

      // ksort() and serialize the fields
      ksort($fields);
      foreach($fields as $k => $v) {
    	  if(!in_array(gettype($v), array('object', 'array'))) {
    		  $fields[$k] = "$v";
    	  }
      }
      $data = serialize($fields);

      // Verify the signature
      $verification = openssl_verify($data, $signature, $public_key, OPENSSL_ALGO_SHA1);

      if($verification == 1) {
    	  echo 'Yay! Signature is valid!';
      } else {
    	  echo 'The signature is invalid!';
      }
    ?>

    <script type="text/javascript" src="node-server.js">

    </script>
  </body>
</html>
