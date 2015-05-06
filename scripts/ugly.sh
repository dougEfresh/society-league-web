#!/bin/bash
./node_modules/.bin/browserify -t reactify `find webapp/jsx/ -name '*.jsx'`  |  ./node_modules/.bin/uglifyjs   --screw-ie8  > webapp/js/bundle.js
