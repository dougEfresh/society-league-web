var Status = require('./Status.js');
var Stat = require('./Stat');

function Team(id,name) {
    this.id = id;
    this.teamId = id;
    this.name = name;
    this.seasons = [];
    this.members = {};
    this.stats = {};
    this.matches = [];
}

Team.prototype.id = function () { return this.id ; };
Team.prototype.teamId = function () { return this.teamId ; };
Team.prototype.name = function () { return this.name ; };
Team.prototype.seasons = function() {return this.seasons};

Team.prototype.getMatches = function() {return this.matches;};

Team.prototype.getStats = function(seasonId) {
    var s = this.stats[seasonId];
    if (s == undefined) {
        var stat = Stat.getDefault();
        stat.notFound = true;
        return stat;
    }
    return s;
};

Team.prototype.getSeason = function() {
    var season = undefined;
    this.seasons.forEach(function (s) {
        if (s.status == Status.ACTIVE) {
            season = s;
        }
    });
    return season;
};

Team.prototype.addMatch = function(m) {
    if (m == undefined || m == null) {
        //console.warn('Trying to add a undefined match to '+ this.id);
        return;
    }

    return this.matches.push(m)
};

Team.prototype.addStats = function(seasonId,stats) {
    if (seasonId == undefined) {
        //console.warn('Trying to add a undefined stat to '+ this.id);
        return;
    }

    if (seasonId == stats) {
        //console.warn('Trying to add a undefined stat to '+ this.id);
        return;
    }

    this.stats[seasonId] = stats;
};

Team.prototype.addSeason = function(season) {
    if (season == null || season == undefined) {
        console.warn('Trying to add a undefined season to '+ this.id);
        return
    }
    this.seasons.push(season);
};

Team.prototype.addTeamMember = function(seasonId,user) {
    if (seasonId == undefined)
        return;

    if (this.members[seasonId] == undefined) {
        this.members[seasonId] = [];
    }
    if (user == undefined) {
        //console.warn('Trying to add a undefined user to ' + this.id);
        return;
    }
    this.members[seasonId].push(user);
};

Team.prototype.getMembers = function (season) {
    if (season == undefined || season == null) {
        return [];
    }
    var m = this.members[season];
    if (m == undefined) {
        return [];
    }
    return m;
};

Team.prototype.isActive = function() {
    var active = false;
    this.seasons.forEach(function(s){
        if (s.status == Status.ACTIVE)
            active = true;
    });
    return active;
};

Team.prototype.getMatch = function(teamMatchId) {
    for(var i=0;i<this.matches.length;i++) {
        var m = this.matches[i];
        if (m.teamMatchId == teamMatchId) {
            return m;
        }
    }
    debugger;
    return undefined;
};

module.exports = Team;
