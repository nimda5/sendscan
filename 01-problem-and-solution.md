# Scan-to-Mail — Problem & Solution (draft v1)

## Problem

Modern office/home printers almost universally support "Scan to Email," but almost nobody uses it because:

1. **SMTP setup is technical.** To enable Scan-to-Email, the printer needs an SMTP server, port, encryption mode, username, and password. Most users (and even many IT admins) don't know these values or how to get them from their email provider (especially with OAuth-only providers like Gmail/Office 365 blocking basic SMTP auth).
2. **The alternative workflows are worse.** Without Scan-to-Email, people scan to a USB flash drive (have to carry one, find a free USB port, transfer files later) or install a vendor scanning app (different app per printer brand, account setup, permissions, desktop software to install).
3. **No history.** Even when Scan-to-Email works, scans just land in an inbox mixed with everything else — there's no dedicated, searchable archive of "everything I've scanned on this printer."
4. **It's a one-time-per-printer task nobody wants to repeat.** Every new printer (new office, new home device, replaced hardware) means redoing the whole SMTP configuration from scratch.

## User stories (why scanning is actually hard)

These are the concrete, human situations behind the abstract problem list above. Useful raw material for landing-page copy ("does this sound like you?").

1. **The one configured device in the house.** In a household with several people, only one person ever gets around to setting up Scan-to-Email — usually on one specific printer. Everyone else in the family just asks that person to scan things for them, even for their own documents, because their own printer/login isn't set up and they don't know how. Scanning becomes a favor you ask someone, not something you do yourself.
2. **The office admin's endless queue.** An office admin manages several printers/scanners. Every time someone new joins, or a new device is added, the whole SMTP setup has to be repeated by hand, per device, per person, per printer's own settings menu. It never ends and never gets faster.
3. **Wrong-scanner mistakes, even with an app.** Even where a scanning app *is* installed, people scan on the wrong physical device out of habit (the nearest one, or the one they used last time) — and the file goes nowhere useful, or nowhere at all, because only *one specific* scanner was ever configured for them.
4. **New hire, new ticket.** Onboarding a new employee means an IT ticket just to "add my email to the scanner" — a low-value, repetitive task that still requires someone to physically walk to the device and click through vendor menus.
5. **The printer swap resets everything.** A printer breaks or gets replaced/upgraded. All the SMTP configuration on it is gone. Nobody remembers the exact settings that worked, so scanning is broken again until someone finds time to redo it from scratch.
6. **Multi-brand office chaos.** A company has printers from two or three different vendors bought over the years. Each brand's Scan-to-Email menu looks nothing like the others, so "how do I set up scanning" has a different answer for every device, and no one person reliably knows all of them.
7. **The guest/visitor problem.** Someone at a client site, a co-working space, or a shared library needs to scan one document to their own email — but they can't, because Scan-to-Email is configured for the regular staff only. They end up taking a phone photo of the document instead, which is often not good enough (contracts, official forms, IDs).
8. **Lost-in-the-shared-inbox scans.** Where Scan-to-Email *is* set up, it often points at one shared/generic mailbox for the whole team. Scans pile up mixed with everything else, nobody can tell whose scan is whose, and finding "that one thing I scanned three weeks ago" means scrolling through a cluttered inbox.
9. **Abandoned setup, fallback to photo.** Someone tries to set up Scan-to-Email themselves, gets partway through the printer's small-touchscreen wizard, hits a field they don't understand (SMTP port? TLS mode?), gives up, and just photographs the document with their phone instead — worse quality, no OCR, no structure.

## Solution

A hosted service that hands each printer its own ready-to-use SMTP mailbox, with zero manual SMTP configuration by the user.

**How it works, end to end:**

1. **Identify the printer (AI, any model).** User takes a photo of the printer. AI reads the photo, works out the make/model, and looks up how Scan-to-Email/SMTP is configured on that specific model. This is designed to work for *any* printer, not a fixed launch list — there's no hard-coded catalog gatekeeping which models are supported.
   - **Fallback:** if the model can't be confidently identified from the photo, we fall back to showing the generic SMTP configuration screen/fields (server, port, encryption, username, password) so the user can find the matching menu on their own printer manually.
