import Ocapn "../ocapn_types";

persistent actor {
  public func accept(bytes : [Nat8]) : async [Nat8] {
    bytes
  };

  /// Minimal selected-case behavior for
  /// `op_delivers::OpDeliverTest::test_deliver_with_resolver`.
  public func ocapn_handle(message : Ocapn.OcapnMessage) : async Ocapn.OcapnResolution {
    let resolver = switch (message.resolve_me_desc) {
      case (?desc) desc;
      case null "missing-resolver";
    };

    switch (message.op) {
      case (#deliver) {
        {
          resolver;
          args = [#symbol("fulfill"), #list(message.args)];
        };
      };
      case (#deliver_only) {
        {
          resolver;
          args = [#symbol("break"), #text("deliver-only has no response in this prototype")];
        };
      };
    };
  };
};
