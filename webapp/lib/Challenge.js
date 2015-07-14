function Challenge(id,challenge,opponent,slot,game,status) {
    this.id = id;
    this.challenge = challenge;
    this.challenger = challenge;
    this.opponent = opponent;
    this.slot = slot;
    this.game = game;
    this.status = status;
    this.teamMatch = undefined;
}

Challenge.prototype.id = function()  { return this.id; };
Challenge.prototype.challenge = function()  { return this.challenge; };
Challenge.prototype.challenger = function()  { return this.challenger; };
Challenge.prototype.opponent = function()  { return this.opponent; };
Challenge.prototype.slot = function()  { return this.slot; };
Challenge.prototype.game = function()  { return this.game; };
Challenge.prototype.status = function()  { return this.status; };
Challenge.prototype.getDate = function()  { return this.slot.getDate(); };
Challenge.prototype.teamMatch = function()  { return this.teamMatch; };
Challenge.prototype.setTeamMatch = function(tm)  { this.teamMatch = tm; };

Challenge.prototype.getOpponent = function(user)  {
    if (this.challenge.id == user.id) {
        return this.challenge;
    }
    return this.opponent;
};

module.exports = Challenge;