/**
 * @file Agoric smart wallet proxy
 */
// @ts-check

import { E, Far } from '@endo/far';
import {
  SigningStargateClient,
  assertIsDeliverTxSuccess,
} from '@cosmjs/stargate';
import { Tendermint34Client } from '@cosmjs/tendermint-rpc';

import { toAccAddress } from '@cosmjs/stargate/build/queryclient/utils.js';
import { toBase64 } from '@cosmjs/encoding';

// XXX move these to @agoric/cosmic-proto?
import { SwingsetMsgs, SwingsetRegistry, gasPriceStake } from './agoricZone.js';
import { fromMnemonic } from './hdWallet.js';
import { makeClientMarshaller } from './marshalTables.js';
import { batchVstorageQuery, makeVStorage } from './batchQuery.js';

/** @template T @typedef {import('@endo/eventual-send').ERef<T>} ERef<T> */
/** @template T @typedef {import('@endo/marshal').FromCapData<T>} FromCapData<T> */
/** @template T @typedef {import('@endo/marshal').ToCapData<T>} ToCapData<T> */
/** @typedef {import('@cosmjs/proto-signing').OfflineDirectSigner} OfflineDirectSigner */
/** @typedef  {import('@cosmjs/tendermint-rpc').RpcClient} RpcClient */

/** @typedef {import('@agoric/smart-wallet/src/smartWallet').UpdateRecord} UpdateRecord */

/**
 * @param {string} address
 * @param {string} spendAction
 * @returns {import('@cosmjs/proto-signing').EncodeObject}
 */
export const makeWalletActionMessage = (address, spendAction) => ({
  typeUrl: SwingsetMsgs.MsgWalletSpendAction.typeUrl,
  value: {
    owner: toBase64(toAccAddress(address)),
    spendAction,
  },
});

/**
 * @param {string} address
 * @param {import('@agoric/smart-wallet/src/smartWallet').BridgeAction} bridgeAction
 * @param {ToCapData<unknown>} toCapData
 */
const makeWalletMessageBy = (address, bridgeAction, toCapData) => {
  const spendAction = JSON.stringify(toCapData(harden(bridgeAction)));
  return makeWalletActionMessage(address, spendAction);
};

/** @typedef {import('./httpClient.js').LCD} LCD */

/**
 * @param {{
 *   lcd: ERef<LCD>,
 *   delay: (ms: number) => Promise<void>,
 *   period?: number,
 *   retryMessage?: string,
 * }} opts
 * @returns {<T>(l: (b: { time: string, height: string }) => Promise<T>) => Promise<T>}
 */
export const pollBlocks = opts => async lookup => {
  const { delay, lcd, period = 3 * 1000, retryMessage } = opts;

  await null; // separate sync prologue

  for (;;) {
    const status = await E(lcd).latestBlock();
    const {
      block: {
        header: { height, time },
      },
    } = status;
    try {
      // see await null above
      const result = await lookup({ time, height });
      return result;
    } catch (_err) {
      console.error(
        time,
        retryMessage || 'not in block',
        height,
        'retrying...',
      );
      await delay(period);
    }
  }
};

/**
 * @param {string} addr
 * @param {object} powers
 * @param {QueryTool} powers.query
 * @param {import('./batchQuery.js').VStorage} powers.vstorage
 */
const makeWalletView = (addr, { query, vstorage }) => {
  return Far('WalletQuery', {
    current: () => query.queryData(`published.wallet.${addr}.current`),
    /**
     * TODO: visit in chunks by block
     * @param {ERef<{visit: (r: UpdateRecord) => void}>} visitor
     * @param {number} [minHeight]
     */
    history: async (visitor, minHeight) => {
      const history = vstorage.readHistoryBy(
        s => query.fromCapData(JSON.parse(s)),
        `published.wallet.${addr}`,
        minHeight,
      );
      for await (const record of history) {
        await E(visitor).visit(record);
      }
    },
  });
};
/** @typedef {ReturnType<typeof makeWalletView>} WalletView } */

/**
 * @param {string|number} id
 * @param {string} from
 * @param {object} powers
 * @param {import('./batchQuery.js').VStorage} powers.vstorage
 * @param {FromCapData<string>} powers.fromCapData
 * @param {number|string} [minHeight]
 *
 * @returns {Promise<import('@agoric/smart-wallet/src/offers').OfferStatus | undefined>}
 */
