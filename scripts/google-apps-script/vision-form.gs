/*
 * VISION Coaching: receiver for the preparation form
 *
 * Receives the answers from robin-hotz.com/solutions/vision-form,
 * writes them as a row into the Google Sheet this script is bound to,
 * and sends Robin an email with all answers.
 *
 * Setup (once):
 * 1. Open the sheet, then Extensions > Apps Script, paste this code, save.
 * 2. Select the function "test" at the top and click Run. Allow access. A test email arrives.
 * 3. Deploy > New deployment > Web app, Execute as: Me, Who has access: Anyone.
 * 4. Put the web app URL (ends in /exec) into solutions/vision-form.html at ENDPOINT.
 * After later code changes: Manage deployments > Edit > Version: New version.
 * That way the URL stays the same.
 */

var EMAIL_TO = 'robin@robin-hotz.com';
var SHEET_NAME = 'Answers';

// Field name in the form and column header in the sheet
var FIELDS = [
  ['name', 'Name'],
  ['email', 'Email'],
  ['bestes', 'What is the best thing that could happen in our session?'],
  ['vision', 'What is your vision or concept?'],
  ['warum', 'Why does this matter to you?'],
  ['stand', 'Where are you with it right now?'],
  ['hindernis', 'What has kept you from the next step so far?'],
  ['sprache', 'Language']
];

function doPost(e) {
  var p = (e && e.parameter) || {};
  // Spam trap: people never see this field, bots fill it in
  if (p.website) return json_({ ok: true });
  if (!p.name || !isEmail_(p.email)) return json_({ ok: false, error: 'missing' });

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    sheet_().appendRow([new Date()].concat(FIELDS.map(function (f) { return clean_(p[f[0]]); })));
  } finally {
    lock.releaseLock();
  }

  var body = FIELDS.map(function (f) {
    return f[1] + '\n' + (p[f[0]] ? String(p[f[0]]) : '(empty)') + '\n';
  }).join('\n');
  MailApp.sendEmail({
    to: EMAIL_TO,
    replyTo: p.email,
    name: 'robin-hotz.com',
    subject: 'VISION Coaching preparation: ' + p.name,
    body: body + '\nAll answers in the sheet: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl()
  });
  return json_({ ok: true });
}

// Opening the web app URL in a browser only shows that the receiver is running
function doGet() {
  return json_({ ok: true, info: 'VISION Coaching form receiver is running.' });
}

// Run once in the editor: sets up the sheet, writes a test row and sends a test email
function test() {
  doPost({ parameter: { name: 'Test', email: EMAIL_TO, bestes: 'Test answer, can be deleted', sprache: 'en' } });
}

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    // Reuse the empty first tab of a new spreadsheet, otherwise add a new tab
    var first = ss.getSheets()[0];
    sh = first.getLastRow() === 0 ? first.setName(SHEET_NAME) : ss.insertSheet(SHEET_NAME);
  }
  if (sh.getLastRow() === 0) {
    sh.appendRow(['Received'].concat(FIELDS.map(function (f) { return f[1]; })));
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, FIELDS.length + 1).setFontWeight('bold');
  }
  return sh;
}

// Keep formulas from the form out of the sheet and limit the length
function clean_(v) {
  v = String(v || '').slice(0, 5000);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function isEmail_(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || ''));
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
