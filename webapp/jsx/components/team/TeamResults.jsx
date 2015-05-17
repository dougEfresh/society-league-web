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
    ,Pager = Bootstrap.Pager
    ,PageItem = Bootstrap.PageItem
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
    mixins: [ResultMixin,SeasonMixin,TeamMixin,UserContextMixin,Router.State,Router.Navigation],
    getDefaultProps: function() {
        return {
            teamId: 0,
            seasonId: 0
        }
    },
    getInitialState: function() {
        return {filter: "",
            showMatches: false,
            sort: {
                sortDate: 'true',
                sortTeam: 'true',
                sortPlayer: 'true',
                sortOpponent: 'true',
                sortWin: 'true',
            },
            page: {
                size: 10,
                num: 0
            }
        }
    },
    componentWillReceiveProps: function(n,o) {
        console.log(JSON.stringify(this.getQuery()));
        var sort = this.state.sort;
        var page = this.state.page;

    },
    onSort: function(e) {
        e.preventDefault();
        var query =this.getQuery();
        query[e.target.id] = this.state.sort[e.target.id] == 'true' ? 'false' : 'true';
        console.log(JSON.stringify(query));
        this.transitionTo('team',this.getParams(),query);
    },
    onOrderBy: function(e) {
        //this.setState({sortDate: {asc: !this.state.sortDate.asc}});
    },
    onChange: function(e) {
        this.setState({filter: e.target.value});
    },
    render: function(){
        if (this.props.teamId == 0 || this.props.seasonId == 0) {
            return null;
        }
        var results = [];
        this.getSeasonResults(this.props.seasonId).forEach(function(r){
            if (r.teamMatch.getWinner().id == this.props.teamId ||r.teamMatch.getLoser().id == this.props.teamId ) {
                results.push(r);
            }
        }.bind(this));

        var season  = this.getSeason(this.props.seasonId);
        var nine = season.isNine();
        var rows = [];
        var key = 0;

        var filteredMatches = [];
        if (this.state.filter.length > 1) {
            results.forEach(function (m) {
                if (m.winner.name.toLowerCase().indexOf(this.state.filter.toLowerCase())>=0) {
                    filteredMatches.push(m);
                    return;
                }

                if (m.loser.name.toLowerCase().indexOf(this.state.filter.toLowerCase())>=0) {
                    filteredMatches.push(m);
                    return;
                }

                if (m.losersTeam.name.toLowerCase().indexOf(this.state.filter.toLowerCase())>=0) {
                    filteredMatches.push(m);
                    return;
                }

                if (m.winnersTeam.name.toLowerCase().indexOf(this.state.filter.toLowerCase())>=0) {
                    filteredMatches.push(m);
                    return;
                }
                if (m.teamMatch.matchDate.indexOf(this.state.filter)>=0) {
                    filteredMatches.push(m);
                }
            }.bind(this));
        } else {
            filteredMatches = results;
        }
        pageMatches = [];
        if (this.state.page.size >= filteredMatches.length) {
            pageMatches = filteredMatches;
        } else {
            for(var i = this.state.page.num; i<filteredMatches.length && i<this.state.page.size; i++) {
                pageMatches.push(filteredMatches[i]);
            }
        }

        /*
        pageMatches = pageMatches.sort(function(a,b){
            var ateamMember = a.winnersTeam.id == this.props.teamId ?  a.winner : a.loser;
            var bteamMember = b.winnersTeam.id == this.props.teamId ?  b.winner : b.loser;

            if (this.state.sort == 'sortDate') {
                if (this.state.asc)
                    return a.getMatchDate().localeCompare(b.getMatchDate());
                else
                    return b.getMatchDate().localeCompare(a.getMatchDate());
            }

            if (this.state.sort == 'sortPlayer') {
                if (this.state.asc)
                    return ateamMember.name.localeCompare(bteamMember.name);
                else
                    return bteamMember.name.localeCompare(ateamMember.name);
            }

            if (this.state.sort == 'sortOpponent') {
                if (this.state.asc)
                    return a.getOpponent(ateamMember).name.localeCompare(b.getOpponent(bteamMember).name);
                else
                    return b.getOpponent(ateamMember).name.localeCompare(a.getOpponent(bteamMember).name);
            }

            if (this.state.sort == 'sortTeam') {
                if (this.state.asc)
                    return a.getOpponentsTeam(ateamMember).name.localeCompare(b.getOpponentsTeam(bteamMember).name);
                else
                    return b.getOpponentsTeam(ateamMember).name.localeCompare(a.getOpponentsTeam(bteamMember).name);
            }
            if (this.state.sort == 'sortWin') {
                aWin = (a.isWinner(ateamMember) ? 'W' : 'L');
                bWin = (b.isWinner(bteamMember) ? 'W' : 'L');
                if (this.state.asc)
                    return aWin.localeCompare(bWin);
                else
                    return bWin.localeCompare(aWin);
            }
            return 0;
        }.bind(this));
*/
        if (nine) {
            pageMatches.forEach(function (m) {
                var teamMember = m.winnersTeam.id == this.props.teamId ?  m.winner : m.loser;
                rows.push(
                    <tr key={key++}>
                        <td>{m.getMatchDate()}</td>
                        <td><UserLink user={teamMember} seasonId={m.teamMatch.getSeason().id} /></td>
                        <td><UserLink user={m.getOpponent(teamMember)} seasonId={m.teamMatch.getSeason().id}/></td>
                        <td><TeamLink team={m.getOpponentsTeam(teamMember)} seasonId={m.teamMatch.getSeason().id}/></td>
                        <td>{m.isWinner(teamMember) ? 'W' : 'L'}</td>
                        <td>{m.getRacks(teamMember)}</td>
                        <td>{m.getOpponentRacks(teamMember)}</td>
                    </tr>);
            }.bind(this));
        } else {
             pageMatches.forEach(function (m) {
                 var teamMember = m.winnersTeam.id == this.props.teamId ?  m.winner : m.loser;
                rows.push(
                    <tr key={key++}>
                        <td>{m.getMatchDate()}</td>
                        <td><UserLink user={teamMember} seasonId={m.teamMatch.getSeason().id} /></td>
                        <td><UserLink user={m.getOpponent(teamMember)} seasonId={m.teamMatch.getSeason().id}/></td>
                        <td><TeamLink team={m.getOpponentsTeam(teamMember)} seasonId={m.teamMatch.getSeason().id}/></td>
                        <td>{m.isWinner(teamMember) ? 'W' : 'L'}</td>
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
                    <th><a href='#' id='sortPlayer' onClick={this.onSort} >{'Player'}</a></th>
                    <th><a href='#' id='sortOpponent' onClick={this.onSort} >{'Opponent'}</a></th>
                    <th><a href='#' id='sortTeam' onClick={this.onSort} >{'Team'}</a></th>
                    <th><a href='#' id='sortWin' onClick={this.onSort} >{'W/L'}</a></th>
                    <th>RW</th>
                    <th>RL</th>
                </tr>
                </thead>
                <tfoot>
                <tr>
                    <td><Pager><PageItem previous href='#'>&larr; Previous</PageItem></Pager></td>
                    <td><Pager><PageItem next href='#'>Next &rarr; </PageItem></Pager></td>
                </tr>
                </tfoot>
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
                    <th><a href='#' id='sortPlayer' onClick={this.onSort} >{'Player'}</a></th>
                    <th><a href='#' id='sortOpponent' onClick={this.onSort} >{'Opponent'}</a></th>
                    <th><a href='#' id='sortTeam' onClick={this.onSort} >{'Team'}</a></th>
                    <th><a href='#' id='sortWin' onClick={this.onSort} >{'W/L'}</a></th>
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
