/* ============================================================
   Pact — interactivity (ported from the design) + waitlist wiring
   ============================================================ */

const WAITLIST_ENDPOINT = "https://script.google.com/macros/s/AKfycbxUzoKwO6ZfQF7Mi3uibzmXSHO-7WPPyoton2fedIy3qHG0brGGyRIcVXy12rVrXrzq/exec";

/* footer year */
(function () {
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();

/* ---------- Hero: weekly loop widget ---------- */
(function () {
  var cellsEl = document.getElementById("loop-cells");
  var hitsEl = document.getElementById("loop-hits");
  var payoutEl = document.getElementById("loop-payout");
  if (!cellsEl) return;

  var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  var hitDays = [0, 1, 3, 4];
  var loopDay = 0;

  function render() {
    var ld = Math.min(loopDay, 7);
    cellsEl.innerHTML = "";
    days.forEach(function (d, i) {
      var revealed = i < ld, isToday = i === ld, isHit = revealed && hitDays.indexOf(i) !== -1;
      var bg, color, border, shadow = "", status;
      if (isHit) { bg = "var(--accent)"; color = "var(--cream)"; border = "1px solid var(--accent)"; status = "HIT"; }
      else if (revealed) { bg = "var(--cream2)"; color = "rgba(21,32,26,.45)"; border = "1px solid var(--line)"; status = "—"; }
      else if (isToday) { bg = "rgba(31,107,74,.07)"; color = "var(--accent)"; border = "1.5px solid var(--accent)"; shadow = "box-shadow:0 0 0 4px rgba(31,107,74,.1);"; status = "NOW"; }
      else { bg = "#fff"; color = "rgba(21,32,26,.32)"; border = "1px solid var(--line)"; status = "·"; }

      var cell = document.createElement("div");
      cell.style.cssText =
        "display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;height:78px;border-radius:12px;transition:all .35s ease;" +
        "background:" + bg + ";color:" + color + ";border:" + border + ";" + shadow;
      cell.innerHTML =
        '<span style="font-family:\'Hanken Grotesk\',sans-serif;font-weight:700;font-size:13px;line-height:1;">' + d + "</span>" +
        '<span style="font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:.04em;opacity:.85;">' + status + "</span>";
      cellsEl.appendChild(cell);
    });

    var hits = hitDays.filter(function (i) { return i < ld; }).length;
    hitsEl.textContent = hits + " / 4 days";

    if (hits >= 4) {
      payoutEl.innerHTML =
        '<div style="display:flex;align-items:center;gap:11px;background:var(--accent);color:var(--cream);padding:13px 22px;border-radius:14px;animation:pop .4s ease;">' +
        '<span style="font-family:\'JetBrains Mono\',monospace;font-size:11px;opacity:.85;">PAYOUT</span>' +
        '<span style="font-family:\'Spectral\',serif;font-weight:700;font-size:28px;">+$25</span></div>';
    } else {
      payoutEl.innerHTML = "";
    }
  }

  render();
  setInterval(function () { loopDay = (loopDay + 1) % 9; render(); }, 680);
})();

/* ---------- Goals: interactive selector ---------- */
(function () {
  var listEl = document.getElementById("goal-list");
  if (!listEl) return;

  var goalsData = [
    { name: "Daily steps", metric: "STEPS", target: "10,000+ steps · 4 days a week", detail: "Pact reads your daily step count and confirms the threshold was cleared on four separate days. No manual logging.", payout: "+$25" },
    { name: "Cardio", metric: "ZONE 2+", target: "60 minutes in Zone 2+ heart rate", detail: "Time spent in elevated heart-rate zones is summed across the week — walking, cycling, a run, it all counts.", payout: "+$25" },
    { name: "Workouts", metric: "SESSIONS", target: "3 workouts logged", detail: "Counts training sessions of twenty minutes or more, whatever the activity. Consistency over intensity.", payout: "+$25" },
    { name: "Sleep consistency", metric: "SLEEP", target: "75%+ sleep consistency score", detail: "Rewards steady sleep and wake times across the week — the habit most linked to recovery and mood.", payout: "+$25" }
  ];
  var selected = 0;

  var nameEl = document.getElementById("goal-name");
  var targetEl = document.getElementById("goal-target");
  var detailEl = document.getElementById("goal-detail");
  var payoutEl = document.getElementById("goal-payout");

  function renderList() {
    listEl.innerHTML = "";
    goalsData.forEach(function (g, i) {
      var on = i === selected;
      var row = document.createElement("div");
      row.style.cssText =
        "border-radius:14px;padding:20px 22px;cursor:pointer;transition:all .2s ease;" +
        (on
          ? "background:var(--cream);border:1.5px solid var(--accent);box-shadow:0 8px 20px -14px rgba(21,32,26,.4);"
          : "background:transparent;border:1px solid var(--line);");
      row.innerHTML =
        '<div style="display:flex;align-items:center;justify-content:space-between;">' +
        '<span style="font-family:\'Spectral\',serif;font-weight:600;font-size:20px;">' + g.name + "</span>" +
        '<span style="font-family:\'JetBrains Mono\',monospace;font-size:11px;letter-spacing:.06em;opacity:.7;">' + g.metric + "</span></div>" +
        '<div style="font-size:14.5px;color:rgba(21,32,26,.6);margin-top:6px;">' + g.target + "</div>";
      row.addEventListener("click", function () { selected = i; renderList(); renderPreview(); });
      listEl.appendChild(row);
    });
  }

  function renderPreview() {
    var s = goalsData[selected];
    nameEl.textContent = s.name;
    targetEl.textContent = s.target;
    detailEl.textContent = s.detail;
    payoutEl.textContent = s.payout;
  }

  renderList();
  renderPreview();
})();

/* ---------- Opportunity: count-up stats on scroll ---------- */
(function () {
  var nums = [].slice.call(document.querySelectorAll(".opp-num"));
  var section = document.getElementById("opportunity");
  if (!nums.length) return;
  var started = false;

  function animate() {
    if (started) return;
    started = true;
    var start = performance.now(), dur = 1700;
    function tick(t) {
      var p = Math.min(1, (t - start) / dur);
      p = 1 - Math.pow(1 - p, 3);
      nums.forEach(function (el) {
        var target = +el.dataset.target;
        var pre = el.dataset.pre || "", suf = el.dataset.suf || "";
        el.textContent = pre + Math.round(target * p) + suf;
      });
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if ("IntersectionObserver" in window && section) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { animate(); io.disconnect(); } });
    }, { threshold: 0, rootMargin: "0px 0px -15% 0px" });
    io.observe(section);
  } else {
    animate();
  }
  setTimeout(animate, 2200); // safety net for short/scaled viewports
})();

