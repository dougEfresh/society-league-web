var user = casper.cli.has("user") ? casper.cli.get("user") : "test";
var pass = casper.cli.has("password") ? casper.cli.get("password") : "12345";
var server = casper.cli.has("server") ? casper.cli.get("server") : "http://localhost:8080";
var page = casper.cli.has("page") ? casper.cli.get("page") : "/index.html";
var wait = casper.cli.has("wait") ? casper.cli.get("wait") : "blah";

var width = 1028;
var height = 768;

var waitFor = function(casper,elementId,timeOut) {
    casper.waitForSelector(elementId,
        function () {
        },
        function () {
	    this.echo(this.getHTML());
            this.capture('/tmp/test.png');
            this.die('No element found ' + elementId);
        },
        timeOut
    );
};

module.exports = {wait: wait, page: page,user: user, pass: pass, server: server, width: width, height: height, waitFor: waitFor};
