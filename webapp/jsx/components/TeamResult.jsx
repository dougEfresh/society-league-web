var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Route = Router.Route
    , NotFoundRoute = Router.NotFoundRoute
    , Link = Router.Link
    , DefaultRoute = Router.DefaultRoute;

var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,ButtonGroup = Bootstrap.ButtonGroup
    ,PanelGroup = Bootstrap.PanelGroup
    ,Badge = Bootstrap.Badge
    ,Table = Bootstrap.Table
    ,Nav = Bootstrap.Nav
    ,Grid = Bootstrap.Grid
    ,Row = Bootstrap.Row
    ,Col = Bootstrap.Col
    ,MenuItem = Bootstrap.MenuItem
    ,Accordion = Bootstrap.Accordion
    ,Glyphicon = Bootstrap.Glyphicon
    ,Input = Bootstrap.Input
    ,Modal = Bootstrap.Modal
    ,OverlayMixin = Bootstrap.OverlayMixin
    ,ModalTrigger = Bootstrap.ModalTrigger
    ,Panel = Bootstrap.Panel;

var DataStore= require('../stores/DataStore.jsx');
var UserContextMixin = require('../mixins/UserContextMixin.jsx');
var SeasonMixin = require('../mixins/SeasonMixin.jsx');
var TeamMixin = require('../mixins/TeamMixin.jsx');
var ResultMixin = require('../mixins/ResultMixin.jsx');
var UserLink = require('./UserLink.jsx');

var TeamResult = React.createClass({
    mixins: [ResultMixin,SeasonMixin,TeamMixin,UserContextMixin],
    getDefaultProps: function() {
        return {
            teamId: 0,
            seasonId: 0,
            teamMatchId: 0
        }
    },
    render: function(){
        if (this.props.teamId == 0 || this.props.seasonId == 0) {
            return null;
        }
        var team = this.getTeam(this.props.teamId);
        var results = this.getResults(this.props.teamMatchId);
        var teamMatch = team.getMatch(this.props.teamMatchId);
        var away = teamMatch.winner.id == team.id ? teamMatch.loser : teamMatch.winner;
        var season  = this.getSeason(this.props.seasonId);
        var nine = season.isNine();
        var rows = [];
        var key = 0;
        var matchResults =  [];
        results.forEach(function(m){
            if (m.getWinnerTeam().id == this.props.teamId) {
                matchResults.push({
                    user: m.winner,
                    opponent: m.loser,
                    racksFor: m.winnerRacks,
                    racksAgainst: m.loserRacks,
                    teamMatch: m.teamMatch,
                    win: true
                });
            } else {
                matchResults.push({
                    user: m.loser,
                    opponent: m.winner,
                    racksFor: m.loserRacks,
                    racksAgainst: m.winnerRacks,
                    teamMatch: m.teamMatch,
                    win: false
                });
            }
        }.bind(this));
        if (nine) {
            matchResults.forEach(function (m) {
                rows.push(
                    <tr key={key++}>
                        <td><UserLink user={m.user} seasonId={m.teamMatch.getSeason().id} /></td>
                        <td><UserLink user={m.opponent} seasonId={m.teamMatch.getSeason().id}/></td>
                        <td>{m.win ? 'W' : 'L'}</td>
                        <td>{m.racksFor}</td>
                        <td>{m.racksAgainst}</td>
                    </tr>);
            }.bind(this));
        } else {
             matchResults.forEach(function (m) {
                rows.push(
                    <tr key={key++}>
                        <td><UserLink user={m.user}  seasonId={m.teamMatch.getSeason().id}  /></td>
                        <td><UserLink user={m.opponent} seasonId={m.teamMatch.getSeason().id}  /></td>
                        <td>{m.win ? 'W' : 'L'}</td>
                    </tr>);
            }.bind(this));
        }

        if (nine) {
        return (
            <Table>
                <thead>
                <tr>
                    <th>{team.name}</th>
                    <th>{away.name}</th>
                    <th>W/L</th>
                    <th>RW</th>
                    <th>RL</th>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </Table>);
        }
        return (
            <Table>
                <thead>
                <tr>
                    <th>{team.name}</th>
                    <th>{away.name}</th>
                    <th>W/L</th>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </Table>
        );
    }
});


module.exports = TeamResult;