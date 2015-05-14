var React = require('react/addons');
var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;
var DataStore = require('./../stores/DataStore.jsx');

var TeamMixin = {
    getTeam: function(id) {
        var teams = DataStore.getTeams();
        var team = null;
        teams.forEach(function(t) {
            if (t.id == id) {
                team = t;
            }
        });
        return team;
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
    },
    getTeamMatch: function(teamMatchId) {
        var matches = DataStore.getTeamMatches();
        for(var i = 0; i<matches.length; i++) {
            if (matches[i].teamMatchId == teamMatchId) {
                return matches[i];
            }
        }
        return undefined;
    }
};

module.exports = TeamMixin;
