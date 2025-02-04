// ==========================
    // 1. Loading Screen Effect
    // ==========================
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.style.position = 'fixed';
    loadingOverlay.style.top = 0;
    loadingOverlay.style.left = 0;
    loadingOverlay.style.width = '100%';
    loadingOverlay.style.height = '100%';
    loadingOverlay.style.backgroundColor = 'var(--background-color)';
    loadingOverlay.style.display = 'flex';
    loadingOverlay.style.justifyContent = 'center';
    loadingOverlay.style.alignItems = 'center';
    loadingOverlay.style.zIndex = '2000';
    loadingOverlay.innerHTML = '<div class="loader"></div>';
    document.body.appendChild(loadingOverlay);
    
    const loaderStyle = document.createElement('style');
    loaderStyle.innerHTML = `
      .loader {
        border: 8px solid rgba(255,255,255,0.1);
        border-top: 8px solid var(--accent-color);
        border-radius: 50%;
        width: 60px;
        height: 60px;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(loaderStyle);
    
    window.addEventListener('load', () => {
      gsap.to(loadingOverlay, {
        opacity: 0,
        duration: 1,
        onComplete: () => loadingOverlay.remove()
      });
    });
    
    
    // Pastikan section awal (misalnya, Home) sudah aktif
document.addEventListener('DOMContentLoaded', () => {
  // Animasi pada konten hero di section Home
  gsap.from("#home-section .hero-content", {
    scrollTrigger: {
      trigger: "#home-section",   // Trigger saat section Home muncul
      start: "top center",          // Mulai animasi saat bagian atas section mencapai tengah viewport
      toggleActions: "play none none none"
    },
    opacity: 0,
    y: 50,
    duration: 1,
    ease: "power3.out"
  });

  
  // Animasi untuk tombol Connect Wallet (saat belum terhubung)
  gsap.from("#connect-btn", {
    scrollTrigger: {
      trigger: "#home-section",
      start: "top center",
      toggleActions: "play none none none"
    },
    opacity: 0,
    y: -20,
    duration: 1,
    ease: "power3.out"
  });

  // Animasi untuk wallet profile (saat wallet sudah terhubung)
  // Pastikan elemen ini sudah diubah menjadi tampak (misalnya display: block) setelah wallet terhubung.
  gsap.from("#wallet-profile", {
    scrollTrigger: {
      trigger: "#home-section",
      start: "top center",
      toggleActions: "play none none none"
    },
    opacity: 0,
    y: -20,
    duration: 1,
    ease: "power3.out"
  });
});

// Transisi antar menu dengan GSAP
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();

    // Jika menu yang diklik sudah aktif, tidak melakukan apa-apa
    if (this.classList.contains('active')) return;

    // Perbarui status aktif menu
    document.querySelectorAll('.nav-link').forEach(item => item.classList.remove('active'));
    this.classList.add('active');

    // Tentukan section target dan section yang aktif saat ini
    const targetSelector = this.getAttribute('href');
    const targetSection = document.querySelector(targetSelector);
    const currentSection = document.querySelector('.section.active');

    // Jika terdapat section aktif dan target berbeda
    if (currentSection && targetSection && currentSection !== targetSection) {
      // Buat timeline GSAP untuk animasi transisi
      const tl = gsap.timeline({
        onComplete: () => {
          // Setelah animasi keluar selesai, sembunyikan section lama
          currentSection.style.display = 'none';
          currentSection.classList.remove('active');

          // Tampilkan section target dan tambahkan kelas "active"
          targetSection.style.display = 'block';
          targetSection.classList.add('active');

          // Animasi masuk untuk section target
          gsap.fromTo(targetSection,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" }
          );
        }
      });

      // Animasi keluar pada section yang aktif saat ini
      tl.to(currentSection, { opacity: 0, y: -50, duration: 0.5, ease: "power2.in" });
    }
  });
});

    
    // ==========================
    // 3. Transisi Antar Menu (Section) dengan Animasi & Suara
    // ==========================
    // Fungsi untuk memutar suara transisi (opsional)
function playTransitionSound() {
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.type = 'sine';
  oscillator.frequency.value = 440;
  gainNode.gain.setValueAtTime(0.1, context.currentTime);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.1);
}

// Pastikan section awal (misalnya, Home) sudah aktif
document.addEventListener('DOMContentLoaded', () => {
  const homeSection = document.querySelector('#home-section');
  if (homeSection) {
    homeSection.classList.add('active');
    homeSection.style.display = 'block';
  }

  // Animasi inisiasi (contoh: animasi konten hero)
  gsap.from("#home-section .hero-content", {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: "power3.out"
  });
});

// Event listener untuk navigasi antar section
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();

    // Jika menu yang diklik sudah aktif, tidak melakukan apa-apa
    if (this.classList.contains('active')) return;

    // Mainkan suara transisi (opsional)
    playTransitionSound();

    // Perbarui status aktif menu
    document.querySelectorAll('.nav-link').forEach(item => item.classList.remove('active'));
    this.classList.add('active');

    // Dapatkan section target dan section yang aktif saat ini
    const targetSelector = this.getAttribute('href');
    const targetSection = document.querySelector(targetSelector);
    const currentSection = document.querySelector('.section.active');

    if (currentSection && targetSection && currentSection !== targetSection) {
      // Buat timeline GSAP untuk animasi transisi
      const tl = gsap.timeline({
        onComplete: () => {
          // Sembunyikan section lama dan ubah kelas aktif
          currentSection.style.display = 'none';
          currentSection.classList.remove('active');

          // Tampilkan section target dan tambahkan kelas "active"
          targetSection.style.display = 'block';
          targetSection.classList.add('active');

          // Animasi masuk section target (fade in & slide up)
          gsap.fromTo(targetSection,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" }
          );
        }
      });

      // Animasi keluar section yang aktif saat ini (fade out & slide up)
      tl.to(currentSection, { opacity: 0, y: -50, duration: 0.5, ease: "power2.in" });
    }
  });
});

    
    // ==========================
    // 4. Microinteraction pada Tombol
    // ==========================
    document.querySelectorAll('.action-btn').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, { scale: 1.05, duration: 0.2 });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { scale: 1, duration: 0.2 });
      });
    });
    
    // ==========================
    // 5. Advanced 3D Animation pada Kartu Produk
    // ==========================
    gsap.utils.toArray('.product-card').forEach(card => {
      ScrollTrigger.create({
        trigger: card,
        start: "top 80%",
        onEnter: () => gsap.to(card, { rotationY: 10, duration: 0.5, ease: "power1.out" }),
        onLeaveBack: () => gsap.to(card, { rotationY: 0, duration: 0.5, ease: "power1.in" })
      });
    });
    
    // ==========================
    // 6. Lottie Animation untuk Sentuhan Futuristik
    // ==========================
    const lottieContainer = document.createElement('div');
    lottieContainer.style.position = 'fixed';
    lottieContainer.style.bottom = '20px';
    lottieContainer.style.right = '20px';
    lottieContainer.style.width = '150px';
    lottieContainer.style.height = '150px';
    document.body.appendChild(lottieContainer);
    
    lottie.loadAnimation({
      container: lottieContainer,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'https://assets10.lottiefiles.com/packages/lf20_totrpclr.json'
    });
    
    // ==========================
    // 7. Sound & Audio Feedback pada Scroll
    // ==========================
    function playScrollSound() {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      oscillator.type = 'square';
      oscillator.frequency.value = 330;
      gainNode.gain.setValueAtTime(0.05, context.currentTime);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.1);
    }
    
    ScrollTrigger.create({
      trigger: '.testimonials',
      start: 'top 80%',
      onEnter: playScrollSound
    });
    
    // ==========================
    // 8. Partikel Interaktif (Background Animation)
    // ==========================
    const particleCanvas = document.createElement('canvas');
    particleCanvas.id = 'particle-canvas';
    particleCanvas.style.position = 'fixed';
    particleCanvas.style.top = 0;
    particleCanvas.style.left = 0;
    particleCanvas.style.width = '100%';
    particleCanvas.style.height = '100%';
    particleCanvas.style.pointerEvents = 'none';
    particleCanvas.style.zIndex = '-1';
    document.body.appendChild(particleCanvas);
    
    const canvas = particleCanvas;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let particles = [];
    const particleCount = 50;
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.opacity = Math.random() * 0.5 + 0.5;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      draw() {
        ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
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
    initParticles();
    
    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
    
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    });
    
    // ==========================
    // 9. Animasi Parallax, Staggered, dan Morphing SVG
    // ==========================
    gsap.to(".hero-overlay", {
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      },
      opacity: 0.8,
      ease: "none"
    });
    
    gsap.from(".feature-item", {
      scrollTrigger: {
        trigger: ".features",
        start: "top 80%"
      },
      opacity: 0,
      y: 30,
      stagger: 0.3,
      duration: 0.8,
      ease: "power3.out"
    });
    
    gsap.from(".hero-content h1", {
      duration: 1,
      opacity: 0,
      scale: 0.5,
      rotation: 10,
      ease: "elastic.out(1, 0.3)",
      delay: 0.5
    });
    
    gsap.from(".main-nav li", {
      duration: 1,
      opacity: 0,
      y: -20,
      stagger: 0.2,
      ease: "back.out(1.7)"
    });
    
    const morphSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    morphSvg.setAttribute("viewBox", "0 0 100 100");
    morphSvg.style.position = "fixed";
    morphSvg.style.bottom = "50%";
    morphSvg.style.left = "50%";
    morphSvg.style.width = "200px";
    morphSvg.style.height = "200px";
    morphSvg.style.transform = "translate(-50%, 50%)";
    morphSvg.style.zIndex = "-1";
    morphSvg.innerHTML = '<path fill="var(--accent-color)" d="M50,0 C77,0 100,23 100,50 C100,77 77,100 50,100 C23,100 0,77 0,50 C0,23 23,0 50,0 Z" />';
    document.body.appendChild(morphSvg);
    
    gsap.to(morphSvg.querySelector("path"), {
      duration: 3,
      attr: { d: "M50,0 C85,15 100,50 85,85 C70,100 30,100 15,85 C0,50 15,15 50,0 Z" },
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });

    