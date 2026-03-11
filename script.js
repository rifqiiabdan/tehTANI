/* ========================================
   TehTANI Website – Main Script
   ======================================== */

(function () {
  'use strict';

  /* ── Navbar scroll effect ── */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
      backToTop.classList.add('visible');
    } else {
      navbar.classList.remove('scrolled');
      backToTop.classList.remove('visible');
    }
  }, { passive: true });

  /* ── Mobile hamburger ── */
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  /* ── Back to top ── */
  const backToTop = document.getElementById('backToTop');
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── Lightweight AOS (Animate On Scroll) ── */
  const aosElements = document.querySelectorAll('[data-aos]');

  const aosObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.aosDelay ? parseInt(el.dataset.aosDelay) : 0;
        setTimeout(() => {
          el.classList.add('aos-animate');
        }, delay);
        aosObserver.unobserve(el);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  aosElements.forEach(el => aosObserver.observe(el));

  /* ── Testimonial Slider ── */
  const track = document.getElementById('testimoniTrack');
  const cards = track ? track.querySelectorAll('.testimonial-card') : [];
  const dotsWrap = document.getElementById('testimoniDots');
  const btnPrev = document.getElementById('testimoniPrev');
  const btnNext = document.getElementById('testimoniNext');

  if (track && cards.length) {
    let currentIndex = 0;
    let visibleCount = getVisibleCount();
    let totalSlides = Math.ceil(cards.length / visibleCount);
    let autoSlide;

    function getVisibleCount() {
      if (window.innerWidth <= 580) return 1;
      if (window.innerWidth <= 900) return 2;
      return 4;
    }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      totalSlides = Math.max(1, cards.length - visibleCount + 1);
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = 'slider-dot' + (i === currentIndex ? ' active' : '');
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      }
    }

    function updateDots() {
      if (!dotsWrap) return;
      dotsWrap.querySelectorAll('.slider-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function goTo(index) {
      const max = Math.max(0, cards.length - visibleCount);
      currentIndex = Math.min(max, Math.max(0, index));

      // Calculate card width + gap
      const cardWidth = cards[0].offsetWidth;
      const gap = 28;
      const offset = currentIndex * (cardWidth + gap);

      track.style.transform = `translateX(-${offset}px)`;
      updateDots();
    }

    function goNext() {
      const max = Math.max(0, cards.length - visibleCount);
      if (currentIndex < max) {
        goTo(currentIndex + 1);
      } else {
        goTo(0);
      }
    }

    function goPrev() {
      if (currentIndex > 0) {
        goTo(currentIndex - 1);
      } else {
        goTo(Math.max(0, cards.length - visibleCount));
      }
    }

    if (btnNext) btnNext.addEventListener('click', () => { goNext(); resetAutoSlide(); });
    if (btnPrev) btnPrev.addEventListener('click', () => { goPrev(); resetAutoSlide(); });

    function resetAutoSlide() {
      clearInterval(autoSlide);
      autoSlide = setInterval(goNext, 4000);
    }

    // Touch support
    let touchStart = 0;
    track.addEventListener('touchstart', e => { touchStart = e.changedTouches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStart - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? goNext() : goPrev();
        resetAutoSlide();
      }
    });

    // Responsive rebuild
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        visibleCount = getVisibleCount();
        currentIndex = 0;
        buildDots();
        goTo(0);
      }, 200);
    });

    // Init
    buildDots();
    goTo(0);
    resetAutoSlide();
  }

  /* ── Menu Slider (Auto-scroll with Center Focus) ── */
  const menuTrack = document.getElementById('menuTrack');
  const menuItems = menuTrack ? Array.from(menuTrack.querySelectorAll('.menu-drink-item')) : [];

  if (menuTrack && menuItems.length) {
    // Start somewhere in the middle (or you can start at 0)
    let menuIndex = Math.floor(menuItems.length / 2);
    let autoSlideMenuInterval;

    function updateMenuSlider() {
      if (!menuTrack.parentElement) return;

      const viewportWidth = menuTrack.parentElement.offsetWidth;
      const itemWidth = menuItems[0].offsetWidth;
      // Get gap from CSS, fallback to 20
      const gap = parseInt(window.getComputedStyle(menuTrack).gap) || 20;

      // Center the item at menuIndex
      const itemCenterOffset = (menuIndex * (itemWidth + gap)) + (itemWidth / 2);
      const trackOffset = (viewportWidth / 2) - itemCenterOffset;

      menuTrack.style.transform = `translateX(${trackOffset}px)`;

      // Update active classes
      menuItems.forEach((item, i) => {
        if (i === menuIndex) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }

    function slideNextMenu() {
      menuIndex++;
      if (menuIndex >= menuItems.length) {
        menuIndex = 0; // Loop back
      }
      updateMenuSlider();
    }

    // Initial setup with short delay to ensure layout is calculated
    setTimeout(updateMenuSlider, 100);

    // Auto slide every 3 seconds (3000ms)
    function startMenuAutoSlide() {
      clearInterval(autoSlideMenuInterval);
      autoSlideMenuInterval = setInterval(slideNextMenu, 3000);
    }

    startMenuAutoSlide();

    // Pause on hover
    menuTrack.addEventListener('mouseenter', () => clearInterval(autoSlideMenuInterval));
    menuTrack.addEventListener('mouseleave', startMenuAutoSlide);

    // Touch support for manual swipe
    let menuTouchStart = 0;
    menuTrack.addEventListener('touchstart', e => {
      menuTouchStart = e.changedTouches[0].clientX;
      clearInterval(autoSlideMenuInterval);
    }, { passive: true });

    menuTrack.addEventListener('touchend', e => {
      const diff = menuTouchStart - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0 && menuIndex < menuItems.length - 1) {
          menuIndex++;
        } else if (diff < 0 && menuIndex > 0) {
          menuIndex--;
        } else {
          // If at edges, loop to opposite side
          if (diff > 0) menuIndex = 0;
          if (diff < 0) menuIndex = menuItems.length - 1;
        }
        updateMenuSlider();
      }
      startMenuAutoSlide();
    });

    // Handle responsive resize centering
    window.addEventListener('resize', updateMenuSlider);
  }

  /* ── Navbar active link highlight on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinksAll.forEach(link => {
          link.style.color = '';
          link.style.fontWeight = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--green-dark)';
            link.style.fontWeight = '700';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  /* ── Smooth hover effect on menu items for cursor trail ── */
  document.querySelectorAll('.menu-drink-item, .special-card, .promo-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 14;
      card.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── Counter animation for hero stats (if any) ── */
  function animateCounter(el, target, duration = 1500) {
    const start = performance.now();
    const update = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  /* ── Page load animation sequence ── */
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Trigger above-fold elements with slight delay
    const heroText = document.querySelector('.hero-text');
    const heroImg = document.querySelector('.hero-image');
    if (heroText) {
      heroText.style.opacity = '0';
      heroText.style.transform = 'translateY(30px)';
      setTimeout(() => {
        heroText.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        heroText.style.opacity = '1';
        heroText.style.transform = 'translateY(0)';
      }, 150);
    }
    if (heroImg) {
      heroImg.style.opacity = '0';
      heroImg.style.transform = 'translateX(40px)';
      setTimeout(() => {
        heroImg.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
        heroImg.style.opacity = '1';
        heroImg.style.transform = 'translateX(0)';
      }, 350);
    }
  });

})();
