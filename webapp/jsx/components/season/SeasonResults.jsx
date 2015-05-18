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
var firstBy = require('../../FirstBy.jsx');

var sortDateFn = function(a,b) {
    return this.state.sort.sortDate.asc == 'true' ?  a.getMatchDate().localeCompare(b.getMatchDate()) : b.getMatchDate().localeCompare(a.getMatchDate());
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


var SeasonResults = React.createClass({
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
                size: 30,
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
    showStandings: function() {
        this.transitionTo('team',this.getParams());
    },
    render: function(){
        if (this.getParams().seasonId == undefined) {
            return null;
        }

        var results = this.getSeasonResults(this.getParams().seasonId);
        var season  = this.getSeason(this.getParams().seasonId);
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

        var pageMatches = [];
        var start = this.state.page.num*this.state.page.size;
        var end = start + this.state.page.size;

        if (this.state.page.size >= filteredMatches.length) {
            pageMatches = filteredMatches;
        } else {

            for(i = start; i<filteredMatches.length && i < end ; i++) {
                pageMatches.push(filteredMatches[i]);
            }
        }

        pageMatches.forEach(function (m) {
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

        return (
            <Panel className='teamWeeklyResults' header={'Blah'} footer={<Footer page={this.state.page} last={end >= filteredMatches.length} />}>
                <Input id='filter' onChange={this.onChange} value={this.state.filter} type='input' placeholder={'Filter....'}></Input>
                <Table>
                    <thead>
                    <Header nine={nine} firstBy={this.firstBy} sortOrder={this.sortOrder} sort={this.state} />
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>
                </Table>
            </Panel>
        );
    }
});
//
var Header = React.createClass({
    render: function() {
        var sort = this.props.sort.sort;
        var fb = this.props.sort.firstBy;
          return (
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



module.exports = SeasonResults;
