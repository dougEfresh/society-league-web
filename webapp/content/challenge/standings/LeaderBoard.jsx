var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Link = Router.Link;

var UserContextMixin = require('../../../jsx/mixins/UserContextMixin.jsx');
var Stat =  require('../../../lib/Stat');
var SeasonMixin = require('../../../jsx/mixins/SeasonMixin.jsx');
var UserLink = require('../../../../webapp/jsx/components/links/UserLink.jsx');
var DataStore = require('../../../jsx/stores/DataStore.jsx');

var LeaderBoard = React.createClass({
    mixins: [UserContextMixin,SeasonMixin,Router.State,Router.Navigation],
    getRows : function(data,topgun) {
        var rows = [];
        data.forEach(function(d){
            if (d.user == undefined || d.user.id == undefined)
                return;
            rows.push(
                <tr key={d.user.id}>
                    <td><UserLink user={d.user}/>
                    </td>
                    <td> <div className="btn-group bot-margin">
                        <Link id={"request-link-"+ d.user.id } to="challengeMain" query={{opponent: d.user.id}}>
                            <button className="btn btn-xs btn-primary">
                                <span className="glyphicon glyphicon-plus-sign"></span>
                                <span className="main-item">Challenge</span>
                            </button>
                        </Link>
                    </div>
                    </td>
                    <td>{d.user.getCurrentHandicap(topgun.id)}</td>
                    <td>{d.getPoints()}</td>
                    <td>{d.wins}</td>
                    <td>{d.loses}</td>
                    <td>{d.racksFor}</td>
                    <td>{d.racksAgainst}</td>
                    <td>{d.getWinPct()}</td>
                </tr>
            );
        }.bind(this));
        return rows;
    },
    render: function() {
        var seasons = DataStore.getSeasons();
        var topgun = undefined;
        seasons.forEach(function(s){
            if (s.isChallenge()) {
                topgun = s;
            }
        });

        if (this.getUserId() == 0) {
            return null;
        }
        var users = [];
        this.getUsers().forEach(function(u) {
            if (u.hasSeason(topgun.id)) {
                users.push(u);
            }
        }.bind(this));

        users = users.sort(function(a,b) {
            aStat = a.getStatsForSeason(topgun.id);
            bStat = b.getStatsForSeason(topgun.id);
            return Stat.sort.byPoints(aStat,bStat);
        }.bind(this));

        var rows = [];
         users.forEach(function(u) {
             rows.push(u.getStatsForSeason(topgun.id));
         }.bind(this));
            return (
                 <div id={'leaders'} className="panel panel-default">
                     <div className="panel-heading" >Leaders</div>
                     <div className="panel-body" >
                <div className="table-responsive">
                <table className="table table-hover table-condensed table-striped">
                    <tr>
                        <th>Player</th>
                        <th></th>
                        <th>HC</th>
                        <th>Points</th>
                        <th>W</th>
                        <th>L</th>
                        <th>RW</th>
                        <th>RL</th>
                        <th>%</th>
                    </tr>
                     <tbody>
                     {this.getRows(rows,topgun)}
                     </tbody>
                </table>
                </div>
            </div>
                 </div>

            );
    }
});

module.exports = LeaderBoard;
