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

var ScheduleTeamMatchAdd = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
        return {
            loading: false,
            teamMatch: null
        }
    },
    componentDidMount: function () {
        Util.getSomeData({
            url: '/api/teammatc/add/' + this.props.params.seasonId,
            callback: function(d) {this.setState({teamMatch: d})}.bind(this),
            module: 'TeamMatchAdd'
        });
    },
    componentDidUnmount: function() {
        console.log('Unmount');
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




module.exports = ScheduleTeamMatchAdd;