(() => {
    // Singleton pattern: check whether it has already been initialized
    if (window.mermaidInitialized) {
        return;
    }

    window.mermaidInitialized = true;

    // Track the current theme state to avoid unnecessary re-rendering
    let currentTheme = null;
    let isRendering = false; // Prevent concurrent rendering
    let retryCount = 0;
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000; // 1 second

    // Check whether the theme actually changed
    function hasThemeChanged() {
        const isDark = document.documentElement.classList.contains("dark");
        const newTheme = isDark ? "dark" : "default";

        if (currentTheme !== newTheme) {
            currentTheme = newTheme;
            return true;
        }
        return false;
    }

    // Wait for the Mermaid library to finish loading
    function waitForMermaid(timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            function check() {
                if (window.mermaid && typeof window.mermaid.initialize === "function") {
                    resolve(window.mermaid);
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error("Mermaid library failed to load within timeout"));
                } else {
                    setTimeout(check, 100);
                }
            }

            check();
        });
    }

    // Set up a MutationObserver to watch class attribute changes on the html element
    function setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (
                    mutation.type === "attributes" &&
                    mutation.attributeName === "class"
                ) {
                    // Check whether the dark class changed
                    const target = mutation.target;
                    const wasDark = mutation.oldValue
                        ? mutation.oldValue.includes("dark")
                        : false;
                    const isDark = target.classList.contains("dark");

                    if (wasDark !== isDark) {
                        if (hasThemeChanged()) {
                            // Delay rendering to avoid flicker during theme switches
                            setTimeout(() => renderMermaidDiagrams(), 150);
                        }
                    }
                }
            });
        });

        // Start observing class attribute changes on the html element
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
            attributeOldValue: true,
        });
    }

    // Zoom and pan
    function attachZoomControls(element, svgElement) {
        if (element.__zoomAttached) return;
        element.__zoomAttached = true;

        const wrapper = document.createElement("div");
        wrapper.className = "mermaid-zoom-wrapper";

        const svgParent = svgElement.parentNode;
        wrapper.appendChild(svgElement);
        svgParent.appendChild(wrapper);

        let scale = 1;
        let tx = 0;
        let ty = 0;
        const MIN_SCALE = 0.2;
        const MAX_SCALE = 6;

        function applyTransform() {
            wrapper.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
        }
        const controls = document.createElement("div");
        controls.className = "mermaid-zoom-controls";
        controls.innerHTML = `
            <button class="btn-regular rounded-lg h-10 w-10 active:scale-90" data-action="zoom-in" title="Zoom in">+</button>
            <button class="btn-regular rounded-lg h-10 w-10 active:scale-90" data-action="zoom-out" title="Zoom out">−</button>
            <button class="btn-regular rounded-lg h-10 w-10 active:scale-90" data-action="reset" title="Reset">⤾</button>
        `;

        controls.addEventListener("click", (ev) => {
            const action =
                ev.target.getAttribute && ev.target.getAttribute("data-action");
            if (!action) return;
            switch (action) {
                case "zoom-in":
                    scale = Math.min(MAX_SCALE, +(scale * 1.2).toFixed(3));
                    applyTransform();
                    break;
                case "zoom-out":
                    scale = Math.max(MIN_SCALE, +(scale / 1.2).toFixed(3));
                    applyTransform();
                    break;
                case "reset":
                    scale = 1;
                    tx = 0;
                    ty = 0;
                    applyTransform();
                    break;
            }
        });

        element.appendChild(controls);

        // Mouse-wheel zoom
        element.addEventListener(
            "wheel",
            (ev) => {
                ev.preventDefault();
                const delta = -ev.deltaY;
                const zoomFactor = delta > 0 ? 1.12 : 1 / 1.12;
                const prevScale = scale;
                scale = Math.min(
                    MAX_SCALE,
                    Math.max(MIN_SCALE, +(scale * zoomFactor).toFixed(3)),
                );
                const rect = wrapper.getBoundingClientRect();
                const cx = ev.clientX - rect.left;
                const cy = ev.clientY - rect.top;
                const worldX = cx / prevScale - tx;
                const worldY = cy / prevScale - ty;
                tx = cx / scale - worldX;
                ty = cy / scale - worldY;
                applyTransform();
            },
            { passive: false },
        );

        let isPanning = false;
        let startX = 0;
        let startY = 0;
        let startTx = 0;
        let startTy = 0;

        wrapper.style.touchAction = "none";

        wrapper.addEventListener("pointerdown", (ev) => {
            if (ev.button !== 0) return; // Left button only
            isPanning = true;
            wrapper.setPointerCapture(ev.pointerId);
            startX = ev.clientX;
            startY = ev.clientY;
            startTx = tx;
            startTy = ty;
        });
        wrapper.addEventListener("pointermove", (ev) => {
            if (!isPanning) return;
            const dx = ev.clientX - startX;
            const dy = ev.clientY - startY;
            tx = startTx + dx / scale; // Adjust sensitivity based on the current zoom
            ty = startTy + dy / scale;
            applyTransform();
        });
        wrapper.addEventListener("pointerup", (ev) => {
            isPanning = false;
            try {
                wrapper.releasePointerCapture(ev.pointerId);
            } catch (e) { }
        });
        wrapper.addEventListener("pointercancel", () => {
            isPanning = false;
        });

        // Double-click to reset
        wrapper.addEventListener("dblclick", () => {
            scale = 1;
            tx = 0;
            ty = 0;
            applyTransform();
        });
        applyTransform();
        let resizeTimer = null;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                applyTransform();
            }, 200);
        });
    }

    // Set up other event listeners
    function setupEventListeners() {
        // Listen for page navigation
        document.addEventListener("astro:page-load", () => {
            // Re-initialize the theme state
            currentTheme = null;
            retryCount = 0; // Reset the retry counter
            if (hasThemeChanged()) {
                setTimeout(() => renderMermaidDiagrams(), 100);
            }
        });

        // Listen for page visibility changes; re-render when the page becomes visible again
        document.addEventListener("visibilitychange", () => {
            if (!document.hidden) {
                setTimeout(() => renderMermaidDiagrams(), 200);
            }
        });
    }

    async function initializeMermaid() {
        try {
            await waitForMermaid();

            // Initialize the Mermaid configuration
            window.mermaid.initialize({
                startOnLoad: false,
                theme: "default",
                themeVariables: {
                    fontFamily: "inherit",
                    fontSize: "16px",
                },
                securityLevel: "loose",
                // Add error-handling configuration
                errorLevel: "warn",
                logLevel: "error",
            });

            // Render all Mermaid diagrams
            await renderMermaidDiagrams();
        } catch (error) {
            console.error("Failed to initialize Mermaid:", error);
            // If initialization fails, try reloading
            if (retryCount < MAX_RETRIES) {
                retryCount++;
                setTimeout(() => initializeMermaid(), RETRY_DELAY * retryCount);
            }
        }
    }

    async function renderMermaidDiagrams() {
        // Prevent concurrent rendering
        if (isRendering) {
            return;
        }

        // Check whether Mermaid is available
        if (!window.mermaid || typeof window.mermaid.render !== "function") {
            console.warn("Mermaid not available, skipping render");
            return;
        }

        isRendering = true;

        try {
            const mermaidElements = document.querySelectorAll(
                ".mermaid[data-mermaid-code]",
            );

            if (mermaidElements.length === 0) {
                isRendering = false;
                return;
            }

            // Delay theme detection to ensure the DOM has updated
            await new Promise((resolve) => setTimeout(resolve, 100));

            const htmlElement = document.documentElement;
            const isDark = htmlElement.classList.contains("dark");
            const theme = isDark ? "dark" : "default";

            // Update the Mermaid theme (only needs to be done once)
            window.mermaid.initialize({
                startOnLoad: false,
                theme: theme,
                themeVariables: {
                    fontFamily: "inherit",
                    fontSize: "16px",
                    // Force-apply the theme variables
                    primaryColor: isDark ? "#ffffff" : "#000000",
                    primaryTextColor: isDark ? "#ffffff" : "#000000",
                    primaryBorderColor: isDark ? "#ffffff" : "#000000",
                    lineColor: isDark ? "#ffffff" : "#000000",
                    secondaryColor: isDark ? "#333333" : "#f0f0f0",
                    tertiaryColor: isDark ? "#555555" : "#e0e0e0",
                },
                securityLevel: "loose",
                errorLevel: "warn",
                logLevel: "error",
            });

            // Render all diagrams in batch, with a retry mechanism
            const renderPromises = Array.from(mermaidElements).map(
                async (element, index) => {
                    let attempts = 0;
                    const maxAttempts = 3;

                    while (attempts < maxAttempts) {
                        try {
                            const code = element.getAttribute("data-mermaid-code");
                            if (!code) {
                                break;
                            }
                            // Render the diagram
                            const { svg } = await window.mermaid.render(
                                `mermaid-${Date.now()}-${index}-${attempts}`,
                                code,
                            );
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(
                                svg,
                                "image/svg+xml",
                            );
                            const svgElement = doc.documentElement;
                            element.innerHTML = "";
                            element.__zoomAttached = false;
                            element.appendChild(svgElement);
                            // Add responsive support
                            const insertedSvg = element.querySelector("svg");
                            if (insertedSvg) {
                                insertedSvg.setAttribute("width", "100%");
                                insertedSvg.removeAttribute("height");
                                insertedSvg.style.maxWidth = "100%";
                                insertedSvg.style.height = "auto";
                                //TODO: needs to be adapted to the actual situation
                                insertedSvg.style.minHeight = "300px";
                                // Force-apply styles
                                if (isDark) {
                                    svgElement.style.filter = "brightness(0.9) contrast(1.1)";
                                } else {
                                    svgElement.style.filter = "none";
                                }
                                attachZoomControls(element, insertedSvg);
                            }
                            // Render succeeded, break out of the retry loop
                            break;
                        } catch (error) {
                            attempts++;
                            console.warn(
                                `Mermaid rendering attempt ${attempts} failed for element ${index}:`,
                                error,
                            );
                            if (attempts >= maxAttempts) {
                                console.error(
                                    `Failed to render Mermaid diagram after ${maxAttempts} attempts:`,
                                    error,
                                );
                                element.innerHTML = `
                                    <div class="mermaid-error">
                                        <p>Failed to render diagram after ${maxAttempts} attempts.</p>
                                        <button onclick="location.reload()" style="margin-top: 8px; padding: 4px 8px; background: var(--primary); color: white; border: none; border-radius: 4px; cursor: pointer;">
                                            Retry Page
                                        </button>
                                    </div>
                                `;
                            } else {
                                // Wait a while before retrying
                                await new Promise((resolve) =>
                                    setTimeout(resolve, 500 * attempts),
                                );
                            }
                        }
                    }
                },
            );

            // Wait for all rendering to complete
            await Promise.all(renderPromises);
            retryCount = 0; // Reset the retry counter
        } catch (error) {
            console.error("Error in renderMermaidDiagrams:", error);

            // If rendering fails, try re-rendering
            if (retryCount < MAX_RETRIES) {
                retryCount++;
                setTimeout(() => renderMermaidDiagrams(), RETRY_DELAY * retryCount);
            }
        } finally {
            isRendering = false;
        }
    }

    // Initialize the theme state
    function initializeThemeState() {
        const isDark = document.documentElement.classList.contains("dark");
        currentTheme = isDark ? "dark" : "default";
    }

    // Load the Mermaid library
    async function loadMermaid() {
        if (typeof window.mermaid !== "undefined") {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src =
                "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js";

            script.onload = () => {
                console.log("Mermaid library loaded successfully");
                resolve();
            };

            script.onerror = (error) => {
                console.error("Failed to load Mermaid library:", error);
                // Try the fallback CDN
                const fallbackScript = document.createElement("script");
                fallbackScript.src = "https://unpkg.com/mermaid@11/dist/mermaid.min.js";

                fallbackScript.onload = () => {
                    console.log("Mermaid library loaded from fallback CDN");
                    resolve();
                };

                fallbackScript.onerror = () => {
                    reject(
                        new Error(
                            "Failed to load Mermaid from both primary and fallback CDNs",
                        ),
                    );
                };

                document.head.appendChild(fallbackScript);
            };

            document.head.appendChild(script);
        });
    }

    // Main initialization function
    async function initialize() {
        try {
            // First check whether there are any Mermaid diagrams
            const mermaidElements = document.querySelectorAll(
                ".mermaid[data-mermaid-code]",
            );
            if (mermaidElements.length === 0) {
                return;
            }

            // Set up listeners
            setupMutationObserver();
            setupEventListeners();

            // Initialize the theme state
            initializeThemeState();

            // Load and initialize Mermaid
            await loadMermaid();
            await initializeMermaid();
        } catch (error) {
            console.error("Failed to initialize Mermaid system:", error);
        }
    }

    // Kick off initialization
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
    } else {
        initialize();
    }
})();