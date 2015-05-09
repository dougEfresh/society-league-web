var React = require('react/addons');
var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;
var State = Router.state;
var UserContextMixin = require('../../UserContextMixin.jsx');
var LeagueNav = require('./LeagueNav.jsx');
var LoginApp = require('../LoginApp.jsx');
var DataStore = require('../../stores/DataStore.jsx');
var DataActions= require('../../actions/DataActions.jsx');

var NavApp = React.createClass({
    mixins: [State,UserContextMixin],
    getInitialState: function() {
         return {
            user: this.getUser()
        }
    },
    componentWillMount: function() {
        DataStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        DataStore.removeChangeListener(this._onChange);
    },
    componentDidMount: function() {
        DataActions.init();
    },
    _onChange: function(){
        this.setState({
            user: this.getUser()
        })
    },
    render: function() {
        if (this.getUserId() == 0) {
            console.log("LoginApp");
            return (
                <LoginApp />
            )
        }
        return (
            <LeagueNav  />
        );
    }
});

module.exports = NavApp;