export const features = [
  { title: 'Per-speaker attribution', icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0', body: 'Discord gives each user a separate audio stream, so every line is attributed to the right person — not guessed by an ML model.' },
  { title: 'Structured AI notes', icon: 'M5 4h14M5 9h14M5 14h9M5 19h9', body: 'TL;DR, decisions, open questions, and action items grouped by the person responsible — plus per-speaker talk-time.' },
  { title: 'Pluggable summarizer', icon: 'M4 7h16M4 12h16M4 17h10', body: 'Google Gemini (free tier), any OpenAI-compatible endpoint, or fully-offline Ollama — switch per server, no restart.' },
  { title: 'Local speech-to-text', icon: 'M12 3v18M8 7v10M16 7v10M4 10v4M20 10v4', body: 'A warm faster-whisper sidecar runs on your hardware. Pick a model from tiny to large-v3-turbo.' },
  { title: 'Runs anywhere', icon: 'M3 7h18v10H3zM7 21h10', body: "Node's built-in node:sqlite means no native build. Works on a Raspberry Pi or a GPU server alike." },
  { title: 'Searchable history', icon: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm10 17-5-5', body: 'Full-text /search across every past meeting, backed by SQLite FTS5. Plus /history and /summary.' },
  { title: 'Auto join / leave', icon: 'M15 10l5-3v10l-5-3M3 6h12v12H3z', body: 'Joins when 2+ people are talking, leaves when the room empties. Shows [REC] in its nickname while recording.' },
  { title: 'Concurrent meetings', icon: 'M7 7h10v10H7zM3 3h10v10', body: 'Records multiple channels and servers at once — keyed by guild and channel, with no global single-recording limit.' },
];
