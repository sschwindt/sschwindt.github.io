<script lang="ts">
/**
 * Shared dropdown panel component (Svelte 5 version)
 * Used for dropdown panels like the wallpaper switch and light/dark switch
 */
import type { Snippet } from "svelte";


interface Props {
    id?: string;
    class?: string;
    children?: Snippet;
    element?: HTMLElement;
}

let { id, class: className = "", children, element = $bindable(), ...restProps }: Props = $props();
</script>

<div {id} bind:this={element} class={`card-base float-panel p-2 ${className}`.trim()} {...restProps}>
    {#if children}
        {@render children()}
    {/if}
</div>