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
        var key = 0;
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
            var teamMember = m.winnersTeam.id == this.getParams().teamId ? m.winner : m.loser;
            rows.push(
                {
                    date: m.getShortMatchDate(),
                    user: teamMember,
                    opponent: m.getOpponent(teamMember),
                    team: m.getOpponentsTeam(teamMember),
                    win: m.isWinner(teamMember) ? 'W' : 'L',
                    racksFor: m.getRacks(teamMember),
                    racksAgainst: m.getOpponentRacks(teamMember),
                    handicap: m.getHandicap(teamMember)
                });
        }.bind(this));
        var rowGetter = function (index) {
            return rows[index];
        };
        var renderName = function (cellData) {
            if (cellData == undefined || cellData == null) {
                return null;
            }
            return (<UserLink user={cellData} />);
        };
        var renderTeam = function (cellData) {
            if (cellData == undefined || cellData == null) {
                return null;
            }
            return (<TeamLink team={cellData}  seasonId={this.getParams().seasonId} />);
        }.bind(this);

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
             <Column
                 label="Date"
                 width={60}
                 dataKey={'date'}
                 />
             <Column
                 label="Name"
                 width={90}
                 dataKey={'user'}
                 cellRenderer={renderName}
         />

         <Column
         label="Opponent"
         width={90}
         dataKey={'opponent'}
         cellRenderer={renderName}
         />
         <Column
         label="HC"
         width={40}
         dataKey={'handicap'}
         />
         <Column
         label="W"
         width={35}
         dataKey={'win'}
         />
         <Column
         label="RW"
         width={35}
         dataKey={'racksFor'}
         isResizable={false}
         />
         <Column
         label="RL"
         width={35}
         dataKey={'racksAgainst'}
         isResizable={false}
         />
         <Column
         label="Team"
         width={80}
         dataKey={'team'}
         cellRenderer={renderTeam}
         />
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
        if (page.num <= 0) {
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
                <Pager>
                    <PageItem disabled={this.props.page.num == 0} previous onClick={this.prev} href='#'>&larr; Previous</PageItem>
                    <PageItem disabled={this.props.last} next onClick={this.next} href='#'>Next &rarr; </PageItem>
                </Pager>
        )
    }
});
*/

module.exports = TeamResults;
