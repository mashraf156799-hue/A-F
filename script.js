const weddingConfig = {
    groomAr: "عبد الغني",
    groomEn: "Abdelghany",
    brideAr: "فرح",
    brideEn: "Farah",
    dateAr: "25 سبتمبر 2026",
    dateEn: "25 September 2026",
    dayAr: "الجمعة",
    dayEn: "Friday",
    numericDate: "2026-09-25T00:00:00", 
    venueAr: "وادي القمر – قاعة تمر حنة",
    venueEn: "Wadi El Qamar – Tamr Henna",
    mapsUrl: "https://maps.app.goo.gl/BT6Z2wF7fFvdNmbr9?g_st=ac",
    music: "assets/music/wedding.mp3", 
    photos: [ // روابط الصور التي سيتم تحميلها من لوحة الإدارة
        "assets/images/gallery-1.jpg",
        "assets/images/gallery-2.jpg",
        "assets/images/gallery-3.jpg",
        "assets/images/gallery-4.jpg",
        "assets/images/gallery-5.jpg",
        "assets/images/gallery-6.jpg"
    ]
};

// State
let audioContextStarted = false;

document.addEventListener('DOMContentLoaded', () => {
    // 0. Initialize Gate
    initGate();
    
    // 0.1 Initialize Language & Admin
    initLang();
    initAdmin();

    // 1. Apply Configuration to DOM
    applyConfiguration();

    // 2. Remove Loading State
    document.body.classList.remove('loading');

    // 3. Initialize Animations
    initIntersectionObservers();
    initScrollAnimations();
    
    // 4. Initialize Countdown
    initCountdown();

    // 5. Initialize Music
    initMusic();

    // 6. Initialize Lightbox
    initLightbox();
});

function initLang() {
    const btn = document.getElementById('btnLang');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const currentLang = document.body.getAttribute('data-lang');
        if (currentLang === 'ar') {
            document.body.setAttribute('data-lang', 'en');
            btn.textContent = 'AR';
        } else {
            document.body.setAttribute('data-lang', 'ar');
            btn.textContent = 'EN';
        }
    });
}

