var User = require('./User');

function UsersStat(user,stat) {
    this.user = user;
    this.stat = stat;
}

UsersStat.prototype.user = function() {return this.user;};
UsersStat.prototype.stat = function() {return this.stat;};

UsersStat.prototype.getCurrentHandicap = function(seasonId) {
    if (this.user instanceof User) {
        return this.user.getCurrentHandicap(seasonId);
    }
    return "";
};


module.exports =  UsersStat;