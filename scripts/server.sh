#!/bin/bash
SERVER=demo.dougchimento.com
[ -z "$1" ]  || SERVER=$1
./node_modules/.bin/json-proxy -f /api=http://$SERVER/ ./webapp
