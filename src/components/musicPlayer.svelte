<script lang="ts">
import { onDestroy, onMount } from "svelte";
import { slide } from "svelte/transition";
import Icon from "@iconify/svelte";

import type { MusicPlayerTrack } from "@/types/config";
import { musicPlayerConfig } from "@/config";
import { 
    STORAGE_KEYS, 
    formatTime, 
    getAssetPath, 
    parseLRC, 
    fetchLyrics, 
    fetchMetingPlaylist as fetchMetingPlaylistUtil,
    fadeInAudio 
} from "@/utils/music";
import { i18n } from "@i18n/translation";
import Key from "@i18n/i18nKey";
import "@styles/musicplayer.css";


// Music player mode, either "local" or "meting"
let mode = $state(musicPlayerConfig.mode ?? "meting");
// Meting API URL, taken from the config or using the default value
let meting_api = musicPlayerConfig.meting?.meting_api ?? "https://meting.spr-aachen.com/api";
// Meting API data source, taken from the config or using the default value
let meting_server = musicPlayerConfig.meting?.server ?? "netease";
// Meting API type, taken from the config or using the default value
let meting_type = musicPlayerConfig.meting?.type ?? "playlist";
// Meting API ID, taken from the config or using the default value
let meting_id = musicPlayerConfig.meting?.id ?? "2161912966";
// Whether autoplay is enabled, taken from the config or using the default value
let isAutoplayEnabled = $state(musicPlayerConfig.autoplay ?? false);

// Current song info
let currentSong: MusicPlayerTrack = $state({
    id: 0,
    title: "Music",
    artist: "Artist",
    cover: "/favicon/icon-light.ico",
    url: "",
    duration: 0,
});
let playlist: MusicPlayerTrack[] = $state([]);
let currentIndex = $state(0);
let audio: HTMLAudioElement | undefined = $state();
let progressBar: HTMLElement | undefined = $state();
let volumeBar: HTMLElement | undefined = $state();

// Whether playback is active
let isPlaying = $state(false);
// Whether it should play (used for autoplay when switching songs)
let shouldPlay = $state(false);
// Whether the player is collapsed
let isCollapsed = $state(true);
// Whether the playlist is shown
let showPlaylist = $state(false);
// Current playback time
let currentTime = $state(0);
// Total song duration
let duration = $state(0);
// Volume
let volume = $state(0.75);
// Whether muted
let isMuted = $state(false);
// Whether loading
let isLoading = $state(false);
// Whether shuffle is on
let isShuffled = $state(false);
// Loop mode, 0: no loop, 1: single-track loop, 2: playlist loop
let isRepeating = $state(0);
// Progress pending restoration
let pendingProgress = $state(0);
// Timestamp of the last saved progress, used for throttling
let lastSaveTime = 0;
// Error message
let errorMessage = $state("");
// Whether to show the error message
let showError = $state(false);
// Volume transition interval
let fadeInterval: number | null = null;

// Lyrics State
let lyrics: { time: number; text: string }[] = $state([]);
let currentLrcIndex = $state(-1);
let lrcContainer: HTMLElement | undefined = $state();
let isUserScrolling = $state(false);
let scrollTimeout: number | null = null;
let noLyrics = $state(false); // Flag if no lyrics available

// Load lyrics function
async function loadLyrics(song: MusicPlayerTrack) {
    lyrics = [];
    currentLrcIndex = -1;
    noLyrics = false;
    
    if (!song.lrc) {
        noLyrics = true;
        return;
    }

    const lrcText = await fetchLyrics(song.lrc);

    if (lrcText) {
        lyrics = parseLRC(lrcText);
        if (lyrics.length === 0) noLyrics = true;
    } else {
        noLyrics = true;
    }
}

// Seek to lyric time
function seekToLyric(time: number) {
    if (!audio) return;
    audio.currentTime = time;
    currentTime = time;
    if (!isPlaying) {
        togglePlay();
    }
}

// Scroll logic
function handleLrcScroll() {
    isUserScrolling = true;
    if (lrcContainer) {
        lrcContainer.classList.add('scrolling');
    }
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = window.setTimeout(() => {
        isUserScrolling = false;
        if (lrcContainer) {
            lrcContainer.classList.remove('scrolling');
        }
    }, 2000);
}

