var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler;
var DataStore = require('./stores/DataStore.jsx');

var SeasonMixin = {
    getSeason: function(id) {
        return DataStore.getSeasons()[id];
    },
    getMatches: function(id) {
        return this.getSeason(id).teamMatches;
    }
};

module.exports = SeasonMixin;