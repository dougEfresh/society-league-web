var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler;
var DataStore = require('./stores/DataStore.jsx');

var SeasonStatsMixin = {
    getSeasonTeamStats: function(id) {
        return  DataStore.getTeamStats()[id];
    }
};

module.exports = SeasonStatsMixin;