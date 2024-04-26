// @ts-check
import '@endo/init/debug.js';
import test from 'ava';
import { E } from '@endo/eventual-send';
import { make } from '../src/rock-paper-scissors.js';

test('Rock Paper Scissors: 1 game', async t => {
  const p1 = make();
  const p2 = E(p1).attack('rock');
  const result = await E(p2).defend('paper');
  t.log(result);
  t.deepEqual(result, { why: 'paper covers rock', winner: 2 });
});

test('only 3 choices allowed', async t => {
  const p1 = make();
  // @ts-expect-error testing an erroneous call
  await t.throwsAsync(E(p1).attack('pillow'));
});

test('attacker cannot attack again', async t => {
  const p1 = make();
  void E(p1).attack('rock');
  await t.throwsAsync(E(p1).attack('scissors'));
});
