<script lang="ts">
	import { createTable, Render, Subscribe, createRender } from 'svelte-headless-table';
	import { derived, readable, writable, type Readable } from 'svelte/store';
	import * as Table from '$lib/components/ui/table';
	import { addPagination } from 'svelte-headless-table/plugins';
	import { Button } from '$lib/components/ui/button';
	import ScrapeTableActions from './scrape-table-actions.svelte';
	import type { ScrapedTorrent } from '$lib/types';

	export let torrentStore: Readable<ScrapedTorrent[]>;
	export let onAddMagnet: (magnet: string) => void;
	export let magnetLoading: boolean = false;

	let magnetLoadingStore = writable(magnetLoading);
	$: magnetLoadingStore.set(magnetLoading);

	const table = createTable(torrentStore, {
		page: addPagination()
	});

	const columns = table.createColumns([
		table.column({
			accessor: 'raw_title',
			header: 'Title'
		}),
		table.column({
			accessor: 'rank',
			header: 'Rank'
		}),
		table.column({
			header: '',
			accessor: (row) => row.infohash,
			cell: ({ value }) => {
				return createRender(
					ScrapeTableActions,
					derived(magnetLoadingStore, (magnetLoading) => ({
						magnet: `magnet:?xt=urn:btih:${value}`,
						onAddMagnet,
						magnetLoading: magnetLoading
					}))
				);
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);
	const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
	table.createViewModel(columns);
</script>

<Table.Root {...$tableAttrs}>
	<Table.Header>
		{#each $headerRows as headerRow}
			<Subscribe rowAttrs={headerRow.attrs()}>
				<Table.Row>
					{#each headerRow.cells as cell (cell.id)}
						<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
							<Table.Head {...attrs}>
								<Render of={cell.render()} />
							</Table.Head>
						</Subscribe>
					{/each}
				</Table.Row>
			</Subscribe>
		{/each}
	</Table.Header>
	<Table.Body {...$tableBodyAttrs}>
		{#each $pageRows as row (row.id)}
			<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
				<Table.Row {...rowAttrs}>
					{#each row.cells as cell (cell.id)}
						<Subscribe attrs={cell.attrs()} let:attrs>
							<Table.Cell {...attrs}>
								<Render of={cell.render()} />
							</Table.Cell>
						</Subscribe>
					{/each}
				</Table.Row>
			</Subscribe>
		{/each}
	</Table.Body>
</Table.Root>
<div class="flex items-center justify-end space-x-2">
	<Button
		variant="outline"
		size="sm"
		on:click={() => ($pageIndex = $pageIndex - 1)}
		disabled={!$hasPreviousPage}>Previous</Button
	>
	<p class="text-sm">
		{$pageIndex + 1} / {Math.ceil($torrentStore.length / 10)}
	</p>
	<Button
		variant="outline"
		size="sm"
		disabled={!$hasNextPage}
		on:click={() => ($pageIndex = $pageIndex + 1)}>Next</Button
	>
</div>
