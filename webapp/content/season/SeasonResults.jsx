var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Route = Router.Route
    , NotFoundRoute = Router.NotFoundRoute
    , Link = Router.Link
    , DefaultRoute = Router.DefaultRoute;
var FixedDataTable = require('fixed-data-table');

var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,ButtonGroup = Bootstrap.ButtonGroup
    ,PanelGroup = Bootstrap.PanelGroup
    ,Badge = Bootstrap.Badge
    //,Table = Bootstrap.Table
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


var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;
var ColumnGroup = FixedDataTable.ColumnGroup;

var DataStore= require('../../jsx/stores/DataStore.jsx');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var SeasonMixin = require('../../jsx/mixins/SeasonMixin.jsx');
var TeamMixin = require('../../jsx/mixins/TeamMixin.jsx');
var ResultMixin = require('../../jsx/mixins/ResultMixin.jsx');
var UserLink = require('../../jsx/components/links/UserLink.jsx');
var TeamLink = require('../../jsx/components/links/TeamLink.jsx');
var firstBy = require('../../lib/FirstBy.js');
var ColumnHelper = require('../../jsx/components/columns/ColumnHelper.jsx');
var ColumnConfig = require('../../jsx/components/columns/ColumnConfig.jsx');
var UserMatch = require('../../lib/UserMatch');

var sortDateFn = function(a,b) {
    return this.state.sort.sortDate.asc == 'true' ?
        a.getMatchDate().localeCompare(b.getMatchDate()) :
        b.getMatchDate().localeCompare(a.getMatchDate());
};

var sortWinnerFn = function(a,b) {
    if (this.state.sort.sortWinner.asc == 'true') {
        return a.winner.name.localeCompare(b.winner.name);
    }
    return b.winner.name.localeCompare(a.winner.name);
};

var sortLoserFn  = function(a,b){
    if (this.state.sort.sortLoser.asc == 'true') {
        return a.loser.name.localeCompare(b.loser.name);
    }
    return b.loser.name.localeCompare(a.loser.name);
};

var sortWinnerTeamFn = function(a,b){
    if (this.state.sort.sortWinnersTeam.asc == 'true')
        return a.winnersTeam.name.localeCompare(b.winnersTeam.name);
    else
        return b.winnersTeam.name.localeCompare(a.winnersTeam.name);

};
var sortLoserTeamFn = function(a,b){
    if (this.state.sort.sortLosersTeam.asc == 'true')
        return a.losersTeam.name.localeCompare(b.losersTeam.name);
    else
        return b.losersTeam.name.localeCompare(a.losersTeam.name);
};


