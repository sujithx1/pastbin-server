
## Running Locally
See individual README files inside `frontend` and `backend`.

## Persistence Layer
This project uses **Upstash Redis**, a serverless Redis solution that works well with serverless deployments
and survives across requests.

## Notes
- In-memory storage is avoided to support serverless environments
- Redis TTL is used for automatic expiry
- View counts are decremented atomically to avoid race conditions

GET /api/healthz

Response:
```json
{ "ok": true }


Create Paste
POST /api/pastes

Request body:

{
  "content": "Hello world",
  "ttl_seconds": 60,
  "max_views": 5
}


Response:

{
  "id": "abc123xyz",
  "url": "https://your-domain/p/abc123xyz"
}


Get Paste
GET /api/pastes/:id


Response:

{
  "content": "Hello world",
  "remaining_views": 4,
  "expires_at": "2026-01-01T00:00:00.000Z"
}


Unavailable pastes return:

404 Not Found

🧠 Persistence Layer

Upstash Redis

Why Redis?

Survives serverless restarts

Supports TTL natively

