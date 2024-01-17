/** needs --UNSAFE for access to Date.now() */
import { Far } from '@endo/far';

export const make = () =>
  Far('Clock', {
    time: () => Date.now(),
  });
