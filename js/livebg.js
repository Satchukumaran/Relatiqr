/* RelatiQR — premium live background
   Animated neon node-network drawn on a fixed canvas behind all content.
   Theme via <body data-bg="dark"> (default) or data-bg="light".
   Respects prefers-reduced-motion and pauses when the tab is hidden. */
(function () {
  function init() {
    var body = document.body;
    // Optional scoped host (e.g. a dark hero). Falls back to full-page fixed canvas.
    var host = document.querySelector('[data-livebg-host]');
    var scoped = !!host;
    var theme = (scoped ? host.getAttribute('data-bg') : body.getAttribute('data-bg')) || 'dark';
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // palette per theme
    var palettes = {
      dark:  { dots: ['#e8c987', '#c45b7c', '#9b6bd1', '#5fd3c8'], line: '230,200,235', lineAlpha: 0.18, dotAlpha: 0.9 },
      light: { dots: ['#d4a657', '#c45b7c', '#7a2a55', '#9b6bd1'], line: '122,42,85',   lineAlpha: 0.12, dotAlpha: 0.55 }
    };
    var pal = palettes[theme] || palettes.dark;

    // canvas
    var canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    if (scoped) {
      canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;';
      if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
      host.insertBefore(canvas, host.firstChild);
      // keep host children above the canvas
      [].forEach.call(host.children, function (el) {
        if (el !== canvas && getComputedStyle(el).position === 'static') el.style.position = 'relative';
      });
    } else {
      canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;';
      if (body.firstChild) body.insertBefore(canvas, body.firstChild);
      else body.appendChild(canvas);
      if (!document.getElementById('livebg-style')) {
        var st = document.createElement('style');
        st.id = 'livebg-style';
        st.textContent = 'body > *:not(canvas){position:relative;z-index:1;}';
        document.head.appendChild(st);
      }
    }

    var ctx = canvas.getContext('2d');
    var W, H, DPR, nodes, mouse = { x: -9999, y: -9999 };

    function size() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      if (scoped) { W = host.clientWidth; H = host.clientHeight; }
      else { W = window.innerWidth; H = window.innerHeight; }
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      build();
    }

    function build() {
      var density = Math.min(72, Math.max(28, Math.round((W * H) / 26000)));
      nodes = [];
      for (var i = 0; i < density; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          r: Math.random() * 1.8 + 1.1,
          c: pal.dots[(Math.random() * pal.dots.length) | 0],
          pulse: Math.random() * Math.PI * 2
        });
      }
    }

    var LINK = 150;
    function frame() {
      ctx.clearRect(0, 0, W, H);

      // connecting lines
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j];
          var dx = a.x - b.x, dy = a.y - b.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            var al = (1 - d / LINK) * pal.lineAlpha;
            ctx.strokeStyle = 'rgba(' + pal.line + ',' + al.toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }

      // glowing nodes
      for (var k = 0; k < nodes.length; k++) {
        var n = nodes[k];
        if (!reduce) {
          n.x += n.vx; n.y += n.vy;
          if (n.x < -20) n.x = W + 20; if (n.x > W + 20) n.x = -20;
          if (n.y < -20) n.y = H + 20; if (n.y > H + 20) n.y = -20;
          // gentle cursor attraction
          var mdx = mouse.x - n.x, mdy = mouse.y - n.y;
          var md = Math.sqrt(mdx * mdx + mdy * mdy);
          if (md < 130) { n.x += mdx * 0.004; n.y += mdy * 0.004; }
          n.pulse += 0.02;
        }
        var glow = 0.55 + Math.sin(n.pulse) * 0.25;
        ctx.beginPath();
        ctx.fillStyle = n.c;
        ctx.shadowColor = n.c;
        ctx.shadowBlur = 14 * glow;
        ctx.globalAlpha = pal.dotAlpha * glow;
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      if (running) raf = requestAnimationFrame(frame);
    }

    var raf, running = true;
    window.addEventListener('resize', size, { passive: true });
    window.addEventListener('mousemove', function (e) {
      if (scoped) { var r = host.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; }
      else { mouse.x = e.clientX; mouse.y = e.clientY; }
    }, { passive: true });
    window.addEventListener('mouseout', function () { mouse.x = -9999; mouse.y = -9999; });
    document.addEventListener('visibilitychange', function () {
      running = !document.hidden;
      if (running) { raf = requestAnimationFrame(frame); }
      else if (raf) cancelAnimationFrame(raf);
    });

    size();
    if (reduce) { frame(); /* draw one static frame */ }
    else raf = requestAnimationFrame(frame);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
