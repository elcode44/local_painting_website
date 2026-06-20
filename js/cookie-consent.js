(function () {
  var STORAGE_KEY = 'akl-cookie-consent';

  function getConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {
      /* storage blocked — proceed without persisting */
    }
  }

  function loadAnalytics() {
    if (document.querySelector('script[data-analytics-loader]')) return;
    var script = document.createElement('script');
    script.src = 'js/analytics.js';
    script.defer = true;
    script.setAttribute('data-analytics-loader', 'true');
    document.body.appendChild(script);
  }

  function hideBanner(banner) {
    if (banner) banner.hidden = true;
  }

  function showBanner(banner) {
    if (banner) banner.hidden = false;
  }

  function createBanner() {
    if (document.getElementById('cookieConsent')) return document.getElementById('cookieConsent');

    var banner = document.createElement('div');
    banner.id = 'cookieConsent';
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML =
      '<div class="cookie-banner-inner">' +
        '<p>We use essential site features and optional analytics cookies to understand traffic. ' +
        'See our <a href="privacy.html">Privacy Policy</a> for details.</p>' +
        '<div class="cookie-banner-actions">' +
          '<button type="button" class="btn btn-secondary" data-cookie-reject>Reject Analytics</button>' +
          '<button type="button" class="btn btn-primary" data-cookie-accept>Accept Analytics</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);

    banner.querySelector('[data-cookie-accept]').addEventListener('click', function () {
      setConsent('accepted');
      loadAnalytics();
      hideBanner(banner);
    });

    banner.querySelector('[data-cookie-reject]').addEventListener('click', function () {
      setConsent('rejected');
      hideBanner(banner);
    });

    return banner;
  }

  function init() {
    var consent = getConsent();
    var banner = createBanner();

    if (consent === 'accepted') {
      loadAnalytics();
      hideBanner(banner);
    } else if (consent === 'rejected') {
      hideBanner(banner);
    } else {
      showBanner(banner);
    }

    document.querySelectorAll('[data-cookie-settings]').forEach(function (button) {
      button.addEventListener('click', function () {
        showBanner(banner);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
