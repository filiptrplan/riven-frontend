import type { RequestHandler } from './$types';

export interface ScrapedTorrent {
	raw_title: string;
	infohash: string;
	rank: number;
}

export const GET: RequestHandler = async ({ params, locals }) => {
	const imdb = params.id; // This is the IMDB ID

	try {
		const response = await fetch(`${locals.BACKEND_URL}/scrape?imdb_id=${imdb}`, {
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
				error: 'Failed to scrape media item'
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
