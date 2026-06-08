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


// 重新导出以保持向后兼容
export { SUPPORTED_LANGUAGES, type SupportedLanguage, langToTranslateMap, translateToLangMap };


// 语言存储键
const LANG_STORAGE_KEY = "selected-language";

// 存储语言设置
export function setStoredLanguage(lang: string): void {
    if (typeof localStorage !== "undefined") {
        localStorage.setItem(LANG_STORAGE_KEY, lang);
    }
}

// 获取存储的语言设置
export function getStoredLanguage(): string | null {
    if (typeof localStorage !== "undefined") {
        return localStorage.getItem(LANG_STORAGE_KEY);
    }
    return null;
}

// 获取默认语言配置
export function getDefaultLanguage(): string {
    const fallback = siteConfig.lang;
    if (typeof document !== "undefined") {
        const configCarrier = document.getElementById("config-carrier");
        return configCarrier?.dataset.lang || fallback;
    }
    return fallback;
}

// 将配置文件的语言代码转换为翻译服务的语言代码
export function getTranslateLanguageFromConfig(configLang: string): string {
    return langToTranslateMap[configLang] || "english";
}

// 获取解析后的站点语言代码
export function getResolvedSiteLang(): SupportedLanguage {
    const configLang = getDefaultLanguage() as any;
    if (SUPPORTED_LANGUAGES.includes(configLang)) {
        return configLang as SupportedLanguage;
    }
    // 如果 siteConfig.lang 不合规，则使用浏览器检测到的语言
    return detectBrowserLanguage();
}

// 将翻译服务的语言代码转换为配置文件的语言代码
export function getConfigLanguageFromTranslate(translateLang: string): string {
    return translateToLangMap[translateLang] || "en";
}

// 获取语言的显示名称
export function getLanguageDisplayName(langCode: string): string {
    // 先尝试作为配置语言代码查找
    if (langCode in LANGUAGE_CONFIG) {
        return LANGUAGE_CONFIG[langCode as SupportedLanguage].displayName;
    }
    // 尝试作为翻译服务代码查找
    const configLang = translateToLangMap[langCode];
    if (configLang && configLang in LANGUAGE_CONFIG) {
        return LANGUAGE_CONFIG[configLang as SupportedLanguage].displayName;
    }
    // 如果都找不到，返回原始代码
    return langCode;
}

// 检测浏览器语言并返回支持的语言代码
export function detectBrowserLanguage(fallbackLang: SupportedLanguage = "en"): SupportedLanguage {
    // 服务端渲染时返回备用语言
    if (typeof window === "undefined" || typeof navigator === "undefined") {
        return fallbackLang;
    }
    // 获取浏览器语言列表
    const browserLangs = navigator.languages || [navigator.language];
    // 遍历浏览器语言列表，找到第一个支持的语言
    for (const browserLang of browserLangs) {
        // 提取主语言代码（例如：'zh-CN' -> 'zh', 'en-US' -> 'en'）
        const langCode = browserLang.toLowerCase().split("-")[0];
        // 检查是否在支持的语言列表中
        if (SUPPORTED_LANGUAGES.includes(langCode as SupportedLanguage)) {
            return langCode as SupportedLanguage;
        }
    }
    // 如果没有找到支持的语言，返回备用语言
    return fallbackLang;
}

// 获取当前站点语言（优先使用缓存，否则自动检测浏览器语言，回退到 en-US）
//
// 站点本身以英文渲染（source language = English）。访客首次到访且没有
// 手动选择过语言时，按浏览器语言自动决定翻译目标：任意法语变体
// （fr-FR / fr-CA / fr-BE / fr-CH 等）→ 法语，任意德语变体
// （de-DE / de-AT / de-CH 等）→ 德语，其余一律回退到 en-US。
export function getSiteLanguage(_configLang?: string): string {
    // 1. 访客之前手动选择过的语言优先
    const storedLang = getStoredLanguage();
    if (storedLang) return storedLang;
    // 2. 否则根据浏览器语言自动检测（detectBrowserLanguage 会把主语言子标签
    //    与支持的语言列表匹配，未命中时回退到 "en"）
    const browserLang = detectBrowserLanguage();
    return langToTranslateMap[browserLang];
}

