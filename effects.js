/* ================= NAVBAR SCROLL ================= */
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        navbar.classList.add('shadow');
    } else {
        navbar.classList.remove('shadow');
    }
});

/* ================= SCROLL REVEAL ================= */
const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.15 }
);

reveals.forEach(el => observer.observe(el));
