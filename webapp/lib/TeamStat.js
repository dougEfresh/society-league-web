var User = require('./User');

function TeamStat(team,stat) {
    this.team = team;
    this.stat = stat;
}

TeamStat.prototype.team = function() {return this.team;};
TeamStat.prototype.stat = function() {return this.stat;};

module.exports =  TeamStat;