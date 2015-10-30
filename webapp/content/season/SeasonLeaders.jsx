var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Link = Router.Link;

var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var UserLink = require('../../../webapp/jsx/components/links/UserLink.jsx');
var TeamLink = require('../../../webapp/jsx/components/links/TeamLink.jsx');
var Util = require('../../jsx/util.jsx');
var LoadingApp = require('../../jsx/components/LoadingApp.jsx');

var SeasonLeaders = React.createClass({
    mixins: [UserContextMixin],
    getDefaultProps: function() {
        return {limit: 100}
    },
    getInitialState: function() {
        return {
            update: Date.now(),
            stats: [],
            loading: true
        }
    },
    getData: function(id) {
        Util.getSomeData({ url: '/api/stat/season/players/' + id,
            callback: function(d){this.setState({stats: d, loading: false});}.bind(this),
            module: 'SeasonLeaders',
            router: this.props.history
        })
    },
    componentDidMount: function () {
        this.getData(this.props.params.seasonId);
    },
    componentWillReceiveProps: function(n) {
        //this.setState({loading: true});
        if (n.params.seasonId != this.props.params.seasonId) {
            this.getData(n.params.seasonId);
            return;
        }
    },
    getRows : function(data) {
        var rows = []  ;
        var cnt=0;
        data.forEach(function(d) {
            cnt++;
            if (cnt > this.props.limit ) {
              return;
            }
            rows.push(
                    <tr key={d.user.id}>
                        <td>{cnt}</td>
                        <td><UserLink user={d.user} season={this.props.params.seasonId}/></td>
                        <td><TeamLink onClick={this.props.onClick(d.team)} team={d.team}/></td>
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
        if (this.state.stats == length)
            return null;
        return (
                <div className="table-responsive">
                    <table className="table table-hover table-bordered table-condensed table-striped table-responsive">
                        <thead>
                        <tr>
                        <th>#</th>
                        <th></th>
                        <th>Team</th>
                        <th>W</th>
                        <th>L</th>
                        <th>RW</th>
                        <th>RL</th>
                        <th>%</th>
                    </tr>
                    </thead>
                     <tbody>
                     {this.getRows(stats)}
                     </tbody>
                </table>
                </div>
            );
    }
});

module.exports = SeasonLeaders;
