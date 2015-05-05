var React = require('react/addons');
var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;
var DataStore = require('./stores/DataStore.jsx');

var TeamMixin = {
    getTeam: function(id) {
        var teams = DataStore.getTeams();
        var t = {teamId:0,name:"unknown"};
        teams.forEach(function(team) {
            if (id == team.teamId) {
                t = team;
            }
        });
        return t;
    },
    getTeamsBySeason: function(seasonId) {
        var teams =  [];
        console.log('Getting teams for ' + seasonId);
        DataStore.getTeams().forEach(function(t) {
            for(var s in t.seasons) {}
            if (s == seasonId) {
                teams.push(t);
            }
        });
        return teams;
    },
    getTeamUsers: function(teamId,seasonId) {
        return this.getTeam(teamId).seasons[seasonId];
    }
};

module.exports = TeamMixin;