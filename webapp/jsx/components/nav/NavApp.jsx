var React = require('react/addons');
var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;
var State = Router.state;
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var LeagueNav = require('./LeagueNav.jsx');
var LoginApp = require('../LoginApp.jsx');
var DataStore = require('../../stores/DataStore.jsx');
var DataActions= require('../../actions/DataActions.jsx');
var LoadingApp  = require('../../components/LoadingApp.jsx');

var NavApp = React.createClass({
    mixins: [State,UserContextMixin],
    getInitialState: function() {
         return {
             loading: false,
             authenticated: false
        }
    },
    componentWillMount: function() {
        DataStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        DataStore.removeChangeListener(this._onChange);
    },
    componentDidMount: function() {
        DataActions.checkLogin();
    },
    _onChange: function(){
        console.log('NavApp change: ' + this.getUserId() + ' Loading ' + DataStore.isLoading() + ' Authenticated: ' + DataStore.isAuthenticated());
        this.setState({
            loading: DataStore.isLoading(),
            authenticated: DataStore.isAuthenticated()
        });
    },
    render: function() {
        if (!this.state.authenticated) {
            console.log("LoginApp");
            return (
                <LoginApp />
            )
        }
        if (this.state.loading) {
            return (
                <div id={'loading-' + this.state.loading}>
                    <LoadingApp />
                </div>
            );
        }
        return (
            <div>
                <LeagueNav  />
                <div id='appReady' ></div>
                <div id={this.getUser().id} ></div>
            </div>

        );
    }
});

module.exports = NavApp;