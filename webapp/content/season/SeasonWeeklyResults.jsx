var React = require('react/addons');
var Router = require('react-router');
var Util = require('../../jsx/util.jsx');
var TeamLink = require('../../jsx/components/links/TeamLink.jsx');

var SeasonWeeklyResults = React.createClass({
    mixins: [Router.State],
    getInitialState: function() {
        return {
            update: Date.now(),
            results: []
        }
    },
    getData: function() {
        Util.getData('/api/teammatch/get/season/' + this.getParams().seasonId, function(d){
            this.setState({results: d});
        }.bind(this));
    },
    componentDidMount: function () {
        this.getData();
    },
    componentWillReceiveProps: function (o, n) {
        var now = Date.now();
        if (now - this.state.update > 1000*60)
            this.getData();
    },
    render: function() {
        var results = this.state.results;
        if (results.length == 0) {
            return null;
        }
        var rows = [];
        results.forEach(function(r) {
            var winner = r.home;
            var loser = r.away;
            if (r.homeRacks < r.awayRacks) {
                winner = r.away;
                loser = r.home;
            }

            if (r.homeRacks == -1)
                return;

            rows.push(
                <tr key={r.id} >
                    <td>{Util.formatDateTime(r.matchDate)}</td>
                    <td><TeamLink team={winner} /> <span></span></td>
                    <td><TeamLink team={loser} /> <span></span></td>
                    <td>{r.homeRacks < 0 ? '' : r.homeRacks}</td>
                    <td>{r.awayRacks < 0 ? '' : r.awayRacks}</td>
                </tr>
            );
        });

        return (
          <table className="table table-condensed table-striped table-responsive" >
              <thead>
              <th>Date</th>
              <th>W</th>
              <th>L</th>
              <th>racks</th>
              <th>racks</th>
              </thead>
              <tbody>
              {rows}
              </tbody>
          </table>
        );
    }
});

module.exports = SeasonWeeklyResults;