const findOfferStatus = async (
  id,
  from,
  { vstorage, fromCapData },
  minHeight = undefined,
) => {
  const history = vstorage.readHistoryBy(
    s => fromCapData(JSON.parse(s)),
    `published.wallet.${from}`,
    minHeight,
  );

  for await (const record of history) {
    // TODO: mustMatch(record, OfferStatusShape)
    if (record.updated === 'offerStatus' && record.status.id === id) {
      return record.status;
    }
  }

  return undefined;
};

/**
 * Get OfferStatus by id, polling until available.
 *
 * @param {string} from
 * @param {string|number} id
 * @param {{
 *   fromCapData: FromCapData<string>;
 *   delay: (ms: number) => Promise<void>;
 *   vstorage: import('./batchQuery.js').VStorage;
 * }} io
 * @param {number|string} [minHeight]
 * @param {boolean} [untilNumWantsSatisfied]
 */
const pollOffer = async (
  from,
  id,
  io,
  minHeight,
  untilNumWantsSatisfied = false,
) => {
  let threshold = minHeight;
  const lookup = async ({ height }) => {
    const offerStatus = await findOfferStatus(id, from, io, threshold);
    threshold = height;
    if (!offerStatus) throw Error('retry');
    harden(offerStatus);
    if (untilNumWantsSatisfied && !('numWantsSatisfied' in offerStatus)) {
      throw Error('retry (no numWantsSatisfied yet)');
    }
    return offerStatus;
  };
  const retryMessage = 'offer not in wallet at block';
  const opts = {
    lcd: io.vstorage.lcd,
    delay: io.delay,
    retryMessage,
  };
  return pollBlocks(opts)(lookup);
};

const { fromEntries, keys } = Object;

/**
 * @param {OfflineDirectSigner} nearSigner
 * @param {ERef<import('@cosmjs/tendermint-rpc').RpcClient>} rpcClient
 *
 * TODO: allow overriding default options
 */
export const makeSigningClient = async (nearSigner, rpcClient) => {
  /** @type {import('@cosmjs/tendermint-rpc').RpcClient} */
  const nearRPC = {
    execute: (...args) => E(rpcClient).execute(...args),
    disconnect: () => void E(rpcClient).disconnect(),
  };
  const cometClient = await Tendermint34Client.create(nearRPC);

  // TODO: remote signer.
  // not yet feasible: can't pass Uint8Array
  //   /** @type {OfflineDirectSigner} */
  //   const nearSigner = {
  //     getAccounts: () => E(farSigner).getAccounts(),
  //     signDirect: (address, signDoc) => E(farSigner).signDirect(address, signDoc),
  //   };

  const nearClient = await SigningStargateClient.createWithSigner(
    cometClient,
    nearSigner,
    {
      // amino not (yet) supported
      // aminoTypes: new AminoTypes(converters),
      registry: SwingsetRegistry,
      gasPrice: gasPriceStake,
    },
  );

  return Far('SigningClient', {
    /** @param {Parameters<SigningStargateClient['sign']>} args*/
    sign: (...args) => nearClient.sign(...args),
    /** @param {Parameters<SigningStargateClient['broadcastTx']>} args*/
    broadcastTx: (...args) => nearClient.broadcastTx(...args),
    /**
     * @param {Parameters<SigningStargateClient['signAndBroadcast']>} args
     * @throws if account does not exist on chain, user cancels,
     *         RPC connection fails, RPC service fails to broadcast (
     *         for example, if signature verification fails)
     *
     * NOTE: use assertIsDeliverTxSuccess(tx) to check for success
     */
    signAndBroadcast: (...args) => nearClient.signAndBroadcast(...args),
    /** @param {Parameters<SigningStargateClient['sendTokens']>} args*/
    sendTokens: (...args) => nearClient.sendTokens(...args),
  });
};

