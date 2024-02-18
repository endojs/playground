# Contributing - Design Notes

## ocaml.org curl bash

```
bash -c "sh <(curl -fsSL https://raw.githubusercontent.com/ocaml/opam/master/shell/install.sh)"
opam init
```

hm... `Do you want opam to modify ~/.profile?`
I'd rather use direnv. Yay! it's a supported option: [Using direnv](https://ocaml.org/docs/opam-path#using-direnv).

... ocaml-base-compiler.5.1.1 ...

```
eval $(opam env --switch=default)
```

devtools:

```
opam install ocaml-lsp-server odoc ocamlformat utop
```

195 dependencies... pretty quick, though...

```
opam exec -- dune init proj ocproto
```

... [OCaml Platform \- Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=ocamllabs.ocaml-platform)

```
dune build --watch --terminal-persistence=clear-on-rebuild
```

crikey! that was fast.

## Road not taken: opam-nix

Following a [Feb 2023 item on opam-nix](https://www.tweag.io/blog/2023-02-16-opam-nix/), we begin with:

```console
$ nix flake init -t github:tweag/opam-nix
$ git add flake.nix
```

But then `nix develop` failed with `error: attribute 'ocproto' missing`.
