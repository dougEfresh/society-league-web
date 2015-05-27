function UserMatches(user,match) {
    this.user = user;
    this.match = match
}

UserMatches.prototype.user = function() {return this.user;};
UserMatches.prototype.match = function() {return this.match;};

module.exports = UserMatches;
