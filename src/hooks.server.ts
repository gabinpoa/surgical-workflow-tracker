import { serializeNonPOJOs } from '$lib/pb';
import PocketBase, { Admin, Record } from 'pocketbase';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	event.locals.pb = new PocketBase(import.meta.env.VITE_PB_URL);

	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	try {
		if (event.locals.pb.authStore.isValid) {
			event.locals.user = serializeNonPOJOs(event.locals.pb.authStore.model) as Record | Admin;
			await event.locals.pb.collection('users').authRefresh();
		}
	} catch (err) {
		event.locals.pb.authStore.clear();
	}

	const response = await resolve(event);

	response.headers.append('set-cookie', event.locals.pb.authStore.exportToCookie());

	return response;
}
