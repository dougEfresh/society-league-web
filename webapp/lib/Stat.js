function Stat(type,obj) {
    this.type = type;
    this.data = obj;
}

Stat.prototype.matches = function() {return this.data.matches; };
Stat.prototype.wins = function() {return this.data.wins; };
Stat.prototype.loses = function() {return this.data.loses; };
Stat.prototype.racksFor = function() {return this.data.racksFor; };
Stat.prototype.racksAgainst = function() {return this.data.racksAgainst; };
Stat.prototype.type = function() {return this.type;};

module.exports = Stat;
