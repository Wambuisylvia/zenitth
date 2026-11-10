# Zenith

Zenith is a personal finance web app for tracking savings goals, stashing money, learning tips, and chatting with **Zeni** — an AI finance assistant.

This guide walks you from **signup → login → goals → AI chat**, including how to run everything locally and how production hosting works.

---

## What the app does

| Feature | What it is |
|---|---|
| **Signup / Login** | Create an account and sign in |
| **Dashboard** | See goals, savings, learning, and tracking |
| **Goals & Stash** | Create goals and add/withdraw savings |
| **Zeni AI** | Ask budgeting and savings questions |
| **Usage badge** | See how many free AI requests you have left today |

---

## How the system is split

Zenith uses **two backends**:

```
Browser (React app)
   │
   ├── Signup / Login / Goals / M-Pesa
   │      → https://sylviawambuu.alwaysdata.net   (AlwaysData — always online)
   │
   └── Zeni AI chat / usage
          → http://127.0.0.1:5000                 (local Flask while developing)
          → https://sylviawambuu.alwaysdata.net   (AlwaysData when app is deployed)
```

- **AlwaysData** already hosts account and goals APIs.
- **AI chat** talks to **OpenRouter free models** through a small Flask server.
- On your computer, that Flask server runs locally.
- In production, the same chat routes can also live on AlwaysData so AI stays online.

The React chat component auto-picks the AI server:

- Visiting `localhost` → uses `http://127.0.0.1:5000`
- Visiting a deployed site → uses `https://sylviawambuu.alwaysdata.net`
- Optional env override: `REACT_APP_CHAT_API_URL`, `REACT_APP_USAGE_API_URL`, or `REACT_APP_API_BASE_URL`

---

## API integration explained (with real project code)

This section shows **exactly how Zenith talks to APIs**, using the same lines that live in the repo.

### Big picture flow

```text
1) Signup / Login / Goals
   React  --axios-->  AlwaysData Flask APIs

2) Zeni AI chat
   React (ZenithBot.jsx)
      --axios-->  local/prod Flask (/api/chat, /api/usage)
                     --requests-->  OpenRouter (free model)
```

---

### A) Signup API — `src/components/auth/Signup.jsx`

User fills the form → we build `FormData` → POST to AlwaysData.

```js
const user_data = new FormData()
user_data.append("email", email)
user_data.append("username", username)
user_data.append("password", password)
user_data.append("first_name", firstName)
user_data.append("last_name", lastName)

const response = await axios.post(
  "https://sylviawambuu.alwaysdata.net/api/signup",
  user_data
)

if (response.status === 200) {
  setSuccess(response.data.success)
}
```

**What this means:** account creation is handled by the hosted AlwaysData backend. The React app only sends the form fields.

---

### B) Login API — `src/components/auth/Login.jsx`

```js
const user_data = new FormData()
user_data.append("email", email)
user_data.append("password", password)

let response = await axios.post(
  "https://sylviawambuu.alwaysdata.net/api/signin",
  user_data
)

if (response.data.user) {
  localStorage.setItem("user", JSON.stringify(response.data.user))
  navigate("/")
}
```

**What this means:**

1. AlwaysData checks email/password
2. If valid, React stores the user in `localStorage`
3. User is redirected to the dashboard (`/`)

---

### C) Goals APIs — `src/components/dashboard/DashboardComponent.jsx`

After login, the dashboard loads goals for the signed-in user:

```js
const response = await axios.get(
  `https://sylviawambuu.alwaysdata.net/api/goals/${user.id}`
)
if (response.status === 200) {
  setGoals(response.data)
}
```

Creating a goal:

```js
const goal_data = new FormData()
goal_data.append("title", goal_title)
goal_data.append("target_amount", target_amount)
goal_data.append("user_id", user.id)
goal_data.append("target_date", "")
goal_data.append("initial_stash", initial_stash)
goal_data.append("mode", mode)

const response = await axios.post(
  "https://sylviawambuu.alwaysdata.net/api/add_goal",
  goal_data
)
```

**What this means:** goals and stash money stay on AlwaysData (same host as signup/login).

---

### D) AI URL auto-pick — `src/components/chat/ZenithBot.jsx`

Zeni chooses local Flask while developing, AlwaysData when deployed:

```js
const LOCAL_API_BASE = "http://127.0.0.1:5000";
const PROD_API_BASE = "https://sylviawambuu.alwaysdata.net";

