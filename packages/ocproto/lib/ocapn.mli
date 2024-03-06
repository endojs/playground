[@@@ocaml.warning "-27-32-37-60"]

type ro = Capnp.Message.ro
type rw = Capnp.Message.rw

module type S = sig
  module MessageWrapper : Capnp.RPC.S
  type 'cap message_t = 'cap MessageWrapper.Message.t
  type 'a reader_t = 'a MessageWrapper.StructStorage.reader_t
  type 'a builder_t = 'a MessageWrapper.StructStorage.builder_t


  module Reader : sig
    type array_t
    type builder_array_t
    type pointer_t = ro MessageWrapper.Slice.t option
    val of_pointer : pointer_t -> 'a reader_t
    module Value : sig
      type struct_t = [`Value_c1e0b700b2217535]
      type t = struct_t reader_t
      module Tagged : sig
        type struct_t = [`Tagged_a5320ad60e584e37]
        type t = struct_t reader_t
        val has_label : t -> bool
        val label_get : t -> string
        val has_value : t -> bool
        val value_get : t -> [`Value_c1e0b700b2217535] reader_t
        val value_get_pipelined : struct_t MessageWrapper.StructRef.t -> [`Value_c1e0b700b2217535] MessageWrapper.StructRef.t
        val of_message : 'cap message_t -> t
        val of_builder : struct_t builder_t -> t
      end
      type unnamed_union_t =
        | Undefined
        | Null
        | Bool of bool
        | Float64 of float
        | UnsignedInt of string
        | NegativeInt of string
        | String of string
        | ByteString of string
        | Symbol of string
        | List of (ro, [`Value_c1e0b700b2217535] reader_t, array_t) Capnp.Array.t
        | Struct of (ro, [`StructField_d9589d6287c97882] reader_t, array_t) Capnp.Array.t
        | Tagged of Tagged.t
        | Capability of [`Cap_a55c265a7af9eff8] MessageWrapper.Capability.t option
        | Error of [`Error_bed4e90f6370ba90] reader_t
        | Undefined_ of int
      val get : t -> unnamed_union_t
      val of_message : 'cap message_t -> t
      val of_builder : struct_t builder_t -> t
    end
    module StructField : sig
      type struct_t = [`StructField_d9589d6287c97882]
      type t = struct_t reader_t
      val has_key : t -> bool
      val key_get : t -> string
      val has_value : t -> bool
      val value_get : t -> Value.t
      val value_get_pipelined : struct_t MessageWrapper.StructRef.t -> Value.struct_t MessageWrapper.StructRef.t
      val of_message : 'cap message_t -> t
      val of_builder : struct_t builder_t -> t
    end
    module Cap : sig
      type t = [`Cap_a55c265a7af9eff8]
    end
    module Error : sig
      type struct_t = [`Error_bed4e90f6370ba90]
      type t = struct_t reader_t
      val of_message : 'cap message_t -> t
      val of_builder : struct_t builder_t -> t
    end
  end

  module Builder : sig
    type array_t = Reader.builder_array_t
    type reader_array_t = Reader.array_t
    type pointer_t = rw MessageWrapper.Slice.t
    module Value : sig
      type struct_t = [`Value_c1e0b700b2217535]
      type t = struct_t builder_t
      module Tagged : sig
        type struct_t = [`Tagged_a5320ad60e584e37]
        type t = struct_t builder_t
        val has_label : t -> bool
        val label_get : t -> string
        val label_set : t -> string -> unit
        val has_value : t -> bool
        val value_get : t -> [`Value_c1e0b700b2217535] builder_t
        val value_set_reader : t -> [`Value_c1e0b700b2217535] reader_t -> [`Value_c1e0b700b2217535] builder_t
        val value_set_builder : t -> [`Value_c1e0b700b2217535] builder_t -> [`Value_c1e0b700b2217535] builder_t
        val value_init : t -> [`Value_c1e0b700b2217535] builder_t
        val of_message : rw message_t -> t
        val to_message : t -> rw message_t
        val to_reader : t -> struct_t reader_t
        val init_root : ?message_size:int -> unit -> t
        val init_pointer : pointer_t -> t
      end
      type unnamed_union_t =
        | Undefined
        | Null
        | Bool of bool
        | Float64 of float
        | UnsignedInt of string
        | NegativeInt of string
        | String of string
        | ByteString of string
        | Symbol of string
        | List of (rw, [`Value_c1e0b700b2217535] builder_t, array_t) Capnp.Array.t
        | Struct of (rw, [`StructField_d9589d6287c97882] builder_t, array_t) Capnp.Array.t
        | Tagged of Tagged.t
        | Capability of [`Cap_a55c265a7af9eff8] MessageWrapper.Capability.t option
        | Error of [`Error_bed4e90f6370ba90] builder_t
        | Undefined_ of int
      val get : t -> unnamed_union_t
      val undefined_set : t -> unit
      val null_set : t -> unit
      val bool_set : t -> bool -> unit
      val float64_set : t -> float -> unit
      val unsigned_int_set : t -> string -> unit
      val negative_int_set : t -> string -> unit
      val string_set : t -> string -> unit
      val byte_string_set : t -> string -> unit
      val symbol_set : t -> string -> unit
      val list_set : t -> (rw, [`Value_c1e0b700b2217535] builder_t, array_t) Capnp.Array.t -> (rw, [`Value_c1e0b700b2217535] builder_t, array_t) Capnp.Array.t
      val list_set_list : t -> [`Value_c1e0b700b2217535] builder_t list -> (rw, [`Value_c1e0b700b2217535] builder_t, array_t) Capnp.Array.t
      val list_set_array : t -> [`Value_c1e0b700b2217535] builder_t array -> (rw, [`Value_c1e0b700b2217535] builder_t, array_t) Capnp.Array.t
      val list_init : t -> int -> (rw, [`Value_c1e0b700b2217535] builder_t, array_t) Capnp.Array.t
      val struct_set : t -> (rw, [`StructField_d9589d6287c97882] builder_t, array_t) Capnp.Array.t -> (rw, [`StructField_d9589d6287c97882] builder_t, array_t) Capnp.Array.t
      val struct_set_list : t -> [`StructField_d9589d6287c97882] builder_t list -> (rw, [`StructField_d9589d6287c97882] builder_t, array_t) Capnp.Array.t
      val struct_set_array : t -> [`StructField_d9589d6287c97882] builder_t array -> (rw, [`StructField_d9589d6287c97882] builder_t, array_t) Capnp.Array.t
      val struct_init : t -> int -> (rw, [`StructField_d9589d6287c97882] builder_t, array_t) Capnp.Array.t
      val tagged_init : t -> Tagged.t
      val capability_set : t -> [`Cap_a55c265a7af9eff8] MessageWrapper.Capability.t option -> unit
      val error_set_reader : t -> [`Error_bed4e90f6370ba90] reader_t -> [`Error_bed4e90f6370ba90] builder_t
      val error_set_builder : t -> [`Error_bed4e90f6370ba90] builder_t -> [`Error_bed4e90f6370ba90] builder_t
      val error_init : t -> [`Error_bed4e90f6370ba90] builder_t
      val of_message : rw message_t -> t
      val to_message : t -> rw message_t
      val to_reader : t -> struct_t reader_t
      val init_root : ?message_size:int -> unit -> t
      val init_pointer : pointer_t -> t
    end
    module StructField : sig
      type struct_t = [`StructField_d9589d6287c97882]
      type t = struct_t builder_t
      val has_key : t -> bool
      val key_get : t -> string
      val key_set : t -> string -> unit
      val has_value : t -> bool
      val value_get : t -> Value.t
      val value_set_reader : t -> Value.struct_t reader_t -> Value.t
      val value_set_builder : t -> Value.t -> Value.t
      val value_init : t -> Value.t
      val of_message : rw message_t -> t
      val to_message : t -> rw message_t
      val to_reader : t -> struct_t reader_t
      val init_root : ?message_size:int -> unit -> t
      val init_pointer : pointer_t -> t
    end
    module Cap : sig
      type t = [`Cap_a55c265a7af9eff8]
    end
    module Error : sig
      type struct_t = [`Error_bed4e90f6370ba90]
      type t = struct_t builder_t
      val of_message : rw message_t -> t
      val to_message : t -> rw message_t
      val to_reader : t -> struct_t reader_t
      val init_root : ?message_size:int -> unit -> t
      val init_pointer : pointer_t -> t
    end
  end
end

module MakeRPC(MessageWrapper : Capnp.RPC.S) : sig
  include S with module MessageWrapper = MessageWrapper

  module Client : sig
    module Cap : sig
      type t = [`Cap_a55c265a7af9eff8]
      val interface_id : Stdint.Uint64.t
    end
  end

  module Service : sig
    module Cap : sig
      type t = [`Cap_a55c265a7af9eff8]
      val interface_id : Stdint.Uint64.t
      class virtual service : object
        inherit MessageWrapper.Untyped.generic_service
      end
      val local : #service -> t MessageWrapper.Capability.t
    end
  end
end

module Make(M : Capnp.MessageSig.S) : module type of MakeRPC(Capnp.RPC.None(M))
