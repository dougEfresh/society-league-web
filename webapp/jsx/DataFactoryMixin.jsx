var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler;

var DataFactory = {
    contextTypes: {
        router: React.PropTypes.func
    },
    getUserId: function() {
        return parseInt(this.context.router.getCurrentParams().userId);
    },
    redirect: function (to) {
        this.context.router.transitionTo(to,null,{from: this.context.router.getCurrentPath()});
    },
    sendData: function (data, url, callback) {
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
                    //this.redirect('login');
                }
            },
            success: function (d) {
                console.log("Got " + JSON.stringify(d) + " back from server");
                callback(d);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(url, status, err.toString());
                //this.redirect('error');
            }.bind(this)
        })
    },
    getData: function (url, callback) {
        console.log("Getting data from " + window.location.origin + '' + url);
        $.ajax({
            url: url,
            dataType: 'json',
            statusCode: {
                401: function () {
                    console.log('I Need to Authenticate');
                    if (this.context.router.getCurrentPathname().indexOf('login') == -1) {
                        this.redirect('login');
                    }
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

};

module.exports = DataFactory;