const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 8443;
const HOST = '0.0.0.0';
const ROOT = __dirname;

const pfxPath = path.join(ROOT, '.cert', 'cert.pfx');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
};

const server = https.createServer({
  pfx: fs.readFileSync(pfxPath),
  passphrase: 'rinno',
}, (req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]).replace(/\.\./g, '');
  const cleanPath = urlPath.replace(/^\/+/, '');
  const filePath = path.join(ROOT, cleanPath || 'index.html');
  const resolved = fs.statSync(filePath, { throwIfNoEntry: false });
  let target = filePath;
  if (!resolved) {
    target = path.join(filePath, 'index.html');
  } else if (resolved.isDirectory()) {
    target = path.join(filePath, 'index.html');
  }
  const ext = path.extname(target);
  const mime = mimeTypes[ext] || 'application/octet-stream';
  fs.readFile(target, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found: ' + urlPath); return; }
    res.writeHead(200, {
      'Content-Type': mime,
      'Access-Control-Allow-Origin': '*',
    });
    res.end(data);
  });
});

server.listen(PORT, HOST, () => {
  console.log('HTTPS server running at https://192.168.1.2:' + PORT);
  console.log('On Android Chrome, tap "Advanced" then "Proceed" to accept the self-signed cert.');
  console.log('After that, Chrome will show the PWA install prompt.');
});
