// ============================================
// PARTICLE ANIMATION FOR HERO SECTION
// ============================================
const particlesCanvas = document.getElementById('particles-canvas');
if (particlesCanvas) {
    const ctx = particlesCanvas.getContext('2d');
    let particles = [];
    
    function resizeCanvas() {
        particlesCanvas.width = window.innerWidth;
        particlesCanvas.height = window.innerHeight;
    }
    
    class Particle {
        constructor() {
            this.x = Math.random() * particlesCanvas.width;
            this.y = Math.random() * particlesCanvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 1.5 + 0.5;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > particlesCanvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > particlesCanvas.height) this.vy *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fill();
        }
    }
    
    function initParticles() {
        particles = [];
        const particleCount = Math.min(Math.floor(window.innerWidth / 15), 100);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * (1 - distance / 150)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        connectParticles();
        requestAnimationFrame(animateParticles);
    }
    
    resizeCanvas();
    initParticles();
    animateParticles();
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
}

// ============================================
// SPIDER WEB SKILLS VISUALIZATION
// ============================================
const skillsCanvas = document.getElementById('skills-web');
if (skillsCanvas) {
    const skillsCtx = skillsCanvas.getContext('2d');
    const skillNodes = document.querySelectorAll('.skill-node');
    
    function resizeSkillsCanvas() {
        const container = document.querySelector('.skills-web-container');
        skillsCanvas.width = container.offsetWidth;
        skillsCanvas.height = container.offsetHeight;
        drawWeb();
    }
    
    function getNodePositions() {
        const positions = [];
        skillNodes.forEach(node => {
            const rect = node.getBoundingClientRect();
            const containerRect = skillsCanvas.getBoundingClientRect();
            positions.push({
                x: rect.left - containerRect.left + rect.width / 2,
                y: rect.top - containerRect.top + rect.height / 2,
                level: parseInt(node.dataset.level) || 70
            });
        });
        return positions;
    }
    
    function drawWeb() {
        skillsCtx.clearRect(0, 0, skillsCanvas.width, skillsCanvas.height);
        const positions = getNodePositions();
        
        // Draw center point
        const centerX = skillsCanvas.width / 2;
        const centerY = skillsCanvas.height / 2;
        
        // Draw connections from center to all nodes
        positions.forEach(pos => {
            skillsCtx.beginPath();
            skillsCtx.moveTo(centerX, centerY);
            skillsCtx.lineTo(pos.x, pos.y);
            skillsCtx.strokeStyle = `rgba(255, 255, 255, ${0.1 + pos.level / 500})`;
            skillsCtx.lineWidth = 1.5;
            skillsCtx.stroke();
        });
        
        // Draw connections between nodes
        for (let i = 0; i < positions.length; i++) {
            for (let j = i + 1; j < positions.length; j++) {
                skillsCtx.beginPath();
                skillsCtx.moveTo(positions[i].x, positions[i].y);
                skillsCtx.lineTo(positions[j].x, positions[j].y);
                skillsCtx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
                skillsCtx.lineWidth = 1;
                skillsCtx.stroke();
            }
        }
        
        // Draw center glow
        const gradient = skillsCtx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 100);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        skillsCtx.fillStyle = gradient;
        skillsCtx.fillRect(0, 0, skillsCanvas.width, skillsCanvas.height);
    }
    
    // Animate web on hover
    skillNodes.forEach(node => {
        node.addEventListener('mouseenter', function() {
            const level = parseInt(this.dataset.level);
            const positions = getNodePositions();
            const nodeIndex = Array.from(skillNodes).indexOf(this);
            
            skillsCtx.clearRect(0, 0, skillsCanvas.width, skillsCanvas.height);
            drawWeb();
            
            // Highlight connections for hovered node
            if (positions[nodeIndex]) {
                const centerX = skillsCanvas.width / 2;
                const centerY = skillsCanvas.height / 2;
                
                skillsCtx.beginPath();
                skillsCtx.moveTo(centerX, centerY);
                skillsCtx.lineTo(positions[nodeIndex].x, positions[nodeIndex].y);
                skillsCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                skillsCtx.lineWidth = 2;
                skillsCtx.stroke();
                
                // Glow effect
                skillsCtx.shadowBlur = 20;
                skillsCtx.shadowColor = 'rgba(255, 255, 255, 0.5)';
                skillsCtx.beginPath();
                skillsCtx.arc(positions[nodeIndex].x, positions[nodeIndex].y, 10, 0, Math.PI * 2);
                skillsCtx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                skillsCtx.fill();
                skillsCtx.shadowBlur = 0;
            }
        });
        
        node.addEventListener('mouseleave', drawWeb);
    });
    
    resizeSkillsCanvas();
    
    window.addEventListener('resize', resizeSkillsCanvas);
    setTimeout(resizeSkillsCanvas, 500);
}

