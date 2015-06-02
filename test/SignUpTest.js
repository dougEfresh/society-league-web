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

casper.test.begin('Test Reset', function suite(test) {
    casper.start();
    casper.then(function(){
        testlib.init();
    });

    casper.then(function(){
       var dao = new UserDao(testlib.db,this,testlib.server);
        var 
        var user = new User(0,Match.random() * 1000,Math.random()*1000);
    });

    casper.thenOpen(testlib.server + '/index.html#/reset', function(){
    });

    casper.run(function(){
        test.done();
    });
});


