/* ============================================================
   Pact — waitlist form handling
   ------------------------------------------------------------
   Submissions are sent to a Google Apps Script Web App, which
   appends each entry (name, email, company, timestamp) to a
   Google Sheet you own.

   >>> SETUP: paste your deployed Web App URL below. <<<
   See README.md ("Connect the waitlist to Google Sheets") for
   the 5-minute walkthrough.
   ============================================================ */

const WAITLIST_ENDPOINT = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

(function () {
  // footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const form = document.getElementById("waitlist-form");
  if (!form) return;

  const statusEl = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");

  function setStatus(message, type) {
    statusEl.textContent = message;
    statusEl.classList.remove("is-error", "is-success");
    if (type) statusEl.classList.add("is-" + type);
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const company = form.company.value.trim();

    if (!name || !email || !company) {
      setStatus("Please fill in your name, email, and company.", "error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("Please enter a valid email address.", "error");
      return;
    }

    if (WAITLIST_ENDPOINT.startsWith("PASTE_")) {
      setStatus(
        "Form isn't connected yet — add your Google Apps Script URL in script.js (see README).",
        "error"
      );
      return;
    }

    submitBtn.disabled = true;
    const originalLabel = submitBtn.textContent;
    submitBtn.textContent = "Joining…";
    setStatus("", null);

    try {
      // URLSearchParams keeps this a "simple" request (no CORS preflight),
      // which Google Apps Script Web Apps handle reliably.
      await fetch(WAITLIST_ENDPOINT, {
        method: "POST",
        body: new URLSearchParams({ name, email, company }),
      });

      form.reset();
      setStatus("You're on the list. We'll be in touch.", "success");
      submitBtn.textContent = "Joined ✓";
    } catch (err) {
      console.error(err);
      setStatus("Something went wrong. Please try again in a moment.", "error");
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });
})();
