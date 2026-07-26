# Origin avatar assets

Official USJET.AI command android — white-and-gold segmented armor, gold mesh earcups, USJET chest mark.

## Character skin (primary)

| File | Role |
|------|------|
| `origin-character.mp4` | Live face-to-face presence (primary stage) |
| `origin-character-poster.png` | Poster / boot still (front) |
| `origin-character.png` | Front still reference |
| `origin-character-profile.png` | Side-profile reference (headphones + collar) |
| `origin-chest-logo.png` | Chest mark asset |

## Lip-sync

- `headaudio/` — AudioWorklet processor + English viseme model (MFCC → Oculus)
- Main-thread `HeadAudio` class: `src/lib/headaudio/` (Vite cannot import JS from `/public`)

Remote TTS / S2S audio feeds HeadAudio for zero-latency mouth drive on the Origin stage.

## Optional TalkingHead GLB

Set `VITE_ORIGIN_AVATAR_URL` to a Ready Player Me–compatible GLB with Oculus visemes when a commercial Origin mesh is ready. Until then the official character video is the face.

## Realtime S2S

| Env | Transport |
|-----|-----------|
| `ORIGIN_S2S_WS_URL` | WebSocket — `input_audio_buffer.append` (PCM16 @ 16kHz) + `response.output_audio.delta` |
| `OPENAI_API_KEY` | OpenAI Realtime WebRTC via `/api/origin-realtime-call` |

Tools: `set_mood`, `make_hand_gesture`, `make_facial_expression`.
