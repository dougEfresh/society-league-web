var React = require('react/addons');
var Router = require('react-router');
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Modal = Bootstrap.Modal
    ,OverlayMixin = Bootstrap.OverlayMixin
    ,Panel = Bootstrap.Panel;

var FixedDataTable = require('fixed-data-table');
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;

var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var SeasonMixin = require('../../mixins/SeasonMixin.jsx');
var TeamLink = require('../TeamLink.jsx');
var TeamResult= require('../TeamResult.jsx');
var TeamResults = require('./TeamResults.jsx');
var ColumnHelper = require('../columns/ColumnHelper.jsx');

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
                {
                    match: r,
                    team: opponent,
                    result: result,
                    racksFor: rw,
                    racksAgainst: rl
                }
            )
        }.bind(this));
        var renderDate = function(match) {
            var disabled = (match.winnerRacks + match.loserRacks) == 0;
            return (<Button bsSize='xsmall' id={match.teamMatchId} bsStyle='primary' disabled={disabled}
                            onClick={this.handleToggle}>{match.matchDate.substr(5,6).replace('-','/')}
            </Button>);
        }.bind(this);
        var renderTeam = function(team) {
            return (<TeamLink team={team} seasonId={this.getParams().seasonId} />);
        }.bind(this);

        if (rows.length == 0) {
            return null;
        }
        var rowGetter= function(index) {
            return rows[index];
        }
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
                        width={75}
                        dataKey={'match'}
                        cellRenderer={renderDate}
                        align='center'
                        />
                    <Column
                        label="Opponent"
                        width={90}
                        dataKey={'team'}
                        align={'center'}
                        cellRenderer={renderTeam}
                        />
                </Table>
              //{ColumnHelper.winLost()}
              ///{ColumnHelper.racksFor('RW')}
              //{ColumnHelper.racksAgainst('RL')}

          );
    }
});

module.exports = TeamWeeklyResults;
