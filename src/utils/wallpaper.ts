import {
    WALLPAPER_FULLSCREEN,
    WALLPAPER_BANNER,
    WALLPAPER_NONE,
} from "@constants/constants";
import type {
    WALLPAPER_MODE,
} from "@/types/config";
import {
    siteConfig,
} from "@/config";


// Declare global function types for carousel initializers
declare global {
    interface Window {
        initBannerCarousel?: () => void;
        initFullscreenWallpaperCarousel?: () => void;
        initSemifullScrollDetection?: () => void;
        bannerCarouselState?: {
            currentIndex: number;
            lastSwitchTime: number;
        };
        fullscreenWallpaperState?: {
            currentIndex: number;
            lastSwitchTime: number;
        };
        bannerCarouselTimer?: any;
        fullscreenWallpaperTimer?: any;
        currentBannerCarousel?: HTMLElement | null;
        currentFullscreenWallpaperCarousel?: HTMLElement | null;
    }
}


// Function to get navbar transparent mode for wallpaper mode
export function getNavbarTransparentModeForWallpaperMode(mode: WALLPAPER_MODE): string {
    if (mode === WALLPAPER_FULLSCREEN) {
        return siteConfig.wallpaper.fullscreen?.navbar?.transparentMode || "semi";
    }
    if (mode === WALLPAPER_BANNER) {
        return siteConfig.wallpaper.banner?.navbar?.transparentMode || "semifull";
    }
    return "semi"; // Use the default semi mode for other cases
}

// Cache for elements
const getElements = () => {
    if (typeof document === 'undefined') return {
        navbar: null,
        bannerWrapper: null,
        banner: null,
        fullscreenContainer: null,
        mainContent: null,
    };
    return {
        navbar: document.getElementById('navbar'),
        bannerWrapper: document.getElementById('banner-wrapper'),
        banner: document.getElementById('banner'),
        fullscreenContainer: document.querySelector('[data-fullscreen-wallpaper]') as HTMLElement,
        mainContent: document.querySelector('.absolute.w-full.z-30') as HTMLElement,
    };
};

// Helper to safely execute after a delay if mode hasn't changed
function runIfMode(mode: WALLPAPER_MODE, callback: () => void, delay = 600) {
    setTimeout(() => {
        if (typeof document !== 'undefined' && document.documentElement.getAttribute('data-wallpaper-mode') === mode) {
            callback();
        }
    }, delay);
}

// Function to adjust main content position based on wallpaper mode
function adjustMainContentPosition(mode: WALLPAPER_MODE | 'banner' | 'none' | 'fullscreen') {
    const { mainContent } = getElements();
    if (!mainContent) return;
    // Remove existing position classes
    mainContent.classList.remove('no-banner-layout');
    // Remove inline styles to let CSS variables take over
    mainContent.style.top = '';
    // Add new position classes based on mode
    switch (mode) {
        case WALLPAPER_BANNER:
        case 'banner':
            // Position is handled by CSS based on .enable-banner class
            break;
        case WALLPAPER_FULLSCREEN:
        case 'fullscreen':
        case WALLPAPER_NONE:
        case 'none':
            mainContent.classList.add('no-banner-layout');
            // Position is handled by CSS
            break;
        default:
            break;
    }
}

// Function to update navbar transparency based on wallpaper mode
function updateNavbarTransparency(mode: WALLPAPER_MODE) {
    const { navbar } = getElements();
    if (!navbar) return;
    // Get the transparency mode config based on the current wallpaper mode
    const transparentMode = getNavbarTransparentModeForWallpaperMode(mode);
    // Update the navbar's transparency mode attribute
    navbar.setAttribute('data-transparent-mode', transparentMode);
    // Re-initialize semi-transparent mode scroll detection (if needed)
    if (transparentMode === 'semifull' && typeof window.initSemifullScrollDetection === 'function') {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => window.initSemifullScrollDetection!());
        } else {
            setTimeout(() => window.initSemifullScrollDetection!(), 0);
        }
    }
}

// Helper to initialize banner elements
function initBannerElements(banner: HTMLElement | null) {
    if (!banner) return;
    banner.classList.remove('opacity-0');
    banner.classList.add('opacity-100');

    // Handle mobile banner
    const mobileBanner = document.querySelector('.block.md\\:hidden[alt="Mobile banner"]');
    if (mobileBanner) {
        mobileBanner.classList.remove('opacity-0');
        mobileBanner.classList.add('opacity-100');
    }
}

