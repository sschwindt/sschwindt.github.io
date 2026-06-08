import type { ParticleConfig } from "@/types/config";
import { particleConfig } from "@/config";


const BOUNDARY_OFFSET = 100;

// Particle object class
class Particle {
    x: number;
    y: number;
    s: number;
    r: number;
    a: number;
    fn: {
        x: (x: number, y: number) => number;
        y: (x: number, y: number) => number;
        r: (r: number) => number;
        a: (a: number) => number;
    };
    idx: number;
    img: HTMLImageElement;
    limitArray: number[];
    config: ParticleConfig;
    // Constructor
    constructor(
        x: number,
        y: number,
        s: number,
        r: number,
        a: number,
        fn: {
            x: (x: number, y: number) => number;
            y: (x: number, y: number) => number;
            r: (r: number) => number;
            a: (a: number) => number;
        },
        idx: number,
        img: HTMLImageElement,
        limitArray: number[],
        config: ParticleConfig,
    ) {
        this.x = x;
        this.y = y;
        this.s = s;
        this.r = r;
        this.a = a;
        this.fn = fn;
        this.idx = idx;
        this.img = img;
        this.limitArray = limitArray;
        this.config = config;
    }
    // Draw the particle
    draw(cxt: CanvasRenderingContext2D) {
        cxt.save();
        cxt.translate(this.x, this.y);
        cxt.rotate(this.r);
        cxt.globalAlpha = this.a;
        cxt.drawImage(this.img, 0, 0, 40 * this.s, 40 * this.s);
        cxt.restore();
    }
    // Update the particle's position and state
    update() {
        this.x = this.fn.x(this.x, this.y);
        this.y = this.fn.y(this.y, this.y);
        this.r = this.fn.r(this.r);
        this.a = this.fn.a(this.a);
        // If the particle goes out of bounds or is fully transparent, reposition it
        if (
            this.x > window.innerWidth ||
            this.x < 0 ||
            this.y > window.innerHeight + BOUNDARY_OFFSET ||
            this.y < -BOUNDARY_OFFSET || // disappeared off the top
            this.a <= 0
        ) {
            // If the particle is unconstrained
            if (this.limitArray[this.idx] === -1) {
                this.resetPosition();
            }
            // Otherwise the particle is constrained
            else {
                if (this.limitArray[this.idx] > 0) {
                    this.resetPosition();
                    this.limitArray[this.idx]--;
                }
            }
        }
    }
    // Reset the particle's position
    private resetPosition() {
        this.r = getRandom("fnr", this.config);
        if (Math.random() > 0.4) {
            this.x = getRandom("x", this.config);
            this.y = window.innerHeight + Math.random() * BOUNDARY_OFFSET; // start from the bottom of the screen
            this.s = getRandom("s", this.config);
            this.r = getRandom("r", this.config);
            this.a = getRandom('a', this.config);
        } else {
            this.x = window.innerWidth;
            this.y = getRandom("y", this.config);
            this.s = getRandom("s", this.config);
            this.r = getRandom("r", this.config);
            this.a = getRandom('a', this.config);
        }
    }
}

// Particle list class
class ParticleList {
    list: Particle[];
    // Constructor
    constructor() {
        this.list = [];
    }
    // Add a particle
    push(particle: Particle) {
        this.list.push(particle);
    }
    // Update all particles
    update() {
        for (let i = 0, len = this.list.length; i < len; i++) {
            this.list[i].update();
        }
    }
    // Draw all particles
    draw(cxt: CanvasRenderingContext2D) {
        for (let i = 0, len = this.list.length; i < len; i++) {
            this.list[i].draw(cxt);
        }
    }
    // Get the particle at a given index
    get(i: number) {
        return this.list[i];
    }
    // Get the particle count
    size() {
        return this.list.length;
    }
}

// Function to get a random value
function getRandom(option: string, config: ParticleConfig): any {
    let ret: any;
    let random: number;
    // Get a random value based on the options
    switch (option) {
        case "x":
            ret = Math.random() * window.innerWidth;
            break;
        case "y":
            ret = window.innerHeight + Math.random() * BOUNDARY_OFFSET; // initial position at the bottom of the screen
            break;
        case "s":
            ret =
                config.size.min + Math.random() * (config.size.max - config.size.min);
            break;
        case "r":
            ret = Math.random() * 6;
            break;
        case "a":
            ret = config.opacity.min + Math.random() * (config.opacity.max - config.opacity.min);
            break;
        case "fnx":
            random = config.speed.horizontal.min + Math.random() * (config.speed.horizontal.max - config.speed.horizontal.min); // keep a small random motion in the x direction
            ret = function (x: number, y: number) {
                return x + random;
            };
            break;
        case "fny":
            random = -(config.speed.vertical.min + Math.random() * (config.speed.vertical.max - config.speed.vertical.min)); // random upward motion in the y direction
            ret = function (x: number, y: number) {
                return y + random;
            };
            break;
        case "fnr":
            ret = function (r: number) {
                return r + config.speed.rotation * 0.1;
            };
            break;
        case "fna":
            ret = function (alpha: number) {
                return alpha - config.speed.fadeSpeed * 0.01;
            };
            break;
    }
    return ret;
}

