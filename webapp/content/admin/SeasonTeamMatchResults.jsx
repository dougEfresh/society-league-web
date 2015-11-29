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
var SeasonLeaders = require('../season/SeasonLeaders.jsx');

var DataGrid = require('../../lib/DataGrid.jsx');
var DataGridUtil = require('../../lib/DataGridUtil.jsx');
var Status = require('../../lib/Status');

for(var i = 0; i<10 ; i++) {
    options.push(<option key={i} value={i}>{i}</option>);
}

var TeamMatchStore = require('../../jsx/stores/TeamMatchStore.jsx');
var PlayerMatchResults = require('./SeasonPlayerMatchResults.jsx');

var ScheduleApp = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
        return {
            loading: true,
            selectedDate : this.props.params.date,
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
        if (n.params.seasonId != this.props.params.seasonId) {
            debugger;
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
    changeUser: function(u) {
        return function(e){
            e.preventDefault();
            console.log('Changing to ' + u.name);
            this.state.toggleLeaders = false;
            this.props.history.pushState(null,'/app/season/' + this.props.params.seasonId + '/leaders/' + u.id)
        }.bind(this)
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
        var pendingMatches = TeamMatchStore.getPending();
        //
        var ss = <SeasonStandings admin={true} notitle={true} params={this.props.params} season={this.state.season} />;
        if (this.state.season.challenge) {
            ss = <SeasonLeaders onUserClick={this.changeUser} params={this.props.params}/>;
        }
        return (
            <div id="schedule-app">
                <div className="row">
                <div className="col-xs-12 col-md-7 col-lg-6">
                    <div className="panel panel-default panel-leaders">
                            <div className={"panel-heading"}>
                                <div className="row panel-title">
                                    {this.state.season.displayName}
                                </div>
                            </div>
                        <div className={"panel-body panel-animate"} >
                            {ss}
                        </div>
                    </div>
                </div>
                </div>
                <MatchResults season={this.state.season}  params={this.props.params} history={this.props.history} />
                <PlayerMatchResults season={this.state.season} params={this.props.params} history={this.props.history}  />
                <PendingMatches matches={pendingMatches} />
            </div>
        );
    }
});

