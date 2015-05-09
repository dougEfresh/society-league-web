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
    ,Panel = Bootstrap.Panel;

var DataStore= require('../../stores/DataStore.jsx');
var UserContextMixin = require('../../UserContextMixin.jsx');
var SeasonMixin = require('../../SeasonMixin.jsx');
var StatsMixin = require('../../StatsMixin.jsx');
var TeamMixin = require('../../TeamMixin.jsx');
var TeamLink = require('../TeamLink.jsx');

var SeasonNineStandings = React.createClass({
    mixins: [SeasonMixin,StatsMixin,TeamMixin,UserContextMixin,Router.State],
    getDefaultProps: function() {
        return {
            nine : false,
            standings: []
        }
    },
    render: function() {
        if (this.props.standings == undefined || this.props.standings.length == 0) {
            return null;
        }
        var rows = [];
        this.props.standings.forEach(function(s) {
            var teamLink = <TeamLink team={this.getTeam(s.teamId)} seasonId={this.getParams().seasonId} />;
            rows.push(
                <tr className="standingRow" key={s.teamId}>
                    <td >{teamLink}</td>
                    <td >{s.wins}</td>
                    <td >{s.lost}</td>
                    <td >{s.setWins}</td>
                    <td >{s.setLoses}</td>
                    <td >{s.racksFor}</td>
                    <td >{s.racksAgainsts}</td>
                </tr>
            );
        }.bind(this));

        return (
            <Panel header={'Standings'}>
            <Table className="seasonStandings">
                <tr>
                    <td ></td>
                    <td >Match</td>
                    <td >Set</td>
                    <td >Racks</td>
                </tr>
                <tr>
                    <td >Team</td>
                    <td >W</td>
                    <td >L</td>
                    <td >W</td>
                    <td >L</td>
                    <td >RW</td>
                    <td >RL</td>
                </tr>
                <tr>
                    {rows}
                </tr>

            </Table>
            </Panel>
        )
    }
});

module.exports = SeasonNineStandings;