var Status = require('./Status');
var Stat = require('./Stat');
var ChallengeGroup = require('./ChallengeGroup');
var Handicap = require('./Handicap');

function User(id,first_name,last_name) {
    this.id = id;
    this.userId = id;
    this.fName = first_name;
    this.firstName = first_name;
    this.lName = last_name;
    this.lastName = last_name;
    this.name = first_name + ' ' + last_name;
    this.seasons = [];
    this.teamMatches = [];
    this.results = [];
    this.stats = [];
    this.teams = [];
    this.points = 0;
    this.role = 'PLAYER';
    this.password = null;
    this.challenges = {};
    this.matchPoints = [];
    for(var st in Status) {
        this.challenges[st] = [];
    }
    this.handicaps = {};
}

User.prototype.getUserId = function () { return this.id ; };
User.prototype.userId = function () { return this.userId ; };
User.prototype.id = function () { return this.id ; };
User.prototype.points = function () { return this.points ; };
User.prototype.lName = function () { return this.lName ; };
User.prototype.fName = function () { return this.fName ; };
User.prototype.sName = function () {
 if (this.lName != undefined && this.lName.length > 0) {
     return this.fName + ' ' + this.lName.substr(0,1) + '.'
 }
    return "";
};
User.prototype.name = function () { return this.name ; };
User.prototype.challenges = function () { return this.challenges ; };
User.prototype.role = function () { return this.role ; };
User.prototype.password = function () { return this.password ; };

User.prototype.getCurrentHandicap = function(seasonId) {
    if (this.handicaps[seasonId] != undefined) {
        return Handicap.formatHandicap(this.handicaps[seasonId]);
    }
    return 'N/A';
};

User.prototype.getChallengeHandicap = function() {
    var seasons  = this.seasons;
    for (var i=0; i< seasons.length ; i++) {
        var s = seasons[i];
        if (s.isActive() && s.isChallenge() && s.isNine()) {
            if (this.handicaps[s.id] != undefined) {
                return Handicap.formatHandicap(this.handicaps[s.id]);
            }
        }
    }
    return 'N/A';
};


User.prototype.getRawChallengeHandicap = function() {
    var seasons  = this.seasons;
    for (var i=0; i< seasons.length ; i++) {
        var s = seasons[i];
        if (s.isActive() && s.isChallenge() && s.isNine()) {
            if (this.handicaps[s.id] != undefined) {
                return this.handicaps[s.id];
            }
        }
    }
    debugger;
    return 'N/A';
};


User.prototype.isChallenge = function() {
    var challenge = false;
    this.seasons.forEach(function(s){
        if (s.isChallenge()) {
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
        //debugger;
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

User.prototype.getResult = function(teamMatchId) {
    var result = undefined;
    if (teamMatchId == undefined) {
        return undefined;
    }
    this.results.forEach(function(r) {
        if (r.teamMatch.id == teamMatchId)
            result = r;
    });
    return result;
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

User.prototype.getChallengeStats = function() {
     for(var i =0 ; i < this.stats.length; i++) {
        if (this.stats[i].season != null && this.stats[i].season != undefined) {
            if (this.stats[i].season.isChallenge()) {
                return this.stats[i];
            }
        }
    }
    return Stat.getDefault();
};

User.prototype.getStatsForSeason = function(seasonId) {
   /*
    var isChallenge = false;

    this.seasons.forEach(function(s){
        if (s.isChallenge())
            isChallenge = true;
    });
    if (isChallenge) {
        var stat = null;
        this.stats.forEach(function(s){
            if (s.type == 'challenge') {
                stat = s;
            }
        });
        if (stat == null) {
            stat = new Stat('none',{},null);
            stat.setUser(this);
        }
        return stat;
    }
    */
    for(var i =0 ; i < this.stats.length; i++) {
        if (this.stats[i].season != null && this.stats[i].season != undefined) {
            if (this.stats[i].season.id == seasonId) {
                return this.stats[i];
            }
        }
    }
    //console.warn('No season stats for ' +seasonId + ' user:' + this.id);
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

User.prototype.getTeamForSeason = function(seasonId) {
    if (seasonId == undefined) {
        console.warn('No SeasonId');
        return undefined;
    }
    var teams = this.getCurrentTeams();
    var team = undefined;
    teams.forEach(function(t){
        if (t.hasSeason(seasonId)) {
            team = t;
        }
    });
    return team;
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


User.prototype.hasSeason = function(seasonId) {
    var found = false;
    this.seasons.forEach(function(s){
        if (s.id == seasonId) {
            found=true;
        }
    });
    return found;
}

User.prototype.reset = function(){
   for(var st in Status) {
        this.challenges[st] = [];
    }
    this.teams = [];
    this.seasons = [];
};

User.prototype.isAdmin = function() {
    return this.role != undefined && this.role == 'ADMIN';
};

User.prototype.setPoints = function(points) {
    this.points = points;
};


User.prototype.addMatchPoints = function(mp) {
    if (mp) {
        this.matchPoints.push(mp);
    }
};

User.prototype.getMatchPoint = function(resultId) {
    var p  = 0;
    this.matchPoints.forEach(function(m) {
        if (m.resultId == resultId) {
            p = m.points;
        }
    }.bind(this));
    return p;
};

User.prototype.getCalculation = function(resultId) {
    var p  = "";
    this.matchPoints.forEach(function(m) {
        if (m.resultId == resultId) {
            p = m.calculation;
        }
    }.bind(this));
    return p;
};

User.prototype.getWeightedAvg = function(resultId) {
    var p  = 0;
    this.matchPoints.forEach(function(m) {
        if (m.resultId == resultId) {
            p = m.weightedAvg.toFixed(2);
        }
    }.bind(this));
    return p;
};


User.DEFAULT_USER = new User(0,'unknown','',{});
User.create = function(userData,db)  {
var user = new User(userData.userId,userData.firstName,userData.lastName);
 var i;
    for (i = 0; i < userData.seasons.length; i++) {

        user.addSeason(db.findSeason(userData.seasons[i]));
    }
    for (i = 0; i < userData.teams.length; i++) {
        user.addTeam(db.findTeam(userData.teams[i]));
    }
    for(var type in userData.challenges) {
            if (!userData.challenges.hasOwnProperty(type)) {
                continue;
            }
            var cg = userData.challenges[type];
            if (cg.length == 0) {
                continue;
            }

            cg.forEach(function(group){
                var ch = this.findUser(group.challenger);
                var op = this.findUser(group.opponent);
                var challengeGroup = null;
                challengeGroup = new ChallengeGroup(ch, op, group.date, type, null,  0);
                group.slots.forEach(function(s) {
                    challengeGroup.addSlot(db.findOrCreateSlot(s));
                }.bind(this));
                if (group.games.length == 1) {
                    challengeGroup.selectedGame = group.games[0];
                }
                if (group.slots.length == 1) {
                    challengeGroup.selectedSlot = db.findSlot(group.slots[0].id);
                }
                group.games.forEach(function(g){
                    challengeGroup.addGame(g);
                });
                group.challenges.forEach(function(c){
                    var challenge = new Challenge(c.id,ch,op,db.findSlot(c.slot.id),c.game,c.status);
                    challengeGroup.addChallenge(challenge);
                }.bind(this));
                user.addChallenge(type,challengeGroup);
            }.bind(this));
        }

        return user;
}
module.exports = User;
