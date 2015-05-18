var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Route = Router.Route
    , NotFoundRoute = Router.NotFoundRoute
    , Link = Router.Link
    , DefaultRoute = Router.DefaultRoute;
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,ButtonGroup = Bootstrap.ButtonGroup
    ,PanelGroup = Bootstrap.PanelGroup
    ,Badge = Bootstrap.Badge
    ,Table = Bootstrap.Table
    ,Nav = Bootstrap.Nav
    ,Grid = Bootstrap.Grid
    ,Row = Bootstrap.Row
    ,Col = Bootstrap.Col
    ,MenuItem = Bootstrap.MenuItem
    ,Accordion = Bootstrap.Accordion
    ,Glyphicon = Bootstrap.Glyphicon
    ,Panel = Bootstrap.Panel;

var ReactRouterBootstrap = require('react-router-bootstrap')
    ,NavItemLink = ReactRouterBootstrap.NavItemLink
    ,MenuItemLink = ReactRouterBootstrap.MenuItemLink;

var DataStore= require('../../stores/DataStore.jsx');
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var SeasonMixin = require('../../mixins/SeasonMixin.jsx');
var StatsMixin = require('../../mixins/StatsMixin.jsx');
var UserLink = require('../UserLink.jsx');
var TeamLink = require('../TeamLink.jsx');
var Stat =  require('../../../lib/Stat');
var ReactTable = require('reactable').Table;

var SeasonLeaders = React.createClass({
    mixins: [SeasonMixin,UserContextMixin,StatsMixin,Router.State,Router.Navigation],
    getInitialState: function () {
        return {
            user: this.getUser(),
            seasonId: this.getParams().seasonId
        }
    },
    componentDidMount: function () {
        this.setState({user: this.getUser()});
    },
    componentWillReceiveProps: function() {
        this.setState({seasonId: this.getParams().seasonId});
    },
    handleClick: function(e) {
        e.preventDefault();
        var toggle = e.target.id;
        if (toggle.indexOf('Teams') >= 0) {
            this.transitionTo('season',this.getParams());
            return;
        }
        if (toggle.indexOf('Results') >= 0) {
            this.transitionTo('seasonResults',this.getParams());
            return;
        }
    },
    render: function() {
        if (this.getUserId() == 0) {
            return null;
        }
        var users = [];
        this.getUsers().forEach(function(u) {
            if (u.hasSeason(this.getParams().seasonId)) {
                users.push(u);
            }
        }.bind(this));

        users = users.sort(function(a,b) {
            aStat = a.getStatsForSeason(this.getParams().seasonId);
            bStat = b.getStatsForSeason(this.getParams().seasonId);
            return Stat.sort.byWinPct(aStat,bStat);
        }.bind(this));

        var rows = [];
         users.forEach(function(u) {
             var seasonId = this.getParams().seasonId;
             var stat = u.getStatsForSeason(seasonId);
             rows.push(
                 {
                     Name: (<UserLink user={u} seasonId={seasonId}/>),
                     Team: (<TeamLink team={u.getTeamForSeason(seasonId)} seasonId={seasonId}/>),
                     M: stat.matches,
                     W: stat.wins,
                     L: stat.loses,
                     RW: stat.racksFor,
                     RL: stat.racksAgainst,
                     PCT: stat.getWinPct()
                 }
             );
         }.bind(this));
        var header =(
            <div>
                <Button  id="buttonToggleLeaders" bsSize='xsmall' bsStyle={'default'}
                        onClick={this.handleClick}><i id="toggleTeams" className="fa fa-users"></i>
                </Button>
                <Button  id="buttonToggleResults" bsSize='xsmall' bsStyle={'default'}
                        onClick={this.handleClick}><i id="toggleResults" className="fa fa-list-ol"></i>
                </Button>
            </div>
        );
        return (
           <div id="seasonAppLeader" className="seasonResults">
                    <Panel header={header} >
                        <ReactTable className='table' data={rows} sortable={true} />
                    </Panel>
                </div>
        );

        /*
        users.forEach(function(u){
            var seasonId = this.getParams().seasonId;
            var stat = u.getStatsForSeason(seasonId);

            rows.push(
                <tr key={u.id}>
                    <td><UserLink user={u} seasonId={seasonId} /></td>
                    <td></td>
                    <td>{stat.matches}</td>
                    <td>{stat.wins}</td>
                    <td>{stat.loses}</td>
                    <td>{stat.racksFor}</td>
                    <td>{stat.racksAgainst}</td>
                    <td>{stat.getWinPct()}</td>
                </tr>
            );
        }.bind(this));

        return (
            <Table>
                <thead>
                <th>Name</th>
                <th>Team</th>
                <th>M</th>
                <th>W</th>
                <th>L</th>
                <th>RW</th>
                <th>RL</th>
                <th>Pct</th>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </Table>
        );
        */
    }
});

module.exports = SeasonLeaders;

