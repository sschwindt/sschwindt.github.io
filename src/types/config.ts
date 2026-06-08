import type {
    SYSTEM_MODE,
    DARK_MODE,
    LIGHT_MODE,
    WALLPAPER_FULLSCREEN,
    WALLPAPER_BANNER,
    WALLPAPER_NONE
} from "@constants/constants";


/**
 * 
 */

// Analytics configuration
export type AnalyticsConfig = {
    enabled: boolean;
    platform: "umami";
    umami: {
        apiKey: string;
        baseUrl: string;
        code: string;
    };
};

/**
 * 
 */

// Favicon configuration
export type Favicon = {
    src: string;
    theme?: "light" | "dark";
    sizes?: string;
};


// Loading page configuration
export type LoadingOverlayConfig = {
    // Whether to enable the loading page
    enable: boolean;
    // Whether to wait for all resources to finish loading; if false, the loading page is closed immediately after the DOM is parsed
    waitForAllResources: boolean;
    // Loading title configuration
    title: {
        // Whether to enable the loading title
        enable: boolean;
        // Loading title text
        content: string;
        // Animation cycle (s)
        interval: number;
    };
    // Loading animation configuration
    spinner: {
        // Whether to enable the loading animation
        enable: boolean;
        // Animation cycle (s)
        interval: number;
    };
};


// Site configuration
export type SiteConfig = {
    // Site URL (ending with a slash) 
    siteURL: string;
    // Site title
    title: string;
    // Site subtitle
    subtitle: string;
    // Site keywords, used to generate <meta name="keywords">
    keywords?: string[];
    // Language configuration
    lang: "zh" | "en" | "ko" | "ja" | "es" | "th" | "vi" | "tr" | "id" | "fr" | "de" | "ru" | "ar";
    // Translation configuration
    translate?: {
        // Enable the translation feature
        enable: boolean;
        // Translation service type, e.g. 'client.edge'
        service?: string;
        // Show the language selection dropdown
        showSelectTag?: boolean;
        // Auto-detect the user's language
        autoDiscriminate?: boolean;
        // CSS class names to ignore when translating
        ignoreClasses?: string[];
        // HTML tags to ignore when translating
        ignoreTags?: string[];
    };
    // Time zone configuration
    timeZone: -12 | -11 | -10 | -9 | -8 | -7 | -6 | -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    // Font configuration
    font: {
        [key: string]: {
            // Font source (font CSS link | font file path)
            src: string;
            // Font name (font-family)
            family: string;
        };
    };
    // Theme color configuration
    themeColor: {
        // Default hue of the theme color (0-360)
        hue: number;
    };
    // Default theme
    defaultTheme: "system" | "light" | "dark";
    // Wallpaper configuration
    wallpaper: {
        // Mode
        mode: "fullscreen" | "banner" | "none";
        src: // Image source config (shared by the fullscreen and banner modes) 
        | string
        | string[]
        | {
            desktop?: string | string[];
            mobile?: string | string[];
        };
        // Wallpaper position, equivalent to object-position
        position?: "top" | "center" | "bottom";
        // Carousel config (shared by the fullscreen and banner modes)
        carousel?: {
            // Enable the carousel for multiple images, otherwise show a random one
            enable: boolean;
            // Carousel interval (s) 
            interval: number;
            // Enable the Ken Burns effect
            kenBurns?: boolean;
        };
        // Banner-mode-specific configuration
        banner?: {
            homeText?: {
                // Show text on the home page
                enable: boolean;
                // Main title
                title?: string;
                // Subtitle
                subtitle?: string | string[]; // accepts a single string or an array of strings
                // Subtitle typewriter effect
                typewriter?: {
                    // Enable the subtitle typewriter effect
                    enable: boolean;
                    // Typing speed (ms)
                    speed: number;
                    // Deletion speed (ms)
                    deleteSpeed: number;
                    // Pause time after fully shown (ms)
                    pauseTime: number;
                };
            };
            // Banner image source/credit text
            credit?: {
                // Show the banner image source text
                enable: boolean;
                // The source text to display
                text: string;
                // (optional) URL link to the original artwork or artist page
                url?: string;
            };
            // Navbar configuration
            navbar?: {
                // Navbar transparency mode
                transparentMode?: "semi" | "full" | "semifull";
            };
            // Water ripple effect configuration
            waves?: {
                // Enable the water ripple effect
                enable: boolean;
                // Enable performance mode (simplifies the wave effect to improve performance)
                performanceMode?: boolean;
            };
        };
        // Fullscreen-mode-specific configuration
        fullscreen?: {
            // z-index / layer
            zIndex?: number;
            // Wallpaper opacity, between 0 and 1
            opacity?: number;
            // Background blur amount (px)
            blur?: number;
            // Navbar transparency mode
            navbar?: {
                transparentMode?: "semi" | "full" | "semifull";
            };
        };
    };
    // Loading page configuration
    loadingOverlay?: LoadingOverlayConfig;
    // Favicon configuration
    favicon: Favicon[];
    // Bangumi configuration
    bangumi?: {
        // User ID
        userId?: string;
    };
    // OpenGraph configuration
    generateOgImages: boolean;
};

