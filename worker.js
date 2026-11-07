// OPTIONAL Cloudflare Worker proxy for VEX Scout.
// Only needed if your browser blocks direct calls to the RobotEvents API (a CORS error).
// Deploy: Cloudflare dashboard > Workers & Pages > Create > Hello World > paste this > Deploy.
// Then paste the worker URL into VEX Scout > Settings > Proxy URL.
// Optional settings (Worker > Settings > Variables):
//   RE_KEY          your RobotEvents key (then the site does not need to send it)
//   ALLOWED_ORIGIN  https://ethan-bayley.github.io  (stops other sites using your worker)
export default {
  async fetch(req, env) {
    const origin = env.ALLOWED_ORIGIN || '*';
    const cors = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Headers': 'Authorization, Accept, Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    };
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    const url = new URL(req.url);
    const target = 'https://www.robotevents.com/api/v2' + url.pathname + url.search;
    const headers = new Headers({ Accept: 'application/json' });
    const auth = env.RE_KEY ? 'Bearer ' + env.RE_KEY : req.headers.get('Authorization');
    if (auth) headers.set('Authorization', auth);
    const r = await fetch(target, { headers });
    return new Response(r.body, {
      status: r.status,
      headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'max-age=20' },
    });
  },
};
