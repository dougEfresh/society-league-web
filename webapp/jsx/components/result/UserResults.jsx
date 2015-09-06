var React = require('react/addons');
var DataStore= require('../../stores/DataStore.jsx');
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var SeasonMixin = require('../../mixins/SeasonMixin.jsx');
var TeamMixin = require('../../mixins/TeamMixin.jsx');
var ResultMixin = require('../../mixins/ResultMixin.jsx');
var UserLink = require('../links/UserLink.jsx');

var UserResults = React.createClass({
    mixins: [UserContextMixin],
    getDefaultProps: function() {
        return {results: []};
    },
    render: function() {
        var rows = [];
        var user = this.getUser();
        this.props.results.forEach(function(r) {
            var op;
            var winner = false;
            if (r.winner.id == user.id) {
                op = r.loser;
                winner = true;
            } else {
                op = r.winner;
            }
            rows.push(<tr key={r.id}>
                <td>{r.teamMatch.matchDate}</td>
                <td>{op.name}</td>
                <td>{winner ? 'W' : 'L'}</td>
                </tr>);
        });
        return (
            <table>
                <thead>
                <tr>
                <th>Date</th>
                <th>Opponent</th>
                <th>W/L</th>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </table>
        );

    }
});


var ResultEight = React.createClass({
    render: function() {
        return null;
    }
});


var ResultNine = React.createClass({
    render: function() {
        return null;
    }
});


module.exports = UserResults;
