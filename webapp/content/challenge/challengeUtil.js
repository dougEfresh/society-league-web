var ChallengeGroup = require('../../lib/ChallengeGroup');
var DataStore = require('../../jsx/stores/DataStore.jsx');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');

var c = function queryToChallengeGroup(q) {
    var opponent = UserContextMixin.getUser(q.opponent);
        if(q.opponent == undefined) {
            return null;
        }
        var cg = new ChallengeGroup(UserContextMixin.getUser(),opponent,q.date);
        cg.selectedSlots = [];
        cg.selectedGames = [];
        var slots = DataStore.getSlots();
        if (q.anyTime == 1) {
            slots.forEach(function(s) {
                if (s.getDate() == q.date) {
                    cg.selectedSlots.push(s);
                }
            });
        } else {
            for (var id in q.selected) {
                if (q.selected.hasOwnProperty(id)) {
                    if (q.selected[id] == 1) {
                        for (var i = 0; i < slots.length; i++) {
                            if (slots[i].id == id.replace('slot',''))
                                cg.selectedSlots.push(slots[i]);
                        }
                    }
                }
            }
        }
        for(var g in q.games) {
            if (q.games.hasOwnProperty(g) ) {
                if (q.games[g] == 'true') {
                    cg.selectedGames.push(g);
                    cg.addGame(g);
                }
            }
        }
    if (q.selectedSlot) {
        slots.forEach(function(s) {
            if (q.selectedSlot == s.id) {
                debugger;
                cg.selectedSlot = s;
            }
        })
    }
    if (q.selectedGame) {
        cg.selectedGame = q.selectedGame;
    }
    return cg;
};
 var create = function(request,cb){
        //TODO Move this to lib
        //TODO ADD UserId to URL
        $.ajax({
            async: true,
            processData: false,
            url: '/api/challenge/request',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(request),
            method: 'post',
            statusCode: {
                401: function () {
                    console.log('I Need to Authenticate');
                    DataStore.setLoaded(false);
                    DataStore.setLoading(false);
                    DataStore.resetAuth();
                    window.location = '/#/login?expired=true';
                }.bind(this)
            },
            success: function (d) {
                return cb(d);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error('/api/challenge/request', status, err.toString());
                //this.redirect('error');
            }.bind(this)
        });
    };


var sendStatus = function (url,data) {
        console.log('Sending to ' + url);
        console.log('Sending data: ' + JSON.stringify(data));
         $.ajax({
            async: true,
            processData: false,
            url: url,
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(data),
            method: 'post',
            statusCode: {
                401: function () {
                    console.log('I Need to Authenticate');
                    DataStore.setLoaded(false);
                    DataStore.setLoading(false);
                    DataStore.resetAuth();
                    window.location = '/#/login?expired=true';
                    //this.redirect('login');
                }.bind(this)
            },
            success: function (d) {
                DataStore.replaceUser(d);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(url, status, err.toString());
                //this.redirect('error');
            }.bind(this)
        });
    };

module.exports = {convertToChallenge: c, create: create, sendStatus: sendStatus};
