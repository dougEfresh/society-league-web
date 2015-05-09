var React = require('react/addons');
var Router = require('react-router');
var DataStore = require('./stores/DataStore.jsx');

var UserContextMixin = {
    getUserId: function() {
        var id = DataStore.getAuthUser().userId;
        if (id == undefined || isNaN(id))
            return 0;

        return id;
    },
    getUsers: function() {
        return DataStore.getUsers();
    },
    getUser: function(id) {
        var userId = id;
        if (id == null || id == undefined) {
            userId = this.getUserId();
        }

        if (userId == 0) {
            return {userId:0, name: "unknown"}
        }

        var u = DataStore.getUsers()[userId];
        if (u == undefined) {
             return {userId:0, name: "not found"}
        }
        u.name = u.firstName  + ' ' + u.lastName;
        u.userId = id;
        return u;
    },
    getUserName: function() {
        var u = this.getUser();
        return u.firstName + ' ' + u.lastName;
    },
    getCurrentSeasons: function() {
        var seasons = DataStore.getSeasons();
        var activeSeasons = [];
        for(var id in seasons) {
            if (seasons[id].season.seasonStatus == 'ACTIVE') {
                var division = DataStore.getDivisionBySeason(id);
                if (division != undefined && division.type.toLowerCase().indexOf('challenge') == -1)
                    activeSeasons.push({id: id,division: division});
            }
        }
        return activeSeasons;
    },
    getCurrentTeams: function() {
       var u = this.getUser();
        var teams = [];
        u.currentTeams.forEach(function(t) {
            var team = {id: t.id, season: t.season};
            team.division = DataStore.getDivisionBySeason(t.season);
            team.name = this.getTeam(t.id).name;
            teams.push(team);
        }.bind(this));
        return teams;
    }
};

module.exports = UserContextMixin;