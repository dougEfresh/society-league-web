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

var TeamApp = React.createClass({
    mixins: [TeamMixin,StatsMixin,UserContextMixin,State,Navigation],
    getInitialState: function() {
        return {
            counter: 0
        }
    },
    componentWillMount: function () {
        console.log('Mount');
        DataStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function () {
        DataStore.removeChangeListener(this._onChange);
    },
    componentDidMount: function () {
        this.setState({user: this.getUser()});
    },
    _onChange: function() {
        this.setState({user: this.state.user});
    },
    onSelect: function(e) {
        console.log(e.target.value);
        this.setState({teamId:e.target.value});
        //this.redirect('team',{userId: this.getUserId(),teamId: e.target.value, seasonId: this.state.seasonId})
    },
    onChange: function(e) {
        this.setState(
            {
                seasonId: this.getContextParam('seasonId'),
                teamId: e.target.value
            }
        );
    },
    componentWillReceiveProps: function(o,n) {
        var c = this.state.counter;
        c++;
        this.setState({counter: c});
    },
    render: function() {
        console.log('Counter: ' + this.state.counter);

        if (this.state.counter % 2 == 0) {
            return (<TeamAppSwitchOdd  teamId={this.getParams().teamId} seasonId={this.getParams().seasonId} />);
        } else {
            return (<TeamAppSwitchEven  teamId={this.getParams().teamId} seasonId={this.getParams().seasonId} />);
        }
    }
});

var TeamAppSwitchOdd = React.createClass({
    render: function() {
        if (this.props.teamId == undefined || this.props.seasonId == undefined) {
            return null;
        }
        return (
                <div id="teamApp">
                    <TeamStandingsOdd teamId={this.props.teamId} seasonId={this.props.seasonId} />
                    <TeamWeeklyOdd teamId={this.props.teamId} seasonId={this.props.seasonId} />
                </div>
            );
    }
});
var TeamAppSwitchEven = React.createClass({
    render: function() {
        return (
            <div id="teamApp">
                <TeamStandingsEven onChange={this.onChange} teamId={this.props.teamId} seasonId={this.props.seasonId} />
                <TeamWeeklyEven teamId={this.props.teamId} seasonId={this.props.seasonId} />
            </div>
        );
    }
});
var TeamStandingsOdd = React.createClass({
    render: function() {
        return ( <TeamStandings onChange={this.onChange} teamId={this.props.teamId} seasonId={this.props.seasonId} />);
    }
});
var TeamStandingsEven = React.createClass({
    render: function() {
        return ( <TeamStandings onChange={this.onChange} teamId={this.props.teamId} seasonId={this.props.seasonId} />);
    }
});
var TeamWeeklyOdd = React.createClass({
    render: function() {
        return ( <TeamWeeklyResults teamId={this.props.teamId} seasonId={this.props.seasonId} />);
    }
});

var TeamWeeklyEven = React.createClass({
    render: function() {
        return ( <TeamWeeklyResults teamId={this.props.teamId} seasonId={this.props.seasonId} />);
    }
});

var TeamStandings = React.createClass({
    mixins: [TeamMixin,StatsMixin,UserContextMixin],
    renderBody: function() {
        var standing = {};
        var teamStats = this.getSeasonTeamStats(this.props.seasonId);
        teamStats.forEach(function (s) {
            if (s.teamId == this.props.teamId) {
                standing = s;
            }
        }.bind(this));
        var teamRow = [];
        teamRow.push(<tr key={'all'}>
            <td>All</td>
            <td>{standing.wins}</td>
            <td>{standing.lost}</td>
            <td>{standing.racksFor}</td>
            <td>{standing.racksAgainsts}</td>
        </tr>);

        var users = this.getTeamUsers(this.props.teamId,this.props.seasonId);
        var userStats = [];
        users.forEach(function(u) {
            var s = this.getUserStats(u);
            s.season.forEach(function(season) {
                if (season.seasonId == this.props.seasonId) {
                    userStats.push(season)
                }
            }.bind(this));
        }.bind(this));
           var i = 0;
        userStats.forEach(function(stat) {
            teamRow.push(<tr key={i++}>
            <td>
                <UserLink user={this.getUser(stat.userId)} />
            </td>
            <td>{stat.wins}</td>
            <td>{stat.loses}</td>
            <td>{stat.racksFor}</td>
            <td>{stat.racksAgainst}</td>
        </tr>)
        }.bind(this));
        return (<div>{teamRow}</div>);
    },
    render: function() {
        var options=[];
        this.getTeamsBySeason(this.props.seasonId).forEach(function(t) {
            options.push(<option key={t.teamId} value={t.teamId}>{t.name}</option>)
        });
        var teams = (<Input onSelect={this.props.onChange}  type={'select'} value={this.props.teamId}>{options}</Input>);
        return (
            <Panel header={this.getTeam(this.props.teamId).name + ' Standings'}>
                {teams}
                <Table>
                    <thead>
                    <th></th>
                    <th>W</th>
                    <th>L</th>
                    <th>RF</th>
                    <th>RG</th>
                    </thead>
                    <tbody>
                    {this.renderBody()}
                    </tbody>
                </Table>
            </Panel>

        );
    }
});

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
        matches.forEach(function(m){
            rows.push(
                <tr key={key++}>
                    <td><UserLink user={this.getUser(m.userId)}/></td>
                    <td><UserLink user={this.getUser(m.opponent)}/></td>
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

module.exports = TeamApp;