// ============================================
// SMOOTH SCROLL & NAVIGATION
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ============================================
// ACTIVE NAVIGATION ON SCROLL
// ============================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// ============================================
// REVEAL SECTIONS ON SCROLL
// ============================================
const revealSections = document.querySelectorAll('.reveal-section');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

revealSections.forEach(section => {
    revealObserver.observe(section);
});

// ============================================
// PARALLAX EFFECT FOR BACKGROUNDS
// ============================================
window.addEventListener('scroll', () => {
    const parallaxBg = document.querySelector('.parallax-bg');
    if (parallaxBg) {
        const scrolled = window.pageYOffset;
        const parentTop = parallaxBg.parentElement.offsetTop;
        const offset = scrolled - parentTop;
        parallaxBg.style.transform = `translateY(${offset * 0.3}px)`;
    }
});

// ============================================
// MOBILE MENU TOGGLE
// ============================================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ============================================
// FORM SUBMISSION - Google Form Integration
// ============================================
const contactForm = document.querySelector('#contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.submit-btn-modern');
        const btnText = submitBtn.querySelector('.btn-text');
        const originalText = btnText.textContent;
        
        btnText.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const project = formData.get('project');
        const message = formData.get('message');
        
        // Google Form field IDs (from your form URL)
        const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdtMiO6hY7KrZuU-hb0NvW9_XP9j2NTX7J1KNR_Bqad103H3Q/formResponse';
        
        // Create form data for Google Form
        const googleFormData = new URLSearchParams();
        googleFormData.append('entry.954099316', name); // Name field
        googleFormData.append('entry.1392803094', email); // Email field
        googleFormData.append('entry.1742873809', project); // Project Type field
        googleFormData.append('entry.1601031012', message); // Message field
        
        try {
            // Submit to Google Form
            await fetch(googleFormUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: googleFormData
            });
            
            btnText.textContent = 'Message Sent! ✓';
            setTimeout(() => {
                btnText.textContent = originalText;
                submitBtn.disabled = false;
                contactForm.reset();
            }, 2000);
        } catch (error) {
            console.error('Error submitting form:', error);
            btnText.textContent = 'Error - Try Again';
            setTimeout(() => {
                btnText.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        }
    });
}

// ============================================
// CURSOR TRAIL EFFECT
// ============================================
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// ============================================
// ANIMATE STATS ON SCROLL
// ============================================
const stats = document.querySelectorAll('.stat h3');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const target = parseInt(entry.target.textContent);
            let count = 0;
            const duration = 2000;
            const increment = target / (duration / 16);
            
            const timer = setInterval(() => {
                count += increment;
                if (count >= target) {
                    entry.target.textContent = target + '+';
                    clearInterval(timer);
                } else {
                    entry.target.textContent = Math.floor(count) + '+';
                }
            }, 16);
        }
    });
}, { threshold: 0.5 });

stats.forEach(stat => statsObserver.observe(stat));

// ============================================
// PROJECT CARDS STAGGER ANIMATION
// ============================================
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
});

