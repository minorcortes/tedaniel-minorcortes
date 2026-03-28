/* ==========================================================================
   Te Daniel — Baby Shower Landing Page
   Core JS: back-to-top button & smooth scroll
   ========================================================================== */

(function () {
  'use strict';

  // ---- Back to Top Button ----
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
