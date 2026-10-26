// Removed starter note. Pages runs this file only for
// /notes/hello-unhappy-path and /notes/hello-unhappy-path/ (trailing slash is
// optional in file-based routing). public/_routes.json is what keeps every
// other URL off the Functions runtime. A 301 to /notes would be a soft 404.
export function onRequest() {
	return new Response('This page has been removed.\n', {
		status: 410,
		headers: { 'content-type': 'text/plain; charset=utf-8' },
	});
}
