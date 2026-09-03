# USJET Operator's Rig — Build & Setup Runbook

**Purpose:** the actual, literal steps between "box arrives from the supplier" and "customer opens the lid and it's already talking." Different hardware platforms take different amounts of work — this runbook breaks that out per platform, with real time estimates, so the labor behind the markup is a number, not a feeling.

This is an internal ops document. It is not customer-facing copy (though the "First-Boot Welcome" section at the bottom can be lifted directly into the product).

---

## 1. Time summary — the number you asked for

| Track | Hardware | Hands-on labor | Wall-clock (incl. downloads/updates/reboots) |
|---|---|---|---|
| **A — Apple Silicon** | Mac Mini, MacBook Air/Pro, Mac Studio | ~95 min | ~2–2.5 hrs |
| **B — Windows/Linux mini PC** | Beelink, Minisforum, GMKtec (Ryzen AI Max / AI Max+) | ~160 min | ~3–4 hrs |
| **C — NVIDIA workstation / server** | RTX 5090 build, 128GB AI Max+ server | ~170–210 min | ~3.5–5 hrs, highly variable |

Track B runs roughly **60–90 minutes longer than Track A** for the same class of unit — Windows OOBE, NPU/GPU driver installs, and WSL2 + Docker Desktop are real friction that macOS doesn't have. That gap is real labor, not padding, and it's worth knowing which SKUs are actually more expensive to prep before pricing them the same as an equivalent-spec Mac.

Wall-clock includes model downloads and OS updates, most of which can run unattended in the background while a second unit is being unboxed — so a two-person or batched workflow compresses wall-clock time a lot, but not the hands-on labor line. Hands-on labor is the number that maps to cost.

---

## 2. Track A — Apple Silicon (Mac Mini, MacBook Air/Pro, Mac Studio)

1. **Unbox + first boot.** Skip Apple ID push, create local admin account, set timezone/region, connect Wi-Fi. — **10 min**
2. **macOS Software Update pass.** Run it, let it install. Can run in background while prepping the next unit. — **15–30 min**
3. **Strip first-open friction.** Turn off Siri suggestions, Screen Time nag, iCloud upsell prompts — the goal is a clean desktop, not an Apple onboarding tour. — **5 min**
4. **Install Homebrew.** — **3 min**
5. **Install Ollama** (`brew install ollama`), start the service. — **3 min**
6. **Pull the model matched to the unit's memory tier** (see sizing matrix below). Background-safe. — **10–25 min**
7. **Install Open WebUI**, point it at `localhost:11434`, confirm it talks to Ollama. — **10 min**
8. **Install AnythingLLM desktop**, set Ollama as the LLM provider, create the default workspace. — **10 min**
9. **Build the one-click launcher** — a small script/app that starts the Ollama service, opens Open WebUI, and opens AnythingLLM, dropped on the Desktop. — **10 min**
10. **Load the AI Book Series** onto the desktop + set the wallpaper/readme. — **5 min**
11. **QA pass** (see checklist, section 5). — **15–20 min**
12. **Re-box, packing slip, seal.** — **10 min**

**Hands-on total: ~95 min. Wall-clock: ~2–2.5 hrs.**

---

## 3. Track B — Windows/Linux mini PC (Ryzen AI Max / AI Max+)

1. **Unbox + Windows 11 OOBE.** Force a local account (skip the Microsoft account push), decline bundled offers, set region/Wi-Fi. — **15 min**
2. **Windows Update pass.** Usually 2+ restarts. Mostly unattended but needs babysitting through reboots. — **20–40 min**
3. **Install the AMD Adrenalin / NPU driver package** for the Ryzen AI Max chip — required for NPU-accelerated inference, not optional. One reboot. — **10–15 min**
4. **Enable WSL2 + install Docker Desktop** (needed to run Open WebUI as a container). This is the step every public setup guide warns about — budget the buffer. — **15–20 min + reboot**
5. **Install Ollama for Windows** (native installer). — **3 min**
6. **Pull the model matched to the unit's memory tier.** Higher tiers (64–128GB units pulling 30B–70B-class models) run long here — budget the top of the range. — **10–45 min**
7. **Run the Open WebUI container, verify it reaches Ollama.** This is the most common failure point (Docker networking, `localhost` inside a container ≠ host machine) — budget a real buffer, not the happy path. — **10–25 min**
8. **Install AnythingLLM for Windows**, configure the provider. — **10 min**
9. **Build the one-click launcher** (shortcut or small tray app that starts everything). — **10 min**
10. **Strip Windows telemetry/ad prompts**, pin the launcher as the first thing the customer sees. — **10 min**
11. **Load the AI Book Series onto the desktop.** — **5 min**
12. **QA pass** (section 5). — **15–20 min**
13. **Re-box, packing slip, seal.** — **10 min**

**Hands-on total: ~160 min. Wall-clock: ~3–4 hrs.**

---

## 4. Track C — NVIDIA workstation / AI server (contact-to-order builds)

