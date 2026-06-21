/* ==========================================================================
   PORTFOLIO INTERACTIVE SCRIPTS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollspy();
  initScrollAnimations();
  initHeroParticles();
  initContactForm();
  initAboutImageSlideshow();
});

/* ═══════════════ MOBILE NAVIGATION ═══════════════ */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const links = navLinks.querySelectorAll('a');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

/* ═══════════════ SCROLLSPY (ACTIVE LINKS) ═══════════════ */
function initScrollspy() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let currentSection = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 120) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ═══════════════ SCROLL ANIMATIONS ═══════════════ */
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target); // Animate once
      }
    });
  }, observerOptions);

  // Targets to animate
  const targets = document.querySelectorAll('.card-tech, .timeline-item, .project-card, .section-title, .section-label');
  targets.forEach(target => {
    target.style.opacity = '0';
    target.style.transform = 'translateY(30px)';
    target.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(target);
  });

  // Inject animation keyframe rules dynamically
  const style = document.createElement('style');
  style.innerHTML = `
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
}

/* ═══════════════ HERO BACKGROUND PARTICLES ═══════════════ */
function initHeroParticles() {
  const canvasContainer = document.getElementById('hero-particles');
  if (!canvasContainer) return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvasContainer.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let particlesArray = [];
  const numberOfParticles = 30;

  class Particle {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = Math.random() * 0.4 - 0.2;
      this.color = Math.random() > 0.5 ? 'rgba(197, 160, 89, 0.15)' : 'rgba(112, 182, 247, 0.15)';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > this.width) this.speedX = -this.speedX;
      if (this.y < 0 || this.y > this.height) this.speedY = -this.speedY;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fill();
    }
  }

  function resize() {
    canvas.width = canvasContainer.offsetWidth;
    canvas.height = canvasContainer.offsetHeight;
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle(canvas.width, canvas.height));
    }
  }

  window.addEventListener('resize', resize);
  resize();

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(particle => {
      particle.update();
      particle.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
}

/* ═══════════════ CONTACT FORM INTERACTION ═══════════════ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    // Let the form submit normally to formsubmit.co, but show a nice sending state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="spinner" width="16" height="16" viewBox="0 0 50 50" style="animation: rotate 1s linear infinite; margin-right: 8px;">
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5" stroke="currentColor" style="stroke-dasharray: 1, 150; stroke-dashoffset: 0; stroke-linecap: round; animation: dash 1.5s ease-in-out infinite;"></circle>
      </svg>
      Sending Message...
    `;

    // Dynamic keyframes for spinner
    if (!document.getElementById('spinner-styles')) {
      const style = document.createElement('style');
      style.id = 'spinner-styles';
      style.innerHTML = `
        @keyframes rotate {
          100% { transform: rotate(360deg); }
        }
        @keyframes dash {
          0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
          50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
          100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
        }
      `;
      document.head.appendChild(style);
    }
  });
}

/* ═══════════════ ABOUT IMAGE SLIDESHOW ═══════════════ */
function initAboutImageSlideshow() {
  const slides = document.querySelectorAll('.about-img-slides img');
  if (slides.length < 2) return;

  let currentIndex = 0;
  setInterval(() => {
    slides[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add('active');
  }, 4000); // Changes image every 4 seconds (a small time)
}

