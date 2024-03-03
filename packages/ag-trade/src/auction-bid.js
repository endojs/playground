// @ts-check
import { E } from '@endo/far';
import { M, mustMatch, matches } from '@endo/patterns';

import { AmountShape } from './typeGuards.js';
import { parseRatio } from './parseRatio.js';

/** @template T @typedef {import('@endo/eventual-send').ERef<T>} ERef */

const { Fail, quote: q } = assert;
const UNIT6 = 1_000_000n;

/**
 * @template T
 * @param {T | null | undefined } x
 * @returns {T}
 */
const NonNullish = x => {
  if (x === undefined || x === null) throw assert.error('NonNullish');
  return x;
};

const bidInvitationShape = harden({
  source: 'agoricContract',
  instancePath: ['auctioneer'],
  callPipe: [['makeBidInvitation', M.any()]],
});

/**
 * @param {{
 *   offerId: string;
 *   give: import('./types.js').Amount<'nat'>;
 *   maxBuy: import('./types.js').Amount<'nat'>;
 *   wantMinimum?: import('./types.js').Amount<'nat'>;
 * } & (
 *   | {
 *       price: number;
 *     }
 *   | {
 *       discount: number; // -1 to 1. e.g. 0.10 for 10% discount, -0.05 for 5% markup
 *     }
 * )} opts
 * @returns {import('./types.js').OfferSpec}
 */
const makeBidOffer = opts => {
  mustMatch(
    harden({
      offerId: opts.offerId,
      give: opts.give,
      maxBuy: opts.maxBuy,
    }),
    harden({
      offerId: M.or(M.string(), M.number()),
      give: AmountShape,
      maxBuy: AmountShape,
    }),
  );
  const proposal = {
    give: { Bid: opts.give },
    ...(opts.wantMinimum ? { want: { Collateral: opts.wantMinimum } } : {}),
  };
  const istBrand = proposal.give.Bid.brand;
  const maxBuy = opts.maxBuy;

  const bounds = (x, lo, hi) => {
    assert(x >= lo && x <= hi);
    return x;
  };

  assert(
    'price' in opts || 'discount' in opts,
    'must specify price or discount',
  );
  const offerArgs =
    'price' in opts
      ? {
          maxBuy: opts.maxBuy,
          offerPrice: parseRatio(opts.price, istBrand, maxBuy.brand),
        }
      : {
          maxBuy,
          offerBidScaling: parseRatio(
            (1 - bounds(opts.discount, -1, 1)).toFixed(2),
            istBrand,
            istBrand,
          ),
        };

  /** @type {import('./types.js').OfferSpec} */
  const offerSpec = {
    id: opts.offerId,
    invitationSpec: {
      source: 'agoricContract',
      instancePath: ['auctioneer'],
      callPipe: [['makeBidInvitation', [maxBuy.brand]]],
    },
    proposal,
    offerArgs,
  };
  return offerSpec;
};

/**
 * @param {string[]} args
 * @param {{ [k: string]: boolean | undefined }} [style]
 */
const getopts = (args, style = {}) => {
  /** @type {{ [k: string]: string}} */
  const flags = {};
  while (args.length > 0) {
    const arg = NonNullish(args.shift());
    if (arg.startsWith('--')) {
      const name = arg.slice('--'.length);
      if (style[name] === true) {
        flags[name] = '';
        continue;
      }
      if (args.length <= 0) throw RangeError(`no value for ${arg}`);
      flags[name] = NonNullish(args.shift());
    }
  }
  return harden(flags);
};

/**
 * @param {*} self
 * @param {string[]} args
 */
export const main = async (self, ...args) => {
  const flags = getopts(args, { list: true });
  /** @type {import("./smartWallet.js").WalletKit} */
  const { query: vstorage, smartWallet } = await E(self).lookup('wallet');

  if ('list' in flags) {
    const info = await E(E(smartWallet).readOnly()).current();
    for (const [_id, offerStatus] of info.liveOffers) {
      if (!matches(offerStatus.invitationSpec, bidInvitationShape)) continue;
      console.log(q(offerStatus).toString());
    }
    return;
  } else {
    mustMatch(
      flags,
      M.splitRecord(
        { give: M.string(), discount: M.string(), maxBuy: M.string() },
        { wantMinimum: M.string() },
      ),
    );
  }

  const vse = await E(
    E(vstorage).lookup('agoricNames', 'vbankAsset'),
  ).entries();
  const byName = Object.fromEntries(
    vse.map(([_denom, info]) => [info.issuerName, info]),
  );
  console.log('vbankAssets', Object.keys(byName));

  /** @param {string} flag */
  const parseAmount = flag => {
    if (!(flag in flags)) throw Error(`missing ${flag}`);
    const arg = flags[flag];
    const [numeral, brandName] = arg.split(' ');
    brandName in byName || Fail`unknown brand: ${brandName}`;
    const { brand, displayInfo } = byName[brandName];
    const { decimalPlaces } = displayInfo;
    const value = BigInt(Number(numeral) * 10 ** decimalPlaces);
    /** @type {import('./types').Amount<'nat'>} */
    const amt = { brand, value };
    return amt;
  };

  /** @type {ERef<import('./fresh-id').Fresh>} */
  const fresh = E(self).lookup('fresh');
  const id = await E(fresh).next();

  const offerSpec = makeBidOffer({
    offerId: id,
    give: parseAmount('give'),
    maxBuy: parseAmount('maxBuy'),
    ...('wantMinimum' in flags && {
      wantMinimum: parseAmount('wantMinimum'),
    }),
    discount: Number(flags['discount']),
  });

  const info = await E(smartWallet).executeOffer(offerSpec);
  return info;
};
