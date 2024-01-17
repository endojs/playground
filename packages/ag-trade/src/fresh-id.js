// @ts-check
import { E, Far } from '@endo/far';

const trunc = {
  day: t => t.slice(0, '2001-01-01'.length),
  min: t => t.slice(0, '2001-01-01 hh:mm'.length),
  sec: t => t.slice(0, '2001-01-01 hh:mm:ss'.length),
};
const pick = {
  time: t => t.slice('2001-01-01 '.length),
};

const next = (t, slug = '_', t0, prev, seq) => {
  const firstDay = trunc.day(t) === trunc.day(t0);
  let lhs = t;
  for (const truncf of [trunc.min, trunc.sec]) {
    const cand = truncf(lhs);
    if (cand > truncf(prev)) {
      lhs = cand;
      break;
    }
  }
  const friendly = (firstDay ? pick.time(lhs) : lhs).replace(/:/g, '');
  return `${slug}${friendly}.${seq}`;
};

export const make = async self => {
  /**
   * @param {ReturnType<import('./clock').make>} clock
   */
  const start = async (clock, slug = '') => {
    const t0 = new Date(await E(clock).time()).toISOString();
    let seq = 0n;
    let prev = trunc.day(t0);
    return Far('Fresh', {
      next: async () => {
        const t = new Date(await E(clock).time()).toISOString();
        const out = next(t, slug, t0, prev, seq);
        prev = t;
        seq += 1n;
        return out;
      },
    });
  };

  const test = () => {
    const seq = 1n;
    const slug = 'x-';
    const t0 = '2023-12-29T19:10:10.466Z';
    const cases = [
      { t: '2023-12-29T19:10:10.466Z', prev: '2023-12-29T19:10:10.466Z' },
      { t: '2023-12-29T19:15:10.466Z', prev: '2023-12-29T19:10:10.466Z' },
      { t: '2023-12-29T19:15:33.466Z', prev: '2023-12-29T19:15:10.466Z' },
      { t: '2023-12-30T19:15:33.466Z', prev: '2023-12-29T19:15:10.466Z' },
    ];
    const results = [];
    for (const { t, prev } of cases) {
      const out = next(t, slug, t0, prev, seq);
      results.push({ out, t, prev });
    }
    return results;
  };

  //   const it = Far('FreshMaker', { start, test });
  //   return it.test();

  return Far('FreshMaker', { start, test });
};

/** @typedef {ReturnType<typeof make>} FreshMaker */
/** @typedef {ReturnType<FreshMaker['start']>} Fresh */
