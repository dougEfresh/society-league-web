var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Route = Router.Route
    , NotFoundRoute = Router.NotFoundRoute
    , Link = Router.Link
    , DefaultRoute = Router.DefaultRoute;


var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var Stat =  require('../../lib/Stat');
var SeasonMixin = require('../../jsx/mixins/SeasonMixin.jsx');
var UserLink = require('../../../webapp/jsx/components/links/UserLink.jsx');

var SeasonLeaders = React.createClass({
    mixins: [UserContextMixin,SeasonMixin,Router.State,Router.Navigation],
    getInitialState: function () {
        return {
            user: this.getUser(),
            seasonId: this.getParams().seasonId
        }
    },
    componentDidMount: function () {
    },
    componentWillReceiveProps: function() {
    },
    getRows : function(data) {
        var rows = [];
        data.forEach(function(d){
            rows.push(
                <tr key={d.user.id}>
                    <td><UserLink user={d.user}/></td>
                    <td>{d.getPoints()}</td>
                    <td>{d.wins}</td>
                    <td>{d.loses}</td>
                    <td>{d.racksFor}</td>
                    <td>{d.racksAgainst}</td>
                    <td>{d.getWinPct()}</td>
                </tr>
            );
        });
        return rows;
    },
    render: function() {
        if (this.getUserId() == 0) {
            return null;
        }
        var users = [];
        this.getUsers().forEach(function(u) {
            if (u.hasSeason(this.getParams().seasonId)) {
                users.push(u);
            }
        }.bind(this));

        users = users.sort(function(a,b) {
            aStat = a.getStatsForSeason(this.getParams().seasonId);
            bStat = b.getStatsForSeason(this.getParams().seasonId);
            return Stat.sort.byWinPct(aStat,bStat);
        }.bind(this));

        var rows = [];
         users.forEach(function(u) {
             rows.push(u.getStatsForSeason(this.getParams().seasonId));
         }.bind(this));
            return (
                <div className="table-responsive">
                <table className="table table-hover table-condensed">
                    <tr>
                        <th>Player</th>
                        <th>Points</th>
                        <th>W</th>
                        <th>L</th>
                        <th>RW</th>
                        <th>RL</th>
                        <th>%</th>
                    </tr>
                     <tbody>
                     {this.getRows(rows)}
                     </tbody>
                </table>
                </div>

            );
    }
});

module.exports = SeasonLeaders;
