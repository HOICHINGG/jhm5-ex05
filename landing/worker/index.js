addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Apps Hub</title>
    <style>
      :root{--bg:#ffc0cb;--card:#ffb3c1;--accent:#ff69b4;--text:#4a0e4e}
      html,body{height:100%;margin:0;background:#ffc0cb;color:var(--text);font-family:Inter,system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif}
      .container{max-width:900px;margin:48px auto;padding:24px}
      header h1{margin:0 0 6px;font-size:28px}
      .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin:20px 0}
      .card{display:block;padding:18px;background:#ffe4e9;border-radius:8px;color:var(--text);text-decoration:none;border:1px solid #ffb3c1;transition:transform .12s ease,box-shadow .12s ease}
      .card:hover{transform:translateY(-4px);box-shadow:0 6px 20px rgba(255,105,180,0.3)}
      footer{margin-top:20px;color:#8b4789;text-align:center}
      footer a{color:var(--accent);text-decoration:none}
    </style>
  </head>
  <body>
    <main class="container">
      <header>
        <h1>Apps Hub</h1>
        <p>Six web applications demo</p>
      </header>

      <section class="grid">
        <a class="card" href="/tication-vanilla/">
          <h3>Tication (Vanilla)</h3>
          <p>Pure HTML/CSS/JS Tic-Tac-Toe</p>
        </a>
        <a class="card" href="/tication-react/">
          <h3>Tication (React)</h3>
          <p>React + localStorage with undo/redo</p>
        </a>
        <a class="card" href="/todo/">
          <h3>Todo App</h3>
          <p>Server-backed with Cloudflare KV</p>
        </a>
        <a class="card" href="/hkdse/">
          <h3>HKDSE Analyser</h3>
          <p>2024 results with D1 and charts</p>
        </a>
        <a class="card" href="/mathrush/">
          <h3>Math Rush</h3>
          <p>Speed math game with leaderboard</p>
        </a>
      </section>

      <footer>
        <a href="/health">Health Check</a>
        <span> · </span>
        <a href="https://github.com/HOICHINGG/jhm5-ex05">GitHub</a>
      </footer>
    </main>
  </body>
</html>`

async function handleRequest(request) {
  const url = new URL(request.url)

  if (url.pathname === '/' || url.pathname === '/index.html') {
    // optional: increment visit counter in KV
    try {
      if (typeof VISITS !== 'undefined') {
        const count = Number((await VISITS.get('landing:visits')) || 0) + 1
        await VISITS.put('landing:visits', String(count))
      }
    } catch (err) {
      console.error('KV error', err)
    }

    return new Response(HTML, {
      headers: { 'content-type': 'text/html;charset=UTF-8' }
    })
  }

  if (url.pathname === '/health') {
    const body = { status: 'ok', time: new Date().toISOString() }
    return new Response(JSON.stringify(body), { 
      headers: { 'content-type': 'application/json' } 
    })
  }

  return new Response('Not found', { status: 404 })
}
