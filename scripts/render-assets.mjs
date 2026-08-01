// Rasterize committed SVG sources to the PNGs the site ships (ADR-0006).
// Run once, commit the output: `npm run assets`. sharp is already an Astro
// dependency, so this adds nothing to the install.
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const png = async (svg, out) => {
	await writeFile(out, await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer());
	console.log(`wrote ${out}`);
};

// The one site-wide social card (spec §8).
await png(await readFile('spec/og.svg', 'utf8'), 'public/og.png');

// Throwaway diagram for the demo post — delete both when real posts land.
await png(
	`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="420" viewBox="0 0 1000 420">
		<rect width="1000" height="420" fill="#f4f4f1"/>
		<g fill="none" stroke-width="6" stroke-linecap="round">
			<path stroke="#b4b8bd" d="M80 140h300"/><path stroke="#b4b8bd" d="M470 140h450"/>
			<path stroke="#1f4f8b" d="M380 140c60 0 60 180 130 180"/>
			<path stroke="#1f4f8b" d="M840 300l40 20-40 20"/>
		</g>
		<g font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="30" fill="#5b6470">
			<text x="80" y="105">happy path</text>
			<text x="510" y="290" fill="#1f4f8b">unhappy path</text>
		</g>
	</svg>`,
	'src/content/writing/markdown-kitchen-sink/diagram.png',
);
