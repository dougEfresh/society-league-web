function MatchPoints (resultId,points,weigthedAvg,matchNum,calculation) {
    this.resultId = resultId;
    this.points = points;
    this.weightedAvg = weigthedAvg;
    this.matchNum = matchNum;
    this.calculation = calculation;
}

MatchPoints.prototype.resultId = function() {return this.resultId};
MatchPoints.prototype.points = function() {return this.points};
MatchPoints.prototype.weightedAvg = function() {return this.weightedAvg};
MatchPoints.prototype.matchNum = function() {return this.matchNum};
MatchPoints.prototype.calculation = function() {return this.calculation};

module.exports = MatchPoints;