// Vallende C-cirkels in de hero (besluit Pauline + Piet, 24-08). Eigen mini-physics: geen externe bibliotheek,
// geen verzoek naar derden. Respecteert prefers-reduced-motion (cirkels liggen dan meteen stil).
// Labels komen uit data-labels op #cirkels (gevuld vanuit src/data/cs.ts — één bron voor de zes C's).
(function () {
  var pit = document.getElementById("cirkels");
  if (!pit) return;
  var labels = (pit.getAttribute("data-labels") || "").split("|").filter(Boolean);
  var vast = pit.getAttribute("data-vast") || "";
  // Doel per C: portfolio gefilterd op die C; het vaste label "Coalities" → hele portfolio.
  // Relatief aan de huidige pagina (Home eindigt op "/"), zodat het ook onder een basispad (preview) werkt.
  var basis = location.pathname.replace(/[^/]*$/, "");
  function doel(l) { return l === vast ? basis + "portfolio/" : basis + "portfolio/?c=" + l.toLowerCase(); }
  // straal per label: langere woorden grotere cirkel; het vaste label iets groter
  function straal(l) { return Math.round(Math.max(56, 30 + l.length * 5.2)); }
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var W, H, balls = [], raf = null, idle = 0, drag = null;

  // Schaal loopt mee met de breedte van de bak (die is nu paginabreed): op brede schermen grotere ballen, zodat ze niet verloren liggen.
  function schaal() { var w = pit.clientWidth; return Math.max(0.5, Math.min(1.35, w / 1000)); }
  function opbouw() {
    W = pit.clientWidth; H = pit.clientHeight; pit.innerHTML = ""; balls = [];
    var s = schaal();
    labels.forEach(function (l, i) {
      var r = Math.round(straal(l) * s);
      var fs = Math.max(19, Math.round(r * 0.27)); // ≥ 19 px vet: AA voor grote tekst op rood
      r = Math.max(r, Math.ceil(fs * 0.56 * l.length / 2) + 8); // woord moet in de cirkel passen
      var el = document.createElement("a");
      el.href = doel(l);
      el.setAttribute("aria-label", l === vast ? "Naar het hele portfolio" : "Portfolio: werk in " + l);
      el.className = "cirkel" + (l === vast ? " cirkel--vast" : "");
      el.style.width = el.style.height = r * 2 + "px";
      el.style.fontSize = fs + "px";
      el.textContent = l;
      pit.appendChild(el);
      var b = { el: el, r: r, x: W * (0.08 + 0.84 * (i + 0.5) / labels.length), y: -r - i * (r * 1.6 + 24), vx: (Math.random() - 0.5) * 40, vy: 0, m: r * r, held: false };
      balls.push(b);
      el.addEventListener("pointerdown", function (e) {
        if (e.button && e.button !== 0) return;
        e.preventDefault(); el.setPointerCapture(e.pointerId);
        drag = { b: b, lx: e.clientX, ly: e.clientY, sx: e.clientX, sy: e.clientY, t: performance.now(), moved: false }; b.held = true; b.vx = b.vy = 0; start();
      });
      // Klik = navigeren (native), tenzij er gesleept is.
      el.addEventListener("click", function (e) { if (b.gesleept) { e.preventDefault(); b.gesleept = false; } });
    });
    if (reduce) { for (var i = 0; i < 900; i++) stap(1 / 60); teken(); } else { start(); }
  }
  function stap(dt) {
    var g = 2400, rest = 0.32;
    balls.forEach(function (b) {
      if (b.held) return;
      b.vy += g * dt; b.x += b.vx * dt; b.y += b.vy * dt; b.vx *= 0.995; b.vy *= 0.999;
      if (b.y + b.r > H) { b.y = H - b.r; b.vy = -b.vy * rest; b.vx *= 0.9; }
      if (b.x - b.r < 0) { b.x = b.r; b.vx = -b.vx * rest; }
      if (b.x + b.r > W) { b.x = W - b.r; b.vx = -b.vx * rest; }
      if (b.y - b.r < -H * 2) { b.y = -H * 2 + b.r; b.vy = 0; }
    });
    for (var k = 0; k < 3; k++) for (var i = 0; i < balls.length; i++) for (var j = i + 1; j < balls.length; j++) {
      var a = balls[i], c = balls[j], dx = c.x - a.x, dy = c.y - a.y, d = Math.sqrt(dx * dx + dy * dy) || 0.001, min = a.r + c.r;
      if (d < min) {
        var nx = dx / d, ny = dy / d, over = min - d, ma = a.held ? 0 : 1, mc = c.held ? 0 : 1, tot = ma + mc || 1;
        a.x -= nx * over * (ma / tot); a.y -= ny * over * (ma / tot); c.x += nx * over * (mc / tot); c.y += ny * over * (mc / tot);
        var rv = (c.vx - a.vx) * nx + (c.vy - a.vy) * ny;
        if (rv < 0) {
          var imp = -(1 + rest) * rv / (1 / a.m + 1 / c.m);
          if (!a.held) { a.vx -= imp * nx / a.m; a.vy -= imp * ny / a.m; }
          if (!c.held) { c.vx += imp * nx / c.m; c.vy += imp * ny / c.m; }
        }
      }
    }
    // Na het uit elkaar duwen opnieuw binnen de bak klemmen: anders kan een bal half buiten de rand blijven liggen (smalle schermen).
    balls.forEach(function (b) {
      if (b.held) return;
      if (b.x - b.r < 0) b.x = b.r; else if (b.x + b.r > W) b.x = W - b.r;
      if (b.y + b.r > H) b.y = H - b.r;
    });
  }
  function teken() { balls.forEach(function (b) { b.el.style.transform = "translate(" + (b.x - b.r) + "px," + (b.y - b.r) + "px)"; }); }
  function loop() {
    stap(1 / 60); teken();
    var beweegt = balls.some(function (b) { return b.held || Math.abs(b.vx) > 4 || Math.abs(b.vy) > 4 || b.y + b.r < H - 1; });
    idle = beweegt ? 0 : idle + 1;
    if (idle < 40) raf = requestAnimationFrame(loop); else raf = null; // stoppen zodra alles ligt
  }
  function start() { if (!raf) { idle = 0; raf = requestAnimationFrame(loop); } }
  window.addEventListener("pointermove", function (e) {
    if (!drag) return;
    var b = drag.b, rect = pit.getBoundingClientRect(), now = performance.now(), dt = Math.max(now - drag.t, 1);
    if (Math.abs(e.clientX - drag.sx) > 6 || Math.abs(e.clientY - drag.sy) > 6) { drag.moved = true; b.gesleept = true; }
    b.vx = (e.clientX - drag.lx) / dt * 600; b.vy = (e.clientY - drag.ly) / dt * 600;
    drag.lx = e.clientX; drag.ly = e.clientY; drag.t = now;
    b.x = Math.max(b.r, Math.min(rect.width - b.r, e.clientX - rect.left));
    b.y = Math.max(b.r, Math.min(rect.height - b.r, e.clientY - rect.top));
  });
  function los() {
    if (!drag) return;
    var b = drag.b, mx = 1400; b.held = false;
    b.vx = Math.max(-mx, Math.min(mx, b.vx)); b.vy = Math.max(-mx, Math.min(mx, b.vy)); drag = null; start();
  }
  window.addEventListener("pointerup", los); window.addEventListener("pointercancel", los);
  var lastW = window.innerWidth;
  window.addEventListener("resize", function () { if (window.innerWidth !== lastW) { lastW = window.innerWidth; opbouw(); } });
  opbouw();
})();
