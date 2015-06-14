var React = require('react/addons');
var Router = require('react-router')
    , State = Router.State
    , Navigation = Router.Navigation
    , Link = Router.Link
    , RouteHandler = Router.RouteHandler;

var DataStore= require('../../jsx/stores/DataStore.jsx');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var TeamStandings = require('./TeamStandings.jsx');
var TeamChart = require('./TeamChart.jsx');
var TeamWeeklyResults = require('./TeamWeeklyResults.jsx');
var TeamMixin = require('../../jsx/mixins/TeamMixin.jsx');
var SeasonMixin = require('../../jsx/mixins/SeasonMixin.jsx');

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
        this.transitionTo('teamChart',this.getParams());
    },
    showResults: function() {
        this.transitionTo('teamResults',this.getParams());
    },
    render: function () {
        if (this.getUserId() == 0) {
            return null;
        }
        var team = this.getTeam(this.getParams().teamId);
        var chart = this.getQuery().chart;
        if (chart == undefined){ chart = 'false'}
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
        var teamHeader = (<h2>{team.name}</h2>);
        if (rank > 0) {
            teamHeader = (<h2>{team.name + ' - Rank '}<Badge>{rank}</Badge> </h2>);
        }
        var header = (
                <div style={{display: 'inline'}}>
                    <Link to='teamStandings' params={this.getParams()}>
                        <Button bsStyle={this.isActive('teamStandings') ? 'success' : 'default'} responsize>
                            <i className="fa fa-users"></i><span className="main-item">{ ' Standings'}</span>
                        </Button>
                    </Link>
                    <Link to='teamWeeklyResults' params={this.getParams()}>
                        <Button bsStyle={this.isActive('teamWeeklyResults') ? 'success' : 'default'} responsize>
                            <i className="fa fa-calendar"></i><span className="main-item">{ ' Weekly Results'}</span>
                        </Button>
                    </Link>
                    <Link to='teamMemberResults' params={this.getParams()}>
                        <Button bsStyle={this.isActive('teamMemberResults') ? 'success' : 'default'} responsive>
                            <i className="fa  fa-list-ol"></i><span className="main-item">{ ' Results'}</span>
                        </Button>
                    </Link>
                    <Link to='teamChart' params={this.getParams()}>
                        <Button bsStyle={this.isActive('teamChart') ? 'success' : 'default'} responsize>
                            <i className="fa fa-bar-chart"></i><span className="main-item">{ ' Chart'}</span>
                        </Button>
                    </Link>
                </div>
        );

            return (
                <div id="team-app">
                    {teamHeader}
                    {header}
                    <RouteHandler />
            </div>
        );


    }
});

module.exports = TeamApp;
