var React = require('react/addons');
var Router = require('react-router')
    , Route = Router.Route
    , Link = Router.Link;

var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var Util = require('../../jsx/util.jsx');
var UserLink = require('../../jsx/components/links/UserLink.jsx');
var TeamLink = require('../../jsx/components/links/TeamLink.jsx');
var options = [];
for(var i = 0; i<12; i++) {
    options.push(<option key={i} value={i}>{i}</option>);
}
var loserTeamMemberOptions= [];
var winerTeamMemberOptions= [];

var MatchResultsOnDay = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function () {
        return {
            results: [],
            teamMembers: {},
            teamMatch: {}
        };
    },
    getData: function () {
        Util.getData('/api/playerresult/teammatch/' + this.props.params.matchId, function (d) {
            this.setState({results: d});
        }.bind(this),null,'SeasonMatchResultsOnDay');
        Util.getData('/api/teammatch/members/' + this.props.params.matchId, function (d) {
            this.setState({teamMembers: d});
        }.bind(this),null,'SeasonMatchResultsOnDay');
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
    isAdmin: function(){
        if (this.getUser().admin) {
            if (this.props.location.query.admin != undefined && !this.props.location.query.admin) {
                return false;
            }
            return true;
        }
        return false;
    },
    render: function () {
        if (this.state.teamMatch.id == undefined){
            return null;
        }
        return <MatchResults admin={this.isAdmin()} teamMatch={this.state.teamMatch} teamMembers={this.state.teamMembers} results={this.state.results}/>;
    }
});



var MatchResults = React.createClass({
    getInitialState: function () {
        return {
            results: this.props.results,
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
            <div className="table-responsive">
                <h2>{'Match Results - ' + Util.formatDateTime(this.props.teamMatch.matchDate)}</h2>
                {add}
                <table className="table table-condensed table-stripped" >
                    <thead>
                    <tr>
                        <th>Match #</th>
                        <th><TeamLink team={this.props.teamMatch.winner} /></th>
                        <th>Racks</th>
                        <th>W/L</th>
                        <th style={{display: this.props.admin ? 'table-cell' : 'none'}} ></th>
                        <th><TeamLink team={this.props.teamMatch.loser} /></th>
                        <th>Racks</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>
                </table>
            </div>
        )
    }
});

var Result =  React.createClass({
    getInitialState: function () {
        return {
            result: this.props.result,
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
    getPlayer: function(type) {
        var r = this.props.result;
        var player = type == 'winners' ? r.winnerTeamPlayer : r.loserTeamPlayer;
        var hc = type == 'winners' ? r.winnerTeamHandicap : r.loserTeamHandicap;

        if (!this.props.admin) {
            return (<UserLink user={player} handicap={hc}/>);
        }

        var options = [];
        this.props.teamMembers[type].forEach(function(u) {
            options.push(<option key={u.id} value={u.id}>{u.name}</option>);
        });

        return (
            <select ref='user' onChange={this.onChange}
                    className="form-control"
                    value={player.id}
                    type={'select'}>
                {options}
            </select>);
    },
    remove: function(e) {
        e.preventDefault();
        this.props.remove(this.state.result);
    },
    render: function() {
        var r = this.state.result;
        if (r == undefined || r == null)
            return null;

        return (
            <tr>
                <td>{r.matchNumber}</td>
                <td>{this.getPlayer('winners')}</td>
                <td><RackResult  admin={this.props.admin} onChange={this.onChange} result={r}  type={'winner'} /></td>
                <td>{r.winnerTeamRacks > r.loserTeamRacks ? 'W' : 'L'}</td>
                <td style={{display: this.props.admin ? 'table-cell' : 'none'}} >
                    <button className='btn btn-danger btn-xs' onClick={this.remove}><b>X</b></button>
                </td>
                <td>{this.getPlayer('losers')}</td>
                <td>
                    <RackResult admin={this.props.admin} onChange={this.onChange} result={r} type={'loser'} />
                </td>
            </tr>
        );
    }
});

var TeamMember = React.createClass({
     getPlayer: function(type) {
        var r = this.props.result;
        var player = type == 'winners' ? r.winnerTeamPlayer : r.loserTeamPlayer;
        var hc = type == 'winners' ? r.winnerTeamHandicap : r.loserTeamHandicap;

        if (!this.props.admin) {
            return (<UserLink user={player} handicap={hc}/>);
        }

        var options = [];
        this.props.teamMembers[type].forEach(function(u) {
            options.push(<option key={u.id} value={u.id}>{u.name}</option>);
        });

        return (
            <select ref='user' onChange={this.onChange}
                    className="form-control"
                    value={player.id}
                    type={'select'}>
                {options}
            </select>);
    },
    render: function(){
        return null;
    }
});

var RackResult = React.createClass({
    onChange: function(e) {
        e.preventDefault();
        var type = 'home';
        if (this.props.type == 'winner') {
            type = this.props.r.winnerType;
        } else {
            type = this.props.r.loserType;
        }
        Util.getSomeData({
            url: '/api/playerresult/racks/' + this.props.result.id  + '/' + type + '/' + e.target.value,
            callback: function(d) {this.props.onChange(d)}.bind(this),
            module: 'RackResult'
        });
    },
    render: function() {
        var racks = this.props.type == 'winner' ? this.props.result.winnerTeamRacks :  this.props.result.loserTeamRacks;
        if (this.props.admin) {
            return (<select onChange={this.onChange}
                            className="form-control"
                            value={racks}
                            type={'select'}>
                {options}
            </select>);
        }

        return  <span>{racks}</span>
    }
});


module.exports = MatchResultsOnDay;