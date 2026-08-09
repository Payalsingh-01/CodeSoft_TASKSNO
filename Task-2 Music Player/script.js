// Array containing local or external streams
// Expanded track registry
const tracksData = [
    { id: 0, title: "Midnight Echoes", artist: "Astraea", src: "song1.mp3", art: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&q=80", favorite: false },
    { id: 1, title: "Solar Wind", artist: "Helix Nebula", src: "song2.mp3", art: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&q=80", favorite: true },
    { id: 2, title: "Nebula Drift", artist: "Stardust Echo", src: "song3.mp3", art: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80", favorite: false },
    { id: 3, title: "Cosmic Resonance", artist: "Pulse Nova", src: "song4.mp3", art: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=300&q=80", favorite: false },
    { id: 4, title: "Event Horizon", artist: "Void Walker", src: "song5.mp3", art: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=300&q=80", favorite: true },
    { id: 5, title: "Interstellar", artist: "Quasar", src: "song6.mp3", art: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&q=80", favorite: false }
];


let currentIndex = 0;
let isShuffle = false;
let repeatMode = 'off'; 
let isAutoplay = true;


const audio = document.getElementById('audio');
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const favoriteBtn = document.getElementById('favorite-btn');
const autoplayBtn = document.getElementById('autoplay-btn');

const progressBar = document.getElementById('progress-bar');
const currentTimeDisplay = document.getElementById('current-time');
const durationTimeDisplay = document.getElementById('duration-time');
const volumeSlider = document.getElementById('volume-slider');
const muteBtn = document.getElementById('mute-btn');
const volumeIcon = document.getElementById('volume-icon');
const speedSelector = document.getElementById('speed-selector');

const albumArt = document.getElementById('album-art');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const playlistContainer = document.getElementById('playlist-container');


function initPlayer() {
    loadTrack(currentIndex);
    renderPlaylist();
    audio.volume = volumeSlider.value;
}


function loadTrack(index) {
    currentIndex = index;
    const track = tracksData[currentIndex];
    
    audio.src = track.src;
    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;
    albumArt.src = track.art;
    

    audio.playbackRate = parseFloat(speedSelector.value);
    
    
    if (track.favorite) {
        favoriteBtn.classList.add('favorited');
    } else {
        favoriteBtn.classList.remove('favorited');
    }

    updatePlaylistActiveUI();
}

function togglePlay() {
    if (audio.paused) {
        audio.play();
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    } else {
        audio.pause();
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    }
}

audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const progressPercentage = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progressPercentage;
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
    }
});


audio.addEventListener('loadedmetadata', () => {
    durationTimeDisplay.textContent = formatTime(audio.duration);
});


progressBar.addEventListener('input', () => {
    const seekTime = (progressBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
});

// Format Raw floating seconds to standard MM:SS string 
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}


function nextTrack() {
    if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
        return;
    }
    if (isShuffle) {
        let randIndex;
        do {
            randIndex = Math.floor(Math.random() * tracksData.length);
        } while (randIndex === currentIndex && tracksData.length > 1);
        currentIndex = randIndex;
    } else {
        currentIndex = (currentIndex + 1) % tracksData.length;
    }
    loadTrack(currentIndex);
    audio.play();
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
}

function prevTrack() {
    currentIndex = (currentIndex - 1 + tracksData.length) % tracksData.length;
    loadTrack(currentIndex);
    audio.play();
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
}

audio.addEventListener('ended', () => {
    if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
    } else if (repeatMode === 'all' || isAutoplay) {
        nextTrack();
    } else {
        // Mode off and end of array bounds reached
        if (currentIndex < tracksData.length - 1) {
            nextTrack();
        } else {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    }
});

volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
    audio.muted = (audio.volume === 0);
    updateVolumeIcon();
});

muteBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    updateVolumeIcon();
});

function updateVolumeIcon() {
    if (audio.muted || audio.volume === 0) {
        volumeIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>';
    } else {
        volumeIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>';
    }
}

speedSelector.addEventListener('change', (e) => {
    audio.playbackRate = parseFloat(e.target.value);
});

shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active-mode', isShuffle);
});

repeatBtn.addEventListener('click', () => {
    if (repeatMode === 'off') {
        repeatMode = 'all';
        repeatBtn.classList.add('active-mode');
        repeatBtn.setAttribute('title', 'Repeat All');
    } else if (repeatMode === 'all') {
        repeatMode = 'one';
        repeatBtn.classList.add('active-mode');
        repeatBtn.setAttribute('title', 'Repeat One');
       
    } else {
        repeatMode = 'off';
        repeatBtn.classList.remove('active-mode');
        repeatBtn.setAttribute('title', 'Repeat Off');
    }
});

autoplayBtn.addEventListener('click', () => {
    isAutoplay = !isAutoplay;
    autoplayBtn.textContent = `Autoplay ${isAutoplay ? 'ON' : 'OFF'}`;
    autoplayBtn.classList.toggle('active-mode', isAutoplay);
});

favoriteBtn.addEventListener('click', () => {
    tracksData[currentIndex].favorite = !tracksData[currentIndex].favorite;
    favoriteBtn.classList.toggle('favorited');
    renderPlaylist(); 
});


function renderPlaylist() {
    playlistContainer.innerHTML = '';
    tracksData.forEach((track, idx) => {
        const item = document.createElement('li');
        item.className = `playlist-item ${idx === currentIndex ? 'playing' : ''}`;
        item.setAttribute('data-id', idx);
        
        item.innerHTML = `
            <img class="playlist-thumb" src="${track.art}" alt="thumb">
            <div class="playlist-details">
                <p class="p-title">${track.title}</p>
                <p class="p-artist">${track.artist}</p>
            </div>
            ${track.favorite ? '<span class="fav-indicator">❤️</span>' : ''}
        `;
        
        item.addEventListener('click', () => {
            loadTrack(idx);
            audio.play();
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        });
        
        playlistContainer.appendChild(item);
    });
}

function updatePlaylistActiveUI() {
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, idx) => {
        if (idx === currentIndex) {
            item.classList.add('playing');
        } else {
            item.classList.remove('playing');
        }
    });
}


playPauseBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);


initPlayer();
