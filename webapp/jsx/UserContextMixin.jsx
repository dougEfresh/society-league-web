var React = require('react/addons');
var Router = require('react-router');
var DataStore = require('./stores/DataStore.jsx');
var Divisions = require('./constants/DivisionConstants.jsx');
var User = require('../lib/User');
var Status = require('../lib/Status');
var Season = require('../lib/Season');

var UserContextMixin = {
    getUserId: function() {
        var id = DataStore.getAuthUserId();
        if (id == undefined || isNaN(id))
            return 0;

        return id;
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
    },
    getCurrentSeasons: function() {
        var seasons = DataStore.getSeasons();
        var active = [];
        seasons.forEach(function (s) {
            if (s.status == Status.ACTIVE && !s.isChallenge()) {
                active.push(s);
            }
        });
        return active;
    },
    getCurrentTeams: function() {
       var u = this.getUser();
        if (u.id == 0) {
            return [];
        }
        return u.getCurrentTeams();
    }
};

module.exports = UserContextMixin;