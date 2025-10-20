# Landing Page (Cloudflare Worker)

A minimal landing page Worker that serves a static HTML page linking to all five applications, with a health check endpoint and optional visit counter.

## Features

- ✅ Lightweight single-file Worker
- ✅ Inline HTML and CSS (no external assets)
- ✅ Health check endpoint
- ✅ Optional KV-based visit counter
- ✅ Fast cold starts
- ✅ Responsive design

## Files

- `worker/index.js` - Cloudflare Worker script
- `wrangler.example.toml` - Example Worker configuration
- `README.md` - This file

## Endpoints

### GET /
Returns the landing page HTML with links to all apps.

### GET /health
Returns JSON health status:
```json
{
  "status": "ok",
  "time": "2025-10-20T12:34:56.789Z"
}
```

## Setup

### 1. Create KV Namespace (Optional)

If you want visit counting:

```bash
wrangler kv:namespace create "VISITS"
```

Copy the namespace ID to `wrangler.toml`.

### 2. Configure Worker

```bash
cp wrangler.example.toml wrangler.toml
# Edit wrangler.toml with your settings
```

### 3. Deploy

```bash
wrangler publish
```

## Local Development

```bash
# Run locally
wrangler dev --local

# Or connect to remote KV
wrangler dev
```

Visit http://localhost:8787

## Configuration

Edit `wrangler.toml`:
- `name` - Worker name
- `routes` - Custom domain routes
- `kv_namespaces` - KV binding for analytics

## Testing

```bash
# Test health endpoint
curl http://localhost:8787/health

# Test landing page
curl http://localhost:8787/
```

## Production Notes

- HTML and CSS are inlined for minimal latency
- No external assets to load
- KV operations fail gracefully if not configured
- Suitable for high-traffic scenarios

## Customization

Edit `worker/index.js` to:
- Change page title and description
- Update app links and descriptions
- Modify styling in the `<style>` block
- Add custom analytics logic
- Add more endpoints

## Technologies

- Cloudflare Workers
- Cloudflare KV (optional)
- Vanilla JavaScript
- HTML5
- CSS3