function initAdmin() {
    const btnAdmin = document.getElementById('btnAdmin');
    const modal = document.getElementById('adminModal');
    const btnLogin = document.getElementById('btnLogin');
    const btnCloseAdmin = document.getElementById('btnCloseAdmin');
    const btnAdminClose = document.getElementById('btnAdminClose');
    const adminLogin = document.getElementById('adminLogin');
    const adminDashboard = document.getElementById('adminDashboard');
    const adminUploaders = document.getElementById('adminUploaders');
    const passInput = document.getElementById('adminPass');

    if (!btnAdmin) return;

    btnAdmin.addEventListener('click', () => {
        modal.classList.add('show');
    });

    const closeModal = () => {
        modal.classList.remove('show');
        passInput.value = '';
    };

    btnCloseAdmin.addEventListener('click', closeModal);
    btnAdminClose.addEventListener('click', closeModal);

    btnLogin.addEventListener('click', () => {
        if (passInput.value === '156799') {
            adminLogin.style.display = 'none';
            adminDashboard.style.display = 'block';
            buildUploaders();
        } else {
            alert('Incorrect password');
        }
    });

    function buildUploaders() {
        if (adminUploaders.children.length > 0) return;
        
        const uploadSlots = [
            { id: 'cover', filename: 'cover.jpg', label: 'الصورة الرئيسية (البداية)', size: '1920x1080 بكسل' },
            { id: 'groom', filename: 'story-groom.jpg', label: 'صورة العريس (مشهد الحكاية)', size: '1080x1920 بكسل (طولية)' },
            { id: 'bride', filename: 'story-bride.jpg', label: 'صورة العروسة (مشهد الحكاية)', size: '1080x1920 بكسل (طولية)' },
            { id: 'venue', filename: 'venue.jpg', label: 'صورة القاعة', size: '1920x1080 بكسل (عرضية)' },
            { id: 'gal1', filename: 'gallery-1.jpg', label: 'معرض الصور 1', size: '1080x1620 بكسل (طولية)' },
            { id: 'gal2', filename: 'gallery-2.jpg', label: 'معرض الصور 2', size: '1080x1620 بكسل (طولية)' },
            { id: 'gal3', filename: 'gallery-3.jpg', label: 'معرض الصور 3', size: '1080x1620 بكسل (طولية)' },
            { id: 'gal4', filename: 'gallery-4.jpg', label: 'معرض الصور 4', size: '1080x1620 بكسل (طولية)' },
            { id: 'gal5', filename: 'gallery-5.jpg', label: 'معرض الصور 5', size: '1080x1620 بكسل (طولية)' },
            { id: 'gal6', filename: 'gallery-6.jpg', label: 'معرض الصور 6', size: '1080x1620 بكسل (طولية)' },
            { id: 'music', filename: 'wedding.mp3', label: 'موسيقى الموقع', size: 'ملف MP3', accept: 'audio/mpeg, audio/mp3' }
        ];

        uploadSlots.forEach((slot) => {
            const acceptType = slot.accept || 'image/*';
            const div = document.createElement('div');
            div.className = 'upload-row';
            div.innerHTML = `
                <span style="font-weight:bold; color:var(--color-gold); font-family:var(--font-ar-sans);" dir="rtl">${slot.label}</span>
                <span style="font-size:0.75rem; color:#aaa; margin-bottom:10px;">المقاس الموصى به: ${slot.size}</span>
                <input type="file" accept="${acceptType}" id="file-${slot.id}">
                <button id="btn-upload-${slot.id}" style="margin-top:5px; font-size:0.8rem; padding:5px;">رفع</button>
            `;
            adminUploaders.appendChild(div);

            document.getElementById(`btn-upload-${slot.id}`).addEventListener('click', () => {
                const fileInput = document.getElementById(`file-${slot.id}`);
                if (!fileInput.files.length) return alert('برجاء اختيار صورة أولاً');
                
                const file = fileInput.files[0];
                const reader = new FileReader();
                reader.onload = function(e) {
                    const data = e.target.result;
                    fetch('/admin/upload', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ filename: slot.filename, data })
                    }).then(res => res.json()).then(res => {
                        if (res.success) alert('تم الرفع بنجاح! قم بتحديث الصفحة لترى التغيير.');
                        else alert('خطأ: ' + res.error);
                    }).catch(err => alert('فشل الرفع. تأكد أن السيرفر يعمل.'));
                };
                reader.readAsDataURL(file);
            });
        });
    }
}

function initGate() {
    const gate = document.getElementById('invitationGate');
    const btnOpen = document.getElementById('btnOpenGate');
    
    if (btnOpen && gate) {
        btnOpen.addEventListener('click', () => {
            gate.classList.add('opened');
              // Trigger smooth fade-in of background image after doors open
              const openingSection = document.getElementById('opening');
              if (openingSection) {
                  setTimeout(() => {
                      openingSection.classList.add('opening-visible');
                  }, 800);
              }
            document.body.classList.remove('locked');
            
            // Start audio on click
            if (!audioContextStarted) {
                audioContextStarted = true;
                playAudio();
            }
            
            // Remove gate from DOM after fade-out animation completes
            setTimeout(() => {
                gate.style.display = 'none';
            }, 2500);
        });
    }
}

