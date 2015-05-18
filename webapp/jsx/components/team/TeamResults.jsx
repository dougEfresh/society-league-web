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
var firstBy = (function() {
    /* mixin for the `thenBy` property */
    function extend(f) {
        f.thenBy = tb;
        return f;
    }
    /* adds a secondary compare function to the target function (`this` context)
       which is applied in case the first one returns 0 (equal)
       returns a new compare function, which has a `thenBy` method as well */
    function tb(y) {
        var x = this;
        return extend(function(a, b) {
            return x(a,b) || y(a,b);
        });
    }
    return extend;
})();


var sortDateFn = function(a,b) {
    return this.state.sort.sortDate.asc == 'true' ?  a.getMatchDate().localeCompare(b.getMatchDate()) : b.getMatchDate().localeCompare(a.getMatchDate());
};

var sortPlayerFn = function(a,b) {
    var ateamMember = a.winnersTeam.id == this.props.teamId ? a.winner : a.loser;
    var bteamMember = b.winnersTeam.id == this.props.teamId ? b.winner : b.loser;
    if (this.state.sort.sortPlayer.asc == 'true') {
        return ateamMember.name.localeCompare(bteamMember.name);
    }
    return bteamMember.name.localeCompare(ateamMember.name);
};

var sortOpponentFn  = function(a,b){
    var ateamMember = a.winnersTeam.id == this.props.teamId ? a.winner : a.loser;
    var bteamMember = b.winnersTeam.id == this.props.teamId ? b.winner : b.loser;

    if (this.state.sort.sortOpponent.asc == 'true')
        return a.getOpponent(ateamMember).name.localeCompare(b.getOpponent(bteamMember).name);
    else
        return b.getOpponent(ateamMember).name.localeCompare(a.getOpponent(bteamMember).name);
};

var sortOpponentTeamFn = function(a,b){
    var ateamMember = a.winnersTeam.id == this.props.teamId ? a.winner : a.loser;
    var bteamMember = b.winnersTeam.id == this.props.teamId ? b.winner : b.loser;
    if (this.state.sort.sortTeam.asc == 'true')
        return a.getOpponentsTeam(ateamMember).name.localeCompare(b.getOpponentsTeam(bteamMember).name);
    else
        return b.getOpponentsTeam(ateamMember).name.localeCompare(a.getOpponentsTeam(bteamMember).name);
};

var sortWinFn = function(a,b) {
    var ateamMember = a.winnersTeam.id == this.props.teamId ? a.winner : a.loser;
    var bteamMember = b.winnersTeam.id == this.props.teamId ? b.winner : b.loser;
    aWin = (a.isWinner(ateamMember) ? 'W' : 'L');
    bWin = (b.isWinner(bteamMember) ? 'W' : 'L');
    if (this.state.sort.sortWin.asc == 'true')
        return aWin.localeCompare(bWin);
    else
        return bWin.localeCompare(aWin);
};

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
            firstBy: 'sortDate',
            sortOrder: ['sortDate','sortPlayer','sortTeam','sortOpponent','sortWin'],
            sort: {
                sortDate: {asc: 'true', fx : sortDateFn},
                sortTeam: {asc: 'true', fx : sortOpponentTeamFn},
                sortPlayer: {asc: 'true', fx : sortPlayerFn},
                sortOpponent: {asc: 'true', fx : sortOpponentFn},
                sortWin: {asc: 'true', fx : sortWinFn}
            },
            page: {
                size: 10,
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
        this.transitionTo('team',this.getParams(),query);
    },
    onChange: function(e) {
        if (this.state.page.num > 0) {
            this.state.filter = e.target.value;
            var q = this.getQuery();
            q.num=0;
            this.transitionTo('team',this.getParams(),q);
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
        this.transitionTo('team',this.getParams(),query);
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
        var filteredMatches = this.filterResults(results,this.state.filter);

        var order = firstBy(this.state.sort[this.state.firstBy].fx.bind(this));
        for(var i=0; i< this.state.sortOrder.length; i++) {
            var type = this.state.sortOrder[i];
            order = order.thenBy(this.state.sort[type].fx.bind(this));
        }

        filteredMatches = filteredMatches.sort(order);
        pageMatches = [];
        var start = this.state.page.num*this.state.page.size;
        var end = start + this.state.page.size;

        if (this.state.page.size >= filteredMatches.length) {
            pageMatches = filteredMatches;
        } else {

            for(var i = start; i<filteredMatches.length && i < end ; i++) {
                pageMatches.push(filteredMatches[i]);
            }
        }

        pageMatches.forEach(function (m) {
            var teamMember = m.winnersTeam.id == this.props.teamId ?  m.winner : m.loser;
            rows.push(
                <tr key={key++}>
                    <td>{m.getShortMatchDate()}</td>
                    <td><UserLink user={teamMember} seasonId={m.teamMatch.getSeason().id} /></td>
                    <td><UserLink user={m.getOpponent(teamMember)} seasonId={m.teamMatch.getSeason().id}/></td>
                    <td><TeamLink team={m.getOpponentsTeam(teamMember)} seasonId={m.teamMatch.getSeason().id}/></td>
                    <td>{m.isWinner(teamMember) ? 'W' : 'L'}</td>
                    <td style={{display: nine ? 'table-cell' : 'none'}}>{m.getRacks(teamMember)}</td>
                    <td style={{display: nine ? 'table-cell' : 'none'}}>{m.getOpponentRacks(teamMember)}</td>
                </tr>);
        }.bind(this));
        return (
            <div>
                <Input id='filter' onChange={this.onChange} value={this.state.filter} type='input' placeholder={'Filter....'}></Input>
                <Table>
                    <thead>
                    <Header nine={nine} firstBy={this.firstBy} sortOrder={this.sortOrder} sort={this.state.sort} />
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>
            </Table>
                <Footer page={this.state.page} last={end >= filteredMatches.length} />
            </div>
        );
    }
});

