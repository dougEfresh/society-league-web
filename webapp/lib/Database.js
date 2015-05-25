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

Database.data = resetData();
Database.loading = false;
Database.loaded = false;

Database.findSlot =  function (id) {
    for (var i = 0; i < Database.data.slots.length; i++) {
        if (Database.data.slots[i].id == id) {
            return Database.data.slots[i];
        }
    }
    return undefined;
};

Database.findSeason =  function (id) {
    for (var i = 0; i < Database.data.seasons.length; i++) {
        if (Database.data.seasons[i].id == id) {
            return Database.data.seasons[i];
        }
    }
    return undefined;
};
Database.findDivision = function (id) {
    for (var i = 0; i < Database.data.divisions.length; i++) {
        if (Database.data.divisions[i].id == id) {
            return Database.data.divisions[i];
        }
    }
    return undefined;
};

Database.findUser = function (id) {
    for (var i = 0; i < Database.data.users.length; i++) {
        if (Database.data.users[i].id == id) {
            return Database.data.users[i];
        }
    }
    return undefined;
};

Database.findTeam = function (id) {
    for (var i = 0; i < Database.data.teams.length; i++) {
        if (Database.data.teams[i].id == id) {
            return Database.data.teams[i];
        }
    }
    return undefined;
};

Database.processUser = function(user,data) {
    user.reset();
        var i;
        for (i = 0; i < Database.data.seasons.length; i++) {
            user.addSeason(Database.findSeason(Database.data.seasons[i]));
        }
        for (i = 0; i < Database.data.teams.length; i++) {
            user.addTeam(Database.findTeam(Database.data.teams[i]));
        }
        for (var type in Database.data.challenges) {
            var cg = Database.data.challenges[type];
            if (cg.length == 0) {
                continue;
            }

            cg.forEach(function (group) {
                var ch = Database.findUser(group.challenger);
                var op = Database.findUser(group.opponent);
                var challengeGroup = null;
                challengeGroup = new ChallengeGroup(ch, op, group.date, type, null, 0);
                if (group.games.length == 1) {
                    challengeGroup.selectedGame = group.games[0];
                }
                if (group.slots.length == 1) {
                    challengeGroup.selectedSlot = group.slots[0];
                }
                group.games.forEach(function (g) {
                    challengeGroup.addGame(g);
                });
                group.slots.forEach(function (s) {
                    challengeGroup.addSlot(Database.findSlot(s.id));
                });
                group.challenges.forEach(function (c) {
                    var challenge = new Challenge(c.id, ch, op, c.slot.id, c.game, c.status);
                    challengeGroup.addChallenge(challenge);
                });
                user.addChallenge(type, challengeGroup);
            });
        }
};

