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
var ScheduleAddTeamMatch = require('./ScheduleAddTeamMatch.jsx');

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
        //
        //<PendingMatches params={this.props.params} />
        //
        var add =     <ScheduleAddTeamMatch  matchHelper={this.state.matchHelper} params={this.props.params}/>;
        if (!this.getUser().admin) {
            add = null;
        }
        return (
            <div id="schedule-app">
                {add}
                <PendingMatches params={this.props.params} matchHelper={this.state.matchHelper} />
                <Upcoming params={this.props.params} matchHelper={this.state.matchHelper}/>
                <MatchResults  params={this.props.params} matchHelper={this.state.matchHelper} />
            </div>
        );
    }
});

var MatchResults = React.createClass({
    getMatches: function() {
        var rows = [];
        var matches = this.props.matchHelper.getPlayed();
        if (matches == null)
            return rows;
        Object.keys(matches).forEach(function(md) {
            rows.push(<Results key={md} date={md} matches={matches[md]} />);
        }.bind(this));
        return (
            rows
        );
    },
    toggleHeading: function(e) {e.preventDefault(); this.setState({toggle: !this.state.toggle})},
    componentWillReceiveProps: function(n) {
        //if (n.params.matchId != undefined) {
            //this.setState({toggle: false});
//        }
    },
    componentDidMount: function() {
  //      if (this.props.params.matchId != undefined) {
            //this.setState({toggle: false});
    //    }
    },
    render: function() {
        if (this.props.matchHelper == null) {
            return null;
        }

        return (
            <div className="row">
                <div className="col-xs-12 col-md-7">
                    <div className="panel panel-default panel-challenge">
                    <div className={"panel-heading"}>
                        <div className="row panel-title">
                            <div className="col-xs-10 col-md-7 p-title">
                              <span className="fa fa-trophy"></span><span> Results<span></span></span>
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
                <div className="col-xs-12 col-md-12" >
                    <div className="panel panel-default">
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
            DataGridUtil.columns.deleteMatch,
            DataGridUtil.columns.matchDate,
            DataGridUtil.columns.matchTime,
            DataGridUtil.columns.challenger,
            DataGridUtil.columns.challengeOpponent,
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
        var upcoming = this.props.matchHelper.getUpcoming();
        if (upcoming == null)
            return null;

        var matches = [];
        Object.keys(upcoming).forEach(function(m){
            matches = matches.concat(upcoming[m]);
        });
        if (matches.length == 0) {
            return null;
        }
        var hide = !this.getUser().admin ? " hide" : " ";
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
                        idProperty='id'
                        dataSource={matches}
                        columns={columns}
                        style={{height: ((matches.length) * 50 < 500 ? (matches.length ) * 50 : 500)}}
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
                        scrollbarSize={(matches.length) * 50 < 500 ? 0 : 20}
                        //onColumnOrderChange={this.handleColumnOrderChange}
                        />
                </div>
                   </div>
               </div>
           </div>);

    }
});


var PendingMatches = React.createClass({
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
            DataGridUtil.columns.deleteMatch,
            DataGridUtil.columns.matchDate,
            DataGridUtil.columns.matchTime,
            DataGridUtil.columns.challenger,
            DataGridUtil.columns.homeRacksAdmin,
            DataGridUtil.columns.challengeOpponent,
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
                   <div className="panel panel-default panel-challenge ">
                    <div className={"panel-heading"}>
                        <div className="row panel-title">
                            <div className="col-xs-10 col-md-7 p-title">
                                <i className="fa fa-exclamation-triangle"></i><span> Pending</span>
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