const isLocalHost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const API_BASE =
  process.env.REACT_APP_API_BASE_URL ||
  (isLocalHost ? LOCAL_API_BASE : PROD_API_BASE);

const CHAT_API_URL =
  process.env.REACT_APP_CHAT_API_URL || `${API_BASE}/api/chat`;

const USAGE_API_URL =
  process.env.REACT_APP_USAGE_API_URL || `${API_BASE}/api/usage`;
```

**What this means:**

| Where you open the app | Chat goes to |
|---|---|
| `localhost` / `127.0.0.1` | `http://127.0.0.1:5000/api/chat` |
| Deployed website | `https://sylviawambuu.alwaysdata.net/api/chat` |
| Env override set | whatever you put in `REACT_APP_*` |

---

### E) Load free AI usage once — `ZenithBot.jsx`

When the chat opens, React asks our backend for the quota badge (not OpenRouter directly):

```js
useEffect(() => {
  (async () => {
    const response = await axios.get(USAGE_API_URL);
    applyUsage(response.data); // { used, limit, remaining }
  })();
}, []);
```

---

### F) Send a chat message — `ZenithBot.jsx`

```js
const response = await axios.post(CHAT_API_URL, {
  message: userMessageText,
  totalSaved: totalSaved,
  goalsCount: goals ? goals.length : 0
});

applyUsage(response.data.usage); // live badge update from backend cache

if (response.status === 200 && response.data.reply) {
  addMessage("bot", response.data.reply);
}
```

**What this means:**

1. Browser sends message + savings context to `/api/chat`
2. Backend returns `{ reply, model, usage }`
3. UI shows the bot reply and updates `used / remaining`

The browser **never** sees your OpenRouter key.

---

### G) Flask loads the OpenRouter key — `backend/app.py`

```python
load_dotenv(Path(__file__).resolve().parent / ".env")

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY") or os.getenv("OPENAI_API_KEY")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "nvidia/nemotron-3.5-lightning:free")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
```

Key lives in `backend/.env`:

```env
OPENROUTER_API_KEY=sk-or-v1-your-key-here
OPENROUTER_MODEL=nvidia/nemotron-3.5-lightning:free
```

---

### H) Flask calls OpenRouter — `backend/app.py`

```python
def _call_openrouter(model, messages):
    return requests.post(
        OPENROUTER_URL,
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Zenith Zeni Bot",
        },
        json={"model": model, "messages": messages},
        timeout=60,
    )
```

Inside `/api/chat`, the backend builds the prompt with live savings numbers, then calls OpenRouter:

```python
system_instructions = f"""
You are Zeni, a friendly, sharp AI financial assistant for Zenith.
Current live metrics:
- Total Saved: KSh {total_saved}
- Active Goals Count: {goals_count}
...
"""

messages = [
    {"role": "system", "content": system_instructions},
    {"role": "user", "content": user_message},
]

response = _call_openrouter(model, messages)
```

On success it returns the model text and bumps the **local** usage cache (no extra OpenRouter quota call):

```python
return jsonify({
    "reply": content,
    "model": model,
    "attempts": attempts,
    "usage": _bump_cached_usage(1),
})
```

---

### I) Usage cache (avoid OpenRouter spam) — `backend/app.py`

We cache quota for 5 minutes and update it locally after each successful chat:

```python
USAGE_CACHE_TTL_SECONDS = 300  # 5 minutes
_usage_cache = {"data": None, "fetched_at": 0.0}

def _get_cached_usage(force_refresh=False):
    # return cached value unless expired / forced
    ...

def _bump_cached_usage(delta=1):
    # used += 1, remaining -= 1 locally — no OpenRouter HTTP call
    ...
```

Endpoints:

| Route | Purpose |
|---|---|
| `GET /api/health` | Is backend up? which model? has key? |
| `GET /api/usage` | Return cached `{ used, limit, remaining }` |
| `POST /api/chat` | Send message → OpenRouter → reply + updated usage |

Force a fresh OpenRouter quota read only when needed:

```bash
curl "http://127.0.0.1:5000/api/usage?refresh=1"
```

---

### J) End-to-end AI request (one message)

