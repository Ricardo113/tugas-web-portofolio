/* ============================================================
   MANUEL · PORTFOLIO — script.js
   Mid Semester Project 2026
   Fitur: Navbar, Dark/Light Mode, Typewriter, Scroll Reveal,
          Gallery Filter, Form Validation
   ============================================================ */

/* ============================================================
   1. NAVBAR — scroll effect + hamburger mobile
   ============================================================ */
(function initNavbar() {
  var nav    = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var links  = document.getElementById('navLinks');

  if (!nav) return;

  // Scroll → solid navbar
  window.addEventListener('scroll', function () {
    nav.classList.toggle('solid', window.scrollY > 60);
  });

  // Hamburger toggle
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
    });

    // Close menu saat klik link
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.classList.remove('open');
        links.classList.remove('open');
      });
    });
  }
})();


/* ============================================================
   2. DARK / LIGHT MODE TOGGLE
   ============================================================ */
(function initTheme() {
  var btn = document.getElementById('themeToggle');
  if (!btn) return;

  // Load saved preference
  var saved = localStorage.getItem('theme');
  if (saved === 'light') {
    document.body.classList.add('light');
    btn.textContent = '☀️ Light';
  } else {
    btn.textContent = '🌙 Dark';
  }

  btn.addEventListener('click', function () {
    var isLight = document.body.classList.toggle('light');
    btn.textContent = isLight ? '☀️ Light' : '🌙 Dark';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
})();


/* ============================================================
   3. TYPEWRITER EFFECT (index.html)
   ============================================================ */
(function initTypewriter() {
  var el = document.getElementById('typewriter');
  if (!el) return;

  var words = ['MANUEL', 'DEVELOPER', 'CULER'];
  var wi = 0, ci = 0, deleting = false;

  function tick() {
    var word = words[wi];
    el.textContent = deleting ? word.slice(0, --ci) : word.slice(0, ++ci);

    if (!deleting && ci === word.length) {
      deleting = true;
      setTimeout(tick, 1500);
      return;
    }
    if (deleting && ci === 0) {
      deleting = false;
      wi = (wi + 1) % words.length;
    }
    setTimeout(tick, deleting ? 55 : 100);
  }
  tick();
})();


/* ============================================================
   4. SCROLL REVEAL
   ============================================================ */
(function initScrollReveal() {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { obs.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('visible'); });
  }
})();


/* ============================================================
   5. GALLERY FILTER (gallery.html)
   ============================================================ */
(function initGalleryFilter() {
  var filterBtns = document.querySelectorAll('.filter-btn');
  var categories = document.querySelectorAll('.g-category');
  if (!filterBtns.length) return;

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-filter');

      // Update active button
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      // Show/hide categories
      categories.forEach(function (cat) {
        if (filter === 'all') {
          cat.classList.remove('hidden');
        } else {
          if (cat.getAttribute('data-cat') === filter) {
            cat.classList.remove('hidden');
          } else {
            cat.classList.add('hidden');
          }
        }
      });
    });
  });
})();


/* ============================================================
   6. FORM VALIDATION (contact.html)
   ============================================================ */
(function initFormValidation() {
  var form = document.getElementById('contactForm');
  if (!form) return;

  var submitBtn = document.getElementById('submitBtn');
  var successMsg = document.getElementById('formSuccess');

  // Helper: show field status
  function setStatus(fieldId, msgId, isValid, message) {
    var field = document.getElementById(fieldId);
    var msg   = document.getElementById(msgId);
    if (!field || !msg) return;

    field.classList.toggle('error',   !isValid);
    field.classList.toggle('success',  isValid);
    msg.textContent = message;
    msg.className   = 'field-msg show ' + (isValid ? 'ok' : 'err');
  }

  function clearStatus(fieldId, msgId) {
    var field = document.getElementById(fieldId);
    var msg   = document.getElementById(msgId);
    if (field) { field.classList.remove('error', 'success'); }
    if (msg)   { msg.className = 'field-msg'; msg.textContent = ''; }
  }

  // Validate on blur
  var rules = [
    {
      id: 'nama', msgId: 'namaMsg',
      validate: function (v) { return v.trim().length >= 2; },
      errMsg: 'Nama minimal 2 karakter.',
      okMsg:  'Nama valid ✓'
    },
    {
      id: 'email', msgId: 'emailMsg',
      validate: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
      errMsg: 'Format email tidak valid.',
      okMsg:  'Email valid ✓'
    },
    {
      id: 'telp', msgId: 'telpMsg',
      validate: function (v) { return v.trim() === '' || /^[\d\s+\-()]{8,15}$/.test(v.trim()); },
      errMsg: 'Format nomor tidak valid.',
      okMsg:  'Nomor valid ✓'
    },
    {
      id: 'topik', msgId: 'topikMsg',
      validate: function (v) { return v !== ''; },
      errMsg: 'Pilih topik pesan.',
      okMsg:  'Topik dipilih ✓'
    },
    {
      id: 'pesan', msgId: 'pesanMsg',
      validate: function (v) { return v.trim().length >= 10; },
      errMsg: 'Pesan minimal 10 karakter.',
      okMsg:  'Pesan valid ✓'
    }
  ];

  rules.forEach(function (rule) {
    var field = document.getElementById(rule.id);
    if (!field) return;

    field.addEventListener('blur', function () {
      var isValid = rule.validate(field.value);
      setStatus(rule.id, rule.msgId, isValid, isValid ? rule.okMsg : rule.errMsg);
    });

    field.addEventListener('focus', function () {
      clearStatus(rule.id, rule.msgId);
    });
  });

  // Submit
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var allValid = true;

    rules.forEach(function (rule) {
      var field = document.getElementById(rule.id);
      if (!field) return;
      var isValid = rule.validate(field.value);
      setStatus(rule.id, rule.msgId, isValid, isValid ? rule.okMsg : rule.errMsg);
      if (!isValid) allValid = false;
    });

    // Checkbox
    var cb = document.getElementById('setuju');
    var cbMsg = document.getElementById('setujuMsg');
    if (cb && !cb.checked) {
      if (cbMsg) { cbMsg.textContent = 'Harap centang persetujuan.'; cbMsg.className = 'field-msg show err'; }
      allValid = false;
    } else if (cb && cbMsg) {
      cbMsg.className = 'field-msg';
    }

    if (!allValid) return;

    // Simulate send
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Mengirim...';
    }

    setTimeout(function () {
      if (successMsg) { successMsg.classList.add('show'); }
      form.reset();
      rules.forEach(function (rule) { clearStatus(rule.id, rule.msgId); });
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Kirim Pesan →';
      }
      setTimeout(function () {
        if (successMsg) { successMsg.classList.remove('show'); }
      }, 5000);
    }, 1200);
  });
})();


