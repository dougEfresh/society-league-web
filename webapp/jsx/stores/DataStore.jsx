var AppDispatcher = require('../AppDispatcher.jsx');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var CHANGE_EVENT = 'change';
var Util = require('../util.jsx');
var _user = {id: "0"};
var _updateTime = Date.now();
var _loaded = false;
var _loading = false;

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
    setUser: function(u) {
        console.log('Setting user: '+ u.id);
        _user = u;
    },
    getUser: function() {
        return _user;
    },
    checkLogin: function() {
        console.log('Checking login stats');
        Util.getData('/api/user', function(d) {
            if (d.id != undefined) {
                console.log('User is logged');
                _user = d;
                DataStore.emitChange();
            }
        }.bind(this), function(d) {

        });
    }
    /*
    challengeSignUp: function(id) {
        _loading = true;
        console.log('Signing up ' + id);
         Util.getData('/api/challenge/signup/' + id, function(d) {
             DataStore.replaceUser(d);
        }.bind(this));
    }
    */
});

AppDispatcher.register(function(action) {
     switch(action.actionType) {
         case 'INIT':
             //DataStore.init();
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
