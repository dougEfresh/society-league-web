var React = require('react/addons');
var Router = require('react-router')
    , State = Router.State
    , Navigation = Router.Navigation
    , Link = Router.Link
    , RouteHandler = Router.RouteHandler;

var DataStore= require('../../jsx/stores/DataStore.jsx');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var TeamMixin = require('../../jsx/mixins/TeamMixin.jsx');
var SeasonMixin = require('../../jsx/mixins/SeasonMixin.jsx');
var PayApp = require('./PayApp.jsx');

var UserInfo = React.createClass({
    render: function() {
        return (<div id="user-info-app"><PayApp /></div>);
    }
});

module.exports=UserInfo;