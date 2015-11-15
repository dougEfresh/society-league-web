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
var ScheduleAddTeamMatch = require('../schedule/ScheduleAddTeamMatch.jsx');
var SeasonStandings = require('../season/SeasonStandings.jsx');
var teamOptions = [];
var options=[];

var DataGrid = require('../../lib/DataGrid.jsx');
var DataGridUtil = require('../../lib/DataGridUtil.jsx');
var Status = require('../../lib/Status');

for(var i = 0; i<10 ; i++) {
    options.push(<option key={i} value={i}>{i}</option>);
}

var TeamMatchStore = require('../../jsx/stores/TeamMatchStore.jsx');

var ScheduleApp = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
        return {
            loading: true,
            //matchHelper: new MatchHelper(this,this.props.params.seasonId),
            season: null
        }
    },
    componentDidMount: function () {
        TeamMatchStore.init(this.props.params.seasonId);
        DataGridUtil.adminMode();
        Util.getSomeData({
            url: '/api/season/' + this.props.params.seasonId,
            callback: function(d) {this.setState({season: d})}.bind(this),
            router: this.props.history
        })
    },
    componentWillMount: function() {
        TeamMatchStore.addListener('loading',this._onLoadingChange);
    },
    componentDidUnmount: function() {
        console.log('Unmount');
        TeamMatchStore.remove('loading',this._onLoadingChange);
    },
    componentWillReceiveProps: function (n) {
        if (n.params.seasonId != this.props.seasonId) {
            TeamMatchStore.init(n.params.seasonId);
            Util.getSomeData({
                url: '/api/season/' + n.params.seasonId,
                callback: function(d) {this.setState({season: d})}.bind(this),
                router: this.props.history
            });
        }
    },
    _onLoadingChange : function() {
        this.setState({loading: TeamMatchStore.isLoading()})
    },
    render: function() {
        if (this.state.season == null) {
            var header = <div className="col-xs-10 col-md-11 p-title">Loading...</div>;
        var body = <div style={{height: 200}} className="text-center loading">
            <span className="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>
        </div>;
            return (
                <div className={"row"} >
                    <div className={"col-xs-12 col-md-6 "} >
                        <div className={"panel panel-default panel-user-results "}>
                            <a href="#"  >
                            <div className={"panel-heading"}>
                                <div className={"row panel-title"}>
                                    {header}
                                </div>
                            </div>
                        </a>
                        <div className={"panel-body panel-animate"}>
                            {body}
                        </div>
                    </div>
                </div>
            </div>
            )
        }

        //<ScheduleAddTeamMatch season={this.state.season}  matchHelper={this.state.matchHelper} params={this.props.params}/>;
        return (
            <div id="schedule-app">
                <div className="row">
                <div className="col-xs-12 col-md-9 col-lg-10">
                    <div className="panel panel-default panel-leaders">
                            <div className={"panel-heading"}>
                                <div className="row panel-title">
                                    {this.state.season.displayName}
                                </div>
                            </div>
                        <div className={"panel-body panel-animate"} >
                            <SeasonStandings admin={true} notitle={true} params={this.props.params} season={this.state.season} />;
                        </div>
                    </div>
                </div>
                </div>
                <MatchResults season={this.state.season}  params={this.props.params} type={Status.PENDING} />
                <MatchResults season={this.state.season}  params={this.props.params} type={Status.COMPLETE} />
                <MatchResults season={this.state.season}  params={this.props.params} type={Status.UPCOMING}  />
            </div>
        );
    }
});
//                <PendingMatches season={this.state.season} params={this.props.params} />
//

var MatchResults = React.createClass({
    getInitialState: function() {
        return {
            matches: null
        }
    },
    getMatches: function() {
        var rows = [];
        var matches = TeamMatchStore.getType(this.props.type);
        if (matches == null)
            return rows;
        Object.keys(matches).forEach(function(md) {
            rows.push(<Results season={this.props.season} type={this.props.type} key={md} date={md} matches={matches[md]} />);
        }.bind(this));

        return ( rows );
    },
    componentWillMount: function() {
        TeamMatchStore.addListener(this.props.type,this._onChange);
        TeamMatchStore.addListener('loading',this._onChange);
        TeamMatchStore.addListener('MATCHES',this._onChange);
    },
    componentDidMount: function() {
    },
    componentDidUnmount: function() {
        TeamMatchStore.remove(this.props.type,this._onChange);
        TeamMatchStore.remove('MATCHES',this._onChange);
        TeamMatchStore.remove('loading',this._onChange);
    },
    _onChange: function() {
        console.log('Updating ' + this.props.type);
         this.forceUpdate();
    },
    render: function() {
        if (TeamMatchStore.isLoading()) {
            var header = <div className="col-xs-10 col-md-11 p-title">Loading...</div>;
            var body = <div style={{height: 200}} className="text-center loading">
                <span className="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>
            </div>;
            return (
                <div className={"row"} >
                    <div className={"col-xs-12 col-md-6 "} >
                        <div className={"panel panel-default panel-user-results "}>
                            <a href="#"  >
                            <div className={"panel-heading"}>
                                <div className={"row panel-title"}>
                                    {header}
                                </div>
                            </div>
                        </a>
                        <div className={"panel-body panel-animate"}>
                            {body}
                        </div>
                        </div>
                    </div>
                </div>
            )
        }

        var title = ' Results '  + this.props.season.displayName;
        if (this.props.type == Status.UPCOMING) {
            title = ' Upcoming  ' + this.props.season.displayName;
        }
        if (this.props.type == Status.PENDING) {
            title = ' Pending  ' + this.props.season.displayName;
        }
        return (
            <div className="row">
                <div className="col-xs-12 col-md-7">
                    <div className={"panel panel-default panel-challenge"}>
                    <div className={"panel-heading"}>
                        <div className="row panel-title">
                            <div className="col-xs-10 col-md-7 p-title">
                                <span>{title}</span>
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
        if (this.props.season == null) {
            debugger;
            return null;
        }
        var css = 'panel-primary';
        if (this.props.type == Status.UPCOMING)
            css = 'panel-warning';

        if (this.props.type == Status.PENDING)
            css = 'panel-danger';
        var columns = DataGridUtil.adminColumns(this.props.season);
        if (columns[0] == undefined) {
            console.warn('No columns');
        }
        return (
            <div className="row" >
                <div className="col-xs-12 col-md-12" >
                    <div className={"panel panel-default " + css} >
                        <div className={"panel-heading"}>
                            <div className="row panel-title">
                                <div className="col-xs-10 col-md-7 p-title">
                                    <span>{this.props.date}</span>
                                </div>
                            </div>
                        </div>
                        <div className={"panel-body panel-animate panel-challenge-results panel-results-body "} >
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

module.exports =  ScheduleApp;
