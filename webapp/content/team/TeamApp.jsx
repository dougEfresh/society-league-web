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
var Util = require('../../jsx/util.jsx');

var TeamApp = React.createClass({
    mixins: [UserContextMixin, TeamMixin, SeasonMixin, State, Navigation],
     getInitialState: function() {
         return {
             data: {}
        }
    },
    componentWillMount: function () {
        //DataStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function () {
        //DataStore.removeChangeListener(this._onChange);
    },
    componentDidMount: function () {
        Util.getData('/api/team/' + this.getParams().teamId, function(d){
            this.setState({data: d});
        }.bind(this));
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
       Util.getData('/api/team/' + this.getParams().teamId, function(d){
            this.setState({data: d});
        }.bind(this));
    },
    handleClick: function() {
        this.transitionTo('teamChart',this.getParams());
    },
    showResults: function() {
        this.transitionTo('teamResults',this.getParams());
    },
    render: function () {
        var user = this.getUser();
        var team = this.state.data;

        if (team.id == undefined) {
            return null;
        }
        var teamHeader = (<h2>{team.name}</h2>);
        var header = (
                <div style={{display: 'inline'}}>
                    <Link to='teamStandings' params={this.getParams()}>
                        <button className={this.isActive('teamStandings') ? 'btn btn-success' : 'btn btn-default'}>
                            <i className="fa fa-users"></i><span className="main-item">{ ' Standings'}</span>
                        </button>
                    </Link>
                    <Link to='teamMemberResults' params={this.getParams()}>
                        <button  className={this.isActive('teamMemberResults') ? 'btn btn-success' : 'btn btn-default'}>
                            <i className="fa  fa-list-ol"></i><span className="main-item">{ ' Results'}</span>
                        </button>
                    </Link>
                    <Link to='teamChart' params={this.getParams()}>
                        <button   className={this.isActive('teamChart') ? 'btn btn-success' : 'btn btn-default'}>
                            <i className="fa fa-bar-chart"></i><span className="main-item">{ ' Chart'}</span>
                        </button>
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
