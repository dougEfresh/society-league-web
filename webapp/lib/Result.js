var Handicap = require('./Handicap');

function Result (resultId,teamMatch,winner,loser) {
    this.resultId = resultId;
    this.teamMatch = teamMatch;
    this.winner = winner;
    this.loser = loser;
    this.winnersTeam = null;
    this.losersTeam = null;
}

Result.prototype.winnerRacks = function () { return this.winnerRacks ; };
Result.prototype.loserRacks = function () { return this.loserRacks ; };
Result.prototype.winner = function () { return this.winner ; };
Result.prototype.loser = function () { return this.loser ; };
Result.prototype.getWinnerTeam = function () { return this.teamMatch.winner ; };
Result.prototype.winnerHandicap = function () { return this.winnerHandicap; };
Result.prototype.loserHandicap = function () { return this.loserHandicap ; };
Result.prototype.winnersTeam = function(){return this.winnersTeam;};
Result.prototype.losersTeam= function(){return this.losersTeam;};

Result.formatHandicap = function(hc) {
    switch(hc) {
        case 'TWO':
            return '2';
        case 'THREE':
            return '3';
        case 'FOUR':
            return '4';
        case 'FIVE':
            return '5';
        case 'SIX':
            return '6';
        case 'SEVEN':
            return '7';
        case 'EIGHT':
            return '8';
        case 'NINE':
            return '9';
        case 'OPEN':
            return 'O';
        case 'PRO':
            return 'P';
        default:
            return hc;
    }
};

Result.prototype.getWinnerHandicap = function () {
    return Result.formatHandicap(this.winnerHandicap.replace('PLUS','+'));
 };
Result.prototype.getLoserHandicap = function () {
    return Result.formatHandicap(this.loserHandicap.replace('PLUS','+'));
};

Result.prototype.getLoserTeam = function () { return this.teamMatch.loser; };
Result.prototype.teamMatch = function () { return this.teamMatch ; };
Result.prototype.matchDate = function () { return this.teamMatch.matchDate; };
Result.prototype.getMatchDate = function () { return this.teamMatch.matchDate; };
Result.prototype.getShortMatchDate = function () { return this.teamMatch.matchDate.substr(5,5).replace('-','/'); };
Result.prototype.getSeason = function () { return this.teamMatch.season; };

Result.prototype.setWinnerRacks = function (data) { this.winnerRacks = data ; };
Result.prototype.setWinnerHandicap = function (data) { this.winnerHandicap = data ; };
Result.prototype.setWinnersTeam = function (data) { this.winnersTeam = data ; };

Result.prototype.setLoserRacks = function (data) { this.loserRacks = data ; };
Result.prototype.setLoserHandicap = function (data) { this.loserHandicap = data ; };
Result.prototype.setLosersTeam = function (data) { this.losersTeam = data ; };

Result.prototype.isWinner = function(user) {
    if (user == undefined || user == null) {
        return undefined;
    }
    return this.winner.id == user.id;
};

Result.prototype.isSweep = function(user) {
    if (!this.isWinner(user)) {
        return false;
    }
    var race =  Handicap.race(this.winnerHandicap,this.loserHandicap);
    var givenRacks = 0;
    if (race) {
        givenRacks = race.split('/')[0];
        var lRacks = this.loserRacks - parseInt(givenRacks);
        return lRacks == 0;
    }
        return false;
};

Result.prototype.getHandicap = function(user) {
    if (user == undefined || user == null) {
        return undefined;
    }
    if (this.winner.id == user.id) {
        return this.getWinnerHandicap();
    }
    return this.getLoserHandicap();
};

Result.prototype.getOpponent = function(user) {
    if (user == undefined || user == null) {
        return undefined;
    }
    if (this.winner.id == user.id) {
        return this.loser;
    }
    return this.winner;
};

Result.prototype.getOpponentsTeam = function(user) {
    if (user == undefined || user == null) {
        return undefined;
    }
    if (this.winner.id == user.id) {
        return this.losersTeam;
    }
    return this.winnersTeam;
};

Result.prototype.getOpponentRacks = function(user) {
    if (user == undefined || user == null) {
        return undefined;
    }
    if (this.winner.id == user.id) {
        return this.loserRacks;
    }
    return this.winnerRacks;
};

Result.prototype.getOpponentHandicap = function(user) {
    if (user == undefined || user == null) {
        return undefined;
    }
    if (this.winner.id == user.id) {
        return this.getLoserHandicap();
    }
    return this.getWinnerHandicap();
};

Result.prototype.getHandicap = function(user) {
    if (user == undefined || user == null) {
        return undefined;
    }
    if (this.winner.id != user.id) {
        return this.getLoserHandicap();
    }
    return this.getWinnerHandicap();
};

Result.prototype.getRacks = function(user) {
    if (user == undefined || user == null) {
        return undefined;
    }
    if (this.winner.id == user.id) {
        return this.winnerRacks;
    }
    return this.loserRacks;
};
Result.prototype.getRacksTeamMember = function(team) {
    if (team == undefined || team == null) {
        return undefined;
    }
    if (this.winnersTeam.id == team.id) {
        return this.winnerRacks;
    }
    return this.loserRacks;
};

Result.prototype.getOpponentRacksTeamMember = function(team) {
    if (team == undefined || team == null) {
        return undefined;
    }
    if (this.winnersTeam.id == team.id) {
        return this.loserRacks;
    }
    return this.winnerRacks;
};

module.exports = Result;