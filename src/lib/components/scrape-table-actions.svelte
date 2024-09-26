<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { Magnet, Plus } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	export let onAddMagnet: (magnet: string) => void;
	export let magnet: string;
</script>

<div class="flex gap-x-2">
	<Button
		variant="ghost"
		class="px-2"
		size="sm"
		on:click={() => {
			onAddMagnet(magnet);
		}}
	>
		<Plus class="size-4" />
	</Button>
	<Button
		variant="ghost"
		class="px-2"
		size="sm"
		on:click={() => {
			navigator.clipboard.writeText(magnet);
			toast.success('Magnet copied to clipboard');
		}}
	>
		<Magnet class="size-4" />
	</Button>
</div>
