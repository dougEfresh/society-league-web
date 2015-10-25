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
             activeUser: this.getUser()
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
            this.setState({activeTeam: t, activeUser: null});
            console.log('Setting team to ' + t.name);
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
            seasonTabs.push(
                <li key={s.id} role="presentation" className={this.state.activeSeason.id == s.id ? "active" : "none"}>
                <a onClick={this.changeSeason(s)} href="#">{s.displayName}</a></li>
            );
        }.bind(this));

        return (
            <div id="home-app" className="container ss-home-app">
                <h4>Upcoming Matches</h4>
                <div className="row">
                    <div className="col-xs-12  col-md-12">
                        <UpcomingChallenges data={this.state.challenges}/>
                    </div>
                </div>
                <div className="row">
                    <UpcomingMatches />
                </div>
                <ul className="nav nav-tabs">
                    {seasonTabs}
                </ul>
                {seasonStandings}
            </div>
        );
    }
});

module.exports = HomeApp;