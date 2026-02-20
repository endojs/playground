import Principal "mo:base/Principal";
import Blob "mo:base/Blob";

module {
  /*
   * Refs:
   * - e-on-java net/vattp interfaces:
   *   https://github.com/kpreid/e-on-java/tree/master/src/jsrc/net/vattp
   *   - Connection.java
   *   - Handler.java
   *   - Reactor.java
   * - OCapN netlayer draft:
   *   https://github.com/ocapn/ocapn/blob/main/draft-specifications/Netlayers.md
   *
   * This file captures VatTP/netlayer-like responsibilities that remain above
   * ICP transport substrate concerns.
   */

  public type SessionId = Text;
  public type ChannelId = Text;
  public type Locator = Text;

  public type Endpoint = {
    canister : Principal;
    exportId : Text;
  };

  // Transport envelope only; payload semantics live in `ocapn_protocol.mo`.
  public type TurnEnvelope = {
    sessionId : SessionId;
    channelId : ChannelId;
    turnId : Nat64;
    payload : Blob;
  };

  public type TurnResult = {
    #ok : Blob;
    #err : Text;
  };

  // Java analogue: Handler.run(record, len)
  // Remaining responsibility: transport-level inbound turn handling.
  public type InboundHandler = {
    handleInbound : shared TurnEnvelope -> async TurnResult;
  };

  /*
   * Outstanding wrinkle:
   * - Historically, VatTP had explicit connection/session lifecycle concerns
   *   (see e-on-java `Connection`/`Reactor`).
   * - In the current split for this prototype, start-session handshake semantics
   *   are modeled at OCapN protocol level (`ocapn_protocol.mo` `#start_session`),
   *   not as separate VatTP-boundary callbacks.
   * - For pure inter-canister ICP flows, vat-pair state plus sequence tracking
   *   acts as the implicit logical channel.
   */

  // Remaining responsibility: locator routing above raw canister ids.
  public type Routing = {
    resolveLocator : shared Locator -> async ?Endpoint;
  };

  // Consolidated VatTP/netlayer boundary interface.
  public type VattpBoundary = actor {
    handleInbound : shared TurnEnvelope -> async TurnResult;
  };
};
