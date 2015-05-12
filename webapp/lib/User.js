var Status = require('./Status');
var DivisionType = require('./DivisionType');
var _ = require('lodash');

function User(id,first_name,last_name,challenges) {
    this.id = id;
    this.userId = id;
    this.name = first_name + ' ' + last_name;
    this.seasons = [];
    this.teamMatches = [];
    this.results = [];
    this.stats = {};
    this.teams = [];
    this.challenges = challenges;
}

User.prototype.getUserId = function () { return this.id ; };
User.prototype.userId = function () { return this.userId ; };
User.prototype.id = function () { return this.id ; };
User.prototype.name = function () { return this.name ; };
User.prototype.challenges = function () { return this.challenges ; };
User.prototype.setStats = function(s) {this.stats = s;};
User.prototype.isChallenge = function() {
    var challenge = false;
    this.seasons.forEach(function(s){
        if (s.division.type  == DivisionType.EIGHT_BALL_CHALLENGE ) {
            challenge = true;
        }
        if (s.division.type  == DivisionType.NINE_BALL_CHALLENGE ) {
            challenge = true;
        }
    });
    return challenge;
};

User.prototype.getCurrentTeams = function() {
    var activeTeams = _.filter(this.teams, function(t) {
        return t.isActive();
    })
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
    return _.filter(this.seasons, function(s) {
        return s.status == Status.ACTIVE;
    })
};
User.prototype.getPastSeason = function() {
    return _.filter(this.seasons, function(s) {
        return s.status != Status.ACTIVE;
    })
};
User.prototype.getSeasons = function() {
    return this.seasons;
};
User.prototype.addSeason = function(season) {
    if (season == null || season == undefined)
        return;
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

User.DEFAULT_USER = new User(0,'unknown','',{});

module.exports = User;