/**
 * 
 */

export type LIGHT_DARK_MODE =
    | typeof LIGHT_MODE
    | typeof DARK_MODE
    | typeof SYSTEM_MODE;


export type WALLPAPER_MODE =
    | typeof WALLPAPER_FULLSCREEN
    | typeof WALLPAPER_BANNER
    | typeof WALLPAPER_NONE;

/**
 * 
 */

export enum LinkPreset {
    Home = 0,
    Archive = 1,
    Projects = 2,
    Skills = 3,
    Timeline = 4,
    Diary = 5,
    Albums = 6,
    Anime = 7,
    About = 8,
    Friends = 9,
}


export type NavbarLink = {
    // Link name
    name: string;
    // Link
    url: string;
    // Whether it is an external link
    external?: boolean;
    // Link icon
    icon?: string;
    // Intermediate-page description
    description?: string;
    // Sub-links, can be NavbarLink or LinkPreset
    children?: (NavbarLink | LinkPreset)[];
};


// Navbar configuration
export type NavbarConfig = {
    // Link configuration
    links: (NavbarLink | LinkPreset)[]; // Supports multi-level menus
};

/**
 * 
 */

export type WidgetComponentType =
    | "profile"
    | "announcement"
    | "directory"
    | "categories"
    | "tags"
    | "statistics"
    | "toc"
    | "custom";


export type WidgetComponentConfig = {
    // Component type
    type: WidgetComponentType;
    // Enable this component
    enable: boolean;
    // Component position
    position: "top" | "sticky"; // Top fixed area or sticky area
    // Custom inline styles
    style?: string;
    // Page visibility configuration
    visibility?: {
        // Match mode: 'include' or 'exclude'
        mode: "include" | "exclude";
        // List of page-path matching rules (supports regex strings)
        paths: string[];
    };
    // Responsive configuration
    responsive?: {
        // Hide on the specified devices
        hidden?: ("mobile" | "tablet" | "desktop")[];
        // Collapse threshold
        collapseThreshold?: number;
    };
    // Directory depth (only for the toc and categories components)
    depth?: number;
};


// Profile configuration
export type ProfileConfig = {
    // Avatar configuration
    avatar?: string;
    // Info configuration
    name: string;
    // Bio configuration
    bio?: string;
    // Links configuration
    links: {
        name: string;
        url: string;
        icon: string;
    }[];
};


// Announcement configuration
export type AnnouncementConfig = {
    // Announcement title
    title?: string;
    // Announcement content
    content: string;
    // Announcement type
    type?: "info" | "warning" | "success" | "error";
    // Announcement icon
    icon?: string;
    // Allow users to dismiss the announcement
    closable?: boolean;
    // Links configuration
    link?: {
        // Enable the link
        enable: boolean;
        // Link text
        text: string;
        // Link URL
        url: string;
        // Whether it's an external link
        external?: boolean;
    };
};


// Sidebar configuration
export type SidebarConfig = {
    // List of sidebar component configurations
    components: {
        left: WidgetComponentConfig[];
        right: WidgetComponentConfig[];
    };
};

/**
 * 
 */

