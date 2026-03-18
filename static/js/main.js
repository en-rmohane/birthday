document.addEventListener('DOMContentLoaded', () => {
    console.log("Petal Romance Engine v8 Online...");
    gsap.registerPlugin(ScrollTrigger);

    // 1. Mouse Flare Follower
    const flare = document.getElementById('mouse-flare');
    document.addEventListener('mousemove', (e) => {
        gsap.to(flare, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    // 2. Falling Petals & Hearts Canvas
    const canvas = document.getElementById('hearts-canvas');
    const ctx = canvas.getContext('2d');
    let elements = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Petal {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = -50;
            this.size = Math.random() * 15 + 10;
            this.speed = Math.random() * 2 + 1;
            this.angle = Math.random() * Math.PI * 2;
            this.spin = Math.random() * 0.05 - 0.025;
            this.type = Math.random() > 0.6 ? '❤' : '🌸';
            this.opacity = Math.random() * 0.4 + 0.2;
        }
        update() {
            this.y += this.speed;
            this.x += Math.sin(this.y / 60) * 1.5;
            this.angle += this.spin;
            if (this.y > canvas.height + 50) {
                this.y = -50;
                this.x = Math.random() * canvas.width;
            }
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.fillStyle = this.type === '❤' ? '#8a3033' : '#ffb6c1';
            ctx.font = `${this.size}px serif`;
            ctx.fillText(this.type, 0, 0);
            ctx.restore();
        }
    }

    for (let i = 0; i < 50; i++) elements.push(new Petal());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        elements.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();

    // 3. GSAP ScrollTrigger Reveals
    gsap.utils.toArray('.gsap-reveal').forEach((section) => {
        gsap.to(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: "power3.out"
        });
    });

    // 4. Countdown v7
    const updateCountdown = () => {
        const now = new Date();
        const d = document.getElementById('d');
        if (d) {
            d.innerText = String(now.getDate()).padStart(2, '0');
            document.getElementById('h').innerText = String(now.getHours()).padStart(2, '0');
            document.getElementById('m').innerText = String(now.getMinutes()).padStart(2, '0');
            document.getElementById('s').innerText = String(now.getSeconds()).padStart(2, '0');
        }
    };
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // 5. Typewriter
    const twEl = document.getElementById('v7-typewriter');
    if (twEl) {
        const text = twEl.getAttribute('data-text');
        let idx = 0;
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && twEl.innerHTML === "") {
                const type = () => {
                    if (idx < text.length) {
                        twEl.innerHTML += text.charAt(idx);
                        idx++;
                        setTimeout(type, 50);
                    }
                };
                type();
            }
        }, { threshold: 0.5 });
        observer.observe(twEl);
    }

    // 6. Music Master v7
    const audio = new Audio();
    const playBtn = document.getElementById('v7-play');
    const beginBtn = document.getElementById('begin-journey');
    const songName = document.getElementById('v7-song-name');
    const progressFill = document.getElementById('v7-progress-fill');
    const progressBg = document.getElementById('v7-progress-bg');
    const nextBtn = document.getElementById('v7-next');
    const prevBtn = document.getElementById('v7-prev');

    let isPlaying = false;
    let trackIdx = 0;
    const playlist = window.musicData || [];

    const load = (i) => {
        if (playlist.length > 0) {
            trackIdx = i;
            audio.src = `/static/uploads/${playlist[i].file}`;
            songName.innerText = playlist[i].title.toUpperCase();
            if (isPlaying) audio.play();
        }
    };
    if (playlist.length > 0) load(0);

    const toggle = () => {
        if (playlist.length === 0) return;
        if (isPlaying) {
            audio.pause();
            playBtn.innerText = "▶";
        } else {
            audio.play().then(() => {
                playBtn.innerText = "⏸";
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.8 },
                    colors: ['#8a3033', '#d4a017', '#fce4ec']
                });
            });
        }
        isPlaying = !isPlaying;
    };

    if (playBtn) playBtn.addEventListener('click', toggle);
    if (beginBtn) beginBtn.addEventListener('click', () => {
        toggle();
        window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
    });

    audio.addEventListener('timeupdate', () => {
        const p = (audio.currentTime / audio.duration) * 100;
        if (progressFill) progressFill.style.width = p + "%";
    });

    if (progressBg) {
        progressBg.addEventListener('click', (e) => {
            const w = progressBg.clientWidth;
            const x = e.offsetX;
            audio.currentTime = (x / w) * audio.duration;
        });
    }

    if (nextBtn) nextBtn.addEventListener('click', () => load((trackIdx + 1) % playlist.length));
    if (prevBtn) prevBtn.addEventListener('click', () => load((trackIdx - 1 + playlist.length) % playlist.length));
});
