var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;
var UserContextMixin = require('./../../jsx/mixins/UserContextMixin.jsx');
var DataStore = require('../../jsx/stores/DataStore.jsx');
var Handicap = require('../../lib/Handicap');
var UserLink = require('../../../webapp/jsx/components/links/UserLink.jsx');

var StatHistory = React.createClass({
    mixins: [UserContextMixin,Router.State],
    getRows: function(results) {
        var rows = [];
        var user = this.getUser();
          results.forEach(function(r){
              var race = Handicap.race(r.winnerHandicap,r.loserHandicap);
              var op = r.getOpponent(user);
              //<td>{user.getCalculation(r.resultId)}</td>
           rows.push(
               <tr key={r.teamMatch.id} >
                   <td>
                       <UserLink user={op} />
                       <span> {'(' +r.getHandicap(op) +')'}</span>
                   </td>
                   <td>{r.getMatchDate()}</td>
                   <td>{r.isWinner(user) ? 'W' : 'L'} </td>
                   <td>{race}</td>
                   <td>{user.getMatchPoint(r.resultId)}</td>
                   <td>{user.getWeightedAvg(r.resultId)}</td>

                   <td>{r.getRacks(user)}</td>
                   <td>{r.getRacks(op)}</td>
               </tr>
           )
        }.bind(this));
        return rows;
    },
      render: function() {
        if (this.getUserId() == 0) {
            return null;
        }
          var user = this.getUser();
          var results = user.getResults();
          results = results.sort(function(a,b){
            return a.getMatchDate().localeCompare(b.getMatchDate());
          });
            return (
                <div className="table-responsive">
                <table className="table table-hover table-condensed table-striped">
                    <tr>
                        <th>Player</th>
                        <th>Date</th>
                        <th>W/L</th>
                        <th>Race</th>
                        <th>Points</th>
                        <th>Weighted Avg</th>
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