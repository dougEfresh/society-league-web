var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;
var UserContextMixin = require('./../../jsx/mixins/UserContextMixin.jsx');
var DataStore= require('../../jsx/stores/DataStore.jsx');
var Handicap = require('../../lib/Handicap');

var StatHistory = React.createClass({
    mixins: [UserContextMixin,Router.State],
    getRows: function(results) {
        var rows = [];
          results.forEach(function(r){
            var race = Handicap.race(r.winnerHandicap,r.loserHandicap);
           rows.push(
               <tr key={r.teamMatch.id} >
                   <td>Blah</td>
                   <td>{r.getMatchDate()}</td>
                   <td>{r.isWinner(this.getUser())} </td>
                   <td>
                       <UserLink user={r.winner} />
                       <span> {'(' +r.getWinnerHandicap() +')'}</span>
                   </td>
                   <td> <UserLink user={r.loser} />
                       <span> {'(' +r.getLoserHandicap() +')'}</span>
                   </td>
                   <td>{race}</td>
                   <td>{r.winnerRacks}</td>
                   <td>{r.loserRacks}</td>
               </tr>
           )
        }.bind(this));

    },
      render: function() {
        if (this.getUserId() == 0) {
            return null;
        }
          var user = this.getUser();
          var results = user.getResults();
          var rows = [];
          results.forEach(function(r) {
             rows.push(u.getStatsForSeason(this.getParams().seasonId));
         }.bind(this));
            return (
                <div className="table-responsive">
                <table className="table table-hover table-condensed table-striped">
                    <tr>
                        <th>Player</th>
                        <th>Date</th>
                        <th>W/L</th>
                        <th>Points</th>
                        <th>Calculation</th>
                        <th>RW</th>
                        <th>RL</th>
                    </tr>
                     <tbody>
                     {this.getRows(results)}
                     </tbody>
                </table>
                </div>

            );
    }
});

module.exports = StatHistory;