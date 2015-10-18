var React = require('react/addons');
var Router = require('react-router')
    , Route = Router.Route
    , Link = Router.Link
    , History = Router.History;

var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var Util = require('../../jsx/util.jsx');
var UserLink = require('../../jsx/components/links/UserLink.jsx');
var TeamLink = require('../../jsx/components/links/TeamLink.jsx');
var Handicap = require('../../lib/Handicap');

var options = [];
for(var i = 0; i<12; i++) {
    options.push(<option key={i} value={i}>{i}</option>);
}

var eightOptions = [];
eightOptions.push(<option key={0} value={0}>{0}</option>);
eightOptions.push(<option key={1} value={1}>{1}</option>);

var loserTeamMemberOptions= [];
var winnerTeamMemberOptions= [];

var MatchResultsOnDay = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function () {
        return {
            results: [],
            teamMembers: {},
            teamMatch: {},
            adminMode: false
        };
    },
    getData: function () {
        Util.getData('/api/playerresult/teammatch/' + this.props.params.matchId, function (d) {
            this.setState({results: d});
        }.bind(this),null,'SeasonMatchResultsOnDay');
        var cb = function callBack (d) {
            this.setState({teamMembers: d});
            winnerTeamMemberOptions = [];
            loserTeamMemberOptions = [];
            d['winners'].forEach(function(u){
                winnerTeamMemberOptions.push(<option key={u.id} value={u.id}>{u.name}</option>);
            });
            d['losers'].forEach(function(u){
                loserTeamMemberOptions.push(<option key={u.id} value={u.id}>{u.name}</option>);
            });
        }.bind(this);

        Util.getSomeData({
            url: '/api/teammatch/members/' + this.props.params.matchId,
            callback: cb,
            module: 'SeasonMatchResultsOnDay',
            router: this.props.history
        });

        Util.getData('/api/teammatch/' + this.props.params.matchId, function (d) {
            this.setState({teamMatch: d});
        }.bind(this),null,'SeasonMatchResultsOnDay');
    },
    componentDidMount: function () {
        this.getData();
    },
    componentWillReceiveProps: function (n) {
        var now = Date.now();
        if (now - this.state.update > 1000 * 60)
            this.getData();
    },
    adminMode: function(e) {
        e.preventDefault();
        this.setState({
            adminMode : !this.state.adminMode
        });
    },
    render: function () {
        if (this.state.teamMatch.id == undefined){
            return null;
        }
        var adminMode = null;
        if (this.getUser().admin){
            //TODO Button Group
            adminMode = (
                <button className={this.state.adminMode ? "'btn btn-success" : "btn-btn-default"}  onClick={this.adminMode}><span className="glyphicon glyphicon-user" ></span>
                <b>Admin Mode</b>
            </button>);
        }
        return <div>
            {adminMode}
            <MatchResults admin={this.state.adminMode} teamMatch={this.state.teamMatch} teamMembers={this.state.teamMembers} results={this.state.results}/>;
            </div>
    }
});

var MatchResults = React.createClass({
    mixins: [ History ],
    getInitialState: function () {
        return {
            results: this.props.results
        };
    },
    componentWillReceiveProps: function (n) {
       this.setState({
           results: n.results
       })
    },
    remove: function(r) {
        if (this.state.results.length == 0) {
            return ;
        }
        for(var i = 0; i< this.state.results.length; i++) {
            if (this.state.results[i] == null){
                continue;
            }
            if (r.id == this.state.results[i].id) {
                this.state.results[i] = null;
                break;
            }
        }
        this.setState({results: this.state.results});

        console.log("Removing " + r.id + " from server");
    },
    addMatch: function(e) {
        e.preventDefault();
        var results = this.state.results;
        var winner = this.props.teamMembers.winners[0];
        var loser = this.props.teamMembers.losers[0];
        var teamWinnerHandicap = null;
        var teamLoserHandicap = null;
        winner.handicapSeasons.forEach(function(hs){
            if (hs.season.id == this.props.teamMatch.season.id) {
                teamWinnerHandicap = hs.handicap;
            }
        }.bind(this));
        loser.handicapSeasons.forEach(function(hs){
            if (hs.season.id == this.props.teamMatch.season.id) {
                teamLoserHandicap = hs.handicap;
            }
        }.bind(this));
        var r = {
            teamMatch: this.props.teamMatch,
            playerHome: winner,
            playerAway: loser,
            winnerTeamPlayer: winner,
            loserTeamPlayer: loser,
            winnerTeamHandicap: teamWinnerHandicap,
            loserTeamHandicap: teamLoserHandicap,
            playerHomeRacks: 0,
            playerAwayRacks: 0,
            season: this.props.teamMatch.season
        };
        var matchNum = 0;
        for(var i = 0; i< results.length; i++) {
            if (results[i] == undefined || results[i] == null) {
                matchNum = i+1;
                r.matchNumber= matchNum;
                results[i] = r;
                break;
            }
        }
        if (matchNum == 0) {
            r.matchNumber = results.length+1;
            results.push(r);
        }
        this.setState({
            results: results
        });
    },
    getHeader: function() {
        if (this.props.teamMatch.season.nine)
            return (<tr>
            <th>Match #</th>
            <th><TeamLink team={this.props.teamMatch.winner} /></th>
            <th>Racks</th>
            <th>W/L</th>
            <th style={{display: this.props.admin ? 'table-cell' : 'none'}} ></th>
            <th><TeamLink team={this.props.teamMatch.loser} /></th>
            <th>Racks</th>
        </tr>);

        return (
            <tr>
            <th>Match #</th>
            <th><TeamLink team={this.props.teamMatch.winner} /></th>
            <th>W/L</th>
            <th style={{display: this.props.admin ? 'table-cell' : 'none'}} ></th>
            <th><TeamLink team={this.props.teamMatch.loser} /></th>
        </tr>
        );

    },
    render: function() {
        var rows = [];
        var cnt = 0;
        this.state.results.forEach(function(r){
            if (r != null)
                rows.push(
                    <Result key={cnt++}
                            admin={this.props.admin}
                            remove={this.remove}
                            teamMatch={this.props.teamMatch}
                            teamMembers={this.props.teamMembers}
                            result={r} />
                );
        }.bind(this));
        var add = null;
        if (this.props.admin){
            add = (<button onClick={this.addMatch}><span className="glyphicon glyphicon-plus-sign" ></span><b>Add</b></button>);
        }
        return (
            <div>
                {add}
            <div className="table-responsive">
                <h2>{'Match Results - ' + Util.formatDateTime(this.props.teamMatch.matchDate)}</h2>
                <table className="table table-condensed table-striped" >
                    <thead>
                    {this.getHeader()}
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>
                </table>
            </div>
            </div>
        )
    }
});

