document.addEventListener('DOMContentLoaded', function() {
    let audio = document.getElementById('music');
    if (!audio) {
        audio = document.createElement('audio');
        audio.id = 'music';
        document.body.appendChild(audio);
    }
    
    const vinyl = document.getElementById('vinyl');
    const musicContainer = document.getElementById('music-container');
    const musicPlayer = document.getElementById('music-player');
    
    if (!vinyl || !musicContainer || !musicPlayer) {
        console.error("Required elements not found in the DOM:", { vinyl, musicContainer, musicPlayer });
        return;
    }
    
    const playlist = [
      '../intro-music/A Sweet Smile.mp3',
      '../intro-music/Anyone Can Cook.mp3',
      '../intro-music/Ballad Du Paris.mp3',
      '../intro-music/Ballad of Many Waters.mp3',
      '../intro-music/Claire de Lune.mp3',
      '../intro-music/Coruscating Street.mp3',
      "../intro-music/Dreams' Swirling Whispers.mp3",
      '../intro-music/Equation.mp3',
      '../intro-music/Fountain of Belleau.mp3',
      '../intro-music/French Kiss.mp3',
      '../intro-music/Joie De Vivre.mp3',
      "../intro-music/Julia's Theme.mp3",
      '../intro-music/La nuit silencieuse et paisible.mp3',
      '../intro-music/Le Souvenir avec le crepuscule.mp3',
      '../intro-music/Luminescence of Eventide.mp3',
      '../intro-music/Midnight in Mondstadt.mp3',
      '../intro-music/Mondstadt Starlit.mp3',
      '../intro-music/Moonlight in Mondstadt.mp3',
      '../intro-music/Nocturnal Illumination.mp3',
      '../intro-music/Quand la lumiere resplendira.mp3',
      '../intro-music/Que le vent soit doux.mp3',
      '../intro-music/Ratatouille Main Theme.mp3',
      '../intro-music/Suis-moi.mp3'
    ];
    
    let currentSongIndex = parseInt(localStorage.getItem('currentTrack')) || 0;
    let currentTime = parseFloat(localStorage.getItem('currentTime')) || 0;
    let isPlaying = JSON.parse(localStorage.getItem('isPlaying')) || false;
    
    function initializePlayer() {
        audio.volume = 0.2;
        audio.currentTime = currentTime;
        
        if (isPlaying) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Autoplay prevented:", error);
                    isPlaying = false;
                    vinyl.style.animationPlayState = 'paused';
                });
            }
        } else {
            vinyl.style.animationPlayState = 'paused';
        }
        
        setInterval(savePlayerState, 1000);
        document.addEventListener('keydown', handleKeyControls);
    }
    
    function handleKeyControls(e) {
        if (e.code === 'Space' && e.target === document.body) {
            e.preventDefault();
            togglePlay();
        }
        if (e.code === 'ArrowRight' && e.altKey) {
            nextSong();
        }
        if (e.code === 'ArrowLeft' && e.altKey) {
            prevSong();
        }
    }
    
    function savePlayerState() {
        localStorage.setItem('currentTrack', currentSongIndex);
        localStorage.setItem('currentTime', audio.currentTime);
        localStorage.setItem('isPlaying', isPlaying);
    }
    
    function loadSong(songIndex) {
        if (songIndex < 0 || songIndex >= playlist.length) {
            console.error("Invalid song index:", songIndex);
            songIndex = 0;
        }
        
        currentSongIndex = songIndex;
        audio.src = playlist[currentSongIndex];
        
        if (isPlaying) {
            audio.play().catch(e => {
                console.log("Audio play failed:", e);
                const userInteractionRequired = () => {
                    document.body.addEventListener('click', function initialClick() {
                        audio.play();
                        document.body.removeEventListener('click', initialClick);
                    }, { once: true });
                    alert("Please click anywhere to start the music (browser autoplay policy)");
                };
                userInteractionRequired();
            });
            vinyl.style.animationPlayState = 'running';
        }
    }
    
    function nextSong() {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        loadSong(currentSongIndex);
    }
    
    function prevSong() {
        currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
        loadSong(currentSongIndex);
    }
    
    function togglePlay() {
        if (isPlaying) {
            audio.pause();
            vinyl.style.animationPlayState = 'paused';
        } else {
            audio.play().catch(e => {
                console.log("Audio play failed:", e);
                const userInteractionRequired = () => {
                    document.body.addEventListener('click', function initialClick() {
                        audio.play();
                        document.body.removeEventListener('click', initialClick);
                    }, { once: true });
                    alert("Please click anywhere to start the music (browser autoplay policy)");
                };
                userInteractionRequired();
            });
            vinyl.style.animationPlayState = 'running';
        }
        isPlaying = !isPlaying;
    }
    
    audio.addEventListener('ended', nextSong);
    vinyl.addEventListener('click', togglePlay);
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    musicContainer.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    musicContainer.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX - touchStartX > swipeThreshold) {
            prevSong();
        } else if (touchStartX - touchEndX > swipeThreshold) {
            nextSong();
        }
    }
    
    musicContainer.addEventListener('dblclick', function() {
        musicContainer.classList.toggle('hidden');
    });
    
    loadSong(currentSongIndex);
    initializePlayer();
});
