#!/bin/bash
./node_modules/.bin/browserify -t reactify `find  webapp/ -name '*.js*'  | grep -v /js/`   |  ./node_modules/.bin/uglifyjs   --screw-ie8  > webapp/js/bundle.js
