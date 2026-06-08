<script lang="ts">
import { onMount, onDestroy } from "svelte";

import { pioConfig } from "@/config";


// Convert the config into the format the Pio plugin expects
const pioOptions = {
    mode: pioConfig.mode,
    hidden: pioConfig.hiddenOnMobile,
    content: pioConfig.dialog || {},
    model: pioConfig.models || ["/pio/models/pio/model.json"],
};

// Global Pio instance reference
let pioInstance = $state<any>(null);
let pioInitialized = $state(false);
let pioContainer = $state<HTMLElement>();
let pioCanvas = $state<HTMLCanvasElement>();

// Styles are statically imported via base.astro, no dynamic loading needed

// Wait for the DOM to finish loading before initializing Pio
function initPio() {
    if (typeof window !== "undefined" && typeof (window as any).Paul_Pio !== "undefined") {
        try {
            // Ensure the DOM element exists
            if (pioContainer && pioCanvas && !pioInitialized) {
                const Paul_Pio = (window as any).Paul_Pio;
                pioInstance = new Paul_Pio(pioOptions);
                pioInitialized = true;
                console.log("Pio initialized successfully (Svelte)");
            } else if (!pioContainer || !pioCanvas) {
                console.warn("Pio DOM elements not found, retrying...");
                setTimeout(initPio, 100);
            }
        } catch (e) {
            console.error("Pio initialization error:", e);
        }
    } else {
        // If Paul_Pio is not defined yet, retry later
        setTimeout(initPio, 100);
    }
}

// Load the required scripts
function loadPioAssets() {
    if (typeof window === "undefined") return;

    // Styles are statically imported via base.astro

    // Load JS scripts
    const loadScript = (src: string, id: string) => {
        return new Promise<void>((resolve, reject) => {
            if (document.querySelector(`#${id}`)) {
                resolve();
                return;
            }
            const script = document.createElement("script");
            script.id = id;
            script.src = src;
            script.onload = () => resolve();
            script.onerror = reject;
            document.head.appendChild(script);
        });
    };

    // Load scripts in order
    loadScript("/pio/static/l2d.js", "pio-l2d-script")
        .then(() => loadScript("/pio/static/pio.js", "pio-main-script"))
        .then(() => {
            // Initialize after the script finishes loading
            setTimeout(initPio, 100);
        })
        .catch((error) => {
            console.error("Failed to load Pio scripts:", error);
        });
}

// Styles are statically imported via base.astro, no page-transition listener needed

onMount(() => {
    if (!pioConfig.enable) return;

    // Load resources and initialize
    loadPioAssets();
});

onDestroy(() => {
    // No need to clean up the Pio instance when the Svelte component is destroyed
    // because we want it to keep its state across page transitions
    console.log("Pio Svelte component destroyed (keeping instance alive)");
});
</script>

{#if pioConfig.enable}
  <div class={`pio-container ${pioConfig.position || 'right'} onload-animation-up`} bind:this={pioContainer}>
    <div class="pio-action"></div>
    <canvas 
        id="pio" 
        bind:this={pioCanvas}
        width={pioConfig.width || 280} 
        height={pioConfig.height || 250}
    ></canvas>
  </div>
{/if}

<style>
  /* Pio-related styles are loaded via an external CSS file */
</style>