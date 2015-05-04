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
        return (
            <div className="seasonResults">
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
                <Col className="teamMatchResultDay" key={dt} xs={12} md={6}>
                    <MatchResultsOnDay matches={this.props.matches[dt]}/>
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

        this.props.matches.forEach(function(m){
            rows.push(
                <tr className="teamMatchResultRow" key={m.teamMatchId}>
                    <td>{this.getTeam(m.winner).name}</td>
                    <td>{m.winnerRacks}</td>
                    <td>{this.getTeam(m.loser).name}</td>
                    <td>{m.loserRacks}</td>
                </tr>
            )
        }.bind(this));
        return (
            <div className="teamMatchResult" >
                <Table striped >
                    <thead>
                    <th>winner</th>
                    <th>racks</th>
                    <th>opponent</th>
                    <th>racks</th>
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>
                </Table>
            </div>
        )
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
            /*
            rows.push(
                <tr className="standingRow" key={s.teamId}>
                    <td>{this.getTeam(s.teamId).name}</td>
                    <td>{s.wins}</td>
                    <td>{s.lost}</td>
                    <td>{s.racksFor}</td>
                    <td>{s.racksAgainsts}</td>
                </tr>
            );
            */
            rows.push(
                <Row className="standingRow" key={s.teamId}>
                    <Col xs={12} md={4}>{this.getTeam(s.teamId).name}</Col>
                    <Col xs={12} md={2}>{s.wins}</Col>
                    <Col xs={12} md={2}>{s.lost}</Col>
                    <Col xs={12} md={2}>{s.racksFor}</Col>
                    <Col xs={12} md={2}>{s.racksAgainsts}</Col>
                </Row>
            );
        }.bind(this));

        return (
            <Grid>
                <Row>
                    <Col className="standingsTitle" xs={12} md={12}>Standings</Col>
                </Row>
                <Row>
                    <Col xs={12} md={4}></Col>
                    <Col xs={12} md={4}>Match</Col>
                    <Col xs={12} md={4}>Racks</Col>
                </Row>
                <Row>
                    <Col xs={12} md={4}>Team</Col>
                    <Col xs={12} md={2}>W</Col>
                    <Col xs={12} md={2}>L</Col>
                    <Col xs={12} md={2}>W</Col>
                    <Col xs={12} md={2}>L</Col>
                </Row>
                <Row>
                    {rows}
                </Row>
            </Grid>
        )
    }
});
module.exports = SeasonApp;

