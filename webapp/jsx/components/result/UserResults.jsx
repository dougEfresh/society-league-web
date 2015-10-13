var React = require('react/addons');
var UserLink = require('../links/UserLink.jsx');
var Util = require('../../util.jsx');
var Handicap = require('../../../lib/Handicap');
var SeasonLink = require('../links/SeasonLink.jsx');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Route = Router.Route
    , Link = Router.Link;

var UserResults = React.createClass({
     getInitialState: function() {
         return {
             results: [],
             stats: [],
             user: this.props.user,
             season: this.props.season
        }
    },
    componentWillMount: function() { },
    componentWillUnmount: function() { },
    componentDidMount: function() { this.getData();  },
    componentWillReceiveProps: function(nextProps) {
        this.state.user = nextProps.user;
        this.state.season = nextProps.season;
        this.getData();
    },
    getData: function() {
        Util.getData('/api/playerresult/user/' + this.state.user.id + '/' + this.state.season.id, function(d){
            this.setState({results: d});
        }.bind(this),null,'RecentMatches');
        Util.getData('/api/stat/user/' + this.state.user.id  + '/' + this.state.season.id, function(d){
            this.setState({stats: d});
        }.bind(this),null,'RecentMatches');
    },
    render: function() {
        if (this.state.results.length ==0 || this.state.stats.length == 0) {
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
            return <ResultChallenge stats={this.props.stats} season={this.props.season} results={this.props.results} limit={this.props.limit} />
        } else if (this.props.season.nine) {
            return <ResultNine stats={this.props.stats} season={this.props.season} results={this.props.results}limit={this.props.limit}  />
        }
        return <ResultEight stats={this.props.stats} season={this.props.season} results={this.props.results}limit={this.props.limit}  />;
    }
});

var ResultEight = React.createClass({
     getDefaultProps: function() {
        return {season : null, results: []};
    },
    render: function() {
        var rows = [];
        var limit = this.props.limit == null ? this.props.results.length : this.props.limit;
        for (var i = 0; i< limit && i< this.props.results.length; i++ ) {
            var r = this.props.results[i];
            rows.push(
                <tr key={r.id}>
                <td>{r.win ? 'W' : 'L'}</td>
                <td><UserLink user={r.opponent} handicap={r.opponentHandicap} season={r.season.id} /></td>
                    <td><Link to={'/app/season/'  + r.season.id  + '/teamresults/' + r.teamMatch.id }>{Util.formatDateTime(r.teamMatch.matchDate)}</Link></td>
                <td>{r.teamMemberHandicap}</td>

                </tr>);
        }
           var statDisplay = (<div>
                <span className="label label-success">{'W:' + this.props.stats.wins} </span>
                <span className="label label-danger">{'L:' + this.props.stats.loses} </span>
            </div>);
        if (this.props.stats.wins == undefined || this.props.stats.wins+this.props.stats.loses <= 0){
            statDisplay = null;
        }

        return (
             <div className="table-responsive">
                 <table className="table table-condensed table-responsive" >
                     <thead>
                     <tr>
                         <th colSpan="4">
                         <SeasonLink season={this.props.season}/>
                             {statDisplay}
                     </th>
                     </tr>
                     <tr>
                         <th>W/L</th>
                         <th>Opponent</th>
                         <th>Date</th>
                         <th>HC</th>
                     </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </table>
             </div>
        );

    }
});


var ResultNine = React.createClass({
    getDefaultProps: function() {
        return {season : null, results: []};
    },
    render: function() {
        var rows = [];
        var limit = this.props.limit == null ? this.props.results.length : this.props.limit;
        for (var i = 0; i< limit && i< this.props.results.length; i++ ) {
            var r = this.props.results[i];
            var lnk =  <Link to={'/app/season/'  + r.season.id  + '/teamresults/' + r.teamMatch.id }>{Util.formatDateTime(r.teamMatch.matchDate)}</Link>;

            if (!r.season.active) {
                lnk = <span>{Util.formatDateTime(r.teamMatch.matchDate)}</span>
            }
            rows.push(<tr key={r.id}>
                <td>
                    {lnk}
                </td>
                <td>{r.win ? 'W' : 'L'}</td>
                <td>{r.teamMemberRacks + ' - ' + r.opponentRacks}</td>
                <td><UserLink user={r.opponent} handicap={r.opponentHandicap} season={r.season.id} /></td>
                <td>{r.teamMemberHandicap}</td>
                </tr>);
        }

        var statDisplay = (<div>
                <span className="label label-success">{'W:' + this.props.stats.wins} </span>
                <span className="label label-danger">{'L:' + this.props.stats.loses} </span>
            </div>);
        if (this.props.stats.wins == undefined || this.props.stats.wins+this.props.stats.loses <= 0){
            statDisplay = null;
        }
        return (
             <div className="table-responsive">
                 <table className="table table-condensed table-responsive" >
                     <thead>
                     <tr>
                         <th colSpan="4">
                             <SeasonLink season={this.props.season}/>
                             {statDisplay}
                         </th>
                     </tr>
                     <tr>
                         <th>Date</th>
                         <th>W/L</th>
                         <th>Score</th>
                         <th>Opponent</th>
                     </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </table>
             </div>
        );

    }
});
var ResultChallenge = React.createClass({
    getDefaultProps: function() {
        return {season : null, results: []};
    },
    render: function() {
        var rows = [];
        var limit = this.props.limit == null ? this.props.results.length : this.props.limit;
        for (var i = 0; i< limit && i< this.props.results.length; i++ ) {
            var r = this.props.results[i];
            if (r == undefined) {
                continue;
            }
            rows.push(<tr key={r.id}>
                <td><Link to={'/app/season/'  + r.season.id  + '/teamresults/' + r.teamMatch.id }>{Util.formatDateTime(r.teamMatch.matchDate)}</Link></td>
                <td>{r.win ? 'W' : 'L'}</td>
                <td>{r.matchPoints ? r.matchPoints.points : '0'}</td>
                <td>{r.matchPoints ? r.matchPoints.weightedAvg.toFixed(3) : '0'}</td>
                <td>{r.matchPoints ? r.matchPoints.matchNum : '0'}</td>
                <td>{r.matchPoints ? r.matchPoints.calculation  : ''}</td>
                <td>{r.teamMemberRacks + ' - ' + r.opponentRacks}</td>
                <td><UserLink user={r.opponent} handicap={r.opponentHandicap} season={r.season.id} /></td>
                <td>{r.teamMemberHandicap}</td>
                </tr>);
        }
        var statDisplay = (<div>
                <span className="label label-success">{'W:' + this.props.stats.wins} </span>
                <span className="label label-danger">{'L:' + this.props.stats.loses} </span>
            </div>);

        if (this.props.stats.wins == undefined || this.props.stats.wins+this.props.stats.loses <= 0){
            statDisplay = null;
        }
        return (
             <div className="table-responsive">
                 <table className="table table-condensed table-responsive" >
                     <thead>
                     <tr>
                         <th colSpan="4">
                             <SeasonLink season={this.props.season}/>
                             {statDisplay}
                         </th>
                     </tr>
                     <tr>
                         <th>Date</th>
                         <th>W/L</th>
                         <th>P</th>
                         <th>Avg Points</th>
                         <th>Match #</th>
                         <th>Formula  | (Points*(10-MatchNum))/10</th>
                         <th>Score</th>
                         <th>Opponent</th>
                         <th>HC</th>
                     </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </table>
             </div>
        );

    }
});


module.exports = UserResults;