// Update lyrics on timeupdate
function updateLyrics(currentTime: number) {
    if (lyrics.length === 0) return;
    
    let index = -1;
    for (let i = 0; i < lyrics.length; i++) {
        if (currentTime >= lyrics[i].time) {
            index = i;
        } else {
            break;
        }
    }
    
    if (index !== currentLrcIndex) {
        currentLrcIndex = index;
        if (!isUserScrolling && lrcContainer && index !== -1) {
             const lines = lrcContainer.querySelectorAll('.lyric-line');
             const activeLine = lines[index] as HTMLElement;
             if (activeLine) {
                 const containerHeight = lrcContainer.clientHeight;
                 const lineOffset = activeLine.offsetTop;
                 const lineHeight = activeLine.offsetHeight;
                 const scrollTop = lineOffset - (containerHeight / 2) + (lineHeight / 2);
                 lrcContainer.scrollTo({
                     top: scrollTop,
                     behavior: 'smooth'
                 });
             }
        }
    }
}

function fadeInVolume(targetVolume: number, duration: number = 2000) {
    if (!audio) return;
    if (fadeInterval) clearInterval(fadeInterval);
    
    fadeInterval = fadeInAudio(audio, targetVolume, duration, () => {
        fadeInterval = null;
    });
}

function restoreLastSong() {
    if (playlist.length === 0) return;
    if (typeof localStorage !== 'undefined') {
        const lastId = localStorage.getItem(STORAGE_KEYS.LAST_SONG_ID);
        let index = -1;
        // Match by ID first
        if (lastId) {
            index = playlist.findIndex(s => s.id !== undefined && String(s.id) === String(lastId));
        }
        if (index !== -1) {
            currentIndex = index;
            // Get the saved progress
            const savedProgress = localStorage.getItem(STORAGE_KEYS.LAST_SONG_PROGRESS);
            if (savedProgress) {
                pendingProgress = parseFloat(savedProgress);
            }
            loadSong(playlist[currentIndex]);
            return;
        }
    }
    // If the last played song is not found, or there is no record, load the first one
    currentIndex = 0;
    loadSong(playlist[0]);
}

function showErrorMessage(message: string) {
    errorMessage = message;
    showError = true;
    setTimeout(() => {
        showError = false;
    }, 3000);
}

async function fetchMetingPlaylist() {
    if (!meting_api || !meting_id) return;
    isLoading = true;
    try {
        playlist = await fetchMetingPlaylistUtil(
            meting_api,
            meting_server,
            meting_type,
            meting_id
        );
        if (playlist.length > 0) {
            // Use setTimeout to ensure the Svelte reactive variables have updated
            setTimeout(() => {
                restoreLastSong();
            }, 0);
        }
        isLoading = false;
    } catch (e) {
        showErrorMessage(i18n(Key.musicMetingFailed));
        isLoading = false;
    }
}

async function toggleMode() {
    if (!musicPlayerConfig.enable) return;
    mode = mode === "meting" ? "local" : "meting";
    showPlaylist = false;
    isLoading = false;
    isPlaying = false;
    currentIndex = 0;
    playlist = [];
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
    currentTime = 0;
    duration = 0;
    if (mode === "meting") {
        await fetchMetingPlaylist();
    } else {
        playlist = [...(musicPlayerConfig.local?.playlist ?? [])];
        if (playlist.length > 0) {
            setTimeout(() => {
                restoreLastSong();
            }, 0);
        } else {
            showErrorMessage(i18n(Key.musicEmptyPlaylist));
        }
    }
}

function togglePlay() {
    if (!audio || !currentSong.url) return;
    if (isPlaying) {
        if (fadeInterval) {
            clearInterval(fadeInterval);
            fadeInterval = null;
        }
        audio.pause();
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(STORAGE_KEYS.USER_PAUSED, "true");
        }
    } else {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                fadeInVolume(volume);
            }).catch(() => {});
        }
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(STORAGE_KEYS.USER_PAUSED, "false");
        }
    }
}

function toggleCollapse() {
    isCollapsed = !isCollapsed;
    if (isCollapsed) {
        showPlaylist = false;
    }
}

function togglePlaylist() {
    showPlaylist = !showPlaylist;
}

let showLyrics = $state(true);

function toggleLyrics() {
    showLyrics = !showLyrics;
}