var MatchResults = React.createClass({
    getInitialState: function() {
        return {
            matches: null,
            loading: false,
            selectedDate: this.props.params.date
        }
    },
    getMatches: function() {
        var matches = TeamMatchStore.getMatches();
        if (matches == null)
            return null;
        var m = matches[this.state.selectedDate];
        if (m == null || m == undefined)
            return null;

        return <Results season={this.props.season}
                               key={this.state.selectedDate}
                               date={this.state.selectedDate}
                        selected={this.props.params.teamMatchId}
                               matches={matches[this.state.selectedDate]} />;

    },
    componentWillReceiveProps: function (n) {
        this.setState({selectedDate: n.params.date});
    },
    componentWillMount: function() {
        TeamMatchStore.addListener('MATCHES',this._onChange);
    },
    componentDidMount: function() {
    },
    componentDidUnmount: function() {
        TeamMatchStore.addListener('MATCHES',this._onChange);
    },
    _onChange: function() {
        this.setState({loading: true});
        setTimeout(function(){this.setState({loading: false})}.bind(this),800);
    },
    addNew: function(e) {
        e.preventDefault();
        TeamMatchStore.addNew(this.props.params.seasonId);
    },
    changeDate: function(e) {
        e.preventDefault();
        this.props.history.pushState(null,'/app/season/' + this.props.params.seasonId + '/team/results/' +  e.target.value);
    },
    render: function() {
        if (this.state.loading || TeamMatchStore.isLoading()) {
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
        if (!this.state.selectedDate) {
            this.state.selectedDate = Object.keys(TeamMatchStore.getMatches())[0];
        }
        var dateOptions = [];
        Object.keys(TeamMatchStore.getMatches()).forEach(function(md) {
            dateOptions.push(<option key={md} value={md}>{md}</option>);
        });

        var title = ' Results '  + this.props.season.displayName;
        var add =  <div className="float-right col-xs-4 col-md-4 p-title">
            <button onClick={this.addNew}type="button" className="btn btn-sm  btn-primary">
                <span className={"glyphicon glyphicon-plus"}></span>
            </button>
        </div>;

        var selectDate = <select ref='racks'
                        onChange={this.changeDate}
                        className="form-control"
                        value={this.state.selectedDate}
                        type={'select'}>
                    {dateOptions}
                </select>;
        return (
            <div className="row">
                <div className="col-xs-12 col-md-12">
                    <div className={"panel panel-default panel-challenge"}>
                    <div className={"panel-heading"}>
                        <div className="row panel-title">
                            <div className="col-xs-12 col-md-4 p-title">
                                <span>{title}</span>
                            </div>
                            <div className="col-xs-12 col-md-5 p-title">
                                {selectDate}
                            </div>
                            <div className="col-xs-12 col-md-3 p-title">
                                {add}
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
      getInitialState: function() {
        return {
            loading: false
        }
    },
    componentWillMount: function() {
        TeamMatchStore.addListener('loading',this._onLoading);
        TeamMatchStore.addListener('MATCHES',this._onChange);
        TeamMatchStore.addListener('SUBMITTED',this._onChange);
        TeamMatchStore.addListener('CHANGE',this._onChange);
    },
    componentDidMount: function() {
    },
    componentDidUnmount: function() {
        TeamMatchStore.remove('loading',this._onLoading);
        TeamMatchStore.remove('MATCHES',this._onChange);
        TeamMatchStore.remove('SUBMITTED',this._onChange);
        TeamMatchStore.remove('CHANGE',this._onChange);
    },
    _onLoading: function() {
        this.setState({
            loading: !this.state.loading
        });
    },
    _onChange: function(){
         this.setState({
            loading: false
        });
        this.forceUpdate();
    },
    submit: function(e){
        e.preventDefault();
        TeamMatchStore.submitWeek(this.props.matches);
    },
    render: function() {
        if (this.state.loading) {
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
        if (this.props.matches  == null || this.props.matches == undefined || this.props.matches.length == 0) {
            return null;
        }
        this.props.matches.forEach(function(m) {
            m.selected = this.props.selected == m.id;
        }.bind(this));
        var matches = this.props.matches.sort(function(a,b){
            return a.home.name.localeCompare(b.home.name);
        }.bind(this));

        if (this.props.season.challenge) {
            matches = matches.sort(function(a,b){
                return a.matchDate.localeCompare(b.matchDate);
            }.bind(this));
        }
        var css = 'panel-primary';
        var columns = DataGridUtil.adminColumns(this.props.season,TeamMatchStore.getTeamsOptions());
        return (
            <div className="row" >
                <div className="col-xs-12 col-md-12" >
                    <div className={"panel panel-default " + css} >
                        <div className={"panel-heading"}>
                            <div className="row panel-title">
                                <div className="col-xs-10 col-md-7 p-title">
                                    <span>{this.props.date} </span>
                                    <button onClick={this.submit} type="button" className="btn btn-xs btn-default btn-responsive player-match-submit">
                                        <span className="glyphicon glyphicon-ok-sign"> Submit</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className={"panel-body panel-animate panel-challenge-results panel-results-body "} >
                            <DataGrid
                                idProperty='id'
                                dataSource={matches}
                                columns={columns}
                                style={{height: ((matches.length) * 50 < 500 ? (this.props.matches.length ) * 50 : 500)}}
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
    getInitialState: function() {
        return {
            toggle: true
        }
    },
    getPending: function() {
        var rows = [];
        if (!this.state.toggle) {
            return null;
        }
        Object.keys(this.props.matches).forEach(function(md) {
            rows.push(<UpcomingWeeklyMatch key={md} date={md} matches={this.props.matches[md]}/>);
        }.bind(this));
        return rows;
    },
    render: function() {
        if (this.props.matches == null)
            return null;
        var toggleHeading = function(e) {e.preventDefault() ;this.setState({toggle: !this.state.toggle})}.bind(this);
        return (
        <div className="panel panel-default panel-schedule">
                <a onClick={toggleHeading} href='#'>
                    <div className={"panel-heading" +(this.state.toggle ? "" : " panel-closed")}>
                        <div className="row panel-title">
                            <div className="col-xs-10 col-md-11 p-title">
                                <span className="fa fa-exclamation-triangle pending-schedule-warning" ></span> <span> Pending Matches</span>
                            </div>
                            <div className="col-xs-2 col-md-1 caret-title">
                                <span className={"fa fa-caret-" + (this.state.toggle ? "down" : "left")}></span>
                            </div>
                        </div>
                    </div>
                </a>
                <div className={"panel-body panel-schedule-body" + (this.state.toggle ? "" : " hide")} >
                    <div className="row schedule-row">
                        {this.getPending()}
                    </div>
                </div>
            </div>
        );
    }
});
var UpcomingWeeklyMatch = React.createClass({
    mixins: [UserContextMixin],
    renderMatches: function() {
        var rows = [];
        var tId = this.props.team == undefined ? "0" : this.props.team.id;
        this.props.matches.forEach(function(m) {
            rows.push(
                <tr key={m.id}>
                    <td className={"schedule-home " + (tId == m.home.id ? " team-active" : "")}>
                        <TeamLink team={m.home}/>
                    </td>
                    <td className="schedule-vs">
                        <span className="vs"> Vs. </span>
                    </td>
                    <td className={"schedule-away " + (tId == m.away.id ? " team-active" : "")}>
                        <TeamLink team={m.away}/>
                    </td>
                </tr>
            )}.bind(this));
        return rows;
    },

    render: function() {
        var season = this.props.matches[0].season.legacyId;
        var nm = this.props.matches[0].matchNumber;
        var scoresheets = (<a className={this.getUser().admin ? "" : "hide"}
                              href={"https://admin.societybilliards.com/demo/admin/sheets/sheets-season.php?season_id=" + season + "&week=" + nm}>
            <button className="btn btn-sm btn-primary">Scoresheets</button>
        </a>);
        return (
            <div className="col-xs-12 col-md-4">
          <div className="panel panel-default panel-schedule-week">
              <div className="panel-heading panel-schedule-week-title">
                  {Util.formatDateTime(this.props.date) } {scoresheets}
              </div>
              <div className={"panel-body panel-animate"} >
                  <div className="table-responsive">
                      <table className="table schedule-table schedule-table-upcoming" >
                          <thead></thead>
                          <tbody>
                          {this.renderMatches()}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
            </div>
        );
    }
});



module.exports =  ScheduleApp;
