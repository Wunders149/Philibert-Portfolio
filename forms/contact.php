<?php

  $receiving_email_address = 'razafimahefaphilibert7@gmail.com';

  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name    = strip_tags(trim($_POST['name']));
    $email   = filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL);
    $subject = strip_tags(trim($_POST['subject']));
    $message = strip_tags(trim($_POST['message']));

    if (!$name || !$email || !$subject || !$message) {
      echo 'Please fill in all fields correctly.';
      exit;
    }

    $email_subject = "Portfolio Contact: $subject";
    $email_body    = "Name: $name\n";
    $email_body   .= "Email: $email\n\n";
    $email_body   .= "Message:\n$message\n";

    $headers  = "From: $name <$email>\r\n";
    $headers .= "Reply-To: $email\r\n";

    if (mail($receiving_email_address, $email_subject, $email_body, $headers)) {
      echo 'OK';
    } else {
      echo 'Sorry, the message could not be sent. Please try again later.';
    }
  } else {
    echo 'Invalid request method.';
  }
?>
