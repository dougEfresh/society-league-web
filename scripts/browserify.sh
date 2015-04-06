#!/bin/bash
cd webapp
../node_modules/.bin/browserify -t reactify --full-paths  -o js/bundle.js  jsx/*.jsx  jsx/*/*.jsx  
