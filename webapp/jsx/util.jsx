var moment = require('moment');
var DataStore = require('./stores/DataStore.jsx');
var Handicap = require('../lib/Handicap');

/**
 * Figure out the next challenge day (which is Sunday)
 */
function getNextChallengeDay() {
    for (var i = 0; i < 8 ; i++ ) {
        var day = moment().add(i,'days');
        if (day.weekday() == 0) {
            return day.format('YYYY-MM-DD')
        }
    }
    console.error('Could not find next challenge date');
}

function getChallengeDates() {
    var start = getNextChallengeDay();
    var dates  = [];
      // Add the next 4 weeks as options
        [0,1,2,3,4].forEach(function(i) {
            dates.push(moment(start).add(i,'weeks').format('YYYY-MM-DD'));
        });
    return dates;
}

function getData(url, callback, unauthCallback, module) {
    //console.log('Someone is getting data ' + arguments.callee.caller.toString());
        console.log("["+ module + "] Getting data from " + url);
        $.ajax({
            url: url,
            dataType: 'json',
            statusCode: {
                401: function () {
                    console.log('I Need to Authenticate');
                    if (unauthCallback) {
                        unauthCallback();
                        return;
                    }

                    window.location = '/#/login?expired=true'
                }.bind(this)
            },
            success: function (d) {
                callback(d);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(url, status, err.toString());
                console.log('Redirecting to error');
                //this.redirect('error');
            }.bind(this)
        });
    }

function getSomeData(options) {
    //url, callback, unauthCallback, module
    //console.log('Someone is getting data ' + arguments.callee.caller.toString());
    console.log("["+ options.module + "] " + options.url);
    var now = Date.now();
    $.ajax({
            url: options.url,
            dataType: 'json',
            statusCode: {
                401: function () {
                    console.log('I Need to Authenticate');
                    if (options.unAuthCallback) {
                        options.unAuthCallback();
                        return;
                    }
                    if (options.router) {
                        options.router.pushState(null,'/login',{expired:'true'});
                    }
                    window.location = '/#/login?expired=true'
                }.bind(this)
            },
            success: function (d) {
                options.callback(d,Date.now()-now);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(options.url, status, err.toString());
                console.log('Redirecting to error');
                if (options.errorCallBack) {
                    options.errorCallBack(zhr,status,err);
                    return;
                }
                defaultErrorHandler(options.router,xhr);
            }.bind(this)
        });
    }


function getHandicap(user,seasonId) {
    var hc = "N/A";
    if (user == undefined || user.handicapSeasons == undefined) {
        return hc;
    }
    user.handicapSeasons.forEach(function(hs){
        if (hs.season.id == seasonId) {
            hc =  hs.handicap;
        }
    });
    return Handicap.formatHandicap(hc);
}
var now = moment();
function formatDateTime(dt) {
    var m = moment(dt);
    return m.format('MMM Do');
}

function formatTime(dt) {
    var m = moment(dt);
    return m.format('h:mm');
}

function sendSomeData(options) {
        console.log(JSON.stringify(options.data));
        $.ajax({
            async: true,
            processData: false,
            url: options.url,
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(options.data),
            method: 'post',
            statusCode: {
                401: function () {
                    console.log('I Need to Authenticate');
                     if (options.router) {
                        options.router.pushState(null,'/login',{expired:'true'});
                    }
                    window.location = '/#/login?expired=true'
                }.bind(this)

            },
            success: function (d) {
                console.log("Got " + JSON.stringify(d) + " back from server");
                options.callback(d);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(options.url,url, status, err.toString());
                if (xhr.responseText.indexOf("Invalid remember-me token") >= 0) {
                    window.location = '/#/login?expired=true';
                    return;
                }
                if (options.errCallback) {
                    options.errCallback();
                    return;
                }
                defaultErrorHandler(options.router,xhr);
            }.bind(this)
        })
    }

function sendData(url, data, callback,errCallback) {
        console.log("Sending data: " + JSON.stringify(data));
        $.ajax({
            async: true,
            processData: false,
            url: url,
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(data),
            method: 'post',
            statusCode: {
                401: function () {
                    console.log('I Need to Authenticate');
                    window.location = '/#/login?expired=true'
                }.bind(this)
            },
            success: function (d) {
                console.log("Got " + JSON.stringify(d) + " back from server");
                callback(d);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(url, status, err.toString());
                if (errCallback) {
                    errCallback();
                }

                //this.redirect('error');
            }.bind(this)
        })
    }

function postSomeData(options) {
        console.log("Sending data: " + JSON.stringify(options.data));
        $.ajax({
            async: true,
            processData: false,
            url: options.url,
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(options.data),
            method: 'post',
            statusCode: {
                401: function () {
                    console.log('I Need to Authenticate');
                    window.location = '/#/login?expired=true'
                }.bind(this)
            },
            success: function (d) {
                //console.log("Got " + JSON.stringify(d) + " back from server");
                options.callback(d);
            }.bind(this),
            error: function (xhr, status, err) {
                console.warn(options.url, xhr.responseText);
                if (xhr.responseText.indexOf("Invalid remember-me token") >= 0) {
                    window.location = '/#/login?expired=true'
                    return;
                }
                if (options.errCallback) {
                    options.errCallback();
                    return;
                }
                defaultErrorHandler(options.router,xhr);
            }.bind(this)
        })
}

function defaultErrorHandler(router,xhr) {
    if (window.location.hash.indexOf("/error") >= 0)
        return;
    if (router)
        router.pushState(null, '/error', {err: xhr.responseText});
    //else
      //  window.location = '#/login';
}


module.exports = {
    nextChallengeDate: getNextChallengeDay,
    getData: getData,
    sendData: sendData,
    getChallengeDates: getChallengeDates,
    getHandicap: getHandicap,
    formatDateTime: formatDateTime,
    getSomeData: getSomeData,
    postSomeData: postSomeData,
    formatTime: formatTime,
    tableCls: 'table table-bordered table-condensed table-striped table-grid'
};
