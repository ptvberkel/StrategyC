// Menuknop op smalle schermen; zonder JavaScript blijft het menu zichtbaar (.no-js).
document.documentElement.classList.remove("no-js");
var knop = document.querySelector("[data-menuknop]");
var header = document.getElementById("site-header");
if (knop && header) {
  knop.addEventListener("click", function () {
    var open = header.classList.toggle("open");
    knop.setAttribute("aria-expanded", String(open));
    var label = knop.querySelector("[data-label]");
    if (label) label.textContent = open ? "Sluiten" : "Menu";
  });
}
