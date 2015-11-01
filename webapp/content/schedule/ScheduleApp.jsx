var React = require('react/addons');
var Util = require('../../jsx/util.jsx');
var TeamLink = require('../../jsx/components/links/TeamLink.jsx');
var Router = require('react-router')
    , Route = Router.Route
    , Link = Router.Link;
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var LoadingApp = require('../../jsx/components/LoadingApp.jsx');
var moment = require('moment');

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
            teams: []
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
    },
    componentDidMount: function () {
        this.getData(this.props.params.seasonId);
    },
    componentWillReceiveProps: function (n) {
        this.getData(n.params.seasonId);
    },
    getMatches: function(type){
        if (this.state[type] == null) {
            return null;
        }
        var rows = [];
        for (var md in this.state[type]) {
            rows.push(
                <TeamMatches key={md + '-' + type} type={type} date={md} teamMatches={this.state[type][md]} />
            )
        }
        return rows;
    },
    render: function() {
        if (this.state.upcoming == null && this.state.played == null && this.state.pending == null) {
            return (<LoadingApp /> )
        }
        return (
            <div>
                <div className="row" >
                {this.getMatches('pending')}
                </div>
                <div className="row" >
                    {this.getMatches('upcoming')}
                </div>
                <div className="row" >
                    {this.getMatches('played')}
                </div>
            </div>
        );
    }
});

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


module.exports = ScheduleApp;