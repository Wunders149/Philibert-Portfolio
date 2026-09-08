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
  const isConfigured = config.serviceID && config.templateID && config.publicKey &&
    config.serviceID !== 'YOUR_SERVICE_ID' &&
    config.templateID !== 'YOUR_TEMPLATE_ID' &&
    config.publicKey !== 'YOUR_PUBLIC_KEY';

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

  function checkRateLimit() {
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

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Honeypot spam check
    const honeypot = form.querySelector('input[name="website"]');
    if (honeypot && honeypot.value) {
      // Silently reject bots without showing an error
      form.reset();
      return;
    }

    // Rate limit check
    const minutesLeft = checkRateLimit();
    if (minutesLeft > 0) {
      displayError('Please wait about ' + minutesLeft + ' minute(s) before sending another message.');
      return;
    }

    // EmailJS not configured yet
    if (!isConfigured) {
      displayError('The contact form is not configured yet. Please set your EmailJS keys in assets/js/emailjs-config.js.');
      return;
    }

    // Native form validation (browser handles required/minlength/etc.)
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    hide(errorEl);
    hide(sentEl);
    show(loadingEl);

    emailjs.sendForm(config.serviceID, config.templateID, form, {
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
      }
      displayError(message);
    });
  });
})();