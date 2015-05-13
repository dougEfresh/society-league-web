var React = require('react/addons');
var Router = require('react-router')
    , State = Router.State
    , Navigation = Router.Navigation;

var Bootstrap = require('react-bootstrap')
    ,Panel = Bootstrap.Panel
    ,Button = Bootstrap.Button;

var DataStore= require('../../stores/DataStore.jsx');
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var TeamStandings = require('./TeamStandings.jsx');
var TeamChart = require('./TeamChart.jsx');
var TeamWeeklyResults = require('./TeamWeeklyResults.jsx');
var TeamMixin = require('../../mixins/TeamMixin.jsx');

var TeamApp = React.createClass({
    mixins: [UserContextMixin, TeamMixin, State, Navigation],
    componentWillMount: function () {
        DataStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function () {
        DataStore.removeChangeListener(this._onChange);
    },
    componentDidMount: function () {
        this.setState({user: this.getUser()});
    },
    _onChange: function () {
        this.setState({user: this.state.user});
    },
    onSelect: function (e) {
        this.setState({teamId: e.target.value});
    },
    onChange: function (e) {
        this.setState(
            {
                seasonId: this.getParams().seasonId,
                teamId: e.target.value
            }
        );
    },
    componentWillReceiveProps: function (o, n) {
        this.setState(
            {
                seasonId: this.getParams().seasonId,
                chart : this.getQuery().chart
            }
        );
    },
    handleClick: function() {
        var c = this.getQuery().chart;
        if (c == undefined) {
            c = false;
        } else if (c  == 'true') {
            c = false;
        } else {
            c = true;
        }
        this.transitionTo('team',this.getParams(),{chart: c});
    },
    render: function () {
        if (this.getUserId() == 0) {
            return null;
        }
        var team = this.getTeam(this.getParams().teamId);
        var chart = this.getQuery().chart;
        if (chart == undefined){ chart = 'true'}
        var header = (
            <div>
                {team.name + ' Standings'}
                <div style={{display: 'inline'}}>
                    <Button bsStyle={chart == 'true' ? 'success' : 'default'} onClick={this.handleClick}> <i className="fa fa-bar-chart"></i></Button>
                </div>
            </div>
        );

        if (chart == 'true') {
            return (
                <div id="teamApp">
                    <Panel header={header}>
                        <TeamChart teamId={this.getParams().teamId} seasonId={this.getParams().seasonId}/>
                        <TeamWeeklyResults teamId={this.getParams().teamId} seasonId={this.getParams().seasonId}/>
                    </Panel>
                </div>
            );
        }

        return (
            <div id="teamApp">
                <Panel header={header}>
                    <TeamStandings teamId={this.getParams().teamId} seasonId={this.getParams().seasonId}/>
                    <TeamWeeklyResults teamId={this.getParams().teamId} seasonId={this.getParams().seasonId}/>
                </Panel>
            </div>
        );


    }
});

module.exports = TeamApp;