var Header = React.createClass({
    render: function() {
        var sort = this.props.sort;
          return (
              <tr>
                  <th>
                      <a href='#' onClick={this.props.firstBy} ><span id='sortDate'>Date </span></a>
                      <a href='#' onClick={this.props.sortOrder}>
                          <Glyphicon id='sortDateOrder' glyph={sort.sortDate.asc == 'true' ? 'arrow-up':'arrow-down'}/>
                      </a>
                  </th>
                  <th>
                      <a href='#'   onClick={this.props.firstBy} ><span id='sortPlayer'>Player </span></a>
                       <a href='#' style={{display: 'none'}} onClick={this.props.sortOrder}>
                          <Glyphicon id='sortPlayerOrder' glyph={sort.sortPlayer.asc == 'true' ? 'arrow-up':'arrow-down'}/>
                      </a>
                  </th>
                  <th>
                      <a href='#'  onClick={this.props.firstBy} ><span id='sortOpponent'>Opponent </span></a>
                      <a href='#' style={{display: 'none'}}  onClick={this.props.sortOrder}>
                          <Glyphicon id='sortOpponentOrder' glyph={sort.sortOpponent.asc == 'true' ? 'arrow-up':'arrow-down'}/>
                      </a></th>
                  <th>
                      <a href='#'  onClick={this.props.firstBy} ><span id='sortTeam'>Team </span></a>
                      <a href='#' style={{display: 'none'}} onClick={this.props.sortOrder}>
                          <Glyphicon id='sortTeamOrder' glyph={sort.sortTeam.asc == 'true' ? 'arrow-up':'arrow-down'}/>
                      </a>
                  </th>
                  <th >
                      <a href='#'  onClick={this.props.firstBy} ><span id='sortWin'>W/L </span></a>
                      <a style={{display: 'none'}} href='#'  onClick={this.props.sortOrder}>
                          <Glyphicon id='sortWinOrder' glyph={sort.sortWin.asc == 'true' ? 'arrow-up':'arrow-down'}/>
                      </a>
                  </th>
                  <th style={{display: this.props.nine ? 'table-cell' : 'none'}}>RW</th>
                  <th style={{display: this.props.nine ? 'table-cell' : 'none'}}>RL</th>
              </tr>);
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

        this.transitionTo('team',this.getParams(),q);
    },
    next: function(e) {
        e.preventDefault();
        var q = this.getQuery();
        var page = this.props.page;
        page.num = page.num+1;
        q.num = page.num;
        this.transitionTo('team',this.getParams(),q);
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



module.exports = TeamResults;
