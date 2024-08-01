// 




// Variables
let isPlaying = false;
let currentSongIndex = 0;
let currentPlaylist = [];
const searchBar = document.getElementById('search-bar');
const searchResultsContainer = document.querySelector('.search-results');
const audio = new Audio();

const songs = [
    {src: '1.mp3', title: 'song1', artist: 'Artist1', section: 'favorite-playlist', thumbnail: 'shoes/2.avif'},
    {src: '2.mp3', title: 'song2', artist: 'Artist2', section: 'favorite-playlist', thumbnail: 'shoes/1.avif'},
    {src: '3.mp3', title: 'song3', artist: 'Artist3', section: 'favorite-playlist', thumbnail: 'shoes/4.jpg'},

    {src: '4.mp3', title: 'song4', artist: 'Artist4', section: 'most-played', thumbnail: 'shoes/5.avif'},
    {src: '5.mp3', title: 'song5', artist: 'Artist5', section: 'most-played', thumbnail: 'shoes/10.avif'},
    {src: '6.mp3', title: 'song6', artist: 'Artist6', section: 'most-played', thumbnail: 'shoes/7.avif'},
    


    {src: '7.mp3', title: 'song7', artist: 'Artist7', section: 'romantics', thumbnail: 'shoes/8.avif'},
    {src: '8.mp3', title: 'song8', artist: 'Artist8', section: 'romantics', thumbnail: 'shoes/9.avif'},
];

const musicPlayer = document.getElementById('music-player');
const thumbnail = document.getElementById('thumbnail');
const songTitle = document.getElementById('song-title');
const artistName = document.getElementById('artist-name');
const progress = document.getElementById('progress');
const playPauseBtn = document.getElementById('play-pause-btn');
const miniPlayPauseBtn = document.getElementById('mini-play-pause-btn');
const miniSongTitle = document.getElementById('mini-song-title');
const miniArtistName = document.getElementById('mini-artist-name');
const miniThumbnail = document.getElementById('mini-thumbnail');
const playlistQueue = document.getElementById('playlist-queue');
const minimizeBtn = document.getElementById('minimize-btn');

// Event Listeners
document.getElementById('prev-btn').addEventListener('click', playPrev);
document.getElementById('next-btn').addEventListener('click', playNext);
playPauseBtn.addEventListener('click', togglePlayPause);
miniPlayPauseBtn.addEventListener('click', togglePlayPause);
progress.addEventListener('input', seek);

document.getElementById('romantics').addEventListener('click', () => openPlaylist('Romantics Playlist', 'romantics'));
document.getElementById('most-played').addEventListener('click', () => openPlaylist('Most Played Playlist', 'most-played'));
document.getElementById('favorite-playlist').addEventListener('click', () => openPlaylist('Favorite Playlist', 'favorite-playlist'));

miniThumbnail.parentElement.addEventListener('click', openMusicPlayer);
minimizeBtn.addEventListener('click', closeMusicPlayer);

// Functions
function loadSongs() {
    const sections = ['romantics', 'most-played', 'favorite-playlist'];
    sections.forEach(section => {
        const playlistSection = document.getElementById(section).querySelector('.playlist');
        const sectionSongs = songs.filter(song => song.section === section);
        sectionSongs.forEach((song, index) => {
            const songItem = document.createElement('div');
            songItem.classList.add('playlist-item');
            songItem.innerHTML = `
                <img src="${song.thumbnail}" alt="${song.title}">
                <p>${song.title}</p>
            `;
            songItem.addEventListener('click', () => playSongFromPlaylist(index, section));
            playlistSection.appendChild(songItem);
        });
    });
}

function openPlaylist(title, section) {
    document.getElementById('playlist-title').innerText = title;
    playlistQueue.innerHTML = '';
    currentPlaylist = songs.filter(song => song.section === section);
    currentPlaylist.forEach((song, index) => {
        const songElement = document.createElement('li');
        songElement.innerText = `${song.title} - ${song.artist}`;
        songElement.addEventListener('click', () => playSong(index));
        playlistQueue.appendChild(songElement);
    });
    musicPlayer.classList.add('show');
}

