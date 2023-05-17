# ocapn.capnp
@0xcd301da1d95b8242;

struct Value {
  union {
    ## Atoms ##

    undefined @0 :Void;
    null @1 :Void;
    bool @2 :Bool;
    float64 @3 :Float64;

    unsignedInt @4 :Data;
    # Non-negative integer, in big-endian format
    negativeInt @5 :Data;
    # Negative integer. value is `-1 - n`, where `n`
    # is the data interpreted as an unsigned big-endian integer.

    string @6 :Text;
    byteString @7 :Data;
    symbol @8 :Text; # Might be removed, pending #46.

    ## Containers ##

    list @9 :List(Value);

    struct @10 :List(StructField);
    # Duplicate keys are not allowed; will need to enforce this at a higher level
    # of abstraction.

    tagged :group {
      label @11 :Text;
      value @12 :Value;
    }

    capability @13 :Cap;

    error @14 :Error;
  }
}

struct StructField {
  key @0 :Text;
  value @1 :Value;
}

interface Cap {
  # TODO
}

struct Error {
  # TODO, pending #10.
}