# Prompt Version Registry

This registry documents the AI prompts used by SaySay content generation. It is
kept as a product and engineering reference so prompt changes are traceable
without committing secrets or live model responses.

## Prompt Inventory

| Prompt ID | Surface | Model | Owner | Purpose | Fallback |
| --- | --- | --- | --- | --- | --- |
| `oyun1_concept_question_v1` | Python generator | Gemini | backend | Generate one simple Turkish concept question for a child profile | Return endpoint error and keep existing cached content when available |
| `oyun1_image_prompt_v1` | Python generator | local prompt builder | backend | Build correct/wrong visual prompts from theme, question and concept | Use concept-specific color/size/number/emotion templates |
| `oyun2_sentence_v1` | Python generator | Gemini | backend | Create a natural Turkish sentence from selected object and action | `_generate_fallback_sentence` deterministic sentence |
| `oyun3_fill_blank_v1` | Next.js API route | Gemini | frontend-api | Generate fill-in-the-blank Turkish questions as JSON | Return `503/502` and let UI/cache handle retry or empty state |
| `tts_audio_v1` | Python generator | Gemini TTS | backend | Generate child-friendly Turkish audio for prompt/question text | Continue game flow without audio |

## Change Rules

- Increment the prompt ID suffix when the output shape, target skill, or model
  behavior changes materially.
- Keep examples short and child-safe; do not include real child names, emails,
  API keys, or private profile details.
- Log prompt version in future analytics or content rows before comparing prompt
  quality.
- Gameplay should continue when optional AI/TTS generation fails.

## Current Risks

| Risk | Mitigation |
| --- | --- |
| Model response is not valid JSON | Next.js API validates extracted JSON before returning questions |
| API key missing in local/demo mode | Route returns explicit 503; backend `/ready` reports degraded config |
| TTS failure blocks gameplay | Backend continues without `audio_url` |
| Prompt drift is hard to audit | Registry keeps prompt IDs, purpose and fallback behavior in one place |
