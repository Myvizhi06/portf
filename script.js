/**
 * Myvizhi Portfolio — script.js
 * Interactive behaviors: Theme toggle, Mobile Menu, Typewriter effect,
 * ScrollSpy, Reveal on Scroll, Dynamic Year, and 3D Card Hover.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. DYNAMIC FOOTER YEAR
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 2. THEME TOGGLE (Dark / Light Mode)
  const themeToggle = document.getElementById('themeToggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

  const getSavedTheme = () => {
    return localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
  };

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeToggle) {
        themeToggle.textContent = '☼';
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
        themeToggle.setAttribute('title', 'Switch to light mode');
      }
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeToggle) {
        themeToggle.textContent = '☾';
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        themeToggle.setAttribute('title', 'Switch to dark mode');
      }
    }
  };

  // Initialize theme
  const currentTheme = getSavedTheme();
  applyTheme(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const newTheme = isDark ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      applyTheme(newTheme);
    });
  }

  // Listen to OS theme changes if user hasn't overridden
  prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // 3. MOBILE NAVIGATION DRAWER
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const allNavLinks = document.querySelectorAll('.nav-link');

  const toggleMenu = (open) => {
    const shouldOpen = open !== undefined ? open : !navLinks.classList.contains('open');
    navLinks.classList.toggle('open', shouldOpen);
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    }
  };

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        toggleMenu(false);
      }
    });

    // Close mobile menu when pressing Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        toggleMenu(false);
      }
    });

    // Close when clicking any nav link
    allNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 680) {
          toggleMenu(false);
        }
      });
    });

    // Auto-close if resized to desktop view
    window.addEventListener('resize', () => {
      if (window.innerWidth > 680 && navLinks.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  }

  // 4. TYPEWRITER EFFECT
  const typingElement = document.getElementById('typingText');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typingElement && !prefersReducedMotion) {
    const roles = [
      'Artificial Intelligence',
      'Machine Learning',
      'Data Science',
      'Intelligent Solutions',
      'Future Technologies'
    ];

    let roleIndex = 0;
    let charIndex = roles[0].length;
    let isDeleting = true;
    let typingDelay = 100;

    const typeLoop = () => {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingDelay = 45;
      } else {
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingDelay = 95;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        // Pause at finished word
        typingDelay = 1800;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        // Switch to next word
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingDelay = 400;
      }

      setTimeout(typeLoop, typingDelay);
    };

    // Initial wait before starting deleting
    setTimeout(typeLoop, 1500);
  }

  // 5. SCROLLSPY / ACTIVE NAV LINK HIGHLIGHT
  const sections = document.querySelectorAll('section[id]');

  const updateActiveNavLink = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const headerHeight = document.querySelector('.site-header')?.offsetHeight || 76;

    let currentSectionId = '';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - headerHeight - 100;
      const sectionHeight = section.offsetHeight;

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    // If reached bottom of page, highlight contact
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
      currentSectionId = 'contact';
    }

    if (currentSectionId) {
      allNavLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href === `#${currentSectionId}`) {
          link.classList.add('active');
        } else {
          // If in certifications section, keep education or skills active if certifications isn't on nav
          if (currentSectionId === 'certifications' && href === '#education') {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        }
      });
    }
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // 6. SCROLL REVEAL ANIMATIONS
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // If IntersectionObserver is not supported or reduced motion is preferred
    revealElements.forEach((el) => el.classList.add('visible'));
  }

  // 7. SUBTLE 3D TILT EFFECT ON PROFILE CARD (DESKTOP)
  const profileCard = document.querySelector('.profile-card');
  const heroVisual = document.querySelector('.hero-visual');

  if (profileCard && heroVisual && window.innerWidth > 900 && !prefersReducedMotion) {
    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      profileCard.style.transform = `perspective(1000px) rotate(${3 + rotateY * 0.5}deg) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    heroVisual.addEventListener('mouseleave', () => {
      profileCard.style.transform = 'rotate(3deg)';
      profileCard.style.transition = 'transform 0.4s ease';
    });

    heroVisual.addEventListener('mouseenter', () => {
      profileCard.style.transition = 'none';
    });
  }
});
