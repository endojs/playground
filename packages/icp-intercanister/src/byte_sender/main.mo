import Receiver "canister:byte_receiver";

persistent actor {
  public func send(bytes : [Nat8]) : async [Nat8] {
    await Receiver.accept(bytes)
  };
};
