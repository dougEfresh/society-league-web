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

var ReactRouterBootstrap = require('react-router-bootstrap')
    ,NavItemLink = ReactRouterBootstrap.NavItemLink
    ,MenuItemLink = ReactRouterBootstrap.MenuItemLink;

var DataStore= require('../../stores/DataStore.jsx');
var UserContextMixin = require('../../UserContextMixin.jsx');
var SeasonMixin = require('../../SeasonMixin.jsx');
var TeamMixin = require('../../TeamMixin.jsx');
var TeamLink = require('../TeamLink.jsx');

var MatchResultsOnDay = React.createClass({
    mixins: [SeasonMixin,TeamMixin,UserContextMixin,Router.State],
     getDefaultProps: function() {
        return {
            matches: null,
            day: null
        }
    },
    render: function() {
        if (this.props.matches == null) {
            return null;
        }
        var rows = [];

        this.props.matches.forEach(function(m){
            var teamWinnerLink = <TeamLink team={this.getTeam(m.winner)} seasonId={ this.getParams().seasonId}/>;
            var teamLoserLink= <TeamLink team={this.getTeam(m.loser)} seasonId={this.getParams().seasonId}/>;
            rows.push(
                <tr className="teamMatchResultRow" key={m.teamMatchId}>
                    <td>{teamWinnerLink}</td>
                    <td>{m.winnerRacks}</td>
                    <td>{teamLoserLink}</td>
                    <td>{m.loserRacks}</td>
                </tr>
            )
        }.bind(this));
        return (
            <div className="teamMatchResult" >
                <Panel header={this.props.day.substr(0,10)}>
                <Table striped >
                    <thead>
                    <th></th>
                    <th>racks</th>
                    <th></th>
                    <th>racks</th>
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>
                </Table>
                </Panel>
            </div>
        )
    }
});

module.exports = MatchResultsOnDay;