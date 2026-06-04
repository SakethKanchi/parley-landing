import { test } from 'node:test';
import assert from 'node:assert/strict';
import { meeting } from '../src/data/demo.js';

test('cast has 4 members with handle, color, role, initials', () => {
  assert.equal(meeting.cast.length, 4);
  for (const m of meeting.cast) {
    assert.ok(m.handle && m.color && m.role && m.initials);
  }
});

test('every beat references a real cast handle', () => {
  const handles = new Set(meeting.cast.map((c) => c.handle));
  for (const b of meeting.beats) assert.ok(handles.has(b.handle));
});

test('action items are grouped per cast handle', () => {
  const handles = new Set(meeting.cast.map((c) => c.handle));
  for (const group of meeting.notes.actionItems) {
    assert.ok(handles.has(group.handle));
    assert.ok(group.tasks.length >= 1);
  }
});

test('talk-time percentages sum to ~100', () => {
  const sum = meeting.notes.talkTime.reduce((a, t) => a + t.pct, 0);
  assert.ok(Math.abs(sum - 100) <= 1);
});
