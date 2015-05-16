var DivisionType = require('./DivisionType');

function ChallengeGroup(challenger,opponent,date,type,selectedGame,selectedSlot) {
    this.challenger = challenger;
    this.opponent = opponent;
    this.date = date;
    this.challenges = [];
    this.slots = [];
    this.games = [];
    this.type = type;
    this.selectedGame = selectedGame;
    this.selectedSlot = selectedSlot;
};

ChallengeGroup.prototype.challenger = function() {return this.challenger;};
ChallengeGroup.prototype.opponent = function() {return this.opponent;};
ChallengeGroup.prototype.date = function() {return this.date;};
ChallengeGroup.prototype.type = function() {return this.type;};
ChallengeGroup.prototype.slots = function() {return this.slots;};
ChallengeGroup.prototype.games = function() {return this.games;};
ChallengeGroup.prototype.games = function() {return this.games;};
ChallengeGroup.prototype.selectedGame = function() {return this.selectedGame;};
ChallengeGroup.prototype.selectedSlot = function() {return this.selectedSlot;};
ChallengeGroup.prototype.challenges = function() {return this.challenges;};

ChallengeGroup.prototype.addSlot = function(slot) {
    if (slot == undefined || slot == null) {
        return;
    }
    this.slots.push(slot);
};

ChallengeGroup.prototype.addGame = function(game) {
    if (game == undefined || game == null) {
        return;
    }
    this.games.push(game);
};

ChallengeGroup.prototype.addChallenge = function(challenge) {
    if (challenge == undefined || challenge == null ) {
        return;
    }
    this.challenges.push(challenge);
};

module.exports = ChallengeGroup;
