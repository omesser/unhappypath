// Site-wide constants. Content lives in Markdown (ADR-0003); this is only the
// handful of strings that appear in <head>, the chrome, and structured data.

export const SITE_TITLE = 'unhappy path';

export const SITE_TAGLINE = 'Software engineering hijinks';

export const SITE_DESCRIPTION =
	'Notes on engineering, systems, leadership, and the unhappy paths - by Oded Messer.';

export const AUTHOR = {
	name: 'Oded Messer',
	github: 'https://github.com/omesser',
	linkedin: 'https://www.linkedin.com/in/odedmesser/',
};

// Rendered only on /contact.
export const CONTACT_EMAIL = 'odedmesser@gmail.com';

// GoatCounter site code (ADR-0008). Beacon is prod-only.
export const GOATCOUNTER_CODE = 'unhappypath';

// About/Projects/Notes/Links are homepage sections; Contact is a page (spec §3).
export const NAV = [
	{ href: '/#about', label: 'About' },
	{ href: '/#notes', label: 'Notes' },
	{ href: '/#projects', label: 'Projects' },
	{ href: '/#links', label: 'Links' },
	{ href: '/contact', label: 'Contact' },
];
