var AppDispatcher = require('../dispatcher/AppDispatcher.jsx');
var EventEmitter = require('events').EventEmitter;
var UserConstants = require('../constants/UserConstants.jsx');
var assign = require('object-assign');
var UserActions = require('../actions/UserAction.jsx');
var CHANGE_EVENT = 'change';

var _user = localStorage.getItem("_user") == null
|| localStorage.getItem("_user") == undefined
? { id:0, name:""} : JSON.parse(localStorage.getItem("_user"));

var _viewUser = null;

var UserStore = assign({}, EventEmitter.prototype, {

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

    postAuth : function(user,router) {
        _user = user;
        if (router.getCurrentQuery() == null || router.getCurrentQuery() == undefined || router.getCurrentQuery().from == '/' ) {
            router.transitionTo('home');
        } else {
            router.transitionTo(router.getCurrentQuery().from);
        }

    },

    setViewUser : function(user) {
        _viewUser = user;
    },

    set: function(user) {
        console.log('Setting user : ' + user);
        _user = user;
        localStorage.setItem("_user",JSON.stringify(user));
    },

    get: function() {
        return _viewUser != null ? _viewUser : _user;
    }
});

AppDispatcher.register(function(action) {
     switch(action.actionType) {
         case UserConstants.USER_SET:
             UserStore.set(action.user);
             UserStore.emitChange();
             break;

         case UserConstants.USER_VIEW_SET:
             UserStore.setViewUser(action.user);
             UserStore.emitChange();
             break;

         default:
             //console.log(JSON.stringify(action));
     }
});

module.exports = UserStore;