import {
    type SupportedLanguage,
    SUPPORTED_LANGUAGES,
    langToTranslateMap,
    translateToLangMap,
    LANGUAGE_CONFIG,
} from "@i18n/language";
import {
    siteConfig,
} from "@/config";


// Re-export to maintain backward compatibility
export { SUPPORTED_LANGUAGES, type SupportedLanguage, langToTranslateMap, translateToLangMap };


// Language storage key
const LANG_STORAGE_KEY = "selected-language";

// Store the language setting
export function setStoredLanguage(lang: string): void {
    if (typeof localStorage !== "undefined") {
        localStorage.setItem(LANG_STORAGE_KEY, lang);
    }
}

// Get the stored language setting
export function getStoredLanguage(): string | null {
    if (typeof localStorage !== "undefined") {
        return localStorage.getItem(LANG_STORAGE_KEY);
    }
    return null;
}

// Get the default language configuration
export function getDefaultLanguage(): string {
    const fallback = siteConfig.lang;
    if (typeof document !== "undefined") {
        const configCarrier = document.getElementById("config-carrier");
        return configCarrier?.dataset.lang || fallback;
    }
    return fallback;
}

// Convert the config file's language code into the translation service's language code
export function getTranslateLanguageFromConfig(configLang: string): string {
    return langToTranslateMap[configLang] || "english";
}

// Get the resolved site language code
export function getResolvedSiteLang(): SupportedLanguage {
    const configLang = getDefaultLanguage() as any;
    if (SUPPORTED_LANGUAGES.includes(configLang)) {
        return configLang as SupportedLanguage;
    }
    // If siteConfig.lang is invalid, fall back to the browser-detected language
    return detectBrowserLanguage();
}

// Convert the translation service's language code into the config file's language code
export function getConfigLanguageFromTranslate(translateLang: string): string {
    return translateToLangMap[translateLang] || "en";
}

// Get the language's display name
export function getLanguageDisplayName(langCode: string): string {
    // First try looking it up as a config language code
    if (langCode in LANGUAGE_CONFIG) {
        return LANGUAGE_CONFIG[langCode as SupportedLanguage].displayName;
    }
    // Try looking it up as a translation service code
    const configLang = translateToLangMap[langCode];
    if (configLang && configLang in LANGUAGE_CONFIG) {
        return LANGUAGE_CONFIG[configLang as SupportedLanguage].displayName;
    }
    // If neither is found, return the original code
    return langCode;
}

// Detect the browser language and return a supported language code
export function detectBrowserLanguage(fallbackLang: SupportedLanguage = "en"): SupportedLanguage {
    // Return the fallback language during server-side rendering
    if (typeof window === "undefined" || typeof navigator === "undefined") {
        return fallbackLang;
    }
    // Get the browser's language list
    const browserLangs = navigator.languages || [navigator.language];
    // Iterate over the browser language list and find the first supported language
    for (const browserLang of browserLangs) {
        // Extract the primary language subtag (e.g. 'zh-CN' -> 'zh', 'en-US' -> 'en')
        const langCode = browserLang.toLowerCase().split("-")[0];
        // Check whether it is in the list of supported languages
        if (SUPPORTED_LANGUAGES.includes(langCode as SupportedLanguage)) {
            return langCode as SupportedLanguage;
        }
    }
    // If no supported language is found, return the fallback language
    return fallbackLang;
}

// Get the current site language (prefer the cache, otherwise auto-detect the browser language, falling back to en-US)
//
// The site itself renders in English (source language = English). When a visitor arrives for the first time and has
// not manually chosen a language, the translation target is decided automatically from the browser language: any French variant
// (fr-FR / fr-CA / fr-BE / fr-CH, etc.) -> French, any German variant
// (de-DE / de-AT / de-CH, etc.) -> German, everything else falls back to en-US.
export function getSiteLanguage(_configLang?: string): string {
    // 1. A language the visitor manually chose before takes priority
    const storedLang = getStoredLanguage();
    if (storedLang) return storedLang;
    // 2. Otherwise auto-detect from the browser language (detectBrowserLanguage matches the primary
    //    language subtag against the supported language list, falling back to "en" on a miss)
    const browserLang = detectBrowserLanguage();
    return langToTranslateMap[browserLang];
}