// 初始化翻译功能
export function initTranslateService(): void {
    if (typeof window === "undefined" || !siteConfig.translate?.enable) return;
    // 检查 translate.js 是否已加载
    const translate = (window as any).translate;
    if (!translate || (window as any).translateInitialized) return;
    // 配置 translate.js
    if (siteConfig.translate.service) {
        translate.service.use(siteConfig.translate.service);
    }
    // 设置源语言（始终是网站渲染的语言）
    const resolvedLang = getResolvedSiteLang();
    const sourceLang = getTranslateLanguageFromConfig(resolvedLang);
    translate.language.setLocal(sourceLang);
    // 获取目标语言（缓存 -> 配置 -> 浏览器）
    const targetLang = getSiteLanguage(resolvedLang);
    // 如果目标语言不同于源语言，则设置目标语言
    if (targetLang && targetLang !== sourceLang) {
        translate.to = targetLang;
    }
    // 自动识别语言
    if (siteConfig.translate.autoDiscriminate) {
        translate.setAutoDiscriminateLocalLanguage();
    }
    // 设置忽略项
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
    // UI 配置
    if (siteConfig.translate.showSelectTag === false) {
        translate.selectLanguageTag.show = false;
    }
    // 接管存储逻辑：使用自定义缓存并同步到 translate.js
    translate.storage.set = function (key: string, value: string) {
        if (key === "to") { // translate.js 使用 "to" 存储目标语言
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
    // 自定义术语（glossary）：覆盖机器翻译对专业词汇的默认译法。
    // 源语言始终是英文 "english"。法语默认会把 "calibration" 译成
    // "étalonnage"，这里强制保留 "calibration"；德语统一用 "Kalibrierung"。
    // 必须在 translate.execute() 之前追加。
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
            "Hydrodynamic simulations with TELEMAC, OpenFOAM, and their kin are key elements of contemporary river engineering and ecohydraulics. They are also, frankly, hungry: every simulation depends on bulky simplifications, such as roughness, turbulence, or sediment-transport models whose ‘true’ values we can hardly observe directly. This is why we depend on model calibration, which practically is implemented through sweeping a parameter, eyeballing a fit, repeating; this practice is slow, undocumented, and gives poor answers to the question one eventually asks:=Hydrodynamische Simulationen mit TELEMAC, OpenFOAM und ähnliche Programme sind zentrale Bestandteile der modernen Gewässerplanung. Sie sind allerdings sehr rechenintensiv und Fehleranfällig: Jede Simulation stützt sich auf umfangreiche Vereinfachungen, wie etwa Modelle für Oberflächenrauheit, Turbulenz oder Sedimenttransport, deren „wahre“ Werte wir kaum direkt beobachten können. Deshalb sind wir auf Modellkalibrierung angewiesen, die in der Praxis durch das Durchprobieren von Parameterwerten nach Augenmaß umgesetzt wird; dieses Vorgehen ist müßig, fehleranfällig und liefert schlechte Antworten auf die Frage, die man sich letztlich stellt:\n" +
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
            "Solver bindings: a community effort=Solver-Anbindungen: ein Gemeinschaftsprojekt\n" +
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
            ", that is, several manuscripts on the BAL method and on solver-specific bindings are in preparation, with case studies drawn from ongoing projects on ecohydraulic restoration, sediment dynamics, and fish-passage assessment.=, um Bayes'sche Kalibrierung und Software-spezifische Kopplungen besser zu erklären anhand von Fallstudien über ökohydraulisch orientierte Renaturierungen, Sedimentdynamik und Fischpassstudien.\n" +
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
    }
    // 启动翻译监听
    translate.listener.start();
    (window as any).translateInitialized = true;
    // 如果目标语言存在且不是源语言，执行翻译
    // 强制执行一次 execute 以确保初始化时应用翻译
    if (translate.to && translate.to !== translate.language.getLocal()) {
        // 延迟一小段时间执行，确保 DOM 完全就绪
        setTimeout(() => {
            translate.execute();
        }, 10);
    } else if (translate.to === translate.language.getLocal()) {
        // 如果目标语言就是源语言，确保处于未翻译状态
        // 有时插件可能会残留之前的翻译状态
        translate.reset();
    }
}

// 加载并初始化翻译功能
export async function loadAndInitTranslate(): Promise<void> {
    if (typeof window === "undefined" || !siteConfig.translate?.enable) return;
    try {
        // 检查是否已经加载
        if (!(window as any).translate) {
            // 使用动态导入，Vite 会自动处理代码分割
            await import("@/plugins/translate");
            (window as any).translateScriptLoaded = true;
        }
        // 初始化服务
        initTranslateService();
    } catch (error) {
        console.error('Failed to load or init translate.js:', error);
    }
}

// 切换语言
export function toggleLanguage(langCode: string): void {
    const translate = (window as any).translate;
    if (!translate) return;
    // 切换语言
    translate.changeLanguage(langCode);
    setStoredLanguage(langCode);
}
