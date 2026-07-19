document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // THEME TOGGLE (DARK / LIGHT MODE)
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check local storage for preference
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
        themeIcon.className = 'fa-solid fa-sun';
    } else {
        document.body.classList.add('dark-theme');
        themeIcon.className = 'fa-solid fa-moon';
    }

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        
        // Update icon
        themeIcon.className = isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
        
        // Save state
        localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
    });

    // ==========================================================================
    // CUSTOM CURSOR EFFECT (DESKTOP ONLY)
    // ==========================================================================
    const cursorDot = document.querySelector('.custom-cursor');
    const cursorOutline = document.querySelector('.custom-cursor-outline');
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .filter-btn');

    if (window.innerWidth > 768 && cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Simple movement
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outlines with slight delay (inertial effect)
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 250, fill: 'forwards' });
        });

        // Click effects / Hover states
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorOutline.style.borderColor = 'var(--text-primary)';
                cursorDot.style.backgroundColor = 'var(--text-primary)';
            });

            el.addEventListener('mouseleave', () => {
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.borderColor = 'var(--accent-color)';
                cursorDot.style.backgroundColor = 'var(--accent-color)';
            });
        });
    } else {
        // Hide custom cursor elements if on mobile
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorOutline) cursorOutline.style.display = 'none';
    }

    // ==========================================================================
    // MOBILE NAVIGATION MENU
    // ==========================================================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileToggleIcon = mobileToggle.querySelector('i');

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        const isOpen = navMenu.classList.contains('open');
        
        // Update menu icon between bars and close X
        mobileToggleIcon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars-staggered';
    });

    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            mobileToggleIcon.className = 'fa-solid fa-bars-staggered';
        });
    });

    // ==========================================================================
    // NAVBAR SCROLL EFFECT
    // ==========================================================================
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ==========================================================================
    // TYPING TEXT EFFECT (HERO SECTION)
    // ==========================================================================
    const typingTextEl = document.getElementById('typing-text');
    const words = ["Lập Trình Viên C++", "Lập Trình Viên Python", "Chuyên Gia JavaScript", "MySQL & Cơ Sở Dữ Liệu"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            // Remove character
            typingTextEl.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Deleting is faster
        } else {
            // Add character
            typingTextEl.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150; // Regular typing speed
        }

        // Handle word completion / delete cycle
        if (!isDeleting && charIndex === currentWord.length) {
            // Finished typing the word, pause before deleting
            typingSpeed = 1500;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            // Move to next word
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(type, typingSpeed);
    }

    // Initialize typing
    if (typingTextEl) {
        setTimeout(type, 1000);
    }



    // ==========================================================================
    // SKILLS VISIBILITY PROGRESS FILL (INTERSECTION OBSERVER)
    // ==========================================================================
    const skillsSection = document.getElementById('skills');
    const progressBars = document.querySelectorAll('.skill-progress');

    // Reset width to 0 first to animate when inside viewport
    progressBars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        bar.setAttribute('data-target', targetWidth);
    });

    if (skillsSection && progressBars.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    progressBars.forEach(bar => {
                        const target = bar.getAttribute('data-target');
                        bar.style.width = target;
                    });
                    // Unobserve after animating once
                    observer.unobserve(skillsSection);
                }
            });
        }, { threshold: 0.15 });

        observer.observe(skillsSection);
    }

    // ==========================================================================
    // ACTIVE NAV LINKS ON SCROLL
    // ==========================================================================
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // Adjust threshold offset for navbar height
            if (window.scrollY >= (sectionTop - 150)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================================================
    // CONTACT FORM VALIDATION & INTERACTIVE RESPONSE
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get inputs
            const nameInput = document.getElementById('form-name');
            const emailInput = document.getElementById('form-email');
            const messageInput = document.getElementById('form-message');
            
            let isValid = true;

            // Reset validation states
            document.querySelectorAll('.form-group').forEach(grp => grp.classList.remove('invalid'));

            // Name validation
            if (!nameInput.value.trim()) {
                nameInput.closest('.form-group').classList.add('invalid');
                isValid = false;
            }

            // Email validation (simple regex)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
                emailInput.closest('.form-group').classList.add('invalid');
                isValid = false;
            }

            // Message validation
            if (!messageInput.value.trim()) {
                messageInput.closest('.form-group').classList.add('invalid');
                isValid = false;
            }

            if (isValid) {
                // Mock submission effect
                const submitBtn = document.getElementById('submit-btn');
                const submitBtnText = submitBtn.querySelector('span');
                const submitBtnIcon = submitBtn.querySelector('i');

                // Visual loading state
                submitBtn.disabled = true;
                submitBtnText.textContent = 'Đang Gửi...';
                submitBtnIcon.className = 'fa-solid fa-spinner fa-spin';

                setTimeout(() => {
                    // Success state
                    formStatus.className = 'form-status success';
                    formStatus.textContent = 'Cảm ơn bạn! Tin nhắn của bạn đã được gửi thành công. Tôi sẽ liên hệ lại sớm nhất.';
                    
                    // Reset fields
                    contactForm.reset();

                    // Revert button
                    submitBtn.disabled = false;
                    submitBtnText.textContent = 'Gửi Tin Nhắn';
                    submitBtnIcon.className = 'fa-regular fa-paper-plane';

                    // Scroll to status message
                    formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    
                    // Hide message after 5 seconds
                    setTimeout(() => {
                        formStatus.style.display = 'none';
                    }, 5000);

                }, 1500);
            } else {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Vui lòng kiểm tra lại thông tin và điền đầy đủ các trường bắt buộc.';
                formStatus.style.display = 'block';
            }
        });
    }

    // Mock CV download alert
    const downloadCVBtn = document.getElementById('download-cv');
    if (downloadCVBtn) {
        downloadCVBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert("Tính năng tải CV bản PDF đang được tích hợp. Vui lòng quay lại sau!");
        });
    }
});
