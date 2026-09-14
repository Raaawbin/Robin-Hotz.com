/* GitHub Pages contact flow: prepare an email; delivery happens in the mail app. */
(function () {
  'use strict';
  var form = document.getElementById('contact-form');
  if (!form) return;
  var status = document.getElementById('form-status');
  var button = form.querySelector('button[type="submit"]');
  var fields = ['name', 'email', 'message'].map(function (name) { return form.elements.namedItem(name); });
  var statusKey = '';
  var messages = {
    required: { de: 'Bitte füllen Sie dieses Feld aus.', en: 'Please fill in this field.' },
    draft: {
      de: 'Der E-Mail-Entwurf wird in Ihrem Mailprogramm geöffnet. Bitte senden Sie die Nachricht dort ab. Falls sich nichts öffnet, nutzen Sie den E-Mail-Link unten. Ihre Eingaben bleiben hier erhalten.',
      en: 'The email draft will open in your email app. Please send the message there. If nothing opens, use the email link below. Your entries remain available here.'
    }
  };
  function text(key) { return messages[key][document.documentElement.lang === 'en' ? 'en' : 'de']; }
  button.disabled = false;
  form.noValidate = true;
  fields.forEach(function (field) {
    field.addEventListener('input', function () {
      field.setCustomValidity('');
      field.removeAttribute('aria-invalid');
      statusKey = '';
      status.textContent = '';
      form.querySelector('.form-direct a').href = form.action;
    });
  });
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var invalid;
    fields.forEach(function (field) {
      field.setCustomValidity(field.value.trim() ? '' : text('required'));
      field.setAttribute('aria-invalid', String(!field.validity.valid));
      if (!field.validity.valid && !invalid) invalid = field;
    });
    if (invalid) { invalid.focus(); invalid.reportValidity(); return; }
    var en = document.documentElement.lang === 'en';
    var subject = (en ? 'Website enquiry from ' : 'Anfrage über die Website von ') + fields[0].value.trim();
    var body = 'Name: ' + fields[0].value.trim() + '\r\n' +
      'E-Mail: ' + fields[1].value.trim() + '\r\n\r\n' + fields[2].value.trim();
    var mailto = form.action.split('?')[0] + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    // Keep the draft link available if the browser does not launch a mail app.
    form.querySelector('.form-direct a').href = mailto;
    statusKey = 'draft';
    status.textContent = text(statusKey);
    window.location.href = mailto;
  });
  window.addEventListener('langchange', function () {
    fields.forEach(function (field) { field.setCustomValidity(''); });
    if (statusKey) status.textContent = text(statusKey);
  });
})();
