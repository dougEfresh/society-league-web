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
            season: null
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
            url: '/api/season/' + this.props.params.seasonId,
            callback: function (d) {
                this.setState({season: d});
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
        if (this.state.upcoming == null && this.state.played == null && this.state.pending == null) {
            return (<LoadingApp /> )
        }

        return (
            <div>
                <MatchResults  season={this.state.season} params={this.props.params} history={this.props.history} matches={this.state.played} />
                <PlayerResults history={this.props.history} matchId={this.props.params.matchId} />
                <UpcomingMatches params={this.props.params} matches={this.state.upcoming} />
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
        this.props.matches.forEach(function(m) {
            rows.push(
                <tr key={m.id}>
                    <td className="schedule-home">
                        <TeamLink team={m.home}/>
                    </td>
                    <td className="schedule-vs">
                        <span className="vs"> Vs. </span>
                    </td>
                    <td className="schedule-away">
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
            rows.push(<UpcomingWeeklyMatch key={md} date={md} matches={this.props.matches[md]} />);
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
        this.props.matches.forEach(function(m) {
            if (m.winner.season.nine) {
                rows.push(
                    <tr key={m.id}>
                        <td className="result-winner"><TeamLink onClick={this.showResults(m)} team={m.winner}/></td>
                        <td className="racks">{m.winnerSetWins}</td>
                        <td className="racks">{m.winnerRacks}</td>
                        <td className="result-loser"><TeamLink onClick={this.showResults(m)}  team={m.loser}/></td>
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
            rows.push(<TeamResults toggleHeading={this.toggleHeading}history={this.props.history} key={md} date={md} matches={this.props.matches[md]} />);
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
        return (
            <div className="panel panel-default panel-results">
                <a onClick={this.toggleHeading} href='#'>
                    <div className={"panel-heading" +(this.state.toggle ? "" : " panel-closed")}>
                        <div className="row panel-title">
                            <div className="col-xs-10 col-md-11 p-title">
                              <span className="fa fa-trophy"></span><span> Results<span> {this.props.season.shortName}</span></span>
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

var  customStyles = {
  content : {
      /*
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
    */
      backgroundColor   : 'rgba(0, 0, 0, 0.75)'
  }
};

var PlayerResults = React.createClass({
    getInitialState: function() {
        return {
            results : [],
            toggle: false,
            modalIsOpen: true
        }
    },
    getData: function(id){
        if (id)
         Util.getSomeData(
             {
                 url: '/api/playerresult/teammatch/' + id, callback: function (d) {
                 this.setState({results: d, toggle: true})
             }.bind(this),
                 module: 'SeasonMatchResultsOnDay'
             });
    },
    componentWillReceiveProps: function(n) {
        if (n.matchId == undefined){
            this.setState({results: [], modalIsOpen: false});
        }
        if (n.matchId != this.props.matchId) {
            this.getData(n.matchId);
        }
    },
    componentDidMount: function() {
        if (this.props.matchId != undefined)
            this.getData(this.props.matchId);
    },
    getHeader: function(m) {
        var s = m.teamMatch.home.season;
        if (s.nine) {
            return (<tr>
                <th className="racks match-number">#</th>
                <th className="user">
                    <span>{m.teamMatch.winner.name}</span>
                    <span className="badge winner-team-racks-badge racks-badge ">{'R:' +  m.teamMatch.winnerRacks}</span>
                </th>
                <th className="racks hc winner-hc">HC</th>
                <th className="racks win-lost">W/L</th>
                <th className="user opponent">
                    <span>{m.teamMatch.loser.name}</span>
                    <span className="badge loser-team-racks-badge racks-badge ">{'R:' +  m.teamMatch.loserRacks}</span>
                </th>
                <th className="racks hc loser-hc">HC</th>
                <th className="score">S</th>
                <th className="score">Race</th>
            </tr>)
        }
        if (s.challenge) {
            return null;
        }

        if (s.scramble) {
            return null;
        }
         return (<tr>
                <th className="racks match-number">#</th>
                <th className="user">
                    <span>{m.teamMatch.winner.name}</span>
                    <span className="badge winner-team-racks-badge racks-badge">{'R:' +  m.teamMatch.winnerRacks}</span>
                </th>
                <th className="racks hc winner-hc">HC</th>
                <th className="racks win-lost">W/L</th>
                <th className="user opponent">
                    <span>{m.teamMatch.loser.name}</span>
                    <span className="badge loser-team-racks-badge racks-badge">{'R:' +  m.teamMatch.loserRacks}</span>
                </th>
             <th className="racks hc">HC</th>

            </tr>)

    },
    getRows: function() {
        var rows = [];
        var s = this.state.results[0].teamMatch.home.season;
        var cnt = 0;
        if (s.nine && !s.challenge) {
            this.state.results.forEach(function (m) {
                var wl = m.winnerTeamRacks > m.loserTeamRacks ? 'W' : 'L';
                rows.push(
                    <tr key={cnt++}>
                        <td className="racks match-number">{m.matchNumber}</td>
                        <td className="winner"><UserLink user={m.winnerTeamPlayer} season={m.teamMatch.season}/>
                        </td>
                        <td className="racks hc winner-hc">{Handicap.formatHandicap(m.winnerTeamHandicap)}</td>
                        <td className={"racks win-lost " + (wl == 'W' ? 'win' : 'lost')}>{wl}</td>
                        <td className="loser"><UserLink user={m.loserTeamPlayer} season={m.teamMatch.season}/></td>
                        <td className="racks hc loser-hc">{Handicap.formatHandicap(m.loserTeamHandicap)}</td>
                        <td className="score">{m.winnerTeamRacks + '-' + m.loserTeamRacks}</td>
                        <td className="racks race">{Handicap.race(m.winnerTeamHandicap, m.loserTeamHandicap)}</td>
                    </tr>
                )
            });
            return rows;
        }
        if (s.challenge)
            return rows;

        if (s.scramble)
            return rows;

        this.state.results.forEach(function (m) {
            var wl = m.winnerTeamRacks > m.loserTeamRacks ? 'W' : 'L';
                rows.push(
                    <tr key={cnt++}>
                        <td className="racks match-number">{m.matchNumber}</td>
                        <td className="winner"><UserLink user={m.winnerTeamPlayer} season={m.teamMatch.season}/>
                        </td>
                        <td className="racks hc winner-hc">{Handicap.formatHandicap(m.winnerTeamHandicap)}</td>
                        <td className={"racks win-lost " + (wl == 'W' ? 'win' : 'lost')}>{wl}</td>
                        <td className="loser"><UserLink user={m.loserTeamPlayer} season={m.teamMatch.season}/></td>
                        <td className="racks hc loser-hc">{Handicap.formatHandicap(m.loserTeamHandicap)}</td>
                    </tr>
                )
            });

        return rows;
    },
    openModal: function() {
        this.setState({modalIsOpen: true});
  },

  closeModal: function() {
      this.props.history.pushState(null,'/app/schedule/' + this.state.results[0].season.id);
      this.setState({modalIsOpen: false});
  },
    handleClose: function( ) {

    },

    render: function() {
        if (this.state.results.length == 0) {
            return null;
        }
        var m = this.state.results[0];
        var toggleHeading = function(e){e.preventDefault(); this.setState({toggle: !this.state.toggle})}.bind(this);
        this.state.modalIsOpen = true;
        var defaultStyles = {
            overlay : {
                position        : 'fixed',
                top             : 0,
                left            : 0,
                right           : 0,
                bottom          : 0,
                backgroundColor : 'rgba(0, 0, 0, 0.75)'
            },
            content : {
                position                : 'absolute',
                top                     : '40px',
                left                    : '0px',
                right                   : '0px',
                bottom                  : '0px',
                border                  : '1px solid #ccc',
                background              : '#DDD',
                overflow                : 'auto',
                WebkitOverflowScrolling : 'touch',
                borderRadius            : '4px',
                outline                 : 'none',
                padding                 : '0px'

            }
        };
        return (
            <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.handleClose}
                    className="Modal__Bootstrap modal-dialog"
                    style={defaultStyles}
                >
                  <div className="modal-content">
                      <div className="modal-header">
                          <div className="p-title">
                              <span className="fa winner-badge"></span>
                              <span> {m.teamMatch.winner.name}</span>
                              <span> Vs.</span>
                              <span>{m.teamMatch.loser.name}</span>
                              <div style={{float: 'right'}}>
                                  <button  type="button" className="btn btn-primary btn-modal" onClick={this.closeModal}>X</button>
                              </div>
                          </div>
                      </div>
                      <div className="modal-body">
                          <div className="table-responsive">
                            <table className="table table-users table-grid table-bordered table-condensed table-striped" >
                                <thead>
                                {this.getHeader(m)}
                                </thead>
                                <tbody>
                                {this.getRows()}
                                </tbody>
                            </table>
                          </div>
                      </div>
                      <div className="modal-footer">
                          <button type="button" className="btn btn-primary" onClick={this.closeModal}>X</button>
                      </div>
                  </div>
            </Modal>
        )
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