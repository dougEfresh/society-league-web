var Database = require('../webapp/lib/Database');
var utils = require('utils');
var testlib = require('./testLib');

casper.test.begin('Test Home Page', function suite(test) {
    casper.start();
    casper.thenOpen(testlib.server + '/api/data', function() {
        Database.init(JSON.parse(this.getPageContent()));
    });
    casper.then(function(){
        test.assert(Database.isLoaded());
    });
    casper.thenOpen(testlib.server + '/index.html', function(){
        this.waitForSelector('#loginApp',function(){},testlib.notReady,testlib.timeout);
    });
    casper.then(function() {
        testlib.login();
    });

    casper.thenOpen(testlib.server + '/index.html#/home', function(){
    });
    casper.then(function(){
        this.waitForSelector('#appReady',function(){},testlib.notReady,testlib.timeout);
    });
    casper.then(function() {
        test.assertExists('#welcome-name');
    });

    casper.run(function(){
        test.done();
    });
});
