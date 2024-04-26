// @ts-check
import { makeExo } from '@endo/exo';
import { makePromiseKit } from '@endo/promise-kit';
import { M, mustMatch } from '@endo/patterns';

const { Fail } = assert;

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
 * @returns {GameResult}
 * @typedef {'draw' | { winner: 1 | 2, why: string }} GameResult
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

const GameResultShape = M.or('draw', {
  winner: M.or(1, 2),
  why: M.string(),
});

export const make = () => {
  /** @type {import('@endo/promise-kit').PromiseKit<GameResult>} */
  const outcomePK = makePromiseKit();
  let attackerChoice;

  const attacker = makeExo(
    'RockPaperScissors',
    M.interface('RPSI', {
      attack: M.call(ChoiceShape).returns(M.remotable('Defender')),
      getResult: M.call().returns(M.promise()),
    }),
    {
      /** @param {Choice} choice1 */
      attack: choice1 => {
        !attackerChoice || Fail`already chose ${attackerChoice}`;
        attackerChoice = choice1;
        return makeExo(
          'Defender',
          M.interface('Defender', {
            defend: M.call(ChoiceShape).returns(GameResultShape),
          }),
          {
            /** @param {Choice} choice2 */
            defend: choice2 => {
              const outcome = score(choice1, choice2);
              outcomePK.resolve(outcome);
              return outcome;
            },
          },
        );
      },
      getResult: () => outcomePK.promise,
    },
  );
  return attacker;
};
