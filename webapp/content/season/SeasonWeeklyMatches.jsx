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

var SeasonWeeklyResults = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
        return {
            update: Date.now(),
            loading: false,
            results: null,
            adminMode: false,
            teams: []
        }
    },
    getData: function(id) {
        Util.getSomeData({
            url: '/api/teammatch/season/' + id,
            callback: function (d) {
                this.setState({results: d});
            }.bind(this),
            module: 'SeasonWeeklyResults',
            router: this.props.history
        });
        var cb = function (d) {
            this.setState({teams: d});
            teamOptions = [];
            d.forEach(function(t){
                teamOptions.push(<option key={t.id} value={t.id}>{t.name}</option> )
            }.bind(this));
        }.bind(this);

        Util.getSomeData({
            url: '/api/team/season/' + id,
            callback: cb,
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
    addMatch: function(e,dt) {
        e.preventDefault();
        if (dt == null || dt == undefined) {
            dt = moment().format('YYYY-MM-DD');
        }
        Util.getSomeData(
            {
                url: '/api/teammatch/admin/create/' + this.props.params.seasonId + '/' + dt,
                callback: function (d) {this.setState({results: d});}.bind(this),
                module: 'SeasonWeeklyResults',
                router: this.props.history
            }
        );
    },
    removeMatch: function(e,id) {
        if (id == null || id == undefined)
            return ;

        Util.getSomeData(
            {
                url: '/api/teammatch/admin/delete/' + id,
                callback: function (d) {this.setState({results: d});}.bind(this),
                module: 'SeasonWeeklyResults',
                router: this.props.history
            }
        );
    },
    adminMode: function(e) {
        e.preventDefault();
        this.setState({
            adminMode : !this.state.adminMode
        });
    },
    render: function() {
        var results = this.state.results;
        if (results == null || this.state.teams.length ==0) {
            return (<LoadingApp /> )
        }
        var rows = [];
        for (var md in results) {
            if (results.hasOwnProperty(md))
                rows.push(<TeamMatches addMatch={this.addMatch} removeMatch={this.removeMatch}
                                       admin={this.state.adminMode}
                                       teams={this.state.teams}
                                       key={md}
                                       date={md}
                                       teamMatches={results[md]} />);
        }
        var add = null;
        var adminMode = null;
        if (this.getUser().admin){
            //TODO Button Group
            add = (<button className="'btn btn-success" onClick={this.addMatch}>
                <span className="glyphicon glyphicon-plus-sign" ></span><b>Add New Match Date</b></button>);
            adminMode = (<button className={this.state.adminMode ? "'btn btn-success" : "btn-btn-default"}  onClick={this.adminMode}><span className="glyphicon glyphicon-user" ></span>
                <b>Admin Mode</b>
            </button>);
        }

        return (
                <div id={'season-app'} className="panel panel-default">
                    <div className="panel-heading">
                        {add}
                        {adminMode}
                    </div>
                     <div className="panel-body" >
                         {rows}
                     </div>
                </div>
        );
    }
});

var TeamMatches = React.createClass({
    mixins: [UserContextMixin],
    addMatch: function() {
        var dt = this.props.date;
        return function(e) {
            this.props.addMatch(e,dt);
        }.bind(this);
    },

     render: function() {
        if (this.props.teamMatches.length == 0) {
            return null;
        }
        var rows = [];
        this.props.teamMatches.forEach(function(r) {
            if (r.season.challenge)
                rows.push(<NineBallTeamMatch removeMatch={this.props.removeMatch} admin={this.props.admin} key={r.id} teamMatch={r} />);
            else
                rows.push(<NineBallTeamMatch removeMatch={this.props.removeMatch} admin={this.props.admin} key={r.id} teamMatch={r} />);
        }.bind(this));
         var season  = this.props.teamMatches[0].season;
         var add = null;

        if (this.props.admin){
            add = (<button onClick={this.addMatch()}><span className="glyphicon glyphicon-plus-sign" ></span><b>Add</b></button>);
        }
        return (
            <div className="table-responsive">
                <table className="table table-condensed table-stripped table-responsive" >
                    <thead>
                    <th colSpan="1">{Util.formatDateTime(this.props.date)}</th>
                    <th>{add}</th>
                    </thead>
                    <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                        <td style={{display: season.nine && !season.challenge ? 'table-cell' : 'none'}} >Wins</td>
                        <td>Racks</td>
                        <td></td>
                        <td style={{display: season.nine && !season.challenge ? 'table-cell' : 'none'}} >Wins</td>
                        <td>Racks</td>
                    </tr>
                    {rows}
                    </tbody>
                    <tfoot>
                    <th><td colSpan="7"></td></th>
                    </tfoot>
                </table>
            </div>
        );
    }
});

var NineBallTeamMatch = React.createClass({
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
    removeMatch: function() {
        return function(e) {
            return this.props.removeMatch(e,this.state.teamMatch.id);
        }.bind(this)
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
        var results = null;
        if (this.props.admin || tm.hasResults || tm.results ) {
            results = <Link to={'/app/season/' + tm.season.id + '/teamresults/' + tm.id}>Results</Link>;
        }
        var winner = <TeamLink team={tm.winner}></TeamLink>;
        var loser = <TeamLink team={tm.loser}></TeamLink>;
        if (this.props.admin) {
            winner = <select ref={'winner'} onChange={this.onChange} className="form-control" value={tm.winner.id} type={'select'}> {teamOptions} </select>;
            loser = <select ref={'loser'} onChange={this.onChange} className="form-control" value={tm.loser.id} type={'select'}> {teamOptions} </select>;
        }

        return (
            <tr>
                <td> {results} </td>
                <td style={{display:  tm.nine && !tm.challenge ? 'table-cell' :'none'}} >{winner}</td>
                <td style={{display:  tm.nine && !tm.challenge ? 'table-cell' :'none'}} >
                    <TeamResult admin={this.props.admin} type={'wins'} callback={this.reload} teamMatch={tm} team={tm.winner} result={tm.winnerSetWins}/>
                </td>
                <td>
                    <TeamResult admin={this.props.admin} type={'racks'} callback={this.reload} teamMatch={tm} team={tm.winner} result={tm.winnerRacks}/>
                </td>
                <td style={{display: this.props.admin ? 'table-cell' : 'none'}} >
                    <button className='btn btn-danger btn-xs' onClick={this.removeMatch()}><b>X</b></button>
                </td>

                <td style={{display:  tm.nine && !tm.challenge ? 'table-cell' :'none'}} >{loser}</td>
                <td style={{display:  tm.nine && !tm.challenge ? 'table-cell' :'none'}} >
                    <TeamResult admin={this.props.admin} type={'wins'} callback={this.reload} teamMatch={tm} team={tm.loser} result={tm.loserSetWins}/>
                </td>
                <td>
                    <TeamResult admin={this.props.admin} type={'racks'} callback={this.reload} teamMatch={tm} team={tm.loser} result={tm.loserRacks}/>
                </td>
            </tr>);
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


module.exports = SeasonWeeklyResults;