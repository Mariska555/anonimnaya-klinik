// ===== SCROLL HEADER =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ===== MOBILE MENU =====
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', () => {
  mobileMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
});

function closeMenu() {
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

// ===== MODAL =====
const modal = document.getElementById('modal');

function openModal() {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closeMenu();
  }
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Animate counters
      const counters = entry.target.querySelectorAll('[data-target]');
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        animateCounter(counter, target);
      });

      // Animate timeline progress
      const progressLine = entry.target.querySelector('#progressLine');
      if (progressLine) {
        progressLine.style.height = '100%';
      }
    }
  });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});

// Counter animation
function animateCounter(element, target) {
  const duration = 2000;
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (target - start) * easeOut);

    element.textContent = current.toLocaleString('ru-RU');

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target.toLocaleString('ru-RU') + '+';
    }
  }

  requestAnimationFrame(update);
}

// ===== FAQ ACCORDION =====
function toggleFaq(button) {
  const item = button.parentElement;
  const isActive = item.classList.contains('active');

  // Close all
  document.querySelectorAll('.faq-item').forEach(faq => {
    faq.classList.remove('active');
  });

  // Open clicked if wasn't active
  if (!isActive) {
    item.classList.add('active');
  }
}

// ===== FORM HANDLERS =====
function handleSubmit(e) {
  e.preventDefault();
  showNotification('Заявка отправлена! Мы перезвоним вам в ближайшее время.');
  e.target.reset();
}

function handleModalSubmit(e) {
  e.preventDefault();
  closeModal();
  showNotification('Заявка отправлена! Наш специалист свяжется с вами в течение 15 минут.');
  e.target.reset();
}

// ===== NOTIFICATION =====
function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: linear-gradient(135deg, #15BCB4, #716AAD);
    color: white;
    padding: 16px 24px;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 10px 40px rgba(21,188,180,0.3);
    z-index: 400;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    max-width: 90%;
    text-align: center;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  requestAnimationFrame(() => {
    notification.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    notification.style.transform = 'translateX(-50%) translateY(100px)';
    setTimeout(() => notification.remove(), 400);
  }, 4000);
}

// ===== SMOOTH SCROLL FOR ANCHORS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const headerHeight = 80;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ===== PARALLAX HERO SHAPES =====
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const shapes = document.querySelectorAll('.hero-shape');

  shapes.forEach((shape, index) => {
    const speed = 0.1 + (index * 0.05);
    shape.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

// ===== BUTTON RIPPLE EFFECT =====
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      background: rgba(255,255,255,0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    `;

    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (x - size / 2) + 'px';
    ripple.style.top = (y - size / 2) + 'px';

    this.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  });
});

// Add ripple keyframe dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ===== CITY TAGS STAGGER ANIMATION =====
const cityTags = document.querySelectorAll('.city-tag');
cityTags.forEach((tag, index) => {
  tag.style.opacity = '0';
  tag.style.transform = 'translateY(20px)';
  tag.style.transition = `all 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.03}s`;
});

const citiesSection = document.querySelector('.cities-cloud');
if (citiesSection) {
  const citiesObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        cityTags.forEach(tag => {
          tag.style.opacity = '1';
          tag.style.transform = 'translateY(0)';
        });
      }
    });
  }, { threshold: 0.2 });

  citiesObserver.observe(citiesSection);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  // Trigger hero animations immediately
  document.querySelectorAll('.hero .animate-on-scroll').forEach(el => {
    el.classList.add('visible');
  });

  // Animate hero counters
  document.querySelectorAll('.hero .badge-number[data-target]').forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    animateCounter(counter, target);
  });
});
