/**
 * Unified language configuration file
 * All language-related mappings and configuration are exported from here
 */

export interface LanguageConfig {
    /** Language code used by the translation service */
    translateCode: string;
    /** Language display name */
    displayName: string;
    /** Locale used by Intl.DateTimeFormat */
    locale: string;
    /** Language icon (flag emoji) */
    icon: string;
}

/**
 * Supported language configuration
 * Single source of truth, avoiding duplicate definitions
 */
export const LANGUAGE_CONFIG = {
    en: {
        translateCode: "english",
        displayName: "English",
        locale: "en-US",
        icon: "🇺🇸",
    },
    fr: {
        translateCode: "french",
        displayName: "Français",
        locale: "fr-FR",
        icon: "🇫🇷",
    },
    de: {
        // translate.js identifies German as "deutsch" (not "german"); using the
        // wrong code makes the service silently skip German translation.
        translateCode: "deutsch",
        displayName: "Deutsch",
        locale: "de-DE",
        icon: "🇩🇪",
    },
} as const satisfies Record<string, LanguageConfig>;

/** List of supported language codes */
export const SUPPORTED_LANGUAGES = Object.keys(LANGUAGE_CONFIG) as Array<
    keyof typeof LANGUAGE_CONFIG
>;

export type SupportedLanguage = keyof typeof LANGUAGE_CONFIG;

/**
 * Mapping from config-file language codes to translation-service language codes
 * Generated automatically from LANGUAGE_CONFIG
 */
export const langToTranslateMap: Record<string, string> = Object.fromEntries(
    Object.entries(LANGUAGE_CONFIG).map(([lang, config]) => [
        lang,
        config.translateCode,
    ]),
);

/**
 * Mapping from translation-service language codes to config-file language codes
 * Generated automatically from LANGUAGE_CONFIG
 */
export const translateToLangMap: Record<string, string> = Object.fromEntries(
    Object.entries(LANGUAGE_CONFIG).map(([lang, config]) => [
        config.translateCode,
        lang,
    ]),
);

/**
 * Mapping from language codes to locales
 * Generated automatically from LANGUAGE_CONFIG
 */
export const langToLocaleMap: Record<string, string> = Object.fromEntries(
    Object.entries(LANGUAGE_CONFIG).map(([lang, config]) => [lang, config.locale]),
);

/**
 * Get the list of all translatable languages (used by the Translator)
 */
export function getSupportedTranslateLanguages() {
    return Object.entries(LANGUAGE_CONFIG).map(([code, config]) => ({
        code: config.translateCode,
        name: config.displayName,
        icon: config.icon,
        langCode: code,
    }));
}
