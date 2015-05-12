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
    getCurrentSeasons: function() {
        var seasons = DataStore.getSeasons();
        var active = [];
        seasons.forEach(function(s){
            if (s.isActive())
                active.push(s);
        });
        return active;
    },
    getMatches: function(id) {
        var matches = DataStore.getTeamMatches();
        var seasonMatches = [];
        matches.forEach(function(m) {
            if (m.season.id == id) {
                seasonMatches.push(m);
            }
        });
        return seasonMatches;
    }
};

module.exports = SeasonMixin;