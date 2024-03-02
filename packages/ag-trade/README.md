# ag-trade - plugins for Agoric trading agents

These plugins support

1.  rich vstorage queries returning object graphs (endo passables)
2.  sigining and broadcasting offers

<details><summary>endo CLI set-up</summary>

Get the `endo` CLI in your path. It's on the `endo` branch (currently 2023-12-30 12:27 096879a37). I use direnv to manage `$PATH`; it's also handy for managing some secrets we'll use later.

```
$ cd projects/playground/packages/ag-trade/
direnv: loading ~/projects/playground/.envrc
direnv: export +ALICE_SECRET +JACK_SECRET ~PATH

$ endo where state
/home/connolly/.local/state/endo
```

</details>

<details><summary>Makefile cheat-sheet</summary>

The default `Makefile` target in `ag-trade` also does `endo where state`:

```
$ make
state: /home/connolly/.local/state/endo
```

`make clean` does `endo reset`.

</details>

<details><summary>start local Agoric blockchain</summary>

Use `docker compose up -d`. (See `docker-compose.yml`.)

</details>

<details><summary>cosmos-fetch plug-in for simple network access</summary>

We run `src/cosmosFetch.js` unconfined (`--UNSAFE`) to make an object with the following interface:

```ts
interface CosmosFetch {
  makeRPCClient: (rpcURL: string) => RpcClient;
  makeLCDClient: (apiURL: string) => LCD;
}

interface LCD {
  // fetch(`${apiURL}${path}`).then(r => r.json())
  // plus a bit of error handling and options
  getJSON: (path: string, options) => Promise<any>;
}

/** imported from @cosmjs/tendermint-rpc */
interface RpcClient {
  execute: (request: JsonRpcRequest) => Promise<JsonRpcSuccessResponse>;
  readonly disconnect: () => void;
}
```

```
$ make fetch-plug-in
++ install cosmos fetch plugin
endo make --UNSAFE src/cosmosFetch.js -n cosmos-fetch
Object [Alleged: CosmosFetch] {}
```

</details>

<details><summary>ping Agoric chain using `/node_info` on LCD endpoint</summary>

Now we can run `net-local.js` confined as usual, passing `cosmos-fetch` as `net`.

```js
import { E } from '@endo/far';

export const make = async net =>
  harden({
    lcd: await E(net).makeLCDClient('http://localhost:1317'),
    rpc: await E(net).makeRPCClient('http://localhost:26657'),
  });
```

Then we use `endo eval` to call `getJSON` on one of those endpoints to get some info from a local node:

```
$ make node-info
endo make src/net-local.js -n local -p cosmos-fetch
{ lcd: Object [Alleged: LCD] {}, rpc: Object [Alleged: RpcClient] {} }

endo eval "E(local.lcd).getJSON('/node_info').then(i => i.node_info)" local
{
  channels: '40202122233038606100',
  id: '8da5e462e560eb951e2c6d8ad2f9ce50c58a0be6',
  listen_addr: 'tcp://0.0.0.0:26656',
  moniker: 'localnet',
  network: 'agoriclocal',
  other: { rpc_address: 'tcp://0.0.0.0:26657', tx_index: 'on' },
  protocol_version: { app: '0', block: '11', p2p: '8' },
  version: '0.34.23'
}
```

</details>

<details><summary>vstorage: Agoric VM data output service</summary>

