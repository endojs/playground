import Blob "mo:base/Blob";
import Nat64 "mo:base/Nat64";
import Principal "mo:base/Principal";
import Text "mo:base/Text";

module {
  /// Refs:
  /// - OCapN swissnum object lookup usage in tests (`fetch` arg is opaque bytes):
  ///   https://github.com/ocapn/ocapn-test-suite/blob/main/utils/captp.py
  /// - ICP randomness source (`raw_rand`) via management canister.
  ///
  /// Notes:
  /// - Descriptor-table positions (import/export/answer) are authority-safe only
  ///   when scoped to a session and validated on inbound messages.
  /// - Swissnums are bearer secrets for bootstrap/discovery, so they must be
  ///   high-entropy and unguessable.
  /// - This helper mints swissnum tokens from IC entropy and context data.
  ///   A follow-on hardening step should hash/KDF this to a fixed-width token.

  public type State = {
    var nextCounter : Nat64;
  };

  public func emptyState() : State {
    {
      var nextCounter = 0;
    };
  };

  let IC : actor {
    raw_rand : () -> async Blob;
  } = actor ("aaaaa-aa");

  public func mint(
    state : State,
    caller : Principal,
    sessionId : Text,
  ) : async Blob {
    state.nextCounter += 1;
    let entropy = await IC.raw_rand();

    // Domain-separated context so minted values are namespaced to this usage.
    let context = Text.encodeUtf8(
      "ocapn-swissnum:v1:"
      # Principal.toText(caller)
      # ":"
      # sessionId
      # ":"
      # Nat64.toText(state.nextCounter)
    );

    // TODO(ocap-authority): hash/KDF (entropy || context) to a fixed-size token.
    // For now we return opaque bytes with fresh entropy and context mixed in.
    Blob.fromArray(Blob.toArray(entropy) # Blob.toArray(context));
  };
};
