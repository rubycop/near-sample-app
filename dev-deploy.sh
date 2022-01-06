#!/bin/bash
set -e

near dev-deploy out/p2p.wasm

CONTRACT_ID=$(<neardev/dev-account)

near create-account p2p."$CONTRACT_ID" --masterAccount "$CONTRACT_ID" --initialBalance 100
near deploy --accountId p2p."$CONTRACT_ID" --wasmFile out/p2p.wasm
