
function TeamMatch(teamMatchId,resultId,matchDate,season) {
    this.teamMatchId = teamMatchId;
    this.id = teamMatchId;
    this.resultId = resultId;
    this.matchDate = matchDate;
    this.season = season;
}

TeamMatch.prototype.id = function() {return this.id; };
TeamMatch.prototype.season = function() {return this.season; };
TeamMatch.prototype.getSeason = function() {return this.season; };
TeamMatch.prototype.winnerRacks = function() {return this.winnerRacks; };
TeamMatch.prototype.loserRacks = function() {return this.loserRacks; };
TeamMatch.prototype.resultId = function() {return this.resultId; };
TeamMatch.prototype.teamMatchId = function() {return this.teamMatchId; };
TeamMatch.prototype.loserSetWins = function() {return this.loserSetWins; };
TeamMatch.prototype.winnerSetWins = function() {return this.winnerSetWins; };
TeamMatch.prototype.loserSetLoses = function() {return this.loserSetLoses; };
TeamMatch.prototype.winnerSetLoses = function() {return this.winnerSetLoses; };
TeamMatch.prototype.winner = function() {return this.winner; };
TeamMatch.prototype.loser = function() {return this.loser; };
TeamMatch.prototype.getWinner = function() {return this.winner; };
TeamMatch.prototype.getLoser = function() {return this.loser; };
TeamMatch.prototype.matchDate = function() {return this.matchDate; };
TeamMatch.prototype.teamMatchId = function() {return this.teamMatchId; };
TeamMatch.prototype.isChallenge = function() {return this.season.isChallenge(); };


TeamMatch.prototype.setWinnerRacks = function(data) { this.winnerRacks = data; };
TeamMatch.prototype.setLoserRacks = function(data) { this.loserRacks = data; };
TeamMatch.prototype.setResultId = function(data) { this.resultId = data; };
TeamMatch.prototype.setTeamMatchId = function(data) { this.teamMatchId = data; };
TeamMatch.prototype.setLoserSetWins = function(data) { this.loserSetWins = data; };
TeamMatch.prototype.setWinnerSetWins = function(data) { this.winnerSetWins = data; };
TeamMatch.prototype.setLoserSetLoses = function(data) { this.loserSetLoses = data; };
TeamMatch.prototype.setWinnerSetLoses = function(data) { this.winnerSetLoses = data; };
TeamMatch.prototype.setWinner = function(data) { this.winner = data; };
TeamMatch.prototype.setLoser = function(data) { this.loser = data; };
TeamMatch.prototype.setMatchDate = function(data) { this.matchDate = data; };

TeamMatch.prototype.getShortMatchDate = function() { return this.matchDate.substr(5,5).replace('-','/'); };

TeamMatch.prototype.isWinner = function(team) {
    if (this.winnerRacks + this.loserRacks == 0) {
        return false;
    }
    return this.winnerRacks > this.loserRacks && this.winner.id == team.id;
};

TeamMatch.prototype.getRacks = function(team) {
    if (this.winner.id == team.id) {
        return this.winnerRacks;
    }
    return this.loserRacks;
};

TeamMatch.prototype.getOpponentRacks = function(team) {
    if (this.winner.id == team.id) {
        return this.loserRacks;
    }
    return this.winnerRacks;
};
TeamMatch.prototype.getOpponent = function(team) {
    if (this.winner.id == team.id) {
        return this.loser;
    }
    return this.winner;
};


module.exports = TeamMatch;