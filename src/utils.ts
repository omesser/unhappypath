// "Jul 2026" — for list views (spec §4.3).
export const monthYear = (d: Date) =>
	d.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });

// "29 July 2026" — for a post's own byline row.
export const fullDate = (d: Date) =>
	d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

// <time datetime> wants YYYY-MM-DD (spec §8).
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

/**
 * `build.format: 'file'` makes Astro.url.pathname carry the output filename
 * (`/writing/foo.html`), but ADR-0004 says every URL we emit is extensionless.
 * Canonicals and og:url must go through this. Verified end-to-end by
 * scripts/check-urls.mjs, which fails the build if a `.html` URL escapes.
 */
export const cleanPath = (pathname: string) =>
	pathname === '/index.html' ? '/' : pathname.replace(/\.html$/, '');
