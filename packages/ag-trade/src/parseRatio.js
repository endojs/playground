// @ts-check

const { Fail } = assert;

const NUMERIC_RE = /^(\d\d*)(?:\.(\d*))?$/;
/** @typedef {bigint | number | string} ParsableNumber */

/** @typedef {import('./@types/ertp/types-ambient').AssetKind} AssetKind */
/** @template {AssetKind} K @typedef {import('./@types/ertp/types-ambient').Brand<K>} Brand */
/** @typedef {import('./@types/ertp/types-ambient').NatValue} NatValue */
/** @typedef {import('./types').Ratio} Ratio */

const PERCENT = 100n;

/**
 * @param {NatValue} numerator
 * @param {Brand<'nat'>} numeratorBrand
 * @param {NatValue} denominator
 * @param {Brand<'nat'>} denominatorBrand
 * @returns {Ratio}
 */
const makeRatio = (
  numerator,
  numeratorBrand,
  denominator = PERCENT,
  denominatorBrand = numeratorBrand,
) =>
  harden({
    numerator: { brand: numeratorBrand, value: numerator },
    denominator: { brand: denominatorBrand, value: denominator },
  });

/**
 * Create a ratio from a given numeric value.
 *
 * @param {ParsableNumber} numeric
 * @param {Brand<'nat'>} numeratorBrand
 * @param {Brand<'nat'>} [denominatorBrand]
 * @returns {Ratio}
 */
export const parseRatio = (
  numeric,
  numeratorBrand,
  denominatorBrand = numeratorBrand,
) => {
  const match = `${numeric}`.match(NUMERIC_RE);
  if (!match) {
    throw Fail`Invalid numeric data: ${numeric}`;
  }

  const [_, whole, part = ''] = match;
  return makeRatio(
    BigInt(`${whole}${part}`),
    numeratorBrand,
    10n ** BigInt(part.length),
    denominatorBrand,
  );
};
