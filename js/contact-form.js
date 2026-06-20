(function () {
  var form = document.getElementById('contactForm');
  if (!form) return;

  var statusEl = document.getElementById('formStatus');
  var submitBtn = form.querySelector('button[type="submit"]');

  function setStatus(message, type) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = 'form-status form-status--' + type;
    statusEl.hidden = !message;
  }

  function trimField(value, maxLength) {
    return String(value || '').trim().slice(0, maxLength);
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    setStatus('', '');

    var honeypot = form.querySelector('[name="_gotcha"]');
    if (honeypot && honeypot.value) {
      setStatus('Thanks — your message was sent.', 'success');
      form.reset();
      return;
    }

    var consent = form.querySelector('#privacyConsent');
    if (consent && !consent.checked) {
      setStatus('Please agree to the Privacy Policy before sending.', 'error');
      return;
    }

    var config = window.SITE_CONFIG || {};
    var endpoint = config.formspreeEndpoint;

    if (!endpoint) {
      setStatus(
        'Online form delivery is not configured yet. Please call (610) 446-7233 or email ' + (config.contactEmail || 'us') + '.',
        'error'
      );
      return;
    }

    var payload = {
      name: trimField(form.name.value, 100),
      phone: trimField(form.phone.value, 30),
      email: trimField(form.email.value, 254),
      service: trimField(form.service.value, 80),
      message: trimField(form.message.value, 2000),
      _subject: 'New estimate request — ' + (config.businessName || 'Website'),
    };

    if (!payload.name || !payload.email || !payload.message) {
      setStatus('Please fill in all required fields.', 'error');
      return;
    }

    submitBtn.disabled = true;
    setStatus('Sending…', 'info');

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(function (response) {
        if (!response.ok) throw new Error('Request failed');
        setStatus('Message sent. We will get back to you soon.', 'success');
        form.reset();
      })
      .catch(function () {
        setStatus('Something went wrong. Please call (610) 446-7233 or email us directly.', 'error');
      })
      .finally(function () {
        submitBtn.disabled = false;
      });
  });
})();
