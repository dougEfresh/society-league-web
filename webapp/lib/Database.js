var EventEmitter = require('events').EventEmitter;
var request = require('request');
var assign = require('object-assign');
var CHANGE_EVENT = 'change';
var Util = require('../util.jsx');
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


function resetData() {
    return  {
        divisions: [],
        teams: [] ,
        seasons: [],
        users: [],
        teamMatches: [],
        results: [],
        slots: []
    }
}

var data = resetData();
var _loading = false;
var _authUserId = 0;
var _loaded = false;

var Database = assign({}, EventEmitter.prototype, {
    emitChange: function() {
        console.log('Emit Change');
        this.emit(CHANGE_EVENT);
    },
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    _findSlot: function(id){
        for (var i = 0; i < data.slots.length; i++) {
            if (data.slots[i].id == id) {
                return data.slots[i];
            }
        }
	return undefined;
    },
    _findSeason: function(id){
        for (var i = 0; i < data.seasons.length; i++) {
            if (data.seasons[i].id == id) {
                return data.seasons[i];
            }
        }
        debugger;
        return undefined;
    },
    _findDivision: function(id){
        for (var i = 0; i < data.divisions.length; i++) {
            if (data.divisions[i].id == id) {
                return data.divisions[i];
            }
        }
	return undefined;
    },
     _findUser: function(id){
        for (var i = 0; i < data.users.length; i++) {
            if (data.users[i].id == id) {
                return data.users[i];
            }
        }
	 return undefined;
    },
     _findTeam: function(id){
        for (var i = 0; i < data.teams.length; i++) {
            if (data.teams[i].id == id) {
                return data.teams[i];
            }
        }
	 return undefined;
    },
    processUser: function(user,data) {
        user.reset();
        var i;
        for (i = 0; i < data.seasons.length ; i++) {
            user.addSeason(Database._findSeason(data.seasons[i]));
        }
        for (i = 0; i < data.teams.length ; i++) {
            user.addTeam(Database._findTeam(data.teams[i]));
        }
        for(var type in data.challenges) {
            var cg = data.challenges[type];
            if (cg.length == 0) {
                continue;
            }

            cg.forEach(function(group){
                var ch = Database._findUser(group.challenger);
                var op = Database._findUser(group.opponent);
                var challengeGroup = null;
                challengeGroup = new ChallengeGroup(ch, op, group.date, type, null,  0);
                if (group.games.length == 1) {
                    challengeGroup.selectedGame = group.games[0];
                }
                if (group.slots.length == 1) {
                    challengeGroup.selectedSlot = group.slots[0];
                }
                group.games.forEach(function(g){
                    challengeGroup.addGame(g);
                });
                group.slots.forEach(function(s) {
                    challengeGroup.addSlot(Database._findSlot(s.id));
                });
                group.challenges.forEach(function(c){
                    var challenge = new Challenge(c.id,ch,op,c.slot.id,c.game,c.status);
                    challengeGroup.addChallenge(challenge);
                });
                user.addChallenge(type,challengeGroup);
            });
        }

    },
    processData: function(d) {
        var id;
        for (id in d.divisions) {
            data.divisions.push(new Division(id,d.divisions[id].type));
        }
        for (id in d.seasons) {
            var division = Database._findDivision(d.seasons[id].division);
            var season = d.seasons[id];
            data.seasons.push(new Season(season.id,season.name,season.startDate,season.endDate,season.status,division));
        }

        d.teams.forEach(function(t) {
            var team = new Team(t.teamId, t.name);
            for (var sid in t.seasons) {
                var season = Database._findSeason(sid);
                team.addSeason(season);
            }
            data.teams.push(team);
        });

        d.users.forEach(function(u){
            var user = new User(u.userId,u.firstName,u.lastName);
            Database.processUser(user,u);
            data.users.push(user);
        });

         d.teams.forEach(function(t) {
             var team = Database._findTeam(t.teamId);
             for (var sid in t.seasons) {
                for(var i =0; i<t.seasons[sid].length; i++){
                    var u = Database._findUser(t.seasons[sid][i]);
                    team.addTeamMember(sid,u);
                }
            }
        });

        for(id in d.userStats) {
            var user = Database._findUser(id);
            if (user == undefined) {
                //console.warn('Could not find user: ' + id);
                continue;
            }
            var stats = d.userStats[id];
            for (var type in stats) {
                if (type == 'all') {
                    if (stats[type] == undefined || stats[type] == null){
                        //console.warn('Could not find all stats for '+ id);
                        continue;
                    }
                    user.addStats(new Stat(type, stats[type]), null);
                } else if (type == 'season') {
                    stats[type].forEach(function(s){
                        user.addStats(new Stat(type, s, Database._findSeason(s.seasonId)));
                    });

                } else if (type == 'division') {
                    stats[type].forEach(function (s) {
                        user.addStats(new Stat(type, s, Database._findDivision(s.divisionId)));
                    });
                } else if (type == 'handicapAll') {
                    if (stats[type] != undefined && stats[type] != null) {
                        stats[type].forEach(function (s) {
                            user.addStats(new Stat(type, s, null));
                        });
                    }
                } else {
                    if (stats[type] == undefined || stats[type] == null){
                        //console.warn('Could not find stats for '+ id);
                        continue;
                    }
                    user.addStats(new Stat(type,stats[type],null));
                }
            }
        }

        for(id in d.teamStats) {
            var season = Database._findSeason(id);
            d.teamStats[id].forEach(function(s) {
                  data.teams.forEach(function(t){
                      if (t.id == s.teamId) {
                          t.addStats(id,new Stat('team',s,season));
                      }
                  });
              });
        }

        d.teamResults.forEach(function(r) {
            var season = Database._findSeason(r.seasonId);
            var tm = new TeamMatch(r.teamMatchId,r.resultId,r.matchDate,season);
            data.teams.forEach(function(t) {
                if (t.id == r.winner) {
                    tm.setWinner(t);
                    t.addMatch(tm);
                }
                if (t.id == r.loser) {
                    tm.setLoser(t);
                    t.addMatch(tm);
                }
            });

            tm.setLoserRacks(r.loserRacks);
            tm.setWinnerRacks(r.winnerRacks);

            tm.setLoserSetLoses(r.loserSetLoses);
            tm.setWinnerSetLoses(r.winnerSetLoses);

            tm.setLoserSetWins(r.loserSetWins);
            tm.setWinnerSetWins(r.winnerSetWins);

            data.teamMatches.push(tm);
        });

        d.userResults.forEach(function(r){
            var winner = null;
            var loser = null;
            data.users.forEach(function(u){
                if (r.winner == u.id ) {
                    winner = u;
                }
                if (r.loser == u.id ) {
                    loser = u;
                }
             });
            data.teamMatches.forEach(function(tm){
               if(tm.teamMatchId == r.teamMatchId) {
                   var result = new Result(r.resultId,tm,winner,loser);
                   result.setLoserHandicap(r.loserHandicap);
                   result.setLoserRacks(r.loserRacks);
                   result.setLoserHandicap(r.loserHandicap);
                   result.setLosersTeam(Database._findTeam(r.loserTeam));

                   result.setWinnerHandicap(r.winnerHandicap);
                   result.setWinnerRacks(r.winnerRacks);
                   result.setWinnerHandicap(r.winnerHandicap);
                   result.setWinnersTeam(Database._findTeam(r.winnerTeam));;

                   winner.addResult(result);
                   loser.addResult(result);
                   data.results.push(result);
               }
            });
        });
        d.slots.forEach(function(s){
            data.slots.push(new Slot(s.id,s.localDateTime,s.allocated));
        });

        d.users.forEach(function(u) {
            var user = Database._findUser(u.userId);
            Database.processUser(user, u);
        });

        data.users.push(User.DEFAULT_USER);
        console.log('Created ' + data.divisions.length + ' divisions');
        console.log('Created ' + data.seasons.length + ' seasons');
        console.log('Created ' + data.teams.length + ' teams');
        console.log('Created ' + data.users.length + ' users');
        console.log('Created ' + data.teamMatches.length + ' teamMatches');
        console.log('Created ' + data.results.length + ' userResults');
        console.log('Created ' + data.slots.length + ' slots');

        _loading = false;
        _loaded = true;
    },
    init: function(server,cb) {
        _loading = true;
        _loaded = false;
        data = resetData();
        request(server + '/api/data', function(d) {
            console.log('Got me some data');
            this.processData(d);
            if (cb) {
                cb();
            }
            Database.emitChange();
        }.bind(this));
    },
    getDivisions: function() { return data.divisions;},
    getTeams: function() { return data.teams;},
    getSeasons: function () { return data.seasons;},
    getUsers: function() { return data.users;},
    getResults: function() {return data.results;},
    getTeamMatches: function() {return data.teamMatches;},
    getSlots: function() {return data.slots;},

    isLoading: function() {
        return _loading;
    },
    isLoaded: function() {
        return _loaded;
    },
    isAuthenticated: function() {
        return _authUserId > 0;
    },
    setUser: function(u) {
        _authUserId = u.userId;
        Database.emitChange();
    },
    getAuthUserId: function() {
        return _authUserId;
    },
    replaceUser: function(user) {
        for (var i = 0; i < data.users.length; i++) {
            if (data.users[i].id == user.userId) {
                Database.processUser(data.users[i],user);
                Database.emitChange();
                return;
            }
        }
    },
    checkLogin: function() {
        console.log('Checking login stats');
        Util.getData('/api/user', function(d) {
            if (d.userId != 0) {
                console.log('User is logged');
                _authUserId = d.userId;
                Database.emitChange();
            }
        }.bind(this));
    },
    challengeSignUp: function(id) {
        console.log('Signing up ' + id);
         Util.getData('/api/challenge/signup/' + id, function(d) {
             var users = Database.getUsers();
             for (var i = 0; i<users.length;i++){
                 if (users[i].id == d.userId) {
                     Database.processUser(data.users[i],d);
                     Database.emitChange();
                     break;
                 }
             }
        }.bind(this));
    }
});

module.exports = Database;
