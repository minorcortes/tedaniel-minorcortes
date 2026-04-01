/* ==========================================================================
   Té Daniel — Baby Shower Landing Page
   Core JS: Mobile nav, scroll spy, back-to-top
   ========================================================================== */

(function() {
  'use strict';

  // ---- Premium Preloader (Fase 1: INMEDIATA) ----
  function initPremiumLoader() {
    const loader = document.getElementById('premium-loader');
    if (!loader) return;
    
    const bar = document.getElementById('loader-bar-fill');
    const text = document.getElementById('loader-percentage');
    let progress = 0;
    let isLoaded = false;
    
    // Simular progreso de forma fluida y premium usando curva asintótica
    const progressInterval = setInterval(function() {
      if (isLoaded) return;
      
      // Se ralentiza conforme se acerca al tope (95%)
      // Esto genera la sensación de que está procesando detalles finales pesados
      let increment = (95 - progress) * 0.05; 
      
      // Velocidad mínima para que nunca pare de moverse si el evento load tarda
      if (increment < 0.2) increment = 0.2; 
      
      progress += increment; 
      
      // Tope visual de seguridad
      if (progress > 95) progress = 95; 
      
      const rounded = Math.floor(progress);
      if (bar) bar.style.width = rounded + '%';
      if (text) text.textContent = rounded + '%';
    }, 100);

    // Función que dispara el fin del loader
    function completeLoading() {
      if (isLoaded) return;
      isLoaded = true;
      clearInterval(progressInterval);
      
      // Forzamos 100% visualmente
      if (bar) bar.style.width = '100%';
      if (text) text.textContent = '100%';
      
      // Pequeño delay de 400ms para que el usuario procese el 100%
      setTimeout(function() {
        loader.classList.add('is-hidden');
        
        // Remover el loader del DOM (o display none) después de la transición CSS
        setTimeout(function() {
          loader.style.display = 'none';
        }, 600); // 600ms match visual con la nueva transición CSS (0.6s)
      }, 300); // Demora más corta al 100% (se percibe más ágil y menos artificial)
    }

    // Estrategia híbrida:
    // 1. Si el sitio cargó súmamente rápido (ej. Caché), dispara de una
    if (document.readyState === 'complete') {
      completeLoading();
    } else {
      // 2. Si no, esperamos al evento `load` de window, que garantiza que imágenes clave estén listas
      window.addEventListener('load', completeLoading);
      
      // 3. Failsafe (Backup) de 6 segundos. 
      // Por si una fuente o imagen pesa demasiado y traba el evento load.
      setTimeout(completeLoading, 6000); 
    }
  }

  // Disparamos el loader lo más pronto posible
  initPremiumLoader();

  // ---- DOM References ----
  const backToTopBtn = document.getElementById('back-to-top');
  const menuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  const header = document.getElementById('header');

  // ---- Mobile Navigation ----

  // Create overlay element dynamically
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  document.body.appendChild(overlay);

  function openMenu() {
    navLinks.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Cerrar menú');
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Abrir menú');
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    var isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', toggleMenu);
  }

  // Close on overlay click
  overlay.addEventListener('click', closeMenu);

  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && menuBtn && menuBtn.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuBtn.focus();
    }
  });

  // Close on nav link click (mobile)
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        if (menuBtn && menuBtn.getAttribute('aria-expanded') === 'true') {
          closeMenu();
        }
      });
    });
  }

  // ---- Scroll Spy ----
  var sections = document.querySelectorAll('main > section[id]');
  var navAnchors = navLinks ? navLinks.querySelectorAll('a[href^="#"]') : [];

  var observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  var sectionObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var id = entry.target.id;
        navAnchors.forEach(function(anchor) {
          anchor.classList.remove('active');
          if (anchor.getAttribute('href') === '#' + id) {
            anchor.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(function(section) {
    sectionObserver.observe(section);
  });

  // ---- Back to Top Button ----
  if (backToTopBtn) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Scroll Reveal (Fase 3C) ----
  const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade');
  
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          revealObserver.unobserve(entry.target); // Animación solo una vez (sin efecto yoyo)
        }
      });
    }, {
      root: null,
      rootMargin: "0px 0px -50px 0px", // Revela justo antes de que el elemento cruce el borde inferior
      threshold: 0.15
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ---- Photo Slider (Nosotros) ----
  var slider = document.getElementById('nosotros-slider');
  var frame = document.querySelector('.foto-frame');
  var prevBtn = document.querySelector('.slider-arrow.prev');
  var nextBtn = document.querySelector('.slider-arrow.next');

  if (slider && frame) {
    var slides = slider.querySelectorAll('.photo-slider__slide');
    var current = 0;
    var timerId = null;
    var lastChangeTime = Date.now();
    var remainingTime = 6200;
    var SLIDE_INTERVAL = 6200; // 5s visible + 1.2s crossfade

    function showSlide(index) {
      slides[current].classList.remove('photo-slider__slide--active');
      if (index < 0) {
        current = slides.length - 1;
      } else if (index >= slides.length) {
        current = 0;
      } else {
        current = index;
      }
      slides[current].classList.add('photo-slider__slide--active');
      lastChangeTime = Date.now();
      remainingTime = SLIDE_INTERVAL;
    }

    function sliderTick() {
      showSlide(current + 1);
      timerId = setTimeout(sliderTick, SLIDE_INTERVAL);
    }

    function startSlider() {
      if (timerId) return;
      var delay = remainingTime > 0 ? remainingTime : SLIDE_INTERVAL;
      timerId = setTimeout(sliderTick, delay);
    }

    function stopSlider() {
      var elapsed = Date.now() - lastChangeTime;
      remainingTime = Math.max(SLIDE_INTERVAL - elapsed, 0);
      clearTimeout(timerId);
      timerId = null;
    }

    // Navegación Manual
    function manualNext() {
      stopSlider();
      showSlide(current + 1);
      startSlider();
    }

    function manualPrev() {
      stopSlider();
      showSlide(current - 1);
      startSlider();
    }

    if (prevBtn) prevBtn.addEventListener('click', manualPrev);
    if (nextBtn) nextBtn.addEventListener('click', manualNext);

    // Navegación Swipe
    let touchStartX = 0;
    let touchEndX = 0;

    frame.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});

    frame.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, {passive: true});

    function handleSwipe() {
      // 50px de umbral para considerarlo swipe
      if (touchEndX < touchStartX - 50) manualNext();
      if (touchEndX > touchStartX + 50) manualPrev();
    }

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReduced) {
      var sliderObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          entry.isIntersecting ? startSlider() : stopSlider();
        });
      }, { threshold: 0.3 });

      sliderObserver.observe(slider);
    }
  }

  // ---- Countdown Timer (Transición Hero-Nosotros) ----
  const countdownEl = document.getElementById('countdown-timer');
  if (countdownEl) {
    const targetDateStr = countdownEl.getAttribute('data-target');
    const targetDate = new Date(targetDateStr).getTime();

    const daysEl  = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl  = document.getElementById('cd-mins');
    const secsEl  = document.getElementById('cd-secs');

    // Calcula los valores reales en este momento
    function getRealValues() {
      const now = new Date().getTime();
      const distance = Math.max(0, targetDate - now);
      return {
        days:    Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours:   Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      };
    }

    // Escribe los valores reales en el DOM
    function writeValues(v) {
      daysEl.textContent  = String(v.days).padStart(2, '0');
      hoursEl.textContent = String(v.hours).padStart(2, '0');
      minsEl.textContent  = String(v.minutes).padStart(2, '0');
      secsEl.textContent  = String(v.seconds).padStart(2, '0');
    }

    // Animación count-up elegante (ease-out): de 0 → target en `duration` ms
    // Cada campo tiene un pequeño stagger para que se sientan escalonados
    function animateCountUp(el, targetVal, duration, delay) {
      setTimeout(function() {
        var start = null;
        function easeOut(t) { return 1 - Math.pow(1 - t, 3); } // cubic ease-out
        function step(ts) {
          if (!start) start = ts;
          var elapsed = ts - start;
          var progress = Math.min(elapsed / duration, 1);
          var current = Math.round(easeOut(progress) * targetVal);
          el.textContent = String(current).padStart(2, '0');
          if (progress < 1) {
            requestAnimationFrame(step);
          }
        }
        requestAnimationFrame(step);
      }, delay);
    }

    var introPlayed = false;

    function playIntro() {
      if (introPlayed) return;
      introPlayed = true;

      var v = getRealValues();
      var dur = 1200; // duración total de cada campo en ms

      // Stagger: días empieza de inmediato, cada siguiente campo 120ms después
      animateCountUp(daysEl,  v.days,    dur,      0);
      animateCountUp(hoursEl, v.hours,   dur,    120);
      animateCountUp(minsEl,  v.minutes, dur,    240);
      animateCountUp(secsEl,  v.seconds, dur,    360);
    }

    // IntersectionObserver: dispara intro solo la primera vez
    var cdObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          playIntro();
          cdObserver.unobserve(entry.target); // one-shot
        }
      });
    }, { threshold: 0.4 });

    cdObserver.observe(countdownEl);

    // Tick normal cada segundo (siempre activo, no interfiere con la intro)
    function updateCountdown() {
      // Durante la intro los valores se sobreescriben, pero eso es tolerable
      // ya que la intro dura ~1.5s y después queda sincronizado
      if (!introPlayed) return; // esperar a que termine la intro para no pisarla
      writeValues(getRealValues());
    }

    // Arranca el tick con una espera de 1.8s para dejar terminar la intro limpiamente
    setTimeout(function() {
      writeValues(getRealValues()); // sync inmediato post-intro
      setInterval(updateCountdown, 1000);
    }, 1800);
  }

  // ---- Lógica para la Cuenta Regresiva de Nacimiento ----
  function initBirthCountdown() {
    var weeksEl = document.getElementById('birth-weeks');
    var daysEl = document.getElementById('birth-days');
    
    if (!weeksEl || !daysEl) return;

    // Fecha objetivo: 29 de Julio 2026, 12:00:00 (mediodía para centrar el timezone)
    var targetDate = new Date("July 29, 2026 12:00:00").getTime();

    function calculateTime() {
      var now = new Date().getTime();
      var distance = targetDate - now;

      // Fallback elegante si la fecha ya pasó
      if (distance < 0) {
        var container = document.querySelector('.birth-countdown-container');
        if (container) {
          container.innerHTML = '<p class="birth-countdown-message" style="margin-top: 0;">¡Bienvenido, Daniel!</p>';
        }
        return;
      }

      // Prioridad requerida: semanas como métrica principal de embarazo
      var totalDays = Math.floor(distance / (1000 * 60 * 60 * 24));
      var weeks = Math.floor(totalDays / 7);
      var days = totalDays % 7;

      // Lógica de pluralidad
      var weeksUnitEl = document.getElementById('birth-weeks-unit');
      if (weeksUnitEl) {
        weeksUnitEl.textContent = (weeks === 1) ? 'semana' : 'semanas';
      }

      var daysUnitEl = document.getElementById('birth-days-unit');
      if (daysUnitEl) {
        daysUnitEl.textContent = (days === 1) ? 'día' : 'días';
      }

      weeksEl.dataset.value = weeks;
      daysEl.dataset.value = days;

      if (weeksEl.hasAttribute('data-animated')) {
        weeksEl.textContent = weeks;
        daysEl.textContent = days;
      }
    }

    calculateTime(); // Update inicial sin espera
    // Refresca cada 12 horas
    setInterval(calculateTime, 1000 * 60 * 60 * 12); 

    // ---- Microinteracción ----
    function animateValue(el, start, end, duration) {
      var startTimestamp = null;
      function step(timestamp) {
        if (!startTimestamp) startTimestamp = timestamp;
        var progress = Math.min((timestamp - startTimestamp) / duration, 1);
        var easeOut = 1 - Math.pow(1 - progress, 3);
        var value = Math.floor(start + (end - start) * easeOut);
        el.textContent = value;
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          el.textContent = end;
        }
      }
      window.requestAnimationFrame(step);
    }

    var countdownSection = document.querySelector('.birth-countdown-section');
    var hasAnimated = false;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          var wVal = parseInt(weeksEl.dataset.value) || 0;
          var dVal = parseInt(daysEl.dataset.value) || 0;
          
          weeksEl.setAttribute('data-animated', 'true');
          daysEl.setAttribute('data-animated', 'true');

          animateValue(weeksEl, Math.max(wVal - 5, 0), wVal, 1000);
          animateValue(daysEl, Math.max(dVal - 3, 0), dVal, 1000);
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    if (countdownSection) observer.observe(countdownSection);
  }

  initBirthCountdown();

  // ---- Touch Feedback for Hero Interactive Elements ----
  // Replicates hover effects on touch devices (iPhone, iPad)
  var touchTargets = document.querySelectorAll('.hero-asset--moon, .hero-asset--movil, .hero-asset--bear');
  touchTargets.forEach(function(el) {
    el.addEventListener('touchstart', function(e) {
      // Prevent double-fire and scroll interference
      el.classList.add('is-touched');
      setTimeout(function() {
        el.classList.remove('is-touched');
      }, 600);
    }, { passive: true });
  });

  // ---- Dynamic Footer Year ----
  var currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

})();
