import Blob "mo:base/Blob";
import Receiver "canister:byte_receiver";
import Ocapn "../ocapn_types";

persistent actor {
  public func send(bytes : [Nat8]) : async [Nat8] {
    await Receiver.accept(bytes)
  };

  private func selectedCaseArgs() : [Ocapn.OcapnValue] {
    [
      #text("foo"),
      #int(1),
      #bool(false),
      #bytes(Blob.fromArray([98, 97, 114])),
      #list([#text("baz")]),
    ];
  };

  public func ocapn_deliver_with_resolver_ok() : async Bool {
    let args = selectedCaseArgs();
    let message : Ocapn.OcapnMessage = {
      op = #deliver;
      args;
      resolve_me_desc = ?"$0";
    };

    let resolution = await Receiver.ocapn_handle(message);
    let expected : Ocapn.OcapnResolution = {
      resolver = "$0";
      args = [#symbol("fulfill"), #list(args)];
    };
    resolution == expected
  };
};
