(function () {
  var config = window.SITE_CONFIG || {};
  var measurementId = config.googleAnalyticsId;
  if (!measurementId) return;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });

  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
  script.onload = function () {
    gtag('js', new Date());
    gtag('config', measurementId, { anonymize_ip: true });
    gtag('consent', 'update', { analytics_storage: 'granted' });
  };
  document.head.appendChild(script);
})();