/* ---------- Waitlist: validate, POST to Google Sheet, show success ---------- */
(function () {
  var btn = document.getElementById("wl-submit");
  if (!btn) return;
  var formEl = document.getElementById("wl-form");
  var successEl = document.getElementById("wl-success");
  var nameI = document.getElementById("wl-name");
  var emailI = document.getElementById("wl-email");
  var companyI = document.getElementById("wl-company");
  var noteEl = document.getElementById("wl-note");

  btn.addEventListener("click", async function () {
    var name = nameI.value.trim();
    var email = emailI.value.trim();
    var company = companyI.value.trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailI.style.border = "1px solid #c0392b";
      noteEl.textContent = "Please enter a valid work email.";
      noteEl.style.color = "#c0392b";
      emailI.focus();
      return;
    }

    btn.style.opacity = ".6";
    btn.style.pointerEvents = "none";
    btn.textContent = "Joining…";

    try {
      await fetch(WAITLIST_ENDPOINT, {
        method: "POST",
        body: new URLSearchParams({ name: name, email: email, company: company })
      });
    } catch (err) {
      console.error(err);
    }

    var first = name.split(" ")[0];
    document.getElementById("wl-greet").textContent = first ? ", " + first : "";
    formEl.style.display = "none";
    successEl.style.display = "block";
  });
})();
