import Blob "mo:base/Blob";

module {
  /*
   * Refs:
   * - https://github.com/ocapn/ocapn-test-suite/blob/main/tests/op_delivers.py
   *   (`OpDeliverTest::test_deliver_with_resolver`)
   * - https://github.com/ocapn/ocapn/issues/3#issuecomment-1552187671
   */
  public type OcapnValue = {
    #unit;
    #bool : Bool;
    #int : Int;
    #text : Text;
    #symbol : Text;
    #bytes : Blob;
    #list : [OcapnValue];
  };
};
