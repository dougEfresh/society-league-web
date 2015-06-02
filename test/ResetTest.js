var Database = require('../webapp/lib/Database');
var utils = require('utils');
var testlib = require('./testLib');
var MatchDao = require('../webapp/lib/dao/MatchDao');
var Status = require('../webapp/lib/Status');
var SlotDao = require('../webapp/lib/SlotDao');
var selectedDay = null;
var selectedOp = 0;
var token = null;

casper.test.begin('Test Reset', function suite(test) {
    casper.start();
    casper.then(function(){
       // testlib.init();
    });
    casper.thenOpen(testlib.server + '/index.html#/reset', function(){
    });
    casper.then(function(){
        this.waitForSelector('#page-ready',function(){},testlib.notReady('page-ready'),testlib.timeout);
    });

    casper.then(function(){
        if (!test.assertExists('#reset-app')) {
            this.die("reset-app");
        }
    });
    casper.then(function () {
        this.fill('form#reset', {'username': testlib.user}, false);
    });
    casper.then(function () {
        this.click('#submit');
    });
    casper.then(function () {
        this.waitForSelector('#page-ready',function(){},testlib.notReady('page-ready'),testlib.timeout);
    });
    casper.then(function(){
        this.waitForSelector('#reset-sent-app',function(){},testlib.notReady('reset-sent-app'),testlib.timeout);
        //testlib.exists(test,'#reset-sent-app');
    });
    casper.then(function(){
        test.assert(this.getCurrentUrl().indexOf('passwordReset=true') >= 0, 'password-reset is set');
    });

    casper.then(function(){
        data = this.evaluate(function(wsurl) {
            return JSON.parse(__utils__.sendAJAX(wsurl, 'GET', null, false));
        }, {wsurl: testlib.server + '/api/reset/request/' + testlib.user});
        test.assert(data != null  && data != undefined, 'data != null');
        test.assert(data.token != undefined && data.token != null , 'token != null');
        token = data.token;
        this.thenOpen(testlib.server + '/index.html#/reset?token='+ token, function(){});
    });

    casper.then(function(){
        testlib.pass = Math.random() + "";
        this.fill('form#login', {'username': testlib.user, 'password': testlib.pass,'confirm-password': testlib.pass},false);
    });
    casper.then(function () {
        this.click('#submit');
    });

    casper.then(function () {
        this.waitForSelector('#page-ready',function(){},testlib.notReady('app-ready'),testlib.timeout);
        // this.echo(this.getHTML());
    });

    casper.then(function () {
        this.waitForSelector('#login-app',function(){},testlib.notReady('login-app'),testlib.timeout);
    });

    casper.then(function () {
        testlib.init();
    });


    casper.thenOpen(testlib.server + '/index.html#/app/home',function(){

    });

    casper.then(function () {
        this.waitForSelector('#home-app',function(){},testlib.notReady('home-app'),testlib.timeout);
    });

    casper.run(function(){
        test.done();
    });
});


