<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { Plus, LoaderCircle } from 'lucide-svelte';

	export let onAddMagnet: (magnet: string) => void;
	export let magnet: string;
	export let magnetLoading: boolean = false;
</script>

<div class="flex gap-x-2">
	<Button
		variant="ghost"
		class="px-2"
		size="sm"
		disabled={magnetLoading}
		on:click={() => {
			onAddMagnet(magnet);
		}}
	>
		{#if magnetLoading}
			<LoaderCircle class="size-4 animate-spin" />
		{:else}
			<Plus class="size-4" />
		{/if}
	</Button>
</div>
