var AppDispatcher = require('../dispatcher/AppDispatcher.jsx');
var EventEmitter = require('events').EventEmitter;
var UserConstants = require('../constants/UserConstants.jsx');
var assign = require('object-assign');
var CHANGE_EVENT = 'change';
var Util = require('../util.jsx');
var Season = require('../../lib/Season.js');
var Stat = require('../../lib/Stat');
var Division = require('../../lib/Division.js');
var Team = require('../../lib/Team.js');
var User = require('../../lib/User.js');
var Status = require('../../lib/Status');
var TeamMatch = require('../../lib/TeamMatch');
var Result = require('../../lib/Result');
var ChallengeGroup = require('../../lib/ChallengeGroup');
var Challenge = require('../../lib/Challenge');

function resetData() {
    return  {
        divisions: [],
        teams: [] ,
        seasons: [],
        users: [],
        teamMatches: [],
        results: []
    }
}

var data = resetData();
var _loading = false;
var _authUserId = 0;
var _loaded = false;

var DataStore = assign({}, EventEmitter.prototype, {
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
    _findSeason: function(id){
        for (var i = 0; i < data.seasons.length; i++) {
            if (data.seasons[i].id == id) {
                return data.seasons[i];
            }
        }

    },
    _findDivision: function(id){
        for (var i = 0; i < data.divisions.length; i++) {
            if (data.divisions[i].id == id) {
                return data.divisions[i];
            }
        }

    },
     _findUser: function(id){
        for (var i = 0; i < data.users.length; i++) {
            if (data.users[i].id == id) {
                return data.users[i];
            }
        }

    },
     _findTeam: function(id){
        for (var i = 0; i < data.teams.length; i++) {
            if (data.teams[i].id == id) {
                return data.teams[i];
            }
        }

    },
    processData: function(d) {
        var id;
        for (id in d.divisions) {
            data.divisions.push(new Division(id,d.divisions[id].type));
        }
        for (id in d.seasons) {
            var division = DataStore._findDivision(d.seasons[id].division);
            var season = d.seasons[id];
            data.seasons.push(new Season(season.id,season.name,season.startDate,season.endDate,season.status,division));
        }

        d.teams.forEach(function(t) {
            var team = new Team(t.teamId, t.name);
            for (var sid in t.seasons) {
                var season = DataStore._findSeason(sid);
                team.addSeason(season);
            }
            data.teams.push(team);
        });

        d.users.forEach(function(u){
            var user = new User(u.userId,u.firstName,u.lastName);
            var i;
            for (i in u.seasons) {
                user.addSeason(DataStore._findSeason(u.seasons[i]));
            }
            for (i in u.teams) {
                user.addTeam(DataStore._findTeam(u.teams[i]));
            }
            data.users.push(user);
        });

         d.teams.forEach(function(t) {
             var team = DataStore._findTeam(t.teamId);
             for (var sid in t.seasons) {
                for(var i =0; i<t.seasons[sid].length; i++){
                    var u = DataStore._findUser(t.seasons[sid][i]);
                    team.addTeamMember(sid,u);
                }
            }
        });

        for(id in d.userStats) {
            var user = DataStore._findUser(id);
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
                        user.addStats(new Stat(type, s, DataStore._findSeason(s.seasonId)));
                    });

                } else if (type == 'division') {
                    stats[type].forEach(function (s) {
                        user.addStats(new Stat(type, s, DataStore._findDivision(s.divisionId)));
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
            var season = DataStore._findSeason(id);
            d.teamStats[id].forEach(function(s) {
                  data.teams.forEach(function(t){
                      if (t.id == s.teamId) {
                          t.addStats(id,new Stat('team',s,season));
                      }
                  });
              });
        }

        d.teamResults.forEach(function(r) {
            var season = DataStore._findSeason(r.seasonId);
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
                   result.setLoserTeam(DataStore._findTeam(r.loserTeam));
                   result.setLoserHandicap(r.loserHandicap);

                   result.setWinnerHandicap(r.winnerHandicap);
                   result.setWinnerRacks(r.winnerRacks);
                   result.setWinnerTeam(DataStore._findTeam(r.winnerTeam));
                   result.setWinnerHandicap(r.winnerHandicap);

                   winner.addResult(result);
                   loser.addResult(result);
                   data.results.push(result);
               }
            });
        });

        d.users.forEach(function(u){
            var user = DataStore._findUser(u.userId);
            for(var type in u.challenges) {
                var cg = u.challenges[type];
                if (cg.length == 0) {
                    continue;
                }

                cg.forEach(function(group){
                    var ch = DataStore._findUser(group.challenger);
                    var op = DataStore._findUser(group.opponent);
                    var challengeGroup = new ChallengeGroup(ch,op,group.date,type,group.selectedGame,group.selectedSlot);
                    group.games.forEach(function(g){
                        challengeGroup.addGame(g);
                    });
                    group.slots.forEach(function(s){
                        challengeGroup.addSlotId(s);
                    });
                    group.challenges.forEach(function(c){
                        var challenge = new Challenge(c.id,ch,op,c.slot.id,c.game,c.status);
                        challengeGroup.addChallenge(challenge);
                    });
                    user.addChallenge(type,challengeGroup);
                });
            }
        });

        data.users.push(User.DEFAULT_USER);

        console.log('Created ' + data.divisions.length + ' divisions');
        console.log('Created ' + data.seasons.length + ' seasons');
        console.log('Created ' + data.teams.length + ' teams');
        console.log('Created ' + data.users.length + ' users');
        console.log('Created ' + data.teamMatches.length + ' teamMatches');
        console.log('Created ' + data.results.length + ' userResults');

        _loading = false;
        _loaded = true;
    },
    init: function() {
        _loading = true;
        _loaded = false;
        data = resetData();
        Util.getData('/api/data', function(d) {
            console.log('Got me some data');
            this.processData(d);
            DataStore.emitChange();
        }.bind(this));
    },
    getDivisions: function() { return data.divisions;},
    getTeams: function() { return data.teams;},
    getSeasons: function () { return data.seasons;},
    getUsers: function() { return data.users;},
    getResults: function() {return data.results;},
    getTeamMatches: function() {return data.teamMatches;},

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
    },
    getAuthUserId: function() {
        return _authUserId;
    },
    checkLogin: function() {
        console.log('Checking login stats');
        Util.getData('/api/user', function(d) {
            console.log('User is logged');
            if (d.userId != 0) {
                _authUserId = d.userId;
                DataStore.emitChange();
            }
        }.bind(this));
    },
    challengeSignUp: function(id) {
        console.log('Signing up ' + id);
         Util.getData('/api/challenge/signup/' + id, function(d) {
             var users = DataStore.getUsers();
             for (var i = 0; i<users.length;i++){
                 if (users[i].id == d.userId) {
                     users[i] = d;
                     break;
                 }
             }
            DataStore.emitChange();
        }.bind(this));
    }
});

AppDispatcher.register(function(action) {
     switch(action.actionType) {
         case 'INIT':
             DataStore.init();
             break;
         case 'CHECK':
      //       DataStore.checkLogin();
             break;
         case 'CHALLENGE_SIGN_UP':
             DataStore.challengeSignUp(action.id);
             break;
         default:
            //console.log('Unknown Action ' + JSON.stringify(action));
     }
});

module.exports = DataStore;
