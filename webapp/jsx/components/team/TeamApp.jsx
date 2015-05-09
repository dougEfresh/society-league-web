var React = require('react/addons');
var Router = require('react-router')
    , State = Router.State
    , Navigation = Router.Navigation;

var DataStore= require('../../stores/DataStore.jsx');
var UserContextMixin = require('../../UserContextMixin.jsx');
var TeamStandings = require('./TeamStandings.jsx');
var TeamWeeklyResults = require('./TeamWeeklyResults.jsx');

var TeamApp = React.createClass({
    mixins: [UserContextMixin,State,Navigation],
    getInitialState: function() {
        return {
            counter: 0
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