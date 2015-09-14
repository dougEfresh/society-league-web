var React = require('react/addons');
var ReactRouter = require('react-router');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var LoginApp = require('../login/LoginApp.jsx');
var DataStore = require('../../jsx/stores/DataStore.jsx');
var LoadingApp  = require('../../jsx/components/LoadingApp.jsx');
var TeamNav = require('./TeamNav.jsx');
var AdminNav = require('./AdminNav.jsx');
var SeasonNav = require('./SeasonNav.jsx');
var HomeNav = require('./HomeNav.jsx');
var StatNav = require('./StatNav.jsx');
//var ChallengeNav = require('./ChallengeNav.jsx'); <ChallengeNav />
var HomeApp = require('../home/HomeApp.jsx');

var NavApp = React.createClass({
    mixins: [UserContextMixin],
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
        DataStore.init();
    },
    _onChange: function(){
        console.log('NavApp change: ' + this.getUser().id + ' Loading ' + DataStore.isLoading() + ' Authenticated: ' + DataStore.isAuthenticated());
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
                <LoginApp query={this.props.location.query} />
            )
        }
        if (DataStore.isLoading()) {
            return (
                <div id={'loading-' + DataStore.isLoading()}>
                    <LoadingApp />
                </div>
            );
        }
        var home = null;
        if (this.props.location.pathname == '/') {
            home = (<HomeApp />);
        }

        return (
            <div>
                  <div className="container outerWrapper"  >
                <div className="account-wrapper">
                    <div className="leagueNavGrid" >
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-xs-12 user-nav">
                                <ul className="nav nav-tabs">
                                    <HomeNav />
                                    <TeamNav />
                                    <SeasonNav />
                                    <StatNav />
                                    <AdminNav />
                                </ul>
                            </div>
                             <div className="col-lg-12 col-md-12 col-xs-12 user-nav">
                                <div className="container user-content">
                                    {home}
                                    {this.props.children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{display: 'none'}} >{this.props.location.pathname}</div>
            </div>
                <div id='app-ready' ></div>
                <div id={this.getUser().id} ></div>
            </div>

        );
    }
});

module.exports = NavApp;