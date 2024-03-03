// @ts-check
import { M } from '@endo/patterns';

// XXX copied from @agoric/ertp to avoid importing / building xsnap
export const BrandShape = M.remotable('Brand');
export const AmountShape = harden({ brand: BrandShape, value: M.any() });
