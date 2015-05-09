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
var UserContextMixin = require('../UserContextMixin.jsx');
var SeasonMixin = require('../SeasonMixin.jsx');
var TeamMixin = require('../TeamMixin.jsx');
var ResultMixin = require('../ResultMixin.jsx');
var UserLink = require('./UserLink.jsx');

var TeamResult = React.createClass({
    mixins: [ResultMixin,SeasonMixin,TeamMixin,UserContextMixin],
    getDefaultProps: function() {
        return {
            teamId: 0,
            seasonId: 0,
            teamMatchId: 0,
            router: null
        }
    },
    render: function(){
        if (this.props.teamId == 0 || this.props.seasonId == 0) {
            return null;
        }
        var matches = this.getTeamResults(this.props.seasonId,this.props.teamId,this.props.teamMatchId);
        var rows = [];
        var key = 0;
        var nine = this.getDivision(this.props.seasonId).type.toLowerCase().indexOf('nine') >=0;
        if (nine) {
            matches.forEach(function (m) {
                rows.push(
                    <tr key={key++}>
                        <td><UserLink user={this.getUser(m.userId)}/></td>
                        <td><UserLink user={this.getUser(m.opponent)}/></td>
                        <td>{m.racksFor > m.racksAgainst ? 'W' : 'L'}</td>
                        <td>{m.racksFor}</td>
                        <td>{m.racksAgainst}</td>
                    </tr>);
            }.bind(this));
        } else {
             matches.forEach(function (m) {
                rows.push(
                    <tr key={key++}>
                        <td><UserLink user={this.getUser(m.userId)}/></td>
                        <td><UserLink user={this.getUser(m.opponent)}/></td>
                        <td>{m.racksFor > m.racksAgainst ? 'W' : 'L'}</td>
                    </tr>);
            }.bind(this));
        }
        var teamMatch = this.getTeamMatch(this.props.seasonId,this.props.teamMatchId);
        var away = "";
        if (teamMatch.winner == this.props.teamId)
            away = this.getTeam(teamMatch.loser).name;
        else
            away = this.getTeam(teamMatch.winner).name;
        if (nine) {
        return (
            <Table>
                <thead>
                <tr>
                    <th>{this.getTeam(this.props.teamId).name}</th>
                    <th>{away}</th>
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
                    <th>{this.getTeam(this.props.teamId).name}</th>
                    <th>{away}</th>
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