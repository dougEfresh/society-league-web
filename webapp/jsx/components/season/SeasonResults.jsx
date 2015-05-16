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
    ,Input = Bootstrap.Input
    ,Modal = Bootstrap.Modal
    ,OverlayMixin = Bootstrap.OverlayMixin
    ,ModalTrigger = Bootstrap.ModalTrigger
    ,Panel = Bootstrap.Panel;

var DataStore= require('../../stores/DataStore.jsx');
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var SeasonMixin = require('../../mixins/SeasonMixin.jsx');
var TeamMixin = require('../../mixins/TeamMixin.jsx');
var ResultMixin = require('../../mixins/ResultMixin.jsx');
var UserLink = require('../UserLink.jsx');
var TeamLink = require('../TeamLink.jsx');

var TeamResults = React.createClass({
    mixins: [ResultMixin,SeasonMixin,TeamMixin,UserContextMixin],
    getDefaultProps: function() {
        return {
            seasonId: 0
        }
    },
    getInitialState: function() {
        return {filter: "",showMatches: false, sort: 'sortDate', asc: true}
    },
    onSort: function(e) {
        e.preventDefault();
        this.setState({sort: e.target.id , asc: !this.state.asc});
    },
    onOrderBy: function(e) {
        this.setState({asc: !this.state.asc});
    },
    onChange: function(e,v) {
        this.setState({filter: e.target.value});
    },
    render: function(){
        if (this.props.teamId == 0 || this.props.seasonId == 0) {
            return null;
        }
        var results =this.getSeasonResults(this.props.seasonId);
        var season  = this.getSeason(this.props.seasonId);
        var nine = season.isNine();
        var rows = [];
        var key = 0;
        var matchResults =  [];

        var filteredMatches = [];
        if (this.state.filter.length > 1) {
            matchResults.forEach(function (m) {
                if (m.winner.name.toLowerCase().indexOf(this.state.filter.toLowerCase())>=0) {
                    filteredMatches.push(m);
                    return;
                }

                if (m.opponent.name.toLowerCase().indexOf(this.state.filter.toLowerCase())>=0) {
                    filteredMatches.push(m);
                    return;
                }

                if (m.winnersTeam.name.toLowerCase().indexOf(this.state.filter.toLowerCase())>=0) {
                    filteredMatches.push(m);
                    return;
                }
                if (m.losersTeam.name.toLowerCase().indexOf(this.state.filter.toLowerCase())>=0) {
                    filteredMatches.push(m);
                    return;
                }
                if (m.teamMatch.matchDate.indexOf(this.state.filter)>=0) {
                    filteredMatches.push(m);
                    return;
                }
            }.bind(this));
        } else {
            filteredMatches = matchResults;
        }

        filteredMatches = filteredMatches.sort(function(a,b){
            if (this.state.sort == 'sortDate') {
                if (this.state.asc)
                    return a.teamMatch.matchDate.localeCompare(b.teamMatch.matchDate);
                else
                    return b.teamMatch.matchDate.localeCompare(a.teamMatch.matchDate);
            }

            if (this.state.sort == 'sortPlayer') {
                if (this.state.asc)
                    return a.user.name.localeCompare(b.user.name);
                else
                    return b.user.name.localeCompare(a.user.name);
            }
              if (this.state.sort == 'sortOpponent') {
                if (this.state.asc)
                    return a.opponent.name.localeCompare(b.opponent.name);
                else
                    return b.opponent.name.localeCompare(a.opponent.name);
            }

             if (this.state.sort == 'sortTeam') {
                if (this.state.asc)
                    return a.team.name.localeCompare(b.team.name);
                else
                    return b.team.name.localeCompare(a.team.name);
            }
            return 0;
        }.bind(this));
        if (nine) {
            filteredMatches.forEach(function (m) {
                rows.push(
                    <tr key={key++}>
                        <td>{m.teamMatch.matchDate}</td>
                        <td><UserLink user={m.user} seasonId={m.teamMatch.getSeason().id} /></td>
                        <td><UserLink user={m.opponent} seasonId={m.teamMatch.getSeason().id}/></td>
                        <td><TeamLink team={m.team} seasonId={m.teamMatch.getSeason().id}/></td>
                        <td>{m.win ? 'W' : 'L'}</td>
                        <td>{m.racksFor}</td>
                        <td>{m.racksAgainst}</td>
                    </tr>);
            }.bind(this));
        } else {
             filteredMatches.forEach(function (m) {
                rows.push(
                    <tr key={key++}>
                        <td>{m.teamMatch.matchDate}</td>
                        <td><UserLink user={m.user} seasonId={m.teamMatch.getSeason().id} /></td>
                        <td><UserLink user={m.opponent} seasonId={m.teamMatch.getSeason().id}/></td>
                        <td><TeamLink team={m.team} seasonId={m.teamMatch.getSeason().id}/></td>
                        <td>{m.win ? 'W' : 'L'}</td>
                    </tr>);
            }.bind(this));
        }

        if (nine) {
        return (
            <div>
                <Input id='filter' onChange={this.onChange} value={this.state.filter} type='input' placeholder={'Filter....'}></Input>
            <Table>
                <thead>
                <tr>
                    <th><a href='#' id='sortDate' onClick={this.onSort} >{'Date'}</a></th>
                    <th><a href='#' id='sortPlayer' onClick={this.onSort} >{'Winner'}</a></th>
                    <th><a href='#' id='sortOpponent' onClick={this.onSort} >{'Opponent'}</a></th>
                    <th><a href='#' id='sortTeam' onClick={this.onSort} >{'Team'}</a></th>
                    <th>W/L</th>
                    <th>RW</th>
                    <th>RL</th>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </Table>
                </div>);
        }
        return (
            <div>
                <Input id='filter' onChange={this.onChange} value={this.state.filter} type='input' placeholder={'Filter....'}></Input>
            <Table>
                <thead>
                <tr>
                    <th><a href='#' id='sortDate' onClick={this.onSort} >{'Date'}</a></th>
                    <th><a href='#' id='sortPlayer' onClick={this.onSort} >{'Winner'}</a></th>
                    <th><a href='#' id='sortOpponent' onClick={this.onSort} >{'Opponent'}</a></th>
                    <th><a href='#' id='sortTeam' onClick={this.onSort} >{'Team'}</a></th>
                    <th>W/L</th>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </Table>
            </div>
        );
    }
});


module.exports = TeamResults;
