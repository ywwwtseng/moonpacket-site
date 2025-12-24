import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

function transparentPngOpts() {
  return {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 }
  };
}

async function writePngFromSource(sourcePath, outPath, size) {
  const buf = await sharp(sourcePath)
    .resize(size, size, transparentPngOpts())
    .png()
    .toBuffer();
  await fs.writeFile(outPath, buf);
  return buf;
}

async function main() {
  const root = process.cwd();
  const publicDir = path.join(root, 'public');
  const iconsDir = path.join(publicDir, 'icons');
  await ensureDir(iconsDir);

  const candidates = [
    path.join(publicDir, 'favicon-source.png'),
    path.join(publicDir, 'favicon.png'),
    path.join(publicDir, 'favicon-source-bk.png')
  ];

  let inputPath = '';
  for (const p of candidates) {
    if (await exists(p)) {
      inputPath = p;
      break;
    }
  }
  if (!inputPath) {
    throw new Error('No source image found. Expected public/favicon-source.png or public/favicon.png');
  }

  // Generate PNGs
  const png48 = await writePngFromSource(inputPath, path.join(publicDir, 'favicon.png'), 48);
  await fs.writeFile(path.join(publicDir, 'favicon-48.png'), png48);

  await writePngFromSource(inputPath, path.join(iconsDir, 'logo-192.png'), 192);
  await writePngFromSource(inputPath, path.join(publicDir, 'logo-512.png'), 512);
  await writePngFromSource(inputPath, path.join(publicDir, 'apple-touch-icon.png'), 180);

  // Generate multi-size ICO (16/32/48)
  const tmpBase = await fs.mkdtemp(path.join(os.tmpdir(), 'moonpacket-favicon-'));
  const p16 = path.join(tmpBase, '16.png');
  const p32 = path.join(tmpBase, '32.png');
  const p48 = path.join(tmpBase, '48.png');
  await fs.writeFile(p16, await sharp(inputPath).resize(16, 16, transparentPngOpts()).png().toBuffer());
  await fs.writeFile(p32, await sharp(inputPath).resize(32, 32, transparentPngOpts()).png().toBuffer());
  await fs.writeFile(p48, png48);

  const icoBuf = await pngToIco([p16, p32, p48]);
  await fs.writeFile(path.join(publicDir, 'favicon.ico'), icoBuf);

  // Cleanup temp
  try {
    await fs.rm(tmpBase, { recursive: true, force: true });
  } catch {
    // ignore
  }

  // eslint-disable-next-line no-console
  console.info('[gen:favicon] Generated favicon.ico, favicon.png, favicon-48.png, icons/logo-192.png, logo-512.png, apple-touch-icon.png');
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[gen:favicon] Failed:', err);
  process.exitCode = 1;
});


