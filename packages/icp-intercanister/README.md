# OCapN-on-ICP Inter-Canister Prototype

This package explores one concrete OCapN interoperability goal on ICP:

- implement the selected OCapN deliver test behavior
  (`op_delivers::OpDeliverTest::test_deliver_with_resolver`)
- represent OCapN-style messages/values in Motoko
- execute the scenario across two canisters on a local ICP replica

The inter-canister plumbing in this package is in service of that goal.

Current canisters:

- `byte_receiver`: OCapN-message receiver for the selected-case behavior, plus a byte echo method.
- `byte_sender`: test driver that performs inter-canister calls and validates expected resolution shape.

Before changing protocol-facing types, read `CONTRIBUTING.md`.

## Layout

- `src/byte_receiver/main.mo`
- `src/byte_sender/main.mo`
- `dfx.json`

## Run

From repo root:

```bash
make icp-intercanister
```

This command:

1. start local replica
2. deploy both canisters
3. calls `byte_sender.send(...)` with a sample byte payload

Run the selected OCapN deliver-with-resolver case between canisters:

```bash
make icp-ocapn-deliver-with-resolver
```

This package targets an
[OCapN test-suite](https://github.com/ocapn/ocapn-test-suite) case:

- `tests/op_delivers.py::OpDeliverTest::test_deliver_with_resolver`

In this prototype, that case is exercised by calling
`byte_sender.ocapn_deliver_with_resolver_ok`, which expects:

```candid
(true)
```

The selected-case method models:

- message: `op:deliver`
- args: `["foo", 1, false, b"bar", ["baz"]]`
- expected resolution args: `[symbol("fulfill"), original_args]`

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

Manual selected-case call:

```bash
cd packages/icp-intercanister
TERM=xterm-256color ~/.local/share/dfx/bin/dfx canister call --network local byte_sender ocapn_deliver_with_resolver_ok
```

## Where Local State Lives

Documented by ICP `dfx start` docs:

- shared local network data root (Linux):
  - `$HOME/.local/share/dfx/network/local`
- project-specific local network data root:
  - `<project dir>/.dfx/network/local`

Source:

- https://internetcomputer.org/docs/building-apps/developer-tools/dfx/dfx-start

- Project-local `.dfx/`:
  - build outputs, generated interfaces, local canister IDs
- Replica runtime internals under the shared-root path above:
  - observed on this setup (`dfx 0.30.2`) under subpaths like
    `.../state/replicated_state/...`
  - exact internal directory/file layout is implementation detail and may change
    across `dfx`/replica versions.

So if you are looking for raw local canister state, inspect the shared local
network data root as well as project `.dfx`.
