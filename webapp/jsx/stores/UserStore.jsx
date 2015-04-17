var AppDispatcher = require('../dispatcher/AppDispatcher.jsx');
var EventEmitter = require('events').EventEmitter;
var UserConstants = require('../constants/UserConstants.jsx');
var assign = require('object-assign');
var UserActions = require('../actions/UserAction.jsx');
var CHANGE_EVENT = 'change';

var _user = { id:0, name:""};

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

    setViewUser : function(user) {
        _viewUser = user;
    },

    set: function(user) {
        console.log('Setting userId : ' + JSON.stringify(user));
        _user = user;
        localStorage.setItem("_user",JSON.stringify(user));
    },

    get: function() {
        return _viewUser != null ? _viewUser : _user;
    },

    getInfo: function() {
         console.log("Getting data from " + window.location.origin + '/user');
        $.ajax({
            url: '/api/user',
            dataType: 'json',
            statusCode: {
                401: function () {
                    console.log('I Need to Authenticate');
                }.bind(this)
            },
            success: function (d) {
                _user = d;
                UserStore.emitChange();
            }.bind(this),
            error: function (xhr, status, err) {
                console.error('user', status, err.toString());
                console.log('Redirecting to error');
                //this.redirect('error');
            }.bind(this)
        });
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

         case UserConstants.INFO:
             UserStore.getInfo();
             break;

         default:
             //console.log(JSON.stringify(action));
     }
});

module.exports = UserStore;