var Result =  React.createClass({
    mixins: [ History ],
    getInitialState: function () {
        return {
            result: this.props.result
        };
    },
    componentWillReceiveProps: function (n) {
       this.setState({
           result: n.result
       })
    },
    onChange: function(pr) {
        this.setState({
            result : pr
        })
    },
    remove: function(e) {
        e.preventDefault();
        this.props.remove(this.state.result);
    },
    render: function() {
        var r = this.state.result;
        if (r == undefined || r == null)
            return null;

        if (this.props.result.season.nine || this.props.admin) {
            return (
                <tr>
                    <td>{r.matchNumber}</td>
                    <td><TeamMember winners={winnerTeamMemberOptions} admin={this.props.admin} onChange={this.onChange}
                                    result={r}/></td>
                    <td>
                        <RackResult admin={this.props.admin} onChange={this.onChange} result={r}
                                    type={this.props.result.winnerType}/>
                    </td>
                    <td>{r.winnerTeamRacks > r.loserTeamRacks ? 'W' : 'L'}</td>
                    <td style={{display: this.props.admin ? 'table-cell' : 'none'}}>
                        <button className='btn btn-danger btn-xs' onClick={this.remove}><b>X</b></button>
                    </td>
                    <td><TeamMember losers={loserTeamMemberOptions} admin={this.props.admin} onChange={this.onChange}
                                    result={r}/></td>
                    <td>
                        <RackResult admin={this.props.admin} onChange={this.onChange} result={r}
                                    type={this.props.result.loserType}/>
                    </td>
                </tr>
            );

        }
        return (
                <tr>
                    <td>{r.matchNumber}</td>
                    <td><TeamMember winners={winnerTeamMemberOptions} admin={this.props.admin} onChange={this.onChange}
                                    result={r}/></td>
                    <td>{r.winnerTeamRacks > r.loserTeamRacks ? 'W' : 'L'}</td>
                    <td style={{display: this.props.admin ? 'table-cell' : 'none'}}>
                        <button className='btn btn-danger btn-xs' onClick={this.remove}><b>X</b></button>
                    </td>
                    <td><TeamMember losers={loserTeamMemberOptions} admin={this.props.admin} onChange={this.onChange}
                                    result={r}/></td>
                </tr>
            );


    }
});

var TeamMember = React.createClass({
    mixins: [ History ],
    onChange: function(e) {
        e.preventDefault();
        var type = 'home';
        if (this.props.winners != undefined) {
            type = this.props.result.winnerType;
        } else {
            type = this.props.result.loserType;
        }
        Util.getSomeData({
            url: '/api/playerresult/player/' + this.props.result.id  + '/' + type + '/' + e.target.value,
            callback: function(d) {this.props.onChange(d)}.bind(this),
            module: 'RackResult',
            router: this.history
        });
    },
    render: function(){
        var r = this.props.result;
        var player = this.props.winners != undefined ? r.winnerTeamPlayer : r.loserTeamPlayer;
        var hc =  this.props.winners != undefined ? r.winnerTeamHandicap : r.loserTeamHandicap;
        if (!this.props.admin) {
            return (<UserLink user={player} handicap={hc}/>);
        }
        return (
            <select ref='user' onChange={this.onChange}
                    className="form-control"
                    value={player.id}
                    type={'select'}>
                {this.props.winners == undefined ? this.props.losers : this.props.winners}
            </select>
        );

    }
});

var RackResult = React.createClass({
    mixins: [ History ],
    onChange: function(e) {
        e.preventDefault();
        var type = this.props.type;
        Util.getSomeData({
            url: '/api/playerresult/racks/' + this.props.result.id  + '/' + type + '/' + e.target.value,
            callback: function(d) {this.props.onChange(d)}.bind(this),
            module: 'RackResult',
            router: this.history
        });
    },
    render: function() {
        var racks = this.props.result[this.props.type +'Racks'];
        if (this.props.admin) {
            return (<select onChange={this.onChange}
                            className="form-control"
                            value={racks}
                            type={'select'}>
                {this.props.result.season.nine ? options : eightOptions}
            </select>);
        }
        return  <span>{racks}</span>
    }
});


module.exports = MatchResultsOnDay;