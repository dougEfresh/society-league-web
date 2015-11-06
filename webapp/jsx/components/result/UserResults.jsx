var React = require('react/addons');
var UserLink = require('../links/UserLink.jsx');
var Util = require('../../util.jsx');
var Handicap = require('../../../lib/Handicap');
var SeasonLink = require('../links/SeasonLink.jsx');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Route = Router.Route
    , Link = Router.Link;
var DataGridUtil = require('../../../lib/DataGridUtil.jsx');
var ResultChallenge = require('./ResultChallenge.jsx');
var ResultEight = require('./ResultEight.jsx');
var ResultNine = require('./ResultNine.jsx');
var ResultScramble = require('./ResultScramble.jsx');

var UserResults = React.createClass({
     getInitialState: function() {
         return {
             results: [],
             stats: [],
             user: this.props.user,
             season: this.props.season
        }
    },
    componentDidMount: function() { this.getData();  },
    componentWillReceiveProps: function(nextProps) {
        if (nextProps.user == undefined || nextProps.season == undefined) {
            this.setState({user:null});
            return;
        }
        if (this.state.user == undefined || this.state.season == undefined || this.state.season == null || this.state.user == null) {
            this.state.user = nextProps.user;
            this.state.season = nextProps.season;
            this.getData();
            return;
        }
        if (this.state.user.id != nextProps.user.id  || this.state.season.id != nextProps.season.id ){
            this.state.user = nextProps.user;
            this.state.season = nextProps.season;
            this.getData();
            return;
        }

    },
    getData: function() {
        if (this.state.user == null || this.state.user == undefined || this.state.season == null || this.state.season == undefined) {
            return;
        }
        var cb = function (d) {
            if (this.props.onUserClick) {
                d.forEach(function(d) {
                    d.opponent.onClick = this.props.onUserClick(d.opponent);
                    if (d.partner)
                        d.partner.onClick = this.props.onUserClick(d.partner);
                    if (d.opponentPartner)
                        d.opponentPartner.onClick = this.props.onUserClick(d.opponentPartner);
                }.bind(this));
            }
            this.setState({results: d});
        }.bind(this);

        Util.getSomeData(
            { url:'/api/playerresult/user/' + this.state.user.id + '/' + this.state.season.id,
                callback: cb , module: 'UserResult'}
        );
        Util.getSomeData({url: '/api/stat/user/' + this.state.user.id  + '/' + this.state.season.id,
            callback: function(d){this.setState({stats: d});}.bind(this), module: 'UserResult'}
        );
    },
    render: function() {
        if (this.state.user == null || this.state.user == undefined || this.state.results.length == 0 || this.state.stats.length == 0) {
            return null;
        }
        return (
            <div id="user-results">
                <SeasonResults limit={this.props.limit}
                               stats={this.state.stats}
                               season={this.state.season}
                               results={this.state.results}
                    />
                </div>
        );

    }
});

var SeasonResults =  React.createClass({
    getDefaultProps: function() {
        return {season : null, results: []};
    },
    render: function() {
        if (this.props.season.challenge) {
            return <ResultChallenge  stats={this.props.stats} season={this.props.season} results={this.props.results} limit={this.props.limit} />
        } else if (this.props.season.nine) {
            return <ResultNine  stats={this.props.stats} season={this.props.season} results={this.props.results}limit={this.props.limit}  />
        } else if (this.props.season.scramble) {
            return <ResultScramble stats={this.props.stats} season={this.props.season} results={this.props.results}limit={this.props.limit}  />;
        }
        return <ResultEight stats={this.props.stats} season={this.props.season} results={this.props.results}limit={this.props.limit}  />;
    }
});

module.exports = UserResults;
