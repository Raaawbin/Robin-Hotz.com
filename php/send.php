<?php
/* =====================================================================
   robin-hotz.com | send.php
   Nimmt das Kontaktformular entgegen und verschickt eine E-Mail an
   den Empfänger. Läuft auf jedem PHP-Hosting (z. B. Strato).
   Antwortet mit JSON, damit das Formular ohne Seitenwechsel reagiert.
   ===================================================================== */

// ---- Konfiguration -------------------------------------------------
$EMPFAENGER = 'Robin@Robin-Hotz.com';
// Absender MUSS auf der eigenen Domain liegen, sonst lehnen viele
// Mailserver (auch Strato) die Nachricht ab oder markieren sie als Spam.
$ABSENDER   = 'noreply@robin-hotz.com';
$ABSENDER_NAME = 'Robin Hotz Website';
// --------------------------------------------------------------------

header('Content-Type: application/json; charset=utf-8');

// Nur POST zulassen
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method']);
    exit;
}

// Eingaben einlesen und säubern
function feld($key) {
    return isset($_POST[$key]) ? trim($_POST[$key]) : '';
}

$name    = feld('name');
$email   = feld('email');
$message = feld('message');
$hp      = feld('website'); // Honeypot, muss leer bleiben

// Spam-Falle: Bots füllen versteckte Felder aus -> stillschweigend "ok"
if ($hp !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

// Pflichtfelder prüfen
if ($name === '' || $email === '' || $message === '') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'missing']);
    exit;
}

// E-Mail-Adresse validieren
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'email']);
    exit;
}

// Header-Injection verhindern: keine Zeilenumbrüche in Kopfzeilen-Feldern
$name  = str_replace(["\r", "\n"], ' ', $name);
$email = str_replace(["\r", "\n"], ' ', $email);

// Betreff und Text zusammenbauen
$betreff = 'Neue Anfrage über robin-hotz.com von ' . $name;

$text  = "Neue Nachricht über das Kontaktformular auf robin-hotz.com\n";
$text .= "----------------------------------------------------------\n\n";
$text .= "Name:    " . $name . "\n";
$text .= "E-Mail:  " . $email . "\n\n";
$text .= "Nachricht:\n" . $message . "\n";

// Kopfzeilen
$headers  = 'From: ' . $ABSENDER_NAME . ' <' . $ABSENDER . ">\r\n";
$headers .= 'Reply-To: ' . $name . ' <' . $email . ">\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";
$headers .= 'X-Mailer: PHP/' . phpversion();

// Betreff UTF-8-sicher kodieren
$betreff_enc = '=?UTF-8?B?' . base64_encode($betreff) . '?=';

// envelope-sender setzen (verbessert Zustellbarkeit auf Strato)
$params = '-f' . $ABSENDER;

$erfolg = @mail($EMPFAENGER, $betreff_enc, $text, $headers, $params);

if ($erfolg) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'send']);
}
