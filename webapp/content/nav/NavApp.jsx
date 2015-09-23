var React = require('react/addons');
var ReactRouter = require('react-router');
var History = ReactRouter.History;
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var LoginApp = require('../login/LoginApp.jsx');
var DataStore = require('../../jsx/stores/DataStore.jsx');
var LoadingApp  = require('../../jsx/components/LoadingApp.jsx');
var TeamNav = require('./TeamNav.jsx');
var AdminNav = require('./AdminNav.jsx');
var SeasonNav = require('./SeasonNav.jsx');
var HomeNav = require('./HomeNav.jsx');
var StatNav = require('./StatNav.jsx');
var ChallengeNav = require('./ChallengeNav.jsx');
var HomeApp = require('../home/HomeApp.jsx');
var Util = require('../../jsx/util.jsx');

var NavApp = React.createClass({
    mixins: [UserContextMixin,History],
    getInitialState: function() {
         return {
             user: DataStore.getUser()
         }
    },
    componentWillMount: function() {
    },
    componentWillUnmount: function() {
    },
    componentDidMount: function() {
        Util.getSomeData({
            url: '/api/user',
            callback: function(d) {
                DataStore.setUser(d);
                this.setState({
                    user: d
                });
                if (this.props.location.pathname == '/') {
                    this._onChange();
                    this.history.replaceState(null, '/app/home');
                    return
                }
            }.bind(this),
            router: this.props.history,
            module: 'NavApp',
            unAuthCallback: function() {this.history.pushState(null, '/login');}.bind(this)
        });
    },
    componentWillReceiveProps: function() {
    },
    _onChange: function(){
        console.log('NavApp change: ' + this.getUser().id );
        this.setState({
            user: DataStore.getUser()
        });
    },
    render: function() {
        if (this.getUser().id == "0") {
            return null;
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
                                    <ChallengeNav />
                                    <TeamNav />
                                    <SeasonNav />
                                    <StatNav />
                                    <AdminNav />
                                </ul>
                            </div>
                             <div className="col-lg-12 col-md-12 col-xs-12 user-nav">
                                <div className="container user-content">
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