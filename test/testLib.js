var user = casper.cli.has("user") ? casper.cli.get("user") : "dchimento@gmail.com";
var pass = casper.cli.has("password") ? casper.cli.get("password") : "12345";
var server = casper.cli.has("server") ? casper.cli.get("server") : "http://localhost:8080";
var page = casper.cli.has("page") ? casper.cli.get("page") : "/index.html#/app/home";
var wait = casper.cli.has("wait") ? casper.cli.get("wait") : "appReady";
var width =  casper.cli.has("width") ? casper.cli.get("width") : 1028;
var height =  casper.cli.has("height") ? casper.cli.get("height") : 768;
var timeout = casper.cli.has("timeout") ? casper.cli.get("timeout") : 10000;
casper.options.viewportSize = {width:width, height: height};
var authUser = null;
var Database = require('../webapp/lib/Database');
var db = new Database();
var UserDao = require('../webapp/lib/UserDao');
var User= require('../webapp/lib/User');

var notReady = function(id) {
    return function() {
        this.capture('test.png');
        this.die(this.getHTML() + ' !!!!Page not ready!!!\n' + id);
    };
};

var login = function (username,password) {
    casper.then(function () {
        this.fill('form#login', {
            'username': username,
            'password': password
        }, false);
    });
    casper.then(function () {
        this.click('#submit');
        this.waitForSelector('#app-ready',function(){},testlib.notReady('app-ready'),testlib.timeout);
    });

};
var refreshUser = function() {
    casper.thenOpen(testlib.server + '/api/user', function () {
        var u  = JSON.parse(this.getPageContent());
        var users = testlib.db.getUsers();
        users.forEach(function(user){
            if (u.userId == user.userId) {
                testlib.authUser = user;
            }
        })
    });
};

var createUser = function() {
    var dao = new UserDao(testlib.db,this,testlib.server);
    var name = Math.random() * 1000;
    var user = new User(0,name,name);
    user.login = name + '@example.com';
    user.email = name + '@example.com';
    user.password = "password";
    //var newUser = dao.create(user);
    var newUser = casper.evaluate(function(wsurl,user) {
        return JSON.parse(__utils__.sendAJAX(wsurl, 'POST', JSON.stringify(user), false,{
            contentType: "application/json"
        }));
    }, {wsurl: testlib.server + '/api/user/create/0',user: user });
    newUser = db.processUser(null,newUser);
    newUser.login = user.login;
    newUser.password = user.password;
    return newUser;
};
var createChallengeUser = function() {
    var dao = new UserDao(testlib.db,this,testlib.server);
    var name = Math.random() * 1000;
    var user = new User(0,name,name);
    user.login = name + '@example.com';
    user.email = name + '@example.com';
    user.password = "password";
    //var newUser = dao.create(user);
    var newUser = casper.evaluate(function(wsurl,user) {
        return JSON.parse(__utils__.sendAJAX(wsurl, 'POST', JSON.stringify(user), false,{
            contentType: "application/json"
        }));
    }, {wsurl: testlib.server + '/api/user/create/0/challenge',user: user });
    newUser = db.processUser(null,newUser);
    newUser.login = user.login;
    newUser.password = user.password;
    return newUser;
};

var init = function() {
    if (authUser != null) {
        return ;
    }
    casper.thenOpen(testlib.server + '/api/data', function() {
        //this.echo(JSON.parse(this.getPageContent()).seasons.length);
        db.init(JSON.parse(this.getPageContent()));
    });

    casper.then(function(){
        if (!testlib.db.loaded) {
            this.die("No Db",1);
        }
    });
    casper.thenOpen(testlib.server + '/index.html#/login', function(){


    });
    casper.then(function(){
        console.log('Awaiting login page');
    });

    casper.then(function() {
        testlib.login(testlib.user,testlib.pass);
        console.log('login');
    });
    casper.thenOpen(testlib.server + '/api/user', function () {
        var u  = JSON.parse(this.getPageContent());
        var users = testlib.db.getUsers();
        users.forEach(function(user){
            if (u.userId == user.userId) {
                testlib.authUser = user;
            }
        })
    });
    casper.then(function () {
        if (testlib.authUser == null) {
            this.die('No User',2);
        }
    });
};

var exists = function(test,id) {
    if (!casper.exists(id)) {
        casper.echo(casper.getHTML());
    }
    test.assertExists(id)

} ;

module.exports = {notReady: notReady,
    user: user,
    pass:pass,
    server:server,
    width:width,
    height: height,
    timeout: timeout,
    login: login,
    authUser: authUser,
    db:db,
    init: init,
    refreshUser: refreshUser,
    exists: exists,
    createUser: createUser,
    createChallengeUser: createChallengeUser
};