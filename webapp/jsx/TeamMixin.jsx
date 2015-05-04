var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler;
var DataStore = require('./stores/DataStore.jsx');

var TeamMixin = {
    getTeam: function(id) {
        var team = DataStore.getTeams()[id];
        if (team == undefined) {
            return {id:0,name:"unknown"};
        }
        return team;
    }
};

module.exports = TeamMixin;