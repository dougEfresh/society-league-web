var React = require('react/addons');
var DataStore = require('./stores/DataStore.jsx');

var ResultMixin = {
    getTeamResults: function(seasonId,teamId,teamMatchId) {
        var seasonResults =  DataStore.getResults()[seasonId];
        var teamMatchResults = [];
        for (var user in seasonResults) {
            seasonResults[user].forEach(function(result) {
                if (result.teamMatchId == teamMatchId && result.opponentTeam == teamId ) {
                    result.userId = user;
                    teamMatchResults.push(result);
                }
            });
        }
        return teamMatchResults;
    }
};

module.exports =  ResultMixin;