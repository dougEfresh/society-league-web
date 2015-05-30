#!/bin/bash 
./node_modules/.bin/watchify -v -t reactify  -o webapp/js/bundle.js  `find webapp/ -name '*.jsx'`
