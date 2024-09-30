
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url }) => {
	const imdb = url.searchParams.get('imdb_id');

	if (!imdb) {
		return new Response(
			JSON.stringify({
				error: 'No IMDb ID provided'
			}),
			{
				status: 400,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}

	try {
		const url = new URL(`${locals.BACKEND_URL}/scrape/index`);
		url.searchParams.set('imdb_id', imdb);
		url.searchParams.set('add_item', '0');
		const response = await fetch(url, {
			method: 'GET'
		});

		const data = await response.json();
		if (response.ok) {
			return new Response(
				JSON.stringify({
					success: 'Media item scraped',
					data: data.data
				}),
				{
					status: 200,
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);
		} else {
			return new Response(
				JSON.stringify({
					error: data.detail
				}),
				{
					status: 500,
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);
		}
	} catch {
		return new Response(
			JSON.stringify({
				error: 'Failed to index media item'
			}),
			{
				status: 500,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}
};
