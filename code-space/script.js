window.addEventListener('load', () => {
    const loading = document.getElementById('loading');
    setTimeout(() => loading?.classList.add('hidden'), 1000);
});

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navLinkElements = document.querySelectorAll('.nav-link');

hamburger?.addEventListener('click', () => {
    navLinks?.classList.toggle('active');
    const icon = hamburger.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

navLinkElements.forEach(link => {
    link.addEventListener('click', () => {
        navLinks?.classList.remove('active');
        const icon = hamburger?.querySelector('i');
        if (icon) {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    });
});

const mainHeader = document.getElementById('mainHeader');
let scrollTimeout;
function handleScroll() {
    if (window.scrollY > 50) mainHeader?.classList.add('scrolled');
    else mainHeader?.classList.remove('scrolled');
}
window.addEventListener('scroll', () => {
    if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
    scrollTimeout = requestAnimationFrame(handleScroll);
});

const sections = document.querySelectorAll('section[id]');
function setActiveNav() {
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const correspondingNavLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinkElements.forEach(link => link.classList.remove('active'));
            correspondingNavLink?.classList.add('active');
        }
    });
}
window.addEventListener('scroll', () => {
    if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
    scrollTimeout = requestAnimationFrame(() => {
        handleScroll();
        setActiveNav();
    });
});

const fadeInSections = document.querySelectorAll('.fade-in-section');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
}, { root: null, rootMargin: '-50px 0px -50px 0px', threshold: 0.15 });
fadeInSections.forEach(section => observer.observe(section));

const scrollToTopBtn = document.getElementById('scrollToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
});
scrollToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

function showNotification(message, type) {
    const container = document.getElementById('notification-container');
    if (!container) return;
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    container.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.add('hide');
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', function(event) {
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    event.preventDefault();
    const data = new FormData(form);
    const action = event.target.action;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    fetch(action, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(response => {
            if (response.ok) {
                showNotification('Message sent successfully!', 'success');
                form.reset();
            } else {
                showNotification('Oops! There was an error.', 'error');
            }
        })
        .catch(error => {
            showNotification('An unexpected error occurred.', 'error');
            console.error('Error:', error);
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
});
