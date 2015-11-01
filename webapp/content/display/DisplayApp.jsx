var React = require('react/addons');
var Router = require('react-router')
    , Link = Router.Link
    , History = Router.History;

var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var TeamStandings = require('../team/TeamStandings.jsx');
var TeamChart = require('../team/TeamChart.jsx');
var Util = require('../../jsx/util.jsx');
var firstBy = require('../../lib/FirstBy.js');
var SeasonStandings = require('../season/SeasonStandings.jsx');
var SeasonMatches = require('../season/SeasonMatches.jsx');
var SeasonLeaders = require('../season/SeasonLeaders.jsx');
var UserResults = require('../../jsx/components/result/UserResults.jsx');

var DisplayApp = React.createClass({
    mixins: [UserContextMixin,History],
     getInitialState: function() {
         var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
         var toggle = true;
         if (width < 768) {
             toggle = false;
         }
         return {
             update: Date.now(),
             teams : [],
             userTeams:  [],
             activeUser: null,
             activeTeam: null,
             activeSeason: null,
             toggleTeam: toggle,
             toggleSeason: true,
             toggleUser: toggle,
             mobile : width < 768
         }
     },
    componentDidMount: function () {
         this.getData();
    },
    getData: function() {
        var userCb = function(d) {
            if (this.props.params.userId == undefined) {
                this.setState({users: d, activeUser: null})
                return;
            }
            d.forEach(function(u){
                if (u.id == this.props.params.userId) {
                    this.setState({users: d, activeUser: u})
                }
            }.bind(this));

        }.bind(this);
        var teamCb = function(d) {
            var activeTeam = null;
            var activeSeason = null;
            d.forEach(function(t){
                if (this.props.params.teamId != undefined && t.id == this.props.params.teamId) {
                    activeTeam = t;
                }
                if (this.props.params.seasonId == t.season.id){
                    activeSeason  = t.season;
                }
            }.bind(this));
            this.setState({teams: d, activeTeam: activeTeam, activeSeason: activeSeason})
        }.bind(this);

        Util.getSomeData({
                url: '/api/team/active',
                callback: teamCb,
                module: 'TeamApp',
                router: this.props.history
            }
        );
        Util.getSomeData({
                url: '/api/user/active',
                callback: userCb,
                module: 'UserApp',
                router: this.props.history
            }
        );
    },
    componentWillReceiveProps: function (n) {
        var team = this.state.activeTeam;
        var season = this.state.activeSeason;
        var user = this.state.activeUser;
        this.state.teams.forEach(function(t){
            if (n.params.teamId != undefined && n.params.teamId == t.id){
                team = t;
            }
            if (n.params.seasonId != undefined && n.params.seasonId == t.season.id){
                season = t.season;
            }
        });
        if (n.params.userId != undefined) {
            this.state.users.forEach(function (u) {
                if (u.id == n.params.userId) {
                    user = u;
                }
            });
        } else {
            user = null;
        }
        this.setState({activeTeam: team , activeSeason: season, activeUser: user});
    },
    changeTeam: function(t) {
        return function(e) {
            e.preventDefault();
            console.log('Going  team to ' + t.name);
            this.state.activeUser = null;
            if (this.state.mobile) {
                this.state.toggleSeason = false;
                this.state.toggleTeam = true;
                this.state.toggleUser = false;
            }
            //this.setState({activeTeam: t, activeSeason: t.season, activeUser: null, toggleSeason: !this.state.mobile});
            this.props.history.pushState(null,'/app/display/' + t.season.id + '/' + t.id);
            //this.setState({activeTeam: t, activeUser: null, activeSeason: t.season, show: 'standings'});
        }.bind(this);
    },
    changeUser: function(u) {
        return function(e) {
            e.preventDefault();
            if (this.state.mobile) {
                this.state.toggleSeason = false;
                this.state.toggleTeam = false;
                this.state.toggleUser = true;
            }
            this.props.history.pushState(null,'/app/display/' + this.state.activeSeason.id + '/' + this.state.activeTeam.id + '/' + u.id);
            console.log('Setting user to ' + u.name);
        }.bind(this);
    },
    toggleUser: function(e) {
        e.preventDefault();
        this.setState({toggleUser: !this.state.toggleUser});
    },
    toggleTeam: function(e) {
        e.preventDefault();
        this.setState({toggleTeam: !this.state.toggleTeam});
    },
    toggleSeason: function(e) {
        e.preventDefault();
        this.setState({toggleSeason: !this.state.toggleSeason});
    },
    render: function () {
        return (
                <div id="team-app">
                    <div className="row">
                        <div className="col-xs-12 col-md-6">
                            <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                                <div className="panel panel-default panel-team">
                                    <div className="panel-heading" role="tab" id="headingOne">
                                        <h4 className="panel-title panel-standings">
                                                Standings
                                            <a href="#" onClick={this.toggleSeason} >
                                                <span className={"fa arrow" + (this.state.toggleSeason ? " active" : "")}></span>
                                            </a>
                                        </h4>

                                    </div>
                                    <div id="collapseOne" className={"panel-collapse " + (this.state.toggleSeason ? "show" : "collapse") } role="tabpanel" aria-labelledby="headingOne">
                                        <div className="panel-body">
                                            <SeasonStandings onClick={this.changeTeam} activeTeam={this.state.activeTeam} notitle={true} season={this.state.activeSeason} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-md-6">
                            <div  className={"panel panel-default panel-results " + (this.state.activeTeam == null ? "hide" : "")}>
                                <div className="panel-heading" role="tab" id="headingTwo">
                                    <h4 className="panel-title panel-members">
                                        {this.state.activeTeam == null ? "Choose a team" : this.state.activeTeam.name}
                                        <a href="#" onClick={this.toggleTeam} >
                                            <span className={"fa arrow" + (this.state.toggleTeam ? " active" : "")}></span>
                                        </a>
                                    </h4>
                                </div>
                                <div gid="collapseTwo" className={"panel-collapse " + (this.state.toggleTeam  ? "show" : "collapse") } role="tabpanel" aria-labelledby="headingTwo">
                                    <div className="panel-body">
                                        <TeamStandings onClick={this.changeUser} activeUser={this.state.activeUser} noteam={true} team={this.state.activeTeam} />
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row" >
                        <div className="col-xs-12 col-md-6">
                            <div className={"panel panel-default panel-results " + (this.state.activeUser == null ? "hide" : "")}>
                                <div className="panel-heading" role="tab" id="headingThree">
                                    <h4 className="panel-title panel-user">
                                            {this.state.activeUser == null  ? "Select a user" : 'Results for: ' + this.state.activeUser.firstName}
                                        <a href="#" onClick={this.toggleUser} >
                                            <span className={"fa arrow" + (this.state.toggleUser ? " active" : "")}></span>
                                        </a>
                                    </h4>

                                </div>
                                <div id="collapseThree" className={"panel-collapse " + (this.state.toggleUser ? "show" : "collapse") } role="tabpanel" aria-labelledby="headingThree">
                                    <div className="panel-body">
                                        <UserResults user={this.state.activeUser} season={this.state.activeSeason} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
    }
});

module.exports = DisplayApp;
