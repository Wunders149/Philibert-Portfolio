<?php

  $receiving_email_address = 'razafimahefaphilibert7@gmail.com';

  // Rate limiting (simple file-based)
  $rate_limit_file = sys_get_temp_dir() . '/contact_rate_' . md5($_SERVER['REMOTE_ADDR'] ?? 'unknown');
  $rate_limit_duration = 300; // 5 minutes

  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Honeypot check - if filled, it's a bot
    if (!empty($_POST['website'])) {
      echo 'Sorry, your submission was rejected.';
      exit;
    }

    // Rate limiting check
    if (file_exists($rate_limit_file)) {
      $last_submission = (int) file_get_contents($rate_limit_file);
      if (time() - $last_submission < $rate_limit_duration) {
        echo 'Please wait a few minutes before sending another message.';
        exit;
      }
    }

    $name    = strip_tags(trim($_POST['name']));
    $email   = filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL);
    $subject = strip_tags(trim($_POST['subject']));
    $message = strip_tags(trim($_POST['message']));
    $privacy = isset($_POST['privacy']);

    // Validation
    $errors = [];
    
    if (!$name || strlen($name) < 2 || strlen($name) > 100) {
      $errors[] = 'Please enter a valid name (2-100 characters).';
    }
    
    if (!$email) {
      $errors[] = 'Please enter a valid email address.';
    }
    
    if (!$subject || strlen($subject) < 3 || strlen($subject) > 200) {
      $errors[] = 'Please enter a valid subject (3-200 characters).';
    }
    
    if (!$message || strlen($message) < 10 || strlen($message) > 2000) {
      $errors[] = 'Please enter a valid message (10-2000 characters).';
    }
    
    if (!$privacy) {
      $errors[] = 'You must agree to the privacy policy.';
    }

    // Check for common spam patterns
    $spam_patterns = [
      '/\b(viagra|cialis|casino|lottery|winner|congratulations|click here|act now)\b/i',
      '/https?:\/\/[^\s]+/i', // URLs in message
      '/<script\b[^>]*>.*?<\/script>/is', // Script tags
    ];
    
    foreach ($spam_patterns as $pattern) {
      if (preg_match($pattern, $message) || preg_match($pattern, $name)) {
        $errors[] = 'Your message appears to be spam.';
        break;
      }
    }

    if (!empty($errors)) {
      echo implode(' ', $errors);
      exit;
    }

    // Sanitize email headers to prevent injection
    $name = str_replace(["\r", "\n"], '', $name);
    $subject = str_replace(["\r", "\n"], '', $subject);

    $email_subject = "Portfolio Contact: $subject";
    $email_body    = "Name: $name\n";
    $email_body   .= "Email: $email\n\n";
    $email_body   .= "Message:\n$message\n";

    $headers  = "From: Portfolio Contact Form <$receiving_email_address>\r\n";
    $headers .= "Reply-To: $name <$email>\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    if (mail($receiving_email_address, $email_subject, $email_body, $headers)) {
      // Update rate limit file
      file_put_contents($rate_limit_file, time());
      echo 'OK';
    } else {
      echo 'Sorry, the message could not be sent. Please try again later.';
    }
  } else {
    echo 'Invalid request method.';
  }
?>