// Initialize the translation feature
export function initTranslateService(): void {
    if (typeof window === "undefined" || !siteConfig.translate?.enable) return;
    // Check whether translate.js is already loaded
    const translate = (window as any).translate;
    if (!translate || (window as any).translateInitialized) return;
    // Configure translate.js
    if (siteConfig.translate.service) {
        translate.service.use(siteConfig.translate.service);
    }
    // Set the source language (always the language the site renders in)
    const resolvedLang = getResolvedSiteLang();
    const sourceLang = getTranslateLanguageFromConfig(resolvedLang);
    translate.language.setLocal(sourceLang);
    // Get the target language (cache -> config -> browser)
    const targetLang = getSiteLanguage(resolvedLang);
    // If the target language differs from the source language, set the target language
    if (targetLang && targetLang !== sourceLang) {
        translate.to = targetLang;
    }
    // Auto-detect the language
    if (siteConfig.translate.autoDiscriminate) {
        translate.setAutoDiscriminateLocalLanguage();
    }
    // Set the ignore rules
    if (siteConfig.translate.ignoreClasses) {
        siteConfig.translate.ignoreClasses.forEach((className: string) => {
            translate.ignore.class.push(className);
        });
    }
    if (siteConfig.translate.ignoreTags) {
        siteConfig.translate.ignoreTags.forEach((tagName: string) => {
            translate.ignore.tag.push(tagName);
        });
    }
    // UI configuration
    if (siteConfig.translate.showSelectTag === false) {
        translate.selectLanguageTag.show = false;
    }
    // Take over the storage logic: use a custom cache and sync it to translate.js
    translate.storage.set = function (key: string, value: string) {
        if (key === "to") { // translate.js uses "to" to store the target language
            setStoredLanguage(value);
        } else {
            localStorage.setItem(key, value);
        }
    };
    translate.storage.get = function (key: string) {
        if (key === "to") {
            return getStoredLanguage();
        }
        return localStorage.getItem(key);
    };
    // Custom glossary terms: override the machine translation's defaults for domain vocabulary.
    // The source language is always "english". French by default translates "calibration" to
    // "étalonnage"; here we force "calibration" to stay, and German consistently uses "Kalibrierung".
    // Must be appended before translate.execute().
    if (translate.nomenclature?.append) {
        translate.nomenclature.append(
            "english",
            "french",
            "calibration=calibration\nCalibration=Calibration\ncalibrations=calibrations\nCalibrations=Calibrations",
        );
        // Domain glossary terms (French) sourced from hyhome-v2/documentation/glossary.md.
        // Same conventions as the German block below: case-sensitive substring matching,
        // lowercase variants only for common-noun terms, longer phrases first.
        translate.nomenclature.append(
            "english",
            "french",
            "Dimensionless bed shear stress=cisaillement adimensionnel\n" +
            "dimensionless bed shear stress=cisaillement adimensionnel\n" +
            "Dirichlet boundary condition=condition aux limites de Dirichlet\n" +
            "Neumann boundary condition=condition aux limites de Neumann\n" +
            "Stage-discharge relation=courbe de tarage\n" +
            "stage-discharge relation=courbe de tarage\n" +
            "Boussinesq approximation=approximation de Boussinesq\n" +
            "Shallow water equations=équations de Saint-Venant\n" +
            "shallow water equations=équations de Saint-Venant\n" +
            "Navier-Stokes equations=équations de Navier-Stokes\n" +
            "Saint-Venant equations=équations de Saint-Venant\n" +
            "Boussinesq hypothesis=hypothèse de Boussinesq\n" +
            "Continuity equation=équation de continuité\n" +
            "continuity equation=équation de continuité\n" +
            "Sediment transport=transport solide\n" +
            "sediment transport=transport solide\n" +
            "Operating System=système d'exploitation\n" +
            "operating system=système d'exploitation\n" +
            "LU decomposition=décomposition LU\n" +
            "Reynolds number=nombre de Reynolds\n" +
            "Sediment yield=apport solide\n" +
            "sediment yield=apport solide\n" +
            "Shear velocity=vitesse de frottement\n" +
            "shear velocity=vitesse de frottement\n" +
            "Suspended load=transport en suspension\n" +
            "suspended load=transport en suspension\n" +
            "Ethohydraulics=éthohydraulique\n" +
            "ethohydraulics=éthohydraulique\n" +
            "Exner equation=équation d'Exner\n" +
            "Froude number=nombre de Froude\n" +
            "Echo sounder=échosondeur\n" +
            "echo sounder=échosondeur\n" +
            "Krylov space=sous-espace de Krylov\n" +
            "Anabranch=anabranche\n" +
            "anabranch=anabranche\n" +
            "Clogging=colmatation\n" +
            "clogging=colmatation\n" +
            "Bedload=charriage\n" +
            "bedload=charriage\n" +
            "RANS=moyenne de Reynolds\n" +
            "CFL=nombre de Courant\n" +
            "CRS=système de coordonnées",
        );
        translate.nomenclature.append(
            "english",
            "deutsch",
            "Research Frontier=modernes Forschungsfeld\nResearch Frontiers=moderne Forschungsfelder",
        );
        // Hand-written German translation of the whole hydrobayescal post, applied
        // as a static "dummy translator" because the free Argos backend mistranslates
        // these sentences badly. ENGLISH -> DEUTSCH only (French still uses Argos).
        //
        // IMPORTANT mechanics:
        //  - translate.js applies nomenclature per DOM *text node* via indexOf, so each
        //    key below is a contiguous text run as rendered (a sentence broken by inline
        //    **bold**/*italic*/[links] becomes several keys, in the order they appear).
        //  - Keys must match the rendered DOM byte-for-byte, including SmartyPants
        //    typography: curly single quotes ‘ ’, curly apostrophes ’, em-dash — and
        //    en-dash –. Verify against the DEPLOYED HTML, never a stale local dist/.
        //  - objSort orders keys longest-first, so these long keys win over the short
        //    glossary/calibration entries; proper-noun nodes (HydroBayesCal, TELEMAC,
        //    OpenFOAM, author names) map key==value so they are kept verbatim.
        //  - "is developing the" intentionally covers both solver-binding bullets; the
        //    lone "is" node is left to Argos (too short to match safely as a substring).
        translate.nomenclature.append(
            "english",
            "deutsch",
            "Hydrodynamic simulations with TELEMAC, OpenFOAM, and their kin are key elements of contemporary river engineering and ecohydraulics. They are also, frankly, hungry: every simulation depends on bulky simplifications, such as roughness, turbulence, or sediment-transport models whose ‘true’ values we can hardly observe directly. This is why we depend on model calibration, which practically is implemented through sweeping a parameter, eyeballing a fit, repeating; this practice is slow, undocumented, and gives poor answers to the question one eventually asks:=Hydrodynamische Simulationen mit TELEMAC, OpenFOAM und ähnliche Programme sind zentrale Bestandteile des modernen Flussbaus. Sie sind allerdings sehr rechenintensiv und Fehleranfällig: Jede Simulation stützt sich auf umfangreiche Vereinfachungen, wie etwa Modelle für Oberflächenrauheit, Turbulenz oder Sedimenttransport, deren „wahre“ Werte wir kaum direkt beobachten können. Deshalb sind wir auf Modellkalibrierung angewiesen, die in der Praxis durch das Durchprobieren von Parameterwerten nach Augenmaß umgesetzt wird; dieses Vorgehen ist müßig, fehleranfällig und liefert schlechte Antworten auf die Frage, die man sich letztlich stellt:\n" +
            "how confident are you in this parameter?=wie sicher bist du dir bei diesem Parameter?\n" +
            "This is where=Hier kommt\n" +
            "changes the game. Instead of returning a single ‘best’ parameter set, it returns a posterior distribution: a full picture of which parameters are consistent with the data, how strongly they are constrained, and how they trade off against each other. The catch has always been cost. Tens of thousands of forward runs of a 2d/3d hydrodynamic solver is a nogo on any realistic project budget.=ins Spiel. Statt einen einzelnen „besten“ (subjektiven) Parameterschätzwert zu liefern, erzielt Bayes'sche Kalibrierung eine a-posteriori Verteilung, d.h. ein Bild davon, welche Parameter mit den Daten wahrscheinlichkeitsbasiert vereinbar sind. Ein Haken der Bayes'schen Kalbirierung war lange Zeit der große Aufwand, da tausende Vorwärtsläufe eines 2D/3D-hydrodynamischen Lösers notwendig sind, um robuste a-posteriori Verteilungen zu erzielen, was bei keinem Projektbudget realistischen machbar ist.\n" +
            "HydroBayesCal=HydroBayesCal\n" +
            "a Bayesian calibration tool for hydrodynamic models=ein Werkzeug zur Bayes'schen Kalibrierung hydrodynamischer Modelle\n" +
            "; we are building this framework in the hydro-morphodynamics group at=; wir entwickeln diesen Optimierungsalgorithmus in der Arbeitsgruppe Hydro-Morphodynamik am\n" +
            "IWS at the University of Stuttgart=IWS der Universität Stuttgart\n" +
            "to make this tractable. The core idea is=. Die Grundidee ist\n" +
            "Bayesian Active Learning (BAL)=Bayesian Active Learning (BAL)\n" +
            ": rather than blindly sampling the parameter space, we train a cheap surrogate (aka=: statt den Parameterraum blind abzutasten, trainieren wir ein ressourcen-günstiges Surrogat (auch\n" +
            "metamodel=Metamodell\n" +
            ") of the solver, use Bayesian information criteria to decide=) des Lösers genannt und verwenden Bayes'sche Informationskriterien, um zu entscheiden,\n" +
            "where the next expensive simulation will buy us the most information=wo die nächste rechenintensive, deterministische 2D/3D Simulation den größten Informationsgewinn bringt\n" +
            ", run only that one, update the surrogate, and iterate. The net effect is a posterior built from dozens, not thousands, of full deterministic runs.= und aktualisieren das Surrogatmodell. Das Ergebnis ist eine Posteriori-Verteilung, die aus Dutzenden statt Tausenden vollständiger deterministischer Läufe entsteht.\n" +
            "What I find most exciting about this direction is that it shifts calibration from craft to quantified science. A posterior is something you can publish, propagate into design decisions, and compare across studies. It also opens the door to honest uncertainty bands on derived quantities like fish-passage performance, sediment fluxes, or wood-mobility thresholds — the kind of outputs that decision-makers actually act on.=Was mich an dieser Technik am meisten begeistert, ist, dass sie die Kalibrierungsherausforderung zu einer quantifizierbaren Optimierungsaufgabe macht. Geometrische Merkmale der a-posteriori-Verteilung können in Entwurfsentscheidungen einfließen und generalisierbar angewendet werden. Bayes'sche Kalibrierung öffnet außerdem die Tür zu wertvollen Unsicherheitsabschätzungen, um tatsächliche hydraulische-morphologische Variabilitäten quantitativ zu betrachten.\n" +
            "Solver bindings: a community effort=Solver-Anbindungen: ein Community-Projekt\n" +
            "A Bayesian framework is only useful when it can communicate with your solver. Two of our PhD candidates at IWS are pushing this forward in parallel:=Bayes'sche Kalibrierungsalgorithmen sind allerdings nur dann nützlich, wenn sie mit der Modellierungssoftware kommunizieren können. Zwei unserer Doktorand*innen am IWS implementieren deshalb parallel Softwarekopplungen:\n" +
            "Andres Heredia=Andres Heredia\n" +
            "is developing the=entwickelt\n" +
            "TELEMAC=TELEMAC\n" +
            "bindings by automating run setup, restarts and result extraction for the open-source TELEMAC suite so that HydroBayesCal can iterate over hydrodynamic and morphodynamic configurations without manual intervention.=TELEMAC-Kopplungen, sodass HydroBayesCal hydro-morphodynamische Konfigurationen ohne manuelles Eingreifen durchlaufen kann.\n" +
            "Federica Scolari=Federica Scolari entwickelt\n" +
            "OpenFOAM=OpenFOAM\n" +
            "bindings to bring the same active-learning loop to general-purpose CFD, where 3d detail (free-surface flows, sediment–structure interaction, fishway hydraulics) matters.=-Kopplungen, um dieselbe Active-Learning-Schleife auf CFD-Anwendungen zu übertragen, bei denen 3D-Strömungsfelder wichtig sind (z.B. in Fischpässen.\n" +
            "Both software bindings share a common API on the HydroBayesCal side, which is the point: a user-facing workflow that doesn’t change when you swap solvers.=Beide Software-Kopplungen teilen sich auf der HydroBayesCal-Seite eine gemeinsame API. Dadurch entsteht hier ein harmonisierter immer mehr Software-unabhängiger Arbeitsablauf.\n" +
            "What’s next=Wie es weitergeht\n" +
            "We are working on two fronts in parallel. First,=Wir arbeiten parallel an zwei Entwicklungsperspektiven. Erstens,\n" +
            "community release=die Veröffentlichung für die Community\n" +
            ", that is, improving the package, writing tutorials, and making sure that a graduate students and engineers outside our research environment can install HydroBayesCal, point it at a TELEMAC or OpenFOAM case, and get a defensible posterior in an afternoon. Second,=, das heißt, die HydroBayesCal-Bibliothel nutzerfreundlich aufzuarbeiten, versehen mit Tutorials, damit Studierende sowie Ingenieurinnen und Ingenieure außerhalb des IWS-Umfelds HydroBayesCal anwenden können. Zweitens,\n" +
            "peer-reviewed papers=arbeiten wir an begutachteten Fachartikeln\n" +
            ", that is, several manuscripts on the BAL method and on solver-specific bindings are in preparation, with case studies drawn from ongoing projects on ecohydraulic restoration, sediment dynamics, and fish-passage assessment.=, um Bayes'sche Kalibrierung und Software-spezifische Kopplungen besser zu erklären anhand von Fallstudien über ökologisch orientierte Renaturierungen, Sedimentdynamik und Fischpassstudien.\n" +
            "If you are working on calibration of hydrodynamic, morphodynamic or sediment-transport models and would like to test-drive HydroBayesCal on your own case, please reach out: that is exactly the kind of external use case that helps us make the tool robust before the public release.=Wenn ihr an der Kalibrierung hydrodynamischer, morphodynamischer oder Sedimenttransport-Modelle arbeitet und HydroBayesCal selbst ausprobieren wollt, meldet euch gerne - auch für Feedback (ihr findet uns über eure Lieblingssuchmaschine).\n" +
            "Read more:=Mehr erfahren:",
        );
        translate.nomenclature.append(
            "english",
            "deutsch",
            // Phrase entries first so the adjective is correct ("Bayessche")
            // instead of being machine-translated word-by-word.
            "Bayesian calibration=Bayes'sche Kalibrierung\nBayesian Calibration=Bayes'sche Kalibrierung\ncalibration=Kalibrierung\nCalibration=Kalibrierung\ncalibrations=Kalibrierungen\nCalibrations=Kalibrierungen",
        );
        // Domain glossary terms sourced from hyhome-v2/documentation/glossary.md.
        // Matching is case-sensitive substring (translate.js uses indexOf), so we
        // add a lowercase variant for common-noun terms (used mid-sentence) but not
        // for proper-noun/acronym-led terms, which are always capitalized in prose.
        // Longer phrases are listed first so they win over single-word entries.
        translate.nomenclature.append(
            "english",
            "deutsch",
            "Dimensionless bed shear stress=dimensionslose Schubspannung\n" +
            "dimensionless bed shear stress=dimensionslose Schubspannung\n" +
            "Dirichlet boundary condition=Dirichlet-Randbedingung\n" +
            "Neumann boundary condition=Neumann-Randbedingung\n" +
            "Stage-discharge relation=Abflusskurve\n" +
            "stage-discharge relation=Abflusskurve\n" +
            "Boussinesq approximation=Boussinesq-Approximation\n" +
            "Shallow water equations=Flachwassergleichungen\n" +
            "shallow water equations=Flachwassergleichungen\n" +
            "Navier-Stokes equations=Navier-Stokes-Gleichungen\n" +
            "Saint-Venant equations=Saint-Venant-Gleichungen\n" +
            "Boussinesq hypothesis=Boussinesq-Näherung\n" +
            "Continuity equation=Kontinuitätsgleichung\n" +
            "continuity equation=Kontinuitätsgleichung\n" +
            "Sediment transport=Sedimenttransport\n" +
            "sediment transport=Sedimenttransport\n" +
            "Operating System=Betriebssystem\n" +
            "operating system=Betriebssystem\n" +
            "LU decomposition=LR-Zerlegung\n" +
            "Reynolds number=Reynolds-Zahl\n" +
            "Sediment yield=Feststoffeintrag\n" +
            "sediment yield=Feststoffeintrag\n" +
            "Shear velocity=Schubspannungsgeschwindigkeit\n" +
            "shear velocity=Schubspannungsgeschwindigkeit\n" +
            "Suspended load=Schwebstofftransport\n" +
            "suspended load=Schwebstofftransport\n" +
            "Ethohydraulics=Ethohydraulik\n" +
            "ethohydraulics=Ethohydraulik\n" +
            "Exner equation=Exner-Gleichung\n" +
            "Froude number=Froude-Zahl\n" +
            "Echo sounder=Echolot\n" +
            "echo sounder=Echolot\n" +
            "Krylov space=Krylowraum\n" +
            "Convection=Konvektion\n" +
            "convection=Konvektion\n" +
            "Advection=Advektion\n" +
            "advection=Advektion\n" +
            "Anabranch=Flussarm\n" +
            "anabranch=Flussarm\n" +
            "Clogging=Kolmation\n" +
            "clogging=Kolmation\n" +
            "Bedload=Geschiebetransport\n" +
            "bedload=Geschiebetransport\n" +
            "RANS=Reynolds-gemittelte Navier-Stokes-Gleichungen\n" +
            "CFL=CFL-Zahl\n" +
            "CRS=Koordinatenreferenzsystem",
        );

        // Brand/keyword terms that must NEVER be translated: "ecohydraulics" and "community"
        // are kept verbatim in every target language by mapping each key to itself. Longer
        // keys are listed first so phrase variants win over the bare word (objSort is
        // longest-first). NOTE: the full-sentence hydrobayescal overrides above already keep
        // these words in English where they occur in that post; these short rules cover all
        // other content and the French side (which has no full-post override).
        const KEEP_VERBATIM =
            "Ecohydraulics=Ecohydraulics\n" +
            "ecohydraulics=ecohydraulics\n" +
            "Ecohydraulic=Ecohydraulic\n" +
            "ecohydraulic=ecohydraulic\n" +
            "Community=Community\n" +
            "community=community";
        translate.nomenclature.append("english", "french", KEEP_VERBATIM);
        translate.nomenclature.append("english", "deutsch", KEEP_VERBATIM);

        // Gender-neutral terms for people. The site renders in English; these force the
        // French/German output into inclusive forms instead of the default masculine that
        // the Argos backend produces. French uses the median point (·), German the gender
        // star (*) — matching the conventions already used in the hand-written post above.
        // Plural keys precede singular keys, and capitalized variants are added because
        // translate.js matches case-sensitively (sentence-initial occurrences).
        translate.nomenclature.append(
            "english",
            "french",
            "PhD candidates=doctorant·es\n" +
            "PhD candidate=doctorant·e\n" +
            "doctoral candidates=doctorant·es\n" +
            "doctoral candidate=doctorant·e\n" +
            "decision-makers=décideur·euses\n" +
            "decision-maker=décideur·euse\n" +
            "Researchers=chercheur·euses\n" +
            "researchers=chercheur·euses\n" +
            "Researcher=chercheur·euse\n" +
            "researcher=chercheur·euse\n" +
            "Engineers=ingénieur·es\n" +
            "engineers=ingénieur·es\n" +
            "Engineer=ingénieur·e\n" +
            "engineer=ingénieur·e\n" +
            "Students=étudiant·es\n" +
            "students=étudiant·es\n" +
            "Student=étudiant·e\n" +
            "student=étudiant·e",
        );
        translate.nomenclature.append(
            "english",
            "deutsch",
            "PhD candidates=Doktorand*innen\n" +
            "PhD candidate=Doktorand*in\n" +
            "doctoral candidates=Doktorand*innen\n" +
            "doctoral candidate=Doktorand*in\n" +
            "decision-makers=Entscheidungsträger*innen\n" +
            "decision-maker=Entscheidungsträger*in\n" +
            "Researchers=Forscher*innen\n" +
            "researchers=Forscher*innen\n" +
            "Researcher=Forscher*in\n" +
            "researcher=Forscher*in\n" +
            "Engineers=Ingenieur*innen\n" +
            "engineers=Ingenieur*innen\n" +
            "Engineer=Ingenieur*in\n" +
            "engineer=Ingenieur*in\n" +
            "Students=Studierende\n" +
            "students=Studierende\n" +
            "Student=Studierende*r\n" +
            "student=Studierende*r",
        );
    }
    // Start the translation listener
    translate.listener.start();
    (window as any).translateInitialized = true;
    // If a target language is set and differs from the source language, run the translation
    // Force one execute call to ensure the translation is applied on initialization
    if (translate.to && translate.to !== translate.language.getLocal()) {
        // Delay execution briefly to ensure the DOM is fully ready
        setTimeout(() => {
            translate.execute();
        }, 10);
    } else if (translate.to === translate.language.getLocal()) {
        // If the target language equals the source language, ensure it is in an untranslated state
        // sometimes the plugin may retain a previous translation state
        translate.reset();
    }
    // If the visitor is reading a machine-translated version (French/German), show the notice banner
    updateTranslationNotice();
}

