var user = casper.cli.has("user") ? casper.cli.get("user") : "test";
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

var notReady = function() {
  this.capture('test.png');
  this.die(this.getHTML() + ' !!!!Page not ready!!!');
};

var shim =  function() {


var Ap = Array.prototype;
var slice = Ap.slice;
var Fp = Function.prototype;

if (!Fp.bind) {
  // PhantomJS doesn't support Function.prototype.bind natively, so
  // polyfill it whenever this module is required.
  Fp.bind = function(context) {
    var func = this;
    var args = slice.call(arguments, 1);

    function bound() {
      var invokedAsConstructor = func.prototype && (this instanceof func);
      return func.apply(
        // Ignore the context parameter when invoking the bound function
        // as a constructor. Note that this includes not only constructor
        // invocations using the new keyword but also calls to base class
        // constructors such as BaseClass.call(this, ...) or super(...).
        !invokedAsConstructor && context || this,
        args.concat(slice.call(arguments))
      );
    }

    // The bound function must share the .prototype of the unbound
    // function so that any object created by one constructor will count
    // as an instance of both constructors.
    bound.prototype = func.prototype;

    return bound;
  };
}

};
//casper.on('page.initialized', shim);

var login;
login = function () {
    casper.then(function () {
        this.fill('form#login', {
            'username': 'dchimento@gmail.com',
            'password': 'password'
        }, false);
    });
    casper.then(function () {
        this.click('#submit');
        this.waitForSelector('#app-ready', function () {
        }, testlib.notReady, testlib.timeout);
    });

};

var init = function() {
    casper.thenOpen(testlib.server + '/api/data', function() {
        //this.echo(JSON.parse(this.getPageContent()).seasons.length);
        db.init(JSON.parse(this.getPageContent()));
    });

    casper.then(function(){
        if (!testlib.db.loaded) {
            this.die("No Db",1);
        }
    });
    casper.thenOpen(testlib.server + '/index.html', function(){
        this.waitForSelector('#loginApp',function(){},testlib.notReady,testlib.timeout);
    });
    casper.then(function() {
        testlib.login();
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
    init: init
};