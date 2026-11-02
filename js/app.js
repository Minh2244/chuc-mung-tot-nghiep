/* =========================================================
   APP.JS — Điều khiển Luồng 4 Cảnh, Auto-Fit Mọi Màn Hình & Lightbox
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const cfg = window.GRADUATION_CONFIG;

  // DOM Elements
  const envelopeSceneWrapper = document.getElementById('envelopeSceneWrapper');
  const envelope = document.getElementById('envelope');
  const envelopeHint = document.getElementById('envelopeHint');
  const greetingTextEl = document.getElementById('greetingText');
  const letterFooter = document.getElementById('letterFooter');
  const continueBtn = document.getElementById('continueBtn');
  const goToVideoBtn = document.getElementById('goToVideoBtn');
  const backToBouquetBtn = document.getElementById('backToBouquetBtn');
  const replayBtn = document.getElementById('replayBtn');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const bouquetPhotosContainer = document.getElementById('bouquetPhotos');
  const senderChibiImg = document.getElementById('senderChibiImg');

  // Video Elements
  const gradVideo = document.getElementById('gradVideo');
  const videoTitle = document.getElementById('videoTitle');
  const videoSubtitle = document.getElementById('videoSubtitle');
  const videoCaption = document.getElementById('videoCaption');

  // Lightbox Modal Elements
  const photoModal = document.getElementById('photoModal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalCounter = document.getElementById('modalCounter');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalPrevBtn = document.getElementById('modalPrevBtn');
  const modalNextBtn = document.getElementById('modalNextBtn');

  // State
  let envelopeOpened = false;
  let cardReadyForNext = false;
  let typingTimer = null;
  let currentPhotoIndex = 0;

  /* ============================================
     1. AUTO-FIT VIEWPORT SCALER
     Tự động co giãn hoàn hảo trên mọi độ thu phóng Laptop & Điện thoại
     ============================================ */
  function fitAllScenesToViewport() {
    const isMobile = window.innerWidth <= 720;
    const padX = isMobile ? 12 : 64;
    const padY = isMobile ? 24 : 76;
    const availW = window.innerWidth - padX;
    const availH = window.innerHeight - padY;

    document.querySelectorAll('.scene-scale-box').forEach(box => {
      const useNaturalDomSize = box.dataset.responsive === 'true';
      const naturalW = useNaturalDomSize
        ? Math.max(box.offsetWidth, box.scrollWidth, 320)
        : Math.max(Number(box.dataset.w) || 0, box.offsetWidth, box.scrollWidth, 500);
      const naturalH = useNaturalDomSize
        ? Math.max(box.offsetHeight, box.scrollHeight, 420)
        : Math.max(Number(box.dataset.h) || 0, box.offsetHeight, box.scrollHeight, 520);

      const scaleX = availW / naturalW;
      const scaleY = availH / naturalH;
      // Trên laptop giữ tỷ lệ tối đa 0.94 để luôn có khoảng thở thoáng trên/dưới ở mức zoom 100%
      const maxScale = isMobile ? 1.0 : 0.94;
      const scale = Math.min(maxScale, scaleX, scaleY);
      box.style.setProperty('--scene-scale', scale.toFixed(4));
    });
  }

  window.addEventListener('resize', fitAllScenesToViewport);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', fitAllScenesToViewport);
  }

  /* ============================================
     2. ĐỔ DỮ LIỆU TỪ CONFIG VÀO GIAO DIỆN
     ============================================ */
  function hydrateContent() {
    document.querySelectorAll('.js-class-year').forEach(el => {
      el.textContent = cfg.classYear;
    });
    document.querySelectorAll('.js-recipient-name').forEach(el => {
      el.textContent = cfg.recipientName;
    });
    document.querySelectorAll('.js-date-text').forEach(el => {
      el.textContent = cfg.dateText;
    });
    document.querySelectorAll('.js-venue-text').forEach(el => {
      el.textContent = cfg.venueText || '';
    });

    if (senderChibiImg && cfg.senderChibiAvatar) {
      senderChibiImg.src = encodeURI(cfg.senderChibiAvatar);
    }

    // Scene 3: Tạo 3 tấm ảnh Polaroid trên bó hoa
    bouquetPhotosContainer.innerHTML = '';
    cfg.photos.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'photo-card';
      card.style.setProperty('--x', item.x);
      card.style.setProperty('--y', item.y);
      card.style.setProperty('--r', item.rotate);
      card.style.setProperty('--delay', item.delay || (index * 0.25) + 's');
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', item.caption);

      const objPos = item.objectPosition || 'center center';

      card.innerHTML = `
        <span class="photo-pin"></span>
        <div class="photo-frame">
          <img src="${encodeURI(item.src)}" alt="${item.caption}" style="object-position: ${objPos};" />
        </div>
        <div class="photo-caption">${item.caption}</div>
      `;

      card.addEventListener('click', () => openPhotoModal(index));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openPhotoModal(index);
        }
      });

      bouquetPhotosContainer.appendChild(card);
    });

    // Scene 4: Cấu hình Video kỷ niệm
    if (cfg.video && gradVideo) {
      gradVideo.src = encodeURI(cfg.video.src);
      if (videoTitle && cfg.video.title) videoTitle.textContent = cfg.video.title;
      if (videoSubtitle && cfg.video.subtitle) videoSubtitle.textContent = cfg.video.subtitle;
      if (videoCaption && cfg.video.caption) videoCaption.textContent = cfg.video.caption;
    }
  }

  /* ============================================
     3. CHUYỂN CẢNH (SCENE SWITCHER)
     ============================================ */
  function pauseVideoIfPlaying() {
    if (gradVideo && !gradVideo.paused) {
      gradVideo.pause();
    }
  }

  function showScene(sceneNumber) {
    if (sceneNumber !== 4) {
      pauseVideoIfPlaying();
    }

    const targetId = `scene${sceneNumber}`;
    document.querySelectorAll('.scene').forEach(s => {
      s.classList.toggle('active', s.id === targetId);
    });

    fitAllScenesToViewport();
  }

  /* ============================================
     4. HIỆU ỨNG GÕ CHỮ (TYPEWRITER) Ở SCENE 2
     ============================================ */
  function startTypewriter() {
    clearTimeout(typingTimer);
    greetingTextEl.innerHTML = '';
    letterFooter.classList.remove('visible');
    continueBtn.classList.remove('btn-show');
    continueBtn.classList.add('btn-hidden');

    const fullText = cfg.greetingText;
    let i = 0;
    const cursorHTML = '<span class="cursor"></span>';

    function typeNextChar() {
      if (i < fullText.length) {
        greetingTextEl.innerHTML = fullText.slice(0, i + 1) + cursorHTML;
        i++;
        const ch = fullText[i - 1];
        const delay = /[.,!?…\n]/.test(ch) ? 115 : 22;
        typingTimer = setTimeout(typeNextChar, delay);
      } else {
        greetingTextEl.innerHTML = cfg.greetingText + cursorHTML;
        letterFooter.classList.add('visible');
        fitAllScenesToViewport();
        setTimeout(() => {
          continueBtn.classList.remove('btn-hidden');
          continueBtn.classList.add('btn-show');
        }, 250);
      }
    }

    typeNextChar();
  }

  /* ============================================
     5. MỞ PHONG THƯ (BẤM LẦN 1: MỞ THIỆP, BẤM LẦN 2: QUA LỜI CHÚC)
     ============================================ */
  function triggerOpenEnvelope() {
    if (!envelopeOpened) {
      // Lần bấm 1: Mở nắp phong thư & trượt tấm thiệp bên trong lên
      envelopeOpened = true;
      cardReadyForNext = false;
      envelope.classList.add('open');
      if (envelopeSceneWrapper) envelopeSceneWrapper.classList.add('is-open');

      window.GradEffects.playChimeChord();
      window.GradEffects.startMusic();
      window.GradEffects.fireEnvelopeConfetti();

      setTimeout(() => {
        cardReadyForNext = true;
        envelopeHint.classList.add('ready-next');
        envelopeHint.innerHTML = '<span>📜 Bấm tiếp vào thiệp để đọc lời chúc nha →</span>';
      }, 650);
    } else if (cardReadyForNext) {
      // Lần bấm 2: Chuyển sang Scene 2 (Bức thư lời chúc)
      window.GradEffects.playChimeChord();
      showScene(2);
      startTypewriter();
    }
  }

  envelope.addEventListener('click', triggerOpenEnvelope);
  envelopeHint.addEventListener('click', triggerOpenEnvelope);

  /* ============================================
     6. HIỂN THỊ BÓ HOA 3 ẢNH & PHÁO HOA TỰ ĐỘNG (SCENE 2 → SCENE 3)
     ============================================ */
  function goToBouquetScene() {
    clearTimeout(typingTimer);
    showScene(3);
    window.GradEffects.playChimeChord();
    window.GradEffects.startContinuousFireworks();
  }

  continueBtn.addEventListener('click', goToBouquetScene);

  /* ============================================
     7. CHIẾU VIDEO KỶ NIỆM (SCENE 3 → SCENE 4)
     ============================================ */
  function goToVideoScene() {
    clearTimeout(typingTimer);
    closePhotoModal();

    // Tạm dừng nhạc nền hộp nhạc để nghe rõ tiếng của video
    window.GradEffects.stopMusic();

    showScene(4);
    window.GradEffects.startContinuousFireworks();

    if (gradVideo) {
      gradVideo.currentTime = 0;
      gradVideo.play().catch(() => {});
    }
  }

  goToVideoBtn.addEventListener('click', goToVideoScene);

  backToBouquetBtn.addEventListener('click', () => {
    pauseVideoIfPlaying();
    window.GradEffects.resumeMusicIfAllowed();
    showScene(3);
  });

  if (gradVideo) {
    gradVideo.addEventListener('ended', () => {
      window.GradEffects.playChimeChord();
      window.GradEffects.fireGrandConfetti();
    });
  }

  /* ============================================
     8. XEM LẠI TỪ ĐẦU (RESET VỀ SCENE 1)
     ============================================ */
  function resetToScene1() {
    clearTimeout(typingTimer);
    envelopeOpened = false;
    cardReadyForNext = false;
    envelope.classList.remove('open');
    if (envelopeSceneWrapper) envelopeSceneWrapper.classList.remove('is-open');
    envelopeHint.classList.remove('ready-next');
    envelopeHint.innerHTML = '<span>✨ Chạm vào con dấu sáp để mở thư nha 💌</span>';
    pauseVideoIfPlaying();
    window.GradEffects.stopContinuousFireworks();
    window.GradEffects.resumeMusicIfAllowed();

    greetingTextEl.innerHTML = '';
    letterFooter.classList.remove('visible');
    continueBtn.classList.remove('btn-show');
    continueBtn.classList.add('btn-hidden');

    showScene(1);
  }

  replayBtn.addEventListener('click', resetToScene1);

  /* ============================================
     9. MODAL LIGHTBOX XEM 3 ẢNH TRÊN BÓ HOA
     ============================================ */
  function updateModalView() {
    const item = cfg.photos[currentPhotoIndex];
    if (!item) return;
    modalImg.src = encodeURI(item.src);
    modalImg.alt = item.caption;
    modalImg.style.objectPosition = item.objectPosition || 'center 65%';
    modalTitle.textContent = item.caption;
    modalDesc.textContent = item.description || '';
    modalCounter.textContent = `${currentPhotoIndex + 1} / ${cfg.photos.length}`;
  }

  function openPhotoModal(index) {
    currentPhotoIndex = index;
    updateModalView();
    photoModal.classList.add('open');
    window.GradEffects.playChimeChord();
  }

  function closePhotoModal() {
    photoModal.classList.remove('open');
  }

  function showPrevPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + cfg.photos.length) % cfg.photos.length;
    updateModalView();
  }

  function showNextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % cfg.photos.length;
    updateModalView();
  }

  modalCloseBtn.addEventListener('click', closePhotoModal);
  modalPrevBtn.addEventListener('click', showPrevPhoto);
  modalNextBtn.addEventListener('click', showNextPhoto);

  photoModal.addEventListener('click', (e) => {
    if (e.target === photoModal) {
      closePhotoModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!photoModal.classList.contains('open')) return;
    if (e.key === 'Escape') closePhotoModal();
    if (e.key === 'ArrowLeft') showPrevPhoto();
    if (e.key === 'ArrowRight') showNextPhoto();
  });

  /* ============================================
     10. NÚT BẬT / TẮT NHẠC NỀN
     ============================================ */
  musicToggleBtn.addEventListener('click', () => {
    window.GradEffects.toggleMusic();
  });

  /* ============================================
     KHỞI ĐỘNG ỨNG DỤNG
     ============================================ */
  hydrateContent();
  window.GradEffects.initBackgroundParticles();
  window.GradEffects.initDefaultMusic();
  fitAllScenesToViewport();
});
