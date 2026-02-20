import OcapnTypes "ocapn_types";

module {
  /*
   * Refs:
   * - OCapN test suite:
   *   https://github.com/ocapn/ocapn-test-suite
   * - OCapN netlayer draft:
   *   https://github.com/ocapn/ocapn/blob/main/draft-specifications/Netlayers.md
   *
   * OCapN/CapTP protocol data structures (messages only).
   * No method interfaces are defined here.
   */

  public type RefId = Text;
  public type Desc = Text;
  public type PublicKey = Blob;
  public type Location = Text;
  public type Signature = Blob;

  public type OpStartSession = {
    captpVersion : Text;
    sessionPubkey : PublicKey;
    location : Location;
    locationSig : Signature;
  };

  public type OpListen = {
    to : Desc;
    resolveMeDesc : Desc;
  };

  public type OpDeliverOnly = {
    to : Desc;
    args : [OcapnTypes.OcapnValue];
  };

  public type OpDeliver = {
    to : Desc;
    args : [OcapnTypes.OcapnValue];
    answerPosition : ?Nat;
    resolve_me_desc : ?Text;
  };

  public type OpAbort = {
    reason : Text;
  };

  public type OpGcExport = {
    exportPosition : Nat;
    wireDelta : Int;
  };

  public type OpGcAnswer = {
    answerPosition : Nat;
  };

  // Top-level OCapN/CapTP protocol messages.
  public type OcapnMessage = {
    #start_session : OpStartSession;
    #listen : OpListen;
    #deliver_only : OpDeliverOnly;
    #deliver : OpDeliver;
    #abort : OpAbort;
    #gc_export : OpGcExport;
    #gc_answer : OpGcAnswer;
  };

  public type OcapnResolution = {
    resolver : Text;
    args : [OcapnTypes.OcapnValue];
  };
};
