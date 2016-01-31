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
    changeTeam: function(t) {
        return function(e) {
            e.preventDefault();
            this.props.history.pushState(null,'/app/display/' + t.season.id + '/' + t.id);
            //this.setState({activeTeam: t, activeUser: null, activeSeason: t.season, show: 'standings'});
            console.log('Going  team to ' + t.name);
        }.bind(this);
    },
    show: function(type,s) {
        return function(e) {
            e.preventDefault();
            this.setState({show: type,activeSeason: s})}.bind(this);
    },
    goToLeaders: function(s) {
        return function(u) {
            return function (e) {
                e.preventDefault();
                window.location = '#/app/season/' + s.id + '/leaders/' + u.id;
            }.bind(this);
        }
    },
    goToTeam: function(t) {
         return function(e){
            e.preventDefault();
            this.props.history.pushState(null,'/app/display/' + t.season.id + '/' + t.id)
         }.bind(this)
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
            if (!s.active)
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

        var seasonLeaders = [];
        this.getUser().handicapSeasons.forEach(function(hs){
            var s = hs.season;
            if (!s.active) {
                return;
            }
            seasonLeaders.push(
	    <div className="row" key={s.id} >
                <div className="col-xs-12 col-md-8 col-lg-10">
                    <div className="panel panel-default panel-leaders">
                        <div className="panel-heading">
                            <i className="fa fa-sitemap"></i>
                            <Link style={{color: 'whitesmoke'}} to={'/app/season/' + s.id + '/leaders'}> <span className="top-players-header"> Top Players</span> <span className="league-home-header" style={{float: 'right'}} >{s.shortName}</span></Link>
                        </div>
                        <div className="panel-body panel-animate">
                            <SeasonLeaders onUserClick={this.goToLeaders(s)} params={{seasonId: s.id}} limit={5} />
                        </div>
                    </div>
                </div>
		</div>		
            )
        }.bind(this));

        return (
            <div id='home-app'>
                <div className="welcome" align="center">
                    <h3>Society Billiards Leagues</h3>
                </div>
                <div className="welcome-name"><h4><p>{'Welcome ' + this.getUser().firstName} </p></h4></div>
                <div className="row">
                    <div className="col-xs-12 col-md-8 col-lg-10">
                        <div className="panel panel-default panel-upcoming">
                            <div className={"panel-heading"}>
                                <i className="fa fa-bell fa-fw"></i> Upcoming Matches
                            </div>
                            <div className={"panel-body panel-animate"}>
                                <UpcomingMatches  />
                            </div>
                        </div>
                    </div>
                </div>
                    <UpcomingChallenges  data={this.state.challenges} />
                {seasonLeaders}
            </div>
        );
    }
});

module.exports = HomeApp;
