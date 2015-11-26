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
             results: this.props.results,
             stats: this.props.stats,
             user: this.props.user,
             season: this.props.season,
             animateClose: false,
             animateOpen : true
        }
    },
    componentDidMount: function() {
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState({user: nextProps.user, results: nextProps.results, season: nextProps.season});
    },
    render: function() {
        var cls = "";
        if (this.state.animateClose){
            this.state.animateClose = false;
            cls += " animate-close";
        }

        if (this.state.animateOpen){
            this.state.animateOpen = false;
            cls += " animate-open";
        }

        return (
            <div id="user-results" className={cls}>
                <SeasonResults
                    params={this.props.params}
                    limit={this.props.limit}
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
        return <ResultEight stats={this.props.stats} season={this.props.season} results={this.props.results} limit={this.props.limit}  />;
    }
});

module.exports = UserResults;
