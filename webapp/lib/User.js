var Status = require('./Status');
var Stat = require('./Stat');

function User(id,first_name,last_name) {
    this.id = id;
    this.userId = id;
    this.fName = first_name;
    this.lName = last_name;
    this.name = first_name + ' ' + last_name;
    this.seasons = [];
    this.teamMatches = [];
    this.results = [];
    this.stats = [];
    this.teams = [];
    this.challenges = {};
    for(var st in Status) {
        this.challenges[st] = [];
    }
    this.handicaps = {};
}

User.prototype.getUserId = function () { return this.id ; };
User.prototype.userId = function () { return this.userId ; };
User.prototype.id = function () { return this.id ; };
User.prototype.lName = function () { return this.lName ; };
User.prototype.fName = function () { return this.fName ; };
User.prototype.name = function () { return this.name ; };
User.prototype.challenges = function () { return this.challenges ; };

User.prototype.getCurrentHandicap = function(seasonId) {
    if (this.handicaps[seasonId] != undefined) {
        return this.handicaps[seasonId];
    }

    var results = [];
    this.results.forEach(function(r){
        if (r.getSeason().id == seasonId) {
            results.push(r);
        }
    });
    results = results.sort(function(a,b){
        return b.getMatchDate().localeCompare(a.getMatchDate());
    });
    if (results.length > 0) {
        return this.handicaps[seasonId] = results[0].getHandicap(this);
    }
    return this.handicaps[seasonId] == undefined ? "N/A" :  this.handicaps[seasonId];
};

User.prototype.isChallenge = function() {
    var challenge = false;
    this.seasons.forEach(function(s){
        if (s.isChallenge() && s.isActive()) {
            challenge = true;
        }
    });
    return challenge;
};

User.prototype.getCurrentTeams = function() {
    var activeTeams = [];
    this.teams.forEach(function(t) {
        if (t.isActive()) {
            activeTeams.push(t);
        }
    });

    var userActiveTeams = [];
    activeTeams.forEach(function(t){
        this.getCurrentSeasons().forEach( function(s){
            if (t.getSeason().id == s.id) {
                userActiveTeams.push(t);
            }
        });
    }.bind(this));
    return userActiveTeams;
};

User.prototype.getCurrentSeasons = function() {
    var seasons = [];
    this.seasons.forEach(function(s){
        if (s.isActive()) {
            seasons.push(s);
        }
    });
    return seasons;
};

User.prototype.getPastSeason = function() {
    var seasons = [];
    this.seasons.forEach(function(s){
        if (!s.isActive()) {
            seasons.push(s);
        }
    });
    return seasons;
};

User.prototype.getSeasons = function() {
    return this.seasons;
};
User.prototype.addSeason = function(season) {
    if (season == null || season == undefined) {
        debugger;
        return;
    }
    this.seasons.push(season);
};
User.prototype.addTeam = function(team) {
    if (team == undefined || team == null)
        return ;
    this.teams.push(team);
};
User.prototype.addResult= function(r) {
    if (r == undefined || r == null)
        return ;
    this.results.push(r);
};

User.prototype.getResults = function() {
    return this.results;
};
User.prototype.addStats = function(stats) {
    if (stats == undefined)
        return;

    this.stats.push(stats);
};
User.prototype.getStats = function() {
    for(var i =0 ; i < this.stats.length; i++) {
        if (this.stats[i].type != undefined && this.stats[i].type != null) {
            if (this.stats[i].type == 'all') {
                return this.stats[i];
            }
        }
    }
    return Stat.DEFAULT;
};
User.prototype.getSeasonStats = function(seasonId) {
    var stats = [];
    if (seasonId != undefined && seasonId != null) {
        return this.getStatsForSeason(seasonId);
    }
    for(var i =0 ; i < this.stats.length; i++) {
        if (this.stats[i].season != null && this.stats[i].season != undefined) {
            stats.push(this.stats[i]);
        }
    }
    return stats;
};

User.prototype.getStatsForSeason = function(seasonId) {
    for(var i =0 ; i < this.stats.length; i++) {
        if (this.stats[i].season != null && this.stats[i].season != undefined) {
            if (seasonId != undefined && seasonId != null && this.stats[i].season.id == seasonId) {
                return this.stats[i];
            }
        }
    }
    console.warn('No season stats for ' +seasonId + ' user:' + this.id);
    return Stat.getDefault();
};

User.prototype.getHandicapStats = function() {
    var stats = [];
    for(var i =0 ; i < this.stats.length; i++) {
        if (this.stats[i].type != undefined && this.stats[i].type != undefined) {
            if (this.stats[i].type.indexOf('handicap') >= 0) {
                stats.push(this.stats[i]);
            }
        }
    }
    return stats;
};

User.prototype.addChallenge = function(type,cg) {
    if (type == undefined || type == null || cg == undefined) {
        console.warn('Unknown challenge group');
        return;
    }
    this.challenges[type].push(cg);
};

User.prototype.getChallenges = function(type) {
    if (type == null || type == undefined) {
        debugger;
        return [];
    }
    return this.challenges[type];
};


User.prototype.reset = function(){
   for(var st in Status) {
        this.challenges[st] = [];
    }
    this.teams = [];
    this.seasons = [];
};


User.DEFAULT_USER = new User(0,'unknown','',{});

module.exports = User;
