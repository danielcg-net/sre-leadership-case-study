import { cp, mkdir, readdir, readFile, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist');
await rm(output, { recursive: true, force: true });
await mkdir(path.join(output, 'diagrams'), { recursive: true });
await cp(path.join(root, 'site'), output, { recursive: true });
const sources = (await readdir(path.join(root, 'diagrams'))).filter(file => file.endsWith('.mmd')).sort();
if (sources.length === 0) throw new Error('No diagram sources found');
for (const source of sources) {
  const input = path.join(root, 'diagrams', source);
  const svg = path.join(output, 'diagrams', source.replace(/\.mmd$/, '.svg'));
  const definition = await readFile(input, 'utf8');
  if (!definition.includes('accTitle:') || !definition.includes('accDescr:')) {
    throw new Error(`${source} requires an accessible title and description`);
  }
  execFileSync(path.join(root, 'node_modules', '.bin', 'mmdc'), [
    '-i', input, '-o', svg, '-c', path.join(root, 'diagrams', 'theme.json'),
    '-b', 'white', '-w', '1800',
    ...(process.env.CI ? ['-p', path.join(root, 'scripts', 'puppeteer-ci.json')] : [])
  ], { stdio: 'inherit' });
  const rendered = await readFile(svg, 'utf8');
  if (!rendered.includes('<svg') || !rendered.includes('<title') || !rendered.includes('<desc')) {
    throw new Error(`${source} did not produce an accessible SVG`);
  }
  await cp(input, path.join(output, 'diagrams', source));
}
console.log(`Built static site with ${sources.length} accessible diagrams in dist/`);