// ============================================
// CONSOLE EASTER EGG
// ============================================
console.log('%c👋 Welcome to Love Agarwal\'s Portfolio!', 'font-size: 24px; font-weight: bold; color: #ffffff; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
console.log('%c🚀 Building AI in Healthcare | Designer | Vibe Coder', 'font-size: 14px; color: #888888;');
console.log('%c💡 Interested in collaboration? Let\'s connect!', 'font-size: 12px; color: #666666;');

// ============================================
// TILTED CARD 3D EFFECT FOR ABOUT SECTION
// ============================================
const tiltedCard = document.getElementById('about-tilted-card');
if (tiltedCard) {
    const cardInner = tiltedCard.querySelector('.tilted-card-inner');
    const tooltip = tiltedCard.querySelector('.tilted-card-tooltip');
    
    const springConfig = {
        damping: 30,
        stiffness: 100,
        mass: 2
    };
    
    let currentRotateX = 0;
    let currentRotateY = 0;
    let currentScale = 1;
    let targetRotateX = 0;
    let targetRotateY = 0;
    let targetScale = 1;
    let lastY = 0;
    let tooltipRotate = 0;
    let targetTooltipRotate = 0;
    
    const rotateAmplitude = 14;
    const scaleOnHover = 1.1;
    
    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
    
    function handleMouseMove(e) {
        const rect = tiltedCard.getBoundingClientRect();
        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;
        
        targetRotateX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
        targetRotateY = (offsetX / (rect.width / 2)) * rotateAmplitude;
        
        // Position tooltip
        tooltip.style.left = `${e.clientX - rect.left}px`;
        tooltip.style.top = `${e.clientY - rect.top}px`;
        
        // Calculate tooltip rotation based on velocity
        const velocityY = offsetY - lastY;
        targetTooltipRotate = -velocityY * 0.6;
        lastY = offsetY;
    }
    
    function handleMouseEnter() {
        targetScale = scaleOnHover;
        tooltip.style.opacity = '1';
    }
    
    function handleMouseLeave() {
        targetScale = 1;
        targetRotateX = 0;
        targetRotateY = 0;
        targetTooltipRotate = 0;
        tooltip.style.opacity = '0';
    }
    
    function animate() {
        // Spring animation
        const springFactor = 0.15;
        currentRotateX = lerp(currentRotateX, targetRotateX, springFactor);
        currentRotateY = lerp(currentRotateY, targetRotateY, springFactor);
        currentScale = lerp(currentScale, targetScale, springFactor);
        tooltipRotate = lerp(tooltipRotate, targetTooltipRotate, 0.2);
        
        cardInner.style.transform = `
            perspective(1000px)
            rotateX(${currentRotateX}deg)
            rotateY(${currentRotateY}deg)
            scale(${currentScale})
        `;
        
        tooltip.style.transform = `
            translate(-50%, -50%)
            rotate(${tooltipRotate}deg)
        `;
        
        requestAnimationFrame(animate);
    }
    
    tiltedCard.addEventListener('mousemove', handleMouseMove);
    tiltedCard.addEventListener('mouseenter', handleMouseEnter);
    tiltedCard.addEventListener('mouseleave', handleMouseLeave);
    
    animate();
}

// ============================================
// MAGIC BENTO PROJECTS - INTERACTIVE EFFECTS
// ============================================
const bentoGrid = document.getElementById('projects-bento-grid');
if (bentoGrid) {
    const PARTICLE_COUNT = 12;
    const SPOTLIGHT_RADIUS = 300;
    const GLOW_COLOR = '132, 0, 255';
    const isMobile = window.innerWidth <= 768;
    
    // Create global spotlight
    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    spotlight.style.background = `radial-gradient(circle,
        rgba(${GLOW_COLOR}, 0.15) 0%,
        rgba(${GLOW_COLOR}, 0.08) 15%,
        rgba(${GLOW_COLOR}, 0.04) 25%,
        rgba(${GLOW_COLOR}, 0.02) 40%,
        rgba(${GLOW_COLOR}, 0.01) 65%,
        transparent 70%
    )`;
    document.body.appendChild(spotlight);
    
    // Utility functions
    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
    
    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            background: rgba(${GLOW_COLOR}, 1);
            box-shadow: 0 0 6px rgba(${GLOW_COLOR}, 0.6);
        `;
        return particle;
    }
    
    // Handle each card
    const cards = bentoGrid.querySelectorAll('.magic-bento-card');
    cards.forEach(card => {
        let particles = [];
        let isHovered = false;
        let animationFrameId = null;
        
        // Tilt and magnetism values
        let currentRotateX = 0, currentRotateY = 0;
        let targetRotateX = 0, targetRotateY = 0;
        let currentX = 0, currentY = 0;
        let targetX = 0, targetY = 0;
        
        // Particle animation
        function animateParticles() {
            if (!isHovered) return;
            
            const rect = card.getBoundingClientRect();
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                setTimeout(() => {
                    if (!isHovered) return;
                    
                    const particle = createParticle(
                        Math.random() * rect.width,
                        Math.random() * rect.height
                    );
                    card.appendChild(particle);
                    particles.push(particle);
                    
                    // Initial scale animation
                    particle.style.transform = 'scale(0)';
                    particle.style.opacity = '0';
                    setTimeout(() => {
                        particle.style.transition = 'transform 0.3s, opacity 0.3s';
                        particle.style.transform = 'scale(1)';
                        particle.style.opacity = '1';
                    }, 10);
                    
                    // Floating animation
                    const moveX = (Math.random() - 0.5) * 100;
                    const moveY = (Math.random() - 0.5) * 100;
                    const duration = 2000 + Math.random() * 2000;
                    
                    let startTime = Date.now();
                    function floatParticle() {
                        if (!particles.includes(particle)) return;
                        
                        const elapsed = (Date.now() - startTime) % duration;
                        const progress = elapsed / duration;
                        const eased = Math.sin(progress * Math.PI * 2);
                        
                        const x = parseFloat(particle.style.left) + moveX * eased * 0.01;
                        const y = parseFloat(particle.style.top) + moveY * eased * 0.01;
                        
                        particle.style.transform = `translate(${x - parseFloat(particle.style.left)}px, ${y - parseFloat(particle.style.top)}px) scale(1) rotate(${progress * 360}deg)`;
                        particle.style.opacity = 0.3 + Math.abs(eased) * 0.7;
                        
                        requestAnimationFrame(floatParticle);
                    }
                    floatParticle();
                }, i * 100);
            }
        }
        
        function clearParticles() {
            particles.forEach(particle => {
                particle.style.transition = 'transform 0.3s, opacity 0.3s';
                particle.style.transform = 'scale(0)';
                particle.style.opacity = '0';
                setTimeout(() => particle.remove(), 300);
            });
            particles = [];
        }
        
        // Smooth tilt and magnetism animation
        function animate() {
            const springFactor = 0.15;
            currentRotateX = lerp(currentRotateX, targetRotateX, springFactor);
            currentRotateY = lerp(currentRotateY, targetRotateY, springFactor);
            currentX = lerp(currentX, targetX, 0.3);
            currentY = lerp(currentY, targetY, 0.3);
            
            card.style.transform = `
                perspective(1000px)
                rotateX(${currentRotateX}deg)
                rotateY(${currentRotateY}deg)
                translate(${currentX}px, ${currentY}px)
            `;
            
            animationFrameId = requestAnimationFrame(animate);
        }
        
        if (!isMobile) {
            animate();
        }
        
        // Mouse events
        card.addEventListener('mouseenter', () => {
            isHovered = true;
            if (!isMobile) animateParticles();
        });
        
        card.addEventListener('mouseleave', () => {
            isHovered = false;
            clearParticles();
            targetRotateX = 0;
            targetRotateY = 0;
            targetX = 0;
            targetY = 0;
        });
        
        card.addEventListener('mousemove', e => {
            if (isMobile) return;
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Tilt effect
            targetRotateX = ((y - centerY) / centerY) * -10;
            targetRotateY = ((x - centerX) / centerX) * 10;
            
            // Magnetism effect
            targetX = (x - centerX) * 0.05;
            targetY = (y - centerY) * 0.05;
        });
        
        // Click ripple effect
        card.addEventListener('click', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const maxDistance = Math.max(
                Math.hypot(x, y),
                Math.hypot(x - rect.width, y),
                Math.hypot(x, y - rect.height),
                Math.hypot(x - rect.width, y - rect.height)
            );
            
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                width: ${maxDistance * 2}px;
                height: ${maxDistance * 2}px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(${GLOW_COLOR}, 0.4) 0%, rgba(${GLOW_COLOR}, 0.2) 30%, transparent 70%);
                left: ${x - maxDistance}px;
                top: ${y - maxDistance}px;
                pointer-events: none;
                z-index: 1000;
                transform: scale(0);
                opacity: 1;
                transition: transform 0.8s ease-out, opacity 0.8s ease-out;
            `;
            
            card.appendChild(ripple);
            
            setTimeout(() => {
                ripple.style.transform = 'scale(1)';
                ripple.style.opacity = '0';
            }, 10);
            
            setTimeout(() => ripple.remove(), 800);
        });
    });
    
    // Global spotlight effect
    let isInsideSection = false;
    
    document.addEventListener('mousemove', e => {
        if (isMobile) return;
        
        const section = bentoGrid.closest('.bento-section');
        const rect = section.getBoundingClientRect();
        const mouseInside = e.clientX >= rect.left && e.clientX <= rect.right && 
                           e.clientY >= rect.top && e.clientY <= rect.bottom;
        
        isInsideSection = mouseInside;
        
        if (!mouseInside) {
            spotlight.style.opacity = '0';
            cards.forEach(card => {
                card.style.setProperty('--glow-intensity', '0');
            });
            return;
        }
        
        spotlight.style.left = e.clientX + 'px';
        spotlight.style.top = e.clientY + 'px';
        
        const proximity = SPOTLIGHT_RADIUS * 0.5;
        const fadeDistance = SPOTLIGHT_RADIUS * 0.75;
        let minDistance = Infinity;
        
        cards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            const centerX = cardRect.left + cardRect.width / 2;
            const centerY = cardRect.top + cardRect.height / 2;
            const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY) - 
                           Math.max(cardRect.width, cardRect.height) / 2;
            const effectiveDistance = Math.max(0, distance);
            
            minDistance = Math.min(minDistance, effectiveDistance);
            
            let glowIntensity = 0;
            if (effectiveDistance <= proximity) {
                glowIntensity = 1;
            } else if (effectiveDistance <= fadeDistance) {
                glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
            }
            
            const relativeX = ((e.clientX - cardRect.left) / cardRect.width) * 100;
            const relativeY = ((e.clientY - cardRect.top) / cardRect.height) * 100;
            
            card.style.setProperty('--glow-x', `${relativeX}%`);
            card.style.setProperty('--glow-y', `${relativeY}%`);
            card.style.setProperty('--glow-intensity', glowIntensity.toString());
            card.style.setProperty('--glow-radius', `${SPOTLIGHT_RADIUS}px`);
        });
        
        const targetOpacity = minDistance <= proximity ? 0.8 : 
                            minDistance <= fadeDistance ? 
                            ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8 : 0;
        
        spotlight.style.transition = targetOpacity > 0 ? 'opacity 0.2s' : 'opacity 0.5s';
        spotlight.style.opacity = targetOpacity.toString();
    });
    
    document.addEventListener('mouseleave', () => {
        spotlight.style.opacity = '0';
        cards.forEach(card => {
            card.style.setProperty('--glow-intensity', '0');
        });
    });
}