// Load and initialize the translation feature
export async function loadAndInitTranslate(): Promise<void> {
    if (typeof window === "undefined" || !siteConfig.translate?.enable) return;
    try {
        // Check whether it is already loaded
        if (!(window as any).translate) {
            // Use dynamic import; Vite handles code splitting automatically
            await import("@/plugins/translate");
            (window as any).translateScriptLoaded = true;
        }
        // Initialize the service
        initTranslateService();
    } catch (error) {
        console.error('Failed to load or init translate.js:', error);
    }
}

// Switch the language
export function toggleLanguage(langCode: string): void {
    const translate = (window as any).translate;
    if (!translate) return;
    // Switch the language
    translate.changeLanguage(langCode);
    setStoredLanguage(langCode);
    // Refresh the machine-translation notice after switching
    updateTranslationNotice();
}

// ---------------------------------------------------------------------------
// Machine-translation notice banner
//
// The site renders in English; the French/German versions are generated in the browser by translate.js
// via the free Argos backend, which is of limited quality. When a visitor is reading a translated version, show a dismissible banner
// that tells them, in the language they are reading, that "this is an automatic machine translation and may contain errors".
// ---------------------------------------------------------------------------

const TRANSLATION_NOTICE_ID = "machine-translation-notice";

// Notice text per target language (written in the language the reader is reading). The key is translate.js's language code.
const TRANSLATION_NOTICE_TEXT: Record<string, { message: string; dismiss: string }> = {
    french: {
        message:
            "Vous lisez une traduction automatique : elle peut contenir des erreurs ou des tournures maladroites.",
        dismiss: "Fermer",
    },
    deutsch: {
        message:
            "Sie lesen eine automatische Maschinenübersetzung – sie kann Fehler oder holprige Formulierungen enthalten.",
        dismiss: "Schließen",
    },
};

