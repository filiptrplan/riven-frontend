import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
	contentSettingsSchema,
	contentSettingsToGet,
	contentSettingsToPass
} from '$lib/forms/helpers';
import { SettingsService } from '$/client';

export const load: PageServerLoad = async () => {
	const { data } = await SettingsService.getSettings({
		path: {
			paths: contentSettingsToGet.join(',')
		}
	});
	const toPassToSchema = contentSettingsToPass(data);

	return {
		form: await superValidate(toPassToSchema, zod(contentSettingsSchema))
	};
};
