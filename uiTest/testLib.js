var user = casper.cli.has("user") ? casper.cli.get("user") : "test";
var pass = casper.cli.has("password") ? casper.cli.get("password") : "12345";
var server = casper.cli.has("server") ? casper.cli.get("server") : "http://localhost:8080";
var page = casper.cli.has("page") ? casper.cli.get("page") : "/index.html#/app/home";
var wait = casper.cli.has("wait") ? casper.cli.get("wait") : "appReady";
var width =  casper.cli.has("width") ? casper.cli.get("width") : 1028;
var height =  casper.cli.has("height") ? casper.cli.get("height") : 768;
var timeout = casper.cli.has("timeout") ? casper.cli.get("timeout") : 10000;
casper.options.viewportSize = {width:width, height: height};

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

var login = function() {
    casper.then(function(){
        this.fill('form#login', {
            'username': 'dchimento@gmail.com',
            'password': 'password'
        }, false);
    });
    casper.then(function(){
        this.click('#submit');
        this.waitForSelector('#appReady',function(){},testlib.notReady,testlib.timeout);
    });
};

module.exports = {notReady: notReady, user: user,pass:pass,server:server,width:width, height: height, timeout: timeout, login: login};