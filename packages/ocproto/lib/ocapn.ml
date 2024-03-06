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

module MakeRPC(MessageWrapper : Capnp.RPC.S) = struct
  type 'a reader_t = 'a MessageWrapper.StructStorage.reader_t
  type 'a builder_t = 'a MessageWrapper.StructStorage.builder_t
  module CamlBytes = Bytes
  module DefaultsMessage_ = Capnp.BytesMessage

  let _builder_defaults_message =
    let message_segments = [
      Bytes.unsafe_of_string "\
      ";
    ] in
    DefaultsMessage_.Message.readonly
      (DefaultsMessage_.Message.of_storage message_segments)

  let invalid_msg = Capnp.Message.invalid_msg

  include Capnp.Runtime.BuilderInc.Make(MessageWrapper)

  type 'cap message_t = 'cap MessageWrapper.Message.t

  module DefaultsCopier_ =
    Capnp.Runtime.BuilderOps.Make(Capnp.BytesMessage)(MessageWrapper)

  let _reader_defaults_message =
    MessageWrapper.Message.create
      (DefaultsMessage_.Message.total_size _builder_defaults_message)


  module Reader = struct
    type array_t = ro MessageWrapper.ListStorage.t
    type builder_array_t = rw MessageWrapper.ListStorage.t
    type pointer_t = ro MessageWrapper.Slice.t option
    let of_pointer = RA_.deref_opt_struct_pointer

    module Value = struct
      type struct_t = [`Value_c1e0b700b2217535]
      type t = struct_t reader_t
      module Tagged = struct
        type struct_t = [`Tagged_a5320ad60e584e37]
        type t = struct_t reader_t
        let has_label x =
          RA_.has_field x 0
        let label_get x =
          RA_.get_text ~default:"" x 0
        let has_value x =
          RA_.has_field x 1
        let value_get x =
          RA_.get_struct x 1
        let value_get_pipelined x =
          MessageWrapper.Untyped.struct_field x 1
        let of_message x = RA_.get_root_struct (RA_.Message.readonly x)
        let of_builder x = Some (RA_.StructStorage.readonly x)
      end
      let undefined_get x = ()
      let null_get x = ()
      let bool_get x =
        RA_.get_bit ~default:false x ~byte_ofs:2 ~bit_ofs:0
      let float64_get x =
        RA_.get_float64 ~default_bits:(0L) x 8
      let has_unsigned_int x =
        RA_.has_field x 0
      let unsigned_int_get x =
        RA_.get_blob ~default:"" x 0
      let has_negative_int x =
        RA_.has_field x 0
      let negative_int_get x =
        RA_.get_blob ~default:"" x 0
      let has_string x =
        RA_.has_field x 0
      let string_get x =
        RA_.get_text ~default:"" x 0
      let has_byte_string x =
        RA_.has_field x 0
      let byte_string_get x =
        RA_.get_blob ~default:"" x 0
      let has_symbol x =
        RA_.has_field x 0
      let symbol_get x =
        RA_.get_text ~default:"" x 0
      let has_list x =
        RA_.has_field x 0
      let list_get x = 
        RA_.get_struct_list x 0
      let list_get_list x =
        Capnp.Array.to_list (list_get x)
      let list_get_array x =
        Capnp.Array.to_array (list_get x)
      let has_struct x =
        RA_.has_field x 0
      let struct_get x = 
        RA_.get_struct_list x 0
      let struct_get_list x =
        Capnp.Array.to_list (struct_get x)
      let struct_get_array x =
        Capnp.Array.to_array (struct_get x)
      let tagged_get x = RA_.cast_struct x
      let capability_get x =
        RA_.get_interface x 0
      let capability_get_pipelined x = 
        MessageWrapper.Untyped.capability_field x 0
      let has_error x =
        RA_.has_field x 0
      let error_get x =
        RA_.get_struct x 0
      let error_get_pipelined x =
        MessageWrapper.Untyped.struct_field x 0
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
      let get x =
        match RA_.get_uint16 ~default:0 x 0 with
        | 0 -> Undefined
        | 1 -> Null
        | 2 -> Bool (bool_get x)
        | 3 -> Float64 (float64_get x)
        | 4 -> UnsignedInt (unsigned_int_get x)
        | 5 -> NegativeInt (negative_int_get x)
        | 6 -> String (string_get x)
        | 7 -> ByteString (byte_string_get x)
        | 8 -> Symbol (symbol_get x)
        | 9 -> List (list_get x)
        | 10 -> Struct (struct_get x)
        | 11 -> Tagged (tagged_get x)
        | 12 -> Capability (capability_get x)
        | 13 -> Error (error_get x)
        | v -> Undefined_ v
      let of_message x = RA_.get_root_struct (RA_.Message.readonly x)
      let of_builder x = Some (RA_.StructStorage.readonly x)
    end
    module StructField = struct
      type struct_t = [`StructField_d9589d6287c97882]
      type t = struct_t reader_t
      let has_key x =
        RA_.has_field x 0
      let key_get x =
        RA_.get_text ~default:"" x 0
      let has_value x =
        RA_.has_field x 1
      let value_get x =
        RA_.get_struct x 1
      let value_get_pipelined x =
        MessageWrapper.Untyped.struct_field x 1
      let of_message x = RA_.get_root_struct (RA_.Message.readonly x)
      let of_builder x = Some (RA_.StructStorage.readonly x)
    end
    module Cap = struct
      type t = [`Cap_a55c265a7af9eff8]
    end
    module Error = struct
      type struct_t = [`Error_bed4e90f6370ba90]
      type t = struct_t reader_t
      let of_message x = RA_.get_root_struct (RA_.Message.readonly x)
      let of_builder x = Some (RA_.StructStorage.readonly x)
    end
  end

  module Builder = struct
    type array_t = Reader.builder_array_t
    type reader_array_t = Reader.array_t
    type pointer_t = rw MessageWrapper.Slice.t

    module Value = struct
      type struct_t = [`Value_c1e0b700b2217535]
      type t = struct_t builder_t
      module Tagged = struct
        type struct_t = [`Tagged_a5320ad60e584e37]
        type t = struct_t builder_t
        let has_label x =
          BA_.has_field x 0
        let label_get x =
          BA_.get_text ~default:"" x 0
        let label_set x v =
          BA_.set_text x 0 v
        let has_value x =
          BA_.has_field x 1
        let value_get x =
          BA_.get_struct ~data_words:2 ~pointer_words:2 x 1
        let value_set_reader x v =
          BA_.set_struct ~data_words:2 ~pointer_words:2 x 1 v
        let value_set_builder x v =
          BA_.set_struct ~data_words:2 ~pointer_words:2 x 1 (Some v)
        let value_init x =
          BA_.init_struct ~data_words:2 ~pointer_words:2 x 1
        let of_message x = BA_.get_root_struct ~data_words:2 ~pointer_words:2 x
        let to_message x = x.BA_.NM.StructStorage.data.MessageWrapper.Slice.msg
        let to_reader x = Some (RA_.StructStorage.readonly x)
        let init_root ?message_size () =
          BA_.alloc_root_struct ?message_size ~data_words:2 ~pointer_words:2 ()
        let init_pointer ptr =
          BA_.init_struct_pointer ptr ~data_words:2 ~pointer_words:2
      end
      let undefined_get x = ()
      let undefined_set x =
        BA_.set_void ~discr:{BA_.Discr.value=0; BA_.Discr.byte_ofs=0} x
      let null_get x = ()
      let null_set x =
        BA_.set_void ~discr:{BA_.Discr.value=1; BA_.Discr.byte_ofs=0} x
      let bool_get x =
        BA_.get_bit ~default:false x ~byte_ofs:2 ~bit_ofs:0
      let bool_set x v =
        BA_.set_bit ~discr:{BA_.Discr.value=2; BA_.Discr.byte_ofs=0} ~default:false x ~byte_ofs:2 ~bit_ofs:0 v
      let float64_get x =
        BA_.get_float64 ~default_bits:(0L) x 8
      let float64_set x v =
        BA_.set_float64 ~discr:{BA_.Discr.value=3; BA_.Discr.byte_ofs=0} ~default_bits:(0L) x 8 v
      let has_unsigned_int x =
        BA_.has_field x 0
      let unsigned_int_get x =
        BA_.get_blob ~default:"" x 0
      let unsigned_int_set x v =
        BA_.set_blob ~discr:{BA_.Discr.value=4; BA_.Discr.byte_ofs=0} x 0 v
      let has_negative_int x =
        BA_.has_field x 0
      let negative_int_get x =
        BA_.get_blob ~default:"" x 0
      let negative_int_set x v =
        BA_.set_blob ~discr:{BA_.Discr.value=5; BA_.Discr.byte_ofs=0} x 0 v
      let has_string x =
        BA_.has_field x 0
      let string_get x =
        BA_.get_text ~default:"" x 0
      let string_set x v =
        BA_.set_text ~discr:{BA_.Discr.value=6; BA_.Discr.byte_ofs=0} x 0 v
      let has_byte_string x =
        BA_.has_field x 0
      let byte_string_get x =
        BA_.get_blob ~default:"" x 0
      let byte_string_set x v =
        BA_.set_blob ~discr:{BA_.Discr.value=7; BA_.Discr.byte_ofs=0} x 0 v
      let has_symbol x =
        BA_.has_field x 0
      let symbol_get x =
        BA_.get_text ~default:"" x 0
      let symbol_set x v =
        BA_.set_text ~discr:{BA_.Discr.value=8; BA_.Discr.byte_ofs=0} x 0 v
      let has_list x =
        BA_.has_field x 0
      let list_get x = 
        BA_.get_struct_list ~data_words:2 ~pointer_words:2 x 0
      let list_get_list x =
        Capnp.Array.to_list (list_get x)
      let list_get_array x =
        Capnp.Array.to_array (list_get x)
      let list_set x v =
        BA_.set_struct_list ~data_words:2 ~pointer_words:2 ~discr:{BA_.Discr.value=9; BA_.Discr.byte_ofs=0} x 0 v
      let list_init x n =
        BA_.init_struct_list ~data_words:2 ~pointer_words:2 ~discr:{BA_.Discr.value=9; BA_.Discr.byte_ofs=0} x 0 n
      let list_set_list x v =
        let builder = list_init x (List.length v) in
        let () = List.iteri (fun i a -> Capnp.Array.set builder i a) v in
        builder
      let list_set_array x v =
        let builder = list_init x (Array.length v) in
        let () = Array.iteri (fun i a -> Capnp.Array.set builder i a) v in
        builder
      let has_struct x =
        BA_.has_field x 0
      let struct_get x = 
        BA_.get_struct_list ~data_words:0 ~pointer_words:2 x 0
      let struct_get_list x =
        Capnp.Array.to_list (struct_get x)
      let struct_get_array x =
        Capnp.Array.to_array (struct_get x)
      let struct_set x v =
        BA_.set_struct_list ~data_words:0 ~pointer_words:2 ~discr:{BA_.Discr.value=10; BA_.Discr.byte_ofs=0} x 0 v
      let struct_init x n =
        BA_.init_struct_list ~data_words:0 ~pointer_words:2 ~discr:{BA_.Discr.value=10; BA_.Discr.byte_ofs=0} x 0 n
      let struct_set_list x v =
        let builder = struct_init x (List.length v) in
        let () = List.iteri (fun i a -> Capnp.Array.set builder i a) v in
        builder
      let struct_set_array x v =
        let builder = struct_init x (Array.length v) in
        let () = Array.iteri (fun i a -> Capnp.Array.set builder i a) v in
        builder
      let tagged_get x = BA_.cast_struct x
      let tagged_init x =
        let data = x.BA_.NM.StructStorage.data in
        let pointers = x.BA_.NM.StructStorage.pointers in
        let () = ignore data in
        let () = ignore pointers in
        let () = BA_.set_opt_discriminant data
          (Some {BA_.Discr.value=11; BA_.Discr.byte_ofs=0})
        in
        let () =
          let ptr = {
            pointers with
            MessageWrapper.Slice.start = pointers.MessageWrapper.Slice.start + 0;
            MessageWrapper.Slice.len = 8;
          } in
          let () = BA_.BOps.deep_zero_pointer ptr in
          MessageWrapper.Slice.set_int64 ptr 0 0L
        in
        let () =
          let ptr = {
            pointers with
            MessageWrapper.Slice.start = pointers.MessageWrapper.Slice.start + 8;
            MessageWrapper.Slice.len = 8;
          } in
          let () = BA_.BOps.deep_zero_pointer ptr in
          MessageWrapper.Slice.set_int64 ptr 0 0L
        in
        BA_.cast_struct x
      let capability_get x =
        BA_.get_interface x 0
      let capability_get_pipelined x = 
        MessageWrapper.Untyped.capability_field x 0
      let capability_set x v =
        BA_.set_interface ~discr:{BA_.Discr.value=12; BA_.Discr.byte_ofs=0} x 0 v
      let has_error x =
        BA_.has_field x 0
      let error_get x =
        BA_.get_struct ~data_words:0 ~pointer_words:0 x 0
      let error_set_reader x v =
        BA_.set_struct ~data_words:0 ~pointer_words:0 ~discr:{BA_.Discr.value=13; BA_.Discr.byte_ofs=0} x 0 v
      let error_set_builder x v =
        BA_.set_struct ~data_words:0 ~pointer_words:0 ~discr:{BA_.Discr.value=13; BA_.Discr.byte_ofs=0} x 0 (Some v)
      let error_init x =
        BA_.init_struct ~data_words:0 ~pointer_words:0 ~discr:{BA_.Discr.value=13; BA_.Discr.byte_ofs=0} x 0
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
      let get x =
        match BA_.get_uint16 ~default:0 x 0 with
        | 0 -> Undefined
        | 1 -> Null
        | 2 -> Bool (bool_get x)
        | 3 -> Float64 (float64_get x)
        | 4 -> UnsignedInt (unsigned_int_get x)
        | 5 -> NegativeInt (negative_int_get x)
        | 6 -> String (string_get x)
        | 7 -> ByteString (byte_string_get x)
        | 8 -> Symbol (symbol_get x)
        | 9 -> List (list_get x)
        | 10 -> Struct (struct_get x)
        | 11 -> Tagged (tagged_get x)
        | 12 -> Capability (capability_get x)
        | 13 -> Error (error_get x)
        | v -> Undefined_ v
      let of_message x = BA_.get_root_struct ~data_words:2 ~pointer_words:2 x
      let to_message x = x.BA_.NM.StructStorage.data.MessageWrapper.Slice.msg
      let to_reader x = Some (RA_.StructStorage.readonly x)
      let init_root ?message_size () =
        BA_.alloc_root_struct ?message_size ~data_words:2 ~pointer_words:2 ()
      let init_pointer ptr =
        BA_.init_struct_pointer ptr ~data_words:2 ~pointer_words:2
    end
    module StructField = struct
      type struct_t = [`StructField_d9589d6287c97882]
      type t = struct_t builder_t
      let has_key x =
        BA_.has_field x 0
      let key_get x =
        BA_.get_text ~default:"" x 0
      let key_set x v =
        BA_.set_text x 0 v
      let has_value x =
        BA_.has_field x 1
      let value_get x =
        BA_.get_struct ~data_words:2 ~pointer_words:2 x 1
      let value_set_reader x v =
        BA_.set_struct ~data_words:2 ~pointer_words:2 x 1 v
      let value_set_builder x v =
        BA_.set_struct ~data_words:2 ~pointer_words:2 x 1 (Some v)
      let value_init x =
        BA_.init_struct ~data_words:2 ~pointer_words:2 x 1
      let of_message x = BA_.get_root_struct ~data_words:0 ~pointer_words:2 x
      let to_message x = x.BA_.NM.StructStorage.data.MessageWrapper.Slice.msg
      let to_reader x = Some (RA_.StructStorage.readonly x)
      let init_root ?message_size () =
        BA_.alloc_root_struct ?message_size ~data_words:0 ~pointer_words:2 ()
      let init_pointer ptr =
        BA_.init_struct_pointer ptr ~data_words:0 ~pointer_words:2
    end
    module Cap = struct
      type t = [`Cap_a55c265a7af9eff8]
    end
    module Error = struct
      type struct_t = [`Error_bed4e90f6370ba90]
      type t = struct_t builder_t
      let of_message x = BA_.get_root_struct ~data_words:0 ~pointer_words:0 x
      let to_message x = x.BA_.NM.StructStorage.data.MessageWrapper.Slice.msg
      let to_reader x = Some (RA_.StructStorage.readonly x)
      let init_root ?message_size () =
        BA_.alloc_root_struct ?message_size ~data_words:0 ~pointer_words:0 ()
      let init_pointer ptr =
        BA_.init_struct_pointer ptr ~data_words:0 ~pointer_words:0
    end
  end

  module Client = struct
    module Cap = struct
      type t = [`Cap_a55c265a7af9eff8]
      let interface_id = Stdint.Uint64.of_string "0xa55c265a7af9eff8"
      let method_name = function
        | _ -> None
      let () = Capnp.RPC.Registry.register ~interface_id ~name:"Cap" method_name
    end
  end

  module Service = struct
    module Cap = struct
      type t = [`Cap_a55c265a7af9eff8]
      let interface_id = Stdint.Uint64.of_string "0xa55c265a7af9eff8"
      class virtual service = object (self)
        method release = ()
        method dispatch ~interface_id:i ~method_id =
          if i <> interface_id then MessageWrapper.Untyped.unknown_interface ~interface_id:i
          else match method_id with
          | x -> MessageWrapper.Untyped.unknown_method ~interface_id ~method_id
        method pp f = Format.pp_print_string f "Cap"
      end
      let local (service:#service) =
        MessageWrapper.Untyped.local service
    end
  end
  module MessageWrapper = MessageWrapper
end

module Make(M:Capnp.MessageSig.S) = MakeRPC(Capnp.RPC.None(M))
