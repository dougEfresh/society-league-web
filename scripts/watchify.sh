#!/bin/bash 
./node_modules/.bin/watchify -v -t reactify  -o js/bundle.js jsx/*.jsx jsx/*/*.jsx  
