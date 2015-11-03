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
             seasonStats: [],
             loading: false
         }
    },
    getData: function(id) {
        Util.getSomeData(
                {
                    url: '/api/stat/season/' + id,
                    callback: function (d) {
                        this.setState({seasonStats: d,loading: false})
                    }.bind(this),
                    module: 'SeasonStandings',
                    router: this.props.history
                }
            );
    },
    componentDidMount: function () {
        if (this.props.season != undefined && this.props.season != null)
            this.getData(this.props.season.id);
    },
    componentWillReceiveProps: function (n) {
        if (n.season != undefined && n.season != null) {
            if (this.props.season == null) {
                this.getData(n.season.id);
                return;
            }
            if (this.props.season.id != n.season.id) {
                this.getData(n.season.id);
                return;
            }

        }
    },
    render: function() {
        if (this.state.seasonStats.length == 0)
            return null;
        var rows = [];
        var activeTeam = this.props.activeTeam == undefined ? {id: 0} : this.props.activeTeam;
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
                    <tr onClick={this.props.onClick(s.team)} className={activeTeam.id == s.team.id  ? "selected" : "none"} key={s.team.id}>
                        <td className="rank" >{rows.length+1}</td>
                        <td><TeamLink onClick={this.props.onClick(s.team)} team={s.team} season={s.team.season}/></td>
                        <td className="racks">{s.wins}</td>
                        <td className="racks"> {s.loses}</td>
                        <td>{s.points.toFixed(3)}</td>
                        <td>{s.racksWon}</td>
                        <td>{s.racksLost}</td>
                        <td className="pct"  >{s.rackPct.toFixed(3)}</td>
                    </tr>)
            }.bind(this));
        } else if (this.state.seasonStats[0].season.nine) {
               this.state.seasonStats.forEach(function (s) {
                   if (this.props.limit && rows.length >= this.props.limit)
                       return;
                rows.push(
                    <tr onClick={this.props.onClick(s.team)} className={activeTeam.id == s.team.id  ? "selected" : "none"} key={s.team.id}>
                        <td className="rank" >{rows.length+1}</td>
                        <td><TeamLink onClick={this.props.onClick(s.team)} team={s.team} season={s.team.season}/></td>
                        <td className="racks" >{s.wins}</td>
                        <td className="racks" >{s.loses}</td>
                        <td className="racks">{s.setWins}</td>
                        <td className="racks" >{s.setLoses}</td>
                        <td className="racks" >{s.racksWon}</td>
                        <td className="racks">{s.racksLost}</td>
                        <td className="pct" >{s.rackPct.toFixed(3)}</td>
                    </tr>)
            }.bind(this));
        } else {
            this.state.seasonStats.forEach(function (s) {
                if (this.props.limit && rows.length >= this.props.limit)
                    return;
                rows.push(
                    <tr onClick={this.props.onClick(s.team)} className={activeTeam.id == s.team.id  ? "selected" : "none"} key={s.team.id}>
                        <td className="rank" >{rows.length+1}</td>
                        <td><TeamLink onClick={this.props.onClick(s.team)} team={s.team} season={s.team.season}/></td>
                        <td className="racks">{s.wins}</td>
                        <td className="racks"  >{s.loses}</td>
                        <td className="racks" >{s.racksWon}</td>
                        <td className="racks" >{s.racksLost}</td>
                        <td className="pct"  >{s.rackPct.toFixed(3)}</td>
                    </tr>)
            }.bind(this));
        }

        var header = (<tr>
            <th className="rank">#</th>
            <th>{this.props.notitle ? 'Team' :  this.state.seasonStats[0].season.displayName}</th>
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
            <th>{this.props.notitle ? 'Team' : 'Top Gun'}</th>
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
                    <th className="rank">#</th>
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
                <table className={ Util.tableCls + " table-season-standings"} >
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
