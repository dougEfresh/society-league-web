
var Handicap = require('./Handicap');
var sortFn = function(column,data){

  if (column.name == 'result') {
            data.sort(function(a,b){
                if (a.result == b.result) {
                    return a.opponent.name.localeCompare(b.opponent.name)
                }
                if (column.sort == 'asc') {
                    return a.result.localeCompare(b.result);
                } else {
                    return b.result.localeCompare(a.result);
                }
            })
      return;
        }

    if (column.name == 'date') {
        data.sort(function(a,b){
            if (a.teamMatch.matchDate == b.teamMatch.matchDate) {
                return a.opponent.name.localeCompare(b.opponent.name)
            }
            if (column.sort == 'asc') {
                    return a.teamMatch.matchDate.localeCompare(b.teamMatch.matchDate);
            } else {
                return b.teamMatch.matchDate.localeCompare(a.teamMatch.matchDate);
            }
        })
        return ;
    }

    if (column.name == 'opponent') {
        data.sort(function (a, b) {
            if (a.opponent.name == b.opponent.name) {
                return a.result.localeCompare(b.results)
            }
            if (column.sort == 'asc') {
                return a.opponent.name.localeCompare(b.opponent.name);
            } else {
                return b.opponent.name.localeCompare(a.opponent.name);
            }
        });
        return ;
    }

    if (column.name == 'opponentHandicap') {
        data.sort(function(a,b) {
            if (column.sort == 'asc') {
                if (a.opponentHandicap == b.opponentHandicap) {
                    return a.opponent.name.localeCompare(b.opponent.name);
                }
                if (!a.season.nine && !a.season.challenge) {
                    return a.opponentHandicap.localeCompare(b.opponentHandicap);
                }

                var a1 = -1;
                var b1 = -1;
                //TODO Optimize
                for (var i = 0; i < Handicap.handicapOrder.length; i++) {
                    var h = Handicap.handicapOrder[i];
                    if (a.opponentHandicap == h) {
                        a1 = i;
                    }
                    if (b.opponentHandicap == h) {
                        b1 = i;
                    }
                    if (a1 >= 0 && b1 >= 0) {
                        return a1 > b1 ? 1 : -1;
                    }
                }
            } else {
                if (a.opponentHandicap == b.opponentHandicap) {
                    return a.opponent.name.localeCompare(b.opponent.name);
                }
                if (!a.season.nine && !a.season.challenge) {
                    return b.opponentHandicap.localeCompare(a.opponentHandicap);
                }
                var a1 = -1;
                var b1 = -1;
                //TODO Optimize
                for (var i = 0; i < Handicap.handicapOrder.length; i++) {
                    var h = Handicap.handicapOrder[i];
                    if (a.opponentHandicap == h) {
                        a1 = i;
                    }
                    if (b.opponentHandicap == h) {
                        b1 = i;
                    }
                    if (a1 >= 0 && b1 >= 0) {
                        return b1 > a1 ? 1 : -1;
                    }
                }
            }
        });
        return ;
    }

    data.sort(function(a,b) {
            if (column.name == 'player') {
                if (column.sort == 'asc') {
                    return a.user.name.localeCompare(b.user.name);
                }
                return b.user.name.localeCompare(a.user.name);
            }

            if (column.name == 'rank') {
                if (column.sort == 'asc') {
                    return a.rank > b.rank ? 1 : -1;
                }
                return b.rank > a.rank ? 1 : -1;
            }

             if (column.name == 'handicap') {

                if (column.sort == 'asc') {
                    if (a.handicap == b.handicap) {
                        return a.user.name.localeCompare(b.user.name);
                    }
                    if (!a.season.nine && !a.season.challenge) {
                        return a.handicap.localeCompare(b.handicap);
                    }

                    var a1 = -1;
                    var b1 = -1;
                    //TODO Optimize
                    for(var i = 0 ; i < Handicap.handicapOrder.length ; i++) {
                        var h = Handicap.handicapOrder[i];
                        if (a.handicap == h) {
                            a1 = i;
                        }
                        if (b.handicap == h) {
                            b1 = i;
                        }
                        if (a1 >=0 && b1 >=0) {
                            return a1 > b1 ? 1 : -1;
                        }
                    }
                } else {
                    if (a.handicap == b.handicap) {
                        return a.user.name.localeCompare(b.user.name);
                    }
                     if (!a.season.nine && !a.season.challenge) {
                        return b.handicap.localeCompare(a.handicap);
                    }
                    var a1 = -1;
                    var b1 = -1;
                    //TODO Optimize
                    for(var i = 0 ; i < Handicap.handicapOrder.length ; i++) {
                        var h = Handicap.handicapOrder[i];
                        if (a.handicap == h) {
                            a1 = i;
                        }
                        if (b.handicap == h) {
                            b1 = i;
                        }
                        if (a1 >=0 && b1 >=0) {
                            return b1 > a1  ? 1 : -1;
                        }
                    }
                }
            }

            if (column.name == 'team') {
                if (column.sort == 'asc') {
                    if (a.team.name == b.team.name){
                        return a.user.name.localeCompare(b.user.name);
                    }
                    return a.team.name.localeCompare(b.team.name);
                }
                if (a.team.name == b.team.name){
                    return a.user.name.localeCompare(b.user.name);
                }
                return b.team.name.localeCompare(a.team.name);
            }
            if (column.name == 'wins') {
                if (a.wins == b.wins){
                    return a.user.name.localeCompare(b.user.name);
                }
                if (column.sort == 'asc') {
                    return a.wins > b.wins ? 1 : -1;
                }

                return  b.wins > a.wins ? 1 : -1 ;
            }

            if (column.name == 'loses') {
                if (a.loses == b.loses){
                    return a.user.name.localeCompare(b.user.name);
                }
                if (column.sort == 'asc') {
                    return a.loses > b.loses ? 1 : -1;
                }
                return  b.loses > a.loses ? 1 : -1 ;
            }

            if (column.name == 'racksWon') {
                if (a.racksWon == b.racksWon) {
                    return a.user.name.localeCompare(b.user.name);
                }
                if (column.sort == 'asc') {
                    return a.racksWon > b.racksWon ? 1 : -1;
                }
                return  b.racksWon > a.racksWon ? 1 : -1 ;
            }
            if (column.name == 'racksLost') {
                if (a.racksLost == b.racksLost) {
                    return a.user.name.localeCompare(b.user.name);
                }
                if (column.sort == 'asc') {
                    return a.racksLost > b.racksLost ? 1 : -1;
                }
                return  b.racksLost > a.racksLost ? 1 : -1 ;
            }

        });

};

module.exports = {sortFn : sortFn};