document.addEventListener('DOMContentLoaded', () => {

    // Dynamic Year
    const yearSpan = document.getElementById('currentYear');
    if(yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 1. SURPRISE ENVELOPE LOGIC
    const wrapper = document.getElementById('envelopeWrapper');
    const overlay = document.getElementById('surprise-overlay');
    const mainContent = document.getElementById('main-content');
    const instruct = document.getElementById('clickInstruction');

    if (wrapper) {
        wrapper.addEventListener('click', () => {
            if (wrapper.classList.contains('open')) return;
            
            wrapper.classList.add('open');
            if(instruct) instruct.innerHTML = "BOOM! 🎆💖";
            
            const duration = 3000;
            const end = Date.now() + duration;

            (function frame() {
                confetti({
                    particleCount: 5, angle: 60, spread: 55, origin: { x: 0 },
                    colors: ['#ff3b3b','#ff6b9e','#ffc107', '#ffffff', '#8e44ad']
                });
                confetti({
                    particleCount: 5, angle: 120, spread: 55, origin: { x: 1 },
                    colors: ['#ff3b3b','#ff6b9e','#ffc107', '#ffffff', '#8e44ad']
                });
                if (Date.now() < end) requestAnimationFrame(frame);
            }());

            setTimeout(() => {
                if(overlay) overlay.style.opacity = '0';
                
                setTimeout(() => {
                    if(overlay) overlay.style.display = 'none';
                    if(mainContent) mainContent.classList.add('visible');
                    
                    initMouseTrail();
                    initScrollObserver();
                    initHeartFireworks(); // AMAZING FIREWORKS BACKGROUND
                    initBalloons(); // NEW: Floating Poppable Balloons
                }, 1500);
            }, 3500); 
        });
    }

    initSlideshow();
});

// BALLOON LOGIC: Fun interactive pops!
function initBalloons() {
    const container = document.getElementById('balloon-container');
    if(!container) return;

    const wishes = [
        "Stay Magical! ✨", "Keep Smiling! 😊", "You are Loved! ❤️", 
        "HBD Mansi! 🎂", "Queen of Hearts! 👑", "Shine Bright! 🌟",
        "Most Beautiful! 🌺", "Pure Soul! 😇", "Wish came true! 🌠",
        "My Sunshine! ☀️", "Deeply Loved! 💖", "Angel! 👼",
        "Truly Special! 💎", "One in a Million! ☝️", "Soulmate! 💞"
    ];

    function createBalloon() {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        
        // Random position and color
        const x = Math.random() * (window.innerWidth - 60);
        const hue = Math.random() * 360;
        balloon.style.left = x + 'px';
        balloon.style.background = `hsla(${hue}, 70%, 70%, 0.9)`;
        
        // Random message
        const msg = document.createElement('div');
        msg.className = 'balloon-msg';
        msg.innerText = wishes[Math.floor(Math.random() * wishes.length)];
        balloon.appendChild(msg);

        // Click to pop!
        balloon.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Confetti burst on pop
            confetti({
                particleCount: 40,
                spread: 60,
                origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
                colors: [balloon.style.background, '#ffffff', '#FFD700']
            });

            balloon.remove();
        });

        // Add variety to speed
        const speed = 4 + Math.random() * 4; // 4s to 8s
        balloon.style.animationDuration = speed + 's';

        container.appendChild(balloon);

        // Remove after animation finished
        setTimeout(() => {
            if(balloon.parentNode) balloon.remove();
        }, speed * 1000);
    }

    // Spawn balloons periodically
    setInterval(() => {
        if(Math.random() > 0.3) createBalloon();
    }, 800);
}

// STAGGER SCROLL OBSERVER
function initScrollObserver() {
    const staggers = document.querySelectorAll('.stagger-in');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let delay = entry.target.style.getPropertyValue('--i');
                if (delay) entry.target.style.transitionDelay = `${delay * 0.2}s`;
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    staggers.forEach(el => observer.observe(el));
}

