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

var TeamMatchResults = React.createClass({
    getInitialState: function() {
        return {
            results : []
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
        if (n.params.matchId == undefined){
            this.setState({results: []});
        }
        if (n.params.matchId != this.props.params.matchId) {
            this.getData(n.params.matchId);
        }
    },
    componentDidMount: function() {
        if (this.props.params.matchId != undefined)
            this.getData(this.props.params.matchId);
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
                <th className="hide racks win-lost">W/L</th>
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
                <th className="racks win-lost hide">W/L</th>
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
                var hill = m.winnerRacks  - m.loserRacks == 1 ? "hill" : "";
                rows.push(
                    <tr key={cnt++}>
                        <td className="racks match-number">{m.matchNumber}</td>
                        <td className={"winner-team-player " + (m.winnerTeamRacks > m.loserTeamRacks ? 'win' : 'lost')}>
                            <UserLink user={m.winnerTeamPlayer} season={m.teamMatch.season}/>
                            <span className={"fa fa-check winner-check " + (m.winnerTeamRacks > m.loserTeamRacks ? 'win' : 'hide')} ></span>
                        </td>
                        <td className="racks hc winner-hc">{Handicap.formatHandicap(m.winnerTeamHandicap)}</td>
                        <td className={"hide racks win-lost " + (wl == 'W' ? 'win' : 'lost')}>{wl}</td>
                        <td className={"loser-team-player " + (m.loserTeamRacks > m.winnerTeamRacks  ? 'win' : 'lost')}>
                            <UserLink user={m.loserTeamPlayer} season={m.teamMatch.season}/>
                            <span className={"fa fa-check winner-check " + (m.loserTeamRacks > m.winnerTeamRacks  ? 'win' : 'hide')} ></span>
                        </td>
                        <td className="racks hc loser-hc">{Handicap.formatHandicap(m.loserTeamHandicap)}</td>
                        <td className={"score " +  hill }>{m.winnerTeamRacks + '-' + m.loserTeamRacks}</td>
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
                        <td className={"winner-team-player " + (m.winnerTeamRacks > m.loserTeamRacks ? 'win' : 'lost')}>
                            <UserLink user={m.winnerTeamPlayer} season={m.teamMatch.season}/>
                            <span className={"fa fa-check winner-check " + (m.winnerTeamRacks > m.loserTeamRacks ? 'win' : 'hide')} ></span>
                        </td>
                        <td className="racks hc winner-hc">{Handicap.formatHandicap(m.winnerTeamHandicap)}</td>
                        <td className={"hide racks win-lost " + (wl == 'W' ? 'win' : 'lost')}>{wl}</td>
                        <td className={"loser-team-player " + (m.loserTeamRacks > m.winnerTeamRacks  ? 'win' : 'lost')}>
                            <UserLink user={m.loserTeamPlayer} season={m.teamMatch.season}/>
                            <span className={"fa fa-check winner-check " + (wl == 'L' ? 'win' : 'hide')} ></span>
                        </td>
                        <td className="racks hc loser-hc">{Handicap.formatHandicap(m.loserTeamHandicap)}</td>
                    </tr>
                )
            });

        return rows;
    },
    render: function() {
        if (this.state.results.length == 0) {
            return null;
        }
        var m = this.state.results[0];
        return (
            <div className="row" >
                <div className="col-xs-12 col-md-6">
                    <div className="panel panel-default panel-results-players">
                        <div className="panel-heading panel-results-players-title">
                            <span className="fa winner-badge"></span>
                            <span> {m.teamMatch.winner.name}</span>
                            <span> Vs.</span>
                            <span>{m.teamMatch.loser.name}</span>
                            <div style={{float: 'right'}}>
                                <Link to={'/app/schedule/' + this.props.params.seasonId}>
                                    <button  type="button" className="btn btn-primary btn-xs btn-results-back">
                                        <span className="fa fa-backward"></span>
                                        <span className="team-results-back"> Back</span>
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className={"panel-body"} >
                            <div className="table-responsive">
                                <table style={{backgroundColor: 'whitesmoke'}} className="table table-users table-grid table-bordered table-condensed" >
                                    <thead>
                                    {this.getHeader(m)}
                                    </thead>
                                    <tbody>
                                    {this.getRows()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = TeamMatchResults;