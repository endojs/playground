// @ts-check

import { E } from '@endo/far';

const UNIT6 = 1_000_000n;

/**
 * @param {*} self
 * @param {string} units
 * @param {string} brandName
 */
export const main = async (self, units, brandName) => {
  assert.typeof(units, 'string');
  assert.typeof(brandName, 'string');
  /** @type {import("./ag-trade").SmartWalletKit} */
  const { query: vstorage, smartWallet } = await E(self).lookup('wallet');
  /** @type {Brand<'nat'>} */
  const brand = await E(vstorage).lookup('agoricNames', 'brand', brandName);
  /** @type {ERef<import('./fresh-id').Fresh>} */
  const fresh = E(self).lookup('fresh');

  // TODO: lookup decimalPlaces by brand
  const Collateral = { brand, value: UNIT6 * BigInt(units) };
  const id = await E(fresh).next();

  /** @type {import('@agoric/smart-wallet/src/offers.js').OfferSpec} */
  const offerSpec = {
    id,
    invitationSpec: {
      source: 'agoricContract',
      instancePath: ['reserve'],
      callPipe: [['makeAddCollateralInvitation', []]],
    },
    proposal: { give: { Collateral } },
  };

  const info = await E(smartWallet).executeOffer(offerSpec);
  return info;
};
