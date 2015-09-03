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
var user = {id: "0"};
var _updateTime = Date.now();
var loaded = false;
var loading = false;

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
        loaded = false;
        loading = true;
        Util.getData('/api/user', function(d) {
            console.log('Got me some data', JSON.stringify(d));
            user = d;
            //db.init(d);
            DataStore.emitChange();
        }.bind(this));
    },
    checkAge: function() {
        if (Date.now() -_updateTime > 1000*60*5) {
            if (loading == true) {
                return;
            }
            console.log('Reloading data');
            loading = true;
            _updateTime = Date.now();
            DataStore.init();
        }
    },
    getDivisions: function() {
        DataStore.checkAge();
        return db.getDivisions();
    },
    getTeams: function() {
        DataStore.checkAge();
        return db.getTeams();
    },
    getSeasons: function () {
        DataStore.checkAge();
        return db.getSeasons();
    },
    getUsers: function() {
        DataStore.checkAge();
        return [user];
    },
    getResults: function() {
        DataStore.checkAge();
        return db.getResults();
    },
    getTeamMatches: function() {
        DataStore.checkAge();
        return db.getTeamMatches();
    },
    getSlots: function() {
        DataStore.checkAge();
        return db.getSlots();
    },
    getDb: function() {
        return db;
    },
    getChallenges: function() {
        return db.getChallenges();
    },
    isLoading: function() {
        return db.loading;
    },
    isLoaded: function() {
        return user != undefined && user.id != undefined && user.id != "0";
    },
    setLoading: function(loading) {
        loading = loading;
    },
    setLoaded: function(loaded) {
        loaded = loaded;
    },
    resetAuth: function() {
        _authUserId = "0";
    },
    isAuthenticated: function() {
        return _authUserId != "0";
    },
    setUser: function(u) {
        console.log('Setting user: '+ u.id);
        _authUserId = u.id;
        DataStore.emitChange();
    },
    getAuthUserId: function() {
        return _authUserId;
    },
    replaceUser: function(user) {
        var u = db.findUser(user.id);
        db.processUser(u,user);
        loading = false;
        DataStore.emitChange();
    },
    checkLogin: function() {
        console.log('Checking login stats');
        Util.getData('/api/user', function(d) {
            if (d.id != undefined) {
                console.log('User is logged');
                _authUserId = d.id;
                DataStore.emitChange();
            }
        }.bind(this), function(d) {

        });
    },
    challengeSignUp: function(id) {
        loading = true;
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
