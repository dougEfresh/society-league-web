//var Database = require('../webapp/lib/Database');
var utils = require('utils');
var testlib = require('./testLib');

casper.test.begin('Test Home Page', function suite(test) {
    casper.start();
    casper.thenOpen(testlib.server + '/index.html#/login', function(){
        this.waitForSelector('#pageReady',function(){},testlib.notReady,testlib.timeout);
    });
    casper.run(function(){
        test.done();
    });
});
