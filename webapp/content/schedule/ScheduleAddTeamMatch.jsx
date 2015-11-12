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
          //  matchHelper: new MatchHelper(this,this.props.params.seasonId)
        }
    },
    componentDidMount: function () {
        //this.props.matchHelper.createNew();
    },
    componentDidUnmount: function() {
        console.log('Unmount');
        //delete this.props.matchHelper;
    },
    componentWillReceiveProps: function (n) {
    },
    addNew: function(e) {
        e.preventDefault();
        this.props.matchHelper.createNew();
    },
    render: function() {
        //<MatchResults  params={this.props.params} matches={this.state.results} />
        //<PendingMatches params={this.props.params} />
        //<PendingMatches params={this.props.params} matchHelper={this.props.matchHelper} />
          var columns = [
              DataGridUtil.columns.submit,
              DataGridUtil.columns.deleteMatch,
              this.props.matchHelper.getDateSelect(),
              this.props.matchHelper.getTimeSelect(),
              this.props.matchHelper.getTeamSelect('home'),
            DataGridUtil.columns.homeRacksAdmin,
              this.props.matchHelper.getTeamSelect('away'),
            DataGridUtil.columns.awayRacksAdmin
        ];
        var matches = this.props.matchHelper.getNewMatches();
        return (
            <div id="schedule-app">
                <div className="row">
                    <div className="col-xs-12 col-md-7">
                        <div className="panel panel-default panel-challenge">
                            <div className={"panel-heading"}>
                                <div className="row panel-title">
                                    <div className="col-xs-7 col-md-7 p-title">
                                        <span>New Matches</span>
                                    </div>
                                    <div className="float-right col-xs-4 col-md-4 p-title">
                                        <button onClick={this.addNew}type="button" className="btn btn-sm  btn-primary">
                                            <span className={"glyphicon glyphicon-plus"}></span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className={"panel-body panel-animate panel-challenge-results panel-results-body"} >
                                <DataGrid
                                    dataSource={matches}
                                    columns={columns}
                                    style={{height: ((matches) * 50 < 500 ? (matches ) * 50 : 500)}}
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
                                    scrollbarSize={(matches) * 50 < 500 ? 0 : 20}
                                    //onColumnOrderChange={this.handleColumnOrderChange}
                                    />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});



module.exports = ScheduleTeamMatchAdd;