#!/bin/bash
set -e

near deploy --accountId $NEAR_ID --wasmFile out/p2p.wasm
