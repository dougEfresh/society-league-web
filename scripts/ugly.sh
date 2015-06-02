#!/bin/bash
./node_modules/.bin/browserify -t reactify webapp/app.jsx  |  ./node_modules/.bin/uglifyjs   --screw-ie8  > webapp/js/bundle.js
