var React = require('react/addons');
var DataStore = require('./../stores/DataStore.jsx');
var Status = require('../../lib/Status');

var SeasonMixin = {
    getSeason: function(id) {
        var seasons = DataStore.getSeasons();
        for(var i = 0; i<seasons.length ; i++) {
            if (seasons[i].id == id){
                return seasons[i];
            }
        }
    },
    getSeasonStandings: function(id) {
        var teams = DataStore.getTeams();
        var teamStandings = [];
        var season = this.getSeason(id);
        teams.forEach(function(t){
            var stats = t.getStats(id);
            if (stats.notFound) {
                return;
            }
            teamStandings.push(t);
        });
        //var matches = DataStore.getTeamMatches();
        teamStandings = teamStandings.sort(function(a,b){
            var aStat = a.getStats(id);
            var bStat = b.getStats(id);
            if (aStat.wins == bStat.wins) {
                if (aStat.loses == bStat.loses) {
                    if (bStat.racksFor == aStat.racksFor ) {
                        return bStat.racksAgainst > aStat.racksAgainst;
                    }
                    return bStat.racksFor > aStat.racksFor;
                } else {
                    return bStat.loses > bStat.loses;
                }
            }
	    
            return bStat.wins > aStat.wins;
        });
	
        return teamStandings;
    },

    getCurrentSeasons: function() {
        var seasons = DataStore.getSeasons();
        var active = [];
        seasons.forEach(function(s){
            if (s.isActive())
                active.push(s);
        });
        return active;
    },
    getSeasonMatches: function(id) {
        var matches = DataStore.getTeamMatches();
        var seasonMatches = [];
        matches.forEach(function(m) {
            if (m.season.id == id) {
                seasonMatches.push(m);
            }
        });
        return seasonMatches.sort(function(a,b){
            return a.matchDate.localeCompare(b.matchDate);
        })
    }
};

module.exports = SeasonMixin;
