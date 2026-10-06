let isCandleBlown = false;

window.onload = function() {
    createBalloons();
    initData();
};

function initData() {
    if (typeof BIRTHDAY_DATA === 'undefined') return;

    // Pasang sumber musik dari data.js ke elemen audio HTML
    const audioSource = document.getElementById('bg-music-source');
    const audio = document.getElementById('bg-music');
    if (audioSource && audio && BIRTHDAY_DATA.musicUrl) {
        audioSource.src = BIRTHDAY_DATA.musicUrl;
        audio.load(); // Reload audio element dengan URL baru
    }

    document.getElementById('profile-img').src = BIRTHDAY_DATA.profileImage;
    document.getElementById('letter-title').innerText = BIRTHDAY_DATA.secretLetter.title;
    document.getElementById('letter-body').innerText = BIRTHDAY_DATA.secretLetter.body;
    document.getElementById('letter-sender').innerText = BIRTHDAY_DATA.secretLetter.sender;

    // Galeri Foto
    const galleryContainer = document.getElementById('photo-gallery');
    if (galleryContainer) {
        galleryContainer.innerHTML = '';
        BIRTHDAY_DATA.gallery.forEach(item => {
            const card = document.createElement('div');
            card.className = 'glass-card p-3 rounded-2xl group hover:-translate-y-1 transition duration-300';
            card.innerHTML = `
                <div class="relative overflow-hidden rounded-xl aspect-square mb-2">
                    <img src="${item.image}" alt="Memory" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                </div>
                <p class="text-xs font-semibold text-slate-700 text-center">${item.caption}</p>
            `;
            galleryContainer.appendChild(card);
        });
    }

    startCountdown();
}

function startCountdown() {
    const targetTime = new Date(BIRTHDAY_DATA.targetDate).getTime();

    const timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const difference = targetTime - now;

        if (difference < 0) {
            clearInterval(timerInterval);
            document.getElementById('countdown-timer').innerHTML = "<span class='text-pink-600 font-bold text-sm'>🎉 Selamat Ulang Tahun, Kay! 🎉</span>";
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById('cd-days').innerText = String(days).padStart(2, '0');
        document.getElementById('cd-hours').innerText = String(hours).padStart(2, '0');
        document.getElementById('cd-minutes').innerText = String(minutes).padStart(2, '0');
        document.getElementById('cd-seconds').innerText = String(seconds).padStart(2, '0');
    }, 1000);
}

function handleLogin(e) {
    if (e) e.preventDefault();

    const nameInput = document.getElementById('username').value.trim();
    const passInput = document.getElementById('password').value.trim();
    const errorMsg = document.getElementById('error-message');

    const isValidUser = nameInput.toLowerCase() === BIRTHDAY_DATA.targetName.toLowerCase();
    const isValidPass = passInput.toLowerCase() === BIRTHDAY_DATA.secretPassword.toLowerCase() || passInput.length >= 4;

    if (isValidUser && isValidPass) {
        if (errorMsg) errorMsg.classList.add('hidden');

        // PUTAR MUSIK LANGSUNG SAAT KLIK TERJADI
        const audio = document.getElementById('bg-music');
        if (audio) {
            audio.currentTime = 0;
            audio.play().then(() => {
                updateMusicUI(true);
            }).catch(err => {
                console.log("Autoplay error: ", err);
                updateMusicUI(false);
            });
        }

        const loginSection = document.getElementById('login-section');
        const mainContent = document.getElementById('main-content');

        loginSection.style.opacity = '0';
        loginSection.style.transition = 'opacity 0.5s ease';

        setTimeout(() => {
            loginSection.classList.add('hidden');
            mainContent.classList.remove('hidden');

            document.getElementById('display-user-name').innerText = "kay";
            document.getElementById('hero-user-name').innerText = "kay";

            if (typeof confetti === 'function') {
                triggerConfettiExplosion();
            }
        }, 500);
    } else {
        if (errorMsg) errorMsg.classList.remove('hidden');
    }
}

function sendToWhatsApp(e) {
    if (e) e.preventDefault();
    const message = document.getElementById('reply-text').value.trim();
    if (!message) return;

    const encodedMessage = encodeURIComponent(`Hai! Ini balasan ucapan ulang tahun dari kay:\n\n"${message}"`);
    const waUrl = `https://wa.me/${BIRTHDAY_DATA.whatsappNumber}?text=${encodedMessage}`;
    
    window.open(waUrl, '_blank');
}

function createBalloons() {
    const container = document.getElementById('balloon-container');
    if (!container) return;
    const colors = ['#f472b6', '#fb7185', '#c084fc', '#818cf8', '#fde047'];
    for (let i = 0; i < 15; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.left = `${Math.random() * 100}%`;
        balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        balloon.style.animationDelay = `${Math.random() * 10}s`;
        balloon.style.animationDuration = `${10 + Math.random() * 10}s`;
        container.appendChild(balloon);
    }
}

function triggerConfettiExplosion() {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
}

function blowOutCandle() {
    if (isCandleBlown) return;
    document.getElementById('flame-element').classList.add('extinguished');
    document.getElementById('smoke-element').style.display = 'block';
    isCandleBlown = true;
    document.getElementById('wish-message').innerHTML = `
        <div class="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-4 py-2 rounded-full shadow-sm">
            ✨ Yeay! Lilin berhasil ditiup! Semoga semua doa terkabul! 🎉
        </div>
    `;
    triggerConfettiExplosion();
}

function toggleMusic() {
    const audio = document.getElementById('bg-music');
    if (audio.paused) { 
        audio.play(); 
        updateMusicUI(true); 
    } else { 
        audio.pause(); 
        updateMusicUI(false); 
    }
}

function updateMusicUI(isPlaying) {
    const musicText = document.getElementById('music-text');
    if (musicText) {
        musicText.innerText = isPlaying ? "Jeda Musik" : "Putar Musik";
    }
}

function openModal() {
    const modal = document.getElementById('letter-modal');
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.classList.add('opacity-100');
}

function closeModal() {
    const modal = document.getElementById('letter-modal');
    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0', 'pointer-events-none');
}

function showHint() {
    document.getElementById('hint-box').classList.toggle('hidden');
}