// Function to show banner mode wallpaper
function showBannerMode() {
    const { bannerWrapper, fullscreenContainer, banner } = getElements();
    // Hide the fullscreen wallpaper (controlled via CSS class)
    if (fullscreenContainer) {
        fullscreenContainer.style.opacity = '0';
        runIfMode(WALLPAPER_BANNER, () => {
            fullscreenContainer.classList.add('hidden');
        });
    }
    // Show the banner
    if (!bannerWrapper) {
        requestAnimationFrame(showBannerMode);
        return;
    }
    const isAlreadyVisible = typeof document !== 'undefined' && !bannerWrapper.classList.contains('hidden') && !document.documentElement.classList.contains('banner-hiding');
    if (!isAlreadyVisible && typeof document !== 'undefined') {
        // If it is currently hiding, remove the hidden class first
        document.documentElement.classList.remove('banner-hiding');
        // Add the transition class to html
        document.documentElement.classList.add('banner-transitioning');
        // Remove hidden
        bannerWrapper.classList.remove('hidden');
        // Force a reflow
        void bannerWrapper.offsetHeight;
        // Remove the transition class
        document.documentElement.classList.remove('banner-transitioning');
        // Add the show animation class
        document.documentElement.classList.add('show-banner-animation');
        setTimeout(() => {
            document.documentElement.classList.remove('show-banner-animation');
        }, 1200);
    }
    // Ensure the banner is visible
    bannerWrapper.classList.remove('opacity-0');
    bannerWrapper.classList.add('opacity-100');
    // Initialize carousel or static banner
    if (typeof window.initBannerCarousel === 'function') {
        window.initBannerCarousel();
    } else {
        setTimeout(() => {
            initBannerElements(banner);
        }, 100);
    }
}

// Function to show fullscreen mode wallpaper
function showFullscreenMode() {
    const { bannerWrapper, fullscreenContainer } = getElements();
    // Show fullscreen
    if (!fullscreenContainer) {
        requestAnimationFrame(showFullscreenMode);
        return;
    }
    fullscreenContainer.classList.remove('hidden');
    void fullscreenContainer.offsetHeight;
    fullscreenContainer.style.opacity = siteConfig.wallpaper.fullscreen?.opacity?.toString() || '0.8';
    // Hide the banner
    if (bannerWrapper) {
        if (typeof document !== 'undefined' && document.documentElement.classList.contains('banner-hiding')) {
            runIfMode(WALLPAPER_FULLSCREEN, () => {
                bannerWrapper.classList.add('hidden');
            });
        } else {
            bannerWrapper.classList.add('hidden');
        }
    }
}

// Function to show none mode wallpaper
function showNoneMode() {
    const { bannerWrapper, fullscreenContainer } = getElements();
    // Hide the banner
    if (bannerWrapper) {
        bannerWrapper.classList.add('hidden');
    }
    // Hide fullscreen
    if (fullscreenContainer) {
        fullscreenContainer.style.opacity = '0';
        runIfMode(WALLPAPER_NONE, () => {
            fullscreenContainer.classList.add('hidden');
        });
    }
}

// Function to reinitialize components based on wallpaper mode
function reinitializeComponents(mode: WALLPAPER_MODE) {
    if (mode === WALLPAPER_BANNER) {
        setTimeout(() => {
            initBannerElements(getElements().banner);
        }, 100);
    }
}

