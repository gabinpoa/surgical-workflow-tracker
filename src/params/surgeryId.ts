/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param) {
	if (!/^[a-zA-Z0-9]{16}$/.test(param)) {
		return false;
	}
	return true;
}
