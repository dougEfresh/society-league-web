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
var TeamStandings = require('./TeamStandings.jsx');
var TeamWeeklyResults = require('./TeamWeeklyResults.jsx');

var TeamApp = React.createClass({
    mixins: [TeamMixin,StatsMixin,UserContextMixin,State,Navigation],
    getInitialState: function() {
        return {
            counter: 0
        }
    },
    componentWillMount: function () {
        console.log('Mount');
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
    onChange: function(e) {
        this.setState(
            {
                seasonId: this.getParams('seasonId'),
                teamId: e.target.value
            }
        );
    },
    componentWillReceiveProps: function(o,n) {
        var c = this.state.counter;
        c++;
        this.setState({counter: c});
    },
    render: function() {
        console.log('Counter: ' + this.state.counter);

        if (this.state.counter % 2 == 0) {
            return (<TeamAppSwitchOdd  teamId={this.getParams().teamId} seasonId={this.getParams().seasonId} />);
        } else {
            return (<TeamAppSwitchEven  teamId={this.getParams().teamId} seasonId={this.getParams().seasonId} />);
        }
    }
});

var TeamAppSwitchOdd = React.createClass({
    render: function() {
        if (this.props.teamId == undefined || this.props.seasonId == undefined) {
            return null;
        }
        return (
                <div id="teamApp">
                    <TeamStandingsOdd teamId={this.props.teamId} seasonId={this.props.seasonId} />
                    <TeamWeeklyOdd teamId={this.props.teamId} seasonId={this.props.seasonId} />
                </div>
            );
    }
});
var TeamAppSwitchEven = React.createClass({
    render: function() {
        return (
            <div id="teamApp">
                <TeamStandingsEven onChange={this.onChange} teamId={this.props.teamId} seasonId={this.props.seasonId} />
                <TeamWeeklyEven teamId={this.props.teamId} seasonId={this.props.seasonId} />
            </div>
        );
    }
});
var TeamStandingsOdd = React.createClass({
    render: function() {
        return ( <TeamStandings onChange={this.onChange} teamId={this.props.teamId} seasonId={this.props.seasonId} />);
    }
});
var TeamStandingsEven = React.createClass({
    render: function() {
        return ( <TeamStandings onChange={this.onChange} teamId={this.props.teamId} seasonId={this.props.seasonId} />);
    }
});
var TeamWeeklyOdd = React.createClass({
    render: function() {
        return ( <TeamWeeklyResults teamId={this.props.teamId} seasonId={this.props.seasonId} />);
    }
});

var TeamWeeklyEven = React.createClass({
    render: function() {
        return ( <TeamWeeklyResults teamId={this.props.teamId} seasonId={this.props.seasonId} />);
    }
});

module.exports = TeamApp;