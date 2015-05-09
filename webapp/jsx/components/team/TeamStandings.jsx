var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Route = Router.Route
    , NotFoundRoute = Router.NotFoundRoute
    , Link = Router.Link
    , State = Router.State
    , Navigation = Router.Navigation
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

var ReactRouterBootstrap = require('react-router-bootstrap')
    ,NavItemLink = ReactRouterBootstrap.NavItemLink
    ,MenuItemLink = ReactRouterBootstrap.MenuItemLink;

var ChallengeStore = require('../../stores/ChallengeStore.jsx');
var DataStore= require('../../stores/DataStore.jsx');
var ChallengeStatus = require('../../constants/ChallengeStatus.jsx');
var UserContextMixin = require('../../UserContextMixin.jsx');
var SeasonMixin = require('../../SeasonMixin.jsx');
var StatsMixin = require('../../StatsMixin.jsx');
var TeamMixin = require('../../TeamMixin.jsx');
var ResultMixin = require('../../ResultMixin.jsx');
var TeamLink = require('../TeamLink.jsx');
var UserLink = require('../UserLink.jsx');

var TeamStandings = React.createClass({
    mixins: [TeamMixin,StatsMixin,UserContextMixin,Router.state],
    renderBody: function() {
        var standing = {};
        var teamStats = this.getSeasonTeamStats(this.props.seasonId);
        teamStats.forEach(function (s) {
            if (s.teamId == this.props.teamId) {
                standing = s;
            }
        }.bind(this));
        var teamRow = [];
        teamRow.push(<tr key={'all'}>
            <td>All</td>
            <td>{standing.wins}</td>
            <td>{standing.lost}</td>
            <td>{standing.racksFor}</td>
            <td>{standing.racksAgainsts}</td>
        </tr>);

        var users = this.getTeamUsers(this.props.teamId,this.props.seasonId);
        var userStats = [];
        users.forEach(function(u) {
            var s = this.getUserStats(u);
            s.season.forEach(function(season) {
                if (season.seasonId == this.props.seasonId) {
                    userStats.push(season)
                }
            }.bind(this));
        }.bind(this));
           var i = 0;
        userStats.forEach(function(stat) {
            teamRow.push(<tr key={i++}>
            <td>
                <UserLink user={this.getUser(stat.userId)} />
            </td>
            <td>{stat.wins}</td>
            <td>{stat.loses}</td>
            <td>{stat.racksFor}</td>
            <td>{stat.racksAgainst}</td>
        </tr>)
        }.bind(this));
        return (<div>{teamRow}</div>);
    },
    render: function() {
        var options=[];
        this.getTeamsBySeason(this.props.seasonId).forEach(function(t) {
            options.push(<option key={t.teamId} value={t.teamId}>{t.name}</option>)
        });
        var teams = (<Input onSelect={this.props.onChange}  type={'select'} value={this.props.teamId}>{options}</Input>);
        return (
            <Panel header={this.getTeam(this.props.teamId).name + ' Standings'}>
                {teams}
                <Table>
                    <thead>
                    <th></th>
                    <th>W</th>
                    <th>L</th>
                    <th>RF</th>
                    <th>RG</th>
                    </thead>
                    <tbody>
                    {this.renderBody()}
                    </tbody>
                </Table>
            </Panel>

        );
    }
});


module.exports = TeamStandings;