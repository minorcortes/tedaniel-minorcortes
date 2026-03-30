/* ==========================================================================
   Té Daniel — Baby Shower Landing Page
   Core JS: Mobile nav, scroll spy, back-to-top
   ========================================================================== */

(function() {
  'use strict';

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
  if (slider) {
    var slides = slider.querySelectorAll('.photo-slider__slide');
    var current = 0;
    var timerId = null;
    var lastChangeTime = Date.now();
    var remainingTime = 6200;
    var SLIDE_INTERVAL = 6200; // 5s visible + 1.2s crossfade

    function showSlide(index) {
      slides[current].classList.remove('photo-slider__slide--active');
      current = index % slides.length;
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

})();
