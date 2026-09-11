const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || process.argv[2] || 8080);
const types = {
  '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8', '.json':'application/json; charset=utf-8',
  '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg',
  '.webp':'image/webp', '.ogg':'audio/ogg', '.mp3':'audio/mpeg'
};

function safePath(urlPath) {
  let decoded;
  try { decoded = decodeURIComponent(urlPath.split('?')[0]); } catch { return null; }
  const requested = decoded === '/' ? '/index.html' : decoded;
  const full = path.resolve(root, '.' + requested);
  if (full !== root && !full.startsWith(root + path.sep)) return null;
  return full;
}

const server = http.createServer((req, res) => {
  const full = safePath(req.url || '/');
  if (!full) { res.writeHead(400); return res.end('Bad request'); }
  fs.stat(full, (err, stat) => {
    let file = full;
    if (!err && stat.isDirectory()) file = path.join(full, 'index.html');
    fs.readFile(file, (readErr, data) => {
      if (readErr) { res.writeHead(404, {'content-type':'text/plain; charset=utf-8'}); return res.end('Not found'); }
      const ext = path.extname(file).toLowerCase();
      const headers = {'content-type': types[ext] || 'application/octet-stream'};
      if (ext === '.html' || path.basename(file) === 'sw.js') headers['cache-control'] = 'no-store';
      res.writeHead(200, headers); res.end(data);
    });
  });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Sakhi Learning Trails preview: http://127.0.0.1:${port}`);
  console.log('Press Ctrl+C to stop.');
});
