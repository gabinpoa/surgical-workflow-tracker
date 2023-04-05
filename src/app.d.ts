import PocketBase, { Admin } from 'pocketbase';
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: Record | Admin;
			pb: PocketBase;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
