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
var TeamLink = require('../TeamLink.jsx');
var DivisionConstants = require('../../constants/DivisionConstants.jsx');

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
    componentWillReceiveProps: function() {
        this.setState({seasonId: this.getContextParam('seasonId')});
    },
    /*
    shouldComponentUpdate: function(nextProps, nextState) {
        if (this.getContextParam('seasonId') != this.state.seasonId) {
            this.state.seasonId = this.getContextParam('seasonId') ;
            return true;
        }
        return false;
    },
    */
    _onChange: function() {
        console.log('onchange');
        this.setState({user: this.state.user});
    },
    render: function() {
        if (this.state.user.id == 0) {
            return null;
        }
        var division = DataStore.getDivisionBySeason(this.state.seasonId);

        return (
            <div id="seasonApp" className="seasonResults">
                <SeasonStandings nine={division.type == DivisionConstants.NINE_BALL_TUESDAYS} standings={this.getSeasonTeamStats(this.state.seasonId)}/>
                <SeasonWeeklyResults matches={this.getMatches(this.state.seasonId)} />
            </div>
        );
    }
});

var SeasonWeeklyResults = React.createClass({
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
        var cols = [];
        var rows = [];
        for(var dt in this.props.matches) {
            cols.push(
                <Col className="teamMatchResultDay" key={dt} xs={6}>
                    <MatchResultsOnDay day={dt} matches={this.props.matches[dt]}/>
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
    mixins: [SeasonMixin,TeamMixin,UserContextMixin],
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
            var teamWinnerLink = <TeamLink team={this.getTeam(m.winner)} seasonId={ this.getContextParam('seasonId')}/>;
            var teamLoserLink= <TeamLink team={this.getTeam(m.loser)} seasonId={ this.getContextParam('seasonId')}/>;
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

var SeasonStandings = React.createClass({
    mixins: [SeasonMixin,StatsMixin,TeamMixin,UserContextMixin],
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
        if (this.props.nine) {
            return <SeasonNineStandings standings={this.props.standings} />
        }

        return <SeasonEightStandings standings={this.props.standings} />
    }
});

var SeasonEightStandings = React.createClass({
    mixins: [SeasonMixin,StatsMixin,TeamMixin,UserContextMixin],
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
            // xs={12}
            var teamLink = <TeamLink team={this.getTeam(s.teamId)} seasonId={this.getContextParam('seasonId')} />;
            rows.push(
                <tr className="standingRow" key={s.teamId}>
                    <td >{teamLink}</td>
                    <td >{s.wins}</td>
                    <td >{s.lost}</td>
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
                    <td >Racks</td>
                </tr>
                <tr>
                    <td >Team</td>
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

var SeasonNineStandings = React.createClass({
    mixins: [SeasonMixin,StatsMixin,TeamMixin,UserContextMixin],
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
            // xs={12}
            var teamLink = <TeamLink team={this.getTeam(s.teamId)} seasonId={this.getContextParam('seasonId')} />;
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


module.exports = SeasonApp;