function togglePlaybackMode() {
    if (isRepeating === 1) {
        // Single -> Sequence
        isShuffled = false;
        isRepeating = 2;
    } else if (isShuffled) {
        // Shuffle -> Single
        isShuffled = false;
        isRepeating = 1;
    } else {
        // Sequence -> Shuffle
        isShuffled = true;
        isRepeating = 2;
    }
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.SHUFFLE, String(isShuffled));
        localStorage.setItem(STORAGE_KEYS.REPEAT, String(isRepeating));
    }
}

function previousSong() {
    if (playlist.length <= 1) return;
    const newIndex = currentIndex > 0 ? currentIndex - 1 : playlist.length - 1;
    playSong(newIndex);
}

function nextSong() {
    if (playlist.length <= 1) return;
    let newIndex: number;
    if (isShuffled) {
        do {
            newIndex = Math.floor(Math.random() * playlist.length);
        } while (newIndex === currentIndex && playlist.length > 1);
    } else {
        newIndex = currentIndex < playlist.length - 1 ? currentIndex + 1 : 0;
    }
    playSong(newIndex);
}

function playSong(index: number) {
    if (index < 0 || index >= playlist.length) return;
    currentIndex = index;
    // User manually selected a song (or it switched automatically); mark it as should-play
    shouldPlay = true;
    // User manually selected a song; clear the pause preference and pending progress
     if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.USER_PAUSED, "false");
    }
    pendingProgress = 0;
    // Load the song
    loadSong(playlist[currentIndex]);
}

function loadSong(song: MusicPlayerTrack) {
    if (!song || !audio) return;
    currentSong = { ...song };
    // Record the last played song ID (excluding the placeholder ID 0 from initialization)
    if (typeof localStorage !== 'undefined' && song.id !== undefined && song.id !== 0) {
        localStorage.setItem(STORAGE_KEYS.LAST_SONG_ID, String(song.id));
        // If this is not a progress-restore case, reset the saved progress
        if (pendingProgress <= 0) {
            localStorage.setItem(STORAGE_KEYS.LAST_SONG_PROGRESS, "0");
        }
    }
    if (song.url) {
        isLoading = true;
        loadLyrics(song);
        // If there is progress pending restoration, do not reset it to 0 yet, to avoid the progress bar jumping
        if (pendingProgress > 0) {
            currentTime = pendingProgress;
        } else {
            audio.currentTime = 0;
            currentTime = 0;
        }
        duration = song.duration ?? 0;
        audio.removeEventListener("canplay", handleLoadSuccess);
        audio.removeEventListener("error", handleLoadError);
        audio.removeEventListener("loadstart", handleLoadStart);
        audio.addEventListener("canplay", handleLoadSuccess, { once: true });
        audio.addEventListener("error", handleLoadError, { once: true });
        audio.addEventListener("loadstart", handleLoadStart, { once: true });
        audio.src = getAssetPath(song.url);
        audio.load();
    } else {
        isLoading = false;
    }
}

let autoplayFailed = $state(false);

function handleLoadSuccess() {
    isLoading = false;
    if (audio?.duration && audio.duration > 1) {
        duration = Math.floor(audio.duration);
        if (playlist[currentIndex]) playlist[currentIndex].duration = duration;
        currentSong.duration = duration;
    }
    // Restore progress
    if (pendingProgress > 0 && audio) {
        // Ensure the progress does not exceed the total duration
        const targetTime = Math.min(pendingProgress, duration > 0 ? duration : Infinity);
        audio.currentTime = targetTime;
        currentTime = targetTime;
        pendingProgress = 0; // clear after restoring
    }
    // If in autoplay mode, or currently playing (e.g. switching songs), try to play
    if (isAutoplayEnabled || isPlaying || shouldPlay) {
        const playPromise = audio?.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                fadeInVolume(volume);
                // After playback starts, clear the autoplay flag; from then on the user controls it
                isAutoplayEnabled = false;
                autoplayFailed = false;
                shouldPlay = false;
            }).catch((error) => {
                showErrorMessage(i18n(Key.musicAutoplayBlocked));
                autoplayFailed = true;
                // Ensure the UI state shows paused
                isPlaying = false;
                shouldPlay = false;
            });
        }
    }
}

function handleUserInteraction() {
    // If autoplay fails and playback has not started, try to play on user interaction
    if (autoplayFailed && audio && !isPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                fadeInVolume(volume);
                autoplayFailed = false;
            }).catch(() => {});
        }
    }
}

