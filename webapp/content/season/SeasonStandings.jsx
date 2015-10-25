var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Link = Router.Link
    , DefaultRoute = Router.DefaultRoute;

var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var TeamLink = require('../../jsx/components/links/TeamLink.jsx');
var Util = require('../../jsx/util.jsx');

var SeasonStandings = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
         return {
             update: Date.now(),
             seasonStats: [],
             loading: false
         }
    },
    getData: function(id) {
        Util.getSomeData(
            {
                url: '/api/stat/season/' + id,
                callback: function (d) {
                    this.setState({seasonStats: d, loading: false})
                }.bind(this),
                module: 'SeasonStandings',
                router: this.props.history
            }
        );

    },
    componentDidMount: function () {
        if(this.props.seasonId)
            this.getData(this.props.seasonId);
        else
            this.getData(this.props.params.seasonId);
    },
    componentWillReceiveProps: function (n) {
        if (n.params != undefined)
            this.getData(n.params.seasonId);
    },
    render: function() {
        if (this.state.seasonStats.length == 0)
            return null;
        var rows = [];
        if (this.state.seasonStats[0].season.challenge) {
            var stats = this.state.seasonStats.sort(function(a,b){
                if (b.points > a.points) {
                    return 1;
                } else {
                    return -1;
                }

            });
            stats.forEach(function (s) {
                if (this.props.limit && rows.length >= this.props.limit)
                    return;

                rows.push(
                    <tr key={s.team.id}>
                        <td>{rows.length+1}</td>
                        <td><TeamLink team={s.team} season={s.team.season}/></td>
                        <td>{s.wins}</td>
                        <td>{s.loses}</td>
                        <td>{s.points.toFixed(3)}</td>
                        <td>{s.racksWon}</td>
                        <td>{s.racksLost}</td>
                        <td>{s.rackPct.toFixed(3)}</td>
                    </tr>)
            }.bind(this));
        } else if (this.state.seasonStats[0].season.nine) {
               this.state.seasonStats.forEach(function (s) {
                   if (this.props.limit && rows.length >= this.props.limit)
                       return;
                rows.push(
                    <tr key={s.team.id}>
                        <td>{rows.length+1}</td>
                        <td><TeamLink team={s.team} season={s.team.season}/></td>
                        <td>{s.wins}</td>
                        <td>{s.loses}</td>
                        <td>{s.setWins}</td>
                        <td>{s.setLoses}</td>
                        <td>{s.racksWon}</td>
                        <td>{s.racksLost}</td>
                        <td>{s.rackPct.toFixed(3)}</td>
                    </tr>)
            }.bind(this));
        } else {
            this.state.seasonStats.forEach(function (s) {
                if (this.props.limit && rows.length >= this.props.limit)
                    return;
                rows.push(
                    <tr key={s.team.id}>
                        <td>{rows.length+1}</td>
                        <td><TeamLink team={s.team} season={s.team.season}/></td>
                        <td>{s.wins}</td>
                        <td>{s.loses}</td>
                        <td>{s.racksWon}</td>
                        <td>{s.racksLost}</td>
                        <td>{s.rackPct.toFixed(3)}</td>
                    </tr>)
            }.bind(this));
        }

        var header = (<tr>
            <th>#</th>
            <th>{this.props.notitle ? null :  this.state.seasonStats[0].season.displayName}</th>
            <th>W</th>
            <th>L</th>
            <th>SW</th>
            <th>SL</th>
            <th>RW</th>
            <th>RL</th>
            <th>Pct</th>
        </tr>);
        if (this.state.seasonStats[0].season.challenge) {
            header = ( <tr>
                    <th>#</th>
            <th>{this.props.notitle ? null : 'Top Gun'}</th>
            <th>W</th>
            <th>L</th>
                    <th>P</th>
            <th>RW</th>
            <th>RL</th>

            <th>Pct</th>
        </tr>
            );
        } else if (!this.state.seasonStats[0].season.nine) {
            header = ( <tr>
                    <th>#</th>
                    <th>{this.props.notitle ? null  : this.state.seasonStats[0].season.displayName}</th>
                    <th>W</th>
                    <th>L</th>
                    <th>RW</th>
                    <th>RL</th>
                    <th>Pct</th>
                </tr>
            );
        }
        return (
            <div className="table-responsive">
                <table className="table table-bordered table-condensed table-striped table-responsive" >
                    <thead>
                    {header}
                <tbody>
                {rows}
                </tbody>
                </thead>
            </table>
             </div>
        );

    }
});

module.exports = SeasonStandings;
