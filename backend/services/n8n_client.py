"""
n8n webhook client for the Fashion Shop backend.

Notifies n8n workflows about shop events (e.g. new order placed) via HTTP
webhooks so you can build automations without touching this codebase:

- New COD order -> send WhatsApp / Email / Slack notification to admin
- New order -> update external CRM / spreadsheet
- Order status change -> notify customer

Configure in backend/.env:
  N8N_WEBHOOK_URL=https://your-n8n-instance/webhook/your-webhook-id
  N8N_API_KEY=optional-secret-for-signing-requests
"""

import os
import json
import hmac
import hashlib
from typing import Any, Dict, Optional

import httpx

N8N_WEBHOOK_URL = os.getenv("N8N_WEBHOOK_URL", "").strip()
N8N_API_KEY = os.getenv("N8N_API_KEY", "").strip()


def _sign(payload: str) -> str:
    if not N8N_API_KEY:
        return ""
    return hmac.new(
        N8N_API_KEY.encode("utf-8"), payload.encode("utf-8"), hashlib.sha256
    ).hexdigest()


async def send_webhook(event: str, data: Dict[str, Any]) -> Optional[httpx.Response]:
    """POST an event to the configured n8n webhook URL.

    Silently returns None when N8N_WEBHOOK_URL is not configured so the
    shop keeps working even if n8n is not set up yet.
    """
    if not N8N_WEBHOOK_URL:
        return None

    payload = {
        "event": event,
        "timestamp": __import__("datetime").datetime.utcnow().isoformat() + "Z",
        "data": data,
    }
    body = json.dumps(payload)

    headers = {"Content-Type": "application/json"}
    signature = _sign(body)
    if signature:
        headers["X-N8N-Signature"] = signature

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            return await client.post(N8N_WEBHOOK_URL, content=body, headers=headers)
    except Exception:
        # n8n being unreachable must never break the checkout flow.
        return None


def notify_order_placed_sync(order: Dict[str, Any]) -> Optional[httpx.Response]:
    """Fire-and-forget sync variant for use from sync FastAPI routes."""
    if not N8N_WEBHOOK_URL:
        return None

    payload = {
        "event": "order.placed",
        "timestamp": __import__("datetime").datetime.utcnow().isoformat() + "Z",
        "data": order,
    }
    body = json.dumps(payload)

    headers = {"Content-Type": "application/json"}
    signature = _sign(body)
    if signature:
        headers["X-N8N-Signature"] = signature

    try:
        with httpx.Client(timeout=5.0) as client:
            return client.post(N8N_WEBHOOK_URL, content=body, headers=headers)
    except Exception:
        return None


async def notify_order_placed(order: Dict[str, Any]) -> Optional[httpx.Response]:
    return await send_webhook("order.placed", order)
