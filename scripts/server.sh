#!/bin/bash
SERVER=http://leaguesdev.societybilliards.com
npm install
[ -z "$1" ]  || SERVER=$1
./scripts/browserify.sh
./node_modules/.bin/json-proxy -f /connect=$SERVER/ -f /signup=$SERVER/  -f /signin=$SERVER/ -f /api=$SERVER/  ./webapp
