SHELL := /bin/bash

DFX ?= $(HOME)/.local/share/dfx/bin/dfx
DFX_ENV ?= TERM=xterm-256color
ICP_DEMO_DIR ?= packages/icp-intercanister
ICP_NETWORK ?= local
ICP_CANISTER ?= byte_sender
ICP_BYTES ?= (vec { 73; 67; 80; 32; 111; 99; 97; 112 })

.PHONY: icp-check icp-new icp-port-check icp-replica-start icp-deploy icp-call icp-ocapn-case icp-replica-stop icp-hello icp-intercanister icp-ocapn-deliver-with-resolver ocapn

icp-check:
	@test -x "$(DFX)" || (echo "dfx not found at $(DFX)"; exit 1)
	@$(DFX_ENV) "$(DFX)" --version

icp-new: icp-check
	@if [ -f "$(ICP_DEMO_DIR)/dfx.json" ]; then \
		echo "exists: $(ICP_DEMO_DIR)"; \
	else \
		echo "missing $(ICP_DEMO_DIR)/dfx.json"; \
		exit 1; \
	fi

icp-port-check:
	@if command -v lsof >/dev/null 2>&1; then \
		if lsof -nP -iTCP:4943 -sTCP:LISTEN >/dev/null 2>&1; then \
			echo "port 4943 already in use; dfx cannot start local replica."; \
			lsof -nP -iTCP:4943 -sTCP:LISTEN; \
			echo "stop that process (or kill its PID) and retry."; \
			exit 1; \
		fi; \
	fi

icp-replica-start: icp-check
	cd "$(ICP_DEMO_DIR)" && ( $(DFX_ENV) "$(DFX)" stop >/dev/null 2>&1 || true )
	@$(MAKE) icp-port-check
	cd "$(ICP_DEMO_DIR)" && $(DFX_ENV) "$(DFX)" start --clean --background

icp-deploy: icp-check
	cd "$(ICP_DEMO_DIR)" && $(DFX_ENV) "$(DFX)" deploy --network "$(ICP_NETWORK)"

icp-call: icp-check
	cd "$(ICP_DEMO_DIR)" && $(DFX_ENV) "$(DFX)" canister call --network "$(ICP_NETWORK)" "$(ICP_CANISTER)" send '$(ICP_BYTES)'

icp-ocapn-case: icp-check
	cd "$(ICP_DEMO_DIR)" && $(DFX_ENV) "$(DFX)" canister call --network "$(ICP_NETWORK)" "byte_sender" ocapn_deliver_with_resolver_ok

icp-replica-stop: icp-check
	cd "$(ICP_DEMO_DIR)" && $(DFX_ENV) "$(DFX)" stop

icp-hello: icp-new icp-replica-start icp-deploy icp-call
	@echo "ICP onboarding/inter-canister demo done."

icp-intercanister: icp-new icp-replica-start icp-deploy icp-call
	@echo "ICP inter-canister demo done."

icp-ocapn-deliver-with-resolver: icp-new icp-replica-start icp-deploy icp-ocapn-case
	@echo "ICP OCapN selected-case demo done."

ocapn: icp-ocapn-deliver-with-resolver
