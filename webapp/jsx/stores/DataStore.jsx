var AppDispatcher = require('../dispatcher/AppDispatcher.jsx');
var EventEmitter = require('events').EventEmitter;
var UserConstants = require('../constants/UserConstants.jsx');
var assign = require('object-assign');
var CHANGE_EVENT = 'change';
var Util = require('../util.jsx');

var divisions = {}, teams  = {} , players = {}, seasons = {} , users = {};

var DataStore = assign({}, EventEmitter.prototype, {
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    init: function() {
        Util.getData('/api/data', function(d) {
            teams=d.teams;
            players=d.players;
            seasons=d.seasons;
            users=d.users;
            divisions=d.divisions;
            DataStore.emitChange();
        }.bind(this));
    },
    getDivisions: function() { return divisions;},
    getTeams: function() { return teams;},
    getPlayers: function () { return players;},
    getSeasons: function () { return seasons;},
    getUsers: function() { return users;}
});

AppDispatcher.register(function(action) {
     switch(action.actionType) {
         case 'INIT':
             DataStore.init();
             break;
         default:
            console.log(JSON.stringify(action));
     }
});

module.exports = DataStore;