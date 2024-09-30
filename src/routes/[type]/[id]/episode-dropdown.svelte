<script lang="ts">
	import * as Select from "$lib/components/ui/select";
	import type { Selected } from "bits-ui";

	export let selectedItem: Selected<unknown>;
    export let showData: any;

</script>

<Select.Root portal={null} bind:selected={selectedItem}>
	<Select.Trigger>
		<Select.Value placeholder="Select a season/episode" />
	</Select.Trigger>
	<Select.Content class="max-h-[600px] overflow-y-scroll sm:max-h-[300px]">
		<Select.Group>
			{#each showData.seasons as season}
				<Select.Label>Season {season.number}</Select.Label>
				<Select.Item value={season}>
					All episodes in season {season.number}
				</Select.Item>
				{#each season.episodes as episode}
					<Select.Item value={episode}>
						S{season.number.toString().padStart(2, '0')}E{episode.number
							.toString()
							.padStart(2, '0')}
						{episode.title}
					</Select.Item>
				{/each}
			{/each}
		</Select.Group>
	</Select.Content>
	<Select.Input name="favoriteFruit" />
</Select.Root>
