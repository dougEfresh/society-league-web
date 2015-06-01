var Status = require('./Status');
var DivisionType = require('./DivisionType');

function Season(id,name,startDate,endDate,status,division) {
    this.id = id;
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
    this.status = status;
    this.division = division;
}

Season.prototype.id = function () { return this.id ; };
Season.prototype.seasonId = function () { return this.id ; };
Season.prototype.name = function () { return this.name ; };
Season.prototype.startDate = function () { return this.startDate ; };
Season.prototype.endDate = function () { return this.endDate ; };
Season.prototype.status = function () { return this.status ; };
Season.prototype.division = function () { return this.division ; };
Season.prototype.isChallenge = function() {return this.division.isChallenge() };
Season.prototype.isActive = function() {return this.status == Status.ACTIVE };
Season.prototype.isNine = function() {
    return this.division.isNine();
};

Season.prototype.getDisplayName = function () {
    if (this.isChallenge()) {
        return "9 & 8 Challenge"
    }
    var name = this.name.split(',');
    return name[0].replace('20',"'") + ' ' +  name[1] + ' ' + name[2];
};

module.exports = Season;
