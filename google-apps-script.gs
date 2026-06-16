/**
 * Pact waitlist → Google Sheets
 * ------------------------------------------------------------------
 * This script receives waitlist submissions from the landing page and
 * appends them as rows to the Google Sheet it is bound to.
 *
 * SETUP (one time, ~5 minutes):
 *   1. Create a new Google Sheet (sheet.new). Name it e.g. "Pact Waitlist".
 *   2. In that sheet: Extensions → Apps Script.
 *   3. Delete any boilerplate, paste THIS entire file, and Save.
 *   4. Click Deploy → New deployment.
 *        - Type: Web app
 *        - Description: Pact waitlist
 *        - Execute as: Me (your account)
 *        - Who has access: Anyone
 *      Click Deploy, authorize when prompted (choose your Google
 *      account → Advanced → "Go to … (unsafe)" → Allow — this is your
 *      own script, it's safe).
 *   5. Copy the "Web app" URL it gives you (ends in /exec).
 *   6. Paste that URL into WAITLIST_ENDPOINT in script.js.
 *
 * To test without the site: Run → run the `test` function once; a row
 * should appear in the sheet.
 * ------------------------------------------------------------------
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Add a header row the first time the sheet is used.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Company']);
    }

    var params = (e && e.parameter) || {};
    sheet.appendRow([
      new Date(),
      params.name || '',
      params.email || '',
      params.company || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Lets you confirm the deployment is live by visiting the URL in a browser.
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'ok', message: 'Pact waitlist endpoint is live.' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Optional: run this manually from the Apps Script editor to verify writes.
function test() {
  doPost({ parameter: { name: 'Test Person', email: 'test@example.com', company: 'Test Co' } });
}
