var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler;
var DataStore = require('./stores/DataStore.jsx');

var User = require('../lib/User');
var Status = require('../lib/Status');
var Season = require('../lib/Season');
var Team = require('../lib/Team');

var StatsMixin = {
    getSeasonTeamStats: function(id) {
        var teams = DataStore.getTeams();
	var teamStats = [];
	teams.forEach(function(
        return  DataStore.getTeamStats()[id];
    },
    getSeasonUserStats: function(id) {
        var stats  = DataStore.getStats();
        var userStats = [];
        for (var userId in stats) {
            stats[userId].season.forEach(function(s) {
                if (s.seasonId == id) {
                    userStats.push(s);
                }
            });
        }
        return userStats;
    },
    getUserStats: function(id) {
        return DataStore.getStats()[id];
    }
};

module.exports = StatsMixin;
