from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from pathlib import Path
import os
import time
import requests

load_dotenv(Path(__file__).resolve().parent / ".env")

app = Flask(__name__)
CORS(app)

# OpenRouter free-model key. Accept either name so existing setups keep working.
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY") or os.getenv("OPENAI_API_KEY")
# Prefer a free model that is currently serving well; override in .env if you want.
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "nvidia/nemotron-3.5-lightning:free")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

# One fallback only — avoid spamming OpenRouter with a long retry chain.
FALLBACK_FREE_MODELS = [
    "thinkingmachines/inkling-2-small:free",
]

# Cache OpenRouter quota locally so /api/usage does not hit them every time.
USAGE_CACHE_TTL_SECONDS = int(os.getenv("USAGE_CACHE_TTL_SECONDS", "300"))  # 5 min
_usage_cache = {
    "data": None,
    "fetched_at": 0.0,
}


def _is_upstream_shared_pool_limit(payload):
    err = (payload or {}).get("error") or {}
    meta = err.get("metadata") or {}
    raw = str(meta.get("raw") or "")
    return (
        meta.get("limit_source") == "upstream_provider_shared_pool"
        or "temporarily rate-limited upstream" in raw
        or "upstream_provider_shared_pool" in raw
    )


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


def _fetch_usage_from_openrouter():
    """One network call to OpenRouter key endpoint."""
    if not OPENROUTER_API_KEY:
        return None
    response = requests.get(
        "https://openrouter.ai/api/v1/key",
        headers={"Authorization": f"Bearer {OPENROUTER_API_KEY}"},
        timeout=15,
    )
    if response.status_code != 200:
        return None
    usage = response.json().get("data", {}).get("free_model_daily_requests")
    if not isinstance(usage, dict):
        return None
    return {
        "used": usage.get("used", 0),
        "limit": usage.get("limit", 50),
        "remaining": usage.get("remaining", 0),
    }


def _get_cached_usage(force_refresh=False):
    """Return cached usage; refresh from OpenRouter only when needed."""
    now = time.time()
    cache_age = now - _usage_cache["fetched_at"]
    if (
        not force_refresh
        and _usage_cache["data"] is not None
        and cache_age < USAGE_CACHE_TTL_SECONDS
    ):
        return dict(_usage_cache["data"])

    try:
        data = _fetch_usage_from_openrouter()
    except requests.RequestException as exc:
        print("Failed to fetch OpenRouter usage:", exc)
        return dict(_usage_cache["data"]) if _usage_cache["data"] else None

    if data is None:
        return dict(_usage_cache["data"]) if _usage_cache["data"] else None

    _usage_cache["data"] = data
    _usage_cache["fetched_at"] = now
    return dict(data)


def _bump_cached_usage(delta=1):
    """Update local counter after a successful chat — no OpenRouter call."""
    current = _get_cached_usage(force_refresh=False)
    if current is None:
        current = {"used": 0, "limit": 50, "remaining": 50}
    used = min(current["limit"], current["used"] + max(0, delta))
    updated = {
        "used": used,
        "limit": current["limit"],
        "remaining": max(0, current["limit"] - used),
    }
    _usage_cache["data"] = updated
    # Keep fetched_at so we do not immediately re-hit OpenRouter.
    if _usage_cache["fetched_at"] == 0:
        _usage_cache["fetched_at"] = time.time()
    return dict(updated)


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "ok": True,
        "model": OPENROUTER_MODEL,
        "has_key": bool(OPENROUTER_API_KEY),
        "usage": _get_cached_usage(force_refresh=False),
    })


@app.route("/api/usage", methods=["GET"])
def usage():
    force = request.args.get("refresh") == "1"
    data = _get_cached_usage(force_refresh=force)
    if data is None:
        return jsonify({"error": "Could not fetch usage"}), 502
    return jsonify(data)


@app.route("/api/chat", methods=["POST"])
def chat():
    if not OPENROUTER_API_KEY:
        return jsonify({
            "reply": "Missing OpenRouter API key. Add OPENROUTER_API_KEY to backend/.env"
        }), 500

    data = request.get_json(silent=True) or {}
    user_message = (data.get("message") or "").strip()
    if not user_message:
        return jsonify({"reply": "Send a message so I can help."}), 400

    total_saved = data.get("totalSaved", 0)
    goals_count = data.get("goalsCount", 0)

    system_instructions = f"""
You are Zeni, a friendly, sharp AI financial assistant for Zenith.
Current live metrics:
- Total Saved: KSh {total_saved}
- Active Goals Count: {goals_count}

Instructions:
- Help with budgeting, saving, and financial goals.
- Reference their exact numbers when useful.
- Keep answers concise, practical, and warm.
- Use Kenyan Shillings (KSh).
""".strip()

    messages = [
        {"role": "system", "content": system_instructions},
        {"role": "user", "content": user_message},
    ]

    models_to_try = [OPENROUTER_MODEL] + [
        m for m in FALLBACK_FREE_MODELS if m != OPENROUTER_MODEL
    ]

    last_payload = None
    last_status = None
    attempts = 0
    cached_usage = _get_cached_usage(force_refresh=False)

    for model in models_to_try:
        attempts += 1
        try:
            response = _call_openrouter(model, messages)
        except requests.RequestException as exc:
            print("OpenRouter request failed:", exc)
            return jsonify({
                "reply": "Could not reach OpenRouter. Check your internet connection.",
                "attempts": attempts,
                "usage": cached_usage,
            }), 502

        last_status = response.status_code

        if response.status_code == 401:
            return jsonify({
                "reply": "OpenRouter rejected the API key. Use a key from https://openrouter.ai/keys",
                "attempts": attempts,
                "usage": cached_usage,
            }), 401

        try:
            result = response.json()
        except ValueError:
            print("OpenRouter non-JSON:", response.status_code, response.text[:300])
            return jsonify({
                "reply": "OpenRouter returned an unexpected response.",
                "attempts": attempts,
                "usage": cached_usage,
            }), 502

        last_payload = result

        if response.status_code == 200:
            choices = result.get("choices") or []
            if not choices:
                continue
            content = choices[0].get("message", {}).get("content")
            if not content:
                continue
            # Count this chat locally — do not call OpenRouter /key again.
            return jsonify({
                "reply": content,
                "model": model,
                "attempts": attempts,
                "usage": _bump_cached_usage(1),
            })

        if response.status_code == 429 and _is_upstream_shared_pool_limit(result):
            # One fallback max; if that also fails we stop (no long retry spam).
            print(f"Upstream free pool busy for {model}; trying next free model if any")
            continue

        if response.status_code == 429:
            return jsonify({
                "reply": "Your OpenRouter free-model daily limit is used up (about 50/day). Try again tomorrow.",
                "attempts": attempts,
                "usage": cached_usage,
            }), 429

        err = result.get("error", {})
        detail = err.get("message") if isinstance(err, dict) else str(err)
        print("OpenRouter error:", response.status_code, detail or result)
        return jsonify({
            "reply": detail or "OpenRouter error. Check model name and API key.",
            "attempts": attempts,
            "usage": cached_usage,
        }), 502

    if last_status == 429 and _is_upstream_shared_pool_limit(last_payload):
        return jsonify({
            "reply": "Free models are temporarily busy on OpenRouter's shared providers. Try again in a minute.",
            "attempts": attempts,
            "usage": cached_usage,
        }), 429

    return jsonify({
        "reply": "No free model replied. Try again shortly.",
        "attempts": attempts,
        "usage": cached_usage,
    }), 502


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
