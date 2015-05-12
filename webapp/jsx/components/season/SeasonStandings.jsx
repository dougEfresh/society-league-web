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
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var SeasonMixin = require('../../mixins/SeasonMixin.jsx');
var StatsMixin = require('../../mixins/StatsMixin.jsx');
var TeamMixin = require('../../mixins/TeamMixin.jsx');
var TeamLink = require('../TeamLink.jsx');

var SeasonStandings = React.createClass({
    mixins: [SeasonMixin,StatsMixin,TeamMixin,UserContextMixin],
    getDefaultProps: function() {
        return {
            nine : false,
            seasonId: 0,
            standings: []
        }
    },  render: function() {
        if (this.props.standings == undefined || this.props.standings.length == 0) {
            return null;
        }
        var rows = [];
        if (this.props.nine) {
            this.props.standings.forEach(function (s) {
                var teamLink = <TeamLink team={this.getTeam(s.teamId)} seasonId={this.props.seasonId}/>;
                var pct = 0;
                var racksTotal = s.racksFor + s.racksAgainsts;
                if (racksTotal != 0) {
                    pct = s.racksAgainsts / racksTotal;
                }
                rows.push(
                    <tr className="standingRow" key={s.teamId}>
                        <td>{teamLink}</td>
                        <td>{s.wins}</td>
                        <td>{s.lost}</td>
                        <td>{s.setWins}</td>
                        <td>{s.setLoses}</td>
                        <td>{s.racksFor}</td>
                        <td>{s.racksAgainsts}</td>
                        <td>{pct.toFixed(3)}</td>
                    </tr>
                );

            }.bind(this));
        } else {
               this.props.standings.forEach(function (s) {
                var teamLink = <TeamLink team={this.getTeam(s.teamId)} seasonId={this.props.seasonId}/>;
                var pct = 0;
                var racksTotal = s.racksFor + s.racksAgainsts;
                if (racksTotal != 0) {
                    pct = s.racksAgainsts / racksTotal;
                }
                rows.push(
                    <tr className="standingRow" key={s.teamId}>
                        <td>{teamLink}</td>
                        <td>{s.wins}</td>
                        <td>{s.lost}</td>
                        <td>{s.racksFor}</td>
                        <td>{s.racksAgainsts}</td>
                        <td>{pct.toFixed(3)}</td>
                    </tr>
                );

            }.bind(this));
        }
        if (this.props.nine) {
            return (
                <Panel header={'Standings'}>
                    <Table className="seasonStandings">
                        <thead>
                        <tr>
                            <th ></th>
                            <th >Match</th>
                            <th >Set</th>
                            <th >Racks</th>
                        </tr>
                        <tr>
                            <th >Team</th>
                            <th >W</th>
                            <th >L</th>
                            <th >W</th>
                            <th >L</th>
                            <th >RW</th>
                            <th >RL</th>
                            <th >PCT</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows}
                        </tbody>
                    </Table>
                </Panel>
            )
        } else {
            return (
                <Panel header={'Standings'}>
                    <Table className="seasonStandings">
                        <thead>
                        <tr>
                            <th ></th>
                            <th >Match</th>
                            <th >Racks</th>
                        </tr>
                        <tr>
                            <th >Team</th>
                            <th >W</th>
                            <th >L</th>
                            <th >RW</th>
                            <th >RL</th>
                            <th >PCT</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows}
                        </tbody>
                    </Table>
                </Panel>
            );
        }
    }
});

module.exports = SeasonStandings;