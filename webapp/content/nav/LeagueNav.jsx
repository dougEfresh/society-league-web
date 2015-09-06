var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Link = Router.Link;

var DataStore= require('../../jsx/stores/DataStore.jsx');
var ChallengeStatus = require('../../jsx/constants/ChallengeStatus.jsx');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var TeamNav = require('./TeamNav.jsx');
var AdminNav = require('./AdminNav.jsx');
var SeasonNav = require('./SeasonNav.jsx');
var HomeNav = require('./HomeNav.jsx');
var ScoutNav = require('./ScoutNav.jsx');
var ChallengeNav = require('./ChallengeNav.jsx');
var Season = require('../../lib/Season.js');
var Team = require('../../lib/Team.js');
var User = require('../../lib/User.js');
var Status = require('../../lib/Status');
var Result = require('../../lib/Result');
var HomeApp = require('../home/HomeApp.jsx');

var LeagueNav = React.createClass({
    mixins: [UserContextMixin,Router.State,Router.Navigation],
    getInitialState: function() {
        return {
            user: this.getUser()
        }
    },
    componentWillMount: function() {
        DataStore.addChangeListener(this._onChange);
    },
    componentDidMount: function() {
    },
    componentWillUnmount: function() {
        DataStore.removeChangeListener(this._onChange);
    },
    _onChange: function(){
        this.setState({
            user: this.getUser()
        })
    },
    render: function () {
        if (this.getUser().id == "0") {
            return null
        }
        var home = null;
        if (this.isActive('default')) {
            home = (<HomeApp />);
        }

        return (
            <div className="container outerWrapper"  >
                <div className="account-wrapper">
                    <div className="leagueNavGrid" >
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-xs-12 user-nav">
                                <ul className="nav nav-tabs">
                                    <HomeNav />
                                    <TeamNav />
                                    <SeasonNav />
                                    <ScoutNav />
                                    <ChallengeNav />
                                    <AdminNav />
                                </ul>
                            </div>

                             <div className="col-lg-12 col-md-12 col-xs-12 user-nav">
                                <div className="container user-content">
                                    {home}
                                    <RouteHandler />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{display: 'none'}} >{this.getPath()}</div>
            </div>
        );
    }
});

module.exports = LeagueNav;
