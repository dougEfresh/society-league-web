var Database = require('../webapp/lib/Database');
var utils = require('utils');
var testlib = require('./testLib');
var MatchDao = require('../webapp/lib/dao/MatchDao');
var Status = require('../webapp/lib/Status');

casper.test.begin('Test ChallengeNav Page', function suite(test) {
    casper.start();
    casper.then(function(){
        testlib.init();
    });
    casper.thenOpen(testlib.server + '/index.html#/app/challenge/request', function(){
    });
    casper.then(function(){
        this.waitForSelector('#app-ready',function(){},testlib.notReady,testlib.timeout);
    });
    casper.then(function(){
        var c = testlib.authUser.challenges;
        var counter = c[Status.SENT].length
            + c[Status.PENDING].length
            + c[Status.ACCEPTED].length;
        test.assertExists('#challenge-counter');
        var found = this.evaluate(function(counter) {
            return document.getElementById('challenge-counter').innerHTML == counter
        }, counter);
        test.assert(found,'Challenge counter match');
    });

    casper.then(function(){
        var c = testlib.authUser.challenges;
        var counter = c[Status.ACCEPTED].length;
        if (counter == 0) {
            test.assertDoesntExist('#accepted-link','no accepted link ');
            return;
        }
        test.assertExists('#accepted-counter');
        var found = this.evaluate(function(counter) {
            return document.getElementById('accepted-counter').innerHTML == counter
        }, counter);
        test.assert(found,'Challenge accept counter match');
    });

    casper.then(function(){
        var c = testlib.authUser.challenges;
        var counter = c[Status.PENDING].length;
        if (counter == 0) {
            test.assertDoesntExist('#pending-link','no pending link ');
            return;
        }

        test.assertExists('#pending-counter');
        var found = this.evaluate(function(counter) {
            return document.getElementById('pending-counter').innerHTML == counter
        }, counter);
        test.assert(found,'Challenge pending counter match');
    });

   casper.then(function(){
        var c = testlib.authUser.challenges;
        var counter = c[Status.SENT].length;
        if (counter == 0) {
            test.assertDoesntExist('#sent-link','no sent link ');
            return;
        }
        test.assertExists('#sent-counter');
        var found = this.evaluate(function(counter) {
            return document.getElementById('sent-counter').innerHTML == counter
        }, counter);
        test.assert(found,'Challenge sent counter match');
    });

    casper.then(function(){
        this.clickLabel('Request');
    });
    casper.then(function(){
        this.waitForSelector('#app-ready',function(){},testlib.notReady,testlib.timeout);
    });
    casper.then(function(){
        test.assertExists('#request-app','Found Request App');
    });

    casper.then(function() {
        var c = testlib.authUser.challenges;
        var counter = c[Status.ACCEPTED].length;
        if (counter > 0)
            this.clickLabel('Accepted');
    });
    casper.then(function(){
        var c = testlib.authUser.challenges;
        var counter = c[Status.ACCEPTED].length;
        if (counter > 0)
            this.waitForSelector('#app-ready',function(){},testlib.notReady,testlib.timeout);
    });
    casper.then(function(){
        var c = testlib.authUser.challenges;
        var counter = c[Status.ACCEPTED].length;
        if (counter > 0)
            test.assertExists('#accepted-app','Found Accepted App');
    });

    casper.then(function() {
        var c = testlib.authUser.challenges;
        var counter = c[Status.PENDING].length;
        if (counter > 0)
            this.clickLabel('Pending');
    });
    casper.then(function(){
        var c = testlib.authUser.challenges;
        var counter = c[Status.PENDING].length;
        if (counter > 0)
            this.waitForSelector('#app-ready',function(){},testlib.notReady,testlib.timeout);
    });
    casper.then(function(){
        var c = testlib.authUser.challenges;
        var counter = c[Status.PENDING].length;
        if (counter > 0)
            test.assertExists('#pending-app','Found Accepted App');
    });

    casper.then(function() {
        var c = testlib.authUser.challenges;
        var counter = c[Status.SENT].length;
        if (counter > 0)
            this.clickLabel('Sent');
    });
    casper.then(function(){
        var c = testlib.authUser.challenges;
        var counter = c[Status.SENT].length;
        if (counter > 0)
            this.waitForSelector('#app-ready',function(){},testlib.notReady,testlib.timeout);
    });
    casper.then(function(){
        var c = testlib.authUser.challenges;
        var counter = c[Status.SENT].length;
        if (counter > 0)
            test.assertExists('#sent-app','Found Accepted App');
    });

    casper.run(function(){
        test.done();
    });
});
