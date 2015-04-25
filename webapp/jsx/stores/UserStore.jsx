var AppDispatcher = require('../dispatcher/AppDispatcher.jsx');
var EventEmitter = require('events').EventEmitter;
var UserConstants = require('../constants/UserConstants.jsx');
var assign = require('object-assign');
var CHANGE_EVENT = 'change';
var DataFactoryMixin = require('../DataFactoryMixin.jsx');

var _users = [];

var UserStore = assign({}, EventEmitter.prototype, {

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    getAllFromServer: function() {
        DataFactoryMixin.getData('/api/users', function(d) {
            _users = d;
            UserStore.emitChange();
        }.bind(this));
    },

    getAll: function(){
        return _users;
    },
    get: function(userId) {
        var user = {id: 0, name: 'unknown'};
        _users.forEach(function(u) {
            if (u.id == userId) {
                user = u;
            }
        });
        return user
    }
});

AppDispatcher.register(function(action) {
     switch(action.actionType) {
         default:
            console.log(JSON.stringify(action));
     }
});

module.exports = UserStore;