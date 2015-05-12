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
                seasonId: this.getParams().seasonId,
                teamId: e.target.value
            }
        );
    },
    componentWillReceiveProps: function(o,n) {
	this.setState({seasonId: this.getParams().seasonId});
    },
    render: function() {
        if (this.getUserId() == 0) {
            return null;
        }
        return  (
            <div id="teamApp">
                <TeamStandings teamId={this.getParams().teamId} seasonId={this.getParams().seasonId} />
                <TeamWeeklyResults teamId={this.getParams().teamId} seasonId={this.getParams().seasonId} />
            </div>
        );
module.exports = TeamApp;
