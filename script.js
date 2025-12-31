document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    initObserver();
    initSocialObserver();
});

// --- Copy to Clipboard ---
function copyAccountNumber() {
    const accountText = document.getElementById('account-number').innerText;
    navigator.clipboard.writeText(accountText).then(() => {
        showToast("계좌번호가 복사되었습니다.");
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showToast("복사에 실패했습니다.");
    });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// --- Accordion ---
function toggleAccordion() {
    const content = document.getElementById('career-list');
    const header = document.querySelector('.accordion-header .arrow');

    if (content.style.maxHeight) {
        content.style.maxHeight = null;
        header.style.transform = 'rotate(0deg)';
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
        header.style.transform = 'rotate(180deg)';
    }
}

// --- Scroll Observer ---
function initObserver() {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        observer.observe(section);
    });
}

function initSocialObserver() {
    const socialLinks = document.querySelector('.social-links');
    if (!socialLinks) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const icons = entry.target.querySelectorAll('.social-icon');
                icons.forEach(icon => icon.classList.add('animate-visible'));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    observer.observe(socialLinks);
}

// --- Canvas Background Animation (Floating Embers/Fireflies) ---
function initCanvas() {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];

    // Configuration
    const particleCount = 50;

    // Resize
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    // Particle Class
    class Particle {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * width;
            // Spread across height initially, or start from bottom otherwise
            this.y = initial ? Math.random() * height : height + 10;

            // Random upward speed
            this.speedY = 0.5 + Math.random() * 1.5;
            // Slight horizontal drift
            this.speedX = (Math.random() - 0.5) * 0.5;

            this.size = Math.random() * 3;
            // Opacity fade in/out lifecycle could be complex, simple pulses here:
            this.alpha = 0.1 + Math.random() * 0.5;
            this.fadeSpeed = 0.005 + Math.random() * 0.005;
            this.fadingOut = Math.random() > 0.5;
            this.color = '#e11d48'; // Red base
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX;

            // Fade logic
            if (this.fadingOut) {
                this.alpha -= this.fadeSpeed;
                if (this.alpha <= 0) {
                    this.alpha = 0;
                    this.fadingOut = false;
                }
            } else {
                this.alpha += this.fadeSpeed;
                if (this.alpha >= 1) {
                    this.alpha = 1;
                    this.fadingOut = true;
                }
            }

            // Reset if off screen or fully faded out for a long time
            if (this.y < -10 || (this.alpha <= 0 && Math.random() < 0.01)) {
                this.reset();
            }
        }

        draw() {
            if (this.alpha <= 0) return;

            ctx.beginPath();
            // Glow effect
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
            gradient.addColorStop(0, `rgba(225, 29, 72, ${this.alpha})`);
            gradient.addColorStop(1, `rgba(225, 29, 72, 0)`);

            ctx.fillStyle = gradient;
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Init Particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw Particles
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // No connections drawn for this effect, just floating ambiance

        requestAnimationFrame(animate);
    }

    animate();
}
