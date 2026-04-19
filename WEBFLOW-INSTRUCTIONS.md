# GrowPro Configurator — Webflow Setup Instructions

The configurator is split into **3 tiny pieces** that load the CSS and JS from GitHub CDN. This keeps each piece well under Webflow's character limits.

---

## Step 1: Add Head Code (369 chars)

1. Go to **Site Settings** > **Custom Code** > **Head Code**
2. Paste the contents of `PASTE-1-HEAD-CODE.html`

This loads the Google Fonts and the configurator CSS from GitHub CDN.

---

## Step 2: Add the HTML Embed (17,222 chars)

1. Open the page where you want the configurator
2. Add an **Embed** component (HTML Embed block)
3. Paste the contents of `PASTE-2-EMBED-HTML.html` (this is the same file as `webflow-embed.html`)

This is the HTML structure — all the cards, forms, sidebar, and mobile bar.

> **Note:** Webflow's embed limit is 10,000 characters per embed block. Since this HTML is 17,222 chars, you may need to **split it across 2 embed blocks** placed one after the other. I've marked a good split point below.

### If you need to split into 2 embeds:

**Embed Block 1** — Everything from the start through the end of Step 3 (up to and including `</div>` after the Step 3 btn-nav)

**Embed Block 2** — Step 4, Step 5, the sidebar, mobile bar, and footer

---

## Step 3: Add Footer Code (201 chars)

1. Go to **Site Settings** > **Custom Code** > **Footer Code**
2. Paste the contents of `PASTE-3-FOOTER-CODE.html`

This loads the JavaScript from GitHub CDN.

---

## Webhook Setup

To connect to your GHL webhook, edit the JS file in your GitHub repo:

1. Go to https://github.com/jessicaciernia-cyber/growpro-configurator
2. Edit `growpro.js`
3. Change `YOUR_GHL_WEBHOOK_URL_HERE` on line 1 to your actual webhook URL
4. Commit the change — jsDelivr CDN will update within minutes

---

## File Summary

| File | Where to paste | Size |
|------|---------------|------|
| `PASTE-1-HEAD-CODE.html` | Site Settings > Custom Code > Head Code | 369 chars |
| `webflow-embed.html` | Page > Embed block(s) | 17,222 chars |
| `PASTE-3-FOOTER-CODE.html` | Site Settings > Custom Code > Footer Code | 201 chars |

---

## GitHub Repo

Your CSS and JS are hosted at:
https://github.com/jessicaciernia-cyber/growpro-configurator

CDN URLs (auto-served by jsDelivr):
- CSS: `https://cdn.jsdelivr.net/gh/jessicaciernia-cyber/growpro-configurator@master/growpro.css`
- JS: `https://cdn.jsdelivr.net/gh/jessicaciernia-cyber/growpro-configurator@master/growpro.js`

Any changes you push to the repo will automatically be reflected on your site.
