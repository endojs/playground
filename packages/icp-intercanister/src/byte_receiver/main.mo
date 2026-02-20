import OcapnProtocol "../ocapn_protocol";
import OcapnTypes "../ocapn_types";
import Vattp "../vattp_boundary";

persistent actor {
  // Minimal echo callable; `call` mirrors callable-object naming conventions.
  func call(args : [OcapnTypes.OcapnValue]) : [OcapnTypes.OcapnValue] {
    args
  };

  /// Minimal selected-case behavior for
  /// `op_delivers::OpDeliverTest::test_deliver_with_resolver`.
  func ocapn_handle(
    message : OcapnProtocol.OcapnMessage
  ) : async OcapnProtocol.OcapnResolution {
    switch (message) {
      case (#deliver(deliver)) {
        let resolver = switch (deliver.resolve_me_desc) {
          case (?desc) desc;
          case null "missing-resolver";
        };
        {
          resolver;
          args = [#symbol("fulfill"), #list(call(deliver.args))];
        };
      };
      case (#deliver_only(_)) {
        {
          resolver = "deliver-only";
          args = [#symbol("break"), #text("deliver-only has no response in this prototype")];
        };
      };
      case (_) {
        {
          resolver = "unsupported-op";
          args = [#symbol("break"), #text("unsupported op for selected-case prototype")];
        };
      };
    };
  };

  public func handleInbound(
    envelope : Vattp.TurnEnvelope
  ) : async Vattp.TurnResult {
    let parsed : ?OcapnProtocol.OcapnMessage = from_candid(envelope.payload);
    switch (parsed) {
      case (?message) #ok(to_candid(await ocapn_handle(message)));
      // Fallback keeps the byte-echo prototype path alive while handleInbound
      // is the sole public entrypoint.
      case null #ok(envelope.payload);
    };
  };
};
