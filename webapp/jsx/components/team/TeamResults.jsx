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
}

var sortPlayerFn = function(a,b) {
    var ateamMember = a.winnersTeam.id == this.props.teamId ? a.winner : a.loser;
    var bteamMember = b.winnersTeam.id == this.props.teamId ? b.winner : b.loser;
    if (this.state.sort.sortPlayer.asc == 'true') {
        return ateamMember.name.localeCompare(bteamMember.name);
    }
    return bteamMember.name.localeCompare(ateamMember.name);
}

var sortOpponentFn  = function(a,b){
    var ateamMember = a.winnersTeam.id == this.props.teamId ? a.winner : a.loser;
    var bteamMember = b.winnersTeam.id == this.props.teamId ? b.winner : b.loser;

    if (this.state.sort.sortOpponent.asc == 'true')
        return a.getOpponent(ateamMember).name.localeCompare(b.getOpponent(bteamMember).name);
    else
        return b.getOpponent(ateamMember).name.localeCompare(a.getOpponent(bteamMember).name);
}

var sortOpponentTeamFn = function(a,b){
    var ateamMember = a.winnersTeam.id == this.props.teamId ? a.winner : a.loser;
    var bteamMember = b.winnersTeam.id == this.props.teamId ? b.winner : b.loser;
    if (this.state.sort.sortTeam.asc == 'true')
        return a.getOpponentsTeam(ateamMember).name.localeCompare(b.getOpponentsTeam(bteamMember).name);
    else
        return b.getOpponentsTeam(ateamMember).name.localeCompare(a.getOpponentsTeam(bteamMember).name);
}

var sortWinFn = function(a,b) {
    var ateamMember = a.winnersTeam.id == this.props.teamId ? a.winner : a.loser;
    var bteamMember = b.winnersTeam.id == this.props.teamId ? b.winner : b.loser;
    aWin = (a.isWinner(ateamMember) ? 'W' : 'L');
    bWin = (b.isWinner(bteamMember) ? 'W' : 'L');
    if (this.state.sort.sortWin.asc == 'true')
        return aWin.localeCompare(bWin);
    else
        return bWin.localeCompare(aWin);
}

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
        var sort = this.state.sort;
        var page = this.state.page;
        for(var type in sort) {
            sort[type].asc = q[type] == undefined ? sort[type].asc : q[type];
        }
        for(var type in page) {
            page[type] = q[type] == undefined ? page[type] : parseInt(q[type]);
        }
        var firstBy = this.state.firstBy;
        if (q.firstBy != undefined) {
            firstBy = q.firstBy;
        }
        var sortOrder = this.state.sortOrder;
        if (q.sortOrder != undefined) {
            sortOrder = q.sortOrder.split(",");
        }
        this.setState({firstBy: firstBy, sort, page, sortOrder: sortOrder});
    },
    componentWillReceiveProps: function(n,o) {
        console.log(JSON.stringify(this.getQuery()));
        this.processQuery();
    },
    componentDidMount: function() {
        this.processQuery();
    },
    onSort: function(e) {
        e.preventDefault();
        console.log('Sort:' + e.target.id);
        var query =this.getQuery();
        query[e.target.id] = this.state.sort[e.target.id].asc == 'true' ? 'false' : 'true';
        query.firstBy = e.target.id;
        this.state.sort[e.target.id].asc = query[e.target.id] ;
        this.transitionTo('team',this.getParams(),query);
    },
    onOrderBy: function(e) {
        //this.setState({sortDate: {asc: !this.state.sortDate.asc}});
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
    previous: function(e) {
        e.preventDefault();
        var q = this.getQuery();
        var page = this.state.page;
        page.num = page.num-1;
        q.num = page.num;
        this.transitionTo('team',this.getParams(),q);
    },
    next: function(e) {
        e.preventDefault();
        var q = this.getQuery();
        var page = this.state.page;
        page.num = page.num+1;
        q.num = page.num;
        this.transitionTo('team',this.getParams(),q);
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

        var order = firstBy(this.state.sort[this.state.firstBy].fx.bind(this));
        for(var i=0; i< this.state.sortOrder; i++) {
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

        if (nine) {
            pageMatches.forEach(function (m) {
                var teamMember = m.winnersTeam.id == this.props.teamId ?  m.winner : m.loser;
                rows.push(
                    <tr key={key++}>
                        <td>{m.getShortMatchDate()}</td>
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
                <Footer page={this.state.page.num} next={this.next} last={end >= filteredMatches.length} prev={this.previous} />
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

var Footer = React.createClass({
    getDefaultProps: function() {
        return {
            page: 0,
            last: false
        }
    },
    next: function(e) {
        if (this.props.next) {
            this.props.next(e);
        }
    },

    prev: function(e) {
        if (this.props.prev) {
            this.props.prev(e);
        }
    },
    render: function() {
        return (
            <tr>
                <td><Pager><PageItem disabled={this.props.page == 0} previous onClick={this.prev} href='#'>&larr; Previous</PageItem></Pager></td>
                <td><Pager><PageItem disabled={this.props.last} next onClick={this.next} href='#'>Next &rarr; </PageItem></Pager></td>
            </tr>
        )
    }
});



module.exports = TeamResults;
