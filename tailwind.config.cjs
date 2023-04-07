/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				opensans: `'Open Sans', sans-serif;`,
				crimsontext: `'Crimson Text', serif;`
			},
			backgroundImage: {
				login: `url('$lib/assets/simple-bg.jpg')`,
				pattern: `url('$lib/assets/bg-shutterstock1920.webp')`
			}
		}
	},
	plugins: [require('daisyui')]
};
