var Database = require('../webapp/lib/Database');
var utils = require('utils');
var testlib = require('./testLib');
var MatchDao = require('../webapp/lib/dao/MatchDao');
var Status = require('../webapp/lib/Status');
var SlotDao = require('../webapp/lib/SlotDao');
var selectedDay = null;
var selectedOp = 0;

casper.test.begin('Test RequestApp', function suite(test) {
    casper.start();
    casper.then(function(){
        testlib.init();
    });
    casper.thenOpen(testlib.server + '/index.html#/app/challenge/request', function(){
    });
    casper.then(function(){
        this.waitForSelector('#app-ready',function(){},testlib.notReady('app-ready'),testlib.timeout);
    });
    casper.then(function(){
        test.assertExists('#request-app');
        test.assertExists('#challenge-opponent');
        test.assertExists('#challenge-date');
    });
    casper.then(function() {
        this.fillSelectors('form#request-app', {
            'select[name="challenge-opponent"]' : '212'
        }, false);
    });


    casper.then(function() {
        var opponents = this.evaluate(function(){
            var ops = [];
            var children = document.getElementById('challenge-opponent').children;
            for (var i = 0; i < children.length; i++ ) {
                if (children[i].value != '-1')
                    ops.push(children[i].value);
            }
            return ops;
        });
        test.assert(opponents != null ,'Op != null');
        test.assert(opponents.length > 0,'Op > 0');
        selectedOp = opponents[1];
         this.fillSelectors('form#request-app', {
            'select[name="challenge-opponent"]' : selectedOp
        }, false);
    });

    casper.then(function(){
        var days = this.evaluate(function(){
            var dates = [];
            var children = document.getElementById('challenge-date').children;
            for (var i = 0; i < children.length; i++ ) {
                if (children[i].value != '-1')
                    dates.push(children[i].value);
            }
            return dates;
        });
        test.assert(days != null ,'Days != null');
        test.assert(days.length > 0,'Days > 0');
        selectedDay = days[1];
         this.fillSelectors('form#request-app', {
            'select[name="challenge-date"]' : selectedDay
        }, false);
    });

    casper.then(function(){
        this.clickLabel('8');
    });

    casper.then(function(){
        var slotDao = new SlotDao(testlib.db);
        var slots = slotDao.getSlots();
        var slot = null;
        slots.forEach(function(s){
            if (s.getDate() == selectedDay) {
                slot = s;
            }
        });
        test.assert(slot != null,'Slot != null');
        this.clickLabel(slot.getTime());
    });
    casper.then(function(){
        this.echo(this.getCurrentUrl());
    });

    casper.then(function(){
        this.clickLabel(' Confirm');
    });

    casper.then(function(){
        this.waitForSelector('#challenge-confirm',function(){},testlib.notReady('challenge-confirm'),testlib.timeout);
    });

    casper.then(function(){
        this.clickLabel('Go Back');
    });

    casper.then(function(){
        this.waitForSelector('#request-app',function(){},testlib.notReady('request-app'),testlib.timeout);
    });
    casper.then(function(){
        this.clickLabel(' Confirm');
    });
    casper.then(function(){
        this.waitForSelector('#challenge-confirm',function(){},testlib.notReady('challenge-confirm'),testlib.timeout);
    });
    casper.then(function(){
        this.clickLabel(' challenge');
        this.waitForSelector('#sent-app',function(){},testlib.notReady('sent-app'),testlib.timeout);
    });
      casper.then(function(){
        this.clickLabel('Cancel');
    });
    casper.then(function() {
        testlib.refreshUser();
    });
    casper.thenOpen(testlib.server + '/index.html#/app/challenge/sent', function(){
    });
    casper.then(function() {
        var challenges = testlib.authUser.getChallenges(Status.SENT);
        if (challenges.length == 0) {
            this.waitForSelector('#request-app',function(){},testlib.notReady('request-app'),testlib.timeout);
        } else {
            this.waitForSelector('#sent-app',function(){},testlib.notReady('sent-app'),testlib.timeout);
        }
    });
    casper.run(function(){
        test.done();
    });
});


