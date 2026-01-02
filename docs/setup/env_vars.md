# Environment Variables Setup

## Authentication & Security

To enable the new Authentication system (User Stories 1 & 2), you must configure the following variables in your `.env` file (backend) and `.env.local` (frontend).

### Backend (`backend/.env`)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `SECRET_KEY` | Secret key for JWT signing. Generate using `openssl rand -hex 32`. | Yes | - |
| `ALGORITHM` | Hashing algorithm for JWT. | No | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token lifetime in minutes. | No | `30` |
| `GOOGLE_CLIENT_ID` | OAuth2 Client ID from Google Cloud Console. | Yes (for Social Login) | - |
| `GOOGLE_CLIENT_SECRET` | OAuth2 Client Secret from Google Cloud Console. | Yes (for Social Login) | - |
| `FRONTEND_URL` | URL of the frontend for redirects. | Yes | `http://localhost:3000` |

### Frontend (`frontend/.env.local`)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | URL of the backend API. | Yes | `http://localhost:8000/api/v1` |

## Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project.
3. Configure OAuth Consent Screen (External, Test mode).
4. Create Credentials -> OAuth Client ID (Web Application).
5. Add Authorized Redirect URI: `http://localhost:8000/api/v1/auth/google/callback`.
6. Copy Client ID and Secret to `.env`.