function applyConfiguration() {
    // DOM Elements
    const els = {
        domGroomName: document.getElementById('domGroomName'),
        domBrideName: document.getElementById('domBrideName'),
        domSplitGroom: document.getElementById('domSplitGroom'),
        domSplitBride: document.getElementById('domSplitBride'),
        domDateDay: document.getElementById('domDateDay'),
        domDateAr: document.getElementById('domDateAr'),
        domInfoDay: document.getElementById('domInfoDay'),
        domInfoDate: document.getElementById('domInfoDate'),
        domInfoVenue1: document.getElementById('domInfoVenue1'),
        domInfoVenue2: document.getElementById('domInfoVenue2'),
        domVenueName1: document.getElementById('domVenueName1'),
        domVenueName2: document.getElementById('domVenueName2'),
        domVenueLink: document.getElementById('domVenueLink'),
        domFinalCouple: document.getElementById('domFinalCouple'),
        domFinalDate: document.getElementById('domFinalDate'),
        domFinalVenue: document.getElementById('domFinalVenue'),
        bgMusic: document.getElementById('bgMusic'),
        domPhotoContainer: document.getElementById('domPhotoContainer')
    };

    const venueArParts = weddingConfig.venueAr.split('–');
    const venueAr1 = venueArParts[0] ? venueArParts[0].trim() : weddingConfig.venueAr;
    const venueAr2 = venueArParts[1] ? venueArParts[1].trim() : '';
    const venueEnParts = weddingConfig.venueEn.split('–');
    const venueEn1 = venueEnParts[0] ? venueEnParts[0].trim() : weddingConfig.venueEn;
    const venueEn2 = venueEnParts[1] ? venueEnParts[1].trim() : '';

    const createBilingual = (ar, en) => `<span class="lang-ar">${ar}</span><span class="lang-en">${en}</span>`;

    if (els.domGroomName) els.domGroomName.innerHTML = createBilingual(weddingConfig.groomAr, weddingConfig.groomEn);
    if (els.domBrideName) els.domBrideName.innerHTML = createBilingual(weddingConfig.brideAr, weddingConfig.brideEn);
    if (els.domSplitGroom) els.domSplitGroom.innerHTML = createBilingual(weddingConfig.groomAr, weddingConfig.groomEn);
    if (els.domSplitBride) els.domSplitBride.innerHTML = createBilingual(weddingConfig.brideAr, weddingConfig.brideEn);
    
    if (els.domDateDay) els.domDateDay.innerHTML = createBilingual(weddingConfig.dayAr, weddingConfig.dayEn);
    if (els.domDateAr) els.domDateAr.innerHTML = createBilingual(weddingConfig.dateAr.replace(' 2026', ''), weddingConfig.dateEn.replace(' 2026', ''));
    
    if (els.domInfoDay) els.domInfoDay.innerHTML = createBilingual(weddingConfig.dayAr, weddingConfig.dayEn);
    if (els.domInfoDate) els.domInfoDate.innerHTML = createBilingual(weddingConfig.dateAr.replace(' 2026', ''), weddingConfig.dateEn.replace(' 2026', ''));
    
    if (els.domInfoVenue1) els.domInfoVenue1.innerHTML = createBilingual(venueAr1, venueEn1);
    if (els.domInfoVenue2) els.domInfoVenue2.innerHTML = createBilingual(venueAr2, venueEn2);
    
    if (els.domVenueName1) els.domVenueName1.innerHTML = createBilingual(venueAr1, venueEn1);
    if (els.domVenueName2) els.domVenueName2.innerHTML = createBilingual(venueAr2, venueEn2);
    if (els.domVenueLink) els.domVenueLink.href = weddingConfig.mapsUrl;

    if (els.domFinalCouple) els.domFinalCouple.innerHTML = createBilingual(`${weddingConfig.groomAr} × ${weddingConfig.brideAr}`, `${weddingConfig.groomEn} × ${weddingConfig.brideEn}`);
    if (els.domFinalDate) els.domFinalDate.innerHTML = createBilingual(`${weddingConfig.dayAr} ${weddingConfig.dateAr.replace(' 2026', '')}`, `${weddingConfig.dayEn} ${weddingConfig.dateEn.replace(' 2026', '')}`);
    if (els.domFinalVenue) els.domFinalVenue.innerHTML = createBilingual(weddingConfig.venueAr, weddingConfig.venueEn);

    if (els.bgMusic) els.bgMusic.src = weddingConfig.music;

    // Inject Photos
    if (els.domPhotoContainer && weddingConfig.photos) {
        els.domPhotoContainer.innerHTML = '';
        const animations = ['photo-slide-left', 'photo-slide-right', 'photo-slide-left', 'photo-slide-right', 'photo-slide-left', 'photo-slide-right'];
        const spanClasses = ['photo-wide', '', '', '', '', 'photo-wide']; // 1st and last span full width
        
        weddingConfig.photos.forEach((photoUrl, index) => {
            const div = document.createElement('div');
            div.className = `photo-item ${animations[index % animations.length]} ${spanClasses[index] || ''}`.trim();
            div.style.setProperty('--delay', `${index * 0.1}s`);
            div.innerHTML = `<img src="${photoUrl}" alt="Gallery" loading="lazy">`;
            els.domPhotoContainer.appendChild(div);
        });
    }
}

