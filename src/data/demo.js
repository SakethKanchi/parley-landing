// Fake meeting powering the live demo. Names are original gamer handles (no real trademarks).
export const meeting = {
  server: 'Pixelforge',
  channel: 'launch-week',
  title: 'Launch Week Sync',
  cast: [
    { handle: 'PixelPaladin', role: 'Lead dev', color: '#5865F2', initials: 'PP' },
    { handle: 'RespawnRita',  role: 'QA',        color: '#EB459E', initials: 'RR' },
    { handle: 'LootGoblin',   role: 'Designer',  color: '#FAA61A', initials: 'LG' },
    { handle: 'NoScopeNova',  role: 'Community',  color: '#23A559', initials: 'NN' },
  ],
  // Ordered speaking beats — each lights up one avatar with a short line.
  beats: [
    { handle: 'PixelPaladin', text: 'Build is green on main. Frame pacing fix is in.' },
    { handle: 'RespawnRita',  text: 'Save corruption bug is fixed — but co-op desyncs on level 3.' },
    { handle: 'LootGoblin',   text: 'What if we add one more boss before launch?' },
    { handle: 'PixelPaladin', text: 'No. We freeze scope today or we miss Friday.' },
    { handle: 'NoScopeNova',  text: 'Trailer drops Wednesday, wishlists are climbing.' },
    { handle: 'RespawnRita',  text: 'Then co-op has to be cut or delayed — it is not stable.' },
    { handle: 'PixelPaladin', text: 'Agreed. Ship solo Friday, co-op as a week-1 patch.' },
  ],
  notes: {
    tldr: 'Pixelforge ships solo mode this Friday. Co-op is cut from launch and moves to a week-1 patch due to a level-3 desync. Trailer goes live Wednesday.',
    decisions: [
      'Launch date locked: Friday.',
      'Co-op mode cut from v1 — ships as a week-1 patch.',
      'Scope is frozen as of today — no new content.',
    ],
    actionItems: [
      { handle: 'PixelPaladin', tasks: ['Tag the release branch and freeze scope', 'Prep the week-1 co-op patch plan'] },
      { handle: 'RespawnRita',  tasks: ['File the level-3 desync repro', 'Sign off on the solo-mode build'] },
      { handle: 'LootGoblin',   tasks: ['Shelve the extra-boss design doc for v1.1'] },
      { handle: 'NoScopeNova',  tasks: ['Schedule the trailer for Wednesday', 'Queue the launch-day announcement'] },
    ],
    talkTime: [
      { handle: 'PixelPaladin', pct: 38 },
      { handle: 'RespawnRita',  pct: 27 },
      { handle: 'NoScopeNova',  pct: 20 },
      { handle: 'LootGoblin',   pct: 15 },
    ],
  },
};
