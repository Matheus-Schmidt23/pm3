// PM3 · protótipo alfa · acesso por senha (Vercel Routing Middleware)
// A senha não fica no código: a Vercel guarda só o hash em PROTO_PASS_HASH,
// calculado como sha256("pm3-alfa:" + senha).
import { next } from '@vercel/functions';

export const config = { matcher: '/((?!assets/|favicon).*)' };

const LIVRES = ['/login.html', '/login'];
const COOKIE = 'pm3_alfa';

async function sha256(texto) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

const lerCookie = (req, nome) => {
  const m = (req.headers.get('cookie') || '').match(new RegExp('(?:^|;\\s*)' + nome + '=([^;]+)'));
  return m ? m[1] : null;
};

const destinoSeguro = d => (d && d.startsWith('/') && !d.startsWith('//') && d !== '/') ? d : '/home.html';

export default async function middleware(request) {
  const url = new URL(request.url);
  const hash = process.env.PROTO_PASS_HASH;
  if (!hash) return new Response('Protótipo sem senha configurada.', { status: 503 });
  const sessao = await sha256(hash + ':sessao');

  // envio do formulário de login
  if (url.pathname === '/entrar' && request.method === 'POST') {
    const form = await request.formData();
    const senha = String(form.get('senha') || '');
    const para = destinoSeguro(String(form.get('next') || ''));
    if ((await sha256('pm3-alfa:' + senha)) === hash) {
      return new Response(null, { status: 303, headers: {
        Location: para,
        'Set-Cookie': `${COOKIE}=${sessao}; Path=/; Max-Age=2592000; HttpOnly; Secure; SameSite=Lax`
      }});
    }
    return new Response(null, { status: 303, headers: { Location: '/login.html?erro=1&next=' + encodeURIComponent(para) } });
  }

  // sair
  if (url.pathname === '/sair') {
    return new Response(null, { status: 303, headers: {
      Location: '/login.html',
      'Set-Cookie': `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`
    }});
  }

  if (LIVRES.includes(url.pathname)) return next();
  if (lerCookie(request, COOKIE) === sessao) return next();

  const alvo = url.pathname + url.search;
  return new Response(null, { status: 307, headers: { Location: '/login.html?next=' + encodeURIComponent(alvo) } });
}
