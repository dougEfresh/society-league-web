#!/bin/bash
SERVER=demo.dougchimento.com
npm install
[ -z "$1" ]  || SERVER=$1
./scripts/browserify.sh
./node_modules/.bin/json-proxy -f /api=http://$SERVER/  -f /connect=http://$SERVER/ ./webapp
