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
    getDefaultProps: function() {
        return {results: [], stats:[]};
    },
    render: function() {
        var rows = [];
        var seasonResults = {};
        this.props.results.forEach(function(r) {
            if (seasonResults[r.season.id] == undefined) {
                seasonResults[r.season.id] = [];
            }
            seasonResults[r.season.id].push(r);
        });

        for (var seasonId in seasonResults) {
            if (seasonResults.hasOwnProperty(seasonId)) {
                var seasonStat={};
                var season = seasonResults[seasonId][0].season;
                this.props.stats.forEach(function(s){
                    if ( s.season && s.season.id == season.id ) {
                        seasonStat = s;
                    }
                });
                rows.push(<SeasonResults stats={seasonStat} key={seasonId} season={season} results={seasonResults[seasonId]} />);
            }
        }
        return (
            <div id="user-results">
                {rows}
            </div>
        );

    }
});

var SeasonResults =  React.createClass({
    getDefaultProps: function() {
        return {season : null, results: []};
    },
    render: function() {
        if (this.props.results[0].season.nine) {
            return <ResultNine stats={this.props.stats} season={this.props.season} results={this.props.results}/>
        }
        return <ResultEight stats={this.props.stats} season={this.props.season} results={this.props.results}/>;
    }
});

var ResultEight = React.createClass({
     getDefaultProps: function() {
        return {season : null, results: []};
    },
    render: function() {
        var rows = [];
        this.props.results.forEach(function(r) {
            rows.push(
                <tr key={r.id}>
                <td>{r.win ? 'W' : 'L'}</td>
                <td><UserLink user={r.opponent} handicap={r.opponentHandicap} season={r.season.id} /></td>
                <td><Link to='seasonMatchResultsOnDay' params={{matchId: r.teamMatch.id, seasonId: r.season.id}}>{Util.formatDateTime(r.teamMatch.matchDate)}</Link></td>
                <td>{r.teamMemberHandicap}</td>

                </tr>);
        });
        var statDisplay = <span>{' - Record W:' + this.props.stats.wins + ' L:' + this.props.stats.loses }</span>;
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
        this.props.results.forEach(function(r) {
            rows.push(<tr key={r.id}>
                <td><Link to='seasonMatchResultsOnDay' params={{matchId: r.teamMatch.id, seasonId: r.season.id}}>{Util.formatDateTime(r.teamMatch.matchDate)}</Link></td>
                <td>{r.win ? 'W' : 'L'}</td>
                <td>{r.teamMemberRacks + ' - ' + r.opponentRacks}</td>
                <td><UserLink user={r.opponent} handicap={r.opponentHandicap} season={r.season.id} /></td>
                <td>{r.teamMemberHandicap}</td>
                </tr>);
        });
        var statDisplay = <span>{' - Record W:' + this.props.stats.wins + ' L:' + this.props.stats.loses }</span>;
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
