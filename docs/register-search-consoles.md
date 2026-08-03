# Register unhappypath.dev with Google & Bing

Layer 1 analytics from ADR-0008 / spec §8: free consoles that ship nothing to the
browser. They answer *is the site indexed, and what searches bring people here?*
GoatCounter answers a different question (pageviews + referrers).

Do this after the site is live on `unhappypath.dev`. DNS ownership can be verified
earlier; sitemap submit needs a real deploy.

**Sitemap URL to submit everywhere:**
`https://unhappypath.dev/sitemap.xml`

Do **not** register the `*.pages.dev` preview domain — canonicals already point at
`unhappypath.dev`.

---

## Google Search Console

1. Open [Google Search Console](https://search.google.com/search-console) and sign in
   with a Google account.
2. **Add property** → choose **Domain** (not URL-prefix).
3. Enter `unhappypath.dev` (no `https://`, no `www`).
4. Verify ownership via DNS (domain is on Cloudflare Registrar):
   - If Google offers a **Cloudflare** one-click flow, use it and authorize the TXT
     record.
   - Otherwise: copy the TXT value Google shows → Cloudflare dashboard →
     `unhappypath.dev` → **DNS** → **Add record** → Type `TXT`, Name `@`, Content =
     the Google string → save as **DNS only** (gray cloud, not proxied).
5. Click **Verify** in Search Console. Propagation is usually minutes; can take
   longer.
6. Left nav → **Sitemaps** → submit
   `https://unhappypath.dev/sitemap.xml`.

Leave the verification TXT record in place — Google re-checks it.

---

## Bing Webmaster Tools

1. Open [Bing Webmaster Tools](https://www.bing.com/webmasters) and sign in with a
   Microsoft account.
2. **Add a site** → `https://unhappypath.dev`.
3. Prefer **Import from Google Search Console** if Google is already verified — skips
   a second DNS dance.
4. Otherwise verify with a Cloudflare TXT record the same way as Google.
5. Submit the same sitemap:
   `https://unhappypath.dev/sitemap.xml`.

Bing matters for AEO: its index feeds parts of the ChatGPT ecosystem (spec §8).

---

## Done when

Both consoles show the sitemap as fetched/OK. Then check off the §9 item in
`spec/unhappy-path-website-spec.md` and drop the line from `CONTEXT.md` open TODOs.
