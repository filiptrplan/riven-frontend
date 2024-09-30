import type { Handle } from '@sveltejs/kit';
import { redirect, error } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { env } from '$env/dynamic/private';
const BACKEND_URL = env.BACKEND_URL || 'http://127.0.0.1:8080';
import { db } from '$lib/server/db';
import { client } from './client/services.gen';

const setLocals: Handle = async ({ event, resolve }) => {
	event.locals.BACKEND_URL = BACKEND_URL;
	event.locals.db = db;

	return resolve(event);
};

const onboarding: Handle = async ({ event, resolve }) => {
	if (!event.url.pathname.startsWith('/onboarding') && event.request.method === 'GET') {
		const res = await event.fetch(`${BACKEND_URL}/services`);
		const data = await res.json();
		if (!data.success || !data.data) {
			error(500, 'API Error');
		}
		const toCheck = ['symlink', 'symlinklibrary'];
		const allServicesTrue: boolean = toCheck.every((service) => data.data[service] === true);
		if (!allServicesTrue) {
			redirect(302, '/onboarding');
		}
	}

	return resolve(event);
};

client.setConfig({
	baseUrl: BACKEND_URL
})

client.interceptors.error.use((error) => {
	if (error && typeof error == 'object' && 'detail' in error && typeof error.detail == 'string') {
		return error.detail;
	}
	return undefined;
});

export const handle = sequence(setLocals, onboarding);
