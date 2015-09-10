var React = require('react/addons');
var Router = require('react-router');
var Util = require('../../jsx/util.jsx');
var UserContextMixin = require('./../../jsx/mixins/UserContextMixin.jsx');
var Handicap = require('../../lib/Handicap');
var SeasonLink = require('../../jsx/components/links/SeasonLink.jsx');

var StatsDisplay = React.createClass({
    mixins: [UserContextMixin,Router.State],
     getInitialState: function() {
         return {
             update: Date.now(),
             stats: []
         }
    },
    getData: function() {
        Util.getData('/api/stat/user/' + this.getParams().statsId , function(d){
            this.setState({stats: d});
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
    getRows: function(data) {
        var rows = [];
        var userId = this.getParams().statsId;
        var cnt = 0;
        data.forEach(function(d){
            /*
            if (d.type == 'challenge') {

                return;
            }
            var type = d.getType();
            var hc = '';

            if (d.getType() == 'season') {
                type = d.season.getDisplayName();
                hc = user.getCurrentHandicap(d.season.id);
            }
            if (d.getType() == 'all') {
                type = 'overall';
            }
//<td> {d.getPoints()} </td>
             */
            var hc = "";
            if (d.team && d.user) {
                d.user.handicapSeasons.forEach(function(hs){
                    if (hs.season.id == d.team.season.id) {
                        hc = Handicap.formatHandicap(hs.handicap);
                    }
                });
            }
            cnt += 1;
            var type = d.type;
            if (d.type == 'USER_SEASON') {
                type = <SeasonLink season={d.team.season} />;
            }
            if (d.type == 'ALL') {
                type = 'Lifetime';
            }

            rows.push(
                <tr key={cnt}>
                    <td>{type}</td>
                    <td>{hc}</td>
                    <td>{d.wins}</td>
                    <td>{d.loses}</td>
                    <td>{d.racksWon}</td>
                    <td>{d.racksLost}</td>
                    <td>{d.winPct.toFixed(3)}</td>
                </tr>);
        });
        return rows;
    },
    render: function() {
        var stats = this.state.stats;
        if (stats.length == 0) {
            return null;
        }
        var rows = this.getRows(stats);
        if (rows.length < 1) {
            return (<h3>No matches have been played</h3>);
        }
         return (
             <div className="table-responsive">
                 <table className="table table-striped table-hover table-condensed">
                    <tr>
                        <th>Type</th>
                        <th>HC</th>
                        <th>W</th>
                        <th>L</th>
                        <th>RW</th>
                        <th>RL</th>
                        <th>%</th>
                    </tr>
                     <tbody>
                     {rows}
                     </tbody>
                </table>
                </div>
         );
     }
});

module.exports = StatsDisplay;