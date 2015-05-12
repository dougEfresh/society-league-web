var AppDispatcher = require('../dispatcher/AppDispatcher.jsx');
var EventEmitter = require('events').EventEmitter;
var UserConstants = require('../constants/UserConstants.jsx');
var assign = require('object-assign');
var CHANGE_EVENT = 'change';
var Util = require('../util.jsx');
var _ = require('lodash');
var Season = require('../../lib/Season.js');
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
    processData: function(d) {
        var k;
        for (k in d.divisions) {
            divisions.push(new Division(k,d.divisions[k].type));
        }
        _.map(d.seasons,function(season) {
            var divObj = _.find(divisions,
                function(el) { return el.id == season.division;}
            );
            seasons.push(new Season(season.id,season.name,season.startDate,season.endDate,season.status,divObj));
        });
        d.teams.forEach(function(t) {
            var team = new Team(t.teamId, t.name);
            for (var sid in t.seasons) {
                team.addSeason(_.find(seasons, function (sea) {
                            return sea.id == sid
                        })
                );
            }
            teams.push(team);
        });

	d.users.forEach(function(u){
            var user = new User(u.userId,u.firstName,u.lastName,u.challenges);
            for (var i in u.seasons) {
                user.addSeason(_.find(seasons, function (sea) {
                    return sea.id == u.seasons[i]
                }));
            }
            for (var i in u.teams) {
		teams.forEach(function(t) {
		    if (t.id == u.teams[i]) {
			user.addTeam(t);
		    }
		});
            }
            users.push(user);
        });

        for(var id in d.stats) {
            users.forEach(function(u) {
                if (id == u.id) {
                    u.setStats(d.stats[id]);
                }
            });
        }

        for(var id in d.teamStats) {
              d.teamStats[id].forEach(function(s) {
                  teams.forEach(function(t){
                      if (t.id == s.teamId) {
                          t.addStats(id,s);
                      }
                  });
              });
        }

        d.teamResults.forEach(function(r) {
            var season = _.find(seasons,function(s){
                return s.id == r.seasonId;
            });
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
                   result.setLoserTeam(tm.loser);
                   result.setLoserHandicap(r.loserHandicap);

                   result.setWinnerHandicap(r.winnerHandicap);
                   result.setWinnerRacks(r.winnerRacks);
                   result.setWinnerTeam(tm.winner);
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
    getTeamStats: function() {return teamStats},
    getStats: function() {return stats},
    getResults: function() {return results;},
    getTeam: function(id) {
        return teams[id];
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
