document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer for sections
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Animate skill bars if this is the skills section
                if (entry.target.id === 'skills') {
                    animateSkillBars();
                }
                // Animate stat numbers if found in this section
                if (entry.target.querySelector('.stat-number')) {
                    animateStatNumbers(entry.target);
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    sections.forEach(section => observer.observe(section));

    let slideIndex = 0;
    const slides = document.querySelectorAll('.slide');
    const prev = document.querySelector('.slideshow-container .prev');
    const next = document.querySelector('.slideshow-container .next');
    const dotsContainer = document.querySelector('.dots');
    let dots = [];

    // Create dots
    slides.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'dot';
        dot.addEventListener('click', () => showSlide(i));
        dotsContainer.appendChild(dot);
        dots.push(dot);
    });

    function showSlide(n) {
        slides.forEach(slide => slide.style.display = 'none');
        dots.forEach(dot => dot.classList.remove('active'));
        slideIndex = (n + slides.length) % slides.length;
        slides[slideIndex].style.display = 'block';
        dots[slideIndex].classList.add('active');
    }

    function nextSlide() { showSlide(slideIndex + 1); }
    function prevSlide() { showSlide(slideIndex - 1); }

    next.addEventListener('click', nextSlide);
    prev.addEventListener('click', prevSlide);

    // Auto slide
    let autoSlide = setInterval(nextSlide, 4000);

    // Pause on hover
    slides.forEach(slide => {
        slide.addEventListener('mouseenter', () => clearInterval(autoSlide));
        slide.addEventListener('mouseleave', () => autoSlide = setInterval(nextSlide, 4000));
    });

    showSlide(0);

    // Timeline animation on scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, i * 180); // Stagger effect
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    timelineItems.forEach(item => timelineObserver.observe(item));

    // Typewriter effect for .typing-text
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;

    const texts = ["Hello, I'm"];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeWriter() {
        const currentText = texts[textIndex];
        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = 120;
        if (isDeleting) typeSpeed /= 2;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 1200; // Pause before deleting
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 600; // Pause before typing again
        }

        setTimeout(typeWriter, typeSpeed);
    }

    typeWriter();
});

// Animate skill bars in the skills section
function animateSkillBars() {
    document.querySelectorAll('#skills .skill-progress').forEach((bar, i) => {
        const percent = parseInt(bar.getAttribute('data-percent'), 10) || 0;
        bar.classList.remove('animated');
        bar.style.width = '0%';
        // Trigger reflow to restart animation
        void bar.offsetWidth;
        setTimeout(() => {
            bar.classList.add('animated');
        bar.style.width = percent + '%';
        }, i * 120); // Stagger effect
    });
}

// Animate stat numbers in a given section
function animateStatNumbers(section) {
    section.querySelectorAll('.stat-number').forEach((stat, i) => {
        const targetText = stat.textContent.replace(/,/g, '');
        const match = targetText.match(/(\d+)([^\d]*)/);
        if (!match) return;
        const target = parseInt(match[1]);
        const suffix = match[2] || '';
        let duration = 1800 + Math.random() * 800;
        let startTime = null;

        function animate(currentTime) {
            if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
            // Ease out
            const value = Math.floor(target * (1 - Math.pow(1 - progress, 3)));
            stat.textContent = value.toLocaleString() + suffix;
            if (progress < 1) {
                requestAnimationFrame(animate);
        } else {
                stat.textContent = target.toLocaleString() + suffix;
            }
        }
        stat.textContent = '0' + suffix;
        setTimeout(() => requestAnimationFrame(animate), i * 200); // Stagger numbers
    });
}
