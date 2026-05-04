# Setup Guide — BYOK AI Gateway

Complete deployment guide for Vercel + Appwrite.

## Prerequisites

- Node.js 18+
- [Appwrite Cloud](https://cloud.appwrite.io) account (free tier works)
- [Vercel](https://vercel.com) account

---

## Step 1: Appwrite Setup

### 1.1 Create Project

1. Go to [cloud.appwrite.io](https://cloud.appwrite.io)
2. Create new project, note the **Project ID**
3. Go to **Settings → API Keys**, create a key with all database scopes
4. Note your **API Key** and **Endpoint** (e.g., `https://cloud.appwrite.io/v1`)

### 1.2 Initialize Collections

```bash
# Clone the repo first
git clone <your-repo>
cd byok-platform
npm install

# Create .env.local
cp .env.example .env.local
```

Edit `.env.local`:
```env
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id_here
APPWRITE_API_KEY=your_api_key_here
APPWRITE_DATABASE_ID=byok_db
```

Then run:
```bash
node scripts/init-appwrite.js
```

This creates all 4 collections with proper attributes.

---

## Step 2: Generate Secrets

```bash
# JWT Secret (32+ chars)
openssl rand -base64 32

# Encryption Key (64 hex chars = 32 bytes for AES-256)
openssl rand -hex 32
```

Save these — you'll need them for Vercel.

---

## Step 3: Deploy to Vercel

### 3.1 Push to GitHub

```bash
git add .
git commit -m "Initial BYOK gateway"
git push origin main
```

### 3.2 Connect to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Framework: **Next.js** (auto-detected)

### 3.3 Set Environment Variables

In Vercel project → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `APPWRITE_ENDPOINT` | `https://cloud.appwrite.io/v1` |
| `APPWRITE_PROJECT_ID` | Your Appwrite project ID |
| `APPWRITE_API_KEY` | Your Appwrite API key |
| `APPWRITE_DATABASE_ID` | `byok_db` |
| `JWT_SECRET` | Output of `openssl rand -base64 32` |
| `ENCRYPTION_KEY` | Output of `openssl rand -hex 32` |
| `ADMIN_EMAIL` | Your login email |
| `ADMIN_PASSWORD` | Your login password (dev) |
| `NEXT_PUBLIC_APP_URL` | Your Vercel URL |

For production, use bcrypt hash instead of plain password:
```bash
node -e "const b = require('bcryptjs'); b.hash('yourpassword', 12).then(console.log)"
# → set ADMIN_PASSWORD_HASH to the output
```

### 3.4 Deploy

Click **Deploy**. Vercel will build and deploy automatically.

---

## Step 4: First Login

1. Visit your Vercel URL
2. Login with your `ADMIN_EMAIL` + `ADMIN_PASSWORD`
3. Go to **API Keys** → Add your first provider key
4. Go to **Gateway Keys** → Generate a `byok_*` key
5. Test with curl:

```bash
curl https://your-app.vercel.app/api/v1/chat/completions \
  -H "Authorization: Bearer byok_<keyId>_<secret>" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

---

## Provider-Specific Key Formats

Most providers: just the plain API key.

**Special formats:**

| Provider | Key Format |
|----------|-----------|
| AWS Bedrock | `accessKeyId:secretAccessKey:region` or JSON |
| Azure OpenAI | `endpoint\|apiKey\|deploymentName` |
| Google Vertex AI | JSON: `{"projectId":"...","location":"...","accessToken":"..."}` |
| IBM watsonx | `apiKey:projectId` or JSON |
| Cloudflare Workers AI | `accountId:apiToken` |
| Ollama (local) | Base URL, e.g. `http://localhost:11434` |
| Custom endpoint | `https://your-endpoint.com/v1\|optionalToken` |
| Portkey | `portkeyApiKey:virtualKey` (virtual key optional) |

---

## Local Development

```bash
npm install
cp .env.example .env.local
# Fill in .env.local
npm run dev
```

Visit `http://localhost:3000`

---

## Vercel Function Limits

The gateway has a 60s timeout configured in `vercel.json`. For providers that poll (e.g., Replicate), this may be limiting. Consider increasing to 300s (Pro plan) for those workloads.

---

## Security Checklist

- [ ] `ENCRYPTION_KEY` is a fresh 64-char hex string (not the example)
- [ ] `JWT_SECRET` is a fresh random string
- [ ] `ADMIN_PASSWORD_HASH` set (not plain `ADMIN_PASSWORD`)
- [ ] Appwrite API key scoped to databases only
- [ ] `APPWRITE_API_KEY` is server-only (not prefixed with `NEXT_PUBLIC_`)
