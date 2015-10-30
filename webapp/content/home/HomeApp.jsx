var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var UpcomingChallenges = require('./UpcomingChallenges.jsx');
var UpcomingMatches = require('./UpcomingMatches.jsx');
var RecentMatches = require('./RecentMatches.jsx');
var Util = require('../../jsx/util.jsx');
var UserLink = require('../../jsx/components/links/UserLink.jsx');
var UserInfo = require('./UserInfo.jsx');
var UserResults = require('../../jsx/components/result/UserResults.jsx');
var SeasonStandings = require('../season/SeasonStandings.jsx');
var SeasonMatches = require('../season/SeasonMatches.jsx');
var SeasonLeaders = require('../season/SeasonLeaders.jsx');
var TeamStandings = require('../team/TeamStandings.jsx');

var HomeApp = React.createClass({
    mixins: [UserContextMixin],
     getInitialState: function() {
         return {
             stats: [],
             challenges: [],
             userTeams :[],
             allTeams :[],
             seasons: [],
             user : this.getUser(),
             adminMode: false,
             activeSeason: null,
             activeUser: this.getUser(),
             show: 'standings'
         }
    },
    getData: function() {
        Util.getSomeData(
            {url:'/api/stat/user/' + this.getUser().id ,
                callback: function(d){ this.setState({stats: d})}.bind(this),
                module:'HomeApp',
                router: this.props.router
            }
        );
        Util.getSomeData(
            {url: '/api/season/active' ,
                callback: function(d){this.setState({seasons: d})}.bind(this),
                module: 'HomeApp', router: this.props.history
            }
        );
        Util.getSomeData( {url: '/api/challenge/user/' + this.getUser().id,
            callback:  function (d) {this.setState({challenges: d})}.bind(this),
            router: this.context.history,
            module: 'UpcomingChallenges'
        });
        Util.getSomeData
        ({url: '/api/team/get/' + this.state.activeUser.id + '/active',
            callback: function(d){this.setState({userTeams: d});}.bind(this),
            module: 'TeamNav',
            router: this.props.history
        });
        Util.getSomeData({url: '/api/team/active',
            callback: function(d){this.setState({allTeams: d});}.bind(this),
            module: 'TeamNav',
            router: this.props.history
        });
    },
    componentDidMount: function () {
        this.getData();
    },
    componentWillReceiveProps: function () {
       //this.getData();
    },

    processSeason: function(s) {
        if (s.id != this.state.activeSeason.id) {
            return null;
        }
        var team = null;
        if (this.state.activeTeam != null) {
            console.log('Using ' + this.state.activeTeam.name + ' as active team');
            team = <TeamStandings onClick={this.changeUser} activeUser={this.state.activeUser} noteam={true} params={{teamId: this.state.activeTeam.id}} />
        } else {
            console.log('Finding team for ' + s.displayName);
            this.state.userTeams.forEach(function (t) {
                if (t.season.id != s.id)
                    return;
                team = <TeamStandings onClick={this.changeUser} activeUser={this.state.activeUser} noteam={true} params={{teamId: t.id}}/>
                console.log('Setting team display to ' + t.name);
            }.bind(this));
        }
        if (team == null){
            return null;
        }

        var cls = "row season-active";
        return (
            <div className={cls} key={s.id}>
                <div className={"col-xs-12 col-md-4"}>
                    <SeasonStandings onClick={this.changeTeam} activeTeam={this.state.activeTeam} notitle={true} seasonId={s.id} />
                </div>
                <div className={"col-xs-12 col-md-4"}>
                    {team}
                </div>
                <div className={"col-xs-12 col-md-4"}>
                    <UserResults user={this.state.activeUser} season={s} />
                </div>
            </div>
        );

    },
    changeUser: function(u) {
        return function(e) {
            e.preventDefault();
            this.setState({activeUser: u});
            console.log('Setting user to ' + u.name);
        }.bind(this);
    },
    changeTeam: function(t) {
        return function(e) {
            e.preventDefault();
            this.props.history.pushState(null,'/app/team/' + t.id);
            //this.setState({activeTeam: t, activeUser: null, activeSeason: t.season, show: 'standings'});
            console.log('Going  team to ' + t.name);
        }.bind(this);
    },
    changeSeason: function(s) {
        return function(e) {
            e.preventDefault();
            var activeTeam = null;
            this.state.userTeams.forEach(function(t){
                if (t.season.id == s.id)
                    activeTeam = t;
            });
            this.setState({activeSeason: s, activeTeam:  activeTeam, activeUser: this.getUser()});
            console.log('Setting season to ' + s.displayName);
        }.bind(this);
    },
    show: function(type,s) {
        return function(e) {
            e.preventDefault();
            this.setState({show: type,activeSeason: s})}.bind(this);
    },
    render: function () {
        var user = this.state.user;
        var seasonStandings = [];
        if (this.state.userTeams.length == 0 || this.state.allTeams.length == 0 || this.state.seasons.length == 0) {
            return null;
        }
        var seasons = [];

        this.getUser().handicapSeasons.forEach(function (hs) {
            var s = hs.season;
            if (!s.active || s.challenge)
                return;
            seasons.push(s);
        }.bind(this));

        if (this.state.activeSeason == null) {
            console.log('setting active season to ' + seasons[0].displayName);
            this.state.activeSeason = seasons[0];
        }
        if (this.state.activeTeam == null){
            this.state.userTeams.forEach(function(t){
                if (t.season.id == this.state.activeSeason.id)
                    this.state.activeTeam = t;
            }.bind(this));
        }
        var seasonTabs = [];
        var cnt = 0;
        seasons.forEach(function(s){
            console.log('Processing ' + s.displayName);
            var ss = this.processSeason(s);
            cnt++;
            seasonStandings.push(ss);
            var displayName = s.displayName.substr(9,15);
            if (s.challenge) {
                displayName = 'Top Gun';
            }
            seasonTabs.push(
                <li key={s.id} role="presentation" className={this.state.activeSeason.id == s.id ? "active dropdown" : "none dropdown"}>
                <a className="dropdown-toggle"
                   data-toggle="dropdown"
                   href="#" role="button"
                   aria-haspopup="true"
                   aria-expanded="false"
                   href="#">
                    {displayName}<span className="caret"></span></a>
                    <ul className="dropdown-menu">
                        <li><a onClick={this.show('standings',s)} href='#'>Standings</a></li>
                        <li><a onClick={this.show('schedule',s)} href='#'>Schedule</a></li>
                        <li><a onClick={this.show('leaders',s)} href='#'>Leaders</a></li>
                    </ul>
                </li>

            );
        }.bind(this));
        var display =  seasonStandings;
        if (this.state.show == 'leaders') {
            display = <div className="row">
                <SeasonLeaders onClick={this.changeTeam} params={{seasonId: this.state.activeSeason.id}} />
            </div>
        }
        if (this.state.show == 'schedule') {
            display = <div className="row">
                <SeasonMatches params={{seasonId: this.state.activeSeason.id}} />
            </div>
        }
        var seasonLeaders = [];
        this.getUser().handicapSeasons.forEach(function(hs){
            var s = hs.season;
            if (!s.active) {
                return;
            }
            seasonLeaders.push(
                <div key={s.id} className="col-xs-12 col-md-4">
                    <div className="panel panel-default panel-leaders">
                        <div className="panel-heading">
                            <i className="fa fa-sitemap"></i> {'Top Players ' + s.displayName.substr(8,15)}
                        </div>
                        <div className="panel-body">
                            <SeasonLeaders  onClick={this.changeTeam} params={{seasonId: s.id}} limit={5} />
                        </div>
                    </div>
                </div>
            )
        }.bind(this));

        return (
            <div id='home-app'>
                <div className="welcome" align="center">
                    <p>Society Billiards League Home Page</p>
                </div>

                <div className="headerHome">Welcome Doug</div>
                <div className="headerHome">My Teams</div>
                <div className="plain_text">
                    You can also manage your account settings by clicking on the <b>'My Teams'</b> link in the left panel to change
                    your personal data including your email address, name, phone number, and home address.
                </div>

                <div className="headerHome">Stats</div>
                <div className="plain_text">
                    To get a quick look at every season you've played in, the <b>'Stats'</b> section contains <b>'My History'</b> &amp; <b>'My Opponents'</b>
                    which breaks down your history by individual seasons and a complete history of every opponent you've ever played. In my opponents, you will
                    be able to sort by opponent or zero in on all matches played bettween you and that opponent, their team.
                </div>

                <div className="row">
                    <div className="col-xs-12 col-md-3">
                        <div className="panel panel-default panel-upcoming">
                        <div className="panel-heading">
                            <i className="fa fa-bell fa-fw"></i> Upcoming Matches
                        </div>
                            <div className="panel-body">
                                <UpcomingMatches onClick={this.changeTeam} data={this.state.challenges}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {seasonLeaders}
                </div>
       </div>
        );
    }
});

/*
  <div id="home-app" className="container ss-home-app">
                <h4>Upcoming Matches</h4>
 <div className="row">
 <div className="col-xs-12  col-md-12">
 <UpcomingChallenges  onClick={this.changeTeam} data={this.state.challenges}/>
 </div>
 </div>
                <div className="row">
                    <UpcomingMatches onClick={this.changeTeam}/>
                </div>
                <ul className="nav nav-tabs">
                    {seasonTabs}
                </ul>
                {display}
            </div>
 */
module.exports = HomeApp;