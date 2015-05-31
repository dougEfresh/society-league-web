var Database = require('../webapp/lib/Database');
var utils = require('utils');
var testlib = require('./testLib');
var MatchDao = require('../webapp/lib/dao/MatchDao');
var Status = require('../webapp/lib/Status');

casper.test.begin('Test SeasonNav', function suite(test) {
    casper.start();
    casper.then(function(){
        testlib.init();
    });
    casper.thenOpen(testlib.server + '/index.html#/app/home', function(){
    });
    casper.then(function(){
        this.waitForSelector('#app-ready',function(){},testlib.notReady('app-ready').bind(this),testlib.timeout);
    });
    casper.then(function(){
        var seasons = testlib.authUser.getCurrentSeasons();
        if (testlib.authUser.isChallenge()) {
            test.assertExists('#challenge-season-link');
        }
        seasons.forEach(function(s){
            if (!s.isChallenge())
                test.assertExists('#season-link-' + s.id);
        })
    });

    casper.then(function(){
        if (testlib.authUser.isChallenge()) {
            this.clickLabel('Challenge');
            this.waitForSelector('#page-ready',function(){},testlib.notReady('app-ready').bind(this),testlib.timeout);
        }
    });

  casper.then(function(){
        if (testlib.authUser.isChallenge()) {
            test.assertExists('#challenge-season-app');
        }
  });

    casper.then(function(){
        var seasons = testlib.authUser.getCurrentSeasons();
    });


    casper.run(function(){
        test.done();
    });
});
