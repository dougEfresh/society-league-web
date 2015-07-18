var Season = require('./Season');
var Stat = require('./Stat');
var Slot = require('./Slot');
var Division = require('./Division');
var Team = require('./Team');
var User = require('./User');
var Status = require('./Status');
var TeamMatch = require('./TeamMatch');
var Result = require('./Result');
var ChallengeGroup = require('./ChallengeGroup');
var Challenge = require('./Challenge');
var moment = require('moment');
function resetData() {
    return  {
        divisions: [],
        teams: [] ,
        seasons: [],
        users: [],
        teamMatches: [],
        results: [],
        slots: [],
        challenges: []
    }
}

function Database() {
    this.data = resetData();
    this.loaded = false;
    this.loading = false;
    this.userMap = {};
}

Database.prototype.data = function() {return this.data};
Database.prototype.userMap = function() {return this.userMap};
Database.prototype.loaded = function() {return this.loaded;};
Database.prototype.loading = function() {return this.loading;};

Database.prototype.findSlot =  function (id) {
    for (var i = 0; i < this.data.slots.length; i++) {
        if (this.data.slots[i].id == id) {
            return this.data.slots[i];
        }
    }
    return undefined;
};

Database.prototype.findOrCreateSlot = function(s) {
        for (var i = 0; i < this.data.slots.length; i++) {
            if (this.data.slots[i].id == s.id) {
                return this.data.slots[i];
            }
        }
         var slot = new Slot(s.id,s.localDateTime,s.allocated);
         this.data.slots.push(slot);
        return slot;
};

Database.prototype.findSeason =  function (id) {
    for (var i = 0; i < this.data.seasons.length; i++) {
        if (this.data.seasons[i].id == id) {
            return this.data.seasons[i];
        }
    }
    return undefined;
};

Database.prototype.findDivision = function (id) {
    for (var i = 0; i < this.data.divisions.length; i++) {
        if (this.data.divisions[i].id == id) {
            return this.data.divisions[i];
        }
    }
    return undefined;
};

Database.prototype.findUser = function (id) {
    if (this.userMap[id] != undefined) {
        return this.userMap[id];
    }
    for (var i = 0; i < this.data.users.length; i++) {
        if (this.data.users[i].id == id) {
            return this.data.users[i];
        }
    }
    return undefined;
};

Database.prototype.findTeam = function (id) {
    for (var i = 0; i < this.data.teams.length; i++) {
        if (this.data.teams[i].id == id) {
            return this.data.teams[i];
        }
    }
    return undefined;
};

Database.prototype.findTeamMatch = function (id) {
    for (var i = 0; i < this.data.teamMatches.length; i++) {
        if (this.data.teamMatches[i].id == id) {
            return this.data.teamMatches[i];
        }
    }
    return undefined;
};
Database.prototype.addUser = function(u) {
    this.data.users.push(u);
    this.userMap[u.id] = u;
};

Database.prototype.processUser = function(user,userData) {
    if (user == null || user == undefined) {
        user = new User(userData.userId,userData.firstName,userData.lastName);
        this.data.users.push(user);
    }
    user.reset();
    user.role = userData.role;
    user.handicaps = userData.currentHandicap;
    var i;
    for (i = 0; i < userData.seasons.length; i++) {
        user.addSeason(this.findSeason(userData.seasons[i]));
    }
    for (i = 0; i < userData.teams.length; i++) {
        user.addTeam(this.findTeam(userData.teams[i]));
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
                    challengeGroup.addSlot(this.findOrCreateSlot(s));
                }.bind(this));
                if (group.games.length == 1) {
                    challengeGroup.selectedGame = group.games[0];
                }
                if (group.slots.length == 1) {
                    challengeGroup.selectedSlot = this.findSlot(group.slots[0].id);
                }
                group.games.forEach(function(g){
                    challengeGroup.addGame(g);
                });
                group.challenges.forEach(function(c){
                    var challenge = new Challenge(c.id,ch,op,this.findSlot(c.slot.id),c.game,c.status);
                    challengeGroup.addChallenge(challenge);
                }.bind(this));
                user.addChallenge(type,challengeGroup);
            }.bind(this));
    }
    return user;
};

