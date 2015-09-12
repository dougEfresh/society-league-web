var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Route = Router.Route
    , NotFoundRoute = Router.NotFoundRoute
    , Link = Router.Link
    , DefaultRoute = Router.DefaultRoute;

var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var Util = require('../../jsx/util.jsx');
var UserLink = require('../../jsx/components/links/UserLink.jsx');
var TeamLink = require('../../jsx/components/links/TeamLink.jsx');

var SeasonAdmin = React.createClass({
    mixins: [UserContextMixin, Router.State, Router.Navigation],
    getInitialState: function () {
        return {
            results: []
        };
    },
    getData: function () {
        Util.getData('/api/playerresult/get/teamMatch/' + this.getParams().matchId, function (d) {
            this.setState({results: d});
        }.bind(this));
    },
    componentDidMount: function () {
        this.getData();
    },
    componentWillReceiveProps: function (o, n) {
        var now = Date.now();
        if (now - this.state.update > 1000 * 60)
            this.getData();
    },
    render: function () {
        if (this.state.results.length == 0) {
            return null;
        }
        if (this.state.results[0].season.nine) {
            return <NineBallMatchResultsOnDay results={this.state.results}/>
        }
        return <EightBallMatchResultsOnDay results={this.state.results}/>;
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
    render: function() {
        var rows = [];
        this.props.results.forEach(function(r){
            rows.push(
                <tr key={r.id}>
                    <td>
                        <UserLink user={r.teamMember} handicap={r.teamMemberHandicap} />
                    </td>
                    <td>{r.win ? 'W' : 'L'}</td>
                    <td>{r.teamMemberRacks}</td>
                    <td><UserLink user={r.opponent} handicap={r.opponentHandicap}/></td>
                    <td >{r.opponentRacks}</td>
            </tr>);
        }.bind(this));
        return (
        <div className="table-responsive">
            <h2>{'Match Results - ' + Util.formatDateTime(this.props.results[0].teamMatch.matchDate)}</h2>
          <table className="table table-condensed table-stripped table-responsive" >
              <thead>
              <tr>
                  <th><TeamLink team={this.props.results[0].team} /></th>
                  <th>W/L</th>
                  <th>Racks</th>
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



module.exports = MatchResultsOnDay;