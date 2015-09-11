var React = require('react/addons');
var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var LeagueNav = require('./LeagueNav.jsx');
var LoginApp = require('../login/LoginApp.jsx');
var DataStore = require('../../jsx/stores/DataStore.jsx');
var LoadingApp  = require('../../jsx/components/LoadingApp.jsx');

var NavApp = React.createClass({
    mixins: [UserContextMixin,Router.Navigation,Router.State],
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
        DataStore.checkLogin();
    },
    componentWillReceiveProps: function() {
        if (!DataStore.isAuthenticated()) {
            return;
        }
        if (DataStore.isLoading()) {
            return;
        }
        if (DataStore.isLoaded() && DataStore.isAuthenticated()) {
            if (this.isActive('default')) {
                this.transitionTo('home');
            }
            return;
        }
        DataStore.init();
        //DataActions.init();
    },
    _onChange: function(){
        console.log('NavApp change: ' + this.getUserId() + ' Loading ' + DataStore.isLoading() + ' Authenticated: ' + DataStore.isAuthenticated());
        if (DataStore.isAuthenticated() && !DataStore.isLoaded() && !DataStore.isLoading()) {
            DataStore.init();
        }
        this.setState({
            loading: DataStore.isLoading(),
            authenticated: DataStore.isAuthenticated()
        });
    },
    render: function() {
        if (!DataStore.isAuthenticated()) {
            console.log("LoginApp");
            return (
                <LoginApp />
            )
        }
        if (DataStore.isLoading()) {
            return (
                <div id={'loading-' + DataStore.isLoading()}>
                    <LoadingApp />
                </div>
            );
        }

        return (
            <div>
                <LeagueNav  />
                <div id='app-ready' ></div>
                <div id={this.getUser().id} ></div>
            </div>

        );
    }
});

module.exports = NavApp;