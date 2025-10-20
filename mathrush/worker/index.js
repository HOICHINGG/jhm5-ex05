addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

  return new Response('Math Rush API', {
    headers: { 'content-type': 'text/plain' }
  })
}

async function handleAPI(request, url) {
  const path = url.pathname

  try {
    // GET /api/leaderboard - Get top scores
    if (path === '/api/leaderboard' && request.method === 'GET') {
      return await getLeaderboard(url)
    }

    // POST /api/score - Submit new score
    if (path === '/api/score' && request.method === 'POST') {
      return await submitScore(request)
    }

    return jsonResponse({ error: 'Not found' }, 404)
  } catch (error) {
    console.error('API error:', error)
    return jsonResponse({ error: error.message }, 500)
  }
}

async function getLeaderboard(url) {
  const limit = parseInt(url.searchParams.get('limit')) || 10
  const difficulty = url.searchParams.get('difficulty')

  let query = `SELECT * FROM leaderboard WHERE 1=1`
  const params = []

  if (difficulty) {
    query += ` AND difficulty = ?`
    params.push(difficulty)
  }

  query += ` ORDER BY score DESC, time_taken ASC LIMIT ?`
  params.push(limit)

  const { results } = await DB.prepare(query).bind(...params).all()

  return jsonResponse(results)
}

async function submitScore(request) {
  const body = await request.json()
  const { 
    player_name, 
    score, 
    difficulty, 
    time_taken, 
    correct_answers, 
    total_questions 
  } = body

  // Validation
  if (!player_name || !player_name.trim()) {
    return jsonResponse({ error: 'Player name required' }, 400)
  }
  if (typeof score !== 'number' || score < 0) {
    return jsonResponse({ error: 'Invalid score' }, 400)
  }
  if (!['easy', 'medium', 'hard'].includes(difficulty)) {
    return jsonResponse({ error: 'Invalid difficulty' }, 400)
  }

  // Basic anti-cheat: check score reasonableness
  const maxPossibleScore = total_questions * 100 // 100 points per question max
  if (score > maxPossibleScore * 1.5) {
    return jsonResponse({ error: 'Score validation failed' }, 400)
  }

  // Insert score
  const insertQuery = `
    INSERT INTO leaderboard 
    (player_name, score, difficulty, time_taken, correct_answers, total_questions) 
    VALUES (?, ?, ?, ?, ?, ?)
  `
  
  const result = await DB.prepare(insertQuery)
    .bind(
      player_name.trim().substring(0, 50),
      score,
      difficulty,
      time_taken,
      correct_answers,
      total_questions
    )
    .run()

  // Get rank
  const rankQuery = `
    SELECT COUNT(*) as rank 
    FROM leaderboard 
    WHERE difficulty = ? AND (score > ? OR (score = ? AND time_taken < ?))
  `
  
  const { results: rankResults } = await DB.prepare(rankQuery)
    .bind(difficulty, score, score, time_taken)
    .all()

  const rank = (rankResults[0]?.rank || 0) + 1

  return jsonResponse({
    success: true,
    id: result.meta.last_row_id,
    rank,
    score
  }, 201)
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
