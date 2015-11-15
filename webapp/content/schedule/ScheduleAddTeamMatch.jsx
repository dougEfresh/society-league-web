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

var TeamMatchStore = require('../../jsx/stores/TeamMatchStore.jsx');

var ScheduleTeamMatchAdd = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
        return {
            loading: true,
          //  matchHelper: new MatchHelper(this,this.props.params.seasonId)
        }
    },
    componentDidMount: function () {
    },
    componentWillMount: function() {
        TeamMatchStore.addListener('loading',this._onChange);
        TeamMatchStore.addListener('MATCHES',this._onChange);
    },
    componentDidUnmount: function() {
        console.log('Unmount');
        TeamMatchStore.remove('loading',this._onChange);
        TeamMatchStore.remove('MATCHES',this._onChange);
    },
    _onChange: function() {
        this.forceUpdate();
    },
    addNew: function(e) {
        e.preventDefault();
        TeamMatchStore.addNew();
        //this.props.matchHelper.createNew();
    },
    render: function() {

         return (
            <div id="schedule-app">
                <div className="row">
                    <div className="col-xs-12 col-md-7">
                        <div className="panel panel-default panel-challenge">
                            <div className={"panel-heading"}>
                                <div className="row panel-title">
                                    <div className="col-xs-7 col-md-7 p-title">
                                        <span>New Matches  </span>
                                        <span>{this.props.season.displayName} </span>
                                    </div>
                                    <div className="float-right col-xs-4 col-md-4 p-title">
                                        <button onClick={this.addNew}type="button" className="btn btn-sm  btn-primary">
                                            <span className={"glyphicon glyphicon-plus"}></span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className={"panel-body panel-animate panel-challenge-results panel-results-body"} >

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
        //<MatchResults  params={this.props.params} matches={this.state.results} />
        //<PendingMatches params={this.props.params} />
        //<PendingMatches params={this.props.params} matchHelper={this.props.matchHelper} />
        /*
          var columns = [
              DataGridUtil.columns.submit,
              this.props.matchHelper.getDateSelect(),
              this.props.matchHelper.getTimeSelect(),
              this.props.matchHelper.getTeamSelect('home'),
            DataGridUtil.columns.homeRacks,
              this.props.matchHelper.getTeamSelect('away'),
            DataGridUtil.columns.awayRacks,
              DataGridUtil.columns.deleteMatch
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
                                        <span>New Matches  </span>
                                        <span>{this.props.season.displayName} </span>
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
        */
    }
});



module.exports = ScheduleTeamMatchAdd;