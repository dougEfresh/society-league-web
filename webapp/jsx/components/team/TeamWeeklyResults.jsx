var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Route = Router.Route
    , NotFoundRoute = Router.NotFoundRoute
    , Link = Router.Link
    , State = Router.State
    , Navigation = Router.Navigation
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

var ReactRouterBootstrap = require('react-router-bootstrap')
    ,NavItemLink = ReactRouterBootstrap.NavItemLink
    ,MenuItemLink = ReactRouterBootstrap.MenuItemLink;

var ChallengeStore = require('../../stores/ChallengeStore.jsx');
var DataStore= require('../../stores/DataStore.jsx');
var ChallengeStatus = require('../../constants/ChallengeStatus.jsx');
var UserContextMixin = require('../../UserContextMixin.jsx');
var SeasonMixin = require('../../SeasonMixin.jsx');
var StatsMixin = require('../../StatsMixin.jsx');
var TeamMixin = require('../../TeamMixin.jsx');
var ResultMixin = require('../../ResultMixin.jsx');
var TeamLink = require('../TeamLink.jsx');
var UserLink = require('../UserLink.jsx');
var TeamStandings = require('./TeamStandings.jsx');

var TeamWeeklyResults = React.createClass({
    mixins: [ResultMixin,TeamMixin,StatsMixin,UserContextMixin,SeasonMixin,State,Navigation,OverlayMixin],
     getInitialState: function() {
        return {
            isModalOpen: false,
            teamMatchId: 0
        };
    },
    handleToggle: function(e,id) {
        this.setState({
            isModalOpen: !this.state.isModalOpen,
            teamMatchId: e.target.id == undefined || e.target.id == "" ? 0 : e.target.id
        });
    },
    renderOverlay: function () {
        if (!this.state.isModalOpen) {
            return <span/>;
        }
        var matches = this.getTeamResults(this.getParams().seasonId,this.getParams().teamId,this.state.teamMatchId);
        var rows = [];
        var key = 0;
        //<td><UserLink user={this.getUser(m.userId)}/></td>
        //<td><UserLink user={this.getUser(m.opponent)}/></td>
        matches.forEach(function(m){
            rows.push(
                <tr key={key++}>
                    <td>{m.userId}</td>
                    <td>{m.opponent}</td>
                    <td>{m.win ? 'W' : 'L'}</td>
                    <td>{m.racksFor}</td>
                    <td>{m.racksAgainst}</td>
                </tr>);
        }.bind(this));
        var body = (
            <div>
                <div className='modal-body'>
                    <Table>
                        <thead>
                        <tr>
                            <th>Player</th>
                            <th>Opponent</th>
                            <th>W/L</th>
                            <th>RW</th>
                            <th>RL</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows}
                        </tbody>

                    </Table>
                </div>
                <div className='modal-footer'>
                    <Button bsStyle={'success'} onClick={this.handleToggle}>Close</Button>
                </div>
            </div>);

        return (
            <Modal className="resultsModal" bsStyle={'success'} title={'Results'} onRequestHide={this.handleToggle}>
                {body}
            </Modal>
        );
  },
    render: function() {
        var matches = this.getMatches(this.getParams().seasonId);
        var rows=[];
        var results=[];
        for(var dt in matches) {
            matches[dt].forEach(function(tm) {
                var matchResult = null;
                if (tm.winner == this.getParams().teamId) {
                    matchResult = tm;
                    matchResult.won = true;
                    matchResult.date = dt;
                } else if (tm.loser == this.getParams().teamId) {
                    matchResult = tm;
                    matchResult.won = false;
                    matchResult.date = dt;
                }
                if (matchResult != null) {
                    results.push(matchResult);
                }
            }.bind(this));
        }
        var i = 0;
        results.forEach(function(r) {
            var opponent = r.won ? r.loser : r.winner;
            var result = r.won ? 'W' : 'L';
            var rw = r.won ? r.winnerRacks : r.loserRacks;
            var rl = r.won ? r.loserRacks : r.winnerRacks;
            //<td>
            rows.push(
                <tr key={i++}>
                    <td>
                        <Button id={r.teamMatchId} bsStyle='primary' disabled={false} onClick={this.handleToggle}>{r.date.substr(0,10)}</Button>
                    </td>
                    <td>
                        <TeamLink team={this.getTeam(opponent)} seasonId={this.getParams().seasonId}/>
                    </td>
                    <td>{result}</td>
                    <td>{rw}</td>
                    <td>{rl}</td>
                </tr>
            )
        }.bind(this));

        return (
            <Panel className='teamWeeklyResults' header={'Weekly Results'}>
            <Table>
                <thead>
                <th>Date</th>
                <th>Opponent</th>
                <th>W/L</th>
                <th>RW</th>
                <th>RL</th>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </Table>
            </Panel>
        );
    }
});

module.exports = TeamWeeklyResults;
