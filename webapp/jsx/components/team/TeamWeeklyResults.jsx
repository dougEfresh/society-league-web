var React = require('react/addons');
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

var TeamWeeklyResults = React.createClass({
    mixins: [UserContextMixin,SeasonMixin,OverlayMixin],
     getInitialState: function() {
        return {
            isModalOpen: false,
            teamMatchId: 0
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
                     <TeamResult teamId={this.props.teamId} seasonId={this.props.seasonId} teamMatchId={this.state.teamMatchId} />
                 </div>
                 <div className='modal-footer'>
                     <Button bsStyle={'success'} onClick={this.handleToggle}>Close</Button>
                 </div>
            </Modal>
        );
    },
    render: function() {
        var seasonMatches = this.getMatches(this.props.seasonId);
        var matches = [];
        seasonMatches.forEach(function(m) {
            if (m.winner.id == this.props.teamId || m.loser.id == this.props.teamId) {
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
            if (m.winner.id == this.props.teamId) {
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
                        <Button id={r.teamMatchId} bsStyle='primary' disabled={(rl+rw)== 0} onClick={this.handleToggle}>{r.matchDate.substr(0,10)}</Button>
                    </td>
                    <td>
                        <TeamLink team={opponent} seasonId={this.props.seasonId}/>
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
