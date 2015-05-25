var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Route = Router.Route
    , NotFoundRoute = Router.NotFoundRoute
    , Link = Router.Link
    , DefaultRoute = Router.DefaultRoute;

var FixedDataTable = require('fixed-data-table');
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;

var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,ButtonGroup = Bootstrap.ButtonGroup
    ,PanelGroup = Bootstrap.PanelGroup
    ,Badge = Bootstrap.Badge
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
var firstBy = require('../../FirstBy.jsx');
var ColumnHelper = require('../columns/ColumnHelper.jsx');

var sortDateFn = function(a,b) {
    return b.getMatchDate().localeCompare(a.getMatchDate());
};

var sortPlayerFn = function(a,b) {
    var ateamMember = a.winnersTeam.id == this.getParams().teamId ? a.winner : a.loser;
    var bteamMember = b.winnersTeam.id == this.getParams().teamId ? b.winner : b.loser;
    if (this.state.sort.sortPlayer.asc == 'true') {
        return ateamMember.name.localeCompare(bteamMember.name);
    }
    return bteamMember.name.localeCompare(ateamMember.name);
};

var sortOpponentFn  = function(a,b){
    var ateamMember = a.winnersTeam.id == this.getParams().teamId ? a.winner : a.loser;
    var bteamMember = b.winnersTeam.id == this.getParams().teamId ? b.winner : b.loser;

    if (this.state.sort.sortOpponent.asc == 'true')
        return a.getOpponent(ateamMember).name.localeCompare(b.getOpponent(bteamMember).name);
    else
        return b.getOpponent(ateamMember).name.localeCompare(a.getOpponent(bteamMember).name);
};

var sortOpponentTeamFn = function(a,b){
    var ateamMember = a.winnersTeam.id == this.getParams().teamId ? a.winner : a.loser;
    var bteamMember = b.winnersTeam.id == this.getParams().teamId ? b.winner : b.loser;
    if (this.state.sort.sortTeam.asc == 'true')
        return a.getOpponentsTeam(ateamMember).name.localeCompare(b.getOpponentsTeam(bteamMember).name);
    else
        return b.getOpponentsTeam(ateamMember).name.localeCompare(a.getOpponentsTeam(bteamMember).name);
};

var sortWinFn = function(a,b) {
    var ateamMember = a.winnersTeam.id == this.getParams().teamId ? a.winner : a.loser;
    var bteamMember = b.winnersTeam.id == this.getParams().teamId ? b.winner : b.loser;
    aWin = (a.isWinner(ateamMember) ? 'W' : 'L');
    bWin = (b.isWinner(bteamMember) ? 'W' : 'L');
    if (this.state.sort.sortWin.asc == 'true')
        return aWin.localeCompare(bWin);
    else
        return bWin.localeCompare(aWin);
};

var TeamResults = React.createClass({
    mixins: [ResultMixin,SeasonMixin,TeamMixin,UserContextMixin,Router.State,Router.Navigation],
    getInitialState: function() {
        return {filter: "",
            showMatches: false,
            firstBy: 'sortPlayer',
            sortOrder: ['sortDate','sortPlayer','sortOpponent','sortWin'],
            sort: {
                sortDate: {asc: 'true', fx : sortDateFn},
                sortTeam: {asc: 'true', fx : sortOpponentTeamFn},
                sortPlayer: {asc: 'true', fx : sortPlayerFn},
                sortOpponent: {asc: 'true', fx : sortOpponentFn},
                sortWin: {asc: 'true', fx : sortWinFn}
            },
            page: {
                size: 30,
                num: 0
            }
        }
    },
    componentWillReceiveProps: function(n,o) {
    },
    componentDidMount: function() {
    },
    render: function() {
        if (this.getParams().teamId == undefined || this.getParams().seasonId == undefined) {
            return null;
        }
        var results = [];
        this.getSeasonResults(this.getParams().seasonId).forEach(function (r) {
            if (r.teamMatch.getWinner().id == this.getParams().teamId || r.teamMatch.getLoser().id == this.getParams().teamId) {
                results.push(r);
            }
        }.bind(this));

        var season = this.getSeason(this.getParams().seasonId);
        var nine = season.isNine();
        var rows = [];
        var order = firstBy(this.state.sort[this.state.firstBy].fx.bind(this));
        for (var i = 0; i < this.state.sortOrder.length; i++) {
            var type = this.state.sortOrder[i];
            order = order.thenBy(this.state.sort[type].fx.bind(this));
        }

        results = results.sort(order);
        var pageMatches = [];
        var start = this.state.page.num * this.state.page.size;
        var end = start + this.state.page.size;
        if (this.state.page.size >= results.length) {
            pageMatches = results;
        } else {
            for (var i = start; i < results.length && i < end; i++) {
                pageMatches.push(results[i]);
            }
        }

        pageMatches.forEach(function (m) {
            rows.push(m);
        }.bind(this));
        var rowGetter = function (index) {
            return rows[index];
        };
        var team = this.getTeam(this.getParams().teamId);
        return (
         <Table
             groupHeaderHeight={30}
             rowHeight={50}
             headerHeight={30}
             rowGetter={rowGetter}
             rowsCount={rows.length}
             width={500}
             height={500}
             headerHeight={30}>
             {ColumnHelper.user(team)}
             {ColumnHelper.opponent(team)}
             {ColumnHelper.opponentHandicap(team)}
             {ColumnHelper.winLostTeam(team)}
             {ColumnHelper.racksForTeamMember(team)}
             {ColumnHelper.racksAgainstTeamMember(team)}
         </Table>
        );
    }
});

/*
var Footer = React.createClass({
    mixins: [Router.State,Router.Navigation],
   getDefaultProps: function() {
        return {
            page: 0,
            last: false
        }
    },
    prev: function(e) {
        e.preventDefault();
        var q = this.getQuery();
        var page = this.props.page;
        if (page.num <= 0) {win
            return;
        }
        page.num = page.num-1;
        q.num = page.num;

        this.transitionTo('teamResults',this.getParams(),q);
    },
    next: function(e) {
        e.preventDefault();
        var q = this.getQuery();
        var page = this.props.page;
        page.num = page.num+1;
        q.num = page.num;
        this.transitionTo('teamResults',this.getParams(),q);
    },
    render: function() {
        return (
                <Pager>x
                    <PageItem disabled={this.props.page.num == 0} pwinrevious onClick={this.prev} href='#'>&larr; Previous</PageItem>
                    <PageItem disabled={this.props.last} next onClick={this.next} href='#'>Next &rarr; </PageItem>
                </Pager>
        )
    }
});
*/

module.exports = TeamResults;
