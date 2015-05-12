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
    getTeamMatch: function(seasonId,teamMatchId) {
        var s = DataStore.getSeasons()[seasonId];
        if (s == undefined )
            return undefined;
        var match = undefined;
        for(var dt in s.teamMatches) {
            s.teamMatches[dt].forEach(function(m) {
                if (m.teamMatchId == teamMatchId) {
                    match = m;
                }
            });
        }
        return match;
    }
};

module.exports = TeamMixin;