2. **We generate the config.** Once the model is known (or as the generic fallback), we generate the exact SMTP configuration for that device, plus a step-by-step walkthrough (screenshots/instructions matching that specific model's menu where we have it).
3. **One-time setup at the printer.** The user opens the printer's settings, navigates to the exact screen we point them to (menus differ a lot by model, so we tell them precisely where to go), and types in the values we generated. Once, ever.
4. **Scan-to-mailbox address — auto-generated, not user-editable (v1).** Each printer gets its own dedicated address, generated by the system from the pattern described above (e.g. `<printer-model>_<company-or-name>@scan.<domain>`). The user cannot rename it in v1 — that's a possible future option, not a launch feature.
5. **Automatic history.** Every scan sent through that address is received by our service and stored, so the user gets a running, per-printer archive of all scans — searchable, accessible from a web dashboard — without any extra step at scan time.
6. **Daily use, after setup (the actual day-to-day feature).** Once configured, using it is just: walk up to the printer, press "Scan to Email," enter/select which address to send to, and by the time the scan finishes, the file is already sitting in that mailbox. No app, no cable, no flash drive — this is the moment-to-moment payoff of the one-time setup above.

**Net effect for the user:** no flash drives, no app installs, no SMTP knowledge required — one guided one-time setup, then "scan to email" just works, and every scan is automatically archived.

## Core value proposition

- **Convenience:** one photo → ready-made config → one-time entry at the printer.
- **No IT knowledge needed:** we own the SMTP complexity, the user never sees a server/port/password concept as something they need to *understand*, only to paste in once.
- **Built-in archive:** history of scans is a byproduct of normal use, not a separate feature to set up.
- **A feature you already own, finally usable.** Almost every printer already has a scanner and Scan-to-Email built in — it's just too fiddly to configure, so almost nobody turns it on. We're not selling new hardware or a new capability, just unlocking one that's already sitting there unused.

## Open questions to resolve before writing the TZ

1. **Domain & mailbox naming scheme — partially resolved.** Pattern confirmed as `<printer-model>_<company-or-name>@scan.<domain>` (or similar), system-generated and not user-editable in v1. Still open: the actual domain name itself.
2. ~~**Printer identification.**~~ **Resolved:** AI reads the photo and identifies the model for *any* printer (no fixed launch catalog); if confidence is too low, we fall back to showing the generic SMTP config fields for manual entry. See Solution, step 1.
3. ~~**Coverage.**~~ **Resolved:** not restricted to a fixed brand/model list — the AI-identification approach in step 2 is meant to handle any printer, with the generic-config fallback as a safety net.
4. ~~**Delivery vs. relay.**~~ **Resolved:** we are the mail server, backed by the inbox.eu API for sending/receiving and storage. This is purely internal infrastructure — end users and the public site never see or hear "inbox.eu"; they only ever see their own `@<our-domain>` address. See Internal technical notes below.
5. ~~**Pricing model.**~~ **Resolved:** €10/year per printer/scanner. Landing-page signups get their first year free. (Still to confirm: whether the price changes for year two+, and whether multi-printer accounts get any bundle discount — not needed for the landing page TZ.)
6. ~~**Account model.**~~ **Resolved:** one account per person; a single account can have multiple printers/scanners registered under it, each billed at €10/year.

## Internal technical notes (not for public site)

- **Mail backend:** inbox.eu API is used both to send/receive mail for the per-printer/per-company addresses and to store scans. This is a white-labeled dependency — it must never be exposed in the product UI, domain, headers, or copy visible to end users or on the marketing site. Keep this note out of anything public-facing (landing page, TZ shared externally, support docs).
- Implication: our own domain sits in front of inbox.eu; account/mailbox provisioning happens via their API when a printer/company signs up.

---
*Next step: once this is confirmed/edited, we write the TZ for the "intro + coming soon" landing page (v1 website).*
