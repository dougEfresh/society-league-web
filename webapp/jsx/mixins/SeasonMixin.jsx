var React = require('react/addons');
var DataStore = require('./../stores/DataStore.jsx');
var Status = require('../../lib/Status');
var firstBy = require('../FirstBy.jsx');
var Stat = require('../../lib/Stat');

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
        var order = firstBy(function(a,b) {
            var aStat = a.getStats(id);
            var bStat = b.getStats(id);
            return Stat.sort.byWins(aStat,bStat);
        });
        order = order.thenBy(function(a,b){
            var aStat = a.getStats(id);
            var bStat = b.getStats(id);
            return Stat.sort.bySetWins(aStat,bStat);
        });
        order = order.thenBy(function(a,b){
            var aStat = a.getStats(id);
            var bStat = b.getStats(id);
            return Stat.sort.byRacksFor(aStat,bStat);
        });
        return teamStandings.sort(order);
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
