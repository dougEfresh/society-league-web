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
var StatsMixin = require('../../StatsMixin.jsx');
var TeamMixin = require('../../TeamMixin.jsx');

var SeasonApp = React.createClass({
    mixins: [UserContextMixin,SeasonMixin,StatsMixin,TeamMixin],
    getInitialState: function () {
        return {
            user: this.getUser(),
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
        console.log('onchange');
        this.setState({user: this.state.user});
    },
    render: function() {
        if (this.state.user.id == 0) {
            return null;
        }
        var matches = this.getMatches(this.state.seasonId);
        var display = [];
        matches.forEach(function(m) {
            display.push(<div key={m.id} >{DataStore.getTeam([m.home]).name + " vs " + DataStore.getTeam([m.away]).name}</div>);
        }.bind(this));
        var standings = this.getSeasonTeamStats(this.state.seasonId);
        standings.forEach(function(s) {
            display.push(<div key={s.team_id}>{s.wins + ' ' + s.loses}</div>)
        });
        return (
            <div>
                <SeasonStandings standings={this.getSeasonTeamStats(this.state.seasonId)}/>
                <SeasonWeeklyResults matches={this.getMatches(this.state.seasonId)} />
            </div>
        );
    }
});

var SeasonWeeklyResults = React.createClass({
    mixins: [SeasonMixin,TeamMixin],
    getDefaultProps: function() {
        return {
            matches: []
        }
    },
    render: function() {
        if (this.props.matches.length == 0) {
            return null;
        }
        var matchesByDate = {};
        this.props.matches.forEach(function(m) {
            if (matchesByDate[m.matchDate] == undefined) {
                matchesByDate[m.matchDate] = [];
            }
            matchesByDate[m.matchDate].push(m);
        });

        var cols = [];
        var rows = [];
        for(var dt in matchesByDate) {
            cols.push(
                <Col key={dt} xs={12} md={6}>
                    <MatchResultsOnDay matches={matchesByDate[dt]}/>
                </Col>
            );
        }
        for (var i=0; i< cols.length; i=i+2) {
            if (i+1 >= cols.length) {
                rows.push(
                    <Row key={i}>
                        {cols[i]}
                    </Row>);
            } else {
                rows.push(
                    <Row key={i}>
                        {cols[i]}
                        {cols[i+1]}
                    </Row>);
            }
        }
        return (
            <Grid>
                {rows}
            </Grid>
        );
    }
});

var MatchResultsOnDay = React.createClass({
    mixins: [SeasonMixin,TeamMixin],
     getDefaultProps: function() {
        return {
            matches: null
        }
    },
    render: function() {
        if (this.props.matches == null) {
            return null;
        }
        var rows = [];
        
        return (<div>{this.props.matches[0].matchDate}</div>)
    }
});

var SeasonStandings = React.createClass({
    mixins: [SeasonMixin,StatsMixin,TeamMixin],
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
            rows.push(
                <tr className="standingRow" key={s.teamId}>
                    <td>{this.getTeam(s.teamId).name}</td>
                    <td>{s.wins}</td>
                    <td>{s.lost}</td>
                    <td>{s.racksFor}</td>
                    <td>{s.racksAgainsts}</td>
                </tr>
            );
        }.bind(this));

        return (
            <Table className="seasonTeamStandings" >
                <thead>
                <th className="standingsHeader">Standings</th>
                </thead>
                <tbody>
                <tr className="standingTitle">
                    <td>Team</td>
                    <td>Match</td>
                    <td>Racks</td>
                </tr>
                <tr calssName="standingIndicator">
                    <td></td>
                    <td>W</td>
                    <td>L</td>
                    <td>W</td>
                    <td>L</td>
                </tr>
                {rows}
                </tbody>
            </Table>
        )
    }
});
module.exports = SeasonApp;