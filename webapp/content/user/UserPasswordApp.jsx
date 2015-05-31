var React = require('react/addons');
var Router = require('react-router')
    , State = Router.State
    , Navigation = Router.Navigation
    , Link = Router.Link
    , RouteHandler = Router.RouteHandler;

var Bootstrap = require('react-bootstrap')
    ,Panel = Bootstrap.Panel
    ,Badge = Bootstrap.Badge
    ,Button = Bootstrap.Button;

var DataStore= require('../../jsx/stores/DataStore.jsx');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var TeamMixin = require('../../jsx/mixins/TeamMixin.jsx');
var SeasonMixin = require('../../jsx/mixins/SeasonMixin.jsx');

var UserPasswordApp = React.createClass({
    render: function() {
        return <h2>HI</h2>
    }

});

module.exports=UserPasswordApp;