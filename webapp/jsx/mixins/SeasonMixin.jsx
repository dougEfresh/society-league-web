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
        var counter = 1;
        teams.forEach(function(t){
            var stats = t.getStats(id);
            if (stats.notFound) {
                return;
            }
            if (counter < 10)
                teamStandings.push(t);
            counter++;
        });
        return  teamStandings.sort(function(a,b){
            var aStat = a.getStats(id);
            var bStat = b.getStats(id);
            if (aStat.wins == bStat.wins) {
                if (aStat.loses == bStat.loses) {
                    if (bStat.racksFor == aStat.racksFor ) {
                        return bStat.racksAgainst > aStat.racksAgainst ? 1 : -1;
                    }
                    return bStat.racksFor > aStat.racksFor ? 1 : -1;
                } else {
                    return bStat.loses > bStat.loses ? 1 : -1 ;
                }
            }
            return bStat.wins > aStat.wins ? 1 : -1;
        });
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
