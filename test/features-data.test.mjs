import { test } from 'node:test';
import assert from 'node:assert/strict';
import { features } from '../src/data/features.js';

test('there are exactly 8 features, each with title, body, icon', () => {
  assert.equal(features.length, 8);
  for (const f of features) {
    assert.ok(f.title && f.body && f.icon);
  }
});
