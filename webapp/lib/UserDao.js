//var unirest = require('unirest');
var User = require('./User');

function UserDao(db,sender,server) {
    this.sender = sender;
    this.db = db;
    this.server = server;
}
UserDao.prototype.sender = function() {return this.sender;};
UserDao.prototype.host = function() {return this.host;};
UserDao.prototype.db = function() {return this.db;};

UserDao.prototype.create = function (user) {

    console.log(JSON.stringify(user));
    /*
    unirest.post(this.server + '/api/user/create/0')
        .header('Content-type', 'application/json')
        .send(user)
        .end(function (response) {
            if (cb) {
                cb(User.create(response.body, db));
            } else {
                console.log(response.body);
            }
        });
        */
};

var createChallenge = function (user, db, cb) {
    var u = null;
    /*
    var userCb = function (user) {
        unirest.get('http://localhost:8081/api/challenge/signup/' + user.userId)
            .end(function (response) {
                u = User.create(response.body, db);
                if (cb) {
                    cb(u);
                }
            });
    };
    create(user, userCb, db);
    */
    return u;
};

module.exports = UserDao;