// Languages dismissed during this session (sessionStorage), to avoid repeatedly bothering the visitor.
function translationNoticeDismissKey(lang: string): string {
    return `${TRANSLATION_NOTICE_ID}:dismissed:${lang}`;
}

function isTranslationNoticeDismissed(lang: string): boolean {
    try {
        return sessionStorage.getItem(translationNoticeDismissKey(lang)) === "1";
    } catch {
        return false;
    }
}

function dismissTranslationNotice(lang: string): void {
    try {
        sessionStorage.setItem(translationNoticeDismissKey(lang), "1");
    } catch {
        /* Silently ignore when sessionStorage is unavailable */
    }
}

// Lazily create the notice banner DOM (with one-time injected styles) and return the element.
function ensureTranslationNoticeEl(): HTMLElement | null {
    if (typeof document === "undefined") return null;
    const existing = document.getElementById(TRANSLATION_NOTICE_ID);
    if (existing) return existing;

    if (!document.getElementById(`${TRANSLATION_NOTICE_ID}-style`)) {
        const style = document.createElement("style");
        style.id = `${TRANSLATION_NOTICE_ID}-style`;
        style.textContent = `
#${TRANSLATION_NOTICE_ID} {
    position: fixed; left: 1rem; bottom: 1rem; z-index: 60;
    display: none; align-items: flex-start; gap: 0.6rem;
    max-width: min(26rem, calc(100vw - 2rem));
    padding: 0.7rem 0.85rem; border-radius: 0.75rem;
    background: var(--float-panel-bg, var(--card-bg, #fff));
    border: 1px solid color-mix(in srgb, var(--primary) 32%, transparent);
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.20);
    font-size: 0.8125rem; line-height: 1.4;
    opacity: 0; transform: translateY(0.5rem);
    transition: opacity 0.25s ease, transform 0.25s ease;
}
#${TRANSLATION_NOTICE_ID}.is-visible { opacity: 1; transform: translateY(0); }
#${TRANSLATION_NOTICE_ID} .mtn-icon { flex: 0 0 auto; margin-top: 1px; color: var(--primary); }
#${TRANSLATION_NOTICE_ID} .mtn-msg { flex: 1 1 auto; }
#${TRANSLATION_NOTICE_ID} .mtn-close {
    flex: 0 0 auto; cursor: pointer; border: 0; background: transparent; color: inherit;
    opacity: 0.55; font-size: 1.1rem; line-height: 1; padding: 0 0.15rem; border-radius: 0.4rem;
}
#${TRANSLATION_NOTICE_ID} .mtn-close:hover { opacity: 1; background: color-mix(in srgb, var(--primary) 16%, transparent); }
@media (prefers-reduced-motion: reduce) { #${TRANSLATION_NOTICE_ID} { transition: none; } }
`;
        document.head.appendChild(style);
    }

    const el = document.createElement("div");
    el.id = TRANSLATION_NOTICE_ID;
    // The notice text is already written in the target language (French/German). It must NOT be run
    // through translate.js again, otherwise the engine treats it as English source, fails, and leaves
    // the banner empty. The "ignore" class is registered in siteConfig.translate.ignoreClasses, so
    // tagging the banner root (and its whole subtree) keeps translate.js from touching it.
    el.classList.add("ignore");
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    el.innerHTML =
        '<svg class="mtn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>' +
        '<span class="mtn-msg"></span>' +
        '<button class="mtn-close" type="button">&times;</button>';
    document.body.appendChild(el);

    el.querySelector(".mtn-close")?.addEventListener("click", () => {
        const lang = el.dataset.lang || "";
        if (lang) dismissTranslationNotice(lang);
        hideTranslationNotice(el);
    });
    return el;
}

