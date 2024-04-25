// @ts-check
import { E, Far } from '@endo/far';
import { makePromiseKit } from '@endo/promise-kit';
import { M, mustMatch } from '@endo/patterns';

/** @typedef {'rock' | 'paper' | 'scissors'} Choice */
const ChoiceShape = M.or('rock', 'paper', 'scissors');

const draw = null;
/** @typedef { null | false | string } Outcome */

/** @type {Record<Choice, Record<Choice, Outcome>>} */
const defeats = {
  rock: { rock: draw, paper: false, scissors: 'crushes' },
  paper: { rock: 'covers', paper: draw, scissors: false },
  scissors: { rock: false, paper: 'cuts', scissors: draw },
};

/**
 * @param {Choice} c1
 * @param {Choice} c2
 * @returns {'draw' | { winner: 1 | 2, why: string }}
 */
export const score = (c1, c2) => {
  mustMatch(c1, ChoiceShape);
  mustMatch(c2, ChoiceShape);
  if (c1 === c2) return 'draw';
  const x = defeats[c1][c2];
  const y = defeats[c2][c1];
  return harden(
    typeof x === 'string'
      ? { winner: 1, why: `${c1} ${x} ${c2}` }
      : { winner: 2, why: `${c2} ${y} ${c1}` },
  );
};

export const playAgainst = async opponent => {
  const makePlayer = (label, { resolve }, outcome) => {
    const p2 = Far(label, {
      choose: x => {
        mustMatch(x, ChoiceShape);
        resolve(x);
      },
      getOutcome: () => outcome,
    });
  };

  const choice = {
    p1: makePromiseKit(),
    p2: makePromiseKit(),
  };
  const outcome = Promise.all([choice.p1.promise, choice.p2.promise]).then(
    ([c1, c2]) => score(c1, c2),
  );
  const p1 = makePlayer('P1', choice.p1, outcome);
  const p2 = makePlayer('P2', choice.p2, outcome);
  await E(opponent).accept(p2);
  return p1;
};

export const make = () => Far('RockPaperScissors', { playAgainst });
