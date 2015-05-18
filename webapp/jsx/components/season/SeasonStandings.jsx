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
var ReactTable = require('reactable').Table;
var Stat =  require('../../../lib/Stat');

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
        this.getSeasonStandings(this.props.seasonId).forEach(function (t) {
                var stat = t.getStats(this.props.seasonId);
            if (season.isNine()) {
                rows.push(
                    {
                        Team: (<TeamLink team={t} seasonId={this.props.seasonId}/>),
                        W: stat.wins,
                        L: stat.loses,
                        SW: stat.setWins,
                        SL: stat.setLoses,
                        RW: stat.racksFor,
                        RL: stat.racksAgainst,
                        PCT: stat.getWinRackPct()
                    }
                );
            } else {
                rows.push(
                    {
                        Team: (<TeamLink team={t} seasonId={this.props.seasonId}/>),
                        W: stat.wins,
                        L: stat.loses,
                        RW: stat.racksFor,
                        RL: stat.racksAgainst,
                        PCT: stat.getWinRackPct()
                    }
                );
            }

            }.bind(this));

        return (
            <ReactTable className='table' data={rows} sortable={true} />
        );
        /*
        if (season.isNine()) {
            this.getSeasonStandings(this.props.seasonId).forEach(function (t) {
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

        if (season.isNine()) {
            return (
                <Panel >
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
        */

    }
});

module.exports = SeasonStandings;