// Function to apply wallpaper mode to document
export function applyWallpaperModeToDocument(mode: WALLPAPER_MODE, force = false) {
    if (typeof document === 'undefined') return;
    // Get the current wallpaper mode
    const currentMode = document.documentElement.getAttribute('data-wallpaper-mode') as WALLPAPER_MODE;
    // If the mode hasn't changed and this isn't a forced update, return early
    if (!force && currentMode === mode) {
        return;
    }
    // Update the data attribute
    document.documentElement.setAttribute('data-wallpaper-mode', mode);
    // Handle Banner exit transition
    if (currentMode === WALLPAPER_BANNER && mode !== WALLPAPER_BANNER) {
        document.documentElement.classList.add('banner-hiding');
        // The main content area starts sliding up
        adjustMainContentPosition(mode);
        // The navbar also updates its opacity immediately
        updateNavbarTransparency(mode);
        // Wait for the transition to finish before performing the actual mode switch
        setTimeout(() => {
            document.documentElement.classList.remove('banner-hiding');
            executeApply();
        }, 600);
        return;
    }

    // On initial load or forced update, we may need to run some logic immediately, or wait for the DOM to be ready
    const apply = () => {
        executeApply();
    };

    function executeApply() {
        const body = document.body;
        if (!body) {
            // If body isn't ready yet, retry later
            requestAnimationFrame(executeApply);
            return;
        }
        // Add the transition protection class
        document.documentElement.classList.add('is-wallpaper-transitioning');
        // Only remove wallpaper-transparent when the new mode doesn't need transparency
        const nextRequiresTransparency = mode === WALLPAPER_BANNER || mode === WALLPAPER_FULLSCREEN;
        if (!nextRequiresTransparency) {
            // Delay removal to match the background transition animation
            setTimeout(() => {
                const isStillTransitioning = document.documentElement.classList.contains('is-wallpaper-transitioning');
                const currentDataMode = document.documentElement.getAttribute('data-wallpaper-mode');
                const isNowTransparentMode = currentDataMode === WALLPAPER_BANNER || currentDataMode === WALLPAPER_FULLSCREEN;
                if (!isStillTransitioning || !isNowTransparentMode) {
                    body.classList.remove('wallpaper-transparent');
                }
            }, 300);
        } else {
            body.classList.add('wallpaper-transparent');
        }
        // Remove enable-banner; showBannerMode re-adds it (when switching to Banner mode)
        // If switching away from Banner, it is removed in executeApply
        if (mode !== WALLPAPER_BANNER) {
            body.classList.remove('enable-banner');
        } else {
            body.classList.add('enable-banner');
        }
        // Add the appropriate CSS class based on the mode
        switch (mode) {
            case WALLPAPER_BANNER:
                showBannerMode();
                break;
            case WALLPAPER_FULLSCREEN:
                showFullscreenMode();
                adjustMainContentTransparency(true);
                break;
            case WALLPAPER_NONE:
                showNoneMode();
                adjustMainContentTransparency(false);
                break;
        }
        // Adjust the main content position
        adjustMainContentPosition(mode);
        // Update the navbar transparency mode
        updateNavbarTransparency(mode);
        // Re-initialize related components
        reinitializeComponents(mode);
        // Remove the transition protection class after the transition finishes
        setTimeout(() => {
            document.documentElement.classList.remove('is-wallpaper-transitioning');
        }, 600);
    }
    // Use requestAnimationFrame to run on the next frame, avoiding flicker
    requestAnimationFrame(apply);
}

// Function to adjust main content transparency based on wallpaper mode
function adjustMainContentTransparency(enable: boolean) {
    const { mainContent } = getElements();
    if (!mainContent) return;
    // Add or remove transparent class based on enable flag
    if (enable) {
        mainContent.classList.add('wallpaper-transparent');
    } else {
        mainContent.classList.remove('wallpaper-transparent');
    }
}

// Function to set wallpaper mode and apply it to document
export function setWallpaperMode(mode: WALLPAPER_MODE): void {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('wallpaperMode', mode);
    }
    applyWallpaperModeToDocument(mode);
}

// Function to get default wallpaper mode from config-carrier
export function getDefaultWallpaperMode(): WALLPAPER_MODE {
    const fallback = siteConfig.wallpaper.mode;
    if (typeof document !== 'undefined') {
        const configCarrier = document.getElementById('config-carrier');
        return (configCarrier?.dataset.wallpaperMode as WALLPAPER_MODE) || fallback;
    }
    return fallback;
}

// Function to get stored wallpaper mode from local storage
export function getStoredWallpaperMode(): WALLPAPER_MODE {
    if (typeof localStorage !== 'undefined') {
        return (localStorage.getItem('wallpaperMode') as WALLPAPER_MODE) || getDefaultWallpaperMode();
    }
    return getDefaultWallpaperMode();
}

// Function to initialize wallpaper mode on page load
export function initWallpaperMode(): void {
    const storedMode = getStoredWallpaperMode();
    applyWallpaperModeToDocument(storedMode, true);
}