function closeMusicPlayer() {
    musicPlayer.classList.remove('show');
}

function playSong(index) {
    currentSongIndex = index;
    audio.src = currentPlaylist[index].src;
    songTitle.innerText = currentPlaylist[index].title;
    artistName.innerText = currentPlaylist[index].artist;
    thumbnail.src = currentPlaylist[index].thumbnail;
    miniThumbnail.src = currentPlaylist[index].thumbnail;
    miniSongTitle.innerText = currentPlaylist[index].title;
    miniArtistName.innerText = currentPlaylist[index].artist;
    playMusic();
}

function playSongFromPlaylist(index, section) {
    currentPlaylist = songs.filter(song => song.section === section);
    playSong(index);
    showNowPlayingBar();
}

function togglePlayPause() {
    if (isPlaying) {
        audio.pause();
        playPauseBtn.innerHTML = `<i class="ri-play-circle-fill"></i>`;
        miniPlayPauseBtn.innerHTML = `<i class="ri-play-circle-fill"></i>`;
    } else {
        audio.play();
        playPauseBtn.innerHTML = `<i class="ri-pause-circle-fill"></i>`;
        miniPlayPauseBtn.innerHTML = `<i class="ri-pause-circle-fill"></i>`;
    }
    isPlaying = !isPlaying;
}

function playPrev() {
    currentSongIndex = (currentSongIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    playSong(currentSongIndex);
}

function playNext() {
    currentSongIndex = (currentSongIndex + 1) % currentPlaylist.length;
    playSong(currentSongIndex);
}

function playMusic() {
    audio.play();
    isPlaying = true;
    playPauseBtn.innerHTML = `<i class="ri-pause-circle-fill"></i>`;
    miniPlayPauseBtn.innerHTML = `<i class="ri-pause-circle-fill"></i>`;
    showNowPlayingBar();
}

function showNowPlayingBar() {
    document.querySelector('.now-playing-bar').classList.add('show');
}

function openMusicPlayer() {
    musicPlayer.classList.add('show');
}

function updateProgress() {
    const { duration, currentTime } = audio;
    progress.max = duration;
    progress.value = currentTime;
}

function seek() {
    const seekTime = progress.value;
    audio.currentTime = seekTime;
}

audio.addEventListener('timeupdate', () => {
    updateProgress();
    if (audio.ended) playNext();
});

function displaySearchResults(results) {
    searchResultsContainer.innerHTML = '';
    if (results.length === 0) {
        searchResultsContainer.innerHTML = '<p>No results found</p>';
    } else {
        results.forEach(song => {
            const resultItem = document.createElement('div');
            resultItem.classList.add('result-item');
            resultItem.innerHTML = `
                <img src="${song.thumbnail}" alt="${song.title}">
                <p>${song.title} - ${song.artist}</p>
            `;
            resultItem.addEventListener('click', () => {
                const index = songs.findIndex(s => s.title === song.title && s.artist === song.artist);
                if (index !== -1) {
                    playSong(index);
                    openMusicPlayer(); // Show the music player
                    showNowPlayingBar(); // Ensure the now-playing bar is visible
                }
            });
            searchResultsContainer.appendChild(resultItem);
        });
    }
    searchResultsContainer.style.display = results.length ? 'block' : 'none';
}

// Function to handle search input
function handleSearch() {
    const query = searchBar.value.toLowerCase();
    const filteredSongs = songs.filter(song =>
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query)
    );
    displaySearchResults(filteredSongs);
}

// Event Listener for search bar input
searchBar.addEventListener('input', handleSearch);

// Close search results when clicking outside (optional)
document.addEventListener('click', (e) => {
    if (!searchBar.contains(e.target) && !searchResultsContainer.contains(e.target)) {
        searchResultsContainer.style.display = 'none';
    }
});

// Initial Load
loadSongs();










































