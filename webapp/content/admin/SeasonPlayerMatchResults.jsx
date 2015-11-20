var React = require('react/addons');
var Util = require('../../jsx/util.jsx');
var MatchHelper = require('../../lib/MatchHelper');
var TeamLink = require('../../jsx/components/links/TeamLink.jsx');
var UserLink = require('../../jsx/components/links/UserLink.jsx');
var Router = require('react-router')
    , Route = Router.Route
    , Link = Router.Link;
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var LoadingApp = require('../../jsx/components/LoadingApp.jsx');
var moment = require('moment');
var Handicap = require('../../lib/Handicap');
var ScheduleAddTeamMatch = require('../schedule/ScheduleAddTeamMatch.jsx');
var SeasonStandings = require('../season/SeasonStandings.jsx');
var teamOptions = [];
var options=[];
var Util = require('../../jsx/util.jsx');
var DataGrid = require('../../lib/DataGrid.jsx');
var DataGridUtil = require('../../lib/DataGridUtil.jsx');
var Status = require('../../lib/Status');

for(var i = 0; i<10 ; i++) {
    options.push(<option key={i} value={i}>{i}</option>);
}

var PlayerMatchStore = require('../../jsx/stores/PlayerMatchStore.jsx');

var SeasonPlayerMatchResults = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
        return {
            loading: true,
            matches: [],
            members: null
        }
    },
    componentDidMount: function () {
        PlayerMatchStore.init(this.props.params.teamMatchId);
        DataGridUtil.adminMode();
    },
    componentWillMount: function() {
        PlayerMatchStore.addListener('loading',this._onChange);
        PlayerMatchStore.addListener('MATCHES',this._onChange);
    },
    componentDidUnmount: function() {
        console.log('Unmount');
        PlayerMatchStore.remove('MATCHES',this._onChange);
        PlayerMatchStore.remove('loading',this._onChange);
    },
    componentWillReceiveProps: function (n) {
        if (n.params.teamMatchId != this.props.params.teamMatchId) {
            PlayerMatchStore.init(n.params.teamMatchId);
        }
    },
    _onChange: function() {
        this.forceUpdate();
    },
    submit: function(e){
        e.preventDefault();
        PlayerMatchStore.submit();
    },
    add: function(e) {
        e.preventDefault();
        PlayerMatchStore.addNew();
    },
    render: function() {
        if (PlayerMatchStore.isLoading()) {
            return <h2>Loading....</h2>
        }
        var tm = PlayerMatchStore.getTeamMatch();
        var homeWins = 0;
        var awayWins = 0;
        PlayerMatchStore.getPlayed().forEach(function(p){
            homeWins += parseInt(p.homeRacks);
            awayWins += parseInt(p.awayRacks);
            if (p.scotch) {
                if (p.homeRacks > p.awayRacks) {
                    homeWins++;
                }
                if (p.awayRacks > p.homeRacks) {
                    awayWins++;
                }
            }
        });
        var handicapScore = 0;
        if (tm.homeRacks > tm.awayRacks) {
            handicapScore = tm.homeRacks - homeWins;
        } else {
            handicapScore = tm.awayRacks - awayWins;
        }

        return (
           <div className="row" >
                <div className="col-xs-12 col-md-12" >
                    <div className={"panel panel-default"} >
                        <div className={"panel-heading"}>
                            <div className="row panel-title">
                                <div className="col-xs-10 col-md-7 p-title">
                                    <span>{tm.home.name + ' (' + tm.homeRacks + ') vs '  +  tm.away.name + ' (' + tm.awayRacks + ') '}</span>
                                    <span>{Util.formatDateTime(tm.matchDate)}</span>
                                    <button onClick={this.submit} type="button" className="btn btn-xs btn-success btn-responsive player-match-submit">
                                        <span className="glyphicon glyphicon-ok-sign"> Submit</span>
                                    </button>
                                     <button onClick={this.add} type="button" className="btn btn-xs btn-responsive btn-primary player-match-submit">
                                        <span className="glyphicon glyphicon-ok-sign">Add</span>
                                    </button>
                                    <div stlye={{float: 'right'}}>
                                        <span>{'Home Player Wins ' + homeWins }</span>
                                    </div>
                                    <div>
                                        <span stlye={{float: 'right'}} >{' Away Player Wins ' + awayWins }</span>
                                    </div>
                                     <div>
                                        <span stlye={{float: 'right'}} >{' Handicap Racks ' + handicapScore }</span>
                                    </div>
                                    <div>
                                        <span stlye={{float: 'right'}} >{' Forfeits ' + tm.forfeits }</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={"panel-body panel-animate panel-challenge-results panel-results-body "} >
                            <DataGrid
                                dataSource={PlayerMatchStore.getPlayed()}
                                columns={DataGridUtil.adminPlayerColumns(tm,PlayerMatchStore.getMemberOptions())}
                                columnMinWidth={50}
                                //onColumnOrderChange={this.handleColumnOrderChange}
                                />
                        </div>
                        <div style={{color: 'whitesmoke'}} className="panel-footer panel-footer-summary">

                        </div>
                    </div>
                </div>
            </div>
        );
    }
});


module.exports =  SeasonPlayerMatchResults;
