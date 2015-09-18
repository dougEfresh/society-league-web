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
            teamMembers: {}
        };
    },
    getData: function () {
        Util.getData('/api/playerresult/teammatch/' + this.props.params.matchId, function (d) {
            this.setState({results: d});
        }.bind(this),null,'SeasonMatchResultsOnDay');

        Util.getData('/api/teammatch/members/' + this.props.params.matchId, function (d) {
            this.setState({teamMembers: d});
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
        if (this.state.results.length == 0) {
            return null;
        }
        if (this.state.results[0].season.nine) {
            return <NineBallMatchResultsOnDay teamMembers={this.state.teamMembers} results={this.state.results}/>
        }
        return <EightBallMatchResultsOnDay teamMembers={this.state.teamMembers} results={this.state.results}/>;
    }
});

var EightBallMatchResultsOnDay = React.createClass({
    render: function() {
        var rows = [];
        var homeWins = 0;
        var awayWins = 0;
        this.props.results.forEach(function(r){
            rows.push(
                <tr key={r.id}>
                    <td >
                        <UserLink user={r.teamMember} handicap={r.teamMemberHandicap} />
                    </td>
                    <td>{r.win ? ++homeWins : homeWins}</td>
                    <td>{r.win ? 'W' : 'L'}</td>
                    <td >
                        <UserLink user={r.opponent} handicap={r.opponentHandicap}/>
                    </td>
                    <td>{r.win ? awayWins : ++awayWins}</td>
            </tr>);
        }.bind(this));
        var team = this.props.results[0].team;
        var opTeam = this.props.results[0].opponentTeam;
        var teamMatch = this.props.results[0].teamMatch;
        return (
        <div className="table-responsive">
            <h2>{'Match Results - ' + Util.formatDateTime(this.props.results[0].teamMatch.matchDate)}</h2>
            <table className="table table-condensed table-stripped table-responsive" >
              <thead>
              <tr>
                  <th><TeamLink team={team} /></th>
                  <th><span className="label label-success">{team.id == teamMatch.home.id ? teamMatch.homeRacks : teamMatch.awayRacks}</span></th>
                  <th>W/L</th>
                  <th><TeamLink team={opTeam} /></th>
                  <th><span className="label label-danger">{opTeam.id == teamMatch.home.id ? teamMatch.homeRacks : teamMatch.awayRacks}</span></th>
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

var NineBallMatchResultsOnDay = React.createClass({
    mixins: [UserContextMixin],
    render: function() {
        var rows = [];
        this.props.results.forEach(function(r){
            rows.push(<NineBallResult key={r.id} teamMembers={this.props.teamMembers} result={r} />);
        }.bind(this));
        return (
        <div className="table-responsive">
            <h2>{'Match Results - ' + Util.formatDateTime(this.props.results[0].teamMatch.matchDate)}</h2>
          <table className="table table-condensed table-stripped table-responsive" >
              <thead>
              <tr>
                  <th><TeamLink team={this.props.results[0].team} /></th>
                  <th>Racks</th>
                  <th>W/L</th>
                  <th><TeamLink team={this.props.results[0].opponentTeam} /></th>
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

var NineBallResult =  React.createClass({
    mixins: [UserContextMixin],
    getPlayer: function(type) {
        var r = this.props.result;
        var player = type == 'winners' ? r.teamMember : r.opponent;
        var hc = type == 'winners' ? r.teamMemberHandicap : r.opponentHandicap;

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
        var r = this.props.result;
        return (
            <tr>
                <td>
                    {this.getPlayer('winners')}
                </td>
                <td>{r.teamMemberRacks}</td>
                <td>{r.win ? 'W' : 'L'}</td>
                <td>{this.getPlayer('losers')}</td>
                <td >{r.opponentRacks}</td>
            </tr>
        );
    }
});




module.exports = MatchResultsOnDay;