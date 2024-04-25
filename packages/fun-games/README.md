# endo games WIP

goal:

```
playground/packages/fun-games$ endo purge --force

playground/packages/fun-games$ endo make src/rock-paper-scissors.js -n rps
Starting Endo daemon...
Object [Alleged: RockPaperScissors] {}

playground/packages/fun-games$ endo mkhost bob bob-agent
Object [Alleged: EndoHost] {}

playground/packages/fun-games$ endo eval 'E(rps).playAgainst(bob)' bob rps
```

but I get:

```
CapTP cli exception: (RemoteTypeError(error:captp:Endo#20001)#1)
RemoteTypeError(error:captp:Endo#20001)#1: target has no method "accept", has ["__getInterfaceGuard__","__getMethodNames__","open","receive"]

  at decodeErrorCommon (packages/marshal/src/marshal.js:303:24)
  at decodeErrorFromCapData (packages/marshal/src/marshal.js:331:14)
  at decodeFromCapData (packages/marshal/src/encodeToCapData.js:384:27)
  at fromCapData (packages/marshal/src/marshal.js:393:23)
  at CTP_RETURN (packages/captp/src/captp.js:693:24)
  at dispatch (packages/captp/src/captp.js:772:7)
  at packages/daemon/src/connection.js:36:7

(RemoteTypeError(error:captp:Endo#20001)#1)
```