```text
User types in Zeni
   → ZenithBot.jsx axios.post(CHAT_API_URL, { message, totalSaved, goalsCount })
      → backend/app.py  @app.route("/api/chat")
         → _call_openrouter(... free model ...)
            → OpenRouter returns assistant text
         → _bump_cached_usage(1)
         → jsonify({ reply, usage })
   → React shows reply + updates Free AI badge
```

That is the full API integration path in this project.

---

## Prerequisites

Install these first:

1. **Node.js** (for the React app)
2. **Python 3** (for the local AI backend)
3. An **OpenRouter account** + free API key → [https://openrouter.ai/keys](https://openrouter.ai/keys)

---

## 1) Install the React app

```bash
cd zenitth
npm install
```

Start the frontend:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000).

Useful pages:

| Page | URL |
|---|---|
| Home / marketing | `/home` |
| Signup | `/signup` |
| Login | `/login` |
| Dashboard (after login) | `/` |

---

## 2) Sign up and log in

Signup and login are already hosted on AlwaysData, so you do **not** need a local database for accounts.

### Sign up

1. Go to `/signup`
2. Enter email, username, first name, last name, password
3. Submit

The app posts to:

```text
POST https://sylviawambuu.alwaysdata.net/api/signup
```

### Log in

1. Go to `/login`
2. Enter email + password
3. On success, your user is stored in `localStorage` and you are sent to the dashboard (`/`)

The app posts to:

```text
POST https://sylviawambuu.alwaysdata.net/api/signin
```

### Goals after login

Once logged in, goals are loaded and saved through AlwaysData, for example:

- `GET https://sylviawambuu.alwaysdata.net/api/goals/<user_id>`
- `POST https://sylviawambuu.alwaysdata.net/api/add_goal`
- `POST https://sylviawambuu.alwaysdata.net/api/stash`

---

## 3) Set up the AI backend (Zeni)

Zeni does **not** call OpenRouter from the browser.  
The React app talks to a small Flask backend, and that backend talks to OpenRouter. This keeps your API key private.

### Install Python packages

```bash
pip install -r backend/requirements.txt
```

### Add your OpenRouter key

Copy the example env file:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
# Get a free key at https://openrouter.ai/keys
OPENROUTER_API_KEY=sk-or-v1-your-key-here

