var React = require('react/addons');
var Router = require('react-router');
var DataStore = require('./../stores/DataStore.jsx');
var Divisions = require('./../constants/DivisionConstants.jsx');
var User = require('../../lib/User');
var Status = require('../../lib/Status');
var Season = require('../../lib/Season');

var UserContextMixin = {
    getDb: function() {
        return DataStore.getDb();
    },
    getUserId: function() {
        return  DataStore.getAuthUserId();
    },
    getUsers: function() {
        return DataStore.getUsers();
    },
    getUser: function(id) {
        var userId = id;
        if (id == null || id == undefined) {
            userId = this.getUserId();
        }
        var u = undefined;
        var users = DataStore.getUsers();
        for (var i = 0; i < users.length; i++) {
            if (userId == users[i].id) {
                u = users[i];
                break;
            }
        }

        if(u == undefined)
            return User.DEFAULT_USER;

        return u;
    }
};

module.exports = UserContextMixin;