var Database = require('../webapp/lib/Database');
var utils = require('utils');
var testlib = require('./testLib');
var authUser = null;

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
    casper.thenOpen(testlib.server + '/api/user', function () {
        authUser = JSON.parse(this.getPageContent());
    });
    casper.then(function () {
        test.assert(authUser != null, "AuthUser is null");
    });

    casper.thenOpen(testlib.server + '/index.html#/app/home', function(){
    });
    casper.then(function(){
        this.waitForSelector('#appReady',function(){},testlib.notReady,testlib.timeout);
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
