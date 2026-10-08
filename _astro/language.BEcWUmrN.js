import{_ as w}from"./preload-helper.CVfkMyKi.js";import{S as c,l as h}from"./language.4Ns7Z04d.js";import{s as a}from"./config.BC-v2HR3.js";const g="selected-language";function S(e){typeof localStorage<"u"&&localStorage.setItem(g,e)}function d(){return typeof localStorage<"u"?localStorage.getItem(g):null}function v(){const e=a.lang;return typeof document<"u"&&document.getElementById("config-carrier")?.dataset.lang||e}function m(e){return h[e]||"english"}function p(){const e=v();return c.includes(e)?e:f()}function f(e="en"){if(typeof window>"u"||typeof navigator>"u")return e;const n=navigator.languages||[navigator.language];for(const t of n){const s=t.toLowerCase().split("-")[0];if(c.includes(s))return s}return e}function k(e){const n=d();if(n)return n;const t=f();return h[t]}function E(){if(typeof window>"u"||!a.translate?.enable)return;const e=window.translate;if(!e||window.translateInitialized)return;a.translate.service&&e.service.use(a.translate.service);const n=p(),t=m(n);e.language.setLocal(t);const s=k();if(s&&s!==t&&(e.to=s),a.translate.autoDiscriminate&&e.setAutoDiscriminateLocalLanguage(),a.translate.ignoreClasses&&a.translate.ignoreClasses.forEach(i=>{e.ignore.class.push(i)}),a.translate.ignoreTags&&a.translate.ignoreTags.forEach(i=>{e.ignore.tag.push(i)}),a.translate.showSelectTag===!1&&(e.selectLanguageTag.show=!1),e.storage.set=function(i,o){i==="to"?S(o):localStorage.setItem(i,o)},e.storage.get=function(i){return i==="to"?d():localStorage.getItem(i)},e.nomenclature?.append){e.nomenclature.append("english","french",`calibration=calibration
Calibration=Calibration
calibrations=calibrations
Calibrations=Calibrations`),e.nomenclature.append("english","french",`Dimensionless bed shear stress=cisaillement adimensionnel
dimensionless bed shear stress=cisaillement adimensionnel
Dirichlet boundary condition=condition aux limites de Dirichlet
Neumann boundary condition=condition aux limites de Neumann
Stage-discharge relation=courbe de tarage
stage-discharge relation=courbe de tarage
Boussinesq approximation=approximation de Boussinesq
Shallow water equations=équations de Saint-Venant
shallow water equations=équations de Saint-Venant
Navier-Stokes equations=équations de Navier-Stokes
Saint-Venant equations=équations de Saint-Venant
Boussinesq hypothesis=hypothèse de Boussinesq
Continuity equation=équation de continuité
continuity equation=équation de continuité
Sediment transport=transport solide
sediment transport=transport solide
Operating System=système d'exploitation
operating system=système d'exploitation
LU decomposition=décomposition LU
Reynolds number=nombre de Reynolds
Sediment yield=apport solide
sediment yield=apport solide
Shear velocity=vitesse de frottement
shear velocity=vitesse de frottement
Suspended load=transport en suspension
suspended load=transport en suspension
Ethohydraulics=éthohydraulique
ethohydraulics=éthohydraulique
Exner equation=équation d'Exner
Froude number=nombre de Froude
Echo sounder=échosondeur
echo sounder=échosondeur
Krylov space=sous-espace de Krylov
Anabranch=anabranche
anabranch=anabranche
Clogging=colmatation
clogging=colmatation
Bedload=charriage
bedload=charriage
RANS=moyenne de Reynolds
CFL=nombre de Courant
CRS=système de coordonnées`),e.nomenclature.append("english","deutsch",`Research Frontier=modernes Forschungsfeld
Research Frontiers=moderne Forschungsfelder`),e.nomenclature.append("english","deutsch",`Hydrodynamic simulations with TELEMAC, OpenFOAM, and their kin are key elements of contemporary river engineering and ecohydraulics. They are also, frankly, hungry: every simulation depends on bulky simplifications, such as roughness, turbulence, or sediment-transport models whose ‘true’ values we can hardly observe directly. This is why we depend on model calibration, which practically is implemented through sweeping a parameter, eyeballing a fit, repeating; this practice is slow, undocumented, and gives poor answers to the question one eventually asks:=Hydrodynamische Simulationen mit TELEMAC, OpenFOAM und ähnliche Programme sind zentrale Bestandteile des modernen Flussbaus. Sie sind allerdings sehr rechenintensiv und Fehleranfällig: Jede Simulation stützt sich auf umfangreiche Vereinfachungen, wie etwa Modelle für Oberflächenrauheit, Turbulenz oder Sedimenttransport, deren „wahre“ Werte wir kaum direkt beobachten können. Deshalb sind wir auf Modellkalibrierung angewiesen, die in der Praxis durch das Durchprobieren von Parameterwerten nach Augenmaß umgesetzt wird; dieses Vorgehen ist müßig, fehleranfällig und liefert schlechte Antworten auf die Frage, die man sich letztlich stellt:
how confident are you in this parameter?=wie sicher bist du dir bei diesem Parameter?
This is where=Hier kommt
changes the game. Instead of returning a single ‘best’ parameter set, it returns a posterior distribution: a full picture of which parameters are consistent with the data, how strongly they are constrained, and how they trade off against each other. The catch has always been cost. Tens of thousands of forward runs of a 2d/3d hydrodynamic solver is a nogo on any realistic project budget.=ins Spiel. Statt einen einzelnen „besten“ (subjektiven) Parameterschätzwert zu liefern, erzielt Bayes'sche Kalibrierung eine a-posteriori Verteilung, d.h. ein Bild davon, welche Parameter mit den Daten wahrscheinlichkeitsbasiert vereinbar sind. Ein Haken der Bayes'schen Kalbirierung war lange Zeit der große Aufwand, da tausende Vorwärtsläufe eines 2D/3D-hydrodynamischen Lösers notwendig sind, um robuste a-posteriori Verteilungen zu erzielen, was bei keinem Projektbudget realistischen machbar ist.
HydroBayesCal=HydroBayesCal
a Bayesian calibration tool for hydrodynamic models=ein Werkzeug zur Bayes'schen Kalibrierung hydrodynamischer Modelle
; we are building this framework in the hydro-morphodynamics group at=; wir entwickeln diesen Optimierungsalgorithmus in der Arbeitsgruppe Hydro-Morphodynamik am
IWS at the University of Stuttgart=IWS der Universität Stuttgart
to make this tractable. The core idea is=. Die Grundidee ist
Bayesian Active Learning (BAL)=Bayesian Active Learning (BAL)
: rather than blindly sampling the parameter space, we train a cheap surrogate (aka=: statt den Parameterraum blind abzutasten, trainieren wir ein ressourcen-günstiges Surrogat (auch
metamodel=Metamodell
) of the solver, use Bayesian information criteria to decide=) des Lösers genannt und verwenden Bayes'sche Informationskriterien, um zu entscheiden,
where the next expensive simulation will buy us the most information=wo die nächste rechenintensive, deterministische 2D/3D Simulation den größten Informationsgewinn bringt
, run only that one, update the surrogate, and iterate. The net effect is a posterior built from dozens, not thousands, of full deterministic runs.= und aktualisieren das Surrogatmodell. Das Ergebnis ist eine Posteriori-Verteilung, die aus Dutzenden statt Tausenden vollständiger deterministischer Läufe entsteht.
What I find most exciting about this direction is that it shifts calibration from craft to quantified science. A posterior is something you can publish, propagate into design decisions, and compare across studies. It also opens the door to honest uncertainty bands on derived quantities like fish-passage performance, sediment fluxes, or wood-mobility thresholds — the kind of outputs that decision-makers actually act on.=Was mich an dieser Technik am meisten begeistert, ist, dass sie die Kalibrierungsherausforderung zu einer quantifizierbaren Optimierungsaufgabe macht. Geometrische Merkmale der a-posteriori-Verteilung können in Entwurfsentscheidungen einfließen und generalisierbar angewendet werden. Bayes'sche Kalibrierung öffnet außerdem die Tür zu wertvollen Unsicherheitsabschätzungen, um tatsächliche hydraulische-morphologische Variabilitäten quantitativ zu betrachten.
Solver bindings: a community effort=Solver-Anbindungen: ein Community-Projekt
A Bayesian framework is only useful when it can communicate with your solver. Two of our PhD candidates at IWS are pushing this forward in parallel:=Bayes'sche Kalibrierungsalgorithmen sind allerdings nur dann nützlich, wenn sie mit der Modellierungssoftware kommunizieren können. Zwei unserer Doktorand*innen am IWS implementieren deshalb parallel Softwarekopplungen:
Andres Heredia=Andres Heredia
is developing the=entwickelt
TELEMAC=TELEMAC
bindings by automating run setup, restarts and result extraction for the open-source TELEMAC suite so that HydroBayesCal can iterate over hydrodynamic and morphodynamic configurations without manual intervention.=TELEMAC-Kopplungen, sodass HydroBayesCal hydro-morphodynamische Konfigurationen ohne manuelles Eingreifen durchlaufen kann.
Federica Scolari=Federica Scolari entwickelt
OpenFOAM=OpenFOAM
bindings to bring the same active-learning loop to general-purpose CFD, where 3d detail (free-surface flows, sediment–structure interaction, fishway hydraulics) matters.=-Kopplungen, um dieselbe Active-Learning-Schleife auf CFD-Anwendungen zu übertragen, bei denen 3D-Strömungsfelder wichtig sind (z.B. in Fischpässen.
Both software bindings share a common API on the HydroBayesCal side, which is the point: a user-facing workflow that doesn’t change when you swap solvers.=Beide Software-Kopplungen teilen sich auf der HydroBayesCal-Seite eine gemeinsame API. Dadurch entsteht hier ein harmonisierter immer mehr Software-unabhängiger Arbeitsablauf.
What’s next=Wie es weitergeht
We are working on two fronts in parallel. First,=Wir arbeiten parallel an zwei Entwicklungsperspektiven. Erstens,
community release=die Veröffentlichung für die Community
, that is, improving the package, writing tutorials, and making sure that a graduate students and engineers outside our research environment can install HydroBayesCal, point it at a TELEMAC or OpenFOAM case, and get a defensible posterior in an afternoon. Second,=, das heißt, die HydroBayesCal-Bibliothel nutzerfreundlich aufzuarbeiten, versehen mit Tutorials, damit Studierende sowie Ingenieurinnen und Ingenieure außerhalb des IWS-Umfelds HydroBayesCal anwenden können. Zweitens,
peer-reviewed papers=arbeiten wir an begutachteten Fachartikeln
, that is, several manuscripts on the BAL method and on solver-specific bindings are in preparation, with case studies drawn from ongoing projects on ecohydraulic restoration, sediment dynamics, and fish-passage assessment.=, um Bayes'sche Kalibrierung und Software-spezifische Kopplungen besser zu erklären anhand von Fallstudien über ökologisch orientierte Renaturierungen, Sedimentdynamik und Fischpassstudien.
If you are working on calibration of hydrodynamic, morphodynamic or sediment-transport models and would like to test-drive HydroBayesCal on your own case, please reach out: that is exactly the kind of external use case that helps us make the tool robust before the public release.=Wenn ihr an der Kalibrierung hydrodynamischer, morphodynamischer oder Sedimenttransport-Modelle arbeitet und HydroBayesCal selbst ausprobieren wollt, meldet euch gerne - auch für Feedback (ihr findet uns über eure Lieblingssuchmaschine).
Read more:=Mehr erfahren:`),e.nomenclature.append("english","deutsch",`Bayesian calibration=Bayes'sche Kalibrierung
Bayesian Calibration=Bayes'sche Kalibrierung
calibration=Kalibrierung
Calibration=Kalibrierung
calibrations=Kalibrierungen
Calibrations=Kalibrierungen`),e.nomenclature.append("english","deutsch",`Dimensionless bed shear stress=dimensionslose Schubspannung
dimensionless bed shear stress=dimensionslose Schubspannung
Dirichlet boundary condition=Dirichlet-Randbedingung
Neumann boundary condition=Neumann-Randbedingung
Stage-discharge relation=Abflusskurve
stage-discharge relation=Abflusskurve
Boussinesq approximation=Boussinesq-Approximation
Shallow water equations=Flachwassergleichungen
shallow water equations=Flachwassergleichungen
Navier-Stokes equations=Navier-Stokes-Gleichungen
Saint-Venant equations=Saint-Venant-Gleichungen
Boussinesq hypothesis=Boussinesq-Näherung
Continuity equation=Kontinuitätsgleichung
continuity equation=Kontinuitätsgleichung
Sediment transport=Sedimenttransport
sediment transport=Sedimenttransport
Operating System=Betriebssystem
operating system=Betriebssystem
LU decomposition=LR-Zerlegung
Reynolds number=Reynolds-Zahl
Sediment yield=Feststoffeintrag
sediment yield=Feststoffeintrag
Shear velocity=Schubspannungsgeschwindigkeit
shear velocity=Schubspannungsgeschwindigkeit
Suspended load=Schwebstofftransport
suspended load=Schwebstofftransport
Ethohydraulics=Ethohydraulik
ethohydraulics=Ethohydraulik
Exner equation=Exner-Gleichung
Froude number=Froude-Zahl
Echo sounder=Echolot
echo sounder=Echolot
Krylov space=Krylowraum
Convection=Konvektion
convection=Konvektion
Advection=Advektion
advection=Advektion
Anabranch=Flussarm
anabranch=Flussarm
Clogging=Kolmation
clogging=Kolmation
Bedload=Geschiebetransport
bedload=Geschiebetransport
RANS=Reynolds-gemittelte Navier-Stokes-Gleichungen
CFL=CFL-Zahl
CRS=Koordinatenreferenzsystem`);const i=`Ecohydraulics=Ecohydraulics
ecohydraulics=ecohydraulics
Ecohydraulic=Ecohydraulic
ecohydraulic=ecohydraulic
Community=Community
community=community`;e.nomenclature.append("english","french",i),e.nomenclature.append("english","deutsch",i),e.nomenclature.append("english","french",`PhD candidates=doctorant·es
PhD candidate=doctorant·e
doctoral candidates=doctorant·es
doctoral candidate=doctorant·e
decision-makers=décideur·euses
decision-maker=décideur·euse
Researchers=chercheur·euses
researchers=chercheur·euses
Researcher=chercheur·euse
researcher=chercheur·euse
Engineers=ingénieur·es
engineers=ingénieur·es
Engineer=ingénieur·e
engineer=ingénieur·e
Students=étudiant·es
students=étudiant·es
Student=étudiant·e
student=étudiant·e`),e.nomenclature.append("english","deutsch",`PhD candidates=Doktorand*innen
PhD candidate=Doktorand*in
doctoral candidates=Doktorand*innen
doctoral candidate=Doktorand*in
decision-makers=Entscheidungsträger*innen
decision-maker=Entscheidungsträger*in
Researchers=Forscher*innen
researchers=Forscher*innen
Researcher=Forscher*in
researcher=Forscher*in
Engineers=Ingenieur*innen
engineers=Ingenieur*innen
Engineer=Ingenieur*in
engineer=Ingenieur*in
Students=Studierende
students=Studierende
Student=Studierende*r
student=Studierende*r`)}e.listener.start(),window.translateInitialized=!0,e.to&&e.to!==e.language.getLocal()?setTimeout(()=>{e.execute()},10):e.to===e.language.getLocal()&&e.reset(),T()}async function z(){if(!(typeof window>"u"||!a.translate?.enable))try{window.translate||(await w(()=>import("./translate.w0zqtkXL.js"),[]),window.translateScriptLoaded=!0),E()}catch(e){console.error("Failed to load or init translate.js:",e)}}const r="machine-translation-notice",L={french:{message:"Vous lisez une traduction automatique : elle peut contenir des erreurs ou des tournures maladroites.",dismiss:"Fermer"},deutsch:{message:"Sie lesen eine automatische Maschinenübersetzung – sie kann Fehler oder holprige Formulierungen enthalten.",dismiss:"Schließen"}};function y(e){return`${r}:dismissed:${e}`}function A(e){try{return sessionStorage.getItem(y(e))==="1"}catch{return!1}}function C(e){try{sessionStorage.setItem(y(e),"1")}catch{}}function B(){if(typeof document>"u")return null;const e=document.getElementById(r);if(e)return e;if(!document.getElementById(`${r}-style`)){const t=document.createElement("style");t.id=`${r}-style`,t.textContent=`
#${r} {
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
#${r}.is-visible { opacity: 1; transform: translateY(0); }
#${r} .mtn-icon { flex: 0 0 auto; margin-top: 1px; color: var(--primary); }
#${r} .mtn-msg { flex: 1 1 auto; }
#${r} .mtn-close {
    flex: 0 0 auto; cursor: pointer; border: 0; background: transparent; color: inherit;
    opacity: 0.55; font-size: 1.1rem; line-height: 1; padding: 0 0.15rem; border-radius: 0.4rem;
}
#${r} .mtn-close:hover { opacity: 1; background: color-mix(in srgb, var(--primary) 16%, transparent); }
@media (prefers-reduced-motion: reduce) { #${r} { transition: none; } }
`,document.head.appendChild(t)}const n=document.createElement("div");return n.id=r,n.classList.add("ignore"),n.setAttribute("role","status"),n.setAttribute("aria-live","polite"),n.innerHTML='<svg class="mtn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg><span class="mtn-msg"></span><button class="mtn-close" type="button">&times;</button>',document.body.appendChild(n),n.querySelector(".mtn-close")?.addEventListener("click",()=>{const t=n.dataset.lang||"";t&&C(t),b(n)}),n}function b(e){e.classList.remove("is-visible"),setTimeout(()=>{e.classList.contains("is-visible")||(e.style.display="none")},250)}function T(){if(typeof window>"u"||!a.translate?.enable)return;const e=window.translate,n=m(p()),t=e&&e.to||d()||n,s=L[t],i=t!==n&&!!s,o=B();if(!o)return;if(!i||A(t)){b(o);return}o.dataset.lang=t;const l=o.querySelector(".mtn-msg"),u=o.querySelector(".mtn-close");l&&(l.textContent=s.message),u&&u.setAttribute("aria-label",s.dismiss),o.style.display="flex",requestAnimationFrame(()=>o.classList.add("is-visible"))}export{m as a,v as b,k as c,p as g,z as l,S as s,T as u};
