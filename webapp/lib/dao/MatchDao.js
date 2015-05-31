var Status = require('../Status');
var moment = require('moment');
var SlotDao = require('../SlotDao');

function MatchDao(db) {
    this.db = db;
}

MatchDao.prototype.db = function() {return this.db;};

MatchDao.prototype.getResults = function(user) {
    var matches = user.getResults().length == 0 ? this.db.getUser(user.userId).getResults() : user.getResults();
    return matches.sort(function(a,b){
            return b.getMatchDate().localeCompare(a.getMatchDate());
        });
};

MatchDao.prototype.getUpcomingChallenges = function(user) {
    if (!user.isChallenge()) {
        return [];
    }
    var slotDao = new SlotDao(this.db);
    var challenges = user.getChallenges(Status.ACCEPTED);
    var upComingMatches = [];
    var yesterday = moment().subtract(1,'day');
    challenges.forEach(function(c) {
        var day = moment(c.selectedSlot.date);
        if (day.isAfter(yesterday)) {
            upComingMatches.push(c);
        }
    });

    upComingMatches = upComingMatches.sort(function(a,b) {
            var aSlot = slotDao.getSlot(a.selectedSlot);
            var bSlot = slotDao.getSlot(b.selectedSlot);
            return bSlot.date.localeCompare(aSlot.date);
        });
    return upComingMatches;
};

module.exports = MatchDao;