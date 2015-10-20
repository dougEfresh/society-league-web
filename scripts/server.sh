#!/bin/bash
SERVER=leaguesdev.societybilliards.com
npm install
[ -z "$1" ]  || SERVER=$1
./scripts/browserify.sh
./node_modules/.bin/json-proxy -f /connect=http://$SERVER/ -f /signup=http://$SERVER/  -f /signin=http://$SERVER/ -f /api=http://$SERVER/  ./webapp
