addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

async function handleRequest(request) {
  const url = new URL(request.url)

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (url.pathname.startsWith('/api/')) {
    return handleAPI(request, url)
  }

  return new Response('HKDSE API Server', {
    headers: { 'content-type': 'text/plain' }
  })
}

async function handleAPI(request, url) {
  const path = url.pathname

  try {
    // GET /api/stats - Get statistics summary
    if (path === '/api/stats') {
      return await getStats(url)
    }

    // GET /api/rows - Get filtered rows
    if (path === '/api/rows') {
      return await getRows(url)
    }

    // GET /api/descriptions - Get unique descriptions
    if (path === '/api/descriptions') {
      return await getDescriptions()
    }

    return jsonResponse({ error: 'Not found' }, 404)
  } catch (error) {
    console.error('API error:', error)
    return jsonResponse({ error: error.message }, 500)
  }
}

async function getStats(url) {
  const type = url.searchParams.get('type') || 'Number'
  const description = url.searchParams.get('description')

  let query = `SELECT * FROM results WHERE type = ?`
  const params = [type]

  if (description) {
    query += ` AND description LIKE ?`
    params.push(`%${description}%`)
  }

  query += ` ORDER BY row_number ASC`

  const { results } = await DB.prepare(query).bind(...params).all()

  return jsonResponse(results)
}

async function getRows(url) {
  const limit = parseInt(url.searchParams.get('limit')) || 100
  const offset = parseInt(url.searchParams.get('offset')) || 0
  const type = url.searchParams.get('type')

  let query = `SELECT * FROM results WHERE 1=1`
  const params = []

  if (type) {
    query += ` AND type = ?`
    params.push(type)
  }

  query += ` ORDER BY row_number ASC LIMIT ? OFFSET ?`
  params.push(limit, offset)

  const { results } = await DB.prepare(query).bind(...params).all()

  return jsonResponse(results)
}

async function getDescriptions() {
  const query = `SELECT DISTINCT description FROM results WHERE type = 'Number' ORDER BY description`
  const { results } = await DB.prepare(query).all()

  return jsonResponse(results.map(r => r.description))
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json',
      ...corsHeaders
    }
  })
}
