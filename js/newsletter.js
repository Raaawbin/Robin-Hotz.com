/* =====================================================================
   Newsletter-Anmeldung ueber Mailchimp.
   Der Versand laeuft ueber den oeffentlichen post-json-Endpunkt von
   Mailchimp. Dadurch bleibt die Besucherin auf der Seite und bekommt
   die Rueckmeldung direkt im Formular. Kein API-Key noetig.
   ===================================================================== */
(function () {

  var form = document.getElementById('newsletter-form');
  if (!form) return;

  var status  = document.getElementById('newsletter-status');
  var btn     = form.querySelector('button[type="submit"]');
  var hp      = document.getElementById('nl-hp');
  var fname   = form.elements.namedItem('FNAME');
  var mail    = form.elements.namedItem('EMAIL');
  var source  = form.elements.namedItem('MERGE3');
  var message = form.elements.namedItem('MERGE4');
  var consent = document.getElementById('nl-consent');

  /* HTML bleibt auch ohne JavaScript ein gueltiges Mailchimp-Formular. */
  form.noValidate = true;
  var pending = false;

  function isEn() { return document.documentElement.lang === 'en'; }

  function setStatus(text, kind) {
    status.textContent = text;
    status.className = 'form-status' + (kind ? ' is-' + kind : '');
  }

  /* Mailchimp liefert Meldungen mit HTML-Links, hier als reinen Text */
  function plain(html) {
    var d = document.createElement('div');
    d.innerHTML = String(html || '');
    return (d.textContent || '').replace(/\s+/g, ' ').trim();
  }

  /* JSONP, weil Mailchimp kein CORS fuer diesen Endpunkt erlaubt */
  function jsonp(url, done) {
    var cb = 'mcCallback' + Date.now() + Math.floor(Math.random() * 1000);
    var script = document.createElement('script');
    var timer = setTimeout(function () { cleanup(); done(null); }, 12000);

    function cleanup() {
      clearTimeout(timer);
      try { delete window[cb]; } catch (e) { window[cb] = undefined; }
      if (script.parentNode) script.parentNode.removeChild(script);
    }

    window[cb] = function (data) { cleanup(); done(data); };
    script.onerror = function () { cleanup(); done(null); };
    script.src = url + '&c=' + cb;
    document.body.appendChild(script);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var en = isEn();

    if (pending) return;

    mail.value = mail.value.trim();
    if (!mail.checkValidity()) {
      setStatus(en ? 'Please enter a valid email address.'
                   : 'Bitte gib eine gültige E-Mail-Adresse ein.', 'error');
      mail.focus();
      return;
    }

    fname.value = fname.value.trim();
    if (!fname.value) {
      setStatus(en ? 'Please enter your name.'
                   : 'Bitte gib Deinen Namen ein.', 'error');
      fname.focus();
      return;
    }

    source.value = source.value.trim();
    message.value = message.value.trim();

    if (new TextEncoder().encode(source.value).length > 255 ||
        new TextEncoder().encode(message.value).length > 255) {
      setStatus(en
        ? 'Please keep your answers brief. For a longer message, email rh@visualfacilitators.com.'
        : 'Bitte halte Deine Antworten kurz. Für ein längeres Anliegen schreib mir an rh@visualfacilitators.com.', 'error');
      (new TextEncoder().encode(source.value).length > 255 ? source : message).focus();
      return;
    }

    if (!consent.checked) {
      setStatus(en ? 'Please confirm your consent to continue.'
                   : 'Bitte bestätige die Einwilligung.', 'error');
      consent.focus();
      return;
    }

    /* Honeypot gefuellt: still aussteigen */
    if (hp && hp.value) return;

    setStatus(en ? 'Sending …' : 'Wird gesendet …', '');
    pending = true;
    if (btn) btn.disabled = true;

    var url = new URL(form.action);
    url.pathname = url.pathname.replace(/\/post$/, '/post-json');
    url.searchParams.set('EMAIL', mail.value);
    url.searchParams.set('FNAME', fname ? fname.value : '');
    url.searchParams.set('MERGE3', source.value);
    url.searchParams.set('MERGE4', message.value);
    if (hp) url.searchParams.set(hp.name, '');

    jsonp(url.href, function (data) {
      pending = false;
      if (btn) btn.disabled = false;

      if (!data) {
        setStatus(en
          ? 'The signup could not be sent. Please try again or write to rh@visualfacilitators.com.'
          : 'Die Anmeldung konnte nicht gesendet werden. Bitte versuche es erneut oder schreib an rh@visualfacilitators.com.', 'error');
        return;
      }

      if (data.result === 'success') {
        setStatus(en
          ? 'Thank you, your details have been saved and you are subscribed to my newsletter.'
          : 'Danke, Deine Angaben sind gespeichert und Du bist für meinen Newsletter angemeldet.', 'ok');
        form.reset();
        return;
      }

      /* Mailchimp stellt seinen Meldungen ein "0 - " voran */
      var msg = plain(data.msg).replace(/^\d+\s*-\s*/, '');

      /* Eine bestehende Anmeldung bestaetigt keinen erneuten Nachrichtenversand. */
      if (/already subscribed/i.test(msg)) {
        setStatus(en
          ? 'This address is already subscribed. To send me a new message, please email rh@visualfacilitators.com.'
          : 'Diese Adresse ist bereits eingetragen. Für ein neues Anliegen schreib mir bitte an rh@visualfacilitators.com.', 'error');
        return;
      }

      /* Haeufigster Fehlerfall auf Deutsch statt in Mailchimp-Englisch */
      if (/must contain a single @|valid email/i.test(msg)) {
        setStatus(en ? 'Please enter a valid email address.'
                     : 'Bitte gib eine gültige E-Mail-Adresse ein.', 'error');
        return;
      }

      /* Weitere Audience-Pflichtfelder weisen auf eine abweichende Konfiguration hin. */
      if (/please enter a value|required field|must be provided/i.test(msg)) {
        setStatus(en
          ? 'The signup is currently unavailable because the form is not configured correctly. Please write to rh@visualfacilitators.com.'
          : 'Die Anmeldung ist gerade nicht möglich, weil das Formular noch nicht richtig eingerichtet ist. Schreib mir bitte an rh@visualfacilitators.com.', 'error');
        return;
      }

      setStatus(msg || (en
        ? 'The signup did not work. Please write to rh@visualfacilitators.com.'
        : 'Die Anmeldung hat nicht geklappt. Schreib mir gern an rh@visualfacilitators.com.'), 'error');
    });
  });
})();
