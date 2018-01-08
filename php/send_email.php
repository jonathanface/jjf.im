<?php

$to = 'me@jonathanface.com';

if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
} else {
  $subject = 'Message from jjf.im contact form';
  $message = 'Message received on ' . date('l jS \of F Y h:i:s A') . ' from ' . $_POST['email'] . "\n\n";
  $message .= 'Full text is as followers:' . "\n\n";
  $message .= $_POST['message'];
  $headers = 'From: ' . $_POST['email'] . "\r\n" .
  'Reply-To: ' . $_POST['email'] . "\r\n" .
  'X-Mailer: PHP/' . phpversion() . "\r\n" . 
  'Content-type: text/plain; charset=iso-8859-1' . "\r\n";

  if (mail($to, $subject, $message, $headers)) {
    http_response_code(200);
  } else {
    http_response_code(500);
  }
}

?>