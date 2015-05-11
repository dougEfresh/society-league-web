var AppDispatcher = require('../dispatcher/AppDispatcher.jsx');
var EventEmitter = require('events').EventEmitter;
var UserConstants = require('../constants/UserConstants.jsx');
var assign = require('object-assign');
var CHANGE_EVENT = 'change';
var Util = require('../util.jsx');

var divisions = {}, teams  = [] , players = {}, seasons = {} , users = {}, stats = {};
var teamStats = {}, results = [];

var _authUserId = 0;

var DataStore = assign({}, EventEmitter.prototype, {
    emitChange: function() {
        console.log('Emit Change');
        this.emit(CHANGE_EVENT);
    },
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    init: function() {
        console.log('Checking login stats');
        Util.getData('/api/user', function(d) {
            _authUserId = d.userId;
            DataStore.emitChange();
        }.bind(this));

        Util.getData('/api/users', function(d) {
            users = d;
            DataStore.emitChange();
        }.bind(this));
        Util.getData('/api/divisions', function(d) {
            divisions = d;
            DataStore.emitChange();
        }.bind(this));
        Util.getData('/api/teams', function(d) {
            teams = d;
            DataStore.emitChange();
        }.bind(this));
        Util.getData('/api/seasons/current', function(d) {
            for(var id in d) {
                //console.log('Adding seasonId: ' + id);
                seasons[id] = d[id];
            }
            DataStore.emitChange();
        }.bind(this));

        Util.getData('/api/results/current', function(d) {
            results = d;
            DataStore.emitChange();
        }.bind(this));

        Util.getData('/api/stats/user', function(d) {
            for(var id in d) {
              //  console.log('Adding stats resultId: ' + id);
                stats[id] = d[id];
            }
            DataStore.emitChange();
        }.bind(this));

        Util.getData('/api/stats/team', function(d) {
            for(var id in d) {
                //console.log('Adding team stats resultId: ' + id);
                teamStats[id] = d[id];
            }
            DataStore.emitChange();
        }.bind(this));


        Util.getData('/api/seasons/past', function(d) {
            for(var id in d) {
            //    console.log('Adding past season id: ' + id);
                seasons[id] = d[id];
            }
            DataStore.emitChange();
        }.bind(this));

      /*
        Util.getData('/api/data', function(d) {
              teams=d.teams;
            players=d.players;
            seasons=d.seasons;
            users=d.users;
            divisions=d.divisions;
            stats = d.stats;
            teamStats = d.teamStats;
            results = d.results;
            DataStore.emitChange();
        }.bind(this));
*/
    },
    getDivisions: function() { return divisions;},
    getTeams: function() { return teams;},
    getPlayers: function () { return players;},
    getSeasons: function () { return seasons;},
    getUsers: function() { return users;},
    getTeamStats: function() {return teamStats},
    getStats: function() {return stats},
    getResults: function() {return results;},
    getDivisionBySeason: function(season) {
        if (season == null || season == undefined) {
            return null;
        }
        if (seasons[season] == undefined || seasons[season].division == undefined) {
            console.log('No season for '+ season);
            return null;
        }

      var d = divisions[seasons[season].division];
        if (d == null || d == undefined) {
            console.warn('Could not find division for ' + season);
        }
        return d;
    },
    getTeam: function(id) {
        return teams[id];
    },
    setUser: function(u) {
        _authUserId = u.userId;
    },
    getAuthUserId: function() {
        return _authUserId;
    },
    checkLogin: function() {
        console.log('Checking login stats');
        Util.getData('/api/user', function(d) {
            _authUserId = d.userId;
            DataStore.emitChange();
        }.bind(this));
    },
    challengeSignUp: function(id) {
        console.log('Signing up ' + id);
         Util.getData('/api/challenge/signup/' + id, function(d) {
            users[d.userId] = d;
            DataStore.emitChange();
        }.bind(this));
    }
});

AppDispatcher.register(function(action) {
     switch(action.actionType) {
         case 'INIT':
             DataStore.init();
             break;
         case 'CHECK':
             DataStore.checkLogin();
             break;
         case 'CHALLENGE_SIGN_UP':
             DataStore.challengeSignUp(action.id);
             break;
         default:
            console.log('Unknown Action ' + JSON.stringify(action));
     }


});

module.exports = DataStore;