#!/bin/bash
./node_modules/.bin/browserify -t reactify --full-paths  -o webapp/js/bundle.js  `find webapp/jsx/ -name '*.jsx'`
