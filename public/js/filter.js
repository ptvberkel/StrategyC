// Portfoliofilter in de browser; zonder JavaScript is alles zichtbaar.
(function () {
  var knoppen = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
  var kaarten = Array.prototype.slice.call(document.querySelectorAll("[data-cases] .kaart"));
  var leeg = document.querySelector("[data-leeg]");
  function toepassen(filter, pushUrl) {
    var zichtbaar = 0;
    kaarten.forEach(function (k) {
      var tags = (k.getAttribute("data-tags") || "").split(" ");
      var toon = filter === "alle" || tags.indexOf(filter) !== -1;
      k.hidden = !toon;
      if (toon) zichtbaar++;
    });
    knoppen.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === filter)); });
    if (leeg) leeg.hidden = zichtbaar > 0;
    if (pushUrl) {
      var url = new URL(location.href);
      if (filter === "alle") url.searchParams.delete("c"); else url.searchParams.set("c", filter);
      history.replaceState(null, "", url);
    }
  }
  knoppen.forEach(function (b) { b.addEventListener("click", function () { toepassen(b.getAttribute("data-filter") || "alle", true); }); });
  var start = new URL(location.href).searchParams.get("c");
  if (start && knoppen.some(function (b) { return b.getAttribute("data-filter") === start; })) toepassen(start, false);
})();
