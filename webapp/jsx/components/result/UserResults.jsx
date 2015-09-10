var React = require('react/addons');
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var UserLink = require('../links/UserLink.jsx');
var Util = require('../../util.jsx');
var Handicap = require('../../../lib/Handicap');
var SeasonLink = require('../links/SeasonLink.jsx');

var UserResults = React.createClass({
    mixins: [UserContextMixin],
    getDefaultProps: function() {
        return {season : null, results: []};
    },
    render: function() {
        var rows = [];
        this.props.results.forEach(function(r) {
            rows.push(<tr key={r.id}>
                <td>{Util.formatDateTime(r.teamMatch.matchDate)}</td>
                <td>{r.teamMemberHandicap}</td>
                <td><SeasonLink season={r.season}/></td>
                <td><UserLink user={r.opponent} handicap={r.opponentHandicap} season={r.season.id} /></td>
                <td>{r.win ? 'W' : 'L'}</td>
                </tr>);
        });
        return (
             <div className="table-responsive">
            <table className="table table-condensed table-responsive" >
                <thead>
                <tr>
                    <th>Date</th>
                    <th>HC</th>
                    <th>Season</th>
                    <th>Opponent</th>
                    <th>W/L</th>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </table>
             </div>
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
