var request = require('request');

var login = function(server,user,password,cb) {
    request.post({ url: server + '/api/authenticate', form: {username:user,password:password}},cb);
};

module.exports = login;