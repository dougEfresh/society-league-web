var React = require('react/addons');
var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;
var UserContextMixin = require('./../../jsx/mixins/UserContextMixin.jsx');
var DataStore = require('../../jsx/stores/DataStore.jsx');
var UserLink = require('../../jsx/components/links/UserLink.jsx');

var ChallengeResults = React.createClass({
    mixins: [UserContextMixin,Router.Navigation,Router.State],
    onSelectRacks : function(e) {

    },
    render: function() {
        var challenges = DataStore.getChallenges();
        var accepted = [];
        challenges.forEach(function(c){
            if(c.status == 'ACCEPTED') {
                accepted.push(c);
            }
        }.bind(this));
        var acceptedRows = [];
        accepted = accepted.sort(function(a,b) {
            return a.slot.date.localeCompare(b.slot.date);
        }.bind(this));
        var racks = [];
        for(var i=0; i < 12; i++) {
            racks.push(<option key={i} value={i}>{i}</option>)
        }
        var chRacks = this.getQuery().chracks;
        var opRacks = this.getQuery().opracks;

        accepted.forEach(function(c) {
            acceptedRows.push(<tr key={c.id}>
                <td>{c.status}</td>
                <td><UserLink user={c.challenger} /></td>
                <td><UserLink user={c.opponent} /></td>
                <td>{c.slot.getFullDate()} </td>
                <td>
                    <select id={'challenger-' + c.id} ref='handicap' onChange={this.onSelectRacks}
                            className="form-control"
                            value={chRacks}
                            type={'select'}>
                        {racks}
                    </select>
                </td>
                 <td>
                    <select id={'opponent-' + c.id} ref='handicap' onChange={this.onSelectRacks}
                            className="form-control"
                            value={opRacks}
                            type={'select'}>
                        {racks}
                    </select>
                </td>
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
                            <th>Time</th>
                            <th>Challenger Racks</th>
                            <th>Opponent Racks</th>
                        </tr>
                        <tbody>
                        {acceptedRows}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
});

module.exports = ChallengeResults;