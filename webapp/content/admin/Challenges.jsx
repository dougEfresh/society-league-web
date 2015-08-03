var React = require('react/addons');
var Router = require('react-router'),RouteHandler = Router.RouteHandler;
var UserContextMixin = require('./../../jsx/mixins/UserContextMixin.jsx');
var DataStore = require('../../jsx/stores/DataStore.jsx');
var UserLink = require('../../jsx/components/links/UserLink.jsx');
var Handicap = require('../../lib/Handicap');

var Challenges = React.createClass({
    mixins: [UserContextMixin,Router.Navigation,Router.State],

    render: function() {
        var challenges = DataStore.getChallenges();
        var accepted = [];
        var pending = [];
        challenges.forEach(function(c){
            if(c.status == 'ACCEPTED') {
                accepted.push(c);
            }
        }.bind(this));

        challenges.forEach(function(c){
            if(c.status == 'PENDING') {
                pending.push(c);
            }
        }.bind(this));
        var acceptedRows = [];
        var pendingRows = [];
        accepted = accepted.sort(function(a,b) {
            return a.slot.date.localeCompare(b.slot.date);
        }.bind(this));

        accepted.forEach(function(c) {
            acceptedRows.push(<tr key={c.id}>
                <td>{c.status}</td>
                <td><UserLink user={c.challenger} /></td>
                <td><UserLink user={c.opponent} /></td>
                <td>{Handicap.race(c.challenger.getRawChallengeHandicap(),c.opponent.getRawChallengeHandicap())}</td>
                <td>{c.slot.getFullDate()} </td>
            </tr>)
        });
          pending.forEach(function(c) {
            pendingRows.push(<tr key={c.id}>
                <td>{c.status}</td>
                <td><UserLink user={c.challenger} /></td>
                <td><UserLink user={c.opponent} /></td>
                <td>{Handicap.race(c.challenger.getRawChallengeHandicap(),c.opponent.getRawChallengeHandicap())}</td>
                <td>{c.slot.getFullDate()} </td>
            </tr>)
        });

        return (
            <div>
          <div className="table-responsive">
                 <table className="table table-hover table-condensed">
                    <tr>
                        <th>Status</th>
                        <th>Challenger</th>
                        <th>Opponent</th>
                        <th>Race</th>
                        <th>Time</th>
                    </tr>
                     <tbody>
                     {acceptedRows}
                     </tbody>
                </table>
          </div>

                <div className="table-responsive">
                 <table className="table table-hover table-condensed">
                    <tr>
                        <th>Status</th>
                        <th>Challenger</th>
                        <th>Opponent</th>
                        <th>Race</th>
                        <th>Time</th>
                    </tr>
                     <tbody>
                     {pendingRows}
                     </tbody>
                </table>
          </div>
                </div>
        );
    }
});

module.exports = Challenges;