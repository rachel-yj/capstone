/* The Authenticity Gap — interactions and charts.
   Plain JavaScript, no libraries. Every chart has a TABLE view for screen readers
   and keyboard users; every figure is drawn from the DATA object below. */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ data */
  var DATA = {
    guess: { consumers: 45, execs: 82 },
    words: [
      { group: "Positive words", word: "Innovative", execs: 49, consumers: 23 },
      { group: "Positive words", word: "Forward-thinking", execs: 46, consumers: 22 },
      { group: "Positive words", word: "Unique", execs: 44, consumers: 26 },
      { group: "Negative words", word: "Manipulative", execs: 10, consumers: 20 },
      { group: "Negative words", word: "Unethical", execs: 7, consumers: 16 }
    ],
    slope: [
      { name: "Gen Z", y2024: 21, y2026: 39, key: "a" },
      { name: "Millennials", y2024: 15, y2026: 20, key: "mute" }
    ],
    pew: {
      feel: [
        { key: "a", label: "More concerned than excited", value: 50 },
        { key: "m", label: "Equally concerned and excited", value: 38 },
        { key: "b", label: "More excited than concerned", value: 10 }
      ],
      creative: [
        { key: "a", label: "Will worsen it", value: 53 },
        { key: "b", label: "Will improve it", value: 16 }
      ]
    },
    ctr: [
      { id: "human", label: "Human expert ad", value: 3.73, note: "Made by professional designers" },
      { id: "ai", label: "Fully AI-generated ad", value: 4.44, note: "+19% click-through vs. the human ad" },
      { id: "labeled", label: "AI ad, labeled “Made with AI”", value: 3.73 * (1 - 0.315), note: "About 31.5% below the human ad (estimate)", estimate: true }
    ],
    energy: [
      { label: "Text answer", sub: "small model (Llama 3.1 8B)", joules: 114, equiv: "a microwave running for 1/10 of a second, or 6 feet on an e-bike" },
      { label: "High-quality image", sub: "Stable Diffusion 3 Medium", joules: 4402, equiv: "a microwave running for about 5.5 seconds, or 250 feet on an e-bike" },
      { label: "5-second video", sub: "CogVideoX", joules: 3400000, equiv: "a microwave running for over an hour, or 38 miles on an e-bike" }
    ],
    cases: [
      { id: "case-coke", brand: "Coca-Cola", date: "2024-11-16", label: "Nov 2024", kind: "backlash" },
      { id: "case-guess", brand: "Guess", date: "2025-08-01", label: "Aug 2025", kind: "backlash" },
      { id: "case-aerie", brand: "Aerie", date: "2025-10-09", label: "Oct 2025", kind: "counter" },
      { id: "case-valentino", brand: "Valentino", date: "2025-12-02", label: "Dec 2025", kind: "backlash" },
      { id: "case-mcd", brand: "McDonald's", date: "2025-12-06", label: "Dec 2025", kind: "backlash" },
      { id: "case-etsy", brand: "Etsy", date: "2026-10-22", label: "Oct 2026", kind: "counter" }
    ]
  };

  var POLL = [
    {
      id: "real",
      q: "Has AI-generated content made you question whether what you see online is real?",
      opts: [["often", "Often"], ["sometimes", "Sometimes"], ["rarely", "Rarely or never"]],
      meters: [
        { label: "U.S. consumers who frequently wonder whether the content they see is real", value: 68, key: "a" },
        { label: "Who frequently question whether the information behind everyday decisions is reliable", value: 61, key: "a" }
      ],
      reveal: {
        often: "You're with most U.S. consumers. 68% say they frequently wonder whether the content and information they see is real.",
        sometimes: "Many people are more doubtful than that. 68% of U.S. consumers say they frequently wonder whether the content they see is real.",
        rarely: "You're in the minority. 68% of U.S. consumers say they frequently wonder whether the content they see is real."
      },
      cite: ["src-gartner", "Gartner, 2026"],
      short: { often: "Often", sometimes: "Sometimes", rarely: "Rarely or never" },
      headline: "68% frequently wonder whether what they see is real."
    },
    {
      id: "seen",
      q: "Do you think you've seen an ad that was made with AI?",
      opts: [["yes", "Yes"], ["unsure", "Not sure"], ["no", "No"]],
      meters: [
        { label: "Gen Z & millennial consumers who believe they've seen an AI-made ad (2026)", value: 71, key: "a" },
        { label: "Same question in 2024", value: 54, key: "m" }
      ],
      reveal: {
        yes: "So do most young consumers. 71% of Gen Z and millennial consumers believe they've seen an AI-made ad, up from 54% in 2024.",
        unsure: "That uncertainty is the point. Even so, 71% of Gen Z and millennial consumers believe they've seen an AI-made ad, up from 54% two years earlier.",
        no: "You may have without knowing it. 71% of Gen Z and millennial consumers believe they've seen an AI-made ad, up from 54% in 2024."
      },
      cite: ["src-williamson", "Williamson et al., 2026"],
      short: { yes: "Yes", unsure: "Not sure", no: "No" },
      headline: "71% of young consumers believe they've seen one."
    },
    {
      id: "tell",
      q: "Could you reliably tell whether an image or video was made by AI?",
      opts: [["yes", "Yes, I'm confident"], ["maybe", "Sometimes"], ["no", "Probably not"]],
      meters: [
        { label: "Americans who aren't confident they can tell AI from human-made", value: 53, key: "a" },
        { label: "Who say it's very important to be able to tell", value: 76, key: "a" }
      ],
      reveal: {
        yes: "You're more confident than most. 53% of Americans aren't confident they can tell whether content was made by AI or a person, even though 76% say it's very important to know.",
        maybe: "That's the common experience. 53% of Americans aren't confident they can tell AI from human-made content, even though 76% say it's very important to be able to.",
        no: "You're with the majority. 53% of Americans aren't confident they can tell, and 76% say it's very important to be able to."
      },
      cite: ["src-pew", "Kennedy et al., 2025"],
      short: { yes: "Confident", maybe: "Sometimes", no: "Probably not" },
      headline: "53% of Americans aren't confident they can spot AI."
    },
    {
      id: "disclose",
      q: "Should brands tell you when an ad was made with AI?",
      opts: [["always", "Yes, always"], ["sometimes", "Only for people or voices"], ["no", "It doesn't matter to me"]],
      meters: [
        { label: "U.S. consumers who say brands have a duty to disclose AI in ads", value: 74, key: "a" },
        { label: "Who would trust a brand less if it hid AI use", value: 44, key: "a" }
      ],
      reveal: {
        always: "So do most people. 74% of U.S. consumers say brands and creators have a duty to disclose when AI is used in advertising.",
        sometimes: "Many people draw lines like yours. In the IAB study, over half of young consumers wanted disclosure for fully AI-generated ads, AI video and AI images, and nearly half for AI voices or avatars.",
        no: "You're in the minority. 74% of U.S. consumers say brands have a duty to disclose AI use, and 44% would trust a brand less if they found out it hadn't."
      },
      cite: ["src-cint", "Cint, 2026"],
      short: { always: "Always disclose", sometimes: "Disclose for people or voices", no: "Doesn't matter" },
      headline: "74% say brands have a duty to disclose AI in ads."
    }
  ];

  /* --------------------------------------------------------------- helpers */
  var SVGNS = "http://www.w3.org/2000/svg";
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function svg(tag, attrs, parent) {
    var n = document.createElementNS(SVGNS, tag);
    for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function h(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) n.setAttribute(k, attrs[k]);
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function store(key, val) {
    try {
      if (val === undefined) return JSON.parse(localStorage.getItem(key) || "null");
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) { return null; }
  }
  function onResize(el, fn) {
    var last = 0;
    if (window.ResizeObserver) {
      new ResizeObserver(function (entries) {
        var w = Math.round(entries[0].contentRect.width);
        if (w && w !== last) { last = w; fn(w); }
      }).observe(el);
    } else {
      fn(el.clientWidth);
      window.addEventListener("resize", function () { fn(el.clientWidth); });
    }
  }
  function fmtJ(j) {
    if (j >= 1e6) return (j / 1e6).toFixed(1).replace(/\.0$/, "") + " million J";
    return j.toLocaleString("en-US") + " J";
  }

  /* tooltip */
  var tip = $("#tip");
  function showTip(html, x, y) {
    tip.innerHTML = html;
    tip.hidden = false;
    var r = tip.getBoundingClientRect();
    var left = Math.min(Math.max(8, x + 14), window.innerWidth - r.width - 8);
    var top = y - r.height - 12;
    if (top < 70) top = y + 18;
    tip.style.left = left + "px";
    tip.style.top = top + "px";
  }
  function hideTip() { tip.hidden = true; }
  function bindTip(node, html) {
    node.addEventListener("pointermove", function (e) { showTip(html, e.clientX, e.clientY); });
    node.addEventListener("pointerleave", hideTip);
  }

  /* ------------------------------------------------------- top bar + nav */
  function initNav() {
    var links = $$(".tracks a");
    var bar = $("#progress");
    var sections = links.map(function (a) { return document.getElementById(a.getAttribute("data-track")); }).filter(Boolean);

    function update() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0) + "%";
      var line = window.innerHeight * 0.35;
      var current = null;
      sections.forEach(function (s) { if (s.getBoundingClientRect().top <= line) current = s; });
      links.forEach(function (a) {
        var on = current && a.getAttribute("data-track") === current.id;
        if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
        if (on && a.scrollIntoView && a.parentNode.parentNode.scrollWidth > a.parentNode.parentNode.clientWidth) {
          var nav = $(".tracks");
          var l = a.offsetLeft - nav.clientWidth / 2 + a.clientWidth / 2;
          nav.scrollTo({ left: l, behavior: reduceMotion ? "auto" : "smooth" });
        }
      });
    }
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(function () { update(); ticking = false; }); }
    }, { passive: true });
    update();
  }

  /* ------------------------------------------------------- citations */
  function initCites() {
    $$(".cite").forEach(function (a) {
      if (a.getAttribute("data-bound")) return;
      a.setAttribute("data-bound", "1");
      var id = (a.getAttribute("href") || "").slice(1);
      var ref = document.getElementById(id);
      if (!ref) return;
      var text = ref.textContent.replace(/https?:\/\/\S+/g, "").trim();
      a.setAttribute("title", text);
      a.addEventListener("click", function () {
        ref.classList.add("is-flash");
        setTimeout(function () { ref.classList.remove("is-flash"); }, 1600);
      });
    });
  }

  /* ------------------------------------------------------- table toggles */
  function makeTable(head, rows) {
    var t = h("table", { class: "data-table" });
    var thead = h("thead"); var tr = h("tr");
    head.forEach(function (c, i) { tr.appendChild(h("th", { scope: "col", class: i ? "num" : "" }, esc(c))); });
    thead.appendChild(tr); t.appendChild(thead);
    var tb = h("tbody");
    rows.forEach(function (r) {
      var row = h("tr");
      r.forEach(function (c, i) { row.appendChild(h(i ? "td" : "th", i ? { class: "num" } : { scope: "row" }, esc(c))); });
      tb.appendChild(row);
    });
    t.appendChild(tb);
    return t;
  }
  function initTables() {
    var tables = {
      "chart-words": makeTable(["Word", "Ad executives", "Consumers"], DATA.words.map(function (d) { return [d.word, d.execs + "%", d.consumers + "%"]; })),
      "chart-slope": makeTable(["Group", "2024", "2026"], DATA.slope.map(function (d) { return [d.name, d.y2024 + "%", d.y2026 + "%"]; })),
      "chart-pew": makeTable(["Question and answer", "Share of U.S. adults"], DATA.pew.feel.map(function (d) { return ["AI in daily life: " + d.label, d.value + "%"]; }).concat(DATA.pew.creative.map(function (d) { return ["Creative thinking: AI " + d.label.toLowerCase(), d.value + "%"]; }))),
      "chart-ctr": makeTable(["Ad", "Click-through rate"], DATA.ctr.map(function (d) { return [d.label, (d.estimate ? "≈" : "") + d.value.toFixed(2) + "%"]; })),
      "chart-energy": makeTable(["Request", "Energy", "Everyday equivalent"], DATA.energy.map(function (d) { return [d.label + " (" + d.sub + ")", fmtJ(d.joules), d.equiv]; }))
    };
    $$("[data-table-toggle]").forEach(function (btn) {
      var id = btn.getAttribute("data-table-toggle");
      var chart = document.getElementById(id);
      var wrap = document.getElementById(id + "-table");
      if (!chart || !wrap || !tables[id]) return;
      wrap.appendChild(tables[id]);
      btn.addEventListener("click", function () {
        var showTable = btn.getAttribute("aria-pressed") !== "true";
        btn.setAttribute("aria-pressed", String(showTable));
        btn.textContent = showTable ? "CHART" : "TABLE";
        wrap.hidden = !showTable;
        chart.hidden = showTable;
        var extra = chart.parentNode.querySelectorAll(".legend, .ctr-controls");
        Array.prototype.forEach.call(extra, function (n) { n.hidden = showTable; });
      });
    });
  }

  /* ------------------------------------------------------- chart: guess */
  function initGuess() {
    var form = $("#guess-form"), range = $("#guess-range"), out = $("#guess-out"), host = $("#chart-guess"), result = $("#guess-result");
    var revealed = false;
    var saved = store("authgap-guess");
    if (saved && typeof saved.v === "number") { range.value = saved.v; revealed = !!saved.r; }

    function draw(w) {
      w = w || host.clientWidth;
      var g = +range.value;
      var H = 132, L = 14, R = 14, axisY = 78;
      var x = function (v) { return L + (v / 100) * (w - L - R); };
      host.innerHTML = "";
      var s = svg("svg", { viewBox: "0 0 " + w + " " + H, width: w, height: H, "aria-hidden": "true" }, host);
      if (revealed) {
        svg("rect", { x: x(DATA.guess.consumers), y: axisY - 9, width: x(DATA.guess.execs) - x(DATA.guess.consumers), height: 18, fill: "var(--milk)", opacity: 0.8 }, s);
      }
      svg("line", { x1: x(0), x2: x(100), y1: axisY, y2: axisY, stroke: "var(--ink)", "stroke-width": 2 }, s);
      [0, 25, 50, 75, 100].forEach(function (v) {
        svg("line", { x1: x(v), x2: x(v), y1: axisY - 5, y2: axisY + 5, stroke: "var(--ink)", "stroke-width": 1.5 }, s);
        var t = svg("text", { x: x(v), y: H - 4, "text-anchor": v === 0 ? "start" : v === 100 ? "end" : "middle", "font-size": 11 }, s);
        t.textContent = v + "%";
      });
      if (revealed) {
        [["Consumers", DATA.guess.consumers, "var(--s-a)"], ["Executives", DATA.guess.execs, "var(--s-b)"]].forEach(function (d) {
          var cx = x(d[1]);
          svg("line", { x1: cx, x2: cx, y1: 44, y2: axisY - 9, stroke: d[2], "stroke-width": 2 }, s);
          svg("circle", { cx: cx, cy: axisY, r: 8, fill: d[2], stroke: "var(--surface)", "stroke-width": 2 }, s);
          var anchor = cx < 70 ? "start" : cx > w - 90 ? "end" : "middle";
          var t = svg("text", { x: cx, y: 22, "text-anchor": anchor, "font-size": 12, "font-weight": 500, fill: "var(--ink)" }, s);
          t.textContent = d[0];
          var t2 = svg("text", { x: cx, y: 38, "text-anchor": anchor, "font-size": 12, fill: d[2] === "var(--s-a)" ? "var(--s-a)" : "var(--s-b)" }, s);
          t2.textContent = d[1] + "%";
        });
      }
      var gx = x(g);
      svg("path", { d: "M" + gx + " " + (axisY - 9) + " l9 9 l-9 9 l-9 -9z", fill: "var(--surface)", stroke: "var(--ink)", "stroke-width": 2 }, s);
      var anchorG = gx < 50 ? "start" : gx > w - 50 ? "end" : "middle";
      var yl = svg("text", { x: gx, y: axisY + 28, "text-anchor": anchorG, "font-size": 12, "font-weight": 500, fill: "var(--ink)" }, s);
      yl.textContent = "You: " + g + "%";
    }

    function describe() {
      var g = +range.value;
      var you = Math.abs(g - DATA.guess.consumers);
      var execMiss = DATA.guess.execs - DATA.guess.consumers;
      var line = "You guessed " + g + "%. Executives estimated 82%. The real answer is 45%. ";
      if (you < execMiss) line += "Your guess was " + (you === 0 ? "exactly right" : you + " points off") + ", closer than the executives, who missed by 37 points.";
      else if (you === execMiss) line += "You missed by 37 points, exactly as much as the executives did.";
      else line += "You missed by " + you + " points, even more than the executives' 37-point miss.";
      result.textContent = line;
    }

    range.addEventListener("input", function () {
      out.textContent = range.value + "%";
      out.value = range.value + "%";
      draw();
      if (revealed) describe();
      store("authgap-guess", { v: +range.value, r: revealed });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      revealed = true;
      draw(); describe();
      store("authgap-guess", { v: +range.value, r: true });
      $("#guess-btn").textContent = "Revealed";
    });
    out.textContent = range.value + "%";
    if (revealed) { describe(); $("#guess-btn").textContent = "Revealed"; }
    onResize(host, draw);
  }

  /* ------------------------------------------------------- chart: words */
  function initWords() {
    var host = $("#chart-words");
    function draw(w) {
      var narrow = w < 520;
      var L = narrow ? 112 : 150, R = 34, T = 8, rowH = 38, groupH = 30;
      var rows = []; var y = T; var lastGroup = null;
      DATA.words.forEach(function (d) {
        if (d.group !== lastGroup) { rows.push({ head: d.group, y: y + 18 }); y += groupH; lastGroup = d.group; }
        rows.push({ d: d, y: y + rowH / 2 }); y += rowH;
      });
      var H = y + 30;
      var x = function (v) { return L + (v / 60) * (w - L - R); };
      host.innerHTML = "";
      var s = svg("svg", { viewBox: "0 0 " + w + " " + H, width: w, height: H, "aria-hidden": "true" }, host);
      [0, 10, 20, 30, 40, 50, 60].forEach(function (v) {
        svg("line", { x1: x(v), x2: x(v), y1: T, y2: y, stroke: "var(--rule)", "stroke-width": 1 }, s);
        var t = svg("text", { x: x(v), y: H - 8, "text-anchor": "middle", "font-size": 11, fill: "var(--ink-3)" }, s);
        t.textContent = v + "%";
      });
      rows.forEach(function (r) {
        if (r.head) {
          var th = svg("text", { x: 0, y: r.y, "font-size": 11, "letter-spacing": "0.08em", fill: "var(--ink-3)" }, s);
          th.textContent = r.head.toUpperCase();
          return;
        }
        var d = r.d, lo = Math.min(d.execs, d.consumers), hi = Math.max(d.execs, d.consumers);
        var g = svg("g", { class: "hit" }, s);
        svg("rect", { x: 0, y: r.y - rowH / 2, width: w, height: rowH, fill: "transparent" }, g);
        var lab = svg("text", { x: 0, y: r.y + 4, "font-size": narrow ? 12 : 13, fill: "var(--ink)" }, g);
        lab.textContent = d.word;
        svg("line", { x1: x(lo), x2: x(hi), y1: r.y, y2: r.y, stroke: "var(--rule-strong)", "stroke-width": 3, "stroke-linecap": "round" }, g);
        [["execs", "var(--s-b)"], ["consumers", "var(--s-a)"]].forEach(function (k) {
          svg("circle", { cx: x(d[k[0]]), cy: r.y, r: 7, fill: k[1], stroke: "var(--surface)", "stroke-width": 2 }, g);
        });
        var tl = svg("text", { x: x(lo) - 12, y: r.y + 4, "text-anchor": "end", "font-size": 11, fill: "var(--ink-2)" }, g);
        tl.textContent = lo + "%";
        var tr = svg("text", { x: x(hi) + 12, y: r.y + 4, "text-anchor": "start", "font-size": 11, fill: "var(--ink-2)" }, g);
        tr.textContent = hi + "%";
        bindTip(g, "<strong>" + esc(d.word) + "</strong><br>Ad executives: " + d.execs + "%<br>Consumers: " + d.consumers + "%");
      });
    }
    onResize(host, draw);
  }

  /* ------------------------------------------------------- chart: slope */
  function initSlope() {
    var host = $("#chart-slope");
    function draw(w) {
      var H = 300, T = 30, B = 40, L = 44, R = w < 480 ? 96 : 130;
      var y = function (v) { return T + (1 - v / 50) * (H - T - B); };
      var x0 = L + 30, x1 = w - R;
      host.innerHTML = "";
      var s = svg("svg", { viewBox: "0 0 " + w + " " + H, width: w, height: H, "aria-hidden": "true" }, host);
      [0, 10, 20, 30, 40, 50].forEach(function (v) {
        svg("line", { x1: L, x2: w - 10, y1: y(v), y2: y(v), stroke: "var(--rule)", "stroke-width": 1 }, s);
        var t = svg("text", { x: L - 8, y: y(v) + 4, "text-anchor": "end", "font-size": 11, fill: "var(--ink-3)" }, s);
        t.textContent = v + "%";
      });
      [[x0, "2024"], [x1, "2026"]].forEach(function (c) {
        var t = svg("text", { x: c[0], y: H - 12, "text-anchor": "middle", "font-size": 12, "font-weight": 500, fill: "var(--ink)" }, s);
        t.textContent = c[1];
      });
      DATA.slope.forEach(function (d) {
        var col = d.key === "a" ? "var(--s-a)" : "var(--s-mute)";
        var g = svg("g", { class: "hit" }, s);
        svg("line", { x1: x0, x2: x1, y1: y(d.y2024), y2: y(d.y2026), stroke: col, "stroke-width": 3, "stroke-linecap": "round" }, g);
        [[x0, d.y2024], [x1, d.y2026]].forEach(function (p) {
          svg("circle", { cx: p[0], cy: y(p[1]), r: 7, fill: col, stroke: "var(--surface)", "stroke-width": 2 }, g);
        });
        var tl = svg("text", { x: x0 - 14, y: y(d.y2024) + 4, "text-anchor": "end", "font-size": 12, fill: "var(--ink)" }, g);
        tl.textContent = d.y2024 + "%";
        var tr = svg("text", { x: x1 + 14, y: y(d.y2026) - 3, "text-anchor": "start", "font-size": 12, "font-weight": 500, fill: "var(--ink)" }, g);
        tr.textContent = d.name;
        var tr2 = svg("text", { x: x1 + 14, y: y(d.y2026) + 13, "text-anchor": "start", "font-size": 12, fill: "var(--ink-2)" }, g);
        tr2.textContent = d.y2026 + "%";
        bindTip(g, "<strong>" + d.name + "</strong><br>Negative sentiment<br>2024: " + d.y2024 + "% → 2026: " + d.y2026 + "%");
      });
    }
    onResize(host, draw);
  }

  /* ------------------------------------------------------- chart: CTR */
  function initCTR() {
    var host = $("#chart-ctr"), btn = $("#ctr-toggle");
    var on = false;
    var max = 5;
    host.innerHTML = "";
    var wrap = h("div", { class: "hbar" });
    var axis = h("div", { class: "hbar__axis", "aria-hidden": "true" });
    for (var i = 0; i <= max; i++) axis.appendChild(h("span", { style: "left:" + (i / max) * 100 + "%" }, i + "%"));
    var fills = {};
    DATA.ctr.forEach(function (d) {
      var row = h("div", { class: "hbar__row hbar__row--" + d.id });
      var label = h("div", { class: "hbar__label" }, "<strong>" + esc(d.label) + "</strong><span>" + esc(d.note) + "</span>");
      var track = h("div", { class: "hbar__track" });
      var fill = h("span", { class: "hbar__fill hbar__fill--" + d.id });
      var val = h("span", { class: "hbar__val" }, (d.estimate ? "≈" : "") + d.value.toFixed(2) + "%");
      fill.appendChild(val);
      track.appendChild(fill);
      row.appendChild(label); row.appendChild(track);
      wrap.appendChild(row);
      fills[d.id] = { fill: fill, row: row, d: d };
      bindTip(track, "<strong>" + esc(d.label) + "</strong><br>Click-through: " + (d.estimate ? "≈" : "") + d.value.toFixed(2) + "%<br>" + esc(d.note));
    });
    var axisRow = h("div", { class: "hbar__row hbar__row--axis", "aria-hidden": "true" });
    axisRow.appendChild(h("div", { class: "hbar__label" }));
    axisRow.appendChild(axis);
    wrap.appendChild(axisRow);
    host.appendChild(wrap);

    function set() {
      fills.human.fill.style.width = (DATA.ctr[0].value / max) * 100 + "%";
      fills.ai.fill.style.width = (DATA.ctr[1].value / max) * 100 + "%";
      fills.labeled.fill.style.width = on ? (DATA.ctr[2].value / max) * 100 + "%" : "0%";
      fills.labeled.row.classList.toggle("is-off", !on);
      btn.setAttribute("aria-pressed", String(on));
    }
    btn.addEventListener("click", function () { on = !on; set(); });
    set();
  }

  /* ------------------------------------------------------- chart: energy */
  function initEnergy() {
    var host = $("#chart-energy");
    var lo = 1, hi = 7; // 10 J .. 10 million J
    var pos = function (j) { return ((Math.log10(j) - lo) / (hi - lo)) * 100; };
    var wrap = h("div", { class: "hbar hbar--energy" });
    DATA.energy.forEach(function (d) {
      var row = h("div", { class: "hbar__row" });
      row.appendChild(h("div", { class: "hbar__label" }, "<strong>" + esc(d.label) + "</strong><span>" + esc(d.sub) + "</span>"));
      var track = h("div", { class: "hbar__track" });
      var fill = h("span", { class: "hbar__fill hbar__fill--energy", style: "width:" + pos(d.joules) + "%" });
      fill.appendChild(h("span", { class: "hbar__val" }, esc(fmtJ(d.joules))));
      track.appendChild(fill);
      track.appendChild(h("span", { class: "hbar__equiv" }, "≈ " + esc(d.equiv)));
      row.appendChild(track);
      wrap.appendChild(row);
      bindTip(track, "<strong>" + esc(d.label) + "</strong><br>" + esc(fmtJ(d.joules)) + "<br>Like " + esc(d.equiv));
    });
    var axisRow = h("div", { class: "hbar__row hbar__row--axis", "aria-hidden": "true" });
    axisRow.appendChild(h("div", { class: "hbar__label" }));
    var axis = h("div", { class: "hbar__axis" });
    ["10 J", "100", "1K", "10K", "100K", "1M", "10M J"].forEach(function (t, i) {
      axis.appendChild(h("span", { style: "left:" + (i / 6) * 100 + "%" }, t));
    });
    axisRow.appendChild(axis);
    wrap.appendChild(axisRow);
    host.appendChild(wrap);
  }

  /* ------------------------------------------------------- timeline */
  function initTimeline() {
    var host = $("#timeline");
    var start = Date.parse("2024-10-01"), end = Date.parse("2026-12-15");
    function draw(w) {
      host.innerHTML = "";
      if (w < 640) {
        host.className = "timeline__chips";
        DATA.cases.forEach(function (c) {
          var b = h("a", { href: "#" + c.id, class: "tl-chip", "data-kind": c.kind }, "<span>" + c.label + "</span>" + esc(c.brand));
          host.appendChild(b);
        });
        bindJump();
        return;
      }
      host.className = "timeline__track";
      var pct = function (d) { return ((Date.parse(d) - start) / (end - start)) * 100; };
      host.appendChild(h("span", { class: "timeline__line" }));
      ["2025-01-01", "2026-01-01"].forEach(function (d) {
        host.appendChild(h("span", { class: "timeline__tick", style: "left:" + pct(d) + "%" }));
        host.appendChild(h("span", { class: "timeline__year", style: "left:" + pct(d) + "%" }, d.slice(0, 4)));
      });
      var lastX = -100;
      DATA.cases.forEach(function (c, i) {
        var p = pct(c.date);
        var px = (p / 100) * w;
        if (px - lastX < 26) { px = lastX + 26; p = (px / w) * 100; }
        lastX = px;
        var dot = h("a", { href: "#" + c.id, class: "tl-dot", "data-kind": c.kind, style: "left:" + p + "%", "aria-label": c.brand + ", " + c.label + (c.kind === "counter" ? ", counter-move" : ", backlash") });
        host.appendChild(dot);
        host.appendChild(h("span", { class: "tl-label " + (i % 2 ? "tl-label--down" : "tl-label--up"), style: "left:" + p + "%" }, esc(c.brand)));
        bindTip(dot, "<strong>" + esc(c.brand) + "</strong><br>" + c.label + " · " + (c.kind === "counter" ? "Counter-move" : "Backlash"));
      });
      bindJump();
    }
    function bindJump() {
      $$("a", host).forEach(function (a) {
        a.addEventListener("click", function () {
          var t = document.getElementById(a.getAttribute("href").slice(1));
          if (!t) return;
          t.classList.remove("is-flash"); void t.offsetWidth; t.classList.add("is-flash");
          hideTip();
        });
      });
    }
    onResize(host.parentNode, draw);
  }

  /* ------------------------------------------------------- video facades */
  function initVideos() {
    $$(".video[data-yt]").forEach(function (box) {
      var id = box.getAttribute("data-yt");
      var title = box.getAttribute("data-title") || "Video";
      var kind = box.getAttribute("data-kind") || "VIDEO";
      var frame = h("div", { class: "video__frame" });
      var play = h("button", { type: "button", class: "video__play", "aria-label": "Play video: " + title.replace(/&[a-z]+;/g, "") });
      play.innerHTML = '<span class="video__badge">&#9654; ' + kind + '</span><span class="video__btn" aria-hidden="true">&#9654; PLAY</span><span class="video__title">' + title + '</span>';
      frame.appendChild(play);
      var links = h("div", { class: "video__links" }, '<span>Video via YouTube</span><a href="https://www.youtube.com/watch?v=' + id + '" target="_blank" rel="noopener">Watch on YouTube &#8599;</a>');
      box.appendChild(frame); box.appendChild(links);
      play.addEventListener("click", function () {
        var f = h("iframe", {
          src: "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0",
          title: title.replace(/&[a-z]+;/g, ""),
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
          allowfullscreen: "",
          loading: "lazy"
        });
        frame.innerHTML = "";
        frame.appendChild(f);
      });
    });
  }

  /* ------------------------------------------------------- poll */
  function initPoll() {
    var form = $("#poll-form"), summary = $("#poll-summary"), reset = $("#poll-reset");
    var answers = store("authgap-poll-v1") || {};

    POLL.forEach(function (q, qi) {
      var fs = h("fieldset", { class: "q", id: "q-" + q.id });
      fs.appendChild(h("legend", null, '<span class="q__n">QUESTION ' + (qi + 1) + ' / ' + POLL.length + '</span>' + esc(q.q)));
      var opts = h("div", { class: "q__opts" });
      q.opts.forEach(function (o) {
        var wrap = h("div", { class: "opt" });
        var id = "poll-" + q.id + "-" + o[0];
        var input = h("input", { type: "radio", name: "poll-" + q.id, id: id, value: o[0] });
        wrap.appendChild(input);
        wrap.appendChild(h("label", { for: id }, esc(o[1])));
        opts.appendChild(wrap);
        input.addEventListener("change", function () {
          answers[q.id] = o[0];
          store("authgap-poll-v1", answers);
          renderReveal(q, fs);
          renderSummary();
        });
      });
      fs.appendChild(opts);
      fs.appendChild(h("div", { class: "q__reveal", hidden: "" }));
      var qwrap = h("div", { class: "qwrap" });
      qwrap.appendChild(fs);
      form.appendChild(qwrap);
      if (answers[q.id]) {
        var inp = document.getElementById("poll-" + q.id + "-" + answers[q.id]);
        if (inp) { inp.checked = true; renderReveal(q, fs); }
      }
    });

    function renderReveal(q, fs) {
      var box = $(".q__reveal", fs);
      var a = answers[q.id];
      if (!a) { box.hidden = true; box.innerHTML = ""; return; }
      var html = '<p class="q__you">YOU SAID: ' + esc(q.short[a]).toUpperCase() + '</p><p>' + esc(q.reveal[a]) + ' <a class="cite" href="#' + q.cite[0] + '">(' + esc(q.cite[1]) + ')</a></p><div class="meter">';
      q.meters.forEach(function (m) {
        html += '<div class="meter__row"><span>' + esc(m.label) + '</span><span class="meter__val">' + m.value + '%</span></div>' +
          '<div class="meter__bar" role="img" aria-label="' + esc(m.label) + ': ' + m.value + '%"><span class="meter__fill' + (m.key === "b" ? " meter__fill--b" : m.key === "m" ? " meter__fill--m" : "") + '" style="width:' + m.value + '%"></span></div>';
      });
      html += "</div>";
      box.innerHTML = html;
      box.hidden = false;
      initCites();
    }

    function renderSummary() {
      var done = POLL.filter(function (q) { return answers[q.id]; });
      if (done.length < POLL.length) {
        summary.innerHTML = done.length ? '<p class="q__you">' + done.length + " OF " + POLL.length + " ANSWERED</p>" : "";
        return;
      }
      var html = "<h3>Your answers vs. the research</h3><table class=\"data-table\"><thead><tr><th scope=\"col\">Question</th><th scope=\"col\">You</th><th scope=\"col\">The research</th></tr></thead><tbody>";
      POLL.forEach(function (q) {
        html += "<tr><th scope=\"row\">" + esc(q.q) + "</th><td>" + esc(q.short[answers[q.id]]) + "</td><td>" + esc(q.headline) + "</td></tr>";
      });
      html += "</tbody></table><p>Keep your answers in mind as you read. The chapters below show where these numbers come from, and why they matter to the brands trying to win you over.</p><p><a class=\"btn btn--primary\" href=\"#story\">Start reading &darr;</a></p>";
      summary.innerHTML = html;
    }

    reset.addEventListener("click", function () {
      answers = {};
      store("authgap-poll-v1", answers);
      $$("input[type=radio]", form).forEach(function (i) { i.checked = false; });
      $$(".q__reveal", form).forEach(function (b) { b.hidden = true; b.innerHTML = ""; });
      renderSummary();
    });
    renderSummary();
  }

  /* ------------------------------------------------------- chart: Pew */
  function initPew() {
    var host = $("#chart-pew");
    if (!host) return;
    var cls = { a: "a", m: "m", b: "b" };
    var feel = DATA.pew.feel;
    var sum = feel.reduce(function (t, d) { return t + d.value; }, 0);
    var html = '<div class="pew"><div><p class="pew__q">How do you feel about the increased use of AI in daily life?</p><div class="stack">';
    feel.forEach(function (d) {
      html += '<span class="stack__seg stack__seg--' + cls[d.key] + '" style="flex:' + d.value + '" data-tip="' + esc(d.label) + ': ' + d.value + '%">' + (d.value >= 8 ? d.value + "%" : "") + "</span>";
    });
    if (sum < 100) html += '<span class="stack__seg stack__seg--rest" style="flex:' + (100 - sum) + '"></span>';
    html += '</div><div class="stack__legend">';
    feel.forEach(function (d) { html += '<span><i class="sw--' + cls[d.key] + '" style="background:var(--s-' + (d.key === "m" ? "mute" : d.key) + ')"></i>' + esc(d.label) + "</span>"; });
    html += '</div></div><div class="pew__pair"><p class="pew__q">Will AI improve or worsen people\'s ability to think creatively?</p>';
    DATA.pew.creative.forEach(function (d) {
      html += '<div class="pew__row"><span>' + esc(d.label) + '</span><div class="pew__track" data-tip="' + esc(d.label) + ': ' + d.value + '%"><span class="pew__fill" style="width:' + d.value + '%;background:var(--s-' + d.key + ')"><b>' + d.value + "%</b></span></div></div>";
    });
    html += "</div></div>";
    host.innerHTML = html;
    $$("[data-tip]", host).forEach(function (n) { bindTip(n, esc(n.getAttribute("data-tip"))); });
  }

  /* ------------------------------------------------------- ad examples (images) */
  function initExamples() {
    $$(".example[data-img]").forEach(function (fig) {
      var src = fig.getAttribute("data-img"), alt = fig.getAttribute("data-alt") || "";
      var link = fig.getAttribute("data-link"), linkText = fig.getAttribute("data-linktext") || "View the ad";
      var kind = fig.getAttribute("data-kind") || "AD";
      var frame = h("div", { class: "example__frame" });
      var cap = h("figcaption", { class: "example__cap", hidden: "" }, "<span>" + kind + "</span>" + (link ? '<a href="' + esc(link) + '" target="_blank" rel="noopener">Source &#8599;</a>' : ""));
      fig.appendChild(frame); fig.appendChild(cap);
      function fallback() {
        frame.innerHTML = "";
        var a = h("a", { class: "example__empty", href: link || "#", target: "_blank", rel: "noopener" },
          '<span class="example__badge">' + kind + '</span><span class="example__cta">' + esc(linkText) + " &#8599;</span>");
        frame.appendChild(a);
      }
      var img = new Image();
      img.alt = alt;
      img.loading = "lazy";
      img.onload = function () { frame.innerHTML = ""; frame.appendChild(img); cap.hidden = false; };
      img.onerror = fallback;
      fallback();
      img.src = src;
    });
  }

  /* ------------------------------------------------------- back to your spot */
  function initBackSpot() {
    var btn = $("#backspot");
    var saved = null, left = false;
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a.cite");
      if (!a) return;
      saved = window.scrollY;
      left = false;
      btn.hidden = false;
    });
    btn.addEventListener("click", function () {
      if (saved == null) return;
      window.scrollTo({ top: saved, behavior: reduceMotion ? "auto" : "smooth" });
      saved = null;
      btn.hidden = true;
    });
    window.addEventListener("scroll", function () {
      if (saved == null) return;
      var d = Math.abs(window.scrollY - saved);
      if (d > 400) left = true;
      else if (left && d < 120) { saved = null; btn.hidden = true; }
    }, { passive: true });
  }

  /* ------------------------------------------------------- light / dark toggle */
  function initTheme() {
    var btn = $("#theme-toggle");
    if (!btn) return;
    var root = document.documentElement;
    var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
    var saved = null;
    try { saved = localStorage.getItem("authgap-theme"); } catch (e) {}
    if (saved === "dark" || saved === "light") root.setAttribute("data-theme", saved);
    function current() {
      var t = root.getAttribute("data-theme");
      if (t === "dark" || t === "light") return t;
      return mq && mq.matches ? "dark" : "light";
    }
    function render() {
      var dark = current() === "dark";
      btn.setAttribute("aria-pressed", String(dark));
      btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
      $(".theme-toggle__icon", btn).innerHTML = dark ? "&#9788;" : "&#9790;";
      $(".theme-toggle__label", btn).textContent = dark ? "Light" : "Dark";
    }
    btn.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("authgap-theme", next); } catch (e) {}
      render();
    });
    if (mq && mq.addEventListener) mq.addEventListener("change", render);
    new MutationObserver(render).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    render();
  }

  /* ------------------------------------------------------- boot */
  function start() {
    initTheme();
    initNav();
    initTables();
    initGuess();
    initWords();
    initSlope();
    initPew();
    initExamples();
    initBackSpot();
    initCTR();
    initEnergy();
    initTimeline();
    initVideos();
    initPoll();
    initCites();
    document.addEventListener("scroll", hideTip, { passive: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
