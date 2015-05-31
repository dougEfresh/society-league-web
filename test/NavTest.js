var Database = require('../webapp/lib/Database');
var utils = require('utils');
var testlib = require('./testLib');
var authUser = null;

casper.test.begin('Test Nav', function suite(test) {
    casper.start();
    casper.then(function(){
        testlib.init();
    });
    casper.thenOpen(testlib.server + '/index.html#/app/home', function(){
    });
    casper.then(function(){
        this.waitForSelector('#app-ready',function(){},testlib.notReady,testlib.timeout);
    });
    casper.then(function(){
        test.assertExists('#home-nav');
    });
    casper.then(function(){
        test.assertExists('#team-nav');
    });
    casper.then(function(){
        test.assertExists('#season-nav');
    });
    casper.then(function(){
        test.assertExists('#challenge-nav');
    });

    casper.run(function(){
        test.done();
    });
});
