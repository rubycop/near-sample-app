#!/bin/bash
set -e

if [ ${#NEAR_ID} -eq 0 ]
then
 read -p "Enter NEAR_ID: " NEAR_ID
fi

CONTRACT_ID=$(<neardev/dev-account)

echo "---> Create test order:"
near call $CONTRACT_ID create_order '{"title": "MacBook PRO", "spend": "tech", "price": "100", "description": "description"}' --accountId $NEAR_ID
