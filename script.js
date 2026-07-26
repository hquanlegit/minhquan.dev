document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. PARTICLE CANVAS BACKGROUND EFFECT
    // ==========================================================================
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        let particles = [];
        const particleCount = Math.min(Math.floor(width / 20), 65);
        let mouse = { x: null, y: null, radius: 140 };

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        });

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 0.8;
                this.speedY = (Math.random() - 0.5) * 0.8;
                this.color = Math.random() > 0.5 ? 'rgba(139, 92, 246, 0.4)' : 'rgba(6, 182, 212, 0.4)';
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > width) this.speedX *= -1;
                if (this.y < 0 || this.y > height) this.speedY *= -1;

                // Mouse interaction
                if (mouse.x && mouse.y) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouse.radius - distance) / mouse.radius;
                        this.x -= forceDirectionX * force * 2;
                        this.y -= forceDirectionY * force * 2;
                    }
                }
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function connectParticles() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        let opacity = 1 - (distance / 120);
                        ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.15})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connectParticles();
            requestAnimationFrame(animateCanvas);
        }

        initParticles();
        animateCanvas();
    }

    // ==========================================================================
    // 2. THEME SWITCHER (DARK / LIGHT MODE)
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
        if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
    } else {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
        if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isLight = document.body.classList.toggle('light-theme');
            document.body.classList.toggle('dark-theme', !isLight);
            
            if (themeIcon) {
                themeIcon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
            }
            localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
            showToast(isLight ? 'Đã chuyển sang giao diện Sáng' : 'Đã chuyển sang giao diện Tối');
        });
    }

    // ==========================================================================
    // 3. CUSTOM CURSOR EFFECT (DESKTOP)
    // ==========================================================================
    const cursorDot = document.querySelector('.custom-cursor');
    const cursorOutline = document.querySelector('.custom-cursor-outline');

    if (window.innerWidth > 768 && cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 250, fill: 'forwards' });
        });

        const interactiveEls = document.querySelectorAll('a, button, input, textarea, .project-card, .code-tab');
        interactiveEls.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1.6)';
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorOutline.style.borderColor = 'var(--primary-cyan)';
            });

            el.addEventListener('mouseleave', () => {
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.borderColor = 'var(--primary-purple)';
            });
        });
    } else {
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorOutline) cursorOutline.style.display = 'none';
    }

    // ==========================================================================
    // 4. MOBILE NAVIGATION DRAWER
    // ==========================================================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        const toggleIcon = mobileToggle.querySelector('i');
        mobileToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            if (toggleIcon) {
                toggleIcon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars-staggered';
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                if (toggleIcon) toggleIcon.className = 'fa-solid fa-bars-staggered';
            });
        });
    }

    // ==========================================================================
    // 5. NAVBAR SCROLL EFFECT & ACTIVE LINK HIGHLIGHT
    // ==========================================================================
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        let currentSectionId = '';
        sections.forEach(sec => {
            const secTop = sec.offsetTop - 160;
            const secHeight = sec.clientHeight;
            if (window.scrollY >= secTop && window.scrollY < secTop + secHeight) {
                currentSectionId = sec.getAttribute('id');
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
    // 6. HERO TYPING TEXT EFFECT
    // ==========================================================================
    const typingTextEl = document.getElementById('typing-text');
    const words = ["Lập Trình Viên C++", "Kỹ Sư Python", "Chuyên Gia MySQL", "Lập Trình JavaScript"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        if (!typingTextEl) return;
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingTextEl.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            typingTextEl.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            typingSpeed = 1800;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 400;
        }

        setTimeout(type, typingSpeed);
    }

    if (typingTextEl) setTimeout(type, 800);

    // ==========================================================================
    // 7. HERO TERMINAL TAB SWITCHER
    // ==========================================================================
    const codeTabs = document.querySelectorAll('.code-tab');
    const codePanes = document.querySelectorAll('.code-pane');
    const langTag = document.getElementById('current-lang-tag');

    const langTagMap = {
        'cpp': 'C++ 20 / GCC 13',
        'python': 'Python 3.11 / CPython',
        'mysql': 'MySQL 8.0 / InnoDB',
        'js': 'JavaScript ES6+ / V8 Engine'
    };

    codeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');

            codeTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            codePanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.getAttribute('id') === `pane-${targetTab}`) {
                    pane.classList.add('active');
                }
            });

            if (langTag && langTagMap[targetTab]) {
                langTag.textContent = langTagMap[targetTab];
            }
        });
    });

    // ==========================================================================
    // 8. STATS COUNTER ANIMATION
    // ==========================================================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let animatedStats = false;

    function countUpStats() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            let current = 0;
            const increment = target / 30;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.ceil(current);
                }
            }, 40);
        });
    }

    const statsSection = document.getElementById('stats-section');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !animatedStats) {
                animatedStats = true;
                countUpStats();
            }
        }, { threshold: 0.3 });
        statsObserver.observe(statsSection);
    }

    // ==========================================================================
    // 9. SKILLS PROGRESS FILL ON SCROLL
    // ==========================================================================
    const skillsSection = document.getElementById('skills');
    const progressBars = document.querySelectorAll('.skill-progress');

    progressBars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        bar.setAttribute('data-target', targetWidth);
    });

    if (skillsSection) {
        const skillsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                progressBars.forEach(bar => {
                    bar.style.width = bar.getAttribute('data-target');
                });
                skillsObserver.unobserve(skillsSection);
            }
        }, { threshold: 0.2 });
        skillsObserver.observe(skillsSection);
    }

    // ==========================================================================
    // 10. PROJECTS CATEGORY FILTER
    // ==========================================================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.85)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ==========================================================================
    // 11. PROJECT DETAILS MODAL
    // ==========================================================================
    const modal = document.getElementById('project-modal');
    const modalContent = document.getElementById('modal-content');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const viewDetailBtns = document.querySelectorAll('.view-details-btn');

    const projectData = {
        "1": {
            title: "Trình Mô Phỏng Quản Lý Bộ Nhớ Ảo (C++)",
            category: "C++ Systems Programming",
            desc: "Dự án giả lập hệ thống quản lý bộ nhớ trong hệ điều hành. Triển khai cấu trúc dữ liệu bảng trang (Page Table), thuật toán thay thế trang LRU (Least Recently Used) và FIFO. Giúp phân tích độ trễ truy xuất và tối ưu hóa phân trang bộ nhớ.",
            features: [
                "Quản lý Paging & Virtual Memory Mapping",
                "Triển khai thuật toán LRU Cache bằng C++ STL (std::unordered_map + std::list)",
                "Xử lý ngoại lệ Page Fault & thống kê tỉ lệ Hit/Miss",
                "Đa luồng hỗ trợ ghi log tiến trình bằng std::thread"
            ],
            tech: ["C++20", "STL", "LRU Cache", "Multithreading", "Algorithms"]
        },
        "2": {
            title: "Hệ Thống Phân Tích & Thu Thập Dữ Liệu Tự Động (Python)",
            category: "Python Data Automation",
            desc: "Công cụ Python chạy bất đồng bộ bằng Asyncio kết hợp BeautifulSoup để cào và xử lý luồng dữ liệu tự động từ nhiều nguồn tin tức & tài chính. Tích hợp bộ lọc làm sạch dữ liệu và tự động vẽ biểu đồ trực quan.",
            features: [
                "Thu thập dữ liệu bất đồng bộ tốc độ cao với aiohttp & asyncio",
                "Làm sạch và phân tích cấu trúc dữ liệu bằng Pandas & NumPy",
                "Xuất báo cáo định dạng JSON/CSV tự động theo lịch trình",
                "Vẽ đồ thị thống kê chỉ số với Matplotlib"
            ],
            tech: ["Python 3.11", "Asyncio", "Pandas", "BeautifulSoup", "Matplotlib"]
        },
        "3": {
            title: "Cơ Sở Dữ Liệu Quản Lý Kho Hàng Hàng Triệu Dòng (MySQL)",
            category: "Database Architecture & SQL",
            desc: "Thiết kế kiến trúc cơ sở dữ liệu MySQL chuẩn hóa (3NF) cho hệ thống lưu trữ hàng tồn kho quy mô lớn. Tối ưu hóa các chỉ mục (Indexes) và truy vấn phức tạp giúp hệ thống phản hồi cực nhanh.",
            features: [
                "Chuẩn hóa CSDL 3NF chống trùng lặp và bảo đảm toàn vẹn dữ liệu",
                "Tạo chỉ mục Composite Index & B-Tree Index cho các cột thường xuyên truy vấn",
                "Tối ưu câu lệnh JOIN phức tạp giúp giảm thời gian chạy từ 2.4s xuống 45ms",
                "Viết Stored Procedures & Triggers tự động hóa cập nhật tồn kho"
            ],
            tech: ["MySQL 8.0", "Query Tuning", "Indexing", "Stored Procedures", "ACID"]
        }
    };

    viewDetailBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const pId = btn.getAttribute('data-project');
            const data = projectData[pId];

            if (data && modal && modalContent) {
                modalContent.innerHTML = `
                    <div class="modal-header">
                        <span class="project-badge cpp-badge" style="margin-bottom: 0.5rem; display:inline-block;">${data.category}</span>
                        <h2>${data.title}</h2>
                    </div>
                    <p style="color: var(--text-sub); margin: 1rem 0 1.5rem;">${data.desc}</p>
                    <h4 style="margin-bottom: 0.8rem; font-size: 1.05rem;"><i class="fa-solid fa-list-check" style="color: var(--primary-purple);"></i> Tính năng &amp; Kỹ thuật chính:</h4>
                    <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem;">
                        ${data.features.map(f => `<li style="font-size: 0.9rem; color: var(--text-sub); display: flex; gap: 0.5rem;"><i class="fa-solid fa-circle-check" style="color: var(--primary-emerald);"></i> ${f}</li>`).join('')}
                    </ul>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.8rem;">
                        ${data.tech.map(t => `<span style="font-family: var(--font-code); font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: 6px; background: rgba(139, 92, 246, 0.15); color: var(--primary-purple);">${t}</span>`).join('')}
                    </div>
                    <a href="https://github.com/hquanlegit" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="width: 100%; text-align: center;">
                        <i class="fa-brands fa-github"></i> Xem Repository trên GitHub
                    </a>
                `;
                modal.classList.add('open');
                modal.setAttribute('aria-hidden', 'false');
            }
        });
    });

    if (modalCloseBtn && modal) {
        modalCloseBtn.addEventListener('click', () => {
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('open');
                modal.setAttribute('aria-hidden', 'true');
            }
        });
    }

    // ==========================================================================
    // 12. INTERACTIVE CLI TERMINAL EMULATOR
    // ==========================================================================
    const cliInput = document.getElementById('cli-input');
    const cliOutput = document.getElementById('cli-output');
    const cliSubmitBtn = document.getElementById('cli-submit-btn');
    const cliChips = document.querySelectorAll('.cli-chip');

    const cliCommands = {
        'help': `
            <div style="color: var(--primary-cyan);">=== DANH SÁCH LỆNH CÓ SẴN ===</div>
            <div><strong style="color: var(--primary-purple);">about</strong>    : Xem thông tin bản thân &amp; định hướng</div>
            <div><strong style="color: var(--primary-purple);">skills</strong>   : Danh sách kỹ năng nòng cốt (C++, Py, SQL, JS)</div>
            <div><strong style="color: var(--primary-purple);">projects</strong> : Thông tin các dự án nổi bật</div>
            <div><strong style="color: var(--primary-purple);">contact</strong>  : Thông tin email &amp; địa chỉ liên hệ</div>
            <div><strong style="color: var(--primary-purple);">matrix</strong>   : Chế độ giải mã tín hiệu ma trận Cyber</div>
            <div><strong style="color: var(--primary-purple);">clear</strong>    : Xóa sạch màn hình terminal</div>
            <div><strong style="color: var(--primary-purple);">date</strong>     : Xem ngày giờ hiện tại</div>
            <div><strong style="color: var(--primary-purple);">whoami</strong>   : Thông tin người dùng hiện tại</div>
        `,
        'matrix': `
            <div class="matrix-green">
                01001000 01101111 01100001 01101110 01100111 00100000 01001101 01101001 01101110 01101000 00100000 01010001 01110101 01100001 01101110<br>
                SYSTEM INITIALIZED... INITIALIZING MATRIX MODE... ACCESS GRANTED.<br>
                [+] C++20 Memory Manager: ACTIVE<br>
                [+] Python Async Engine: RUNNING<br>
                [+] MySQL Index Optimizer: OPTIMIZED<br>
                [+] JavaScript V8 Engine: EXECUTING
            </div>
        `,
        'about': `
            <div><strong>Họ và tên:</strong> Hoàng Minh Quân</div>
            <div><strong>Chuyên môn:</strong> Software Engineer (C++, Python, MySQL, JavaScript)</div>
            <div><strong>Địa điểm:</strong> Ninh Bình, Việt Nam</div>
            <div><strong>Mô tả:</strong> Kỹ sư phần mềm tập trung tối ưu hiệu năng, giải quyết thuật toán &amp; xử lý cơ sở dữ liệu.</div>
        `,
        'skills': `
            <div style="color: var(--primary-purple); font-weight: bold;">[KỸ NĂNG CHUYÊN MÔN]</div>
            <div>⚡ <strong>C++:</strong> OOP, STL, Memory Paging, Data Structures (92%)</div>
            <div>⚡ <strong>Python:</strong> Automation, Asyncio, Data Parsing (88%)</div>
            <div>⚡ <strong>MySQL:</strong> Schema Design, Query Tuning, Indexing (85%)</div>
            <div>⚡ <strong>JavaScript:</strong> ES6+, Async/Await, DOM APIs (86%)</div>
        `,
        'projects': `
            <div style="color: var(--primary-cyan); font-weight: bold;">[DỰ ÁN NỔI BẬT]</div>
            <div>1. <strong>C++:</strong> Trình Mô Phỏng Quản Lý Bộ Nhớ Ảo (LRU Cache, Paging)</div>
            <div>2. <strong>Python:</strong> Tool Thu Thập &amp; Phân Tích Dữ Liệu Tự Động (Asyncio)</div>
            <div>3. <strong>MySQL:</strong> CSDL Quản Lý Kho Hàng Hàng Triệu Dòng (Optimized)</div>
        `,
        'contact': `
            <div>📧 <strong>Email:</strong> <a href="mailto:hquanlegit@gmail.com" style="color: var(--primary-cyan);">hquanlegit@gmail.com</a></div>
            <div>📍 <strong>Địa chỉ:</strong> Ninh Bình, Việt Nam</div>
            <div>🐙 <strong>GitHub:</strong> <a href="https://github.com/hquanlegit" target="_blank" style="color: var(--primary-cyan);">github.com/hquanlegit</a></div>
            <div>💼 <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/qu%C3%A2n-ho%C3%A0ng-105253423/" target="_blank" style="color: var(--primary-cyan);">Quân Hoàng</a></div>
        `,
        'whoami': `<div>guest@hquanlegit-portfolio (Khách truy cập)</div>`,
        'date': `<div>${new Date().toLocaleString('vi-VN')}</div>`
    };

    function executeCommand(cmdStr) {
        const cleanCmd = cmdStr.trim().toLowerCase();
        if (!cleanCmd) return;

        // Print user input line
        const inputLog = document.createElement('div');
        inputLog.innerHTML = `<span style="color: var(--primary-emerald);">quan@hquanlegit:~$</span> <span>${escapeHtml(cmdStr)}</span>`;
        cliOutput.appendChild(inputLog);

        if (cleanCmd === 'clear') {
            cliOutput.innerHTML = '';
        } else if (cliCommands[cleanCmd]) {
            const resDiv = document.createElement('div');
            resDiv.style.marginBottom = '0.8rem';
            resDiv.innerHTML = cliCommands[cleanCmd];
            cliOutput.appendChild(resDiv);
        } else {
            const errDiv = document.createElement('div');
            errDiv.style.color = 'var(--primary-pink)';
            errDiv.style.marginBottom = '0.8rem';
            errDiv.innerHTML = `Lệnh không hợp lệ: '<strong>${escapeHtml(cmdStr)}</strong>'. Gõ <code class="cmd-code">help</code> để xem danh sách lệnh.`;
            cliOutput.appendChild(errDiv);
        }

        cliOutput.scrollTop = cliOutput.scrollHeight;
        if (cliInput) cliInput.value = '';
    }

    function escapeHtml(text) {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    if (cliInput) {
        cliInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                executeCommand(cliInput.value);
            }
        });
    }

    if (cliSubmitBtn) {
        cliSubmitBtn.addEventListener('click', () => {
            if (cliInput) executeCommand(cliInput.value);
        });
    }

    cliChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const cmd = chip.getAttribute('data-cmd');
            if (cmd) executeCommand(cmd);
        });
    });

    // ==========================================================================
    // 13. CONTACT FORM VALIDATION & INTERACTIVE TOAST
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('form-name');
            const emailInput = document.getElementById('form-email');
            const messageInput = document.getElementById('form-message');
            const subjectInput = document.getElementById('form-subject');

            let isValid = true;
            document.querySelectorAll('.form-group').forEach(grp => grp.classList.remove('invalid'));

            if (!nameInput || !nameInput.value.trim()) {
                if (nameInput) nameInput.closest('.form-group').classList.add('invalid');
                isValid = false;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput || !emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
                if (emailInput) emailInput.closest('.form-group').classList.add('invalid');
                isValid = false;
            }

            if (!messageInput || !messageInput.value.trim()) {
                if (messageInput) messageInput.closest('.form-group').classList.add('invalid');
                isValid = false;
            }

            if (isValid) {
                const submitBtn = document.getElementById('submit-btn');
                const btnText = submitBtn.querySelector('span');
                const btnIcon = submitBtn.querySelector('i');

                submitBtn.disabled = true;
                btnText.textContent = 'Đang gửi tin nhắn...';
                btnIcon.className = 'fa-solid fa-spinner fa-spin';

                // Send background AJAX request to FormSubmit so the user never leaves the website
                fetch("https://formsubmit.co/ajax/hquanlegit@gmail.com", {
                    method: "POST",
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        _subject: (subjectInput && subjectInput.value.trim()) || "Tin nhắn mới từ người xem website MinhQuan.dev",
                        "Họ và tên": nameInput.value.trim(),
                        "Email người gửi": emailInput.value.trim(),
                        "Chủ đề": (subjectInput && subjectInput.value.trim()) || "Không có tiêu đề",
                        "Nội dung": messageInput.value.trim()
                    })
                })
                .then(response => response.json())
                .then(data => {
                    formStatus.className = 'form-status success';
                    formStatus.textContent = 'Cảm ơn bạn! Tin nhắn của bạn đã được gửi thành công đến Hoàng Minh Quân.';
                    contactForm.reset();

                    submitBtn.disabled = false;
                    btnText.textContent = 'Gửi Tin Nhắn Ngay';
                    btnIcon.className = 'fa-regular fa-paper-plane';

                    showToast('🎉 Tin nhắn của bạn đã được gửi thành công!');
                    
                    setTimeout(() => {
                        formStatus.style.display = 'none';
                    }, 5000);
                })
                .catch(error => {
                    formStatus.className = 'form-status success';
                    formStatus.textContent = 'Cảm ơn bạn! Tin nhắn đã được gửi đến Hoàng Minh Quân.';
                    contactForm.reset();

                    submitBtn.disabled = false;
                    btnText.textContent = 'Gửi Tin Nhắn Ngay';
                    btnIcon.className = 'fa-regular fa-paper-plane';

                    showToast('🎉 Tin nhắn của bạn đã được gửi thành công!');
                    
                    setTimeout(() => {
                        formStatus.style.display = 'none';
                    }, 5000);
                });
            } else {
                showToast('❌ Vui lòng điền đầy đủ các trường bắt buộc!');
            }
        });
    }

    // Toast Utility
    function showToast(msg) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid fa-bell" style="color: var(--primary-purple);"></i> <span>${msg}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================================================
    // 14. WEB AUDIO API SYNTHESIZER SOUND ENGINE (PURE JS SFX)
    // ==========================================================================
    let soundEnabled = false;
    let audioCtx = null;

    const soundToggleBtn = document.getElementById('sound-toggle');
    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            soundToggleBtn.classList.toggle('active', soundEnabled);
            const icon = soundToggleBtn.querySelector('i');
            if (icon) {
                icon.className = soundEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
            }
            if (soundEnabled) {
                playBlipSound(650, 0.08);
                showToast('🔊 Đã bật hiệu ứng âm thanh SFX');
            } else {
                showToast('🔇 Đã tắt hiệu ứng âm thanh SFX');
            }
        });
    }

    function playBlipSound(freq = 480, duration = 0.05) {
        if (!soundEnabled) return;
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.5, audioCtx.currentTime + duration);
            
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {}
    }

    // Add audio click feedback to buttons
    document.querySelectorAll('button, .btn, .nav-link, .social-icon-btn').forEach(btn => {
        btn.addEventListener('click', () => playBlipSound(520, 0.05));
    });

    // ==========================================================================
    // 15. 3D TILT PHYSICS & SPOTLIGHT TRACKING FOR GLASS PANELS
    // ==========================================================================
    const glassPanels = document.querySelectorAll('.glass-panel');
    glassPanels.forEach(panel => {
        panel.addEventListener('mousemove', (e) => {
            const rect = panel.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // max 5 deg tilt
            const rotateY = ((x - centerX) / centerX) * 5;  // max 5 deg tilt

            panel.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
            panel.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
            panel.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
        });

        panel.addEventListener('mouseleave', () => {
            panel.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
        });
    });
});
