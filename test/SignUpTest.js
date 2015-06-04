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
        var dao = new UserDao(testlib.db,this,testlib.server);
        var name = Math.random() * 1000;
        var user = new User(0,name,name);
        user.login = name + '@example.com';
        user.email = name + '@example.com';
        user.password = "password";
        testlib.user = user.login;
        testlib.pass = user.password;
        //var newUser = dao.create(user);
        var newUser = this.evaluate(function(wsurl,user) {
            return JSON.parse(__utils__.sendAJAX(wsurl, 'POST', JSON.stringify(user), false,{
                contentType: "application/json"
            }));
        }, {wsurl: testlib.server + '/api/user/create/0',user: user });
        test.assert(newUser != null,'NewUser != null');
        console.log(JSON.stringify(newUser));
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
        test.assertDoesntExist('#challenge-signup-link','Found challenge signup');
    });
    casper.run(function(){
        test.done();
    });
});


