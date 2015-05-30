#!/bin/bash 
./node_modules/.bin/watchify -v -t reactify  -o webapp/js/bundle.js `find webapp/jsx/ -name '*.js*'` `find webapp/content/ -name '*.js*'` `find webapp/lib/ -name '*.js*'`
