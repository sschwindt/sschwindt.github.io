<script lang="ts">
import { onDestroy, onMount } from "svelte";

import { BREAKPOINT_LG } from "@constants/breakpoints";
import { getTranslateLanguageFromConfig, getSiteLanguage, setStoredLanguage, getDefaultLanguage, updateTranslationNotice } from "@/utils/language";
import { onClickOutside } from "@utils/widget";
import { siteConfig } from "@/config";
import { getSupportedTranslateLanguages } from "@/i18n/language";
import DropdownItem from "@/components/common/DropdownItem.svelte";
import DropdownPanel from "@/components/common/DropdownPanel.svelte";
import Icon from "@components/common/icon.svelte";


let isOpen = $state(false);
let translatePanel: HTMLElement | undefined = $state();
let currentLanguage = $state("");

// Dynamically get the list of supported languages from the unified config
const languages = getSupportedTranslateLanguages();

// Get the source language from the config file's language setting
const sourceLanguage = getTranslateLanguageFromConfig(
    getDefaultLanguage(),
);

function togglePanel() {
    isOpen = !isOpen;
}

function openPanel() {
    isOpen = true;
}

function closePanel() {
    isOpen = false;
}

async function changeLanguage(languageCode: string) {
    try {
        // If the translation script is not loaded yet, load it first
        if (!(window as any).translateScriptLoaded && typeof (window as any).loadTranslateScript === "function") {
            await (window as any).loadTranslateScript();
        }
        // Confirm the translation script is loaded
        if (!(window as any).translate) {
            console.warn("translate.js is not loaded");
            return;
        }
        // Get the translation instance
        const translate = (window as any).translate;
        // Check whether we are switching back to the source language
        const localLang = translate.language.getLocal();
        // Use the changeLanguage method consistently
        translate.changeLanguage(languageCode);
        // If switching back to the source language, run an extra reset so it restores even without a reload
        if (languageCode === localLang) {
            translate.reset();
        }
        // Sync it to our own cache
        setStoredLanguage(languageCode);
        // Update the current UI state
        currentLanguage = languageCode;
        // Refresh the machine-translation notice (shown when switching to French/German, hidden when switching back to English)
        updateTranslationNotice();
    } catch (error) {
        console.error("Failed to execute translation:", error);
    }
}

// Close the panel when clicking outside
function handleClickOutside(event: MouseEvent) {
    if (!isOpen) return;
    onClickOutside(event, "translate-panel", "translate-switch", () => {
        isOpen = false;
    });
}

// On component mount, add the event listener and initialize the default language
onMount(() => {
    document.addEventListener("click", handleClickOutside);
    // Initialize the current language to the site language (cache first)
    currentLanguage = getSiteLanguage();
});

onDestroy(() => {
    if (typeof document !== "undefined") {
        document.removeEventListener("click", handleClickOutside);
    }
});
</script>

{#if siteConfig.translate?.enable}
<div class="relative z-50" onmouseleave={closePanel}>
    <!-- Translation button -->
    <button
        aria-label="Language Translation"
        class="btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90 flex items-center justify-center"
        id="translate-switch"
        onclick={() => { if (window.innerWidth < BREAKPOINT_LG) { openPanel(); } else { togglePanel(); } }}
        onmouseenter={openPanel}
    >
        <Icon icon="material-symbols:translate" class="text-[1.25rem] transition" />
    </button>
    <!-- Translation panel -->
    <div id="translate-panel-wrapper" class="fixed top-14.5 pt-5 right-4 w-[calc(100vw-2rem)] max-w-64 md:absolute md:top-11 md:right-0 md:w-64 md:pt-5 transition-all z-50" class:float-panel-closed={!isOpen}>
        <DropdownPanel
            bind:element={translatePanel}
            id="translate-panel"
            class="p-4 w-full"
        >
            <div class="text-sm font-medium text-(--primary) mb-3 px-1">
                Select Language / Langue / Sprache
            </div>
            <div class="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                {#each languages as lang}
                    <DropdownItem
                        isActive={currentLanguage === lang.code}
                        onclick={() => changeLanguage(lang.code)}
                        class="gap-3 p-2! h-auto!"
                        isLast={false}
                    >
                        <span class="text-lg transition">{lang.icon}</span>
                        <span class="text-sm transition grow text-left">{lang.name}</span>
                        {#if currentLanguage === lang.code}
                            <span class="ml-auto text-(--primary)">✓</span>
                        {/if}
                    </DropdownItem>
                {/each}
            </div>
        </DropdownPanel>
    </div>
</div>
{/if}

<style>
/* Scrollbar styles */
.overflow-y-auto::-webkit-scrollbar {
    width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: var(--scrollbar-bg);
    border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: var(--scrollbar-bg-hover);
}
</style>