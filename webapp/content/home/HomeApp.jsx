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
             adminMode: false
         }
    },
    getData: function() {
        Util.getSomeData({url:'/api/stat/user/' + this.getUser().id ,
                callback: function(d){ this.setState({stats: d})}.bind(this),
                module:'HomeApp',
                router: this.props.router
            }
        );
        Util.getSomeData(
            {url: '/api/season/active' , callback: function(d){this.setState({seasons: d})}.bind(this),
                module: 'HomeApp', router: this.props.history
            }
        );
        Util.getSomeData( {url: '/api/challenge/user/' + this.getUser().id,
            callback:  function (d) {this.setState({challenges: d})}.bind(this),
            router: this.context.history,
            module: 'UpcomingChallenges'
        });
        Util.getSomeData
        ({url: '/api/team/get/' + this.getUser().id + '/active',
            callback: function(d){this.setState({userTeams: d});}.bind(this),
            module: 'TeamNav',
            router: this.props.history
        });
        Util.getSomeData({url: '/api/team/active/',
            callback: function(d){this.setState({allTeams: d});}.bind(this),
            module: 'TeamNav',
            router: this.props.history
        });
    },
    componentDidMount: function () {
        this.getData();
    },
    componentWillReceiveProps: function () {
       this.getData();
    },
    processSeason: function(s) {
        var team = null;
        this.state.userTeams.forEach(function(t) {
            if (t.season.id != s.id)
                return;
            team = <TeamStandings noteam={true} params={{teamId: t.id}} />
        }.bind(this));
        if (team == null){
            return null;
        }
        return (
            <div className="row" key={s.id}>
                <div className={"col-xs-12 col-md-4"}>
                    <SeasonStandings notitle={true} seasonId={s.id} />
                </div>
                <div className={"col-xs-12 col-md-4"}>
                    {team}
                </div>
                <div className={"col-xs-12 col-md-4"}>
                    <SeasonLeaders params={{seasonId: s.id}} limit={5} />
                </div>
            </div>);

    },
    render: function () {
        var user = this.state.user;
        var seasonStandings = [];
        if (this.state.userTeams.length == 0 || this.state.allTeams.length == 0 || this.state.seasons.length == 0) {
            return null;
        }
        if (this.state.admin) {
            this.state.seasons.forEach(function(s) {
                if (!s.active || s.challenge)
                    return;
                seasonStandings.push(this.processSeason(s));
            }.bind(this));
        } else {
            this.getUser().handicapSeasons.forEach(function (hs) {
                var s = hs.season;
                if (!s.active || s.challenge)
                    return;
                seasonStandings.push(this.processSeason(s));
            }.bind(this));
        }
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
                <h4>Season Standings</h4>
                {seasonStandings}
            </div>
        );
    }
});

module.exports = HomeApp;