// Particle manager class
export class ParticleManager {
    private config: ParticleConfig;
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private particleList: ParticleList | null = null;
    private animationId: number | null = null;
    private img: HTMLImageElement | null = null;
    private isRunning = false;
    // Constructor
    constructor(config: ParticleConfig) {
        this.config = config;
    }
    // Initialize the particle effect
    async init(): Promise<void> {
        if (typeof document === "undefined" || !this.config.enable || this.isRunning) {
            return;
        }
        // Create the image object
        this.img = new Image();
        this.img.src = "/assets/images/particle.png"; // use the particle image
        // Wait for the image to finish loading
        await new Promise<void>((resolve, reject) => {
            if (this.img) {
                this.img.onload = () => resolve();
                this.img.onerror = () =>
                    reject(new Error("Failed to load particle image"));
            }
        });
        // Create the canvas
        this.createCanvas();
        // Create the particle list
        this.createParticleList();
        // Start the animation loop
        this.startAnimation();
        // Mark it as running
        this.isRunning = true;
    }
    // Create the canvas
    private createCanvas(): void {
        if (typeof document === "undefined") return;
        this.canvas = document.createElement("canvas");
        this.canvas.height = window.innerHeight;
        this.canvas.width = window.innerWidth;
        this.canvas.setAttribute(
            "style",
            `position: fixed; left: 0; top: 0; pointer-events: none; z-index: ${this.config.zIndex};`,
        );
        this.canvas.setAttribute("id", "canvas_particle");
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");
        // Listen for window resize
        if (typeof window !== "undefined") {
            window.addEventListener("resize", this.handleResize.bind(this));
        }
    }
    // Create the particle list
    private createParticleList(): void {
        if (!this.img || !this.ctx) return;
        this.particleList = new ParticleList();
        const limitArray = new Array(this.config.particleNum).fill(
            this.config.limitTimes,
        );
        for (let i = 0; i < this.config.particleNum; i++) {
            const randomX = getRandom("x", this.config);
            const randomY = getRandom("y", this.config);
            const randomS = getRandom("s", this.config);
            const randomR = getRandom("r", this.config);
            const randomA = getRandom("a", this.config);
            const randomFnx = getRandom("fnx", this.config);
            const randomFny = getRandom("fny", this.config);
            const randomFnR = getRandom("fnr", this.config);
            const randomFnA = getRandom("fna", this.config);
            const particle = new Particle(
                randomX,
                randomY,
                randomS,
                randomR,
                randomA,
                {
                    x: randomFnx,
                    y: randomFny,
                    r: randomFnR,
                    a: randomFnA,
                },
                i,
                this.img,
                limitArray,
                this.config,
            );
            particle.draw(this.ctx);
            this.particleList.push(particle);
        }
    }
    // Start the animation
    private startAnimation(): void {
        if (!this.ctx || !this.canvas || !this.particleList) return;
        const animate = () => {
            if (!this.ctx || !this.canvas || !this.particleList) return;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.particleList.update();
            this.particleList.draw(this.ctx);
            this.animationId = requestAnimationFrame(animate);
        };
        this.animationId = requestAnimationFrame(animate);
    }
    // Handle window resize
    private handleResize(): void {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }
    // Stop the particle effect
    stop(): void {
        if (this.animationId && typeof window !== "undefined") {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        if (this.canvas && typeof document !== "undefined") {
            document.body.removeChild(this.canvas);
            this.canvas = null;
        }
        if (typeof window !== "undefined") {
            window.removeEventListener("resize", this.handleResize.bind(this));
        }
        this.isRunning = false;
    }
    // Toggle the particle effect
    toggle(): void {
        if (this.isRunning) {
            this.stop();
        } else {
            this.init();
        }
    }
    // Update the configuration
    updateConfig(newConfig: ParticleConfig): void {
        const wasRunning = this.isRunning;
        if (wasRunning) {
            this.stop();
        }
        this.config = newConfig;
        if (wasRunning && newConfig.enable) {
            this.init();
        }
    }
    // Get the running state
    getIsRunning(): boolean {
        return this.isRunning;
    }
}

// Create the global particle manager instance
let globalParticleManager: ParticleManager | null = null;

// Initialize the particle effect
export function initParticle(config: ParticleConfig): void {
    if (globalParticleManager) {
        globalParticleManager.updateConfig(config);
    } else {
        globalParticleManager = new ParticleManager(config);
        if (config.enable) {
            globalParticleManager.init();
        }
    }
}

// Toggle the particle effect
export function toggleParticle(): void {
    if (globalParticleManager) {
        globalParticleManager.toggle();
    }
}

// Stop the particle effect
export function stopParticle(): void {
    if (globalParticleManager) {
        globalParticleManager.stop();
        globalParticleManager = null;
    }
}

// Get the running state of the particle effect
export function getParticleStatus(): boolean {
    return globalParticleManager ? globalParticleManager.getIsRunning() : false;
}

// Includes config checks, duplicate-initialization checks, and page-load-state handling
export function setupParticleEffects(): void {
    if (typeof window === "undefined") return;
    // Initialization function
    const init = () => {
        if (!particleConfig || !particleConfig.enable) return;
        if ((window as any).particleInitialized) return;
        initParticle(particleConfig);
        (window as any).particleInitialized = true;
    };
    // Handle the page-load state
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
}