// ROMANTIC SLIDESHOW
let slideIndex = 0; let slideTimer;
function initSlideshow() {
    showSlides(slideIndex);
    slideTimer = setInterval(() => { changeSlide(1); }, 3500);
    const block = document.getElementById('slideshowContainer');
    if(block) {
        block.addEventListener('mouseenter', () => clearInterval(slideTimer));
        block.addEventListener('mouseleave', () => slideTimer = setInterval(() => changeSlide(1), 3500));
    }
}
window.changeSlide = function(n) { slideIndex += n; showSlides(slideIndex); }
function showSlides(n) {
    const slides = document.getElementsByClassName("slide");
    if(!slides.length) return;
    if (n >= slides.length) slideIndex = 0;
    if (n < 0) slideIndex = slides.length - 1;
    for (let i=0; i<slides.length; i++) slides[i].classList.remove('active');
    slides[slideIndex].classList.add('active');
}

// MUSIC PLAYER
window.togglePlay = function(id) {
    const audio = document.getElementById('audio-' + id);
    const vinyl = document.getElementById('vinyl-' + id);
    const btn = document.getElementById('play-btn-' + id);
    
    document.querySelectorAll('audio').forEach(other => {
        if(other !== audio && !other.paused) {
            other.pause();
            let oId = other.id.split('-')[1];
            document.getElementById('vinyl-' + oId).classList.remove('playing');
            document.getElementById('play-btn-' + oId).innerHTML = '▶';
        }
    });

    if (audio.paused) {
        audio.play(); vinyl.classList.add('playing'); btn.innerHTML = '⏸';
    } else {
        audio.pause(); vinyl.classList.remove('playing'); btn.innerHTML = '▶';
    }

    audio.ontimeupdate = () => {
        if(audio.duration) document.getElementById('progress-' + id).style.width = (audio.currentTime / audio.duration * 100) + '%';
    };
    audio.onended = () => {
        vinyl.classList.remove('playing'); btn.innerHTML = '▶';
        document.getElementById('progress-' + id).style.width = '0%';
    };
}
window.seekAudio = function(e, id) {
    const audio = document.getElementById('audio-' + id);
    if(audio.duration) audio.currentTime = (e.offsetX / e.currentTarget.clientWidth) * audio.duration;
}

