import { E } from '@endo/far';
import { makePromiseKit } from '@endo/promise-kit';
import { makeRefIterator } from '@endo/daemon/ref-reader.js';

const { quote } = assert;

/** @import {EndoHost} from './@types/endo-daemon' */

const page = `
<!DOCTYPE html>
<title>Chat</title>
<style>
/* easy-to-read background */
  body {
    background: #eee;
  }

  .center {
    /* center the main element */
    display: flex;
    justify-content: center;
  }

  /* vertical space before footer */
  footer {
    margin-top: 5em;
}
</style>

<body>

  <h1 class="center">Endo Chat</h1>
  <form class="center">
    <fieldset>
      <legend>Chat</legend>
      <textarea name="history" cols="80" rows="20"> </textarea>
      <br />
      <input name="msg" size="60" /> <input type="submit" name="send" value="Send" />
    </fieldset>
    </fieldset>
  </form>

  <footer>
    <hr />
    <address>
      <a href="https://github.com/endojs/playground">endo playground</a><br />
    </address>
  </footer>

</body>
`;

// XXX where to put this?
/**
 * @template T
 * @param {T | null | undefined} val
 * @param {string} [optDetails]
 * @returns {T}
 */
export const NonNullish = (val, optDetails = `unexpected ${quote(val)}`) => {
  if (val != null) {
    // This `!= null` idiom checks that `val` is neither `null` nor `undefined`.
    return val;
  }
  assert.fail(optDetails);
};
harden(NonNullish);

/**
 *
 * @param {{
 *   querySelector: typeof document.querySelector;
 *   host: Pick<EndoHost, 'send' | 'followMessages' >
 * }} io
 */
export const attach = ({ querySelector, host }) => {
  /** @type {HTMLInputElement} */
  // @ts-expect-error TODO
  const msgBox = NonNullish(querySelector('input[name="msg"]'));
  /** @type {HTMLInputElement} */
  // @ts-expect-error TODO
  const historyBox = NonNullish(querySelector('textarea[name="history"]'));

  const { promise: senderP, resolve: resolveSender } = makePromiseKit();

  (async () => {
    for await (const message of makeRefIterator(E(host).followMessages())) {
      const {
        strings,
        number,
        type,
        from: fromId,
        to: toId,
        date,
        dismissed,
      } = message;
      console.log('Message from server ', message);
      historyBox.value += strings.join('@@') + '\n';
    }
  })().catch(oops => console.error(oops));

  NonNullish(querySelector('input[name="send"]')).addEventListener(
    'click',
    ev => {
      ev.preventDefault();
      const txt = msgBox.value;
      // XXX peer? get name from ui?
      console.log('sending...', txt);
      E(host).send('SELF', [txt], [], []);
    },
  );
};

/** @param {EndoHost} host */
export const make = async host => {
  //   E(powers).
  document.body.innerHTML = page;
  attach({ querySelector: s => document.querySelector(s), host });
};
