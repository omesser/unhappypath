// ponytail: throwaway audit script, not shipped code — ADR-0007 requires computed
// contrast ratios rather than eyeballed ones. Run: node scripts/contrast.mjs
//
// Every pair below is a foreground/background combination global.css actually
// produces. Keep it in sync when the palette changes, or the claim at the top of
// global.css stops being true.
//
// Deliberately absent: --border (#e3e3dd light / #2b3137 dark). It draws dividers
// and card outlines only — decorative, conveys no information, and WCAG sets no
// minimum for it. The focus ring is --link, which is audited below at the 3:1 UI
// threshold.
const lum = (hex) => {
	const c = hex
		.replace('#', '')
		.match(/../g)
		.map((h) => {
			const s = parseInt(h, 16) / 255;
			return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
		});
	return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
	const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
	return (x + 0.05) / (y + 0.05);
};

// One line each on purpose: the two palettes are meant to be read as a pair, and
// the whole point is spotting that light and dark disagree on a key. Exploded to
// one property per line they no longer line up.
// prettier-ignore
const light = { bg: '#fbfbf9', surface: '#f4f4f1', pill: '#eeeeea', fg: '#1f2328', muted: '#5b6470', pillFg: '#4a5460', link: '#1f4f8b', noticeBg: '#f4c430', noticeFg: '#1f2328' };
// prettier-ignore
const dark = { bg: '#14171a', surface: '#1c2024', pill: '#22262b', fg: '#e8eaed', muted: '#a3abb5', pillFg: '#b6bec8', link: '#8ab4f8', noticeBg: '#f4c430', noticeFg: '#1f2328' };

const pairs = (p, mode) => [
	[`${mode} body text`, p.fg, p.bg, 4.5],
	[`${mode} muted text (tagline, dates, teasers)`, p.muted, p.bg, 4.5],
	[`${mode} link`, p.link, p.bg, 4.5],
	[`${mode} card body text`, p.fg, p.surface, 4.5],
	[`${mode} card link/heading`, p.link, p.surface, 4.5],
	[`${mode} tag pill`, p.pillFg, p.pill, 4.5],
	[`${mode} construction banner`, p.noticeFg, p.noticeBg, 4.5],
	[`${mode} focus ring (UI component, 3:1)`, p.link, p.bg, 3.0],
];

let failed = 0;
for (const [name, fg, bg, min] of [...pairs(light, 'light'), ...pairs(dark, 'dark')]) {
	const r = ratio(fg, bg);
	const ok = r >= min;
	if (!ok) failed++;
	console.log(`${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(2)}:1  (min ${min})  ${name}`);
}
console.log(failed ? `\n${failed} pair(s) below the threshold` : '\nAll pairs meet WCAG AA');
process.exit(failed ? 1 : 0);
