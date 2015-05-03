var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler;
var DataStore = require('./stores/DataStore.jsx');

var TeamMixin = {
    getTeam: function(id) {
        return DataStore.getTeams()[id];
    }
};

module.exports = TeamMixin;