var React = require('react/addons');
var Router = require('react-router');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var UserLink = require('../../jsx/components/links/UserLink.jsx');
var Util = require('../../jsx/util.jsx');
var Handicap = require('../../lib/Handicap');

var TeamStandings = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
         return {
             statTeam: {},
             statTeamMembers: [],
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
        var cb = function(d) {
            this.state.statTeamMembers = [];
            d.forEach(function(s) {
                if (s.user != undefined && s.user.real) {
                    this.state.statTeamMembers.push(s);
                }
            }.bind(this));
            this.setState({});
        }.bind(this);
        Util.getSomeData(
            { url: '/api/stat/team/' + id + '/members',
                callback: cb,
                module: 'TeamStandings',
                router: this.props.history}
        );
    },
    componentDidMount: function () {
        if (this.props.team != undefined)
            this.getData(this.props.team.id);
    },
    componentWillReceiveProps: function (n) {
        if (n.team == undefined || n.team == null)
            return ;
        if (this.props.team == undefined || this.props.team == null) {
            this.getData(n.team.id);
            return;
        }
        if (this.props.team.id  != n.team.id)
            this.getData(n.team.id);
    },
    getHeader: function() {
        if (this.state.statTeam.team  && this.state.statTeam.team.nine) {
            return ( <tr>
                <th></th>
                <th>HC</th>
                <th>W</th>
                <th>L</th>
                <th>RW</th>
                <th>RL</th>
                <th>Pct</th>
                </tr>);
        }
        return (
            <tr>
                <th>Name</th>
                <th>HC</th>
                <th>W</th>
                <th>L</th>
                <th>PCT</th>
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

        var activeUser = this.props.activeUser ? this.props.activeUser : {id: 0};

        this.state.statTeamMembers.forEach(function(u){
            i++;
            if (u.season.nine) {
                rows.push(
                    <tr onClick={this.props.onClick(u.user)} className={activeUser.id == u.user.id ? "active" : "none" } key={i}>
                        <td><UserLink onClick={this.props.onClick(u.user)} user={u.user} season={u.season.id}/></td>
                        <td>{Handicap.formatHandicap(u.handicap)}</td>
                        <td>{u.wins}</td>
                        <td>{u.loses}</td>
                        <td>{u.racksWon}</td>
                        <td>{u.racksLost}</td>
                        <td>{u.winPct.toFixed(3)}</td>
                    </tr>);
            } else {
                 rows.push(
                    <tr onClick={this.props.onClick(u.user)} className={activeUser.id == u.user.id ? "active" : "none" } key={i}>
                        <td><UserLink onClick={this.props.onClick(u.user)} user={u.user} season={u.season.id}/></td>
                        <td>{Handicap.formatHandicap(u.handicap)}</td>
                        <td>{u.wins}</td>
                        <td>{u.loses}</td>
                        <td>{u.winPct.toFixed(3)}</td>
                    </tr>);
            }
        }.bind(this));
        return (
            <div className="table-responsive">
                <table className="table table-bordered table-condensed table-striped table-grid table-responsive" >
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
  /*
 if (this.props.noteam == undefined) {
 rows.push(
 <tr key={i}>
 <td> {stat.team.name} </td>
 <td>{stat.wins}</td>
 <td>{stat.loses}</td>
 <td>{stat.racksWon}</td>
 <td>{stat.racksLost}</td>
 <td>{stat.winPct.toFixed(3)}</td>
 </tr>);
 }
 this.state.statTeamMember = this.state.statTeamMembers.sort(function(a,b) {
 if (a.winPct>b.winPct) {
 return -1;
 }
 if (a.winPct<b.winPct) {
 return 1;
 }
 return 0;
 });
 */
