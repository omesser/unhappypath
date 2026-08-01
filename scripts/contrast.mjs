// ponytail: throwaway audit script, not shipped code — proves the palette meets WCAG AA
// (ADR-0007 requires computed contrast ratios, not eyeballed ones). Run: node scripts/contrast.mjs
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

const pairs = [
	['light body', '#1f2328', '#fbfbf9', 4.5],
	['light muted', '#5b6470', '#fbfbf9', 4.5],
	['light link', '#1f4f8b', '#fbfbf9', 4.5],
	['light link on card', '#1f4f8b', '#f4f4f1', 4.5],
	['light tag pill', '#4a5460', '#eeeeea', 4.5],
	['light border/ui', '#7d858f', '#fbfbf9', 3.0],
	['dark body', '#e8eaed', '#14171a', 4.5],
	['dark muted', '#a3abb5', '#14171a', 4.5],
	['dark link', '#8ab4f8', '#14171a', 4.5],
	['dark link on card', '#8ab4f8', '#1c2024', 4.5],
	['dark tag pill', '#b6bec8', '#22262b', 4.5],
	['dark border/ui', '#6b737d', '#14171a', 3.0],
];

let failed = 0;
for (const [name, fg, bg, min] of pairs) {
	const r = ratio(fg, bg);
	const ok = r >= min;
	if (!ok) failed++;
	console.log(`${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(2)}:1  (min ${min})  ${name}  ${fg} on ${bg}`);
}
console.log(failed ? `\n${failed} pair(s) below AA` : '\nAll pairs meet WCAG AA');
process.exit(failed ? 1 : 0);
