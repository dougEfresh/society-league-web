var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Link = Router.Link;

var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var UserLink = require('../../../webapp/jsx/components/links/UserLink.jsx');
var TeamLink = require('../../../webapp/jsx/components/links/TeamLink.jsx');
var Util = require('../../jsx/util.jsx');

var SeasonLeaders = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
        return {
            update: Date.now(),
            stats: []
        }

    },
    getData: function(id) {
        Util.getData('/api/stat/season/players/' + id, function(d){
            this.setState({stats: d});
        }.bind(this));
    },
    componentDidMount: function () {
        this.getData(this.props.params.seasonId);
    },
    componentWillReceiveProps: function(n) {
        if (n.params.seasonId != this.props.params.seasonId) {
            //this.setState({
              //  loading : true
            //});
            this.getData(n.params.seasonId);
            return;
        }
    },
    getRows : function(data) {
        var rows = []  ;
        data.forEach(function(d){
            rows.push(
                <tr key={d.user.id}>
                    <td><UserLink user={d.user} season={this.props.params.seasonId} /> </td>
                    <td><TeamLink team={d.team} /></td>
                    <td>{d.wins}</td>
                    <td>{d.loses}</td>
                    <td>{d.racksWon}</td>
                    <td>{d.racksLost}</td>
                    <td>{d.winPct.toFixed(3)}</td>
                </tr>
            );
        }.bind(this));
        return rows;
    },
    render: function() {
        var stats = this.state.stats;
        if (stats.length == 0){
            return null;
        }

        return (
                <div className="table-responsive">
                <table className="table table-hover table-condensed table-striped table-responsive">
                    <tr>
                        <th>Player</th>
                        <th>Team</th>
                        <th>W</th>
                        <th>L</th>
                        <th>RW</th>
                        <th>RL</th>
                        <th>%</th>
                    </tr>
                     <tbody>
                     {this.getRows(stats)}
                     </tbody>
                </table>
                </div>
            );
    }
});

module.exports = SeasonLeaders;
