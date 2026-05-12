# USJet Fleet Manifest — v5 Alpha

Powerplant contract for the 30-unit hangar grid. Cursor (Airframe) consumes `src/data/fleetManifest.ts`, which mirrors this manifest.

## Grid

- Layout: **6 columns × 5 rows** (30 units)
- Index: `slot` **0–29** (row-major, left-to-right, top-to-bottom)
- Aura: each unit renders inside `AuraFrame` (`aura-float-wrap` + `tool-card`)

## Fields

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Stable slug for routes and keys |
| `slot` | 0–29 | Hangar grid position |
| `name` | string | Display title |
| `callsign` | string | Subtitle / model line |
| `domain` | string | Operator domain |
| `href` | string | External launch URL |
| `status` | `active` \| `unlocking` \| `locked` \| `staging` | Bay state |
| `aura` | `idle` \| `listening` \| `talking` | Visual Aura mode |
| `aircraftType` | `sr71` \| `f22` \| `f16` \| `b2` \| `f35` \| `strike` \| `widebody` \| `narrowbody` \| `regional` \| `bizjet` \| `turboprop` \| `ga` | Vector silhouette tier |
| `pageSlug` | string? | Future dedicated bay route |

## Units

| Slot | ID | Name | Callsign | Domain | Status | Aura |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | openai | OpenAI Terminal | GPT-4o | openai.com | active | idle |
| 1 | anthropic | Claude Command | CLAUDE 3.5 | anthropic.com | active | idle |
| 2 | google | Gemini Pro | GEMINI 1.5 | deepmind.google | active | idle |
| 3 | xai | Grok Portal | GROK-1.5 | x.ai | active | idle |
| 4 | meta | Llama Local | LLAMA 3 | meta.ai | active | idle |
| 5 | mistral | Mistral HQ | LARGE 2 | mistral.ai | active | idle |
| 6 | nvidia | NVIDIA | NVDA-AI | nvidia.com | active | idle |
| 7 | microsoft | Microsoft | CO-PILOT | microsoft.com | active | idle |
| 8 | perplexity | Perplexity | SONAR | perplexity.ai | unlocking | idle |
| 9 | cohere | Cohere | COMMAND-R | cohere.com | unlocking | idle |
| 10 | stability | Stability AI | SDXL | stability.ai | unlocking | idle |
| 11 | midjourney | Midjourney | V6 | midjourney.com | unlocking | idle |
| 12 | runway | Runway | GEN-3 | runwayml.com | unlocking | idle |
| 13 | elevenlabs | ElevenLabs | TURBO | elevenlabs.io | unlocking | idle |
| 14 | huggingface | Hugging Face | HF HUB | huggingface.co | unlocking | idle |
| 15 | deepseek | DeepSeek | V3 | deepseek.com | staging | idle |
| 16 | inflection | Inflection | PI | inflection.ai | staging | idle |
| 17 | character | Character.AI | CA-1 | character.ai | staging | idle |
| 18 | replicate | Replicate | REPL | replicate.com | staging | idle |
| 19 | together | Together AI | TOG | together.ai | staging | idle |
| 20 | fireworks | Fireworks AI | FW | fireworks.ai | staging | idle |
| 21 | ai21 | AI21 Labs | JURASSIC | ai21.com | locked | idle |
| 22 | aleph | Aleph Alpha | LUMINOUS | aleph-alpha.com | locked | idle |
| 23 | baidu | Baidu Ernie | ERNIE | baidu.com | locked | idle |
| 24 | alibaba | Alibaba Qwen | QWEN | alibaba.com | locked | idle |
| 25 | bedrock | Amazon Bedrock | BEDROCK | aws.amazon.com | locked | idle |
| 26 | ibm | IBM Watsonx | WATSONX | ibm.com | locked | idle |
| 27 | salesforce | Salesforce Einstein | EINSTEIN | salesforce.com | locked | idle |
| 28 | adobe | Adobe Firefly | FIREFLY | adobe.com | locked | idle |
| 29 | usjet | USJet Origin | ORIGIN | usjet.ai | active | listening |
