var React = require('react/addons');
var Router = require('react-router');
var Util = require('../../jsx/util.jsx');
var UserContextMixin = require('./../../jsx/mixins/UserContextMixin.jsx');
var Handicap = require('../../lib/Handicap');
var SeasonLink = require('../../jsx/components/links/SeasonLink.jsx');
var StatsPie = require('./StatsPie.jsx');

var StatsDisplay = React.createClass({
    mixins: [UserContextMixin],
     getInitialState: function() {
         return {
             update: Date.now(),
             stats: []
         }
    },
    getData: function(statsId) {
        Util.getSomeData(
            {
                url:  '/api/stat/user/' + statsId,
                callback:  function(d){this.setState({stats: d});}.bind(this),
                module: 'StatDisplay',
                router: this.props.history
            }
        );
    },
    componentDidMount: function () {
        this.getData(this.props.params.statsId);
    },
    componentWillReceiveProps: function (n) {
       this.getData(n.params.statsId);
    },
    getRows: function(data) {
        var rows = [];
        var cnt = 0;
        data.forEach(function(d){
            var hc = Handicap.formatHandicap(d.handicap);
            cnt += 1;
            var type = null;
            if (d.type == 'ALL') {
                type = 'Lifetime';
            } else {
                type = <SeasonLink season={d.season} />;
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
        var statCharts = [];
        var cnt = 0;
        this.state.stats.forEach(function(s){
            statCharts.push(<StatsPie key={cnt++} stats={s} />);
        });

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
                 <div className="panel-heading" >Charts </div>
                 <div className="panel-body" >
                     {statCharts}
                 </div>
             </div>
         );
     }
});

module.exports = StatsDisplay;