/* rommelbartolome.com — interactions */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* nav background on scroll */
  var nav = document.querySelector(".site-nav");
  function onScroll() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 24);
    var bar = document.getElementById("progress");
    if (bar) {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.width = max > 0 ? (h.scrollTop / max) * 100 + "%" : "0";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* scroll reveal */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 6, 4) * 60 + "ms";
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* count-up stats */
  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var dur = 1400, t0 = null;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    if ("IntersectionObserver" in window && !reduced) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { cio.observe(el); });
    } else {
      counters.forEach(function (el) { el.textContent = el.getAttribute("data-count"); });
    }
  }

  /* hero constellation */
  var canvas = document.getElementById("constellation");
  if (canvas && !reduced) {
    var ctx = canvas.getContext("2d");
    var dots = [], W, H, DPR = Math.min(window.devicePixelRatio || 1, 2);
    var mouse = { x: -9999, y: -9999 };

    function resize() {
      var r = canvas.parentElement.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      var n = Math.min(110, Math.floor((W * H) / 16000));
      dots = [];
      for (var i = 0; i < n; i++) {
        dots.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
          r: Math.random() * 1.6 + 0.6
        });
      }
    }
    resize();
    window.addEventListener("resize", resize);
    canvas.parentElement.addEventListener("pointermove", function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    canvas.parentElement.addEventListener("pointerleave", function () {
      mouse.x = -9999; mouse.y = -9999;
    });

    var LINK = 130;
    function frame() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > W) d.vx *= -1;
        if (d.y < 0 || d.y > H) d.vy *= -1;
        /* gentle pull toward cursor */
        var mdx = mouse.x - d.x, mdy = mouse.y - d.y;
        var md = Math.hypot(mdx, mdy);
        if (md < 160 && md > 0.001) { d.x += (mdx / md) * 0.25; d.y += (mdy / md) * 0.25; }
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(198,242,78,0.5)";
        ctx.fill();
        for (var j = i + 1; j < dots.length; j++) {
          var o = dots[j];
          var dx = d.x - o.x, dy = d.y - o.y;
          var dist = Math.hypot(dx, dy);
          if (dist < LINK) {
            ctx.beginPath();
            ctx.moveTo(d.x, d.y); ctx.lineTo(o.x, o.y);
            ctx.strokeStyle = "rgba(198,242,78," + (0.13 * (1 - dist / LINK)) + ")";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
})();