var ResultsApp = React.createClass({
    mixins: [ResultMixin,SeasonMixin,TeamMixin,UserContextMixin,Router.State,Router.Navigation],
    getDefaultProps: function() {
        return {
            seasonId: 0
        }
    },
    getInitialState: function() {

        return {filter: "",
            showMatches: false,
            firstBy: 'sortDate',
            sortOrder: ['sortDate','sortWinner','sortLoser','sortWinnersTeam','sortLosersTeam'],
            sort: {
                sortDate: {asc: 'true', fx : sortDateFn},
                sortWinner: {asc: 'true', fx : sortWinnerFn},
                sortLoser: {asc: 'true', fx : sortLoserFn},
                sortWinnersTeam: {asc: 'true', fx : sortWinnerTeamFn},
                sortLosersTeam: {asc: 'true', fx : sortLoserTeamFn}
            },
            page: {
                size: 500,
                num: 0
            }
        }
    },
    processQuery: function() {
        var q = this.getQuery();
        var newSort = this.state.sort;
        var newPage = this.state.page;
        var type;
        for(type in newSort) {
            newSort[type].asc = q[type] == undefined ? newSort[type].asc : q[type];
        }
        for(type in newPage) {
            newPage[type] = q[type] == undefined ? newPage[type] : parseInt(q[type]);
        }
        var firstBy = this.state.firstBy;
        if (q.firstBy != undefined) {
            firstBy = q.firstBy;
        }

        var newSortOrder = this.state.sortOrder;
        if (q.sortOrder != undefined) {
            newSortOrder = q.sortOrder.split(",");
        }

        this.setState({firstBy: firstBy, sort: newSort, page: newPage, sortOrder: newSortOrder});
    },
    componentWillReceiveProps: function(n,o) {
        this.processQuery();
    },
    componentDidMount: function() {
        this.processQuery();
    },
    firstBy: function(e) {
        e.preventDefault();
        var query =this.getQuery();
        query.firstBy = e.target.id;
        this.state.firstBy = query.firstBy;
        this.transitionTo('seasonResults',this.getParams(),query);
    },
    onChange: function(e) {
        if (this.state.page.num > 0) {
            this.state.filter = e.target.value;
            var q = this.getQuery();
            q.num=0;
            this.transitionTo('seasonResults',this.getParams(),q);
            return
        }
        this.setState({filter: e.target.value});
    },

    sortOrder: function(e) {
         e.preventDefault();
        var query =this.getQuery();
        var type = e.target.id.replace('Order','');
        query[type] = this.state.sort[type].asc == 'true' ? 'false' : 'true';
        this.state.sort[type].asc = query[type] ;
        this.transitionTo('seasonResults',this.getParams(),query);
    },
    render: function(){
        if (this.getParams().seasonId == undefined) {
            return null;
        }
        var userMatches = {};
        var results = this.getSeasonResults(this.getParams().seasonId);
        var season  = this.getSeason(this.getParams().seasonId);
        var pageMatches = [];
        var start = this.state.page.num*this.state.page.size;
        var end = start + this.state.page.size;

        for (var i = start; i < results.length && i < end ; i++) {
            var r = results[i];
            pageMatches.push(new UserMatch(r.winner,r));
            pageMatches.push(new UserMatch(r.loser,r));
        }
        for(var key in userMatches) {
            pageMatches.push(userMatches[key]);
        }
        var order = firstBy(function(a,b){
            return a.user.name.localeCompare(b.user.name);
        });
        order = order.thenBy(function(a,b){
            var aWin = a.match.isWinner(a.user) ? 'A' : 'B';
            var bWin = b.match.isWinner(b.user) ? 'A' : 'B';
            return aWin.localeCompare(bWin);
        });
        pageMatches = pageMatches.sort(order);

        var rowGetter = function(rowIndex) {
            return pageMatches[rowIndex];
        };
        if (!season.isChallenge()) {
            return <h4>Coming Soon</h4>
        }
        if (pageMatches.length == 0) {
            return <h4>There have been no matches played yet</h4>
        }
        var width =
            ColumnConfig.name.width +
            ColumnConfig.handicap.width +
            ColumnConfig.name.width +
            ColumnConfig.handicap.width +
            ColumnConfig.winLost.width +
            ColumnConfig.racksFor.width +
            ColumnConfig.racksAgainst.width +
            2;
        return (
            <Table
                groupHeaderHeight={30}
                rowHeight={30}
                headerHeight={30}
                rowGetter={rowGetter}
                rowsCount={pageMatches.length}
                width={width}
                height={500}
                headerHeight={30}>
                {ColumnHelper.user()}
                {ColumnHelper.hc(this.getParams().seasonId)}
                {ColumnHelper.opponent()}
                {ColumnHelper.opponentHandicap()}
                {ColumnHelper.winLostUser()}
                {ColumnHelper.racksForUser()}
                {ColumnHelper.racksAgainstUser()}
                </Table>
        );
    }
});

var UserResults = React.createClass({

    render: function() {
        var rows = [];
        var user = this.props.user;
        var key  = 0;
        this.props.matches.forEach(function(m){
            var nine = m.getSeason().isNine();
            rows.push(
                <tr key={key++}>
                    <td>{m.getShortMatchDate()}</td>
                    <td><UserLink user={m.getOpponent(user)} seasonId={m.getSeason().id} /></td>
                    <td><TeamLink team={m.getOpponentsTeam(user)} seasonId={m.getSeason().id}/></td>
                    <td>{m.isWinner(user)}</td>
                    <td style={{display: nine ? 'table-cell' : 'none'}}>{m.winnerRacks}</td>
                    <td style={{display: nine ? 'table-cell' : 'none'}}>{m.loserRacks}</td>
                </tr>);
        }.bind(this));

        return (rows);
    }
});