// ============================================
// INFINITE GRID MENU - 3D SKILLS
// ============================================
import { InfiniteGridMenu } from './infiniteMenu.js';

const skillsData = [
    {
        image: createSkillCanvas('🎨', 'Graphic Design', '#667eea'),
        link: '#',
        title: 'Graphic Design',
        description: 'Adobe Photoshop, Illustrator, Premiere Pro - 90% proficiency'
    },
    {
        image: createSkillCanvas('📱', 'Social Media', '#764ba2'),
        link: '#',
        title: 'Social Media',
        description: 'Content Strategy, SMM, SMO - 90% proficiency'
    },
    {
        image: createSkillCanvas('🎬', 'Video Editing', '#f093fb'),
        link: '#',
        title: 'Video Editing',
        description: 'After Effects, Premiere Pro - 85% proficiency'
    },
    {
        image: createSkillCanvas('🤖', 'AI & Development', '#4facfe'),
        link: '#',
        title: 'AI & Development',
        description: 'AI in Healthcare, Web Dev - 80% proficiency'
    },
    {
        image: createSkillCanvas('📸', 'Photography', '#43e97b'),
        link: '#',
        title: 'Photography',
        description: 'Visual Storytelling - 85% proficiency'
    },
    {
        image: createSkillCanvas('💼', 'Digital Marketing', '#fa709a'),
        link: '#',
        title: 'Digital Marketing',
        description: 'SEM, Market Research - 80% proficiency'
    }
];

