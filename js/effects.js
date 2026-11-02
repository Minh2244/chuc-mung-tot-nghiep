/* =========================================================
   EFFECTS.JS — Hoa rơi, Pháo hoa tự động liên tục & Hộp nhạc
   ========================================================= */

window.GradEffects = (function () {
  /* ============================================
     1. HẠT LẤP LÁNH & CÁNH HOA NỀN
     ============================================ */
  function initBackgroundParticles() {
    const bg = document.querySelector('.bg-particles');
    if (!bg) return;
    bg.innerHTML = '';

    const petals = ['🌸', '🌺', '🌷', '🌼', '💮', '✨', '🎓'];
    const petalCount = window.innerWidth < 700 ? 14 : 22;

    for (let k = 0; k < petalCount; k++) {
      const p = document.createElement('span');
      p.className = 'petal';
      p.textContent = petals[Math.floor(Math.random() * petals.length)];
      p.style.left = Math.random() * 100 + '%';
      p.style.fontSize = (14 + Math.random() * 15) + 'px';
      p.style.setProperty('--sway', (Math.random() * 160 - 80) + 'px');
      p.style.animationDuration = (9 + Math.random() * 9) + 's';
      p.style.animationDelay = (Math.random() * 8) + 's';
      bg.appendChild(p);
    }

    const sparkleCount = window.innerWidth < 700 ? 12 : 24;
    for (let s = 0; s < sparkleCount; s++) {
      const sp = document.createElement('span');
      sp.className = 'sparkle';
      sp.style.left = Math.random() * 100 + '%';
      sp.style.top = Math.random() * 100 + '%';
      sp.style.animationDuration = (2.2 + Math.random() * 3) + 's';
      sp.style.animationDelay = (Math.random() * 3) + 's';
      bg.appendChild(sp);
    }
  }

  /* ============================================
     2. PHÁO HOA TỰ ĐỘNG LIÊN TỤC (CONFETTI LOOP)
     ============================================ */
  const palette = ['#9e2a4c', '#d86c8e', '#d4af37', '#f5df98', '#ffc8dd', '#ff9ebb', '#cdb4db'];
  let fireworksInterval = null;

  function fireEnvelopeConfetti() {
    if (typeof confetti !== 'function') return;
    confetti({
      particleCount: 90,
      spread: 78,
      origin: { y: 0.58 },
      colors: palette,
      scalar: 1.05
    });
  }

  function fireGrandConfetti() {
    if (typeof confetti !== 'function') return;

    confetti({
      particleCount: 95,
      spread: 90,
      origin: { y: 0.58 },
      colors: palette,
      scalar: 1.12
    });

    setTimeout(() => {
      confetti({
        particleCount: 55,
        angle: 60,
        spread: 55,
        origin: { x: 0.02, y: 0.72 },
        colors: palette
      });
      confetti({
        particleCount: 55,
        angle: 120,
        spread: 55,
        origin: { x: 0.98, y: 0.72 },
        colors: palette
      });
    }, 260);
  }

  function fireRandomBurst() {
    if (typeof confetti !== 'function' || document.hidden) return;
    const mode = Math.random();
    if (mode < 0.45) {
      // Pháo bắn hai bên sườn
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 + Math.random() * 0.2 },
        colors: palette
      });
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 + Math.random() * 0.2 },
        colors: palette
      });
    } else if (mode < 0.8) {
      // Pháo hoa bung trên bầu trời
      confetti({
        particleCount: 55,
        spread: 360,
        startVelocity: 26,
        ticks: 70,
        origin: {
          x: 0.18 + Math.random() * 0.64,
          y: 0.18 + Math.random() * 0.32
        },
        colors: palette,
        scalar: 1.05
      });
    } else {
      // Mưa kim tuyến vàng lấp lánh
      confetti({
        particleCount: 45,
        spread: 110,
        startVelocity: 20,
        origin: { x: 0.5, y: 0.12 },
        colors: ['#d4af37', '#f5df98', '#fff5cc', '#d86c8e'],
        gravity: 0.7
      });
    }
  }

  function startContinuousFireworks() {
    if (fireworksInterval) return;
    fireGrandConfetti();
    fireworksInterval = setInterval(fireRandomBurst, 2700);
  }

  function stopContinuousFireworks() {
    if (fireworksInterval) {
      clearInterval(fireworksInterval);
      fireworksInterval = null;
    }
  }

  /* ============================================
     3. ÂM THANH MUSIC BOX NHẸ NHÀNG (MẶC ĐỊNH LUÔN BẬT)
     ============================================ */
  let audioCtx = null;
  let isMusicPlaying = true;
  let userMuted = false;
  let melodyTimer = null;
  let noteIndex = 0;

  const MELODY_NOTES = [
    { f: 659.25, d: 0.45 },
    { f: 587.33, d: 0.45 },
    { f: 523.25, d: 0.45 },
    { f: 493.88, d: 0.45 },
    { f: 440.00, d: 0.45 },
    { f: 392.00, d: 0.45 },
    { f: 440.00, d: 0.45 },
    { f: 493.88, d: 0.55 },
    { f: 523.25, d: 0.45 },
    { f: 587.33, d: 0.45 },
    { f: 659.25, d: 0.45 },
    { f: 783.99, d: 0.45 },
    { f: 698.46, d: 0.45 },
    { f: 659.25, d: 0.45 },
    { f: 587.33, d: 0.55 },
    { f: 523.25, d: 0.75 }
  ];

  function ensureAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  }

  function playBellNote(freq, duration, volume = 0.08) {
    if (!audioCtx || audioCtx.state !== 'running') return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 2.2);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + duration * 2.3);
  }

  function playChimeChord() {
    if (userMuted) return;
    ensureAudioContext();
    if (!audioCtx) return;
    const chord = [523.25, 659.25, 783.99, 1046.5];
    chord.forEach((f, idx) => {
      setTimeout(() => playBellNote(f, 0.7, 0.065), idx * 90);
    });
  }

  function stepMelody() {
    if (!isMusicPlaying) return;
    ensureAudioContext();
    if (audioCtx && audioCtx.state === 'running') {
      const note = MELODY_NOTES[noteIndex % MELODY_NOTES.length];
      playBellNote(note.f, note.d, 0.055);
      noteIndex++;
      melodyTimer = setTimeout(stepMelody, note.d * 1000);
    } else {
      melodyTimer = setTimeout(stepMelody, 350);
    }
  }

  function startMusic() {
    userMuted = false;
    ensureAudioContext();
    isMusicPlaying = true;
    updateMusicButtonUI();
    clearTimeout(melodyTimer);
    stepMelody();
  }

  function stopMusic() {
    isMusicPlaying = false;
    clearTimeout(melodyTimer);
    updateMusicButtonUI();
  }

  function resumeMusicIfAllowed() {
    if (!userMuted && !isMusicPlaying) {
      startMusic();
    }
  }

  function toggleMusic() {
    if (isMusicPlaying) {
      userMuted = true;
      stopMusic();
    } else {
      userMuted = false;
      startMusic();
    }
  }

  function updateMusicButtonUI() {
    const btn = document.getElementById('musicToggleBtn');
    if (!btn) return;
    if (isMusicPlaying) {
      btn.classList.add('playing');
      btn.title = 'Tắt nhạc nền';
      btn.textContent = '🎵';
    } else {
      btn.classList.remove('playing');
      btn.title = 'Bật nhạc nền';
      btn.textContent = '🔇';
    }
  }

  // Khởi động nhạc mặc định ngay khi vào trang & mở khóa AudioContext ngay ở thao tác đầu tiên
  function initDefaultMusic() {
    startMusic();
    const unlockAudio = () => {
      ensureAudioContext();
      if (audioCtx && audioCtx.state === 'running') {
        window.removeEventListener('pointerdown', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
      }
    };
    window.addEventListener('pointerdown', unlockAudio, { passive: true });
    window.addEventListener('touchstart', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio, { passive: true });
  }

  return {
    initBackgroundParticles,
    initDefaultMusic,
    fireEnvelopeConfetti,
    fireGrandConfetti,
    startContinuousFireworks,
    stopContinuousFireworks,
    playChimeChord,
    startMusic,
    stopMusic,
    resumeMusicIfAllowed,
    toggleMusic
  };
})();
