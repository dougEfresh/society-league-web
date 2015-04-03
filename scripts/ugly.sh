#!/bin/bash
./node_modules/.bin/browserify -t reactify jsx/*.jsx jsx/*/*.jsx  |  ./node_modules/.bin/uglifyjs   --screw-ie8  > js/bundle.js
