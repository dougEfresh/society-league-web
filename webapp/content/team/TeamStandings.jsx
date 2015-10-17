var React = require('react/addons');
var Router = require('react-router');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var UserLink = require('../../jsx/components/links/UserLink.jsx');
var Util = require('../../jsx/util.jsx');

var TeamStandings = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
         return {
             statTeam: {},
             statTeamMembers: [],
             update : Date.now()
        }
    },
    getData: function(id) {
        Util.getSomeData(
            {
                url: '/api/stat/team/' + id ,
                callback: function(d){this.setState({statTeam: d});}.bind(this),
                module: 'TeamStandings',
                router: this.props.history
            });

        Util.getSomeData(
            { url: '/api/stat/team/' + id + '/members',
                callback: function(d){this.setState({statTeamMembers: d})}.bind(this),
                module: 'TeamStandings',
                router: this.props.history}
        );
    },
    componentDidMount: function () {
        this.getData(this.props.params.teamId);
    },
    componentWillReceiveProps: function (n) {
        this.getData(n.params.teamId);
    },
    getHeader: function() {
        if (this.state.statTeam.team  && this.state.statTeam.team.nine) {
            return ( <tr>
                <th>Name</th>
                <th>Wins</th>
                <th>Loses</th>
                <th>Racks Won</th>
                <th>Racks Lost</th>
                <th>Pct</th>
                </tr>);
        }
        return (
            <tr>
                <th>Name</th>
                <th>Wins</th>
                <th>Loses</th>
            </tr>);
    },
    getRows: function() {

    },
    render: function() {
        var stat = this.state.statTeam;
        if (stat.team == undefined)
            return null;
        var rows = [];
        var i = 0;

        rows.push(
            <tr key={i}>
            <td> {stat.team.name} </td>
                <td>{stat.wins}</td>
                <td>{stat.loses}</td>
                <td>{stat.racksWon}</td>
                <td>{stat.racksLost}</td>
                <td>{stat.winPct.toFixed(3)}</td>
        </tr>);
        this.state.statTeamMember = this.state.statTeamMembers.sort(function(a,b) {
            if (a.winPct>b.winPct) {
                return -1;
            }
            if (a.winPct<b.winPct) {
                return 1;
            }
            return 0;
        });

        this.state.statTeamMembers.forEach(function(u){
            i++;
            rows.push(<tr key={i} >
                <td><UserLink user={u.user} season={u.season.id}/> </td>
                <td>{u.wins}</td>
                <td>{u.loses}</td>
                <td>{u.racksWon}</td>
                <td>{u.racksLost}</td>
                <td>{u.winPct.toFixed(3)}</td>
            </tr>);
        }.bind(this));
        return (
             <div className="table-responsive">
                 <table className="table table-condensed table-striped table-responsive" >
                <thead>
                {this.getHeader()}
                <tbody>
                {rows}
                </tbody>
                </thead>
            </table>
             </div>
        );


    }
});


module.exports = TeamStandings;