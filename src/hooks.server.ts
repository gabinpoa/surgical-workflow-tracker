import { serializeNonPOJOs } from '$lib/pb';
import PocketBase, { Admin, Record } from 'pocketbase';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	event.locals.pb = new PocketBase('https://wispy-fire-1719.fly.dev/');

	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	try {
		if (
			event.locals.pb.authStore.isValid &&
			event.locals.pb.authStore.model?.collectionName === 'users'
		) {
			await event.locals.pb.collection('users').authRefresh();
		} else if (event.locals.pb.authStore.isValid) {
			await event.locals.pb.collection('doctors').authRefresh();
		}
	} catch (err) {
		event.locals.pb.authStore.clear();
	}

	const response = await resolve(event);

	response.headers.append(
		'set-cookie',
		event.locals.pb.authStore.exportToCookie({ sameSite: 'Lax' })
	);

	return response;
}
