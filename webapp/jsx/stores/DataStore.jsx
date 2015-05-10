var AppDispatcher = require('../dispatcher/AppDispatcher.jsx');
var EventEmitter = require('events').EventEmitter;
var UserConstants = require('../constants/UserConstants.jsx');
var assign = require('object-assign');
var CHANGE_EVENT = 'change';
var Util = require('../util.jsx');

var divisions = {}, teams  = [] , players = {}, seasons = {} , users = {}, stats = {};
var teamStats = {}, results = {};

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
            _authUserId = d.userId
            DataStore.emitChange();
        }.bind(this));

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
    }
});

AppDispatcher.register(function(action) {
     switch(action.actionType) {
         case 'INIT':
             DataStore.init();
             break;
         default:
            console.log('Unknown Action ' + JSON.stringify(action));
     }


});

module.exports = DataStore;