function handleLoadError(event: Event) {
    isLoading = false;
    showErrorMessage(i18n(Key.musicPlayFailed).replace("{0}", currentSong.title));
    if (playlist.length > 1) setTimeout(() => nextSong(), 1000);
    else showErrorMessage(i18n(Key.musicNoSongsAvailable));
}

function handleLoadStart() {}

function hideError() {
    showError = false;
}

function setProgress(event: MouseEvent) {
    if (!audio || !progressBar) return;
    const rect = progressBar.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    audio.currentTime = newTime;
    currentTime = newTime;
}

let isVolumeDragging = $state(false);
let isMouseDown = $state(false);
let volumeBarRect: DOMRect | null = $state(null);
let rafId: number | null = $state(null);

function startVolumeDrag(event: MouseEvent) {
    if (!volumeBar) return;
    isMouseDown = true;
    volumeBarRect = volumeBar.getBoundingClientRect();
    updateVolumeLogic(event.clientX);
}

function handleVolumeMove(event: MouseEvent) {
    if (!isMouseDown) return;
    isVolumeDragging = true;
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
        updateVolumeLogic(event.clientX);
        rafId = null;
    });
}

function stopVolumeDrag() {
    isMouseDown = false;
    isVolumeDragging = false;
    volumeBarRect = null;
    if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }
}

function updateVolumeLogic(clientX: number) {
    if (!audio || !volumeBar) return;
    if (fadeInterval) {
        clearInterval(fadeInterval);
        fadeInterval = null;
    }
    const rect = volumeBarRect || volumeBar.getBoundingClientRect();
    const percent = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width),
    );
    volume = percent;
    audio.volume = volume;
    isMuted = volume === 0;
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.VOLUME, String(volume));
    }
}

function toggleMute() {
    if (!audio) return;
    if (fadeInterval) {
        clearInterval(fadeInterval);
        fadeInterval = null;
    }
    isMuted = !isMuted;
    audio.muted = isMuted;
}

function handleAudioEvents() {
    if (!audio) return;
    audio.addEventListener("play", () => {
        isPlaying = true;
        autoplayFailed = false;
        isAutoplayEnabled = false;
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(STORAGE_KEYS.USER_PAUSED, "false");
        }
    });
    audio.addEventListener("pause", () => {
        isPlaying = false;
        // Note: do not set userPaused to true here, because the audio ending or switching can also trigger pause. (Only togglePlay explicitly records the user's pause action.)
    });
    audio.addEventListener("timeupdate", () => {
        if (!audio) return;
        currentTime = audio.currentTime;
        updateLyrics(currentTime);
        // Save progress every 2.1 seconds, or when the song is near the end (the end may not need to be remembered, but just in case)
        const now = Date.now();
        if (now - lastSaveTime > 2100) {
            if (typeof localStorage !== 'undefined' && currentSong.id !== 0) {
                localStorage.setItem(STORAGE_KEYS.LAST_SONG_PROGRESS, String(currentTime));
                lastSaveTime = now;
            }
        }
    });
    audio.addEventListener("ended", () => {
        if (!audio) return;
        // Song ended; reset the saved progress
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(STORAGE_KEYS.LAST_SONG_PROGRESS, "0");
        }
        // On single-track loop, reset the progress to the start
        if (isRepeating === 1) {
            audio.currentTime = 0;
            audio.play().then(() => {
                fadeInVolume(volume);
            }).catch(() => {});
        } else if (
            isRepeating === 2 ||
            isShuffled ||
            (isRepeating === 0 && currentIndex < playlist.length - 1)
        ) {
            nextSong();
        } else {
            isPlaying = false;
        }
    });
    audio.addEventListener("error", (event) => {
        isLoading = false;
    });
    audio.addEventListener("stalled", () => {});
    audio.addEventListener("waiting", () => {});
}

const interactionEvents = ['click', 'keydown', 'touchstart'];

