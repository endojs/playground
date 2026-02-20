import Principal "mo:base/Principal";
import OcapnProtocol "./ocapn_protocol";
import OcapnTypes "./ocapn_types";
import Vattp "./vattp_boundary";

/// Refs:
/// - E `Ref.send` abstraction in e-on-java:
///   https://github.com/kpreid/e-on-java/tree/master/src/jsrc/org/erights/e/elib/ref
/// - OCapN message model (`deliver`, `deliver-only`, resolution):
///   https://github.com/ocapn/ocapn/blob/main/draft-specifications/Protocol.md
/// - OCapN selected test case (`deliver_with_resolver`):
///   https://github.com/ocapn/ocapn-test-suite/blob/main/tests/op_delivers.py
module {
  public type Channel = {
    peerPrincipal : Principal;
    sessionId : Text;
    channelId : Text;
    var turnId : Nat64;
  };

  public func sendMessage(
    channel : Channel,
    message : OcapnProtocol.OcapnMessage,
  ) : async OcapnProtocol.OcapnResolution {
    let turnId = channel.turnId;
    channel.turnId += 1;
    let peer : Vattp.VattpBoundary = actor (Principal.toText(channel.peerPrincipal));
    let envelope : Vattp.TurnEnvelope = {
      sessionId = channel.sessionId;
      channelId = channel.channelId;
      turnId;
      payload = to_candid(message);
    };
    let turnResult = await peer.handleInbound(envelope);
    let resolutionDecoded : ?OcapnProtocol.OcapnResolution = switch (turnResult) {
      case (#ok(payload)) from_candid(payload);
      case (#err(_)) null;
    };
    switch (resolutionDecoded) {
      case (?value) value;
      case null {
        {
          resolver = "decode-error";
          args = [#symbol("break"), #text("unable to decode OcapnResolution from candid bytes")];
        };
      };
    };
  };
};
