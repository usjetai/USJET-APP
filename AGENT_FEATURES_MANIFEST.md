# AGENT FEATURES MANIFEST

Unified registry protocol: `CallName` is the canonical agent identity and maps 1:1 to the assigned developer name.

Status: Placeholder operational features are defined below for all 30 USJET fleet entities.

## Registry Template

- `CallName`: Unified identity key (developer name)
- `Partner`: External AI/partner platform
- `OperationalFeatures`: Initial feature assignments (editable)

## Fleet Entities (30)

1. **Blue Ivy** (`gemini.google.com`)
   - OperationalFeatures: `Visual Design`, `Research Ops`, `Multimodal Analysis`, `Fleet Briefing`
2. **Mary Stealth** (`chatgpt.com`)
   - OperationalFeatures: `Code Generation`, `Workflow Automation`, `Operator Support`, `Mission Drafting`
3. **Chop** (`claude.ai`)
   - OperationalFeatures: `Security Audit`, `Policy Analysis`, `Long-Context Review`, `Risk Flags`
4. **Stick** (`perplexity.ai`)
   - OperationalFeatures: `Web Recon`, `Cited Intelligence`, `Competitive Scan`, `Source Validation`
5. **Grok 4.1 Developer** (`grok.com`)
   - OperationalFeatures: `Real-Time Signals`, `Market Watch`, `Rapid Q&A`, `Trend Monitoring`
6. **Aaliyah** (`cursor.com`)
   - OperationalFeatures: `Code Refactor`, `IDE Pairing`, `Release Checks`, `Dev Productivity`
7. **Little Mama** (`midjourney.com`)
   - OperationalFeatures: `Concept Art`, `Brand Visuals`, `Campaign Creative`, `Asset Iteration`
8. **Luma Dream Developer** (`lumalabs.ai`)
   - OperationalFeatures: `Video Generation`, `Scene Prototyping`, `Motion Concepts`, `Creative Pipeline`
9. **Sora 2 Developer** (`chatgpt.com`)
   - OperationalFeatures: `Cinematic Generation`, `Storyboard Output`, `Sequence Design`, `Media Ops`
10. **Higgsfield Developer** (`higgsfield.ai`)
    - OperationalFeatures: `Motion Graphics`, `Visual Effects`, `Style Transfer`, `Creative R&D`
11. **Rumi** (`runway.com`)
    - OperationalFeatures: `Video Editing`, `Post-Production`, `Shot Enhancement`, `Studio Workflow`
12. **Kitkat** (`leonardo.ai`)
    - OperationalFeatures: `Image Pipeline`, `Product Mockups`, `Brand Artifacts`, `Creative Acceleration`
13. **Firefly Developer** (`firefly.adobe.com`)
    - OperationalFeatures: `Design System Assets`, `Marketing Visuals`, `Creative Compliance`, `Production Design`
14. **Light Speed** (`gemini.google.com`)
    - OperationalFeatures: `Strategic Reasoning`, `Decision Support`, `Command Summaries`, `Ops Planning`
15. **Flux.1 Pro Developer** (`bfl.ai`)
    - OperationalFeatures: `Image Synthesis`, `Visual Ideation`, `Campaign Asseting`, `Creative Ops`
16. **Suno v4 Developer** (`suno.com`)
    - OperationalFeatures: `Audio Production`, `Music Generation`, `Brand Sound`, `Content Scoring`
17. **ElevenLabs Developer** (`elevenlabs.io`)
    - OperationalFeatures: `Voice Generation`, `Dubbing`, `Narration`, `VoiceOps`
18. **Play.ht Developer** (`play.ht`)
    - OperationalFeatures: `Text-to-Speech`, `Voice Delivery`, `Accessibility Audio`, `Audio Automation`
19. **Synthesia Developer** (`synthesia.io`)
    - OperationalFeatures: `Presenter Video`, `Training Content`, `Onboarding Media`, `Enterprise Comms`
20. **HeyGen Developer** (`heygen.com`)
    - OperationalFeatures: `Avatar Video`, `Localization`, `Comms Automation`, `Marketing Video`
21. **v0.dev Developer** (`v0.dev`)
    - OperationalFeatures: `UI Generation`, `Prototype Delivery`, `Design-to-Code`, `Frontend Velocity`
22. **Replit Agent Developer** (`replit.com`)
    - OperationalFeatures: `Cloud Coding`, `Rapid Deploy`, `Dev Sandbox`, `Fleet Tooling`
23. **GitHub Copilot Developer** (`github.com`)
    - OperationalFeatures: `Code Assist`, `PR Support`, `Review Drafting`, `Engineering Throughput`
24. **Consensus Developer** (`consensus.app`)
    - OperationalFeatures: `Research Synthesis`, `Evidence Mapping`, `R&D Support`, `Knowledge Ops`
25. **Gamma Developer** (`gamma.app`)
    - OperationalFeatures: `Presentation Generation`, `Executive Briefs`, `Sales Decks`, `Narrative Structuring`
26. **Christal** (`notion.so`)
    - OperationalFeatures: `Fleet Documentation`, `Knowledge Base`, `Ops SOPs`, `Workspace Governance`
27. **Jasper Developer** (`jasper.ai`)
    - OperationalFeatures: `Marketing Copy`, `Campaign Drafts`, `Brand Messaging`, `Content Ops`
28. **Otter.ai Developer** (`otter.ai`)
    - OperationalFeatures: `Meeting Notes`, `Transcription`, `Action Tracking`, `Team Memory`
29. **DeepSeek Developer** (`chat.deepseek.com`)
    - OperationalFeatures: `Reasoning Tasks`, `Technical Analysis`, `Structured Q&A`, `Deep Research`
30. **USJet Origin Developer** (`/origin`)
    - OperationalFeatures: `Fleet Management`, `Command Orchestration`, `Routing Control`, `Sovereign Protocol`

## Re-indexing Notes

- Identity key is now unified as `CallName` (developer name).
- `CallName` is propagated in cockpit launch URLs (`callName` query param).
- Cockpit handoff validates `callName` against fleet registry before rendering partner content.