onMount(() => {
    // Read the user's preferences from the cache
    if (typeof localStorage !== 'undefined') {
        const userPaused = localStorage.getItem(STORAGE_KEYS.USER_PAUSED) === "true";
        if (userPaused) {
            isAutoplayEnabled = false;
        }
        const savedVolume = localStorage.getItem(STORAGE_KEYS.VOLUME);
        if (savedVolume !== null) {
            volume = parseFloat(savedVolume);
        }
        const savedShuffle = localStorage.getItem(STORAGE_KEYS.SHUFFLE);
        if (savedShuffle !== null) {
            isShuffled = savedShuffle === "true";
        }
        const savedRepeat = localStorage.getItem(STORAGE_KEYS.REPEAT);
        if (savedRepeat !== null) {
            isRepeating = parseInt(savedRepeat);
        }
    }

    audio = new Audio();
    audio.volume = volume;
    handleAudioEvents();
    interactionEvents.forEach(event => {
        document.addEventListener(event, handleUserInteraction, { capture: true });
    });
    if (!musicPlayerConfig.enable) {
        return;
    }
    if (mode === "meting") {
        fetchMetingPlaylist();
    } else {
        // Use the local playlist, do not send any API requests
        playlist = [...(musicPlayerConfig.local?.playlist ?? [])];
        if (playlist.length > 0) {
            setTimeout(() => {
                restoreLastSong();
            }, 0);
        } else {
            showErrorMessage(i18n(Key.musicEmptyPlaylist));
        }
    }
});

onDestroy(() => {
    if (fadeInterval) {
        clearInterval(fadeInterval);
        fadeInterval = null;
    }
    if (typeof document !== 'undefined') {
        interactionEvents.forEach(event => {
            document.removeEventListener(event, handleUserInteraction, { capture: true });
        });
    }
    if (audio) {
        audio.pause();
        audio.src = "";
    }
});
</script>

<svelte:window
    onmousemove={handleVolumeMove}
    onmouseup={stopVolumeDrag}
/>

