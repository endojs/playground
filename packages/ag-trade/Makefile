STATE=$(shell endo where state)
PET=$(STATE)/pet-store

where:
	@echo state: $(STATE)

reserve-add: src/reserve-add.js $(PET)/alice
	endo run src/reserve-add.js 1 IST -p alice

$(PET)/alice: $(PET)/alice-wk $(PET)/fresh-trade-id
	endo mkguest alice

	endo send alice @wallet:alice-wk
	endo send alice @fresh:fresh-trade-id
	endo inbox --as alice
	# these 0/1 message numbers are fragile
	endo adopt 0 wallet --as alice
	endo adopt 1 fresh --as alice

$(PET)/fresh-trade-id: $(PET)/fresh $(PET)/clock
	endo eval "E(fresh).start(clock, 'trade-')" fresh -n fresh-trade-id clock

# making fresh IDs requires non-deterministic inputs: clock access
fresh-id: $(PET)/fresh-bid-id
	endo eval "E(bid).next()" bid:fresh-bid-id

$(PET)/fresh-bid-id: $(PET)/fresh
	endo eval "E(fresh).start(clock, 'bid')" -n fresh-bid-id fresh clock

$(PET)/fresh: src/fresh-id.js
	endo make src/fresh-id.js -n fresh

# in makeWalletKit, it's too easy to get the rpc, lcd order wrong. should be named
$(PET)/alice-wk: $(PET)/local $(PET)/client-maker
	endo eval "E(wf).makeWalletKit('${ALICE_SECRET}', local.rpc, local.lcd)" \
		local wf:client-maker -n alice-wk

well-known-brands: $(PET)/query-tool
	endo eval "E(E(queryTool).lookup('agoricNames', 'brand')).entries().then(kvs => Object.fromEntries(kvs))" -n well-known-brands queryTool:query-tool

unmarshal: $(PET)/brand-graph

$(PET)/brand-graph: $(PET)/query-tool
	endo eval "E(queryTool).queryData('published.agoricNames.brand').then(kvs => Object.fromEntries(kvs))" queryTool:query-tool -n brand-graph

$(PET)/query-tool: $(PET)/client-maker $(PET)/local
	endo eval "E(factory).makeQueryTool(local.lcd)" -n query-tool local factory:client-maker

client-maker: $(PET)/client-maker

node-info: $(PET)/local
	endo eval "E(local.lcd).getJSON('/node_info').then(i => i.node_info)" local

$(PET)/local: src/net-local.js $(PET)/cosmos-fetch
	endo make src/net-local.js -n local -p cosmos-fetch

# only the code below here runs unconfined
plug-ins: $(PET)/client-maker $(PET)/cosmos-fetch $(PET)/clock

fetch-plug-in: $(PET)/cosmos-fetch

clock-plug-in: $(PET)/clock

$(PET)/client-maker: src/smartWallet.js
	@echo ++ start smart wallet caplet -- TODO: should not need UNSAFE
	endo make --UNCONFINED src/smartWallet.js -n client-maker

$(PET)/cosmos-fetch: src/cosmosFetch.js
	@echo ++ install cosmos fetch plugin
	endo make --UNCONFINED src/cosmosFetch.js -n cosmos-fetch

# WIP: factor clock out of fresh-id
$(PET)/clock:
	 endo make --UNCONFINED src/clock.js -n clock

clean:
	endo reset
