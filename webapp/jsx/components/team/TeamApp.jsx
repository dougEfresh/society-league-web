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

var TeamApp = React.createClass({
    mixins: [TeamMixin,StatsMixin,UserContextMixin],
    getInitialState: function () {
        return {
            user: this.getUser(),
            teamId: this.getContextParam('teamId'),
            seasonId: this.getContextParam('seasonId')
        }
    },
    componentWillMount: function () {
        DataStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function () {
        DataStore.removeChangeListener(this._onChange);
    },
    componentDidMount: function () {
        this.setState({user: this.getUser()});
    },
    _onChange: function() {
        this.setState({user: this.state.user});
    },
    onSelect: function(e) {
        console.log(e.target.value);
        this.setState({teamId:e.target.value});
        //this.redirect('team',{userId: this.getUserId(),teamId: e.target.value, seasonId: this.state.seasonId})
    },
    renderBody: function() {
        var standing = {};
        var teamStats = this.getSeasonTeamStats(this.state.seasonId);
        teamStats.forEach(function (s) {
            if (s.teamId == this.state.teamId) {
                standing = s;
            }
        }.bind(this));
        var rows = [];
        rows.push(<tr key={'all'}>
            <td>All</td>
            <td>{standing.wins}</td>
            <td>{standing.lost}</td>
            <td>{standing.racksFor}</td>
            <td>{standing.racksAgainsts}</td>
        </tr>);

        var users = this.getTeamUsers(this.state.teamId,this.state.seasonId);
        var userStats = [];
        users.forEach(function(u) {
            var s = this.getUserStats(u);
            s.season.forEach(function(season) {
                if (season.seasonId == this.state.seasonId) {
                    userStats.push(season)
                }
            }.bind(this));
        }.bind(this));
        userStats.forEach(function(stat) {
            rows.push(<tr key={stat.userId}>
            <td>{this.getUser(stat.userId).name}</td>
            <td>{stat.wins}</td>
            <td>{stat.loses}</td>
            <td>{stat.racksFor}</td>
            <td>{stat.racksAgainst}</td>
        </tr>)
        }.bind(this));
        return (
        {rows}
        )
    },
    render: function() {
        if (this.state.user.id == 0 || this.state.teamId == undefined || this.state.seasonId == undefined) {
            return null;
        }
        var rows=[];
        this.getTeamsBySeason(this.state.seasonId).forEach(function(t) {
            rows.push(<option key={t.teamId} value={t.teamId}>{t.name}</option>)
        });
        var teams = (<Input onChange={this.onSelect}  type={'select'} value={this.state.teamId}>{rows}</Input>);
        return (
            <div className="teamApp">
            <Panel header={this.getTeam(this.state.teamId).name + ' Standings'}>
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
                </div>
        );
    }
});

var TeamPicker = React.createClass({
    mixins: [TeamMixin,StatsMixin,UserContextMixin],
    getDefaultProps: function(){
        return {
            teamId: null,
            seasonId: null
        }
    },
    render: function() {
        if (this.props.teamId == null || this.props.seasonId == null) {
            return null;
        }

    }
});

var TeamStandings = React.createClass({
    mixins: [StatsMixin, SeasonMixin, TeamMixin, UserContextMixin],
    getDefaultProps: function () {
        return {
            teamId: null,
            seasonId: null
        }
    },
    render: function () {
        if (this.props.teamId == null) {
            return null;
        }
        var standing = {};
        var teamStats = this.getSeasonTeamStats(this.props.seasonId);
        teamStats.forEach(function (s) {
            if (s.teamId == this.props.teamId) {
                standing = s;
            }
        }.bind(this));
        var rows = [];
        rows.push(<tr key={'all'}>
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
        userStats.forEach(function(stat) {
            rows.push(<tr key={stat.userId}>
            <td>{this.getUser(stat.userId).name}</td>
            <td>{stat.wins}</td>
            <td>{stat.loses}</td>
            <td>{stat.racksFor}</td>
            <td>{stat.racksAgainst}</td>
        </tr>)
        }.bind(this));
        return (
                {rows}
        )
    }
});

module.exports = TeamApp;