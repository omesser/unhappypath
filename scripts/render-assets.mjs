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
