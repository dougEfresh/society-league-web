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
var DivisionType = require('../../lib/DivisionType');
var Status = require('../../lib/Status');
var TeamMatch = require('../../lib/TeamMatch');
var Result = require('../../lib/Result');

var divisions = [], teams  = [] , seasons = [] , users = [], stats = {};
var teamMatches = [];
var teamStats = {}, results = [];

var _authUserId = 0;

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
        for (var i = 0; i < seasons.length; i++) {
            if (seasons[i].id == id) {
                return seasons[i];
            }
        }

    },
    _findDivision: function(id){
        for (var i = 0; i < divisions.length; i++) {
            if (divisions[i].id == id) {
                return divisions[i];
            }
        }

    },
     _findUser: function(id){
        for (var i = 0; i < users.length; i++) {
            if (users[i].id == id) {
                return users[i];
            }
        }

    },
     _findTeam: function(id){
        for (var i = 0; i < teams.length; i++) {
            if (teams[i].id == id) {
                return teams[i];
            }
        }

    },
    processData: function(d) {
        var k;
        for (k in d.divisions) {
            divisions.push(new Division(k,d.divisions[k].type));
        }
        for (var id in d.seasons) {
            var division = DataStore._findDivision(d.seasons[id].division);
            var season = d.seasons[id];
            seasons.push(new Season(season.id,season.name,season.startDate,season.endDate,season.status,division));
        }

        d.teams.forEach(function(t) {
            var team = new Team(t.teamId, t.name);
            for (var sid in t.seasons) {
                var season = DataStore._findSeason(sid);
                team.addSeason(season);
            }
            teams.push(team);
        });

        d.users.forEach(function(u){
            var user = new User(u.userId,u.firstName,u.lastName,u.challenges);
            for (var i in u.seasons) {
                user.addSeason(DataStore._findSeason(u.seasons[i]));
            }
            for (var i in u.teams) {
                user.addTeam(DataStore._findTeam(u.teams[i]));
            }
            users.push(user);
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

        for(var id in d.userStats) {
            var user = DataStore._findUser(id);
            if (user == undefined) {
                console.warn('Could not find user: ' + id);
                continue;
            }
            var stats = d.userStats[id];
            for (var type in stats) {
                if (type == 'all') {
                    if (stats[type] == undefined || stats[type] == null){
                        console.warn('Could not find all stats for '+ id);
                        continue;
                    }
                    user.addStats(new Stat(type, stats[type]), null);
                } else if (type == 'season') {
                    stats[type].forEach(function(s){
                        user.addStats(new Stat(type, s, DataStore._findSeason(s.seasonId)));
                    });

                } else if (type == 'division') {
                    stats[type].forEach(function(s){
                        user.addStats(new Stat(type, s,DataStore._findDivision(s.divisionId)));
                    });
                } else {
                    if (stats[type] == undefined || stats[type] == null){
                        console.warn('Could not find stats for '+ id);
                        continue;
                    }
                    user.addStats(new Stat(type,stats[type],null));
                }
            }
        }

        for(var id in d.teamStats) {
            var season = DataStore._findSeason(id);
            d.teamStats[id].forEach(function(s) {
                  teams.forEach(function(t){
                      if (t.id == s.teamId) {
                          t.addStats(id,new Stat('team',s,season));
                      }
                  });
              });
        }

        d.teamResults.forEach(function(r) {
            var season = DataStore._findSeason(r.seasonId);
            var tm = new TeamMatch(r.teamMatchId,r.resultId,r.matchDate,season);
            teams.forEach(function(t) {
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

            teamMatches.push(tm);
        });

        d.userResults.forEach(function(r){
            var winner = null;
            var loser = null;
            users.forEach(function(u){
                if (r.winner == u.id ) {
                    winner = u;
                }
                if (r.loser == u.id ) {
                    loser = u;
                }
             });
            teamMatches.forEach(function(tm){
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
                   results.push(result);
               }
            });
        });
        users.push(User.DEFAULT_USER);

        console.log('Created ' + divisions.length + ' divisions');
        console.log('Created ' + seasons.length + ' seasons');
        console.log('Created ' + teams.length + ' teams');
        console.log('Created ' + users.length + ' users');
        console.log('Created ' + teamMatches.length + ' teamMatches');
        console.log('Created ' + results.length + ' userResults');
    },
    init: function() {
        //TODO Split this up and send events for different data types
        console.log('Checking login stats');
        Util.getData('/api/user', function(d) {
            _authUserId = d.userId;
            //DataStore.emitChange();
        }.bind(this));
        /*
        Util.getData('/api/users', function(d) {
            users = d;
            DataStore.emitChange();
        }.bind(this));
        Util.getData('/api/divisions', function(d) {
            divisions = d;
            DataStore.emitChange();
        }.bind(this));
        Util.getData('/api/teams', function(d) {
            teams = d;
            DataStore.emitChange();
        }.bind(this));
        Util.getData('/api/seasons/current', function(d) {
            for(var id in d) {
                //console.log('Adding seasonId: ' + id);
                seasons[id] = d[id];
            }
            DataStore.emitChange();
        }.bind(this));

        Util.getData('/api/results/current', function(d) {
            results = d;
            DataStore.emitChange();
        }.bind(this));

        Util.getData('/api/stats/user', function(d) {
            for(var id in d) {
              //  console.log('Adding stats resultId: ' + id);
                stats[id] = d[id];
            }
            DataStore.emitChange();
        }.bind(this));


        Util.getData('/api/stats/team', function(d) {
            for(var id in d) {
                //console.log('Adding team stats resultId: ' + id);
                teamStats[id] = d[id];
            }
            DataStore.emitChange();
        }.bind(this));



        Util.getData('/api/seasons/past', function(d) {
            for(var id in d) {
            //    console.log('Adding past season id: ' + id);
                seasons[id] = d[id];
            }
           // DataStore.emitChange();
        }.bind(this));
         */

        Util.getData('/api/data', function(d) {
            console.log('Got me some data');
            this.processData(d);
            DataStore.emitChange();
        }.bind(this));

    },
    getDivisions: function() { return divisions;},
    getTeams: function() { return teams;},
    getSeasons: function () { return seasons;},
    getUsers: function() { return users;},
    getStats: function() {return stats},
    getResults: function() {return results;},
    getTeamMatches: function() {return teamMatches;},

    setUser: function(u) {
        _authUserId = u.userId;
    },
    getAuthUserId: function() {
        return _authUserId;
    },
    checkLogin: function() {
        console.log('Checking login stats');
        Util.getData('/api/user', function(d) {
            _authUserId = d.userId;
            DataStore.emitChange();
        }.bind(this));
    },
    challengeSignUp: function(id) {
        console.log('Signing up ' + id);
         Util.getData('/api/challenge/signup/' + id, function(d) {
            users[d.userId] = d;
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
             DataStore.checkLogin();
             break;
         case 'CHALLENGE_SIGN_UP':
             DataStore.challengeSignUp(action.id);
             break;
         default:
            //console.log('Unknown Action ' + JSON.stringify(action));
     }


});

module.exports = DataStore;
