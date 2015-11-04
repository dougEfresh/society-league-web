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
var Modal = require('react-modal');

var teamOptions = [];
var options=[];
for(var i = 0; i<30 ; i++) {
    options.push(<option key={i} value={i}>{i}</option>);
}

var ScheduleApp = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
        return {
            loading: false,
            upcoming: null,
            played: null,
            pending: null,
            teams: [],
            season: null,
            team: null
        }
    },
    getData: function(id) {
        Util.getSomeData({
            url: '/api/teammatch/season/' + id + '/upcoming',
            callback: function (d) {
                this.setState({upcoming: d});
            }.bind(this),
            module: 'SeasonWeeklyResults',
            router: this.props.history
        });
        Util.getSomeData({
            url: '/api/teammatch/season/' + id + '/pending',
            callback: function (d) {
                this.setState({pending: d});
            }.bind(this),
            module: 'SeasonWeeklyResults',
            router: this.props.history
        });
            Util.getSomeData({
            url: '/api/teammatch/season/' + id + '/played',
            callback: function (d) {
                this.setState({played: d});
            }.bind(this),
            module: 'SeasonWeeklyResults',
            router: this.props.history
        });
            Util.getSomeData({
            url: '/api/team/user/' +  this.getUser().id + '/' +this.props.params.seasonId,
            callback: function (d) {
                this.setState({team: d});
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
        if (this.state.season == null && this.state.upcoming == null && this.state.played == null && this.state.pending == null) {
            return (<LoadingApp /> )
        }

        return (
            <div id="schedule-app">
                <MatchResults  team={this.state.team} params={this.props.params} history={this.props.history} matches={this.state.played} />
                <UpcomingMatches team={this.state.team} params={this.props.params} matches={this.state.upcoming} />
                <PendingMatches matches={this.state.pending} />
            </div>
        );
    }
});


var PendingMatches = React.createClass({
    getInitialState: function() {
        return {
            toggle: false
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
        return (
            <div className="col-xs-12 col-md-4">
          <div className="panel panel-default panel-schedule-week">
              <div className="panel-heading panel-schedule-week-title">
                  {Util.formatDateTime(this.props.date)}
              </div>
              <div className={"panel-body"} >
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

var UpcomingMatches = React.createClass({
    getInitialState: function() {
        return {
            toggle: false
          }
    },
    getUpcoming: function() {
        var rows = [];
        Object.keys(this.props.matches).forEach(function(md) {
            rows.push(<UpcomingWeeklyMatch team={this.props.team} key={md} date={md} matches={this.props.matches[md]} />);
        }.bind(this));
        return (
            rows
        );
    },
    componentWillReceiveProps: function(n) {
        //if (n.params.matchId != undefined) {
          //  this.setState({toggle: false});
        //}
    },
    componentDidMount: function() {
        //if (this.props.params.matchId != undefined) {
          //  this.setState({toggle: false});
        //}
    },
    render: function() {
        var toggleHeading = function(e) {e.preventDefault(); this.setState({toggle: !this.state.toggle})}.bind(this);
        if (this.props.matches == null) {
            return null;
        }
        return (
            <div className="panel panel-default panel-schedule">
                <a onClick={toggleHeading} href='#'>
                    <div className={"panel-heading" +(this.state.toggle ? "" : " panel-closed")}>
                        <div className="row panel-title">
                            <div className="col-xs-10 col-md-11 p-title">
                              Upcoming Matches
                            </div>
                            <div className="col-xs-2 col-md-1 caret-title">
                                <span className={"fa fa-caret-" + (this.state.toggle ? "down" : "left")}></span>
                            </div>
                        </div>
                    </div>
                </a>
                <div className={"panel-body panel-schedule-body" + (this.state.toggle ? "" : " hide")} >
                    <div className="row schedule-row">
                        {this.getUpcoming()}
                    </div>
                </div>
            </div>
        );
    }
});

var TeamResults = React.createClass({
    showResults: function(m) {
        return function(e) {
            e.preventDefault();
            this.props.history.pushState(null, '/app/schedule/' + this.props.matches[0].home.season.id + '/' + m.id);
        }.bind(this);
    },
    renderMatches: function() {
        var rows = [];
        var tId = this.props.team != undefined ? this.props.team.id : "0";
        this.props.matches.forEach(function(m) {
            if (m.winner.season.nine) {
                rows.push(
                    <tr key={m.id}>
                        <td className={"result-winner" + (tId == m.winner.id ? " team-active" : "")} ><TeamLink onClick={this.showResults(m)} team={m.winner}/></td>
                        <td className="racks">{m.winnerSetWins}</td>
                        <td className="racks">{m.winnerRacks}</td>
                        <td className={"result-loser" + (tId == m.loser.id ? " team-active" : "")}><TeamLink onClick={this.showResults(m)}  team={m.loser}/></td>
                        <td className="racks">{m.loserSetWins}</td>
                        <td className="racks">{m.loserRacks}</td>
                    </tr>)
            } else {
                 rows.push(
                    <tr key={m.id}>
                        <td className="result-winner"><TeamLink onClick={this.showResults(m)}  team={m.winner}/></td>
                        <td className="racks">{m.winnerRacks}</td>
                        <td className="result-loser"><TeamLink onClick={this.showResults(m)}  team={m.loser}/></td>
                        <td className="racks">{m.loserRacks}</td>
                    </tr>)
            }
        }.bind(this));
        return rows;
    },
    getHeader: function() {
        var season = this.props.matches[0].home.season;
        if (season.challenge) {
            return (
                <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th>Racks</th>
                </tr>
            )
        }
        if (season.nine) {
                return (
                    <tr>
                        <th><span className="fa fa-check winner-badge"></span> Winner</th>
                        <th><span className="badge rack-header">SW</span></th>
                        <th><span className="badge rack-header">R</span></th>
                        <th></th>
                        <th><span className="badge rack-header">SW</span></th>
                        <th><span className="badge rack-header">R</span></th>
                    </tr>
                )
        }
          return (
                <tr>
                    <th><span className="fa fa-check winner-badge"></span> Winner</th>
                    <th><span className="badge rack-header">R</span></th>
                    <th></th>
                    <th><span className="badge rack-header">R</span></th>
                </tr>
            )
    },
    render: function() {
        if (this.props.matches.length == 0) {
            return 0;
        }
        return (
        <div className="col-xs-12 col-md-6">
          <div className="panel panel-default panel-results-week">
              <div className="panel-heading panel-results-week-title">
                  {Util.formatDateTime(this.props.date)}
              </div>
              <div className={"panel-body"} >
                  <div className="table-responsive">
                      <table className="table results-table results-table-upcoming" >
                          <thead>{this.getHeader()}</thead>
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


var MatchResults = React.createClass({
    getInitialState: function() {
        return {
            toggle: true
          }
    },
    getUpcoming: function() {
        var rows = [];
        Object.keys(this.props.matches).forEach(function(md) {
            rows.push(<TeamResults team={this.props.team} toggleHeading={this.toggleHeading}history={this.props.history} key={md} date={md} matches={this.props.matches[md]} />);
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
            <div className="panel panel-default panel-results">
                <a onClick={this.toggleHeading} href='#'>
                    <div className={"panel-heading" +(this.state.toggle ? "" : " panel-closed")}>
                        <div className="row panel-title">
                            <div className="col-xs-10 col-md-11 p-title">
                              <span className="fa fa-trophy"></span><span> Results<span> {season.shortName}</span></span>
                            </div>
                            <div className="col-xs-2 col-md-1 caret-title">
                                <span className={"fa fa-caret-" + (this.state.toggle ? "down" : "left")}></span>
                            </div>
                        </div>
                    </div>
                </a>
                <div className={"panel-body panel-results-body" + (this.state.toggle ? "" : " hide")} >
                    <div className="row match-row">
                        {this.getUpcoming()}
                    </div>
                </div>
            </div>
        );
    }
});



module.exports = ScheduleApp;



/*
 var TeamMatches = React.createClass({
 mixins: [UserContextMixin],
 getHeader: function(season) {

 if (season.challenge) {
 return (
 <tr>
 <td></td>
 <td></td>
 <td></td>
 <td>Racks</td>
 </tr>
 )
 }
 if (season.nine) {
 if (this.props.type == 'played') {
 return (
 <tr>
 <td>Winner</td>
 <td>SW</td>
 <td>R</td>
 <td>Loser</td>
 <td>SL</td>
 <td>Racks</td>
 </tr>
 )
 } else {
 return  (
 <tr>
 <td>Home</td>
 <td>Away</td>
 </tr>
 )
 }
 }
 return (
 <tr>
 <td></td>
 <td></td>
 <td></td>
 <td></td>
 <td>Racks</td>
 </tr>
 )

 },
 render: function() {
 if (this.props.teamMatches.length == 0) {
 return null;
 }
 var rows = [];
 this.props.teamMatches.forEach(function(r) {
 if (r.season.challenge)
 rows.push(<ChallengeTeamMatch key={r.id} teamMatch={r} />);
 else if (r.season.nine)
 rows.push(<NineBallTeamMatch  type={this.props.type} key={r.id} teamMatch={r} />);
 else
 rows.push(<EightBallTeamMatch key={r.id} teamMatch={r} />);

 }.bind(this));
 var season  = this.props.teamMatches[0].season;

 return (
 <div className="col-xs-12 col-md-4">
 <div className="table-responsive">
 <table className="table table-hover table-bordered table-condensed table-striped table-responsive">
 <thead>
 <th colSpan="3">{Util.formatDateTime(this.props.date)} </th>
 </thead>
 <tbody>
 {this.getHeader(season)}
 {rows}
 </tbody>
 </table>
 </div>
 </div>
 );
 }
 });

 var EightBallTeamMatch = React.createClass({
 mixins: [UserContextMixin],
 getInitialState: function() {
 return {
 teamMatch: this.props.teamMatch
 }
 },
 reload: function(d) {
 this.setState({
 teamMatch: d
 })
 },
 onChange: function(e) {
 e.preventDefault();
 var tm = this.state.teamMatch;
 var winnerId = React.findDOMNode(this.refs.winner).value;
 var loserId = React.findDOMNode(this.refs.loser).value;
 if (tm.winner.id  != winnerId) {
 Util.getSomeData({
 url: '/api/teammatch/admin/modify/' +tm.id  + '/team/winner/' + winnerId,
 module: 'TeamMatchTeamModify',
 callback: function(d) {this.setState({teamMatch: d})}.bind(this)
 });
 }

 if (tm.loser.id  != loserId) {
 Util.getSomeData({
 url: '/api/teammatch/admin/modify/' + tm.id  + '/team/loser/' + winnerId,
 module: 'TeamMatchTeamModify',
 callback: function(d) {this.setState({teamMatch: d})}.bind(this)
 });
 }
 },
 render: function() {

 if (this.state.error) {
 return(
 <tr>
 <td colSpan="5">
 <div className="alert alert-error" role="alert">
 {'Error!  Please refresh your browser and try again' }
 </div>
 </td>
 </tr>
 );
 }

 var tm = this.state.teamMatch;
 var winner = <TeamLink team={tm.winner}></TeamLink>;
 var loser = <TeamLink team={tm.loser}></TeamLink>;
 return (
 <tr>
 <td>{winner}</td>
 <td>
 <TeamResult type={'racks'} callback={this.reload} teamMatch={tm} team={tm.winner} result={tm.winnerRacks}/>
 </td>
 <td>{loser}</td>
 <td>
 <TeamResult type={'racks'} callback={this.reload} teamMatch={tm} team={tm.loser} result={tm.loserRacks}/>
 </td>
 </tr>);
 }
 });

 var ChallengeTeamMatch = React.createClass({
 mixins: [UserContextMixin],
 getInitialState: function() {
 return {
 teamMatch: this.props.teamMatch
 }
 },
 reload: function(d) {
 this.setState({
 teamMatch: d
 })
 },
 onChange: function(e) {
 e.preventDefault();
 var tm = this.state.teamMatch;
 var winnerId = React.findDOMNode(this.refs.winner).value;
 var loserId = React.findDOMNode(this.refs.loser).value;
 if (tm.winner.id  != winnerId) {
 Util.getSomeData({
 url: '/api/teammatch/admin/modify/' +tm.id  + '/team/winner/' + winnerId,
 module: 'TeamMatchTeamModify',
 callback: function(d) {this.setState({teamMatch: d})}.bind(this)
 });
 }

 if (tm.loser.id  != loserId) {
 Util.getSomeData({
 url: '/api/teammatch/admin/modify/' + tm.id  + '/team/loser/' + winnerId,
 module: 'TeamMatchTeamModify',
 callback: function(d) {this.setState({teamMatch: d})}.bind(this)
 });
 }
 },
 render: function() {

 if (this.state.error) {
 return(
 <tr>
 <td colSpan="5">
 <div className="alert alert-error" role="alert">
 {'Error!  Please refresh your browser and try again' }
 </div>
 </td>
 </tr>
 );
 }

 var tm = this.state.teamMatch;
 var winner = <TeamLink team={tm.winner}></TeamLink>;
 var loser = <TeamLink team={tm.loser}></TeamLink>;

 return (
 <tr>
 <td >{winner}</td>
 <td>
 <TeamResult admin={this.props.admin} type={'racks'} callback={this.reload} teamMatch={tm} team={tm.winner} result={tm.winnerRacks}/>
 </td>
 <td>{loser}</td>
 <td>
 <TeamResult admin={this.props.admin} type={'racks'} callback={this.reload} teamMatch={tm} team={tm.loser} result={tm.loserRacks}/>
 </td>
 </tr>);
 }
 });

 var NineBallTeamMatch = React.createClass({
 mixins: [UserContextMixin],
 getInitialState: function() {
 return {
 teamMatch: this.props.teamMatch
 }
 },
 render: function() {
 var tm = this.state.teamMatch;
 var winner = <TeamLink team={tm.winner}></TeamLink>;
 var loser = <TeamLink team={tm.loser}></TeamLink>;
 if (this.props.type == 'played') {
 return (
 <tr>
 <td>{winner}</td>
 <td>
 <TeamResult admin={this.props.admin} type={'wins'} teamMatch={tm} team={tm.winner}
 result={tm.winnerSetWins}/>
 </td>
 <td>
 <TeamResult admin={this.props.admin} type={'racks'} teamMatch={tm} team={tm.winner}
 result={tm.winnerRacks}/>
 </td>
 <td>{loser}</td>
 <td>
 <TeamResult admin={this.props.admin} type={'wins'} teamMatch={tm} team={tm.loser}
 result={tm.loserSetWins}/>
 </td>
 <td>
 <TeamResult admin={this.props.admin} type={'racks'} teamMatch={tm} team={tm.loser}
 result={tm.loserRacks}/>
 </td>
 </tr>);
 }  else {
 return (
 <tr>
 <td>{winner}</td>
 <td>{loser}</td>
 </tr>);
 }
 }
 });

 var TeamResult = React.createClass({
 getInitialState: function() {
 return {
 }
 },
 onChange: function(e) {
 Util.getSomeData({
 url: '/api/teammatch/' +this.props.type + '/' + this.props.teamMatch.id + '/' + this.props.team.id + '/' + e.target.value,
 callback: function(d) {this.props.callback(d)}.bind(this),
 module: 'TeamRacks'
 })
 },
 render: function() {
 if (this.props.admin) {
 return (
 <select
 onChange={this.onChange}
 className="form-control"
 value={this.props.result}
 type={'select'}>
 {options}
 </select>
 );
 }

 return <span>{this.props.result}</span>
 }
 });

 */
