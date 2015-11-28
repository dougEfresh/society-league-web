var React = require('react/addons');
var Util = require('../../jsx/util.jsx');
var MatchHelper = require('../../lib/MatchHelper');
var TeamLink = require('../../jsx/components/links/TeamLink.jsx');
var UserLink = require('../../jsx/components/links/UserLink.jsx');
var Router = require('react-router')
    , Route = Router.Route
    , Link = Router.Link;
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var LoadingApp = require('../../jsx/components/LoadingApp.jsx');
var moment = require('moment');
var Handicap = require('../../lib/Handicap');

var teamOptions = [];
var options=[];

var DataGrid = require('../../lib/DataGrid.jsx');
var DataGridUtil = require('../../lib/DataGridUtil.jsx');

var ScheduleApp = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
        return {
            loading: false,
            matches: []
        }
    },
    componentDidMount: function () {
        Util.getSomeData({url: '/api/challenge/upcoming', callback: function(d) {this.setState({matches: d})}.bind(this)});
    },
    componentDidUnmount: function() {
    },
    componentWillReceiveProps: function (n) {
    },
    render: function() {
        return (
            <div id="schedule-app">
                <Upcoming params={this.props.params} matches={this.state.matches} />
            </div>
        );
    }
});

var Upcoming = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
        return {
        }
    },
    componentDidMount: function () {
        //this.getData(this.props.params.seasonId);
    },
    componentWillReceiveProps: function (n) {
        //this.getData(n.params.seasonId);
    },
    render: function() {
        var columns = [
            DataGridUtil.columns.matchDate,
            DataGridUtil.columns.matchTime,
            DataGridUtil.columns.challenger,
            DataGridUtil.columns.challengeOpponent,
            DataGridUtil.columns.race
        ];
        var matches = this.props.matches;
        if (matches.length == 0) {
            return null;
        }
        var hide = "hide";
        return (
            <div className="row" >
                <div className="col-xs-12 col-md-7" >
                    <div className="panel panel-default panel-challenge ">
                        <div className={"panel-heading"}>
                            <div className="row panel-title">
                                <div className="col-xs-10 col-md-7 p-title">
                                    <i className="fa fa-calendar"></i><span> Upcoming</span><span> </span>
                                    <Link className={"team-match-add " +  hide}   to={"/app/schedule/" + this.props.params.seasonId + '/add'} >
                                        <button type="button" className="btn btn-sm  btn-primary">
                                            <span className={"glyphicon glyphicon-plus"}></span>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className={"panel-body panel-animate panel-challenge-results panel-results-body"} >
                            <DataGrid
                                dataSource={matches}
                                columns={columns}
                                style={{height: ((matches.length) * 50 < 500 ? (matches.length ) * 50 : 500)}}
                                rowHeight={40}
                                />
                        </div>
                    </div>
                </div>
            </div>);

    }
});

module.exports =  ScheduleApp;
