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
var UserDisplay = require('./UserDisplay.jsx');

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
             toggleTeam:  this.props.params.teamId != undefined,
             toggleSeason: true,
             hideSeasonStandings: false,
             toggleUser: this.props.params.userId != undefined,
             mobile : width < 768,
             showLoading : false
         }
     },
    componentDidMount: function () {
        if (this.props.params.seasonId) {
            this.getSeasonData(this.props.params.seasonId);
        }

        if (this.props.params.teamId) {
            this.getTeamData(this.props.params.teamId);
        }

        if (this.props.params.userId) {
            this.getUserData(this.props.params.userId);
        }
    },
    getSeasonData: function(seasonId) {
        Util.getSomeData({
            url: '/api/season/' + seasonId,
            callback: function(d) {this.setState({activeSeason: d})}.bind(this)
        });
    },
    getTeamData: function(teamId) {
        Util.getSomeData({
            url: '/api/team/' + teamId,
            callback: function(d) {this.setState({activeTeam: d})}.bind(this)
        });
    },
    getUserData: function(userId) {
         if (userId)
             Util.getSomeData({
                 url: '/api/user/' + userId,
                 callback: function(d) {this.setState({activeUser: d, toggleUser: true})}.bind(this)
             });
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
        if (this.props.params.userId) {
            Util.getSomeData({
                    url: '/api/user/active',
                    callback: userCb,
                    module: 'UserApp',
                    router: this.props.history
                }
            );
        }
    },
    componentWillReceiveProps: function (n) {
        if (n.params.seasonId != this.props.params.seasonId) {
            this.state.activeTeam = null;
            this.state.activeUser = null;
            this.getSeasonData(n.params.seasonId);
        }

        if (this.props.params.teamId != n.params.teamId) {
            this.state.activeUser = null;
            this.state.activeTeam = null;
            this.getTeamData(n.params.teamId);
        }
        if (this.props.params.userId != n.params.userId) {
            this.getUserData(n.params.userId);
        } {
            this.state.toggleUser = false;
        }
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
            if (u.id == this.props.params.userId) {
                return;
            }
            if (this.state.mobile) {
                this.state.toggleSeason = false;
                this.state.toggleTeam = false;
                this.state.toggleUser = true;
                this.state.showLoading = true;
            }
               Util.getSomeData({
                url: '/api/team/user/' + u.id + '/' + this.props.params.seasonId,
                callback: function(d) {
                    console.log('Going to use ' + d.name + ' for ' + u.name);
                    this.props.history.pushState(null,'/app/display/' + this.props.params.seasonId + '/' + d.id + '/' + u.id)
                }.bind(this),
                module: 'ChangeUser'
            });
            this.forceUpdate();
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
        if (this.state.activeSeason == null)
            return null;
        var ss = <SeasonStandings onTeamClick={this.changeTeam} activeTeam={this.state.activeTeam} notitle={true} season={this.state.activeSeason} />;
        /*
        if (!this.state.toggleSeason) {
            setTimeout(function(e){
                this.setState({hideSeasonStandings: true});
            },2040)
        } else {
            this.state.hideSeasonStandings = false;
        }

        if (this.state.hideSeasonStandings){
            ss = null;
        }
        */
        var loading = this.state.showLoading;
        if (this.state.showLoading ) {
            this.state.showLoading = false;
        }
        console.log('loading ' + loading );
        return (
                <div id="team-app">
                    <div className="row">
                        <div className="col-xs-12 col-md-6">
                            <div className="panel panel-default panel-standings">
                                <a onClick={this.toggleSeason} href="#">
                                    <div className={"panel-heading" + (this.state.toggleSeason ? "" : " panel-closed")}>
                                    <div className="row panel-title">
                                        <div className="col-xs-10 col-md-11 p-title">
                                            {this.state.activeSeason.shortName + ' Standings'}
                                        </div>
                                        <div className="col-xs-2 col-md-1 caret-title">
                                            <span className={"fa fa-caret-" + (this.state.toggleSeason ? "down" : "left")}></span>
                                        </div>
                                    </div>
                                </div>
                                </a>
                                <div className={"panel-body panel-animate" + (this.state.toggleSeason ? "" : " hide")}>
                                    {ss}
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-md-6">
                            <div className={"panel panel-default panel-members " + (this.state.activeTeam == null ? "hide" : "")}>
                                <a onClick={this.toggleTeam} href="#">
                                    <div className={"panel-heading" + (this.state.toggleTeam ? "" : " panel-closed")}>
                                        <div className="row panel-title">
                                            <div className="col-xs-10 col-md-11 p-title">
                                                {this.state.activeTeam == null ? "Choose a team" : this.state.activeTeam.name}
                                            </div>
                                            <div className="col-xs-2 col-md-1 caret-title ">
                                                <span className={"fa fa-caret-" + (this.state.toggleTeam ? "down" : "left")}></span>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                                <div className={"panel-body panel-animate" + (this.state.toggleTeam ? "" : " hide")}>
                                    <TeamStandings onUserClick={this.changeUser} activeUser={this.state.activeUser} noteam={true} team={this.state.activeTeam} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <UserDisplay params={this.props.params} />
                </div>
            );
    }
});

module.exports = DisplayApp;
