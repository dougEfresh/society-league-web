function Result (resultId,teamMatch,winner,loser) {
    this.resultId = resultId;
    this.teamMatch = teamMatch;
    this.winner = winner;
    this.loser = loser;
}

Result.prototype.winnerRacks = function () { return this.winnerRacks ; };
Result.prototype.loserRacks = function () { return this.loserRacks ; };
Result.prototype.winner = function () { return this.winner ; };
Result.prototype.loser = function () { return this.loser ; };
Result.prototype.winnerTeam = function () { return this.winnerTeam ; };
Result.prototype.winnerHandicap = function () { return this.winnerHandicap ; };
Result.prototype.loserHandicap = function () { return this.loserHandicap ; };
Result.prototype.loserTeam = function () { return this.loserTeam ; };
Result.prototype.teamMatch = function () { return this.teamMatch ; };
Result.prototype.getMatchDate = function () { return this.teamMatch.matchDate(); };
Result.prototype.gerSeason = function () { return this.teamMatch.season; };

Result.prototype.setWinnerRacks = function (data) { this.winnerRacks = data ; };
Result.prototype.setWinnerTeam = function (data) { this.winnerTeam = data ; };
Result.prototype.setWinnerHandicap = function (data) { this.winnerHandicap = data ; };
Result.prototype.setLoserRacks = function (data) { this.loserRacks = data ; };
Result.prototype.setLoserHandicap = function (data) { this.loserHandicap = data ; };
Result.prototype.setLoserTeam = function (data) { this.loserTeam = data ; };

Result.prototype.isWinner = function(user) {
    return this.winner.id == user.id;
};

Result.prototype.getOpponent = function(user) {
    if (this.winner.id == user.id) {
        return this.loser;
    }
    return this.winner;
};

Result.prototype.getOpponentRacks = function(user) {
    if (this.winner.id == user.id) {
        return this.loserRacks;
    }
    return this.winnerRacks;
};

Result.prototype.getOpponentHandicap = function(user) {
    if (this.winner.id == user.id) {
        return this.winnerHandicap;
    }
    return this.loserHandicap;
};

Result.prototype.getRacks = function(user) {
    if (this.winner.id == user.id) {
        return this.winnerRacks;
    }
    return this.loserRacks;
};


module.exports = Result;