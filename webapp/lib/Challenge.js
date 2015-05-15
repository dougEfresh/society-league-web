function Challenge(id,challenge,opponent,slotId,game,status) {
    this.id = id;
    this.challenge = challenge;
    this.opponent = opponent;
    this.slotId = slotId;
    this.game = game;
    this.status = status;
}

Challenge.prototype.id = function()  { return this.id; };
Challenge.prototype.challenge = function()  { return this.challenge; };
Challenge.prototype.opponent = function()  { return this.opponent; };
Challenge.prototype.slotId = function()  { return this.slotId; };
Challenge.prototype.game = function()  { return this.game; };
Challenge.prototype.status = function()  { return this.status; };

module.exports = Challenge;