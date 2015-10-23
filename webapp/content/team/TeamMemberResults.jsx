var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Route = Router.Route
    , NotFoundRoute = Router.NotFoundRoute
    , Link = Router.Link
    , DefaultRoute = Router.DefaultRoute;

var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var UserLink = require('../../jsx/components/links/UserLink.jsx');
var TeamLink = require('../../jsx/components/links/TeamLink.jsx');
var Util = require('../../jsx/util.jsx');


var TeamResults = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
        return {
            results: [],
            teamId : this.props.params.teamId,
            update: Date.now()
        }
    },
    getData: function(id) {
        Util.getSomeData(
            {url: '/api/playerresult/get/team/' + id,
            callback : function(d){this.setState({results: d}); }.bind(this),
            module: 'TeamResults',
            router: this.props.history
        });
    },
    componentWillReceiveProps: function(n) {
        this.getData(n.params.teamId);
    },
    componentDidMount: function() {
        this.getData(this.props.params.teamId);
    },
    render: function() {
        var rows = [];
        var teamId = this.props.params.teamId;
        if (this.state.results.length == 0) {
            return null;
        }
        var results = this.state.results.sort(function(a,b) {
            var aHome = a.teamMatch.home.id == teamId;
            var bHome = b.teamMatch.home.id == teamId;
            var atm = null;
            var btm = null;
            if (aHome) {
                atm = a.playerHome;
            }  else {
                atm = a.playerAway;
            }
            if (bHome){
                btm = b.playerHome;
            }  else {
                btm = b.playerAway;
            }
            if (atm.name == btm.name) {
                return b.teamMatch.matchDate.localeCompare(a.teamMatch.matchDate);
            }

            return atm.name.localeCompare(btm.name);
        });

        var season = results[0].season;
        results.forEach(function (result) {
            if (!season.nine) {
                rows.push(<tr key={result.id}>
                    <td><UserLink user={result.teamMember} handicap={result.teamMemberHandicap}
                                  season={this.props.params.seasonId}/></td>
                    <td>{result.win ? 'W' : 'L'}</td>
                    <td><UserLink user={result.opponent} handicap={result.opponentHandicap}
                                  season={this.props.params.seasonId}/></td>
                    <td><TeamLink team={result.opponentTeam}/></td>
                    <td>{Util.formatDateTime(result.teamMatch.matchDate)}</td>
                </tr>);
            } else {
                rows.push(<tr key={result.id}>
                    <td>
                        <UserLink user={result.teamMember} handicap={result.teamMemberHandicap}
                                  season={this.props.params.seasonId}/></td>
                    <td>{result.win ? 'W' : 'L'}</td>
                    <td>{result.teamMemberRacks  + '-'  + result.opponentRacks}</td>
                    <td><UserLink user={result.opponent} handicap={result.opponentHandicap}
                                  season={this.props.params.seasonId}/></td>
                    <td><TeamLink team={result.opponentTeam}/></td>
                    <td>{Util.formatDateTime(result.teamMatch.matchDate)}</td>
                </tr>);
            }

        }.bind(this));
        var header =  ( <tr>
            <th>Player</th>
            <th>W/L</th>
            <th>Opponent</th>
            <th>Opponent Team</th>
            <th>Date</th>

        </tr>);
        if (season.nine) {
            header =  ( <tr>
            <th>Player</th>
                <th>W/L</th>
                <th>R</th>
            <th>Opponent</th>
            <th>Opponent Team</th>
            <th>Date</th>
        </tr>);
        }
        return (
            <div className="table-responsive">
            <table className="table table-condensed table-striped table-responsive">
                <thead>
                {header}
                <tbody>
                {rows}
                </tbody>
                </thead>
            </table>
            </div>
        );
    }
});

module.exports = TeamResults;