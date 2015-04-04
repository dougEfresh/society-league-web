var AppDispatcher = require('../dispatcher/AppDispatcher.jsx');
var EventEmitter = require('events').EventEmitter;
var UserConstants = require('../constants/UserConstants.jsx');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _user = { id : 0 };
var _viewUser = null;

var UserStore =  assign({}, EventEmitter.prototype, {

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    setUser : function(user) {
        _user = user;
    },

    setViewUser : function(user) {
        _viewUser = user;
    },
    get: function() {
        return _viewUser != null ? _viewUser : _user;
    }
});

AppDispatcher.register(function(action) {
     switch(action.actionType) {
         case UserConstants.USER_SET:
             UserStore.setUser(action.user);
             ChallengeStore.emitChange();
             break;

         case UserConstants.USER_VIEW_SET:
             UserStore.setViewUser(action.user);
             ChallengeStore.emitChange();
             break;

         default:
             console.log(JSON.stringify(action));
     }
});

module.exports = UserStore;