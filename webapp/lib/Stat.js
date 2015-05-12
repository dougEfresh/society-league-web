function Stat(type,obj,season) {
    this.matches = obj.matches;
    this.wins = obj.wins;
    this.loses = obj.loses == undefined ? obj.lost : obj.loses;
    this.racksFor = obj.racksFor;
    this.racksAgainst = obj.racksAgainst == undefined ? obj.racksAgainsts : obj.racksAgainst;
    this.setLoses = obj.setLoses == undefined ? 0 : obj.setLoses;
    this.setWins = obj.setWins== undefined ? 0 : obj.setWins;
    this.handicap = obj.handicap;
    this.season = season;
    this.type = type;
}

Stat.prototype.type = function() {return this.type; };
Stat.prototype.handicap = function() {return this.handicap; };
Stat.prototype.matches = function() {return this.matches; };
Stat.prototype.wins = function() {return this.wins; };
Stat.prototype.loses = function() {return this.loses; };
Stat.prototype.setWins = function() {return this.setWins; };
Stat.prototype.setLoses = function() {return this.setLoses; };
Stat.prototype.racksFor = function() {return this.racksFor; };
Stat.prototype.racksAgainst = function() {return this.racksAgainst; };
Stat.prototype.season = function() {return this.season; };

module.exports = Stat;
