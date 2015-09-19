var React = require('react/addons');
var Router = require('react-router')
    , Route = Router.Route
    , Link = Router.Link;

var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var Util = require('../../jsx/util.jsx');
var UserLink = require('../../jsx/components/links/UserLink.jsx');
var TeamLink = require('../../jsx/components/links/TeamLink.jsx');

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
    render: function () {
        if (this.state.teamMatch.id == undefined){
            return null;
        }
        return <MatchResults teamMatch={this.state.teamMatch} teamMembers={this.state.teamMembers} results={this.state.results}/>;
    }
});

var MatchResults = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function () {
        var options = [];
        for(var i = 0; i<41 ; i++) {
            options.push(<option key={i} value={i}>{i}</option>);
        }
        return {
            results: this.props.results,
            matchNumber: 0,
            options: options
        };
    },
    deleteMatch: function(e) {
        e.preventDefault();
        if (this.state.results.length == 0) {
            return ;
        }
        var r = this.state.results[this.state.results.length-1];
        if (r.id == undefined) {
            this.state.results.pop();
            this.setState({
                results: this.state.results
            });
            return;
        }
        console.log("Removing " + r.id + " from server");
    },

    addMatch: function(e) {
        e.preventDefault();
        var results = this.state.results;
        var num = this.state.matchNumber;
        num++;
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
            matchNumber: num
        };
        results.push(r);

        this.setState({
            results: results,
            matchNumber: num
        });

    },

    render: function() {
        var rows = [];
        var cnt = 0;
        this.state.results.forEach(function(r){
            rows.push(<Result key={cnt++} options={this.state.options} teamMatch={this.props.teamMatch} teamMembers={this.props.teamMembers} result={r} />);
        }.bind(this));
        var add = null;
        var del = null;
        if (this.getUser().admin){
            add = (<button onClick={this.addMatch}><span className="glyphicon glyphicon-plus-sign" ></span><b>Add</b></button>);
            del = (<button onClick={this.deleteMatch}><span className="glyphicon glyphicon-minus-sign" ></span><b>Delete</b></button>);
        }
        return (
            <div className="table-responsive">
                <h2>{'Match Results - ' + Util.formatDateTime(this.props.teamMatch.matchDate)}</h2>
                {add}
                {del}
                <table className="table table-condensed table-stripped" >
                    <thead>
                    <tr>
                        <th><TeamLink team={this.props.teamMatch.winner} /></th>
                        <th>Racks</th>
                        <th>W/L</th>
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
    mixins: [UserContextMixin],
    getInitialState: function () {
        return {
            result: this.props.result
        };
    },
    onChange: function(e) {

    },
    getRacks: function(type) {
        var racks = 0;
        if (type == 'winners') {
            racks = this.state.result.winnerTeamRacks;
        }
        racks = this.state.result.loserTeamRacks;
        if (this.getUser().admin) {

            return (
                <select ref='user' onChange={this.onChange}
                        className="form-control"
                        value={racks}
                        type={'select'}>
                    {this.props.options}
                </select>);
        }

        return racks;
    },
    getPlayer: function(type) {
        var r = this.state.result;
        var player = type == 'winners' ? r.winnerTeamPlayer : r.loserTeamPlayer;
        var hc = type == 'winners' ? r.winnerTeamHandicap : r.loserTeamHandicap;

        if (!this.getUser().admin) {
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
    render: function() {
        return (
            <tr>
                <td>{this.getPlayer('winners')}</td>
                <td>{this.getRacks('winners')}</td>
                <td>{this.getRacks('winners') > this.getRacks('losers') ? 'W' : 'L'}</td>
                <td>{this.getPlayer('losers')}</td>
                <td>{this.getRacks('losers')}</td>
            </tr>
        );
    }
});


module.exports = MatchResultsOnDay;