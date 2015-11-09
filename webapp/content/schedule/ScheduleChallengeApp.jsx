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

for(var i = 0; i<10 ; i++) {
    options.push(<option key={i} value={i}>{i}</option>);
}

var ScheduleApp = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
        return {
            loading: false,
            matchHelper: new MatchHelper(this,this.props.params.seasonId)
        }
    },
    componentDidMount: function () {
        this.state.matchHelper.receiveMatches();
    },
    componentDidUnmount: function() {
        console.log('Unmount');
        delete this.state.matchHelper;
    },
    componentWillReceiveProps: function (n) {
    },
    render: function() {
        //<MatchResults  params={this.props.params} matches={this.state.results} />
        //<PendingMatches params={this.props.params} />
        return (
            <div id="schedule-app">
                <PendingMatches params={this.props.params} matchHelper={this.state.matchHelper} />
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
    mixins: [UserContextMixin],
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
        if (this.getUser().admin) {
            columns = [
            //DataGridUtil.columns.playerMatchDate,
                DataGridUtil.columns.deleteMatch,
                DataGridUtil.columns.challenger,
                DataGridUtil.columns.homeRacksAdmin,
                DataGridUtil.columns.challengeOpponent,
                DataGridUtil.columns.awayRacksAdmin,
                DataGridUtil.columns.score,
                DataGridUtil.columns.race
                //DataGridUtil.columns.opponent,
                //DataGridUtil.columns.opponentHandicap
            ];
        }
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

var PendingMatches = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
        return {
        }
    },
    handleUpdate: function(tm,type) {


    },
    handleDelete: function(d) {
        util.getSomeData({
            url: '/api/teammatch/admin/delete/' + d.id,
            callback: function(data) {this.getData(d.season.id)}.bind(this),
            module: 'DeleteTeamMatch'
        });
    },
    handleAdd: function(e) {
        e.preventDefault();
    },
    getData: function(id) {
        Util.getSomeData({
            url: '/api/teammatch/season/' + id + '/pending',
            callback: function (d) {
                var pending = [];
                Object.keys(d).forEach(function(a){
                    pending = pending.concat(d[a]);
                });
                pending = pending.sort(function(a,b) {
                    return a.matchDate.localeCompare(b.matchDate);
                });
                pending.forEach(function(p) {
                    p.onDelete = function(d) {
                        return function(e) {
                            e.preventDefault();
                            this.handleDelete(d);
                        }.bind(this);
                    }.bind(this);
                    p.onChange = function(d,type) {
                        return function(e) {
                            e.preventDefault();
                            d[type] = e.target.value;
                            this.handleUpdate(d,type);
                            this.forceUpdate();
                        }.bind(this);
                    }.bind(this);
                }.bind(this));
                this.setState({pending: pending});
            }.bind(this),
            module: 'ChallengePendingMatches'
        });
    },
    componentDidMount: function () {
        //this.getData(this.props.params.seasonId);
    },
    componentWillReceiveProps: function (n) {
        //this.getData(n.params.seasonId);
    },
    render: function() {
        var columns = [
            DataGridUtil.columns.deleteMatch,
            DataGridUtil.columns.matchDate,
            DataGridUtil.columns.matchTime,
            this.props.matchHelper.getTeamSelect('homeTeam'),
            DataGridUtil.columns.homeRacksAdmin,
            this.props.matchHelper.getTeamSelect('awayTeam'),
            DataGridUtil.columns.awayRacksAdmin,
            DataGridUtil.columns.race
        ];
        if (!this.getUser().admin) {
            columns = [
            DataGridUtil.columns.matchDate,
            DataGridUtil.columns.matchTime,
            DataGridUtil.columns.challenger,
            DataGridUtil.columns.challengeOpponent,
            DataGridUtil.columns.race
            ]
        }
        var pending = this.props.matchHelper.getPending();
        if (pending.length == 0) {
            return null;
        }
       return (
           <div className="row" >
               <div className="col-xs-12 col-md-7" >
                   <div className="panel panel-default ">
                    <div className={"panel-heading"}>
                        <div className="row panel-title">
                            <div className="col-xs-10 col-md-7 p-title">
                                <span>Pending</span>
                            </div>
                        </div>
                    </div>
                       <div className={"panel-body panel-animate panel-challenge-results panel-results-body"} >
                           <DataGrid
                        idProperty='id'
                        dataSource={pending}
                        columns={columns}
                        style={{height: ((pending.length) * 50 < 500 ? (pending.length ) * 50 : 500)}}
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
                        scrollbarSize={(pending.length) * 50 < 500 ? 0 : 20}
                        //onColumnOrderChange={this.handleColumnOrderChange}
                        />
                </div>
                   </div>
               </div>
           </div>);

    }
});

module.exports =  ScheduleApp;
