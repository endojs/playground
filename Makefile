SHELL := /bin/bash

DFX ?= $(HOME)/.local/share/dfx/bin/dfx
ICP_HELLO_DIR ?= packages/icp-hello
ICP_NETWORK ?= local
ICP_CANISTER ?= icp-hello-backend

.PHONY: icp-check icp-new icp-replica-start icp-deploy icp-call icp-replica-stop icp-hello

icp-check:
	@test -x "$(DFX)" || (echo "dfx not found at $(DFX)"; exit 1)
	@$(DFX) --version

icp-new: icp-check
	@if [ -d "$(ICP_HELLO_DIR)" ]; then \
		echo "exists: $(ICP_HELLO_DIR)"; \
	else \
		mkdir -p "$(dir $(ICP_HELLO_DIR))"; \
		cd "$(dir $(ICP_HELLO_DIR))" && "$(DFX)" new "$(notdir $(ICP_HELLO_DIR))" --type motoko --no-frontend; \
	fi

icp-replica-start: icp-check
	cd "$(ICP_HELLO_DIR)" && ( "$(DFX)" stop >/dev/null 2>&1 || true )
	cd "$(ICP_HELLO_DIR)" && "$(DFX)" start --clean --background

icp-deploy: icp-check
	cd "$(ICP_HELLO_DIR)" && "$(DFX)" deploy --network "$(ICP_NETWORK)"

icp-call: icp-check
	cd "$(ICP_HELLO_DIR)" && "$(DFX)" canister call --network "$(ICP_NETWORK)" "$(ICP_CANISTER)" greet '("ICP learner")'

icp-replica-stop: icp-check
	cd "$(ICP_HELLO_DIR)" && "$(DFX)" stop

icp-hello: icp-new icp-replica-start icp-deploy icp-call
	@echo "ICP hello-world done."
