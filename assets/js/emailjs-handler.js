/**
 * EmailJS contact form handler
 * Replaces the PHP backend with the client-side EmailJS SDK
 * Requires: assets/vendor/emailjs/email.min.js (loaded before this file)
 * Requires: assets/js/emailjs-config.js (loaded before this file)
 */
(function() {
  "use strict";

  const form = document.querySelector('#contact-form');
  if (!form) return;

  const config = window.EMAILJS_CONFIG || {};

  // A value counts as a placeholder (i.e. not yet configured) when it is
  // empty or matches a generic "fill this in" token such as YOUR_SERVICE_ID,
  // placeholder_contact, <your-key>, etc. This avoids hard-coding specific
  // strings into the guard, which would break if a real id ever matched one.
  const PLACEHOLDER_PATTERN = /^(your_|placeholder_|<[^>]+>)/i;

  function isPlaceholder(value) {
    if (value === undefined || value === null) return true;
    const str = String(value).trim();
    return str === '' || PLACEHOLDER_PATTERN.test(str);
  }

  const isConfigured =
    !isPlaceholder(config.serviceID) &&
    !isPlaceholder(config.templateID) &&
    !isPlaceholder(config.publicKey);

  const loadingEl = form.querySelector('.loading');
  const errorEl = form.querySelector('.error-message');
  const sentEl = form.querySelector('.sent-message');

  function show(el) { if (el) el.classList.add('d-block'); }
  function hide(el) { if (el) el.classList.remove('d-block'); }

  function displayError(message) {
    hide(loadingEl);
    hide(sentEl);
    if (errorEl) {
      errorEl.textContent = message;
      show(errorEl);
    }
  }

  // Client-side rate limiting (replaces server-side PHP rate limit)
  const RATE_LIMIT_KEY = 'contact_rate_limit';
  const RATE_LIMIT_MS = 5 * 60 * 1000; // 5 minutes

  function minutesUntilAllowed() {
    try {
      const last = parseInt(localStorage.getItem(RATE_LIMIT_KEY) || '0', 10);
      if (last && (Date.now() - last) < RATE_LIMIT_MS) {
        return Math.ceil((RATE_LIMIT_MS - (Date.now() - last)) / 60000);
      }
    } catch (e) { /* storage unavailable - allow */ }
    return 0;
  }

  function applyRateLimit() {
    try { localStorage.setItem(RATE_LIMIT_KEY, String(Date.now())); } catch (e) { /* ignore */ }
  }

  // Honeypot field: bots fill it in, humans never see it. Returns true when a
  // submission should be silently discarded.
  function isHoneypotFilled() {
    const honeypot = form.querySelector('input[name="website"]');
    return !!honeypot && honeypot.value !== '';
  }

  function buildParams() {
    const formData = new FormData(form);

    // Field aliases (name, time) are added for compatibility with common
    // EmailJS template variables.
    const params = {
      subject: formData.get('subject') || '',
      from_name: formData.get('from_name') || '',
      name: formData.get('from_name') || '',
      reply_to: formData.get('reply_to') || '',
      message: formData.get('message') || '',
      time: new Date().toLocaleString()
    };

    // Forward any other non-empty form fields to support custom template
    // variables. The honeypot field is always excluded.
    formData.forEach(function(value, key) {
      if (key === 'website') return;
      if (value !== '' && !(key in params)) params[key] = value;
    });

    return params;
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Honeypot spam check - silently reject bots without showing an error.
    if (isHoneypotFilled()) {
      form.reset();
      return;
    }

    // Rate limit check.
    const minutesLeft = minutesUntilAllowed();
    if (minutesLeft > 0) {
      displayError('Please wait about ' + minutesLeft + ' minute(s) before sending another message.');
      return;
    }

    // EmailJS not configured yet.
    if (!isConfigured) {
      displayError('The contact form is not configured yet. Please set your EmailJS keys in assets/js/emailjs-config.js.');
      return;
    }

    // Native form validation (browser handles required/minlength/etc.).
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    hide(errorEl);
    hide(sentEl);
    show(loadingEl);

    emailjs.send(config.serviceID, config.templateID, buildParams(), {
      publicKey: config.publicKey
    })
    .then(function() {
      hide(loadingEl);
      show(sentEl);
      applyRateLimit();
      form.reset();
    })
    .catch(function(error) {
      console.error('EmailJS error:', error);
      let message = 'Sorry, the message could not be sent. Please try again later.';
      if (error && error.status === 429) {
        message = 'Too many messages sent recently. Please try again later.';
      } else if (typeof error === 'string') {
        message = error;
      } else if (error && error.text) {
        message = error.text;
      }
      displayError(message);
    });
  });
})();
