var React = require('react/addons');
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Badge = Bootstrap.Badge
    ,TabbedArea = Bootstrap.TabbedArea
    ,TabPane = Bootstrap.TabPane
    ,Nav = Bootstrap.Nav
    ,NavItem = Bootstrap.NavItem
    ,Alert = Bootstrap.Alert
    ,Well = Bootstrap.Well
    ,Panel = Bootstrap.Panel;

var ReactRouterBootstrap = require('react-router-bootstrap')
    ,NavItemLink = ReactRouterBootstrap.NavItemLink
    ,MenuItemLink = ReactRouterBootstrap.MenuItemLink;

var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;

var UserContextMixin = require('../../UserContextMixin.jsx');
var DataStore = require('../../stores/DataStore.jsx');
var DataActions= require('../../actions/DataActions.jsx');


var SignUp = React.createClass({
    mixins: [Router.Navigation,UserContextMixin],
    componentWillMount: function () {
        DataStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function () {
        DataStore.removeChangeListener(this._onChange);
    },
    componentDidMount: function () {
        this.setState({user: this.getUser()});
    },
    componentWillReceiveProps: function() {
        this.setState({user: this.getUser()});
    },
    onClick: function(e) {
        e.preventDefault();
        DataActions.challengeSignUp(this.getUser().userId);
    },
    _onChange: function() {
        console.log('onchange');
        this.setState({user: this.getUser()});
    },
    render: function() {
        if (this.getUser().userId == 0) {
            return null;
        }
        if (this.getUser().challenge) {
            this.transitionTo('request');
        }
        return (
            <div id="challengeSignUp" >
                <Well><Button onClick={this.onClick} bsStyle='primary'>Sign up now </Button></Well>
            </div>
        );
    }
});

module.exports = SignUp;