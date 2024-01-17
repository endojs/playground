/**
 * Usage:
 * $ endo make --UNSAFE src/cosmosFetch.js -n cosmos-fetch
 * Object [Alleged: CosmosFetch] {}
 * $ endo make test/net-local.js -n local -p cosmos-fetch
 * { lcd: Object [Alleged: LCD] {}, rpc: Object [Alleged: RpcClient] {} }
 */
import { E } from '@endo/far';

export const make = async net =>
  harden({
    lcd: await E(net).makeLCDClient('http://localhost:1317'),
    rpc: await E(net).makeRPCClient('http://localhost:26657'),
  });
