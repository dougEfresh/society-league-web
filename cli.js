#!/usr/bin/env node 

var request = require('request');
var fs = require('fs');
//var process = require('process');
var args = require('commander');
//Default server
var server = 'localhost';
var port = 8080;

args.version('0.0.1')
  .option('-r, --refresh', 'Refresh Datastore')
  .option('-s, --server', 'Refresh Datastore')
  .option('-p, --port', 'Refresh Datastore')
  .parse(process.argv);

if (args.server) {
    server = args.server;
}
if (args.refresh) {
    console.log('Refresh');
    fs.mkdirSync(process.env['HOME'] + '/.svb');
    fs.mkdirSync(process.env['HOME'] + '/.svb/' + server);
    request('http://' + server + ':' + port + '/api/data');
}