var SeasonResults = React.createClass({
 render: function() {
     var rows = [];
     var key  = 0;
     this.props.matches.forEach(function (m) {
         var nine = m.getSeason().isNine();
           rows.push(
          <tr key={key++}>
                    <td>{m.getShortMatchDate()}</td>
                    <td><UserLink user={m.winner} seasonId={m.getSeason().id} /></td>
                    <td><TeamLink team={m.winnersTeam} seasonId={m.getSeason().id}/></td>
                    <td><UserLink user={m.loser} seasonId={m.getSeason().id}/></td>
                    <td><TeamLink team={m.losersTeam} seasonId={m.getSeason().id}/></td>
                    <td style={{display: nine ? 'table-cell' : 'none'}}>{m.winnerRacks}</td>
                    <td style={{display: nine ? 'table-cell' : 'none'}}>{m.loserRacks}</td>
                </tr>);
     }.bind(this));
     return (rows);
 }
});

var Header = React.createClass({
    render: function() {
        var sort = this.props.sort.sort;
        var fb = this.props.sort.firstBy;
        var headers = this.props.headers;
        var header = [];
        var filters = [];
        var key = 0;

        headers.forEach(function(h){
            header.push(<th key={key++}>{h.name}</th>)
        }.bind(this));

        headers.forEach(function(h){
            var options = [];
            h.values.forEach(function(v) {
                options.push(<option key={key++} value={v.id}>{v.name}</option>)
            });
            filters.push(<th key={key++}><Input type='select' value={h.filter} >{options}</Input></th>)
        }.bind(this));
        return (<h2>Coming Soon</h2>);

        /*
        return (
            <thead>
            {header}
            {filters}
            </thead>
        );
        */
        /*

          return (
              <thead>
              <tr>
                  <th>
                      <a href='#' onClick={this.props.firstBy} >
                          <span id='sortDate'>Date </span></a>
                      <a href='#' style={{display: fb == 'sortDate' ? 'inline-block' : 'none'}} onClick={this.props.sortOrder}>
                          <Glyphicon id='sortDateOrder' glyph={sort.sortDate.asc == 'true' ? 'arrow-up':'arrow-down'}/>
                      </a>
                  </th>
                  <th>
                      <a href='#'  onClick={this.props.firstBy} >
                          <span id='sortWinner'>Winner </span></a>
                       <a href='#' style={{display: fb == 'sortWinner' ? 'inline-block' : 'none'}}  onClick={this.props.sortOrder}>
                          <Glyphicon id='sortWinner' glyph={sort.sortWinner.asc == 'true' ? 'arrow-up':'arrow-down'}/>
                      </a>
                  </th>
                  <th>
                      <a href='#'  onClick={this.props.firstBy} >
                          <span id='sortWinnersTeam'>Team</span>
                      </a>
                      <a href='#' style={{display: fb == 'sortWinnersTeam' ? 'inline-block' : 'none'}}   onClick={this.props.sortOrder}>
                          <Glyphicon id='sortWinnersTeam' glyph={sort.sortWinnersTeam.asc == 'true' ? 'arrow-up':'arrow-down'}/>
                      </a></th>
                  <th>
                      <a href='#'  onClick={this.props.firstBy} >
                          <span id='sortLoser'>Victim </span></a>
                      <a href='#' style={{display: fb == 'sortLoser' ? 'inline-block' : 'none'}} onClick={this.props.sortOrder}>
                          <Glyphicon id='sortLoser' glyph={sort.sortLoser.asc == 'true' ? 'arrow-up':'arrow-down'}/>
                      </a>
                  </th>
                   <th>
                      <a href='#'  onClick={this.props.firstBy} >
                          <span id='sortLosersTeam'>Team </span></a>
                      <a href='#' style={{display: fb == 'sortLosersTeam' ? 'inline-block' : 'none'}} onClick={this.props.sortOrder}>
                          <Glyphicon id='sortLosersTeam' glyph={sort.sortLosersTeam.asc == 'true' ? 'arrow-up':'arrow-down'}/>
                      </a>
                  </th>
                  <th style={{display: this.props.nine ? 'table-cell' : 'none'}}>RW</th>
                  <th style={{display: this.props.nine ? 'table-cell' : 'none'}}>RL</th>
              </tr>
              </thead>
          );
*/
    }
});

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
        this.transitionTo(this.getRoutes()[this.getRoutes().length-1].name,this.getParams(),q);
    },
    next: function(e) {
        e.preventDefault();
        var q = this.getQuery();
        var page = this.props.page;
        page.num = page.num+1;
        q.num = page.num;
        this.transitionTo(this.getRoutes()[this.getRoutes().length-1].name,this.getParams(),q);
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

module.exports = ResultsApp;
