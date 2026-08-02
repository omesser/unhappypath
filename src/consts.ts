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

// Rendered only on /contact.
export const CONTACT_EMAIL = 'odedmesser@gmail.com';

// GoatCounter site code (ADR-0008). Beacon is prod-only.
export const GOATCOUNTER_CODE = 'unhappypath';

// About/Projects/Notes/Fun are homepage sections; Contact is a page (spec §3).
export const NAV = [
	{ href: '/#about', label: 'About' },
	{ href: '/#projects', label: 'Projects' },
	{ href: '/#notes', label: 'Notes' },
	{ href: '/#fun', label: 'Fun' },
	{ href: '/contact', label: 'Contact' },
];
