const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ogg': 'audio/ogg'
};

function serve() {
  const server = http.createServer((req, res) => {
    let route = decodeURIComponent(req.url.split('?')[0]);
    if (route === '/' || route === '') route = '/index.html';
    const file = path.normalize(path.join(dist, route));
    if (!file.startsWith(dist)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    fs.readFile(file, (error, body) => {
      if (error) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      res.writeHead(200, {
        'Content-Type': types[path.extname(file)] || 'application/octet-stream',
        'Cache-Control': 'no-store'
      });
      res.end(body);
    });
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(server)));
}

function get(base, route) {
  return new Promise((resolve, reject) => {
    http.get(base + route, response => {
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => resolve({
        status: response.statusCode,
        type: response.headers['content-type'] || '',
        body: Buffer.concat(chunks)
      }));
    }).on('error', reject);
  });
}

(async () => {
  const server = await serve();
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const routes = [
      ['/', 'text/html'],
      ['/sw.js', 'text/javascript'],
      ['/manifest.json', 'application/json'],
      ['/assets/theme-media/generated/home-unicorn-storytime.webp', 'image/webp'],
      ['/assets/theme-media/generated/reading-enchanted-library.webp', 'image/webp'],
      ['/assets/theme-media/generated/math-ice-gems.webp', 'image/webp'],
      ['/assets/theme-media/generated/writing-rainbow-storybook.webp', 'image/webp'],
      ['/assets/theme-media/generated/language-golden-ballroom.webp', 'image/webp'],
      ['/assets/theme-media/generated/science-mermaid-lagoon.webp', 'image/webp'],
      ['/assets/theme-media/generated/logic-crystal-number-palace.webp', 'image/webp'],
      ['/assets/theme-media/generated/wellbeing-enchanted-forest.webp', 'image/webp'],
      ['/assets/theme-media/generated/creative-tower-art-studio.webp', 'image/webp'],
      ['/assets/audio/phonemes/phoneme_p.ogg', 'audio/ogg']
    ];

    for (const [route, expectedType] of routes) {
      const response = await get(base, route);
      if (response.status !== 200) throw new Error(`${route} returned ${response.status}`);
      if (!response.type.includes(expectedType)) {
        throw new Error(`${route} returned ${response.type}, expected ${expectedType}`);
      }
      if (response.body.length < 100) throw new Error(`${route} response is unexpectedly small`);
    }

    const index = (await get(base, '/')).body.toString('utf8');
    if (index.includes('sakhi-art.js')) throw new Error('Built index still loads the removed art runtime');
    if (!index.includes('home-unicorn-storytime.webp')) throw new Error('Built index is missing the supplied home artwork');
    if (!index.includes('science-mermaid-lagoon.webp')) throw new Error('Built index is missing subject-world artwork');

    const sw = (await get(base, '/sw.js')).body.toString('utf8');
    if (!sw.includes('sakhi-v3-rc6')) throw new Error('Built service worker cache is stale');

    console.log('Dist server smoke passed: self-contained app, generated artwork, audio, and fresh service worker are reachable');
  } finally {
    server.close();
  }
})().catch(error => {
  console.error(error.stack || error.message);
  process.exit(1);
});
