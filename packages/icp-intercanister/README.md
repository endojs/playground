# ICP Inter-Canister Byte Demo

This package is a local ICP onboarding prototype with two Motoko canisters:

- `byte_receiver`: receives `vec nat8` and returns it unchanged.
- `byte_sender`: calls `byte_receiver.accept(...)` and returns the remote result.

The goal is to validate inter-canister messaging with an arbitrary byte sequence.

## Layout

- `src/byte_receiver/main.mo`
- `src/byte_sender/main.mo`
- `dfx.json`

## Local Run

From repo root:

```bash
make icp-intercanister
```

This will:

1. start local replica
2. deploy both canisters
3. call `byte_sender.send(...)` with a sample byte payload

Stop local replica when done:

```bash
make icp-replica-stop
```

## Manual Call Example

```bash
cd packages/icp-intercanister
~/.local/share/dfx/bin/dfx canister call --network local byte_sender send '(vec { 73; 67; 80; 32; 111; 99; 97; 112 })'
```

Expected response is the same byte vector echoed back.
