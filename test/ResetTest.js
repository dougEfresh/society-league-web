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
        test.assertExists('#reset-app');
    });
    casper.then(function () {
        this.fill('form#reset', {'username': 'dchimento@gmail.com'}, false);
    });
    casper.then(function () {
        this.click('#submit');
    });
    casper.then(function () {
        this.waitForSelector('#page-ready',function(){},testlib.notReady('page-ready'),testlib.timeout);
    });
    casper.then(function(){
        test.assertExists('#reset-sent-app');
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
        testlib.pass = 'dchimento';
        this.fill('form#login', {'username': 'dchimento@gmail.com', 'password': 'dchimento','confirm-password':'dchimento'}, false);
    });
    casper.then(function () {
        this.click('#submit');
    });

    casper.then(function () {
        this.waitForSelector('#page-ready',function(){},testlib.notReady('app-ready'),testlib.timeout);
        // this.echo(this.getHTML());
    });

    casper.then(function () {
        this.echo(this.getCurrentUrl());
        this.echo(this.getHTML());
        test.assertExists('#login-app');
    });

    casper.then(function () {
        //this.waitForSelector('#app-ready',function(){},testlib.notReady('app-ready'),testlib.timeout);
        // this.echo(this.getHTML());
    });

    casper.run(function(){
        test.done();
    });
});


