module OcapnBytes = Ocapn.Make(Capnp.BytesMessage)

let val1 = OcapnBytes.Builder.Value.String "abc"

let show v = match v with
|(OcapnBytes.Builder.Value.String s) -> s
| _ -> "unknown value"
