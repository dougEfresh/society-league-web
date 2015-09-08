var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Link = Router.Link
    , DefaultRoute = Router.DefaultRoute;

var DataStore= require('../../jsx/stores/DataStore.jsx');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var SeasonMixin = require('../../jsx/mixins/SeasonMixin.jsx');
var StatsMixin = require('../../jsx/mixins/StatsMixin.jsx');
var TeamMixin = require('../../jsx/mixins/TeamMixin.jsx');
var TeamLink = require('../../jsx/components/links/TeamLink.jsx');
var Stat =  require('../../lib/Stat');
var TeamStat =  require('../../lib/TeamStat');
var Util = require('../../jsx/util.jsx');

var SeasonStandings = React.createClass({
    mixins: [UserContextMixin,Router.State],
    getInitialState: function() {
         return {
             update: Date.now(),
             seasonStats: []
         }
    },
    getData: function() {
        Util.getData('/api/stat/season/' + this.getParams().seasonId, function(d){
            this.setState({seasonStats: d});
        }.bind(this));

    },
    componentDidMount: function () {
        this.getData();
    },
    componentWillReceiveProps: function (o, n) {
       this.getData();
    },
    render: function() {
        if (this.state.seasonStats.length == 0)
            return null;
        var rows = [];
        this.state.seasonStats.forEach(function(s){
            rows.push(
                <tr key={s.team.id}>
                    <td><TeamLink team={s.team} season={s.team.season} /></td>
                    <td>{s.wins}</td>
                    <td>{s.loses}</td>
                    <td>{s.racksWon}</td>
                    <td>{s.racksLost}</td>
                    <td>{s.rackPct.toFixed(2)}</td>
            </tr>)
        }.bind(this));
        return (
            <table className="table table-condensed table-striped table-responsive" >
                <thead>
                <tr>
                    <th>Team</th>
                    <th>W</th>
                    <th>L</th>
                    <th>Racks Won</th>
                    <th>Racks Lost</th>
                    <th>Pct</th>
                </tr>
                <tbody>
                {rows}
                </tbody>
                </thead>
            </table>
        );

    }
});

module.exports = SeasonStandings;