These are lower-volume, spec-to-customer builds (RTX 5090 workstation, 128GB Ryzen AI Max+ office server), so the range is wider and each one genuinely varies:

1. GPU/BIOS driver setup (NVIDIA driver + CUDA toolkit). — **20 min**
2. OS install/setup (Windows or Linux, per the spec). — **20–40 min**
3. Install the customer's actual serving stack — vLLM or TensorRT-LLM if they're NVIDIA-tooling, Ollama-CUDA if not. This step is not templated; it depends on what the customer told ops they run. — **20–30 min**
4. Pull the large-context/70B-class model. — **30–90 min**
5. Configure network serving — dual 10GbE setup on the office-server SKUs, so more than one desk can reach the box. — **20–30 min**
6. Load test + QA. — **20–30 min**
7. Custom crating, insurance paperwork for the higher declared value. — **15–20 min**

**Hands-on total: ~170–210 min, and that's the floor** — these are the units where "talk to ops" in the catalog copy is doing real work, not a formality.

---

## 5. Model sizing matrix (download time, all tracks)

| Memory tier | Model class | Approx. download | On a decent connection |
|---|---|---|---|
| 16GB | 7B–8B (Llama 3.1 8B, Mistral 7B) | ~4.7GB | 10–15 min |
| 24–32GB | 13B–14B | ~8GB | 15–25 min |
| 64–96GB | 30B–40B | ~20GB | 30–45 min |
| 128GB | 70B-class (quantized) | ~40GB+ | 45–90 min |

---

## 6. QA / pre-ship checklist (every track, no exceptions)

- One-click launcher opens clean from a cold boot — zero terminal commands required from the customer.
- Chat answers 3 sample prompts correctly.
- A test file dropped into AnythingLLM is retrievable in a follow-up question.
- No cloud-login or telemetry popup gates the first open.
- **Airplane-mode test** — Wi-Fi off, assistant still answers. This is the actual proof behind the "private, no cloud" claim on the site, not a slogan.
- AI Book Series is present and opens without a missing-app error.
- Packing slip + support card (ops@usjet.ai) is in the box.

---

## 7. What this means for the markup question

You're right that "$3,000 in, $4,400 out" isn't a complete picture on its own — $1,400 looks like pure margin until you price in what actually eats it. Rough framework (swap in your real wholesale cost and labor rate — these are illustrative):

| Line item | Est. cost on a $4,400 Track B unit |
|---|---|
| Hands-on labor (~2.75 hrs @ $100/hr loaded rate) | ~$275 |
| Payment processing (Stripe, ~3%) | ~$130 |
| Packaging + shipping materials | ~$50–80 |
| DOA / return reserve (~4% of price) | ~$175 |
| AI Book Series print + content (amortized) | ~$20–40 |
| **Total non-margin cost** | **~$650–700** |
| **Actual net margin on $1,400 gross** | **~$700–750 (≈16–17% of sale price)** |

That's a normal, defensible margin for a boutique hardware-plus-service business — not the "just flipping a box" number it looks like at first glance. The labor line alone (Track B: ~2.75 hrs) is the concrete answer to "why can't we charge less" — that time is real, it's the same on every unit, and it's the one line item a reseller who just drop-ships the same SKU isn't paying.

**The bigger reason, though, is the one you already said out loud:** there's a real, large segment of buyers who do not want to open a terminal, do not know what Docker or WSL2 is, and would either never get a working "Jarvis" running on their own or would burn a weekend — sometimes several — hitting exactly the Docker-networking wall the public setup guides all warn about. For that buyer, USJET isn't reselling a Mac Mini or a Beelink box. It's selling the outcome of Track A or Track B already done — a system that works the moment they open the lid, with zero risk of them being the one who has to debug it. That is what a premium, service-inclusive price is for, and it is a completely different product category from "computer at retail plus markup." Priced and talked about as a finished outcome, not resold hardware, the markup stops needing to be justified computer-to-computer and starts being justified against "a working AI system, same day, no tech skills required" — which nobody else in this market is actually selling.

---

## 8. First-boot "Welcome" copy — different per system, as it should be

The welcome screen the customer sees on first open of the one-click launcher should acknowledge what kind of machine they're actually holding, not use one generic blurb across every SKU.

**Track A — Apple Silicon**
> Welcome. This Mac already has a private AI on it — no setup, no subscription. Open the *Start Jarvis* icon on your desktop any time. Everything it tells you stays on this machine.

**Track B — Windows/Linux mini PC**
> Welcome. Your private AI is already running on this machine. Click *Start Jarvis* on the desktop — no installs, no terminal, nothing to configure. It stays on this box, even offline.

**Track C — Workstation / office server**
> Welcome. This machine is configured to serve your whole team — everyone on the network can reach it from *Start Jarvis*. One box, one brain, nothing leaving the building.

Same promise, three machines, worded for what's actually different about each one — which was the instinct you started with.
