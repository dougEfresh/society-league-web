var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler;
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Input = Bootstrap.Input
    ,Panel = Bootstrap.Panel
    ,Label = Bootstrap.Label;

var UserContextMixin = require('./../UserContextMixin.jsx');

var ErrorApp = React.createClass({
    mixins: [UserContextMixin,Router.state],
    render: function () {
        return (
            <Panel header={'Error'} >
                <h2>ERROR</h2>
            </Panel>
        );
    }
});

module.exports = ErrorApp;