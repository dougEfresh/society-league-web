var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Link = Router.Link;
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var UserLink = require('../../../webapp/jsx/components/links/UserLink.jsx');
var TeamLink = require('../../../webapp/jsx/components/links/TeamLink.jsx');
var Util = require('../../jsx/util.jsx');
var LoadingApp = require('../../jsx/components/LoadingApp.jsx');
var UserResults = require('../../jsx/components/result/UserResults.jsx');
var Handicap = require('../../lib/Handicap');

var SeasonLeaders = React.createClass({
    mixins: [UserContextMixin],
    getDefaultProps: function() {
        return {limit: 100}
    },
    getInitialState: function() {
        return {
            update: Date.now(),
            stats: [],
            season: null,
            selectedUser: null,
            loading: true,
            toggleLeaders: true
        }
    },
    getData: function(id) {
        var cb = function (d) {
            var ind = 1;
            d.forEach(function(s){
                s.id = s.user.id;
                s.index = ind++;
            });

            this.setState({stats: d, season: d.length > 0 ? d[0].season : null, loading: false});
        }.bind(this);
        Util.getSomeData({ url: '/api/stat/season/players/' + id,
            callback: cb,
            module: 'SeasonLeaders',
            router: this.props.history
        })
    },
    componentDidMount: function () {
        this.getData(this.props.params.seasonId);
    },
    componentWillReceiveProps: function(n) {
        if (n.params.seasonId != this.props.params.seasonId) {
            this.getData(n.params.seasonId);
        }
    },
    selectUser: function(s) {
        return function(e) {
            e.preventDefault();
            this.setState({selectedUser: s , toggleLeaders: !this.state.toggleLeaders});
        }.bind(this)
    },
    toggleHeading: function(e) {
        e.preventDefault();
        this.setState({toggleLeaders: !this.state.toggleLeaders});
    },
    getRows : function(data) {
        var rows = []  ;
        var cnt=0;
        data.forEach(function(d) {
            cnt++;
            if (cnt > this.props.limit) {
              return;
            }
            rows.push(
                    <tr onClick={this.selectUser(d)} key={d.user.id}>
                        <td>{d.rank}</td>
                        <td><UserLink onClick={this.props.onUserClick(d)} user={d.user} season={this.props.params.seasonId}/></td>
                        <td>{d.wins}</td>
                        <td>{d.loses}</td>
                        <td>{d.racksWon}</td>
                        <td>{d.racksLost}</td>
                        <td>{d.winPct.toFixed(3)}</td>
                        <td><TeamLink team={d.team}/></td>
                    </tr>
                );
        }.bind(this));
        return rows;
    },
    changeUser: function(u) {
        return function(e){
            e.preventDefault();
            var selected = null;
            this.state.stats.forEach(function(s){
                if (s.user.id == u.id) {
                    selected = s;
                }
            });
            this.setState({selectedUser: selected})
        }.bind(this)
    },
    render: function() {
        if (this.state.stats.length == 0) {
             return null;
        }

        return (
            <div className="table-responsive">
                <table className={Util.tableCls + " table-users"}>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th></th>
                        <th>W</th>
                        <th>L</th>
                        <th>RW</th>
                        <th>RL</th>
                        <th>%</th>
                        <th>Team</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.getRows(this.state.stats)}
                    </tbody>
                </table>
            </div>
        );
    }
});

module.exports = SeasonLeaders;
