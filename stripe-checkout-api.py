"""
GrowPro Stripe Checkout API
Creates dynamic Stripe Checkout sessions with the exact configurator total.
Runs on port 9090, proxied from the configurator HTML.
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import stripe
import os

app = FastAPI()

# Allow CORS from any origin (Webflow embeds)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["*"],
)

# Stripe restricted key loaded from environment variable
# Set STRIPE_KEY env var before running: export STRIPE_KEY="rk_live_..."
STRIPE_KEY = os.environ.get("STRIPE_KEY", "")
if not STRIPE_KEY:
    print("WARNING: STRIPE_KEY environment variable not set!")
stripe.api_key = STRIPE_KEY


@app.post("/create-checkout")
async def create_checkout(request: Request):
    """
    Expects JSON:
    {
        "email": "customer@example.com",
        "amount_cents": 850000,        # e.g. $8,500.00 = 850000
        "description": "GrowPro Launch — Template Launch + HRT",
        "line_items": [                 # optional breakdown
            {"name": "Template Launch", "amount_cents": 850000},
            {"name": "HRT Add-On", "amount_cents": 250000}
        ],
        "mode": "payment",             # "payment" for one-time, "subscription" for monthly
        "monthly_cents": 0,            # if there's a recurring component
        "success_url": "https://growpro.co/thank-you",
        "cancel_url": "https://growpro.co"
    }
    """
    try:
        data = await request.json()
        email = data.get("email", "")
        description = data.get("description", "GrowPro Services")
        success_url = data.get("success_url", "https://growpro.co/thank-you")
        cancel_url = data.get("cancel_url", "https://growpro.co")
        line_items_data = data.get("line_items", [])
        mode = data.get("mode", "payment")
        monthly_cents = data.get("monthly_cents", 0)

        checkout_line_items = []

        # If line items provided, create individual items
        if line_items_data:
            for item in line_items_data:
                if item.get("amount_cents", 0) > 0:
                    checkout_line_items.append({
                        "price_data": {
                            "currency": "usd",
                            "product_data": {
                                "name": item["name"],
                            },
                            "unit_amount": item["amount_cents"],
                        },
                        "quantity": 1,
                    })
        else:
            # Fallback: single line item with total
            amount_cents = data.get("amount_cents", 0)
            if amount_cents <= 0:
                return JSONResponse(
                    status_code=400,
                    content={"error": "Invalid amount"}
                )
            checkout_line_items.append({
                "price_data": {
                    "currency": "usd",
                    "product_data": {
                        "name": description,
                    },
                    "unit_amount": amount_cents,
                },
                "quantity": 1,
            })

        # If there's a monthly recurring component, add it as a subscription item
        # But Stripe doesn't allow mixing one-time and subscription in same session
        # So for launch (one-time + monthly), we do one-time only and note the monthly
        # For marketing (all monthly), we use subscription mode

        if mode == "subscription" and monthly_cents > 0:
            # Marketing: recurring monthly
            checkout_line_items = []
            for item in line_items_data:
                if item.get("amount_cents", 0) > 0:
                    recurring = item.get("recurring", False)
                    price_data = {
                        "currency": "usd",
                        "product_data": {
                            "name": item["name"],
                        },
                        "unit_amount": item["amount_cents"],
                    }
                    if recurring:
                        price_data["recurring"] = {"interval": "month"}
                    checkout_line_items.append({
                        "price_data": price_data,
                        "quantity": 1,
                    })

        session_params = {
            "payment_method_types": ["card"],
            "line_items": checkout_line_items,
            "mode": mode,
            "success_url": success_url,
            "cancel_url": cancel_url,
        }

        if email:
            session_params["customer_email"] = email

        session = stripe.checkout.Session.create(**session_params)

        return JSONResponse(content={"url": session.url})

    except stripe.error.StripeError as e:
        return JSONResponse(
            status_code=400,
            content={"error": str(e)}
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )


@app.get("/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9090)
