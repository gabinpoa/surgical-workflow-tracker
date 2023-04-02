/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param) {
	if (!/^[a-zA-Z0-9]{16}$/.test(param)) {
		return false;
	}
	// TODO try to get a surgery with the param as a id and only return true if it exists
	return true;
}
