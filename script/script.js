    class SpotifyPlayer {
        constructor() {
            this.audio = document.getElementById('audioPlayer');
            this.currentSongIndex = 0;
            this.isPlaying = false;
            this.isShuffled = false;
            this.repeatMode = 0; // 0: off, 1: all, 2: one
            this.volume = 0.7;
            this.songs = [
                {
                    id: 1,
                    title: "Nandito Ako (Rob Daniel Cover)",
                    artist: "Rob Daniel",
                    cover: "cover/robdaniel.jpg",
                    duration: 180,
                    src: "songs/Nandito Ako (Rob Deniel Cover).mp3"
                },
                {
                    id: 2,
                    title: "Gusto Ko Sakin Ka Lang",
                    artist: "Robledo Timido",
                    cover: "cover/robledotimido.jpg",
                    duration: 195,
                    src: "songs/Gusto Ko Sakin Ka Lang - Robledo Timido (Lyrics).mp3"
                },
                {
                    id: 3,
                    title: "Ako Na Lang",
                    artist: "Zia Quizon",
                    cover: "cover/ziaquizon.jpg",
                    duration: 193.8,
                    src: "songs/Ako Na lang - Zia Quizon  lyrics.mp3"
                },
                {
                    id: 4,
                    title: "Alipin",
                    artist: "Khel Pangilinan",
                    cover: "cover/khelpangilinan.jpg",
                    duration: 202.8,
                    src: "songs/Alipin - Shamrock (Khel Pangilinan) (Lyrics).mp3"
                },
                {
                    id: 5,
                    title: "Saksi ang Langit",
                    artist: "December Avenue",
                    cover: "cover/DecemberAvenue.png",
                    duration: 258.6,
                    src: "songs/December Avenue - Saksi Ang Langit (OFFICIAL LYRIC VIDEO).mp3"
                },
                {
                    id: 6,
                    title: "Incomplete",
                    artist: "Sisqo",
                    cover: "cover/sisqo.jpg",
                    duration: 260.4,
                    src: "songs/Incomplete.mp3"
                },
                {
                    id: 7,
                    title: "Naiilang",
                    artist: "Le John",
                    cover: "cover/lejohn.jpg",
                    duration: 241.8,
                    src: "songs/Le John - Naiilang (Lyrics)  24Vibes.mp3"
                },
                {
                    id: 8,
                    title: "Bakit Hindi Ka Crush Ng Crush Mo",
                    artist: "Zia Quizon",
                    cover: "cover/ziaquizon.jpg",
                    duration: 247.8,
                    src: "songs/Zia Quizon - Bakit Hindi Ka Crush Ng Crush Mo_ (Lyrics).mp3"
                },
                {
                    id: 9,
                    title: "Your Universe",
                    artist: "Rico Blanco",
                    cover: "cover/ricoblanco.jpeg",
                    duration: 240,
                    src: "songs/Your Universe (Acoustic).mp3"
                },
                {
                    id: 9,
                    title: "Pangarap Lang Kita",
                    artist: "Parokya Ni Edgar",
                    cover: "cover/parokyaniedgar.jpg",
                    duration: 189,
                    src: "songs/PANGARAP LANG KITA - Parokya Ni Edgar feat, Happy Sy (lyrics).mp3"
                },
                {
                    id: 9,
                    title: "Ipagdadamot Kita",
                    artist: "Realest Cram, OLG Zak, Nateman & CK YG",
                    cover: "cover/ipagdadamotkita.png",
                    duration: 244.2,
                    src: "songs/IPAGDADAMOT KITA - Realest Cram, OLG Zak, Nateman & CK YG (Official Lyric Video).mp3"
                }
            ];
            this.originalPlayOrder = [...Array(this.songs.length).keys()];
            this.playOrder = [...this.originalPlayOrder];
            this.currentPlayTime = 0;
            this.progressInterval = null;
            this.currentTab = 'home';
            this.searchResults = [];
            this.sortOrder = 'default'; // default, title, artist, duration
            
            this.initializePlayer();
            this.setupEventListeners();
            this.renderSongGrid();
            this.renderLibrarySongs();
            this.updateLibraryCount();
            this.renderLibrarySongs();
            this.updateLibraryCount();
        }

        initializePlayer() {
            this.audio.volume = this.volume;
            this.updateVolumeDisplay();
            this.updatePlayerDisplay();
        }

        setupEventListeners() {
        // Play/Pause button
        document.getElementById('playBtn').addEventListener('click', () => {
            this.togglePlayPause();
        });

        // Previous/Next buttons
        document.getElementById('prevBtn').addEventListener('click', () => {
            this.previousSong();
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            this.nextSong();
        });

        // Shuffle button
        document.getElementById('shuffleBtn').addEventListener('click', () => {
            this.toggleShuffle();
        });

        // Repeat button
        document.getElementById('repeatBtn').addEventListener('click', () => {
            this.toggleRepeat();
        });

        // Progress bar
        document.getElementById('progressBar').addEventListener('click', (e) => {
            this.seekTo(e);
        });

        // Volume bar
        document.getElementById('volumeBar').addEventListener('click', (e) => {
            this.setVolume(e);
        });

        // Like button
        document.querySelector('.like-btn').addEventListener('click', () => {
            this.toggleLike();
        });

        // Tab navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const tab = item.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });

        // Search input
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.performSearch(e.target.value);
        });

        // Sort button
        document.getElementById('sortBtn').addEventListener('click', () => {
            this.toggleSort();
        });

        // Audio events
        this.audio.addEventListener('loadedmetadata', () => {
            this.updateTimeDisplay();
        });

        this.audio.addEventListener('timeupdate', () => {
            this.updateProgress();
        });

        this.audio.addEventListener('ended', () => {
            this.handleSongEnd();
        });

        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.updatePlayButton();
            this.startProgressTimer();
        });

        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updatePlayButton();
            this.stopProgressTimer();
        });

        }

        switchTab(tab) {
            // upd.. active nav item
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

            // show/hide tab content;
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tab}Tab`).classList.add('active');

            this.currentTab = tab;
        }

        performSearch(query) {
            const searchResults = document.getElementById('searchResults');
            
            if (!query.trim()) {
                searchResults.innerHTML = `
                    <div class="no-search">
                        <h2>Start typing to search for songs, artists...</h2>
                    </div>
                `;
                return;
            }

            // filter the songs based on query
            this.searchResults = this.songs.filter(song => 
                song.title.toLowerCase().includes(query.toLowerCase()) ||
                song.artist.toLowerCase().includes(query.toLowerCase())
            );

            if (this.searchResults.length === 0) {
                searchResults.innerHTML = `
                    <div class="no-search">
                        <h2>No results found for "${query}"</h2>
                        <p>Try searching for something else.</p>
                    </div>
                `;
                return;
            }

            // display search results
            searchResults.innerHTML = `
                <h2>Songs</h2>
                <div class="search-results-grid"></div>
            `;

            const resultsGrid = searchResults.querySelector('.search-results-grid');
        this.searchResults.forEach((song, index) => {
        const originalIndex = this.songs.findIndex(s => s.id === song.id);
        const songCard = document.createElement('div');
        songCard.className = 'song-card';
    songCard.innerHTML = `
        <div class="song-cover">
            ${song.cover
                ? `<img src="${song.cover}" alt="${song.title} cover" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">`
                : '<i class="fa fa-music" style="font-size:2em;color:#b3b3b3;"></i>'}
            <div class="play-overlay"><i class="fa fa-play"></i></div>
        </div>
        <div class="song-title">${song.title}</div>
        <div class="song-artist">${song.artist}</div>
    `;

        songCard.addEventListener('click', () => {
            this.playSong(originalIndex);
        });

        resultsGrid.appendChild(songCard);
    });
        }

        renderLibrarySongs() {
            const librarySongsList = document.getElementById('librarySongsList');
            const librarySongs = document.getElementById('librarySongs');
            const libraryList = document.getElementById('libraryList');
            
            // upd. sidebar library
            if (libraryList) {
                libraryList.innerHTML = '';
                this.getSortedSongs().slice(0, 10).forEach((song, index) => {
                    const originalIndex = this.songs.findIndex(s => s.id === song.id);
                    const songItem = document.createElement('div');
                    songItem.className = 'library-song-item';
                    songItem.innerHTML = `
                        <div class="library-song-cover">
        ${song.cover
            ? `<img src="${song.cover}" alt="${song.title} cover" style="width:100%;height:100%;object-fit:cover;border-radius:4px;">`
            : '🎵'}
    </div>
                        <div class="library-song-info">
                            <div class="library-song-title">${song.title}</div>
                            <div class="library-song-artist">${song.artist}</div>
                        </div>
                    `;

                    songItem.addEventListener('click', () => {
                        this.playSong(originalIndex);
                    });

                    libraryList.appendChild(songItem);
                });
            }

            // Update main da library view
            if (librarySongsList) {
                librarySongsList.innerHTML = '';
                this.getSortedSongs().forEach((song, index) => {
                    const originalIndex = this.songs.findIndex(s => s.id === song.id);
                    const songRow = document.createElement('div');
                    songRow.className = 'library-song-row';
                    songRow.innerHTML = `
                        <div class="library-row-number">${index + 1}</div>
                        <div class="library-row-info">
                            <div class="library-row-cover">
        ${song.cover
            ? `<img src="${song.cover}" alt="${song.title} cover" style="width:100%;height:100%;object-fit:cover;border-radius:4px;">`
            : '🎵'}
    </div>
                            <div class="library-row-details">
                                <div class="library-row-title">${song.title}</div>
                                <div class="library-row-artist">${song.artist}</div>
                            </div>
                        </div>
                        <div class="library-row-album">${song.artist}</div>
                        <div class="library-row-duration">${this.formatDuration(song.duration)}</div>
                    `;

                    songRow.addEventListener('click', () => {
                        this.playSong(originalIndex);
                    });

                    librarySongsList.appendChild(songRow);
                });
            }
        }

        getSortedSongs() {
            let sortedSongs = [...this.songs];
            
            switch (this.sortOrder) {
                case 'title':
                    sortedSongs.sort((a, b) => a.title.localeCompare(b.title));
                    break;
                case 'artist':
                    sortedSongs.sort((a, b) => a.artist.localeCompare(b.artist));
                    break;
                case 'duration':
                    sortedSongs.sort((a, b) => b.duration - a.duration);
                    break;
                default:
                    // Keep original order
                    break;
            }
            
            return sortedSongs;
        }

        toggleSort() {
            const sortOptions = ['default', 'title', 'artist', 'duration'];
            const currentIndex = sortOptions.indexOf(this.sortOrder);
            this.sortOrder = sortOptions[(currentIndex + 1) % sortOptions.length];
            
            const sortBtn = document.getElementById('sortBtn');
            const sortLabels = {
                'default': '⇅ Sort',
                'title': '⇅ Title',
                'artist': '⇅ Artist', 
                'duration': '⇅ Duration'
            };
            
            sortBtn.textContent = sortLabels[this.sortOrder];
            this.renderLibrarySongs();
        }

        updateLibraryCount() {
            const songCount = document.getElementById('librarySongCount');
            if (songCount) {
                songCount.textContent = `${this.songs.length} songs`;
            }
        }

        formatDuration(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        renderSongGrid() {
            const songList = document.getElementById('songList');
            songList.innerHTML = '';

            this.songs.forEach((song, index) => {
                const songCard = document.createElement('div');
                songCard.className = 'song-card';
        songCard.innerHTML = `
        <div class="song-cover">
            ${song.cover
                ? `<img src="${song.cover}" alt="${song.title} cover" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">`
                : '🎵'}
    <div class="play-overlay"><i class="fa fa-play"></i></div>
        </div>
        <div class="song-title">${song.title}</div>
        <div class="song-artist">${song.artist}</div>
    `;

                songCard.addEventListener('click', () => {
                    this.playSong(index);
                });

                songList.appendChild(songCard);
            });
        }

        playSong(index) {
            this.currentSongIndex = index;
            const song = this.songs[index];

            // Update UI hereee
            this.updateActiveCard();
            this.updatePlayerDisplay();

            // Load and play audio
            this.audio.src = song.src;
            this.audio.load();
            
            // Reset progress
            this.currentPlayTime = 0;
            this.updateProgress();

            this.audio.play().then(() => {
                // Audio playing successfully
            }).catch(e => {
                console.log('Playback failed, using simulation:', e);
                // For demo purposes with data URLs, this is da playback
                this.simulatePlayback();
            });
        }

        simulatePlayback() {
            const song = this.songs[this.currentSongIndex];
            this.isPlaying = true;
            this.updatePlayButton();
            this.startProgressTimer();
        }

        startProgressTimer() {
            this.stopProgressTimer();
            this.progressInterval = setInterval(() => {
                if (!this.isPlaying) return;
                
                const song = this.songs[this.currentSongIndex];
                if (this.currentPlayTime >= song.duration) {
                    this.handleSongEnd();
                    return;
                }
                
                this.currentPlayTime++;
                this.updateProgress();
            }, 1000);
        }

        stopProgressTimer() {
            if (this.progressInterval) {
                clearInterval(this.progressInterval);
                this.progressInterval = null;
            }
        }

        togglePlayPause() {
            if (this.songs.length === 0) return;

            if (this.isPlaying) {
                this.audio.pause();
                this.isPlaying = false;
                this.stopProgressTimer();
            } else {
                if (this.audio.src) {
                    this.audio.play().catch(() => {
                        this.simulatePlayback();
                    });
                } else {
                    this.playSong(this.currentSongIndex);
                }
            }
            this.updatePlayButton();
        }

        previousSong() {
            const currentOrderIndex = this.playOrder.indexOf(this.currentSongIndex);
            const prevIndex = currentOrderIndex > 0 ? currentOrderIndex - 1 : this.playOrder.length - 1;
            this.playSong(this.playOrder[prevIndex]);
        }

        nextSong() {
            const currentOrderIndex = this.playOrder.indexOf(this.currentSongIndex);
            const nextIndex = (currentOrderIndex + 1) % this.playOrder.length;
            this.playSong(this.playOrder[nextIndex]);
        }

        handleSongEnd() {
            if (this.repeatMode === 2) { // Repeat one
                this.playSong(this.currentSongIndex);
            } else if (this.repeatMode === 1) { // Repeat all
                this.nextSong();
            } else {
                const currentOrderIndex = this.playOrder.indexOf(this.currentSongIndex);
                if (currentOrderIndex < this.playOrder.length - 1) {
                    this.nextSong();
                } else {
                    this.isPlaying = false;
                    this.updatePlayButton();
                    this.stopProgressTimer();
                }
            }
        }

        toggleShuffle() {
            this.isShuffled = !this.isShuffled;
            const shuffleBtn = document.getElementById('shuffleBtn');
            
            if (this.isShuffled) {
                shuffleBtn.style.color = '#8B5CF6';
                // Create shuffled play order
                this.playOrder = [...this.originalPlayOrder];
                for (let i = this.playOrder.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [this.playOrder[i], this.playOrder[j]] = [this.playOrder[j], this.playOrder[i]];
                }
            } else {
                shuffleBtn.style.color = '#b3b3b3';
                this.playOrder = [...this.originalPlayOrder];
            }
        }

    toggleRepeat() {
        this.repeatMode = (this.repeatMode + 1) % 3;
        const repeatBtn = document.getElementById('repeatBtn');
        const repeatIcon = repeatBtn.querySelector('i');
        // Remove any existing badge
        const existingBadge = repeatBtn.querySelector('.repeat-badge');
        if (existingBadge) existingBadge.remove();

        switch (this.repeatMode) {
            case 0: // Off
                repeatBtn.style.color = '#b3b3b3';
                repeatIcon.className = 'fa fa-repeat';
                break;
            case 1: // All
                repeatBtn.style.color = '#8B5CF6';
                repeatIcon.className = 'fa fa-repeat';
                break;
            case 2: // One
                repeatBtn.style.color = '#8B5CF6';
                repeatIcon.className = 'fa fa-repeat';
                // Add a small "1" badge
                const badge = document.createElement('span');
                badge.className = 'repeat-badge';
                badge.textContent = '1';
                badge.style.position = 'absolute';
                badge.style.fontSize = '0.7em';
                badge.style.right = '6px';
                badge.style.bottom = '6px';
                badge.style.color = '#8B5CF6';
                badge.style.pointerEvents = 'none';
                repeatBtn.style.position = 'relative';
                repeatBtn.appendChild(badge);
                break;
        }
    }

        toggleLike() {
            const likeBtn = document.querySelector('.like-btn');
            likeBtn.classList.toggle('liked');
        }

        seekTo(e) {
            const rect = e.target.getBoundingClientRect();
            const percentage = (e.clientX - rect.left) / rect.width;
            const song = this.songs[this.currentSongIndex];
            
            this.currentPlayTime = Math.floor(percentage * song.duration);
            
            if (this.audio.duration) {
                this.audio.currentTime = percentage * this.audio.duration;
            }
            
            this.updateProgress();
        }

        setVolume(e) {
            const rect = e.target.getBoundingClientRect();
            const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            
            this.volume = percentage;
            this.audio.volume = this.volume;
            this.updateVolumeDisplay();
        }

        updateProgress() {
            const song = this.songs[this.currentSongIndex];
            if (!song) return;
            
            const percentage = (this.currentPlayTime / song.duration) * 100;
            const progressFill = document.getElementById('progressFill');
            const progressHandle = document.getElementById('progressHandle');
            
            progressFill.style.width = percentage + '%';
            progressHandle.style.right = (100 - percentage) + '%';
            
            this.updateTimeDisplay();
        }

        updateTimeDisplay() {
            const formatTime = (seconds) => {
                const mins = Math.floor(seconds / 60);
                const secs = Math.floor(seconds % 60);
                return `${mins}:${secs.toString().padStart(2, '0')}`;
            };

            const song = this.songs[this.currentSongIndex];
            if (song) {
                document.getElementById('totalTime').textContent = formatTime(song.duration);
                document.getElementById('currentTime').textContent = formatTime(this.currentPlayTime);
            }
        }

        updateVolumeDisplay() {
            const volumeFill = document.getElementById('volumeFill');
            const volumeHandle = document.getElementById('volumeHandle');
            const percentage = this.volume * 100;
            
            volumeFill.style.width = percentage + '%';
            volumeHandle.style.right = (100 - percentage) + '%';
        }

    updatePlayerDisplay() {
        const song = this.songs[this.currentSongIndex];
        if (song) {
            const coverElem = document.getElementById('currentCover');
            if (song.cover && !song.cover.startsWith('🎵') && !song.cover.startsWith('🎮')) {
                coverElem.innerHTML = `<img src="${song.cover}" alt="${song.title} cover" style="width:40px;height:40px;object-fit:cover;border-radius:6px;">`;
            } else {
                coverElem.textContent = song.cover || '🎵';
            }
            document.getElementById('currentTitle').textContent = song.title;
            document.getElementById('currentArtist').textContent = song.artist;
        }
    }

        updatePlayButton() {
        const playBtn = document.getElementById('playBtn');
        const playIcon = playBtn.querySelector('i');
        if (this.isPlaying) {
            playIcon.className = 'fa fa-pause';
        } else {
            playIcon.className = 'fa fa-play';
        }
    }

        updateActiveCard() {
            // Remove active class from all cards in song grid
            document.querySelectorAll('.song-card').forEach(card => {
                card.classList.remove('active');
            });

            // Remove active class from library items
            document.querySelectorAll('.library-song-item, .library-song-row').forEach(item => {
                item.classList.remove('active');
            });

            // Add active class to current card in song grid
            const cards = document.querySelectorAll('#songList .song-card');
            if (cards[this.currentSongIndex]) {
                cards[this.currentSongIndex].classList.add('active');
            }

            // Add active class to current song in library
            const currentSong = this.songs[this.currentSongIndex];
            document.querySelectorAll('.library-song-item, .library-song-row').forEach((item, index) => {
                const songTitle = item.querySelector('.library-song-title, .library-row-title');
                if (songTitle && songTitle.textContent === currentSong.title) {
                    item.classList.add('active');
                }
            });
        }

        // Method to add new songs (for future use)
        addSong(songData) {
            this.songs.push({
                id: this.songs.length + 1,
                ...songData
            });
            this.originalPlayOrder = [...Array(this.songs.length).keys()];
            if (!this.isShuffled) {
                this.playOrder = [...this.originalPlayOrder];
            }
            this.renderSongGrid();
        }

        // Method to remove songs (for future use)
        removeSong(index) {
            if (index < 0 || index >= this.songs.length) return;
            
            this.songs.splice(index, 1);
            this.originalPlayOrder = [...Array(this.songs.length).keys()];
            
            if (this.currentSongIndex >= this.songs.length) {
                this.currentSongIndex = 0;
            }
            
            if (!this.isShuffled) {
                this.playOrder = [...this.originalPlayOrder];
            }
            
            this.renderSongGrid();
            this.updatePlayerDisplay();
        }
    }

    // Initialize the Spotify player when the DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        window.spotifyPlayer = new SpotifyPlayer();
        
        // Add some additional UI interactions
        setupAdditionalUI();
        // Mobile nav tab switching
    document.querySelectorAll('.mobile-nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const tab = item.getAttribute('data-tab');
            window.spotifyPlayer.switchTab(tab);
            // Highlight active
            document.querySelectorAll('.mobile-nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
    });

    function setupAdditionalUI() {
        // Recent played items interaction
        const recentItems = document.querySelectorAll('.recent-item');
        recentItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                // Play a random song when clicking recent items
                const randomIndex = Math.floor(Math.random() * window.spotifyPlayer.songs.length);
                window.spotifyPlayer.playSong(randomIndex);
            });
        });

        // Make profile dropdown interactive
        const userProfile = document.querySelector('.user-profile');
        userProfile.addEventListener('click', () => {
        const goToLogin = confirm('Gusto mo bumalik sa nakaraan?');
        if (goToLogin) {
            window.location.href = 'index.html';
        }
    });

        // Navigation buttons
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const navType = btn.getAttribute('data-nav');
                if (navType === 'prev') {
                    window.history.back();
                } else if (navType === 'next') {
                    window.history.forward();
                }
            });
        });
    }