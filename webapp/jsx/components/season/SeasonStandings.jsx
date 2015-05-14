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
            seasonId: 0
        }
    },
    render: function() {
        var season = this.getSeason(this.props.seasonId);
        var rows = [];
        if (season.isNine()) {
            var standings = this.getSeasonStandings(this.props.seasonId).forEach(function (t) {
                var teamLink = <TeamLink team={t} seasonId={this.props.seasonId}/>;
                var s = t.getStats(this.props.seasonId);
                var pct = 0;
                var racksTotal = s.racksFor + s.racksAgainst;
                if (racksTotal != 0) {
                    pct = s.racksAgainst / racksTotal;
                }
                rows.push(
                    <tr className="standingRow" key={t.id}>
                        <td>{teamLink}</td>
                        <td>{s.wins}</td>
                        <td>{s.loses}</td>
                        <td>{s.setWins}</td>
                        <td>{s.setLoses}</td>
                        <td>{s.racksFor}</td>
                        <td>{s.racksAgainst}</td>
                        <td>{pct.toFixed(3)}</td>
                    </tr>
                );

            }.bind(this));
        } else {
            var teamStandings = this.getSeasonStandings(this.props.seasonId);
            for (var i = 0; i< teamStandings.length; i++) {
                       var t = teamStandings[i];
                       var teamLink = <TeamLink team={t} seasonId={this.props.seasonId}/>;
                       var s = t.getStats(this.props.seasonId);
                       var pct = 0;
                       var racksTotal = s.racksFor + s.racksAgainst;
                       if (racksTotal != 0) {
                           pct = s.racksAgainst / racksTotal;
                       }
                       rows.push(
                    <tr className="standingRow" key={t.id}>
                        <td>{teamLink}</td>
                        <td>{s.wins}</td>
                        <td>{s.loses}</td>
                        <td>{s.racksFor}</td>
                        <td>{s.racksAgainst}</td>
                        <td>{pct.toFixed(3)}</td>
                    </tr>
                );

                   }
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