function initIntersectionObservers() {
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                // Remove class to replay animation when scrolling back
                entry.target.classList.remove('is-visible');
            }
        });
    }, options);

    const revealElements = document.querySelectorAll('.fade-in-up, .reveal-text, .reveal-up, .reveal-width, .scene-01 img, .story-step, .photo-item');
    revealElements.forEach(el => observer.observe(el));
}

function initScrollAnimations() {
    // Scroll references
    const scene02 = document.getElementById('scene02');
    const splitLeft = scene02 ? scene02.querySelector('.split-side.left') : null;
    const splitRight = scene02 ? scene02.querySelector('.split-side.right') : null;
    const meetingPoint = scene02 ? scene02.querySelector('.meeting-point') : null;

    let ticking = false;

    function onScroll() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;

        // Start audio on first scroll if not started
        if (!audioContextStarted && scrollY > 50) {
            audioContextStarted = true;
            playAudio();
        }

        // SCENE 02: Split Screen Meeting
        if (scene02 && splitLeft && splitRight) {
            const rect = scene02.getBoundingClientRect();
            if (rect.top < windowHeight && rect.bottom > 0) {
                let progress = (-rect.top + (windowHeight * 0.3)) / (rect.height - windowHeight);
                progress = Math.max(0, Math.min(1, progress));
                
                // Speed up the closing by multiplying progress
                let closeProgress = Math.min(1, Math.max(0, progress * 2));
                
                const isMobile = windowWidth <= 768;
                if (isMobile) {
                    const transY = 50 - (closeProgress * 50);
                    splitLeft.style.transform = `translateY(-${transY}%)`;
                    splitRight.style.transform = `translateY(${transY}%)`;
                } else {
                    const transX = 50 - (closeProgress * 50);
                    splitLeft.style.transform = `translateX(-${transX}%)`;
                    splitRight.style.transform = `translateX(${transX}%)`;
                }

                if (closeProgress >= 1 && meetingPoint) {
                    meetingPoint.classList.add('show');
                } else if (meetingPoint) {
                    meetingPoint.classList.remove('show');
                }
            }
        }

        // SCENE 07 and SCENE 08 now use Intersection Observer (no scroll handler needed)
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
        }
    });
    onScroll();
}

function initCountdown() {
    const targetDate = new Date(weddingConfig.numericDate).getTime();
    
    const elDays = document.getElementById('cdDays');
    const elHours = document.getElementById('cdHours');
    const elMins = document.getElementById('cdMins');
    const elSecs = document.getElementById('cdSecs');
    const elDone = document.getElementById('cdDone');
    const elContainer = document.querySelector('.countdown-container');

    function update() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            if (elContainer) elContainer.style.display = 'none';
            if (elDone) elDone.style.display = 'block';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (elDays) elDays.textContent = String(days).padStart(2, '0');
        if (elHours) elHours.textContent = String(hours).padStart(2, '0');
        if (elMins) elMins.textContent = String(minutes).padStart(2, '0');
        if (elSecs) elSecs.textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
}

