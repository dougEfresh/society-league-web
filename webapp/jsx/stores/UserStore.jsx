var AppDispatcher = require('../dispatcher/AppDispatcher.jsx');
var EventEmitter = require('events').EventEmitter;
var UserConstants = require('../constants/UserConstants.jsx');
var assign = require('object-assign');
var UserActions = require('../actions/UserAction.jsx');
var CHANGE_EVENT = 'change';

var _user = { id : 0 };
var _viewUser = null;
var checkingLogin = false;

var UserStore = assign({}, EventEmitter.prototype, {

    /**
     * Constructor
     */
    checkLogin: function(router) {
        checkingLogin = true;
        $.ajax({
            url:'/api/user',
            dataType: 'json',
            status: {
                401: function() {
                    router.transitionTo('login',null,{from: router.getCurrentPath()});
                }
            },
            success: function (u) {
                checkingLogin = false;
                UserActions.set(u,router);
            },
            error: function (xhr, status, err) {
                checkingLogin = false;
                debugger;
                router.transitionTo('login',null,{from: router.getCurrentPath()});
                console.error('/api/user', status, err.toString());
            }.bind(this)
        });
    },
    isCheckingLogin: function() {
        return checkingLogin;
    },
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

    authenticated: function(router) {
        console.log('Getting user data from /api/user');
        $.ajax({
            url:'/api/user',
            dataType: 'json',
            success: function (u) {
                UserActions.set(u,router);
            },
            error: function (xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },

    get: function() {
        return _viewUser != null ? _viewUser : _user;
    }
});

AppDispatcher.register(function(action) {
     switch(action.actionType) {
         case UserConstants.USER_POST_AUTH: UserStore.postAuth(action.user,action.router);
             UserStore.emitChange();
             break;

         case UserConstants.USER_VIEW_SET:
             UserStore.setViewUser(action.user);
             UserStore.emitChange();
             break;

         case UserConstants.USER_AUTHENTICATED:
             UserStore.authenticated(action.router);
             break;

         default:
             //console.log(JSON.stringify(action));
     }
});

module.exports = UserStore;