var DivisionType = require('./DivisionType');

function Division(id,type) {
    this.id = id;
    this.type = type;
}

Division.prototype.id = function() {
    return this.id;
};

Division.prototype.type = function() {
    return this.type;
};

Division.prototype.isChallenge = function() {
  return this.type == DivisionType.EIGHT_BALL_CHALLENGE || this.type == DivisionType.NINE_BALL_CHALLENGE;
};

Division.prototype.isNine = function() {
  return this.type == DivisionType.NINE_BALL_TUESDAYS || this.type == DivisionType.NINE_BALL_CHALLENGE;
};

module.exports = Division;