Database.processData = function (d) {
    var id;
    for (id in d.divisions) {
        Database.data.divisions.push(new Division(id, d.divisions[id].type));
    }
    for (id in d.seasons) {
        var division = Database.findDivision(d.seasons[id].division);
        var season = d.seasons[id];
        Database.data.seasons.push(new Season(season.id, season.name, season.startDate, season.endDate, season.status, division));
    }

    d.teams.forEach(function (t) {
        var team = new Team(t.teamId, t.name);
        for (var sid in t.seasons) {
            var season = Database.findSeason(sid);
            team.addSeason(season);
        }
        Database.data.teams.push(team);
    });

    d.users.forEach(function (u) {
        var user = new User(u.userId, u.firstName, u.lastName);
        Database.processUser(user, u);
        Database.data.users.push(user);
    });

    d.teams.forEach(function (t) {
        var team = Database.findTeam(t.teamId);
        for (var sid in t.seasons) {
            for (var i = 0; i < t.seasons[sid].length; i++) {
                var u = Database.findUser(t.seasons[sid][i]);
                team.addTeamMember(sid, u);
            }
        }
    });

    for (id in d.userStats) {
        var user = Database.findUser(id);
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
                user.addStats(new Stat(type, stats[type]), null);
            } else if (type == 'season') {
                stats[type].forEach(function (s) {
                    user.addStats(new Stat(type, s, Database.findSeason(s.seasonId)));
                });

            } else if (type == 'division') {
                stats[type].forEach(function (s) {
                    user.addStats(new Stat(type, s, Database.findDivision(s.divisionId)));
                });
            } else if (type == 'handicapAll') {
                if (stats[type] != undefined && stats[type] != null) {
                    stats[type].forEach(function (s) {
                        user.addStats(new Stat(type, s, null));
                    });
                }
            } else {
                if (stats[type] == undefined || stats[type] == null) {
                    //console.warn('Could not find stats for '+ id);
                    continue;
                }
                user.addStats(new Stat(type, stats[type], null));
            }
        }
    }

    for (id in d.teamStats) {
        var season = Database.findSeason(id);
        d.teamStats[id].forEach(function (s) {
            Database.data.teams.forEach(function (t) {
                if (t.id == s.teamId) {
                    t.addStats(id, new Stat('team', s, season));
                }
            });
        });
    }

    d.teamResults.forEach(function (r) {
        var season = Database.findSeason(r.seasonId);
        var tm = new TeamMatch(r.teamMatchId, r.resultId, r.matchDate, season);
        Database.data.teams.forEach(function (t) {
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

        Database.data.teamMatches.push(tm);
    });

    d.userResults.forEach(function (r) {
        var winner = null;
        var loser = null;
        Database.data.users.forEach(function (u) {
            if (r.winner == u.id) {
                winner = u;
            }
            if (r.loser == u.id) {
                loser = u;
            }
        });
        Database.data.teamMatches.forEach(function (tm) {
            if (tm.teamMatchId == r.teamMatchId) {
                var result = new Result(r.resultId, tm, winner, loser);
                result.setLoserHandicap(r.loserHandicap);
                result.setLoserRacks(r.loserRacks);
                result.setLoserHandicap(r.loserHandicap);
                result.setLosersTeam(Database.findTeam(r.loserTeam));

                result.setWinnerHandicap(r.winnerHandicap);
                result.setWinnerRacks(r.winnerRacks);
                result.setWinnerHandicap(r.winnerHandicap);
                result.setWinnersTeam(Database.findTeam(r.winnerTeam));
                ;

                winner.addResult(result);
                loser.addResult(result);
                Database.data.results.push(result);
            }
        });
    });
    d.slots.forEach(function (s) {
        Database.data.slots.push(new Slot(s.id, s.localDateTime, s.allocated));
    });

    d.users.forEach(function (u) {
        var user = Database.findUser(u.userId);
        Database.processUser(user, u);
    });

    Database.data.users.push(User.DEFAULT_USER);
    console.log('Created ' + Database.data.divisions.length + ' divisions');
    console.log('Created ' + Database.data.seasons.length + ' seasons');
    console.log('Created ' + Database.data.teams.length + ' teams');
    console.log('Created ' + Database.data.users.length + ' users');
    console.log('Created ' + Database.data.teamMatches.length + ' teamMatches');
    console.log('Created ' + Database.data.results.length + ' userResults');
    console.log('Created ' + Database.data.slots.length + ' slots');

    Database.loading  = false;
    Database.loaded = true;
};

Database.init = function(data) {
    Database.loading = true;
    Database.loaded = false;
    Database.data = resetData();
    Database.processData(data);
    //Database.loaded = true;
};

function Database() {
};

Database.getDivisions =  function () {
        return Database.data.divisions;
};
Database.getTeams = function () {
        return Database.data.teams;
};
Database.getSeasons= function () {
    return Database.data.seasons;
};
Database.getUsers= function () {
    return Database.data.users;
};
Database.getResults= function () {
    return Database.data.results;
};
Database.getTeamMatches= function () {
    return Database.data.teamMatches;
};
Database.getSlots= function () {
    return Database.data.slots;
};

Database.isLoading= function () {
    return Database.loading;
};
Database.isLoaded= function () {
    return Database.loaded;
};

Database.replaceUser= function (user) {
    for (var i = 0; i < Database.data.users.length; i++) {
        if (Database.data.users[i].id == user.userId) {
            Database.processUser(Database.data.users[i], user);
            return;
        }
    }
};


module.exports = Database;
