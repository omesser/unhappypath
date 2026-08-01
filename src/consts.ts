// Site-wide constants. Content lives in Markdown (ADR-0003); this is only the
// handful of strings that appear in <head>, the chrome, and structured data.

export const SITE_TITLE = 'unhappy path';

// TODO(oded): pick one tagline and delete the rest.
//   1. 'Software engineering hijinks'
//   2. 'Notes from the error branch'
//   3. 'Where the interesting bugs live'
export const SITE_TAGLINE = 'Software engineering hijinks';

export const SITE_DESCRIPTION =
	'Timeless notes on engineering, systems, leadership, and the unhappy paths — by Oded Messer.';

export const AUTHOR = {
	name: 'Oded Messer',
	github: 'https://github.com/omesser',
	linkedin: 'https://www.linkedin.com/in/odedmesser/',
};

// TODO(oded): personal (not work) email. Rendered only on /contact; left empty
// until supplied, and the page degrades to LinkedIn-only rather than shipping a
// broken mailto:.
export const CONTACT_EMAIL = '';

// TODO(oded): GoatCounter site code (ADR-0008). The beacon only renders in
// production and only once this is set, so an unconfigured site ships no script
// rather than a 404ing one.
export const GOATCOUNTER_CODE = '';

// About/Projects/Writing/Fun are homepage sections; Contact is a page (spec §3).
export const NAV = [
	{ href: '/#about', label: 'About' },
	{ href: '/#projects', label: 'Projects' },
	{ href: '/#writing', label: 'Writing' },
	{ href: '/#fun', label: 'Fun' },
	{ href: '/contact', label: 'Contact' },
];
