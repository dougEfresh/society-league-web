var utils = require('utils');
var testUtils = require('./lib/testUtils.js');

casper.options.viewportSize = {width: testUtils.width, height: testUtils.height};
casper.test.begin('Testing Page', function suite(test) {
        casper.start();
        casper.thenOpen(testUtils.server + testUtils.page);
        casper.then(function () {
            this.echo('Went to ' + testUtils.page);
            this.echo('Waiting for ' + testUtils.wait);
            testUtils.waitFor(casper,'#' + testUtils.wait,9000);
        });

        casper.then(function () {
            this.echo(this.getHTML());
        });

        casper.run(function () {
            test.done();
        });
    }
);

