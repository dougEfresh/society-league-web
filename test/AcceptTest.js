var Database = require('../webapp/lib/Database');
var utils = require('utils');
var testlib = require('./testLib');
var MatchDao = require('../webapp/lib/dao/MatchDao');
var Status = require('../webapp/lib/Status');
var SlotDao = require('../webapp/lib/SlotDao');
var selectedDay = null;
var selectedOp = 0;
var user1;
var user2;
var user3;

casper.test.begin('Test RequestApp', function suite(test) {
    casper.start();

    casper.then(function(){
        testlib.init();
    });

    casper.then(function(){
        user1 = testlib.createChallengeUser();
    });
    casper.then(function(){
        user2 = testlib.createChallengeUser();
    });
    casper.then(function(){
        user3 = testlib.createChallengeUser();
    });

    casper.then(function(){
        testlib.init();
    });
    casper.thenOpen(testlib.server + '/index.html#/login', function(){
    });
    casper.then(function(){
        testlib.login(user1.login,user1.password);
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
            'select[name="challenge-opponent"]' : user2.id
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
            'select[name="challenge-opponent"]' : user2.id
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
        this.clickLabel(' Confirm');
    });

    casper.then(function(){
        this.waitForSelector('#challenge-confirm',function(){},testlib.notReady('challenge-confirm'),testlib.timeout);
    });
    casper.then(function(){
        this.clickLabel('challenge');
    });
    casper.then(function(){
        this.waitForSelector('#sent-app',function(){},testlib.notReady('sent-app'),testlib.timeout);
    });

    casper.then(function(){
        testlib.init();
    });

    casper.thenOpen(testlib.server + '/index.html#/login', function(){});

    casper.then(function(){
        testlib.login(user2.login,user2.password);
    });
    casper.thenOpen(testlib.server + '/index.html#/app/challenge/pending', function(){});

    casper.then(function(){
        this.waitForSelector('#pending-app',function(){},testlib.notReady('pending-app'),testlib.timeout);
    });
    casper.then(function(){
        this.clickLabel('Accept');
    });
    casper.then(function(){
        this.waitForSelector('#accepted-app',function(){},testlib.notReady('accepted-app'),testlib.timeout);
    });

    casper.then(function(){
        testlib.init();
    });

    casper.thenOpen(testlib.server + '/index.html#/app/home', function(){});

    casper.then(function(){
        this.waitForSelector('#home-app',function(){},testlib.notReady('home-app'),testlib.timeout);
    });

    casper.then(function(){
        var matchDao = new MatchDao(testlib.db);
        var users = testlib.db.getUsers();
        users.forEach(function(u) {
            if (user2.id == u.id) {
                user2 = u;
            }
        });
        var upComingChallenges = matchDao.getUpcomingChallenges(user2);
        test.assert(upComingChallenges.length > 0);
        upComingChallenges.forEach(function(m) {
            test.assertExists('#challenge-' + m.getId());
        })
    });

    casper.thenOpen(testlib.server + '/index.html#/app/challenge/request', function(){});

    casper.then(function(){
        this.waitForSelector('#app-ready',function(){},testlib.notReady('app-ready'),testlib.timeout);
    });

    casper.then(function() {
        this.fillSelectors('form#request-app', {
            'select[name="challenge-opponent"]' : user3.id
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

    casper.then(function() {
        this.clickLabel('8');
    });

    casper.then(function() {
        this.clickLabel('9');
    });

    casper.then(function(){
        this.clickLabel(' Any Time');
    });

    casper.then(function(){
        this.clickLabel(' Confirm');
    });

    casper.then(function(){
        this.waitForSelector('#challenge-confirm',function(){},testlib.notReady('challenge-confirm'),testlib.timeout);
    });
    casper.then(function(){
        this.clickLabel('challenge');
    });
    casper.then(function(){
        this.waitForSelector('#sent-app',function(){},testlib.notReady('sent-app'),testlib.timeout);
    });

    casper.thenOpen(testlib.server + '/index.html#/login', function(){
    });
    casper.then(function(){
        testlib.login(user3.login,user3.password);
    });
    casper.thenOpen(testlib.server + '/index.html#/app/challenge/pending', function(){});

    casper.then(function(){
        this.waitForSelector('#pending-app',function(){},testlib.notReady('pending-app'),testlib.timeout);
    });
    
    casper.then(function(){
        testlib.purgeUser(user2);
    });

    casper.then(function(){
        testlib.purgeUser(user1);
    });
    casper.then(function(){
        testlib.purgeUser(user3);
    });

    casper.run(function(){
        test.done();
    });
});
