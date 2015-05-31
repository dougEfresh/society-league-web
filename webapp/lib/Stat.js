function Stat(type,obj,season) {
    this.wins = obj.wins == undefined ? 0 : parseInt(obj.wins);
    this.loses = obj.loses == undefined ? 0 : parseInt(obj.loses);
    this.matches =  this.loses + this.wins;
    this.racksFor = obj.racksFor == undefined ? 0 : parseInt(obj.racksFor);
    this.racksAgainst = obj.racksAgainst == undefined ? 0 : parseInt(obj.racksAgainst);
    this.setLoses = obj.setLoses == undefined ? 0 :  parseInt(obj.setLoses);
    this.setWins = obj.setWins== undefined ? 0 :  parseInt(obj.setWins);
    this.team = undefined;
    this.user = undefined;
    this.handicap = obj.handicap;
    this.season = season;
    this.type = type;
    this.notFound = false;
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

Stat.prototype.team = function() {return this.team; };
Stat.prototype.user = function() {return this.user; };
Stat.prototype.setTeam = function(t) {return this.team = t; };
Stat.prototype.setUser = function(u) {return this.user = u; };


Stat.prototype.getType = function() {return this.type;};

Stat.prototype.getWinPct = function() {
    if (this.matches == undefined || this.matches == 0) {
        return 0;
    }
    var pct = this.wins/this.matches;
    pct = pct.toFixed(3);
    if (Number.NaN == pct) {
        debugger;
        return 0;
    }
    return pct;
};
Stat.prototype.getWinRackPct = function() {
    if (this.matches == undefined || this.matches == 0) {
        return 0;
    }
    var pct = this.racksFor/(this.racksFor+this.racksAgainst);
    pct = pct.toFixed(3);
    if (Number.NaN == pct) {
        debugger;
        return 0;
    }
    return pct;
};

Stat.DEFAULT = new Stat('none',{},null);
Stat.getDefault = function() { var s =new Stat('none',{},null); return s;};

Stat.prototype.getPoints = function() {
    if (this.wins == 0) {
        return 0;
    }
};

Stat.sortAsc = function(a,b) {
    if (a.wins == b.wins) {
        if (a.loses == b.loses) {
            if (a.racksFor == b.racksFor) {
                return a.racksAgainst < b.racksAgainst ? -1 :1;
            }
            return a.racksFor < b.racksFor ? -1 : 1;
        }
        return a.loses < b.loses ? -1 : 1;
    }
    return a.wins < b.wins ? 1: -1;
} ;

Stat.sort = {};

Stat.sort.byMatches = function(a,b) {
    return a.matches> b.matches ? -1 : 1;
};

Stat.sort.byWins= function(a,b) {
    return a.wins > b.wins ? -1 : 1;
};

Stat.sort.bySetWins= function(a,b) {
    return a.setWins > b.setWins ? -1 : 1;
};

Stat.sort.byLoses= function(a,b) {
    return a.loses> b.loses ? -1 : 1;
};

Stat.sort.byRacksFor= function(a,b) {
    return a.racksFor> b.racksFor ? -1 : 1;
};

Stat.sort.byRacksAgainst= function(a,b) {
    return a.racksAgainst > b.racksAgainst ? -1 : 1;
};

Stat.sort.byWinPct= function(a,b) {
    return a.getWinPct() > b.getWinPct() ? -1 : 1;
};




module.exports = Stat;
