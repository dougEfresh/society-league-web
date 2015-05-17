var React = require('react/addons');
var Router = require('react-router')
    , State = Router.State
    , Navigation = Router.Navigation;

var Bootstrap = require('react-bootstrap')
    ,Panel = Bootstrap.Panel
    ,Badge = Bootstrap.Badge
    ,Button = Bootstrap.Button;

var DataStore= require('../../stores/DataStore.jsx');
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var TeamStandings = require('./TeamStandings.jsx');
var TeamChart = require('./TeamChart.jsx');
var TeamWeeklyResults = require('./TeamWeeklyResults.jsx');
var TeamMixin = require('../../mixins/TeamMixin.jsx');
var SeasonMixin = require('../../mixins/SeasonMixin.jsx');

var TeamApp = React.createClass({
    mixins: [UserContextMixin, TeamMixin, SeasonMixin, State, Navigation],
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
        console.log(e.target.value);
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
        var stats = team.getStats(this.getParams().seasonId);
        var standings = this.getSeasonStandings(this.getParams().seasonId);
        var rank = 0;
        for(; rank < standings.length; rank++ ) {
            if (standings[rank].teamId == this.getParams().teamId) {
                rank++;
                break;
            }
        }
        if (stats.matches == 0){
            rank = 0;
        }
        var teamHeader = (<span>{team.name}</span>);
        if (rank > 0) {
            teamHeader = (<span>{team.name + ' - Rank '}<Badge>{rank}</Badge> </span>);
        }
        var header = (
            <div>
                {teamHeader}
                <div style={{display: 'inline'}}>
                    <Button bsStyle={chart == 'true' ? 'success' : 'default'} onClick={this.handleClick}><i className="fa fa-bar-chart"></i></Button>
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
