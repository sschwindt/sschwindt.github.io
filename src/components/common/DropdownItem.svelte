<script lang="ts">
/**
 * Shared dropdown panel item component (Svelte 5 version)
 * Used for option items inside a dropdown panel
 */
import type { Snippet } from "svelte";


interface Props {
	isActive?: boolean;
	isLast?: boolean;
	class?: string;
	onclick?: (event: MouseEvent) => void;
	children?: Snippet;
}

let {
	isActive = false,
	isLast = false,
	class: className = "",
	onclick,
	children,
	...restProps
}: Props = $props();

const baseClasses =
	"flex transition whitespace-nowrap items-center justify-start! w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95";

// Use $derived to make the class name reactive
const allClasses = $derived.by(() => {
	const spacingClass = isLast ? "" : "mb-0.5";
	const activeClass = isActive ? "current-theme-btn" : "";
	return `${baseClasses} ${spacingClass} ${activeClass} ${className}`.trim();
});
</script>

<button 
	class={allClasses}
	{onclick}
	{...restProps}
>
	{#if children}
		{@render children()}
	{/if}
</button>