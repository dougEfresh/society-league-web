var DivisionType = require('./DivisionType');

function ChallengeGroup(challenger,opponent,date,type,selectedGame,selectedSlot) {
    this.challenge = challenger;
    this.opponent = opponent;
    this.date = date;
    this.challenges = [];
    this.slotIds = [];
    this.games = [];
    this.type = type;
    this.selectedGame = selectedGame;
    this.selectedSlot = selectedSlot;
};

ChallengeGroup.prototype.challenge = function() {return this.challenge;};
ChallengeGroup.prototype.opponent = function() {return this.opponent;};
ChallengeGroup.prototype.date = function() {return this.date;};
ChallengeGroup.prototype.type = function() {return this.type;};
ChallengeGroup.prototype.slotIds = function() {return this.slotIds;};
ChallengeGroup.prototype.games = function() {return this.games;};
ChallengeGroup.prototype.games = function() {return this.games;};
ChallengeGroup.prototype.selectedGame = function() {return this.selectedGame;};
ChallengeGroup.prototype.selectedSlot = function() {return this.selectedSlot;};
ChallengeGroup.prototype.challenges = function() {return this.challenges;};

ChallengeGroup.prototype.addSlotId = function(slot) {
    if (slot == undefined || slot == null) {
        return;
    }
    this.slotIds.push(slot);
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
