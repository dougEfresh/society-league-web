var utils = require('utils');
var casper = require('casper').create();
var user = casper.cli.has("user") ? casper.cli.get("user") : "test";
var pass = casper.cli.has("password") ? casper.cli.get("password") : "12345";
var server = casper.cli.has("server") ? casper.cli.get("server") : "http://localhost:8080";
var page = casper.cli.has("page") ? casper.cli.get("page") : "/index.html#/app/home";
var wait = casper.cli.has("wait") ? casper.cli.get("wait") : "appReady";
///casper.echo("Casper CLI passed options:");
//require("utils").dump(casper.cli.options);

var width =  casper.cli.has("width") ? casper.cli.get("width") : 1028;
var height =  casper.cli.has("height") ? casper.cli.get("height") : 768;
var timeout = casper.cli.has("timeout") ? casper.cli.get("timeout") : 10000;
var login = '/index.html#/login';
//var cleaner = require('clean-html');
var fs = require('fs');

casper.options.viewportSize = {width:width, height: height};
var notReady = function() {
    this.capture('test.png');
    this.die(this.getHTML() + ' !!!!Page not ready!!!');
};

casper.start(server + login, function(){
    this.waitForSelector('#pageReady',function(){},notReady,timeout);
    this.fill('form#login',{username: 'dchimento@gmail.com',password:'password'},false);
    this.click('#submit');
    this.capture('login.png');
});

casper.then(function(){
    this.waitForSelector('#'+wait,function(){},notReady,timeout);
});

casper.then(function() {
    this.echo(this.getHTML());
});

casper.run();