One section of the LCD URL space is `/agoric/vstorage/${kind}/${path}`. The on-chain Agoric JavaScript VM has a service that writes data such that it's available from LCD endpoints without doing on-chain computation. It's a hierarchical key-value store that we can browse with simple web tools such as the [vstorage viewer](https://p2p-org.github.io/p2p-agoric-vstorage-viewer/#http://localhost:26657||) by p2p.

![image](https://github.com/endojs/playground/assets/150986/2137bd73-9f5c-4955-b0d5-cd549c0600cf)

To get the children of `published.agoricNames` using `endo`:

```
endo eval "E(local.lcd).getJSON('/agoric/vstorage/children/published.agoricNames')" local
{ children: [
    'brand',
    'installation',
    'instance',
...
  ], ... }
```

How about the data at `published.agoricNames.brand`?

```
$ endo eval "E(local.lcd).getJSON('/agoric/vstorage/data/published.agoricNames.brand')" local -n brand-data
{
  value: '{"blockHeight":"935","values":["{\\"body\\":\\"#[[\\\\\\"ATOM\\\\\\",\\\\\\"$0.Alleged: ATOM brand\\\\\\"],[\\\\\\"BLD\\\\\\",\\\\\\"$1.Alleged: BLD brand\\\\\\"],[\\\\\\"DAI_axl\\\\\\",\\\\\\"$2.Alleged: DAI_axl brand\\\\\\"],[\\\\\\"DAI_grv\\\\\\",\\\\\\"$3.Alleged: DAI_grv brand\\\\\\"],[\\\\\\"IST\\\\\\",\\\\\\"$4.Alleged: IST brand\\\\\\"],[\\\\\\"Invitation\\\\\\",\\\\\\"$5.Alleged: Zoe Invitation brand\\\\\\"],[\\\\\\"KREAdCHARACTER\\\\\\",\\\\\\"$6.Alleged: KREAdCHARACTER brand\\\\\\"],[\\\\\\"KREAdITEM\\\\\\",\\\\\\"$7.Alleged: KREAdITEM brand\\\\\\"],[\\\\\\"USDC_axl\\\\\\",\\\\\\"$8.Alleged: USDC_axl brand\\\\\\"],[\\\\\\"USDC_grv\\\\\\",\\\\\\"$9.Alleged: USDC_grv brand\\\\\\"],[\\\\\\"USDT_axl\\\\\\",\\\\\\"$10.Alleged: USDT_axl brand\\\\\\"],[\\\\\\"USDT_grv\\\\\\",\\\\\\"$11.Alleged: USDT_grv brand\\\\\\"],[\\\\\\"timer\\\\\\",\\\\\\"$12.Alleged: timerBrand\\\\\\"],[\\\\\\"stATOM\\\\\\",\\\\\\"$13.Alleged: stATOM brand\\\\\\"]]\\",\\"slots\\":[\\"board05557\\",\\"board0566\\",\\"board05736\\",\\"board03138\\",\\"board0257\\",\\"board0074\\",\\"board03281\\",\\"board00282\\",\\"board03040\\",\\"board04542\\",\\"board01744\\",\\"board03446\\",\\"board0425\\",\\"board00990\\"]}"]}'
}
```

What's all _that_?

</details>

<details><summary>Unmarshalling object graph query results in clients</summary>

Peeling off a couple layers, we get **capData**: a serialization of an object graph plus an array of slot identifiers for the graph exits.

```
$ endo eval "JSON.parse(JSON.parse(that.value).values[0])" that:brand-data
{
  body: '#[["ATOM","$0.Alleged: ATOM brand"],["BLD","$1.Alleged: BLD brand"],["DAI_axl","$2.Alleged: DAI_axl brand"],["DAI_grv","$3.Alleged: DAI_grv brand"],["IST","$4.Alleged: IST brand"],["Invitation","$5.Alleged: Zoe Invitation brand"],["KREAdCHARACTER","$6.Alleged: KREAdCHARACTER brand"],["KREAdITEM","$7.Alleged: KREAdITEM brand"],["USDC_axl","$8.Alleged: USDC_axl brand"],["USDC_grv","$9.Alleged: USDC_grv brand"],["USDT_axl","$10.Alleged: USDT_axl brand"],["USDT_grv","$11.Alleged: USDT_grv brand"],["timer","$12.Alleged: timerBrand"],["stATOM","$13.Alleged: stATOM brand"]]',
  slots: [
    'board05557', 'board0566',
    'board05736', 'board03138',
    'board0257',  'board0074',
    'board03281', 'board00282',
    'board03040', 'board04542',
    'board01744', 'board03446',
    'board0425',  'board00990'
  ]
}
```

The `smartWallet.js` client factory module supports these unmarshalling conventions.

```
endo make --UNSAFE src/smartWallet.js -n client-maker
Object [Alleged: SmartWalletFactory] {}
```

Now we can make a tool to that unmarshals query results:

```
endo eval "E(factory).makeQueryTool(local.lcd)" -n query-tool local factory:client-maker

endo eval "E(qt).queryData('published.agoricNames.brand')" qt:query-tool
[
  [ 'ATOM', Object [Alleged: ATOM brand#board05557] {} ],
  [ 'BLD', Object [Alleged: BLD brand#board0566] {} ],
  [ 'DAI_axl', Object [Alleged: DAI_axl brand#board05736] {} ],
  ...
  [ 'timer', Object [Alleged: timerBrand#board0425] {} ],
  [ 'stATOM', Object [Alleged: stATOM brand#board00990] {} ]
]
```

</details>

<details><summary>NameHub lookup</summary>

That array of pairs represents a map of names to values. Turning it into a record with `Object.fromEntries` is handy:

```
$ endo eval "E(queryTool).queryData('published.agoricNames.brand').then(kvs => Object.fromEntries(kvs))" queryTool:query-tool -n brand-graph
{
  ATOM: Object [Alleged: ATOM brand#board05557] {},
  BLD: Object [Alleged: BLD brand#board0566] {},
  DAI_axl: Object [Alleged: DAI_axl brand#board05736] {},
...
  stATOM: Object [Alleged: stATOM brand#board00990] {},
  timer: Object [Alleged: timerBrand#board0425] {}
}

$ endo eval "brand.ATOM" brand:brand-graph
Object [Alleged: ATOM brand#board05557] {}
```

The array of pairs are the entries of a **NameHub**, which is an interface similar to `Map`, but instead of `get`, it has an iterative `lookup` method:

```
$ endo eval "E(queryTool).lookup('agoricNames', 'brand', 'ATOM')" queryTool:query-tool
Object [Alleged: ATOM brand#board05557] {}
```

In general, `E(hub).lookup(a, b)` is the same as `E(E(hub).lookup(a)).lookup(b)` and so on:

```
$ endo eval "E(E(queryTool).lookup('agoricNames', 'brand')).lookup('ATOM')" queryTool:query-tool
Object [Alleged: ATOM brand#board05557] {}
```

ref: <a href="https://docs.agoric.com/guides/integration/name-services.html">[Name Services](https://docs.agoric.com/guides/integration/name-services.html)</a> in Agoric docs

</details>

<details><summary>Client for signing and broadcasting offer transactions</summary>

The next level of client is one that can sign and broadcast offer transactions.
Let's make one for Alice, using a mnemonic phrase to derive private keys:

```
endo eval "E(wf).makeWalletKit('survey thank ...', local.rpc, local.lcd)" \
        local wf:client-maker -n alice-wk
{
  query: Object [Alleged: QueryTool] {},
  smartWallet: Object [Alleged: SmartWallet] {},
  tx: Object [Alleged: SigningClient] {}
}
```

_The client factory should be an ordinary confined module, but
due to difficulties with getting protobuf libraries to run confined,
we use `--UNSAFE`. The signing part than handles private keys
should be in a separate worker from the offer / query construction code,
but due to lack of byte-string support in `@endo/marshal`, we keep them together._

</details>

<details><summary>fresh offer ids using simple clock plug-in</summary>

Each "offer" message we send to the Agoric chain needs an id.
It's handy to use something like `bid-1` to remember that it was a bid offer.
My habit is to use the clock a la `bid-12:53` so I can roughly correlate with logs etc.
Serial numbers would have sufficed, but I coded up the clock convention and
later realized that the code is simpler to audit if I break it into a small clock plugin
that runs unconfined and put the rest of the logic in a normal confined module.

```
$ make clock-plug-in
endo make --UNSAFE src/clock.js -n clock
Object [Alleged: Clock] {}
```

The `clock.js` module is pretty small and straightforward:

```js
import { Far } from '@endo/far';

export const make = () =>
  Far('Clock', {
    time: () => Date.now(),
  });
```

Using it looks like this:

```
$ make fresh-id
endo make src/fresh-id.js -n fresh
Object [Alleged: FreshMaker] {}

endo eval "E(fresh).start(clock, 'bid')" -n fresh-bid-id fresh clock
Object [Alleged: Fresh] {}

endo eval "E(bid).next()" bid:fresh-bid-id
bid0420.3

$ make fresh-id
endo eval "E(bid).next()" bid:fresh-bid-id
bid042048.4

$ make fresh-id
endo eval "E(bid).next()" bid:fresh-bid-id
bid042051.5
```

</details>

<details><summary>Simple offer: deposit to Inter Protocol Reserve</summary>

The `reserve-add.js` module demonstrates basic usage of `E(smartWallet).executeOffer(offerSpec)`:

```
$ make reserve-add
endo mkguest alice
Object [Alleged: EndoGuest] {}
endo send alice @wallet:alice-wk
endo send alice @fresh:fresh-trade-id
...
endo run src/reserve-add.js 1 IST -p alice
{
  status: {
    id: 'trade-0638.0',
    invitationSpec: {
      callPipe: [Array],
      instancePath: [Array],
      source: 'agoricContract'
    },
    numWantsSatisfied: 1,
    payouts: { Collateral: [Object] },
    proposal: { give: [Object] },
    result: 'added Collateral to the Reserve'
  },
  tx: {
    height: 31288,
    transactionHash: '700905EA480C2B9EE7A3AC06F96B8874FE84D5A460A10629CD5FD6A442756050'
  }
}
```

The code starts by turning the `1 IST` CLI args into a `{ brand, value }` record
where we look up `IST` in _agoricNames_ to find the brand and we look up
`wallet` in our petname store to find our vstorage query client:

```js
export const main = async (self, units, brandName) => {
  assert.typeof(units, 'string');
  assert.typeof(brandName, 'string');
  /** @type {import("./ag-trade").SmartWalletKit} */
  const { query: vstorage, smartWallet } = await E(self).lookup('wallet');
  /** @type {Brand<'nat'>} */
  const brand = await E(vstorage).lookup('agoricNames', 'brand', brandName);

  // TODO: lookup decimalPlaces by brand
  const Collateral = { brand, value: UNIT6 * BigInt(units) };
...
}
```

Then it allocates a fresh id, constructs an `OfferSpec`, executes it, and returns the result:

```js
  const fresh = E(self).lookup('fresh');
  const id = await E(fresh).next();

  const offerSpec = {
    id,
    invitationSpec: { instancePath: ['reserve'], ... }
...
    proposal: { give: { Collateral } },
  };

  const info = await E(smartWallet).executeOffer(offerSpec);
  return info;
```

</details>