# Free model (recommended default)
OPENROUTER_MODEL=nvidia/nemotron-3.5-lightning:free
```

Important:

- Put the real key in **`backend/.env`**
- Do **not** put secrets in `backend/.env.example`
- Never commit `.env` to GitHub

### Start the AI backend

In a second terminal:

```bash
npm run backend
```

or:

```bash
python backend/app.py
```

You should see it running on:

```text
http://127.0.0.1:5000
```

Quick checks:

```bash
curl http://127.0.0.1:5000/api/health
curl http://127.0.0.1:5000/api/usage
```

Healthy response looks like:

```json
{
  "ok": true,
  "model": "nvidia/nemotron-3.5-lightning:free",
  "has_key": true,
  "usage": { "used": 0, "limit": 50, "remaining": 50 }
}
```

---

## 4) Use Zeni in the app

1. Log in
2. Open the dashboard
3. Open the **Zeni Finance Assistant** chat tab
4. Ask something like:
   - “Help me budget with the 50/30/20 rule”
   - “How can I save for an emergency fund?”
   - “Give me a weekly savings tip”

What happens behind the scenes:

1. React sends your message to `/api/chat`
2. Flask adds your savings context (total saved + goals count)
3. Flask asks OpenRouter (free model)
4. Reply comes back into the chat
5. The usage badge updates (`used` / `limit` / `remaining`)

### Free AI daily limit

OpenRouter free models usually allow about **50 requests per day** per key.

The chat header shows something like:

```text
Free AI
45 left
5/50 used
```

Notes:

- That is **your account quota**, not “the app is broken”
- Sometimes a specific free model can be busy upstream (shared provider pool).  
  Our backend automatically tries fallback free models when that happens.
- Current default model: `nvidia/nemotron-3.5-lightning:free`
- You can change it in `backend/.env` with `OPENROUTER_MODEL=...`

Other free options you can try:

- `google/gemma-4-31b-it:free`
- `openrouter/free` (auto-picks a free model)

---

## 5) Local + AlwaysData together

Yes — you can use both.

| Where you run the app | Where AI chat goes |
|---|---|
| Local React (`localhost`) | Local Flask (`127.0.0.1:5000`) |
| Deployed React site | AlwaysData (`sylviawambuu.alwaysdata.net`) |

Optional overrides (React env):

```env
REACT_APP_API_BASE_URL=https://sylviawambuu.alwaysdata.net
# or more specific:
REACT_APP_CHAT_API_URL=https://sylviawambuu.alwaysdata.net/api/chat
REACT_APP_USAGE_API_URL=https://sylviawambuu.alwaysdata.net/api/usage
```

If both local and AlwaysData share the **same OpenRouter key**, they also share the same 50/day free quota.

---

## 6) Deploy AI chat to AlwaysData (so it stays online)

Signup already lives on AlwaysData. To make AI always online too:

1. Add the chat routes from `backend/app.py` into your AlwaysData Flask app:
   - `POST /api/chat`
   - `GET /api/usage`
   - `GET /api/health` (optional but useful)
2. In AlwaysData admin, set environment variables:
   - `OPENROUTER_API_KEY=sk-or-v1-...`
   - `OPENROUTER_MODEL=nvidia/nemotron-3.5-lightning:free`
3. Redeploy / restart the AlwaysData site
4. Test:

```bash
curl https://sylviawambuu.alwaysdata.net/api/usage
curl -X POST https://sylviawambuu.alwaysdata.net/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Give me one short savings tip","totalSaved":1000,"goalsCount":1}'
```

Once those routes exist on AlwaysData, a deployed React build will use them automatically.

---

## Project structure (simple map)

```text
zenitth/
├── backend/
│   ├── app.py              # Local AI chat backend (OpenRouter)
│   ├── .env.example        # Example env (safe to commit)
│   ├── .env                # Your real key (do NOT commit)
│   └── requirements.txt
├── src/
│   ├── components/
│   │   ├── auth/           # Signup + Login
│   │   ├── chat/ZenithBot.jsx   # Zeni AI UI
│   │   ├── dashboard/      # Main app after login
│   │   ├── goals/          # Goals UI
│   │   └── ...
│   └── App.js              # Routes
├── package.json
└── README.md
```

---

## Daily developer workflow

Open **two terminals**:

**Terminal 1 — frontend**

```bash
npm start
```

**Terminal 2 — AI backend**

```bash
npm run backend
```

Then:

1. Open [http://localhost:3000/signup](http://localhost:3000/signup) (or `/login`)
2. Sign in
3. Use goals as normal
4. Chat with Zeni
5. Watch the free AI usage badge update

---

## Troubleshooting

### “Chat backend is offline”
Start Flask:

```bash
npm run backend
```

### “Missing OpenRouter API key”
Create `backend/.env` and add `OPENROUTER_API_KEY=...`, then restart the backend.

### “OpenRouter rejected the API key”
Use an OpenRouter key (`sk-or-v1-...`) from [https://openrouter.ai/keys](https://openrouter.ai/keys), not a normal OpenAI key.

### “Free models are temporarily busy…”
That free model’s shared provider is congested. Wait a minute, or switch `OPENROUTER_MODEL` in `.env`. The backend also tries fallbacks automatically.

### “Your OpenRouter free-model daily limit is used up”
You hit your **50/day** free quota. Wait for reset, buy OpenRouter credits, or use another key.

### Signup works but AI does not
That is expected if only AlwaysData auth is online and local Flask is not running.  
Auth ≠ AI. Start `npm run backend` for local AI.

### Usage badge does not show
Check:

```bash
curl http://127.0.0.1:5000/api/usage
```

If this fails, the frontend cannot load the quota.

---

## Security reminders

- Keep `OPENROUTER_API_KEY` on the server only (`backend/.env` or AlwaysData env vars)
- Never put the key in React code
- Never commit `.env`
- Treat free AI quotas like shared daily credits for that key

---

## Scripts

| Command | What it does |
|---|---|
| `npm start` | Start React app |
| `npm run backend` | Start local AI Flask server |
| `npm run build` | Build production frontend |
| `npm test` | Run tests |

---

## Summary

1. **Accounts & goals** → AlwaysData (already online)  
2. **AI chat** → Flask + OpenRouter free models  
3. **Local development** → `npm start` + `npm run backend`  
4. **Production AI** → deploy chat routes to AlwaysData and set the OpenRouter key there  

That is the full path from signup to Zeni.
