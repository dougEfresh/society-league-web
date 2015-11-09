var React = require('react/addons');
var Util = require('../../jsx/util.jsx');
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

for(var i = 0; i<30 ; i++) {
    options.push(<option key={i} value={i}>{i}</option>);
}

var ScheduleApp = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
        return {
            loading: false,
            results: null
        }
    },
    getData: function(id) {
        Util.getSomeData({
            url: '/api/playerresult/season/' + id + '/date',
            callback: function (d) {
                var dates = Object.keys(d).sort(function(a,b){
                    return b.localeCompare(a);
                });
                var results = {};
                dates.forEach(function(md) {
                    results[md] = d[md];
                });
                this.setState({results: d});
            }.bind(this),
            module: 'SeasonWeeklyResults',
            router: this.props.history
        });
    },
    componentDidMount: function () {
        this.getData(this.props.params.seasonId);
    },
    componentWillReceiveProps: function (n) {
        this.getData(n.params.seasonId);
    },
    render: function() {
        if (this.state.results  == null) {
            return (<LoadingApp /> )
        }
        return (
            <div id="schedule-app">
                <MatchResults  params={this.props.params} matches={this.state.results} />
            </div>
        );
    }
});

var MatchResults = React.createClass({
    getMatches: function() {
        var rows = [];
        Object.keys(this.props.matches).forEach(function(md) {
            rows.push(<Results key={md} date={md} matches={this.props.matches[md]} />);
        }.bind(this));
        return (
            rows
        );
    },
    toggleHeading: function(e) {e.preventDefault(); this.setState({toggle: !this.state.toggle})},
    componentWillReceiveProps: function(n) {
        if (n.params.matchId != undefined) {
            //this.setState({toggle: false});
        }
    },
    componentDidMount: function() {
        if (this.props.params.matchId != undefined) {
            //this.setState({toggle: false});
        }
    },
    render: function() {
        if (this.props.matches == null) {
            return null;
        }
        var season = this.props.matches[Object.keys(this.props.matches)[0]][0].season;
        return (
            <div className="row">
                <div className="col-xs-12 col-md-6">
            <div className="panel panel-default ">
                    <div className={"panel-heading"}>
                        <div className="row panel-title">
                            <div className="col-xs-10 col-md-7 p-title">
                              <span className="fa fa-trophy"></span><span>Results<span> {season.shortName}</span></span>
                            </div>
                        </div>
                    </div>
                <div className={"panel-body panel-animate panel-challenge-results panel-results-body"} >
                        {this.getMatches()}
                </div>
            </div>
                </div>
            </div>
        );
    }
});

var Results = React.createClass({

    render: function() {
         var columns = [
            //DataGridUtil.columns.playerMatchDate,
             DataGridUtil.columns.winner,
             DataGridUtil.columns.loser,
            DataGridUtil.columns.score,
             DataGridUtil.columns.race
            //DataGridUtil.columns.opponent,
            //DataGridUtil.columns.opponentHandicap
        ];
        return (
            <div className="row" >
                <div className="col-xs-12 col-md-7" >
                    <div className="panel panel-default ">
                    <div className={"panel-heading"}>
                        <div className="row panel-title">
                            <div className="col-xs-10 col-md-7 p-title">
                              <span>{this.props.date}</span>
                            </div>
                        </div>
                    </div>
                <div className={"panel-body panel-animate panel-challenge-results panel-results-body"} >
                    <DataGrid
                        idProperty='id'
                        dataSource={this.props.matches}
                        columns={columns}
                        style={{height: ((this.props.matches.length) * 50 < 500 ? (this.props.matches.length ) * 50 : 500)}}
                        rowHeight={40}
                        showCellBorders={true}
                        filterable={false}
                        columnMinWidth={50}
                        cellPadding={'5px 5px'}
                        headerPadding={'5px 5px'}
                        filterIconColor={'#6EB8F1'}
                        menuIconColor={'#6EB8F1'}
                        loadMaskOverHeader={false}
                        cellEllipsis={false}
                        liveFilter={false}
                        styleAlternateRowsCls={'datagrid-alt-row'}
                        menuIcon={false}
                        filterIcon={false}
                        scrollbarSize={(this.props.matches.length) * 50 < 500 ? 0 : 20}
                        //onColumnOrderChange={this.handleColumnOrderChange}
                        />
                </div>
            </div>

                </div>
            </div>
        );
    }
});

var UpCompingMatches = React.createClass({
      mixins: [UserContextMixin],
    getInitialState: function() {
        return {
            loading: false,
            results: null
        }
    },
    getData: function(id) {
        Util.getSomeData({
            url: '/api/playerresult/season/' + id + '/date',
            callback: function (d) {
                var dates = Object.keys(d).sort(function(a,b){
                    return b.localeCompare(a);
                });
                var results = {};
                dates.forEach(function(md) {
                    results[md] = d[md];
                });
                this.setState({results: d});
            }.bind(this),
            module: 'SeasonWeeklyResults',
            router: this.props.history
        });
    },
    componentDidMount: function () {
        this.getData(this.props.params.seasonId);
    },
    componentWillReceiveProps: function (n) {
        this.getData(n.params.seasonId);
    },
    render: function() {
        return null;
    }
});

module.exports =  ScheduleApp;
