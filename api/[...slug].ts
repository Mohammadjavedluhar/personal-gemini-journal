import app from '../server.ts';

export default function handler(req: any, res: any) {
  if (req.headers && req.headers['x-matched-path']) {
    req.url = req.headers['x-matched-path'];
  } else if (req.query && req.query.path) {
    req.url = '/api/' + (Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path);
  } else if (req.query && req.query.slug) {
    req.url = '/api/' + (Array.isArray(req.query.slug) ? req.query.slug.join('/') : req.query.slug);
  }
  return app(req, res);
}

export { app };
