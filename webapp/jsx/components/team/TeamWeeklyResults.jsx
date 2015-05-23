var React = require('react/addons');
var Router = require('react-router');
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Table = Bootstrap.Table
    ,Modal = Bootstrap.Modal
    ,OverlayMixin = Bootstrap.OverlayMixin
    ,Panel = Bootstrap.Panel;

var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var SeasonMixin = require('../../mixins/SeasonMixin.jsx');
var TeamLink = require('../TeamLink.jsx');
var TeamResult= require('../TeamResult.jsx');
var TeamResults = require('./TeamResults.jsx');

var TeamWeeklyResults = React.createClass({
    mixins: [UserContextMixin,SeasonMixin,OverlayMixin,Router.State,Router.Navigation],
     getInitialState: function() {
        return {
            isModalOpen: false,
            teamMatchId: 0,
            showResults: false
        };
    },
    handleToggle: function(e,id) {
        if (e != undefined && e != null) {
            this.setState({
                isModalOpen: !this.state.isModalOpen,
                teamMatchId: e.target.id == undefined || e.target.id == "" ? 0 : e.target.id
            });
        } else {
             this.setState({
                isModalOpen: !this.state.isModalOpen
            });
        }
    },
    renderOverlay: function () {
        if (!this.state.isModalOpen) {
            return <span/>;
        }
        return (
             <Modal className="resultsModal" bsStyle={'success'} title={'Results'} onRequestHide={this.handleToggle}>
                 <div className='modal-body'>
                     <TeamResult teamId={this.getParams().teamId} seasonId={this.getParams().seasonId} teamMatchId={this.state.teamMatchId} />
                 </div>
                 <div className='modal-footer'>
                     <Button bsStyle={'success'} onClick={this.handleToggle}>Close</Button>
                 </div>
            </Modal>
        );
    },
    componentWillReceiveProps: function(n,o) {
        console.log(JSON.stringify(this.getQuery()));
        this.setState({query: this.getQuery()});
    },
    toggleResults: function() {
        var query = this.getQuery();
        if (query.results == undefined) {
            query.results = 'true';
            this.transitionTo('team',this.getParams(),query);
            return;
        }
        if (query.results == 'true') {
            query.results = 'false';
            this.transitionTo('team',this.getParams(),query);
            return;
        }
        query.results = 'true';
        console.log(query);
        this.transitionTo('team',this.getParams(),query);
    },
    renderResults: function() {
        return (<TeamResults teamId={this.getParams().teamId} seasonId={this.getParams().seasonId}/>);
    },
    render: function() {
        var seasonMatches = this.getSeasonMatches(this.getParams().seasonId);
        var matches = [];
        seasonMatches.forEach(function(m) {
            if (m.winner.id == this.getParams().teamId || m.loser.id == this.getParams().teamId) {
                matches.push(m);
            }
        }.bind(this));
        matches = matches.sort(function(a,b){
            return a.matchDate.localeCompare(b);
        });
        var rows=[];
        var results=[];
        if (matches == undefined || matches == null) {
            return null;
        }

        matches.forEach(function(m){
            var matchResult = {matchDate: m.matchDate, teamMatchId: m.teamMatchId};
            if (m.winner.id == this.getParams().teamId) {
                matchResult.won = true;
            } else {
                matchResult.won = false;
            }
            matchResult.winnerRacks = m.winnerRacks == undefined ? 0 : m.winnerRacks;
            matchResult.loserRacks = m.loserRacks == undefined ? 0 : m.loserRacks;
            matchResult.winner = m.winner;
            matchResult.loser = m.loser;
            results.push(matchResult);
        }.bind(this));

        var i = 0;
        results = results.sort(function(a,b) {
            return a.matchDate.localeCompare(b.matchDate);
        });
        results.forEach(function(r) {
            var opponent = r.won ? r.loser : r.winner;
            var result = r.won ? 'W' : 'L';
            var rw = r.won ? r.winnerRacks : r.loserRacks;
            var rl = r.won ? r.loserRacks : r.winnerRacks;
            if (rl+rw == 0) {
                result = 'N/A';
            }
            rows.push(
                <tr key={i++}>
                    <td>
                        <Button bsSize='xsmall' id={r.teamMatchId} bsStyle='primary' disabled={(rl+rw)== 0} onClick={this.handleToggle}>{r.matchDate.substr(5,6).replace('-','/')}</Button>
                    </td>
                    <td>
                        <TeamLink team={opponent} seasonId={this.getParams().seasonId}/>
                    </td>
                    <td>{result}</td>
                    <td>{rw}</td>
                    <td>{rl}</td>
                </tr>
            )
        }.bind(this));
        if (rows.length == 0) {
            return null;
        }
        return (
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
        );
    }
});

module.exports = TeamWeeklyResults;
