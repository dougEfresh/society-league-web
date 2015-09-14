var React = require('react/addons');
var Router = require('react-router')
    , Link = Router.Link;

var DataStore= require('../../jsx/stores/DataStore.jsx');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var TeamNav = require('./TeamNav.jsx');
var AdminNav = require('./AdminNav.jsx');
var SeasonNav = require('./SeasonNav.jsx');
var HomeNav = require('./HomeNav.jsx');
var StatNav = require('./StatNav.jsx');
//var ChallengeNav = require('./ChallengeNav.jsx'); <ChallengeNav />
var HomeApp = require('../home/HomeApp.jsx');

var LeagueNav = React.createClass({
    mixins: [UserContextMixin],
    contextTypes: {
        location: React.PropTypes.object
    },
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
        if (this.context.location.pathname == '/') {
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
                <div style={{display: 'none'}} >{this.context.location.pathname}</div>
            </div>
        );
    }
});

module.exports = LeagueNav;