function hideTranslationNotice(el: HTMLElement): void {
    el.classList.remove("is-visible");
    // Wait for the transition to finish before setting display:none, to avoid an abrupt disappearance
    setTimeout(() => {
        if (!el.classList.contains("is-visible")) el.style.display = "none";
    }, 250);
}

// Show/hide the machine-translation notice based on the current target language. Safe to call multiple times.
export function updateTranslationNotice(): void {
    if (typeof window === "undefined" || !siteConfig.translate?.enable) return;
    const translate = (window as any).translate;
    const sourceLang = getTranslateLanguageFromConfig(getResolvedSiteLang());
    // Current target language: prefer translate.to, then the cache, finally fall back to the source language
    const target = (translate && translate.to) || getStoredLanguage() || sourceLang;
    const text = TRANSLATION_NOTICE_TEXT[target];
    const isTranslated = !!target && target !== sourceLang && !!text;

    const el = ensureTranslationNoticeEl();
    if (!el) return;

    if (!isTranslated || isTranslationNoticeDismissed(target)) {
        hideTranslationNotice(el);
        return;
    }

    el.dataset.lang = target;
    const msg = el.querySelector(".mtn-msg") as HTMLElement | null;
    const close = el.querySelector(".mtn-close") as HTMLElement | null;
    if (msg) msg.textContent = text.message;
    if (close) close.setAttribute("aria-label", text.dismiss);

    el.style.display = "flex";
    // Add the visible class on the next frame to trigger the fade-in transition
    requestAnimationFrame(() => el.classList.add("is-visible"));
}