/* ============================================================
   7. SMOOTH SCROLL untuk anchor links
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    var target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ============================================================
   8. CUSTOM CURSOR
   ============================================================ */
(function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return;

  var dot  = document.createElement('div');
  var ring = document.createElement('div');
  dot.id   = 'cursor-dot';
  ring.id  = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  var mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', function (e) {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
    dot.classList.remove('hide');
    ring.classList.remove('hide');
  });

  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
    requestAnimationFrame(animRing);
  })();

  document.addEventListener('mouseleave', function () {
    dot.classList.add('hide');
    ring.classList.add('hide');
  });

  var hoverEls = 'a, button, .work-item, .stat-card, .g-item, .chip, .filter-btn, .social-btn, input, textarea, select';
  document.querySelectorAll(hoverEls).forEach(function (el) {
    el.addEventListener('mouseenter', function () { ring.classList.add('hover'); dot.classList.add('hover'); });
    el.addEventListener('mouseleave', function () { ring.classList.remove('hover'); dot.classList.remove('hover'); });
  });

  document.addEventListener('mousedown', function () { ring.classList.add('click'); });
  document.addEventListener('mouseup',   function () { ring.classList.remove('click'); });
})();


/* ============================================================
   9. PAGE TRANSITION — Blaugrana Stripe Wipe + Stadium Flash
   ============================================================ */
(function initPageTransition() {
  var STRIPE_COUNT = 8;
  var DURATION     = 500;
  var STAGGER      = 40;

  var overlay = document.createElement('div');
  overlay.id  = 'page-transition';
  for (var i = 0; i < STRIPE_COUNT; i++) {
    var s = document.createElement('div');
    s.className = 'pt-stripe';
    s.style.background = i % 2 === 0 ? '#004D98' : '#A50044';
    overlay.appendChild(s);
  }
  var flash = document.createElement('div');
  flash.id  = 'page-flash';
  document.body.appendChild(overlay);
  document.body.appendChild(flash);

  var stripes = overlay.querySelectorAll('.pt-stripe');

  function coverScreen(cb) {
    overlay.style.pointerEvents = 'all';
    stripes.forEach(function (s, i) {
      setTimeout(function () {
        s.style.transition = 'transform ' + DURATION + 'ms cubic-bezier(.76,0,.24,1)';
        s.style.transform  = 'translateY(0)';
      }, i * STAGGER);
    });
    setTimeout(cb, STRIPE_COUNT * STAGGER + DURATION);
  }

  function uncoverScreen() {
    [0, 120, 220].forEach(function (delay, fi) {
      setTimeout(function () {
        flash.style.opacity = String(0.5 - fi * 0.15);
        setTimeout(function () { flash.style.opacity = '0'; }, 80);
      }, delay);
    });
    setTimeout(function () {
      stripes.forEach(function (s, i) {
        setTimeout(function () {
          s.style.transition = 'transform ' + DURATION + 'ms cubic-bezier(.76,0,.24,1)';
          s.style.transform  = 'translateY(-105%)';
        }, i * STAGGER);
      });
      setTimeout(function () {
        overlay.style.pointerEvents = 'none';
        stripes.forEach(function (s) {
          s.style.transition = 'none';
          s.style.transform  = 'translateY(105%)';
        });
      }, STRIPE_COUNT * STAGGER + DURATION + 50);
    }, 320);
  }

  document.querySelectorAll('a[href]').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') ||
        href.startsWith('mailto') || href.startsWith('tel') ||
        link.target === '_blank') return;
    link.addEventListener('click', function (e) {
      e.preventDefault();
      coverScreen(function () { window.location.href = href; });
    });
  });

  if (sessionStorage.getItem('pt') === '1') {
    sessionStorage.removeItem('pt');
    stripes.forEach(function (s) {
      s.style.transition = 'none';
      s.style.transform  = 'translateY(0)';
    });
    uncoverScreen();
  }
  window.addEventListener('beforeunload', function () {
    sessionStorage.setItem('pt', '1');
  });
})();