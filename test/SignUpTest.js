var Database = require('../webapp/lib/Database');
var utils = require('utils');
var testlib = require('./testLib');
var MatchDao = require('../webapp/lib/dao/MatchDao');
var Status = require('../webapp/lib/Status');
var SlotDao = require('../webapp/lib/SlotDao');
var selectedDay = null;
var selectedOp = 0;
var token = null;
var UserDao = require('../webapp/lib/UserDao');
var User= require('../webapp/lib/User');

casper.test.begin('Test SignUp', function suite(test) {
    casper.start();

    casper.then(function(){
        testlib.init();
    });

    casper.then(function(){
        var user = testlib.createUser();
        testlib.user = user.login;
        testlib.pass = user.pass;
    });

    casper.thenOpen(testlib.server + '/index.html#/login', function(){
    });
    casper.then(function(){
        testlib.login(testlib.user,testlib.pass);
    });
    casper.thenOpen(testlib.server + '/index.html#/app/home', function(){

    });
    casper.then(function(){
        this.waitForSelector('#home-app',function(){},testlib.notReady('home-app'),testlib.timeout);
    });
    casper.then(function(){
        test.assertExists('#challenge-signup-link','Found challenge signup');
    });
    casper.then(function(){
        this.clickLabel("What's This?")
    });
    casper.then(function(){
        this.waitForSelector('#challenge-signup',function(){},testlib.notReady('challenge-signup'),testlib.timeout);
    });
    casper.then(function(){
        this.clickLabel('Sign up now');
    });
    casper.then(function(){
        this.waitForSelector('#home-app',function(){},testlib.notReady('home-app'),testlib.timeout);
    });
    casper.then(function(){
        test.assertDoesntExist('#challenge-signup-link','Challenge signup doesn\'t exist');
    });
    casper.run(function(){
        test.done();
    });
});


