import Blob "mo:base/Blob";
import Principal "mo:base/Principal";
import Receiver "canister:byte_receiver";
import OcapnProtocol "../ocapn_protocol";
import OcapnTypes "../ocapn_types";
import RefSend "../ref_send";
import Vattp "../vattp_boundary";

persistent actor {
  let theChannel : RefSend.Channel = {
    peerPrincipal = Principal.fromActor(Receiver);
    sessionId = "selected-case";
    channelId = "selected-case";
    var turnId : Nat64 = 1;
  };

  private func selectedCaseArgs() : [OcapnTypes.OcapnValue] {
    [
      #text("foo"),
      #int(1),
      #bool(false),
      #bytes(Blob.fromArray([98, 97, 114])),
      #list([#text("baz")]),
    ];
  };

  public func ocapn_deliver_with_resolver_ok() : async Bool {
    let echoProxy = object {
      let myChannel = theChannel;
      let to = "echo-gc";

      public func call(
        args : [OcapnTypes.OcapnValue],
        resolveMeDesc : ?Text,
      ) : async OcapnProtocol.OcapnResolution {
        let message : OcapnProtocol.OcapnMessage = #deliver({
          to;
          args;
          answerPosition = null;
          resolve_me_desc = resolveMeDesc;
        });
        await RefSend.sendMessage(myChannel, message);
      };
    };

    let args = selectedCaseArgs();
    let resolution = await echoProxy.call(args, ?"$0");

    let expected : OcapnProtocol.OcapnResolution = {
      resolver = "$0";
      args = [#symbol("fulfill"), #list(args)];
    };
    resolution == expected
  };

  public func handleInbound(
    _envelope : Vattp.TurnEnvelope
  ) : async Vattp.TurnResult {
    #err("byte_sender does not handle inbound protocol messages in this prototype")
  };
};