/** @param {ERef<LCD>} lcd */
const makeQueryKit = lcd => {
  const m = makeClientMarshaller();
  const vstorage = makeVStorage(lcd);

  /** @param {['children' | 'data', string][]} paths */
  const batchQuery = async paths =>
    batchVstorageQuery(vstorage, m.fromCapData, paths);

  /** @param {string} path */
  const queryData = async path => {
    const [[_p, answer]] = await batchQuery([['data', path]]);
    if (typeof answer === 'string') return answer;
    if (answer.error) throw Error(answer.error);
    return answer.value;
  };

  /** @param {string} path */
  const queryChildren = async path => {
    const [[_p, answer]] = await batchQuery([['children', path]]);
    if (typeof answer === 'string') return answer;
    if (answer.error) throw Error(answer.error);
    return answer.value;
  };

  const nameHubCache = new Map();

  /** @param {string} kind */
  const lookupKind = async kind => {
    assert.typeof(kind, 'string');
    if (nameHubCache.has(kind)) {
      return nameHubCache.get(kind);
    }
    const entries = await queryData(`published.agoricNames.${kind}`);
    const record = Object.fromEntries(entries);
    const hub = Far('NameHub', {
      lookup: name => record[name],
      keys: () => entries.map(e => e[0]),
      entries: () => entries,
    });
    nameHubCache.set(kind, hub);
    return hub;
  };

  const invalidate = () => {
    nameHubCache.clear();
  };

  /**
   * @param {string} first
   * @param {string} kind
   * @param {string} [name]
   */
  const lookup = async (first, kind, name) => {
    assert.equal(first, 'agoricNames');
    const hub = await lookupKind(kind);
    if (!name) return hub;
    return hub.lookup(name);
  };

  const query = Far('QueryTool', {
    batchQuery,
    queryData,
    queryChildren,
    lookup,
    invalidate,
    fromCapData: m.fromCapData,
    toCapData: m.toCapData,
    // XXX wrong layer? add makeWalletView(query) helper function instead?
    walletView: addr => makeWalletView(addr, { query, vstorage }),
  });

  return { vstorage, query };
};
/** @typedef {Awaited<ReturnType<typeof makeQueryKit>>['query']} QueryTool */

export const make = () => {
  /** @param {number} ms */
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  /**
   * @param {string} mnemonic
   * @param {ERef<RpcClient>} rpcClient
   */
  const makeTxTool = async (mnemonic, rpcClient) => {
    const signer = await fromMnemonic(mnemonic);
    return makeSigningClient(signer, rpcClient);
  };

  /**
   * @param {string} mnemonic
   * @param {ERef<RpcClient>} rpcClient
   * @param {ERef<LCD>} lcd
   */
  const makeWalletKit = async (mnemonic, rpcClient, lcd) => {
    const signer = await fromMnemonic(mnemonic);
    const tx = await makeSigningClient(signer, rpcClient);

    const [{ address }] = await signer.getAccounts();

    const { vstorage, query } = makeQueryKit(lcd);
    const { fromCapData, toCapData } = query;
    const powers = { fromCapData, vstorage, delay };

    /**
     * @param {import('@agoric/smart-wallet/src/offers').OfferSpec} offer
     * @param {*} [fee]
     */
    const sendOffer = async (offer, fee = 'auto') => {
      const m0 = makeWalletMessageBy(
        address,
        { method: 'executeOffer', offer },
        toCapData,
      );
      const trx = await tx.signAndBroadcast(address, [m0], fee);
      assertIsDeliverTxSuccess(trx);
      const { transactionHash, height } = trx;
      return { transactionHash, height };
    };

    /**
     * @param {import('@agoric/smart-wallet/src/offers').OfferSpec} offer
     * @param {*} [fee]
     */
    const executeOffer = async (offer, fee = 'auto') => {
      const txInfo = await sendOffer(offer, fee);
      console.log({ offerId: offer.id, ...txInfo });
      const status = await pollOffer(address, offer.id, powers);
      return { tx: txInfo, status };
    };

    const walletView = makeWalletView(address, { query, vstorage });

    const smartWallet = Far('SmartWallet', {
      sendOffer,
      /** @param {string} id */
      pollOffer: id => pollOffer(address, id, powers),
      executeOffer,
      readOnly: () => walletView,
    });

    return { tx, query, smartWallet };
  };

  return Far('SmartWalletFactory', {
    makeTxTool,
    /** @param {ERef<LCD>} lcd */
    makeQueryTool: lcd => makeQueryKit(lcd).query,
    makeWalletKit,
  });
};

/** @typedef {Awaited<ReturnType<ReturnType<make>['makeWalletKit']>>} WalletKit */
