var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;
var UserContextMixin = require('./../../jsx/mixins/UserContextMixin.jsx');
var Handicap = require('../../lib/Handicap');
var UserLink = require('../../../webapp/jsx/components/links/UserLink.jsx');
var Util = require('../../jsx/util.jsx');
var UserResults = require('../../jsx/components/result/UserResults.jsx');

var StatHistory = React.createClass({
    mixins: [UserContextMixin,Router.State],
       getInitialState: function() {
         return {
             update: Date.now(),
             results: []
         }
    },
    getData: function() {
        Util.getData('/api/playerresult/get/user/' + this.getParams().statsId  + '/current', function(d) {
            this.setState({results: d});
        }.bind(this));
    },
    componentDidMount: function () {
        this.getData();
    },
    componentWillReceiveProps: function (o, n) {
        var now = Date.now();
        if ( now - this.state.update > 1000*60)
            this.getData();
       this.getData();
    },
   getRows: function(results) {
        var rows = [];
        var user = this.getUser();
          results.forEach(function(r){
              var race = Handicap.race(r.winnerHandicap,r.loserHandicap);
              var op = r.getOpponent(user);
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
       if (this.state.results.length == 0) {
           return null;
       }
        /*
        <div id={'no-recent-matches'} className="panel panel-default">
         <div className="panel-heading" >Matches</div>
         <div className="panel-body" >
         </div>
         </div>
         */
        return (

                <UserResults results={this.state.results} />

        );
    }
});

module.exports = StatHistory;