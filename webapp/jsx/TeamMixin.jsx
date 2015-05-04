var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler;
var DataStore = require('./stores/DataStore.jsx');

var TeamMixin = {
    getTeam: function(id) {
        var team = DataStore.getTeams()[id];
        if (team == undefined) {
            return {teamId:0,name:"unknown"};
        }
        //TODO change result set from server to be an array
        return {teamId: id, name: team.name};
    }
};

module.exports = TeamMixin;