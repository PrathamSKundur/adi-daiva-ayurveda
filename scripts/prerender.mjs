// Injects the server-rendered app into dist/index.html (run after both Vite builds).
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const { render } = await import(pathToFileURL('dist-ssr/entry-server.mjs').href);
const html = render();
const file = 'dist/index.html';
const page = readFileSync(file, 'utf8');
if (!page.includes('<div id="root"></div>')) throw new Error('root container not found in dist/index.html');
writeFileSync(file, page.replace('<div id="root"></div>', `<div id="root">${html}</div>`));
rmSync('dist-ssr', { recursive: true, force: true });
console.log(`pre-rendered ${(html.length / 1024).toFixed(0)} KB of HTML into ${file}`);