// Create canvas-based skill cards instead of using images
function createSkillCanvas(emoji, title, color) {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, 800, 800);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, '#000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 800);
    
    // Add subtle grid pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 800; i += 80) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 800);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(800, i);
        ctx.stroke();
    }
    
    // Draw emoji
    ctx.font = 'bold 300px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(emoji, 400, 350);
    
    // Draw title
    ctx.font = 'bold 60px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(title, 400, 600);
    
    // Add glow effect
    ctx.shadowColor = color;
    ctx.shadowBlur = 40;
    ctx.fillText(title, 400, 600);
    
    return canvas.toDataURL();
}

// Initialize 3D Menu when canvas is available
const infiniteCanvas = document.getElementById('infinite-grid-menu-canvas');
if (infiniteCanvas) {
    let activeItem = null;
    let menuInstance = null;
    
    const titleElement = document.querySelector('.face-title');
    const descElement = document.querySelector('.face-description');
    const buttonElement = document.querySelector('.action-button');
    
    const handleActiveItemChange = (index) => {
        activeItem = skillsData[index];
        if (titleElement) titleElement.textContent = activeItem.title;
        if (descElement) descElement.textContent = activeItem.description;
    };
    
    const handleMovementChange = (isMoving) => {
        if (isMoving) {
            titleElement?.classList.remove('active');
            titleElement?.classList.add('inactive');
            descElement?.classList.remove('active');
            descElement?.classList.add('inactive');
        } else {
            titleElement?.classList.remove('inactive');
            titleElement?.classList.add('active');
            descElement?.classList.remove('inactive');
            descElement?.classList.add('active');
        }
    };
    
    // Initialize the menu
    menuInstance = new InfiniteGridMenu(
        infiniteCanvas,
        skillsData,
        handleActiveItemChange,
        handleMovementChange,
        (instance) => {
            instance.run();
        }
    );
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (menuInstance) {
                menuInstance.resize();
            }
        }, 250);
    });
}

