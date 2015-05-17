var React = require('react/addons');
var DataStore = require('./../stores/DataStore.jsx');

var ResultMixin = {
    getResults: function(teamMatchId) {
        var matches = DataStore.getResults();
        var results = [];
        for(var i=0;i<matches.length;i++) {
            if (matches[i].teamMatch.id == teamMatchId ) {
                results.push(matches[i]);
            }
        }
        return results;
    },
     getSeasonResults: function(seasonId) {
        var matches = DataStore.getResults();
        var results = [];
        for(var i=0;i<matches.length;i++) {
            if (matches[i].getSeason().id == seasonId ) {
                results.push(matches[i]);
            }
        }
        return results;
    },
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
    },
    filterResults: function(results,filter) {
         if (filter == undefined  || filter == null || filter.length < 2)
             return results;

        var filteredMatches = [];
            results.forEach(function (m) {
                if (m.winner.name.toLowerCase().indexOf(filter.toLowerCase())>=0) {
                    filteredMatches.push(m);
                    return;
                }

                if (m.loser.name.toLowerCase().indexOf(filter.toLowerCase())>=0) {
                    filteredMatches.push(m);
                    return;
                }

                if (m.losersTeam.name.toLowerCase().indexOf(filter.toLowerCase())>=0) {
                    filteredMatches.push(m);
                    return;
                }

                if (m.winnersTeam.name.toLowerCase().indexOf(filter.toLowerCase())>=0) {
                    filteredMatches.push(m);
                    return;
                }
                if (m.getShortMatchDate().indexOf(filter)>=0) {
                    filteredMatches.push(m);
                }
            });

        return filteredMatches;
    }
};

module.exports =  ResultMixin;