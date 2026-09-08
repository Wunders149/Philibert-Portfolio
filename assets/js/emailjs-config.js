/**
 * EmailJS configuration
 *
 * These are the real, working credentials from your EmailJS dashboard
 * (https://dashboard.emailjs.com):
 *  - Email Services -> your service's ID   (service_xxxxxxxx)
 *  - Email Templates -> your template's ID (template_xxxxxxxx)
 *  - Account -> General -> Public Key
 *
 * Important:
 *  - Never commit a real public key if this repo is public and you care about
 *    abuse. For production, inject the public key at build time or via an
 *    environment variable instead of hard-coding it here.
 *  - The contact form handler treats values matching "YOUR_*", "placeholder_*"
 *    or "<...>" as still-being-placeholders and will refuse to send until all
 *    three real values are present here.
 */
window.EMAILJS_CONFIG = {
  serviceID: 'service_z90mxjv',
  templateID: 'template_6wl57ka',
  publicKey: 'mFSDKN8un0X9Pvtm7'
};
