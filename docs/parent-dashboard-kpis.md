# Parent Dashboard KPI Definitions

These KPI definitions describe what the parent dashboard should show once game
events are logged consistently. They are based on `docs/analytics-events.md`.

## Primary KPIs

| KPI | Definition | Event Source | Grain |
| --- | --- | --- | --- |
| Weekly active sessions | Count of `game_session_started` in the selected week | `game_session_started` | child, week |
| Completion rate | Completed sessions divided by started sessions | `game_session_started`, `game_session_completed` | child, week |
| Accuracy rate | Correct answers divided by submitted answers | `answer_submitted` | child, game, week |
| Median response time | Median `response_time_ms` for submitted answers | `answer_submitted` | child, game, week |
| Learning coverage | Distinct concepts practiced in the selected period | `question_viewed`, `content_generated` | child, month |
| AI content reuse rate | Cached or database-reused content divided by generated content events | `content_generated` | game, week |

## Guardrail Metrics

| Metric | Why It Matters |
| --- | --- |
| Failed content generation count | Shows AI/backend reliability issues without exposing prompts or keys |
| TTS fallback count | Separates audio availability from core game completion |
| Empty session count | Detects sessions where game started but no question was viewed |
| Config degraded state | Indicates local/demo setup is missing Supabase or backend configuration |

## Dashboard Reading Notes

- Parent-facing numbers should compare the selected child to their own recent
  history, not to other children.
- Keep raw event tables out of the parent UI; show trends, completion and
  concept coverage.
- Response time should be interpreted with age, TTS setting and game type in
  mind.
- Avoid showing direct child identifiers beyond the selected child profile.
