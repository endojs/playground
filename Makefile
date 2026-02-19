SHELL := /bin/bash

DFX ?= $(HOME)/.local/share/dfx/bin/dfx
ICP_DEMO_DIR ?= packages/icp-intercanister
ICP_NETWORK ?= local
ICP_CANISTER ?= byte_sender
ICP_BYTES ?= '(vec { 73; 67; 80; 32; 111; 99; 97; 112 })'

.PHONY: icp-check icp-new icp-replica-start icp-deploy icp-call icp-replica-stop icp-hello icp-intercanister

icp-check:
	@test -x "$(DFX)" || (echo "dfx not found at $(DFX)"; exit 1)
	@$(DFX) --version

icp-new: icp-check
	@if [ -f "$(ICP_DEMO_DIR)/dfx.json" ]; then \
		echo "exists: $(ICP_DEMO_DIR)"; \
	else \
		echo "missing $(ICP_DEMO_DIR)/dfx.json"; \
		exit 1; \
	fi

icp-replica-start: icp-check
	cd "$(ICP_DEMO_DIR)" && ( "$(DFX)" stop >/dev/null 2>&1 || true )
	cd "$(ICP_DEMO_DIR)" && "$(DFX)" start --clean --background

icp-deploy: icp-check
	cd "$(ICP_DEMO_DIR)" && "$(DFX)" deploy --network "$(ICP_NETWORK)"

icp-call: icp-check
	cd "$(ICP_DEMO_DIR)" && "$(DFX)" canister call --network "$(ICP_NETWORK)" "$(ICP_CANISTER)" send "$(ICP_BYTES)"

icp-replica-stop: icp-check
	cd "$(ICP_DEMO_DIR)" && "$(DFX)" stop

icp-hello: icp-new icp-replica-start icp-deploy icp-call
	@echo "ICP onboarding/inter-canister demo done."

icp-intercanister: icp-new icp-replica-start icp-deploy icp-call
	@echo "ICP inter-canister demo done."
