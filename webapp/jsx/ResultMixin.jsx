var React = require('react/addons');
var DataStore = require('./stores/DataStore.jsx');

var ResultMixin = {
    getTeamResults: function(seasonId,teamId,teamMatchId) {
        var seasonResults =  DataStore.getResults();
        if (seasonResults.length == 0) {
            console.log('No matches for ' + teamMatchId);
            return [];
        }
        var teamMatchResults = [];
        seasonResults.forEach(function(r) {
           if (r.teamMatchId == teamMatchId) {
               teamMatchResults.push(r);
           }
        });
        return teamMatchResults;
    }
};

module.exports =  ResultMixin;