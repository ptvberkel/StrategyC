// Contactformulieren: Nederlandse validatie (v7 §4), tijdstempel voor de spamcontrole, foutmelding uit ?fout=.
(function () {
  if (new URL(location.href).searchParams.get("fout")) {
    var m = document.querySelector("[data-melding]");
    if (m) m.hidden = false;
  }
  Array.prototype.forEach.call(document.querySelectorAll("[data-formulier]"), function (f) {
    var tijd = f.querySelector("[data-tijd]");
    if (tijd) tijd.value = String(Date.now());
    f.addEventListener("submit", function (e) {
      var ok = true;
      Array.prototype.forEach.call(f.querySelectorAll(".veld"), function (veld) {
        var input = veld.querySelector("input, textarea");
        if (!input) return;
        var geldig = input.checkValidity();
        veld.classList.toggle("ongeldig", !geldig);
        if (!geldig) ok = false;
      });
      if (!ok) {
        e.preventDefault();
        var eerste = f.querySelector(".ongeldig input, .ongeldig textarea");
        if (eerste) eerste.focus();
        return;
      }
      var label = f.querySelector("[data-label]");
      if (label) label.textContent = "Versturen…";
    });
  });
})();