Database.prototype.processData = function (d) {
    var id;
    var start = moment();
    this.data.slots = [];
    for (id in d.divisions) {
        this.data.divisions.push(new Division(id, d.divisions[id].type));
    }
    console.log('Division: ' + start.diff(moment()));
    start = moment();
    for (id in d.seasons) {
        var division = this.findDivision(d.seasons[id].division);
        var season = d.seasons[id];
        this.data.seasons.push(new Season(season.id, season.name, season.startDate, season.endDate, season.status, division));
    }
    console.log('Season: ' + start.diff(moment()));

    start = moment();
    d.teams.forEach(function (t) {
        var team = new Team(t.teamId, t.name);
        for (var sid in t.seasons) {
            var season = this.findSeason(sid);
            team.addSeason(season);
        }
        this.data.teams.push(team);
    }.bind(this));
    console.log('Team: '  + start.diff(moment()));

    start = moment();
    d.users.forEach(function (u) {
        var user = new User(u.userId, u.firstName, u.lastName);
        this.addUser(user);
    }.bind(this));
    d.users.forEach(function (u) {
        this.processUser(this.findUser(u.userId), u);
    }.bind(this));

    console.log('Users: '  + start.diff(moment()));

    start = moment();
    d.teams.forEach(function (t) {
        var team = this.findTeam(t.teamId);
        for (var sid in t.seasons) {
            for (var i = 0; i < t.seasons[sid].length; i++) {
                var u = this.findUser(t.seasons[sid][i]);
                team.addTeamMember(sid, u);
            }
        }
    }.bind(this));
    console.log('TeamMembers '  + start.diff(moment()));

    start = moment();
    for (id in d.userStats) {
        var user = this.findUser(id);
        if (user == undefined) {
            //console.warn('Could not find user: ' + id);
            continue;
        }
        var stats = d.userStats[id];
        for (var type in stats) {
            if (type == 'all') {
                if (stats[type] == undefined || stats[type] == null) {
                    //console.warn('Could not find all stats for '+ id);
                    continue;
                }
                var stat = new Stat(type, stats[type]);
                stat.setUser(stat);
                user.addStats(stat);
            } else if (type == 'season') {
                stats[type].forEach(function (s) {
                    var stat = new Stat(type, s, this.findSeason(s.seasonId));
                    stat.setUser(user);
                    user.addStats(stat);
                }.bind(this));
            } /*
            else if (type == 'division') {

                stats[type].forEach(function (s) {
                    var stat = new Stat(type, s);
                    stat.setUser(stat);
                    user.addStats(stat);
                }.bind(this));
            } else if (type == 'challenge') {
                stats[type].forEach(function (s) {
                      var stat = new Stat(type, s);
                    stat.setUser(user);
                    user.addStats(stat);
                }.bind(this));
            } else if (type == 'handicapAll') {
                if (stats[type] != undefined && stats[type] != null) {
                    stats[type].forEach(function (s) {
                        user.addStats(new Stat(type, s, null));
                    });
                }
            }
             */
            else {
                if (stats[type] == undefined || stats[type] == null) {
                    //console.warn('Could not find stats for '+ id);
                    continue;
                }
                user.addStats(new Stat(type, stats[type], null));
            }
        }
    }
    console.log('UserStats '  + start.diff(moment())*-1);
    for (id in d.teamStats) {
        var season = this.findSeason(id);
        d.teamStats[id].forEach(function (s) {
            this.data.teams.forEach(function (t) {
                if (t.id == s.teamId) {
                    var stat = new Stat('team', s, season);
                    stat.setTeam(t);
                    t.addStats(id,stat);
                }
            });
        }.bind(this));
    }
    start = moment();
    d.teamResults.forEach(function (r) {
        var season = this.findSeason(r.seasonId);
        var tm = new TeamMatch(r.teamMatchId, r.resultId, r.matchDate, season);
        this.data.teams.forEach(function (t) {
            if (t.id == r.winner) {
                tm.setWinner(t);
                t.addMatch(tm);
            }
            if (t.id == r.loser) {
                tm.setLoser(t);
                t.addMatch(tm);
            }
        }.bind(this));

        tm.setLoserRacks(r.loserRacks);
        tm.setWinnerRacks(r.winnerRacks);

        tm.setLoserSetLoses(r.loserSetLoses);
        tm.setWinnerSetLoses(r.winnerSetLoses);

        tm.setLoserSetWins(r.loserSetWins);
        tm.setWinnerSetWins(r.winnerSetWins);

        this.data.teamMatches.push(tm);
    }.bind(this));
    console.log('TeamResults '  + start.diff(moment()));
    start  = moment();

    d.userResults.forEach(function (r) {
        var winner = this.findUser(r.winner);
        var loser = this.findUser(r.loser);
        this.data.teamMatches.forEach(function (tm) {
            if (tm.teamMatchId == r.teamMatchId) {
                var result = new Result(r.resultId, tm, winner, loser);
                result.setLoserHandicap(r.loserHandicap);
                result.setLoserRacks(r.loserRacks);
                result.setLoserHandicap(r.loserHandicap);
                result.setLosersTeam(this.findTeam(r.loserTeam));

                result.setWinnerHandicap(r.winnerHandicap);
                result.setWinnerRacks(r.winnerRacks);
                result.setWinnerHandicap(r.winnerHandicap);
                result.setWinnersTeam(this.findTeam(r.winnerTeam));

                winner.addResult(result);
                loser.addResult(result);
                this.data.results.push(result);
            }
        }.bind(this));
    }.bind(this));
    console.log('UseResults '  + start.diff(moment()));
    if (d.slots != undefined) {
    d.slots.forEach(function (s) {
        var slot = this.findSlot(s.id);
        if (slot == undefined) {
            this.data.slots.push(new Slot(s.id, s.localDateTime, s.allocated));
        }
    }.bind(this));
    }

    if (d.challenges != undefined) {
        this.data.challenges = [];
        d.challenges.forEach(function(c) {
            var ch = this.findUser(c.challenger);
            var op = this.findUser(c.opponent);
            var challenge = new Challenge(c.id,ch,op,this.findSlot(c.slot.id),c.game,c.status);
            challenge.setTeamMatch(this.findTeamMatch(c.teamMatchId));
            this.data.challenges.push(challenge);
        }.bind(this))
    }
    this.data.users.push(User.DEFAULT_USER);

    this.data.users.forEach(function(u){
        if (u == undefined)
            return;
        if (!u.isChallenge()) {
            return;
        }
        var stat = u.getChallengeStats();
        var results = u.getResults();
        var points = 0;
        results.forEach(function(r) {
            if (!r.teamMatch.season.isChallenge())
                return;
            if (r.isWinner(u)) {
                if (r.isSweep(u)) {
                    points += 4;
                } else {
                    points += 3;
                }
            } else {
                var hill = (r.winnerRacks - r.loserRacks == 1);
                if (hill)
                    points +=1;

                points +=1;
            }
        });
        stat.setPoints(points);
    });

    console.log('Created ' + this.data.divisions.length + ' divisions');
    console.log('Created ' + this.data.seasons.length + ' seasons');
    console.log('Created ' + this.data.teams.length + ' teams');
    console.log('Created ' + this.data.users.length + ' users');
    console.log('Created ' + this.data.teamMatches.length + ' teamMatches');
    console.log('Created ' + this.data.results.length + ' userResults');
    console.log('Created ' + this.data.slots.length + ' slots');

    this.loading  = false;
    this.loaded = true;
};

Database.prototype.init = function(data) {
    this.loading = true;
    this.loaded = false;
    this.data = resetData();
    this.processData(data);
    //Database.loaded = true;
};

Database.prototype.getDivisions =  function () {
        return this.data.divisions;
};
Database.prototype.getTeams = function () {
        return this.data.teams;
};
Database.prototype.getSeasons= function () {
    return this.data.seasons;
};
Database.prototype.getUsers= function () {
    return this.data.users;
};

Database.prototype.getUser= function (id) {
    var user = User.DEFAULT_USER;
    this.data.users.forEach(function(u){
        if (u.userId == id) {
            user = u;
        }
    });
    return user;
};
Database.prototype.getResults= function () {
    return this.data.results;
};
Database.prototype.getTeamMatches= function () {
    return this.data.teamMatches;
};
Database.prototype.getSlots= function () {
    return this.data.slots;
};
Database.prototype.getChallenges = function () {
    return this.data.challenges;
};

Database.prototype.replaceUser= function (user) {
    for (var i = 0; i < this.data.users.length; i++) {
        if (this.data.users[i].id == user.userId) {
            this.processUser(this.data.users[i], user);
            return;
        }
    }
};


module.exports = Database;