export type BlogPostData = {
    body: string;
    title: string;
    published: Date;
    description: string;
    tags: string[];
    draft?: boolean;
    image?: string;
    category?: string;
    pinned?: boolean;
    prevTitle?: string;
    prevSlug?: string;
    nextTitle?: string;
    nextSlug?: string;
};


// Post configuration
export type PostConfig = {
    // Post card configuration
    card: {
        // Cover configuration
        cover: {
            // Cover position ("left" | "right")
            side: "left" | "right";
            // Cover width
            width: string;
            // Whether to show text on the cover (title, tags, excerpt)
            showContent: boolean;
        };
    };
    // Show the "last edited" card
    showLastModified: boolean;
    // Code highlighting configuration
    expressiveCode: {
        // Theme
        theme: string;
    };
    // License configuration
    license: {
        // Enable the license
        enable: boolean;
        // License name
        name: string;
        // License URL
        url: string;
    };
    // Comment configuration
    comment: {
        // Enable comments
        enable: boolean;
        // Twikoo comment system configuration
        twikoo?: {
            // Environment ID
            envId: string;
            // Region
            region?: string;
            // Language
            lang?: string;
        };
    };
};

/**
 * 
 */

// Footer configuration
export type FooterConfig = {
    // Whether to enable Footer HTML injection
    enable: boolean;
    // Custom HTML content, used to add things like ICP license numbers
    customHtml?: string;
};

/**
 * 
 */

// Particle effect configuration
export type ParticleConfig = {
    // Enable the particle effect
    enable: boolean;
    // Number of particles
    particleNum: number;
    // Particle out-of-bounds limit; -1 means infinite loop
    limitTimes: number;
    // Particle size configuration
    size: {
        // Particle minimum size multiplier
        min: number;
        // Particle maximum size multiplier
        max: number;
    };
    // Particle opacity configuration
    opacity: {
        // Particle minimum opacity
        min: number;
        // Particle maximum opacity
        max: number;
    };
    // Particle movement speed configuration
    speed: {
        // Horizontal movement speed
        horizontal: {
            // Minimum value
            min: number;
            // Maximum value
            max: number;
        };
        // Vertical movement speed
        vertical: {
            // Minimum value
            min: number;
            // Maximum value
            max: number;
        };
        // Rotation speed
        rotation: number;
        // Fade-out speed
        fadeSpeed: number;
    };
    // Particle z-index
    zIndex: number;
};

/**
 * 
 */

export type MusicPlayerTrack = {
    // Index number
    id: number | string;
    // Title
    title: string;
    // Author
    artist: string;
    // Cover
    cover: string;
    // Path
    url: string;
    // Lyrics
    lrc?: string;
    // Duration
    duration: number;
};


// Music player configuration
export type MusicPlayerConfig = {
    // Enable the music player
    enable: boolean;
    // Default mode
    mode: "meting" | "local";
    // meting mode-specific configuration
    meting: {
        // Meting API URL
        meting_api: string;
        // Music platform
        server: "netease" | "tencent" | "kugou" | "baidu" | "kuwo";
        // Type
        type: "playlist" | "album" | "artist" | "song" | "search";
        // Resource ID
        id: string;
    };
    // local mode-specific configuration
    local: {
        // Playlist
        playlist: MusicPlayerTrack[];
    };
    // Whether to autoplay
    autoplay?: boolean;
};

/**
 * 
 */

// Mascot (live2d) configuration
export type PioConfig = {
    // Enable the mascot
    enable: boolean;
    // Model file path
    models?: string[];
    // Mascot position
    position?: "left" | "right";
    // Mascot width
    width?: number;
    // Mascot height
    height?: number;
    // Display mode
    mode?: "static" | "fixed" | "draggable";
    // Whether to hide on mobile devices
    hiddenOnMobile?: boolean;
    // Dialog configuration
    dialog?: {
        // Welcome message
        welcome?: string | string[];
        // Touch hint
        touch?: string | string[];
        // Home page hint
        home?: string;
        // Outfit-change hint
        skin?: [string, string]; // [before switch, after switch]
        // Close hint
        close?: string;
        // About link
        link?: string;
        // Custom properties
        custom?: Array<{
            // CSS selector
            selector: string;
            // Type
            type: "read" | "link";
            // Custom text
            text?: string;
        }>;
    };
};