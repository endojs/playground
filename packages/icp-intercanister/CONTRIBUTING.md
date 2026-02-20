# Contributing (ICP Inter-Canister Prototype)

## Interop Constraint Rule

This package models protocol-facing data. Type and wire-shape changes can break
interoperability even when local tests pass.

When you add or change protocol/message/value types (for example in
`src/ocapn_types.mo`), you must:

1. cite the external constraint source in code comments near the changed type
2. include the source link in the PR/commit message
3. explain whether the change is:
   - required by an external spec/test suite, or
   - a local prototype choice that is explicitly temporary

Minimum acceptable sources:

- OCapN spec/drafts (`ocapn/ocapn`)
- OCapN test suite behavior (`ocapn/ocapn-test-suite`)
- ICP/Candid reference docs (for wire-level Candid choices)

If no external source exists yet, add a `TODO(spec-gap)` comment and describe
the interoperability risk.
