var AppDispatcher = require('../AppDispatcher.jsx');
var EventEmitter = require('events').EventEmitter;
var UserConstants = require('../constants/UserConstants.jsx');
var assign = require('object-assign');
var CHANGE_EVENT = 'change';
var Util = require('../util.jsx');
var Season = require('../../lib/Season');
var Stat = require('../../lib/Stat');
var Slot = require('../../lib/Slot');
var Division = require('../../lib/Division');
var Team = require('../../lib/Team');
var User = require('../../lib/User');
var Status = require('../../lib/Status');
var TeamMatch = require('../../lib/TeamMatch');
var Result = require('../../lib/Result');
var ChallengeGroup = require('../../lib/ChallengeGroup');
var Challenge = require('../../lib/Challenge');
var Database = require('../../lib/Database');
var db = new Database();
var _authUserId = 0;

var DataStore = assign({}, EventEmitter.prototype, {
    emitChange: function() {
        console.log('Emit Change');
        this.emit(CHANGE_EVENT);
    },
    addChangeListener: function(callback) {
        if (callback == undefined) {
            debugger;
        }
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function(callback) {
        if (callback == undefined) {
            debugger;
        }
        this.removeListener(CHANGE_EVENT, callback);
    },
    init: function() {
        console.log('Init DB');
        db.loaded = false;
        db.loading = true;
        Util.getData('/api/data', function(d) {
            console.log('Got me some data');
            db.init(d);
            DataStore.emitChange();
        }.bind(this));
    },
    getDivisions: function() { return db.getDivisions();},
    getTeams: function() { return db.getTeams();},
    getSeasons: function () { return db.getSeasons();},
    getUsers: function() { return db.getUsers();},
    getResults: function() {return db.getResults();},
    getTeamMatches: function() {return db.getTeamMatches();},
    getSlots: function() {return db.getSlots();},

    isLoading: function() {
        return db.loading;
    },
    isLoaded: function() {
        return db.loaded;
    },
    isAuthenticated: function() {
        return _authUserId > 0;
    },
    setUser: function(u) {
        console.log('Setting user: '+ u.userId);
        _authUserId = u.userId;
        DataStore.emitChange();
    },
    getAuthUserId: function() {
        return _authUserId;
    },
    replaceUser: function(user) {
        var u = db.findUser(user.userId);
        db.processUser(u,user);
        DataStore.emitChange();
    },
    checkLogin: function() {
        console.log('Checking login stats');
        Util.getData('/api/user', function(d) {
            if (d.userId != 0) {
                console.log('User is logged');
                _authUserId = d.userId;
                DataStore.emitChange();
            }
        }.bind(this));
    },
    challengeSignUp: function(id) {
        console.log('Signing up ' + id);
         Util.getData('/api/challenge/signup/' + id, function(d) {
             DataStore.replaceUser(d);
        }.bind(this));
    }
});

AppDispatcher.register(function(action) {
     switch(action.actionType) {
         case 'INIT':
             DataStore.init();
             break;
         case 'CHECK':
      //       DataStore.checkLogin();
             break;
         case 'CHALLENGE_SIGN_UP':
             DataStore.challengeSignUp(action.id);
             break;
         default:
            //console.log('Unknown Action ' + JSON.stringify(action));
     }
});

module.exports = DataStore;
