/* =================================================================
   Portafolio 2026 — interacciones
================================================================= */
(function () {
  'use strict';

  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------
     1. PRELOADER
  --------------------------------------------------------------- */
  (function preloader () {
    const el  = $('#loader');
    const bar = $('#loaderBar');
    const pct = $('#loaderPct');
    if (!el) return;

    let p = 0;
    const tick = setInterval(() => {
      p = Math.min(100, p + Math.random() * 18 + 6);
      bar.style.width = p + '%';
      pct.textContent = Math.round(p) + '%';
      if (p >= 100) {
        clearInterval(tick);
        setTimeout(() => {
          el.classList.add('is-done');
          document.body.classList.remove('is-locked');
          startReveals();
        }, 260);
      }
    }, 140);

    document.body.classList.add('is-locked');
    // red de seguridad por si algo falla
    setTimeout(() => {
      el.classList.add('is-done');
      document.body.classList.remove('is-locked');
    }, 4000);
  })();

  /* ---------------------------------------------------------------
     2. CURSOR PERSONALIZADO
  --------------------------------------------------------------- */
  (function cursor () {
    const dot = $('#cursor');
    const lab = $('#cursorLabel');
    if (!dot || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;

    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;

    addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; });

    (function loop () {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      dot.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(loop);
    })();

    document.addEventListener('mouseover', e => {
      const t = e.target.closest('[data-cursor], .card');
      if (t) {
        dot.classList.add('is-big');
        lab.textContent = t.dataset.cursor || 'Ver';
      } else {
        dot.classList.remove('is-big');
        lab.textContent = '';
      }
    });
  })();

  /* ---------------------------------------------------------------
     3. HEADER + PROGRESO + NAV ACTIVA
  --------------------------------------------------------------- */
  (function chrome () {
    const header   = $('#header');
    const progress = $('#scrollProgress');
    const links    = $$('.nav__link');
    const sections = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
    let ticking = false;

    function update () {
      const y   = scrollY;
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
      header.classList.toggle('is-stuck', y > 40);

      let current = sections[0];
      sections.forEach(s => { if (y >= s.offsetTop - innerHeight * 0.35) current = s; });
      links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + current.id));

      ticking = false;
    }

    addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();

    // menú móvil
    const burger = $('#burger'), nav = $('#nav');
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', e => {
      if (e.target.matches('.nav__link')) {
        nav.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });

    $('#totop').addEventListener('click', () =>
      scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));
  })();

  /* ---------------------------------------------------------------
     4. REVEAL AL HACER SCROLL
  --------------------------------------------------------------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add('is-in');

      if (el.classList.contains('hero__stats') || el.classList.contains('about__skills')) {
        animateNumbers(el);
        animateBars(el);
      }
      io.unobserve(el);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

  function startReveals () { $$('.reveal').forEach(el => io.observe(el)); }
  // si el preloader fallara, igual se activan
  setTimeout(startReveals, 4200);

  function animateNumbers (scope) {
    $$('[data-count]', scope).forEach(n => {
      const to = +n.dataset.count;
      let i = 0;
      const step = () => {
        i += Math.max(1, Math.ceil(to / 22));
        n.textContent = i >= to ? to : i;
        if (i < to) requestAnimationFrame(step);
      };
      step();
    });
  }

  function animateBars (scope) {
    $$('.skills li', scope).forEach((li, i) => {
      setTimeout(() => { $('b', li).style.width = li.dataset.level + '%'; }, i * 130);
    });
  }

  /* ---------------------------------------------------------------
     5. PARALLAX SUAVE
  --------------------------------------------------------------- */
  if (!reduced) {
    const layers = $$('[data-parallax]');
    addEventListener('scroll', () => {
      const y = scrollY;
      layers.forEach(l => {
        l.style.transform = `translate3d(0, ${y * parseFloat(l.dataset.parallax)}px, 0)`;
      });
    }, { passive: true });
  }

  /* ---------------------------------------------------------------
     6. GRID DE PROYECTOS
  --------------------------------------------------------------- */
  const DATA = window.PROJECTS || [];
  const grid = $('#grid');

  DATA.forEach((p, i) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.dataset.cat = p.cat;
    card.dataset.index = i;
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Abrir el proyecto ${p.title}`);

    const dots = p.palette.length
      ? `<div class="card__dots">${p.palette.map(c => `<i style="background:${c.hex}"></i>`).join('')}</div>`
      : '<div class="card__dots"></div>';

    card.innerHTML = `
      <div class="card__media">
        <span class="card__tag">${p.catLabel}</span>
        <img src="${p.cover}" alt="Vista del proyecto ${p.title}" loading="lazy">
      </div>
      <div class="card__body">
        <div class="card__top">
          <h3 class="card__title">${p.title}</h3>
          <span class="card__year">${p.year}</span>
        </div>
        <p class="card__tagline">${p.tagline}</p>
        <div class="card__foot">
          ${dots}
          <span class="card__more">Ver proyecto →</span>
        </div>
      </div>`;

    card.addEventListener('click', () => openModal(i));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(i); }
    });

    grid.appendChild(card);
  });

  // aparición escalonada de las tarjetas
  const cardIO = new IntersectionObserver(es => {
    es.forEach((en, k) => {
      if (!en.isIntersecting) return;
      setTimeout(() => en.target.classList.add('is-in'), k * 90);
      cardIO.unobserve(en.target);
    });
  }, { threshold: 0.12 });
  $$('.card').forEach(c => cardIO.observe(c));

  /* ---------------------------------------------------------------
     7. FILTROS
  --------------------------------------------------------------- */
  $$('.filter').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.filter').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const f = btn.dataset.filter;
      $$('.card').forEach(c => {
        const show = f === 'all' || c.dataset.cat === f;
        c.classList.toggle('is-hidden', !show);
        if (show) {
          c.classList.remove('is-in');
          requestAnimationFrame(() => requestAnimationFrame(() => c.classList.add('is-in')));
        }
      });
    });
  });

  /* ---------------------------------------------------------------
     8. MODAL / VISOR
  --------------------------------------------------------------- */
  const modal = $('#modal');
  const stage = $('#mStage');
  let current = 0;
  let lastFocus = null;

  function render (i) {
    const p = DATA[i];
    current = i;

    $('#mCat').textContent   = p.catLabel;
    $('#mTitle').textContent = p.title;
    $('#mYear').textContent  = p.year;
    $('#mDesc').textContent  = p.desc;
    $('#mRole').textContent  = p.role;
    $('#mIdx').textContent   = i + 1;
    $('#mTot').textContent   = DATA.length;

    const img = $('#mImg');
    img.src = p.board;
    img.alt = `Tablero completo del proyecto ${p.title}`;
    $('#mOpen').href = p.board;
    stage.classList.remove('is-zoom');

    // tipografía
    $('#mTypoBlock').hidden = !p.typo;
    $('#mTypo').textContent = p.typo || '';

    // herramientas
    $('#mToolsBlock').hidden = !p.tools.length;
    $('#mTools').innerHTML = p.tools.map(t => `<span>${t}</span>`).join('');

    // paleta
    $('#mPalBlock').hidden = !p.palette.length;
    $('#mPalette').innerHTML = p.palette.map(c => `
      <button class="sw" data-hex="${c.hex}" title="Copiar ${c.hex}">
        <i style="background:${c.hex}"></i>
        <u>${c.hex}</u>
        <small>${c.name}</small>
      </button>`).join('');

    $('.modal__side').scrollTop = 0;
    $('#mStage').scrollTop = 0;
  }

  function openModal (i) {
    lastFocus = document.activeElement;
    render(i);
    modal.hidden = false;
    document.body.classList.add('is-locked');
    requestAnimationFrame(() => modal.classList.add('is-open'));
    $('#modal .modal__x').focus();
  }

  function closeModal () {
    modal.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    setTimeout(() => { modal.hidden = true; }, 360);
    if (lastFocus) lastFocus.focus();
  }

  const go = step => render((current + step + DATA.length) % DATA.length);

  modal.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeModal(); });
  $('#mPrev').addEventListener('click', () => go(-1));
  $('#mNext').addEventListener('click', () => go(1));

  // zoom del tablero
  stage.addEventListener('click', () => {
    stage.classList.toggle('is-zoom');
    $('#mHint').textContent = stage.classList.contains('is-zoom')
      ? 'Arrastra o desplázate para recorrer · clic para reducir'
      : 'Clic en la imagen para ampliar';
  });

  // copiar color
  $('#mPalette').addEventListener('click', e => {
    const sw = e.target.closest('.sw');
    if (!sw) return;
    const hex = sw.dataset.hex;
    const done = () => {
      sw.classList.add('copied');
      setTimeout(() => sw.classList.remove('copied'), 1400);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(hex).then(done).catch(done);
    else done();
  });

  // teclado
  addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape')     closeModal();
    if (e.key === 'ArrowLeft')  go(-1);
    if (e.key === 'ArrowRight') go(1);
  });

  // deslizar en móvil
  let tx = 0;
  stage.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', e => {
    if (stage.classList.contains('is-zoom')) return;
    const d = e.changedTouches[0].clientX - tx;
    if (Math.abs(d) > 70) go(d < 0 ? 1 : -1);
  }, { passive: true });

})();