function initMusic() {
    const btn = document.getElementById('musicBtn');
    const audio = document.getElementById('bgMusic');
    
    if (!btn || !audio) return;

    btn.classList.add('visible');

    btn.addEventListener('click', () => {
        if (audio.paused) {
            audioContextStarted = true;
            playAudio();
        } else {
            audio.pause();
            btn.classList.remove('playing');
        }
    });
}

function playAudio() {
    const btn = document.getElementById('musicBtn');
    const audio = document.getElementById('bgMusic');
    if (!audio) return;
    
    audio.play().then(() => {
        if (btn) btn.classList.add('playing');
    }).catch(e => {
        console.log("Audio autoplay prevented by browser.");
    });
}

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lbImg');
    const lbClose = document.getElementById('lbClose');
    const lbPrev = document.getElementById('lbPrev');
    const lbNext = document.getElementById('lbNext');
    const photos = Array.from(document.querySelectorAll('.photo-item img'));
    
    if (!lightbox || photos.length === 0) return;

    let currentIndex = 0;

    function openLightbox(index) {
        currentIndex = index;
        lbImg.src = photos[currentIndex].src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent scrolling
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % photos.length;
        lbImg.src = photos[currentIndex].src;
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + photos.length) % photos.length;
        lbImg.src = photos[currentIndex].src;
    }

    photos.forEach((img, index) => {
        img.parentElement.addEventListener('click', () => openLightbox(index));
    });

    lbClose.addEventListener('click', closeLightbox);
    lbNext.addEventListener('click', showNext);
    lbPrev.addEventListener('click', showPrev);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });
}

function initRSVP() {
    const btnYes = document.getElementById('btnYes');
    const btnNo = document.getElementById('btnNo');
    const form = document.getElementById('rsvpForm');
    const btnSubmit = document.getElementById('btnSubmitRsvp');
    let isAttending = null;

    if (!btnYes || !btnNo || !form || !btnSubmit) return;

    btnYes.addEventListener('click', () => {
        btnYes.classList.add('selected');
        btnNo.classList.remove('selected');
        form.style.display = 'flex';
        isAttending = true;
    });

    btnNo.addEventListener('click', () => {
        btnNo.classList.add('selected');
        btnYes.classList.remove('selected');
        form.style.display = 'flex';
        isAttending = false;
        
        // Hide count selection if not attending
        const countGroup = document.getElementById('guestCount').closest('.form-group');
        if (countGroup) countGroup.style.display = 'none';
    });

    btnSubmit.addEventListener('click', () => {
        const name = document.getElementById('guestName').value.trim();
        const count = document.getElementById('guestCount').value;
        const message = document.getElementById('guestMessage').value.trim();
        
        if (!name) {
            alert('برجاء إدخال الاسم');
            return;
        }

        let whatsappMsg = "";
        
        if (isAttending) {
            whatsappMsg = `مرحباً، أنا ${name} وأؤكد حضوري حفل زفاف ${weddingConfig.groom} و${weddingConfig.bride} يوم ${weddingConfig.day} ${weddingConfig.date.replace(' 2026', '')}، وعدد الحضور ${count}.`;
            if (message) whatsappMsg += `\nرسالة: ${message}`;
        } else {
            whatsappMsg = `مرحباً، أنا ${name}. للأسف لن أتمكن من حضور حفل زفاف ${weddingConfig.groom} و${weddingConfig.bride}. أتمنى لكم السعادة!`;
            if (message) whatsappMsg += `\nرسالة: ${message}`;
        }

        const encodedMsg = encodeURIComponent(whatsappMsg);
        const url = `https://wa.me/${weddingConfig.whatsapp}?text=${encodedMsg}`;
        window.open(url, '_blank');
    });
}