{#if musicPlayerConfig.enable}
{#if showError}
<div class="music-player-error fixed bottom-20 right-4 z-60 max-w-sm onload-animation-up">
    <div class="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-up">
        <Icon icon="material-symbols:error" class="text-xl shrink-0" />
        <span class="text-sm flex-1">{errorMessage}</span>
        <button onclick={hideError} class="text-white/80 hover:text-white transition-colors">
            <Icon icon="material-symbols:close" class="text-lg" />
        </button>
    </div>
</div>
{/if}

<div class="music-player fixed bottom-4 right-4 z-101 transition-all duration-300 ease-in-out onload-animation-up flex flex-col items-end pointer-events-none"
     class:expanded={!isCollapsed}
     class:collapsed={isCollapsed}>
    {#if showPlaylist}
        <div class="playlist-panel float-panel w-80 max-h-96 overflow-hidden z-50 mb-4 pointer-events-auto"
             transition:slide={{ duration: 300, axis: 'y' }}>
            <div class="playlist-header flex items-center justify-between p-4 border-b border-(--line-divider)">
                <h3 class="text-lg font-semibold text-90">{i18n(Key.playlist)}</h3>
                <div class="flex items-center gap-1">
                    {#if mode === "meting"}
                        <button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"
                                onclick={fetchMetingPlaylist}
                                disabled={isLoading}
                                title={i18n(Key.musicRefresh)}>
                            {#if isLoading}
                                <Icon icon="eos-icons:loading" class="text-lg" />
                            {:else}
                                <Icon icon="material-symbols:refresh" class="text-lg" />
                            {/if}
                        </button>
                    {/if}
                    <button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center" onclick={togglePlaylist}>
                        <Icon icon="material-symbols:close" class="text-lg" />
                    </button>
                </div>
            </div>
            <div class="playlist-content overflow-y-auto max-h-80">
                {#each playlist as song, index}
                    <div class="playlist-item flex items-center gap-3 p-3 hover:bg-(--btn-plain-bg-hover) cursor-pointer transition-colors"
                        class:bg-(--btn-plain-bg)={index === currentIndex}
                        class:text-(--primary)={index === currentIndex}
                        onclick={() => playSong(index)}
                        onkeydown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                playSong(index);
                            }
                        }}
                        role="button"
                        tabindex="0"
                        aria-label="Play {song.title} - {song.artist}">
                        <div class="w-6 h-6 flex items-center justify-center">
                            {#if index === currentIndex && isPlaying}
                                <Icon icon="material-symbols:graphic-eq" class="text-(--primary) animate-pulse" />
                            {:else if index === currentIndex}
                                <Icon icon="material-symbols:pause" class="text-(--primary)" />
                            {:else}
                                <span class="text-sm text-(--content-meta)">{index + 1}</span>
                            {/if}
                        </div>
                        <!-- The cover inside the playlist remains a rounded rectangle -->
                        <div class="w-10 h-10 rounded-lg overflow-hidden shrink-0 shadow-sm">
                            <img src={getAssetPath(song.cover)} alt={song.title} class="w-full h-full object-cover" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="font-medium truncate" class:text-(--primary)={index === currentIndex} class:text-90={index !== currentIndex}>
                                {song.title}
                            </div>
                            <div class="text-sm text-(--content-meta) truncate" class:text-(--primary)={index === currentIndex}>
                                {song.artist}
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
    <!-- Small ball in the collapsed state -->
    <div class="orb-player w-12 h-12 bg-(--primary) rounded-full shadow-lg cursor-pointer transition-all duration-500 ease-in-out flex items-center justify-center hover:scale-110 active:scale-95"
         class:opacity-0={!isCollapsed}
         class:scale-0={!isCollapsed}
         class:pointer-events-auto={isCollapsed}
         class:pointer-events-none={!isCollapsed}
         onclick={toggleCollapse}
         onkeydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleCollapse();
            }
         }}
         role="button"
         tabindex="0"
         aria-label={i18n(Key.musicExpand)}>
        {#if isLoading}
            <Icon icon="eos-icons:loading" class="text-white text-lg" />
        {:else if isPlaying}
            <div class="flex space-x-0.5">
                <div class="w-0.5 h-3 bg-white rounded-full animate-pulse"></div>
                <div class="w-0.5 h-4 bg-white rounded-full animate-pulse" style="animation-delay: 150ms;"></div>
                <div class="w-0.5 h-2 bg-white rounded-full animate-pulse" style="animation-delay: 300ms;"></div>
            </div>
        {:else}
            <Icon icon="material-symbols:music-note" class="text-white text-lg" />
        {/if}
    </div>
    <!-- Full player in the expanded state (circular cover) -->
    <div class="expanded-player card-base bg-(--float-panel-bg) shadow-xl rounded-2xl p-4 transition-all duration-500 ease-in-out"
         class:opacity-0={isCollapsed}
         class:scale-95={isCollapsed}
         class:pointer-events-auto={!isCollapsed}
         class:pointer-events-none={isCollapsed}>
        <div class="flex items-center gap-4 mb-4">
            <div class="cover-container relative w-16 h-16 rounded-full overflow-hidden shrink-0">
                <img src={getAssetPath(currentSong.cover)} alt="Cover"
                     class="w-full h-full object-cover transition-transform duration-300"
                     class:spinning={isPlaying && !isLoading}
                     class:animate-pulse={isLoading} />
            </div>
            <div class="flex-1 min-w-0">
                <div class="song-title text-lg font-bold text-90 truncate mb-1">{currentSong.title}</div>
                <div class="song-artist text-sm text-50 truncate">{currentSong.artist}</div>
                <div class="text-xs text-30 mt-1">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </div>
            </div>
            <div class="flex items-center gap-1">
                <button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"
                        onclick={toggleMode}
                        title={mode === "meting" ? i18n(Key.musicSwitchToLocal) : i18n(Key.musicSwitchToMeting)}>
                    <Icon icon={mode === "meting" ? "material-symbols:cloud" : "material-symbols:folder"} class="text-lg" />
                </button>
                <button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"
                        class:text-(--primary)={showPlaylist}
                        onclick={togglePlaylist}
                        title={i18n(Key.playlist)}>
                    <Icon icon="material-symbols:queue-music" class="text-lg" />
                </button>
            </div>
        </div>
        {#if showLyrics}
        <div class="lyrics-section mb-2 px-1" transition:slide={{ duration: 300 }}>
            <div class="lyrics-container h-[88px] overflow-y-auto overflow-x-hidden relative text-center scroll-smooth"
                 bind:this={lrcContainer}
                 onscroll={handleLrcScroll}>
                {#if noLyrics}
                    <div class="h-full flex items-center justify-center text-sm text-30">
                        No lyrics
                    </div>
                {:else if lyrics.length === 0}
                     <div class="h-full flex items-center justify-center text-sm text-30">
                        Loading lyrics...
                    </div>
                {:else}
                    <div class="py-8">
                        {#each lyrics as line, index}
                            <button class="lyric-line w-full block text-sm py-1 transition-all duration-300 cursor-pointer hover:opacity-100 bg-transparent border-none p-0 focus:outline-none"
                               onclick={() => seekToLyric(line.time)}
                               class:text-(--primary)={index === currentLrcIndex}
                               class:font-bold={index === currentLrcIndex}
                               class:scale-105={index === currentLrcIndex}
                               class:text-50={index !== currentLrcIndex}
                               class:opacity-60={index !== currentLrcIndex}
                               title="Jump to this line">
                                {line.text}
                            </button>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>
        {/if}
        <div class="progress-section mb-4">
            <div class="progress-bar flex-1 h-2 bg-(--btn-regular-bg) rounded-full cursor-pointer"
                bind:this={progressBar}
                onclick={setProgress}
                onkeydown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const rect = progressBar?.getBoundingClientRect();
                        if (rect) {
                            const percent = 0.5;
                            const newTime = percent * duration;
                            if (audio) {
                                audio.currentTime = newTime;
                                currentTime = newTime;
                            }
                        }
                    }
                }}
                role="slider"
                tabindex="0"
                aria-label={i18n(Key.musicProgress)}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={duration > 0 ? (currentTime / duration * 100) : 0}>
                <div class="h-full bg-(--primary) rounded-full transition-all duration-100"
                    style="width: {duration > 0 ? (currentTime / duration) * 100 : 0}%">
                </div>
            </div>
        </div>
        <div class="controls flex items-center justify-center gap-2 mb-4">
            <!-- Playback mode toggle button -->
            <button class="w-10 h-10 rounded-lg btn-plain"
                    onclick={togglePlaybackMode}
                    title={isRepeating === 1 ? i18n(Key.musicRepeatOne) : (isShuffled ? i18n(Key.musicShuffle) : i18n(Key.musicRepeatAll))}>
                {#if isRepeating === 1}
                    <Icon icon="material-symbols:repeat-one" class="text-lg" />
                {:else if isShuffled}
                    <Icon icon="material-symbols:shuffle" class="text-lg" />
                {:else}
                    <Icon icon="material-symbols:repeat" class="text-lg" />
                {/if}
            </button>
            <button class="btn-plain w-10 h-10 rounded-lg" onclick={previousSong}
                    disabled={playlist.length <= 1}>
                <Icon icon="material-symbols:skip-previous" class="text-xl" />
            </button>
            <button class="btn-regular w-12 h-12 rounded-full"
                    class:opacity-50={isLoading}
                    disabled={isLoading}
                    onclick={togglePlay}>
                {#if isLoading}
                    <Icon icon="eos-icons:loading" class="text-xl" />
                {:else if isPlaying}
                    <Icon icon="material-symbols:pause" class="text-xl" />
                {:else}
                    <Icon icon="material-symbols:play-arrow" class="text-xl" />
                {/if}
            </button>
            <button class="btn-plain w-10 h-10 rounded-lg" onclick={nextSong}
                    disabled={playlist.length <= 1}>
                <Icon icon="material-symbols:skip-next" class="text-xl" />
            </button>
            <!-- Lyrics display toggle button -->
            <button class="w-10 h-10 rounded-lg btn-plain"
                    onclick={toggleLyrics}
                    title="Toggle lyrics display">
                <Icon icon="material-symbols:lyrics" class="text-lg {showLyrics ? 'text-(--primary)' : 'opacity-90'}" />
            </button>
        </div>
        <div class="bottom-controls flex items-center gap-2">
            <button class="btn-plain w-8 h-8 rounded-lg" onclick={toggleMute}>
                {#if isMuted || volume === 0}
                    <Icon icon="material-symbols:volume-off" class="text-lg" />
                {:else if volume < 0.5}
                    <Icon icon="material-symbols:volume-down" class="text-lg" />
                {:else}
                    <Icon icon="material-symbols:volume-up" class="text-lg" />
                {/if}
            </button>
            <div class="flex-1 h-2 bg-(--btn-regular-bg) rounded-full cursor-pointer"
                bind:this={volumeBar}
                onmousedown={startVolumeDrag}
                onkeydown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (e.key === 'Enter') toggleMute();
                    }
                }}
                role="slider"
                tabindex="0"
                aria-label={i18n(Key.musicVolume)}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={volume * 100}>
                <div class="h-full bg-(--primary) rounded-full transition-all"
                    class:duration-100={!isVolumeDragging}
                    class:duration-0={isVolumeDragging}
                    style="width: {volume * 100}%">
                </div>
            </div>
            <button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"
                    onclick={toggleCollapse}
                    title={i18n(Key.musicCollapse)}>
                <Icon icon="material-symbols:expand-more" class="text-lg" />
            </button>
        </div>
    </div>
</div>

{/if}