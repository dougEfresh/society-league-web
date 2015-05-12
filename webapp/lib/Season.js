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

module.exports = Season;
