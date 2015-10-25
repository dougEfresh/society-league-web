var React = require('react/addons');
var Util = require('../../jsx/util.jsx');
var TeamLink = require('../../jsx/components/links/TeamLink.jsx');
var Router = require('react-router')
    , Route = Router.Route
    , Link = Router.Link;
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var LoadingApp = require('../../jsx/components/LoadingApp.jsx');
var moment = require('moment');

var teamOptions = [];
var options=[];
for(var i = 0; i<30 ; i++) {
    options.push(<option key={i} value={i}>{i}</option>);
}

var SeasonWeeklyResults = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
        return {
            update: Date.now(),
            loading: false,
            results: null,
            adminMode: false,
            teams: []
        }
    },
    getData: function(id) {
        Util.getSomeData({
            url: '/api/teammatch/season/' + id,
            callback: function (d) {
                this.setState({results: d});
            }.bind(this),
            module: 'SeasonWeeklyResults',
            router: this.props.history
        });
        var cb = function (d) {
            this.setState({teams: d});
            teamOptions = [];
            d.forEach(function(t){
                teamOptions.push(<option key={t.id} value={t.id}>{t.name}</option> )
            }.bind(this));
        }.bind(this);

        Util.getSomeData({
            url: '/api/team/season/' + id,
            callback: cb,
            module: 'SeasonWeeklyResults',
            router: this.props.history
        });
    },
    componentDidMount: function () {
        this.getData(this.props.params.seasonId);
    },
    componentWillReceiveProps: function (n) {
        this.getData(n.params.seasonId);
    },
    addMatch: function(e,dt) {
        e.preventDefault();
        if (dt == null || dt == undefined) {
            dt = moment().format('YYYY-MM-DD');
        }
        Util.getSomeData(
            {
                url: '/api/teammatch/admin/create/' + this.props.params.seasonId + '/' + dt,
                callback: function (d) {this.setState({results: d});}.bind(this),
                module: 'SeasonWeeklyResults',
                router: this.props.history
            }
        );
    },
    removeMatch: function(e,id) {
        if (id == null || id == undefined)
            return ;

        Util.getSomeData(
            {
                url: '/api/teammatch/admin/delete/' + id,
                callback: function (d) {this.setState({results: d});}.bind(this),
                module: 'SeasonWeeklyResults',
                router: this.props.history
            }
        );
    },
    adminMode: function(e) {
        e.preventDefault();
        this.setState({
            adminMode : !this.state.adminMode
        });
    },
    render: function() {
        var results = this.state.results;
        if (results == null || this.state.teams.length ==0) {
            return (<LoadingApp /> )
        }
        var rows = [];
        var cnt=0;
        for (var md in results) {
            if (results.hasOwnProperty(md))

                rows.push(<TeamMatches addMatch={this.addMatch}
                                       removeMatch={this.removeMatch}
                                       admin={this.state.adminMode}
                                       teams={this.state.teams}
                                       key={md}
                                       date={md}
                                       teamMatches={results[md]}
                                       week={++cnt}
                    />);
        }
        var add = null;
        var adminMode = null;
        if (this.getUser().admin){
            //TODO Button Group
            add = (<button className="'btn btn-success" onClick={this.addMatch}>
                <span className="glyphicon glyphicon-plus-sign" ></span><b>Add New Match Date</b></button>);
            adminMode = (<button className={this.state.adminMode ? "'btn btn-success" : "btn-btn-default"}  onClick={this.adminMode}><span className="glyphicon glyphicon-user" ></span>
                <b>Admin Mode</b>
            </button>);
        }

        var results = [];
        var oneRow = [];
        for(var i = 1; i<rows.length; i++) {
            oneRow.push( <div key={i} className={"col-xs-6 col-md-4"}>{rows[i-1]}</div>);
            if (i != 0 && i % 3 == 0) {
                results.push(<div key={i*10} className="row" >{oneRow}</div>);
                oneRow = [];
            }
        }
         results.push(<div key={'random'} className="row" >{oneRow}</div>);

        return (
            <div>
                {results}
            </div>
        );
    }
});

var TeamMatches = React.createClass({
    mixins: [UserContextMixin],
    addMatch: function() {
        var dt = this.props.date;
        return function(e) {
            this.props.addMatch(e,dt);
        }.bind(this);
    },
    getHeader: function(season) {
        if (season.challenge) {
            return (
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>Racks</td>
                </tr>
            )
        }
        if (season.nine) {
            return (
                <tr>
                    <td></td>
                    <td></td>
                    <td>Wins</td>
                    <td></td>
                    <td></td>
                    <td>Racks</td>
                    <td>Wins</td>
                </tr>
            )
        }
          return (
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>Racks</td>
                </tr>
            )

    },
     render: function() {
        if (this.props.teamMatches.length == 0) {
            return null;
        }
        var rows = [];
        this.props.teamMatches.forEach(function(r) {
            rows.push(<tr key={r.id}>
                <td>{r.winner.name}</td>
                <td>{r.winnerRacks}</td>
                <td>{r.loser.name}</td>
                <td>{r.loserRacks}</td>
                </tr>);
            /*
            if (r.season.challenge)
                rows.push(<ChallengeTeamMatch removeMatch={this.props.removeMatch} admin={this.props.admin} key={r.id} teamMatch={r} />);
            else if (r.season.nine)
                rows.push(<NineBallTeamMatch removeMatch={this.props.removeMatch} admin={this.props.admin} key={r.id} teamMatch={r} />);
            else
                rows.push(<EightBallTeamMatch removeMatch={this.props.removeMatch} admin={this.props.admin} key={r.id} teamMatch={r} />);
                */

        }.bind(this));
         var season  = this.props.teamMatches[0].season;
         var add = null;
         var sheet = null;

        if (this.props.admin){
            add = (<button onClick={this.addMatch()}><span className="glyphicon glyphicon-plus-sign" ></span><b>Add</b></button>);
            sheet = (<a href={"http://leagues.societybilliards.com/admin/sheets/sheets-season.php?season_id=" + season.legacyId + "&week=" + this.props.week}
                        target="_new" style={{float:'right', marginLeft:'5px'}}>
                <img src="/img/scoresheets.jpg" height="16"/>
                </a>);
        }
        return (

            <div className="table-responsive">
                <table className="table table-hover table-bordered table-condensed table-striped table-responsive">
                    <thead>
                    <th>{Util.formatDateTime(this.props.date)}</th>
                    <th>R</th>
                    <th></th>
                    <th>R</th>
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>
                    <tfoot>
                    </tfoot>
                </table>
            </div>
        );
    }
});



module.exports = SeasonWeeklyResults;