// CANVAS 2: MULTI-COLORED HEART MOUSE TRAIL
function initMouseTrail() {
    const canvas = document.getElementById('trailCanvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    
    function resize() {
        canvas.width = window.innerWidth; 
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
    
    let particles = [];
    window.addEventListener('mousemove', e => {
        // Spawn multiple sizes and random colors for the cursor trail
        particles.push({ 
            x: e.clientX, 
            y: e.clientY, 
            size: Math.random() * 12 + 6, // Slightly bolder sizes to clearly see the heart shape
            speedY: Math.random() * 2 - 1, 
            speedX: Math.random() * 2 - 1, 
            life: 1,
            colorHue: Math.floor(Math.random() * 360) // Multi-colored hues
        });
    });

    // Elegant formula to draw tiny, perfect romantic hearts dynamically
    function drawHeart(ctx, x, y, size, hue, alpha) {
        ctx.save();
        ctx.beginPath();
        ctx.translate(x, y - size/2);
        ctx.scale(size/15, size/15);
        ctx.moveTo(0, 5);
        ctx.bezierCurveTo(-7.5, -7.5, -15, 10, 0, 20);
        ctx.bezierCurveTo(15, 10, 7.5, -7.5, 0, 5);
        ctx.fillStyle = `hsla(${hue}, 100%, 65%, ${alpha})`;
        ctx.fill();
        ctx.restore();
    }
    
    function animate() {
        ctx.clearRect(0,0, canvas.width, canvas.height);
        for(let i=0; i<particles.length; i++) {
            let p = particles[i];
            
            drawHeart(ctx, p.x, p.y, p.size, p.colorHue, p.life);
            
            p.x += p.speedX; 
            p.y += p.speedY; 
            p.life -= 0.02; // gradual fade out
            p.size *= 0.98; // gentle scaling down
            
            if(p.life <= 0) { 
                particles.splice(i, 1); 
                i--; 
            }
        }
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}

// FIREWORKS BACKGROUND: EXPLODING HEARTS!
function initHeartFireworks() {
    const canvas = document.getElementById('fallingHeartsCanvas'); // Using the persistent fullscreen background canvas
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
    
    const fireworks = [];
    const particles = [];
    
    function random(min, max) { return Math.random() * (max - min) + min; }
    
    // Mathematical heart shape velocity generator
    function getHeartVelocity(t) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        return { x: x * 0.15, y: y * 0.15 }; 
    }

    class Firework {
        constructor() {
            this.x = random(canvas.width * 0.1, canvas.width * 0.9);
            this.y = canvas.height;
            this.targetY = random(canvas.height * 0.1, canvas.height * 0.45);
            this.speed = random(8, 14);
            this.vx = random(-2, 2);
            this.vy = -this.speed;
            this.trail = [];
            // MULTIPLE COLORS: full rainbow hue spectrum 0-360
            this.color = `hsl(${random(0, 360)}, 100%, 65%)`; 
        }
        update(index) {
            this.trail.push({x: this.x, y: this.y});
            if(this.trail.length > 5) this.trail.shift();
            
            this.x += this.vx;
            this.y += this.vy;
            
            // BOOM!
            if (this.y <= this.targetY || this.vy >= 0) {
                this.explode();
                fireworks.splice(index, 1);
            }
        }
        draw() {
            ctx.beginPath();
            if(this.trail.length > 0) {
                ctx.moveTo(this.trail[0].x, this.trail[0].y);
            } else {
                ctx.moveTo(this.x, this.y);
            }
            ctx.lineTo(this.x, this.y);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.stroke();
        }
        explode() {
            const numParticles = 70; // High particle density for a solid heart shell
            for (let i = 0; i < numParticles; i++) {
                const t = (Math.PI * 2 * i) / numParticles;
                const v = getHeartVelocity(t);
                particles.push(new Particle(this.x, this.y, v.x, v.y, this.color));
            }
            // Add a few scattered gold particles to mimic a real firecracker blast
            for(let i=0; i<15; i++) {
                particles.push(new Particle(this.x, this.y, random(-3,3), random(-3,3), 'hsl(51, 100%, 65%)')); 
            }
        }
    }

    class Particle {
        constructor(x, y, vx, vy, color) {
            this.x = x;
            this.y = y;
            const spread = random(0.9, 1.1);
            this.vx = vx * spread;
            this.vy = vy * spread;
            this.color = color;
            this.alpha = 1;
            this.decay = random(0.01, 0.02);
            this.trail = [];
        }
        update(index) {
            this.trail.push({x: this.x, y: this.y});
            if(this.trail.length > 4) this.trail.shift();
            
            this.vx *= 0.94; // Air friction
            this.vy *= 0.94;
            this.vy += 0.04; // Gravity pulling sparks smoothly down
            
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= this.decay;
            
            if (this.alpha <= 0) particles.splice(index, 1);
        }
        draw() {
            ctx.beginPath();
            if(this.trail.length > 0) {
                ctx.moveTo(this.trail[0].x, this.trail[0].y);
            } else {
                ctx.moveTo(this.x, this.y);
            }
            ctx.lineTo(this.x, this.y);
            ctx.strokeStyle = this.color.replace(')', `, ${this.alpha})`).replace('hsl', 'hsla');
            ctx.lineWidth = 2 + (this.alpha * 2);
            ctx.lineCap = 'round';
            ctx.stroke();
        }
    }

    let lastLaunch = 0;
    
    function animate(time) {
        // Transparent fill seamlessly clears but leaves trailing rocket light traces behind
        // Semi-transparent fill creates motion trails on a light background (#ffe6f2)
        ctx.fillStyle = 'rgba(255, 230, 242, 0.4)'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height); 
        
        // BOHOT SARE FIREWORKS: Rapid firing multiple rockets
        if (time - lastLaunch > random(150, 450)) {
            fireworks.push(new Firework());
            if(Math.random() > 0.4) fireworks.push(new Firework()); // Double blast
            if(Math.random() > 0.7) fireworks.push(new Firework()); // Triple blast!
            lastLaunch = time;
        }
        
        for (let i = fireworks.length - 1; i >= 0; i--) {
            fireworks[i].draw();
            fireworks[i].update(i);
        }
        
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].draw();
            particles[i].update(i);
        }
        
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}
