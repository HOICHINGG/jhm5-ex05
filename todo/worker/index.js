addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

async function handleRequest(request) {
  const url = new URL(request.url)

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // API routes
  if (url.pathname.startsWith('/api/')) {
    return handleAPI(request, url)
  }

  // Serve static frontend (placeholder - replace with actual static files or Pages)
  return new Response('Todo API Server. Use /api/todos endpoints.', {
    headers: { 'content-type': 'text/plain' }
  })
}

async function handleAPI(request, url) {
  const path = url.pathname
  const method = request.method

  try {
    // GET /api/todos - List all todos
    if (path === '/api/todos' && method === 'GET') {
      return await listTodos(url)
    }

    // POST /api/todos - Create new todo
    if (path === '/api/todos' && method === 'POST') {
      return await createTodo(request)
    }

    // GET /api/todos/:id - Get single todo
    const getMatch = path.match(/^\/api\/todos\/([^/]+)$/)
    if (getMatch && method === 'GET') {
      return await getTodo(getMatch[1])
    }

    // PUT /api/todos/:id - Update todo
    const putMatch = path.match(/^\/api\/todos\/([^/]+)$/)
    if (putMatch && method === 'PUT') {
      return await updateTodo(putMatch[1], request)
    }

    // DELETE /api/todos/:id - Delete todo
    const deleteMatch = path.match(/^\/api\/todos\/([^/]+)$/)
    if (deleteMatch && method === 'DELETE') {
      return await deleteTodo(deleteMatch[1])
    }

    return jsonResponse({ error: 'Not found' }, 404)
  } catch (error) {
    console.error('API error:', error)
    return jsonResponse({ error: error.message }, 500)
  }
}

// List todos with optional filters
async function listTodos(url) {
  const completed = url.searchParams.get('completed')
  const limit = parseInt(url.searchParams.get('limit')) || 100

  // Get list of todo IDs
  const idsJson = await TODOS.get('todos:ids')
  const ids = idsJson ? JSON.parse(idsJson) : []

  // Fetch all todos
  const todos = []
  for (const id of ids.slice(0, limit)) {
    const todoJson = await TODOS.get(`todo:${id}`)
    if (todoJson) {
      const todo = JSON.parse(todoJson)
      // Filter by completed status if specified
      if (completed === null || todo.completed === (completed === 'true')) {
        todos.push(todo)
      }
    }
  }

  // Sort by createdAt descending
  todos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return jsonResponse(todos)
}

// Create new todo
async function createTodo(request) {
  const body = await request.json()
  const { text, due, priority } = body

  if (!text || text.trim().length === 0) {
    return jsonResponse({ error: 'Text is required' }, 400)
  }

  const id = generateId()
  const now = new Date().toISOString()
  
  const todo = {
    id,
    text: text.trim(),
    completed: false,
    createdAt: now,
    updatedAt: now,
    due: due || null,
    priority: priority || 'medium'
  }

  // Save todo
  await TODOS.put(`todo:${id}`, JSON.stringify(todo))

  // Update ID list
  const idsJson = await TODOS.get('todos:ids')
  const ids = idsJson ? JSON.parse(idsJson) : []
  ids.unshift(id)
  await TODOS.put('todos:ids', JSON.stringify(ids))

  return jsonResponse(todo, 201)
}

// Get single todo
async function getTodo(id) {
  const todoJson = await TODOS.get(`todo:${id}`)
  
  if (!todoJson) {
    return jsonResponse({ error: 'Todo not found' }, 404)
  }

  return jsonResponse(JSON.parse(todoJson))
}

// Update todo
async function updateTodo(id, request) {
  const todoJson = await TODOS.get(`todo:${id}`)
  
  if (!todoJson) {
    return jsonResponse({ error: 'Todo not found' }, 404)
  }

  const todo = JSON.parse(todoJson)
  const body = await request.json()

  // Update fields
  if (body.text !== undefined) todo.text = body.text.trim()
  if (body.completed !== undefined) todo.completed = body.completed
  if (body.due !== undefined) todo.due = body.due
  if (body.priority !== undefined) todo.priority = body.priority
  
  todo.updatedAt = new Date().toISOString()

  await TODOS.put(`todo:${id}`, JSON.stringify(todo))

  return jsonResponse(todo)
}

// Delete todo
async function deleteTodo(id) {
  const todoJson = await TODOS.get(`todo:${id}`)
  
  if (!todoJson) {
    return jsonResponse({ error: 'Todo not found' }, 404)
  }

  // Delete todo
  await TODOS.delete(`todo:${id}`)

  // Remove from ID list
  const idsJson = await TODOS.get('todos:ids')
  if (idsJson) {
    const ids = JSON.parse(idsJson)
    const newIds = ids.filter(i => i !== id)
    await TODOS.put('todos:ids', JSON.stringify(newIds))
  }

  return jsonResponse({ success: true, id })
}

// Helper: Generate unique ID
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Helper: JSON response
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json',
      ...corsHeaders
    }
  })
}
