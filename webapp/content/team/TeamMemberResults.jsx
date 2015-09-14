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
    getData: function() {
        Util.getData('/api/playerresult/get/team/' + this.props.params.teamId, function(d){
            this.setState({results: d});
        }.bind(this), null,
            'TeamResults');
    },
    componentWillReceiveProps: function(n,o) {
        if (this.state.results.length == 0) {
            return;
        }
        if (this.state.teamId != this.props.params.teamId) {
            this.getData();
        }
    },
    componentDidMount: function() {
        this.getData();
    },
    render: function() {
        var rows = [];
        var teamId = this.props.params.teamId;
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
        results.forEach(function (result) {
            rows.push(<tr key={result.id}>
                <td><UserLink user={result.teamMember} handicap={result.teamMemberHandicap} season={this.props.params.seasonId} /></td>
                <td>{result.win ? 'W' : 'L'}</td>
                <td><UserLink user={result.opponent}  handicap={result.opponentHandicap} season={this.props.params.seasonId} /></td>
                <td><TeamLink team={result.opponentTeam} /></td>
                <td>{Util.formatDateTime(result.teamMatch.matchDate)}</td>
            </tr>);

        }.bind(this));
        return (
            <div className="table-responsive">
            <table className="table table-condensed table-striped table-responsive">
                <thead>
                <tr>
                    <th>Player</th>
                    <th>W/L</th>
                    <th>Opponent</th>
                    <th>Opponent Team</th>
                    <th>Date</th>
                </tr>
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


var sortDateFn = function(a,b) {
    return b.getMatchDate().localeCompare(a.getMatchDate());
};

var sortPlayerFn = function(a,b) {
    var ateamMember = a.winnersTeam.id == this.props.params.teamId ? a.winner : a.loser;
    var bteamMember = b.winnersTeam.id == this.props.params.teamId ? b.winner : b.loser;
    if (this.state.sort.sortPlayer.asc == 'true') {
        return ateamMember.name.localeCompare(bteamMember.name);
    }
    return bteamMember.name.localeCompare(ateamMember.name);
};

var sortOpponentFn  = function(a,b){
    var ateamMember = a.winnersTeam.id == this.props.params.teamId ? a.winner : a.loser;
    var bteamMember = b.winnersTeam.id == this.props.params.teamId ? b.winner : b.loser;

    if (this.state.sort.sortOpponent.asc == 'true')
        return a.getOpponent(ateamMember).name.localeCompare(b.getOpponent(bteamMember).name);
    else
        return b.getOpponent(ateamMember).name.localeCompare(a.getOpponent(bteamMember).name);
};

var sortOpponentTeamFn = function(a,b){
    var ateamMember = a.winnersTeam.id == this.props.params.teamId ? a.winner : a.loser;
    var bteamMember = b.winnersTeam.id == this.props.params.teamId ? b.winner : b.loser;
    if (this.state.sort.sortTeam.asc == 'true')
        return a.getOpponentsTeam(ateamMember).name.localeCompare(b.getOpponentsTeam(bteamMember).name);
    else
        return b.getOpponentsTeam(ateamMember).name.localeCompare(a.getOpponentsTeam(bteamMember).name);
};


var sortWinFn = function(a,b) {
    var ateamMember = a.winnersTeam.id == this.props.params.teamId ? a.winner : a.loser;
    var bteamMember = b.winnersTeam.id == this.props.params.teamId ? b.winner : b.loser;
    aWin = (a.isWinner(ateamMember) ? 'W' : 'L');
    bWin = (b.isWinner(bteamMember) ? 'W' : 'L');
    if (this.state.sort.sortWin.asc == 'true')
        return aWin.localeCompare(bWin);
    else
        return bWin.localeCompare(aWin);
};
