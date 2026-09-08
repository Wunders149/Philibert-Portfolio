/**
 * Lightweight privacy-focused analytics
 * Tracks page views and interactions without cookies
 * Uses localStorage to store anonymous session data
 */
(function() {
  "use strict";

  const ANALYTICS_KEY = 'portfolio_analytics';

  function getAnalyticsData() {
    try {
      return JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '{"views": 0, "sessions": 0, "lastVisit": null, "pageViews": {}}');
    } catch (e) {
      return { views: 0, sessions: 0, lastVisit: null, pageViews: {} };
    }
  }

  function saveAnalyticsData(data) {
    try {
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data));
    } catch (e) {
      // Storage full or unavailable - ignore
    }
  }

  function trackPageView() {
    const data = getAnalyticsData();
    const now = Date.now();
    const today = new Date().toISOString().slice(0, 10);

    // Count unique session per day
    if (!data.lastVisit || new Date(data.lastVisit).toISOString().slice(0, 10) !== today) {
      data.sessions++;
    }

    data.views++;
    data.lastVisit = now;

    const path = window.location.pathname;
    data.pageViews[path] = (data.pageViews[path] || 0) + 1;

    saveAnalyticsData(data);
  }

  function trackEvent(eventName, eventCategory) {
    const data = getAnalyticsData();
    if (!data.events) data.events = {};

    const key = `${eventCategory}:${eventName}`;
    data.events[key] = (data.events[key] || 0) + 1;

    saveAnalyticsData(data);
  }

  // Track page view
  trackPageView();

  // Track form submissions
  document.addEventListener('submit', function(e) {
    if (e.target.classList.contains('emailjs-form')) {
      trackEvent('form_submit', 'contact');
    }
  });

  // Track portfolio filter usage
  document.addEventListener('click', function(e) {
    const filterEl = e.target.closest('.isotope-filters li');
    if (filterEl) {
      trackEvent('filter', filterEl.textContent.trim());
    }

    // Track outbound social links
    const socialLink = e.target.closest('.social-links a');
    if (socialLink) {
      trackEvent('social_click', socialLink.getAttribute('aria-label') || 'social');
    }
  });

  // Expose for debugging (removed in production builds)
  window.__analytics = { getData: getAnalyticsData, trackEvent: trackEvent };
})();
