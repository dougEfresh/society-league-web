#!/bin/bash
./node_modules/.bin/browserify -t reactify  -o js/bundle.js  jsx/*.jsx  jsx/*/*.jsx  
