var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler;
var DataStore = require('./stores/DataStore.jsx');

var SeasonMixin = {
    getSeason: function(id) {
        return DataStore.getSeasons()[id];
    },
    getMatches: function(id) {
        var s = this.getSeason(id);
        if (s == undefined || s.teamMatches == undefined)
            return {};

        return s.teamMatches;
    },
    getDivision: function(id) {
        console.log('Getting division ' + id);
        return DataStore.getDivisionBySeason(id);
    }
};

module.exports = SeasonMixin;