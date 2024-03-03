import type { OfferSpec } from './@types/smart-wallet/smartWallet.js';
import type { Amount, Brand } from './@types/ertp/types-ambient.js';

export type { OfferSpec, Amount, Brand };

export type Ratio = { numerator: Amount<'nat'>; denominator: Amount<'nat'> };
