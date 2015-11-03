var React = require('react/addons');
var UserLink = require('../links/UserLink.jsx');
var Util = require('../../util.jsx');
var Handicap = require('../../../lib/Handicap');
var SeasonLink = require('../links/SeasonLink.jsx');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Route = Router.Route
    , Link = Router.Link;

var UserResults = React.createClass({
     getInitialState: function() {
         return {
             results: [],
             stats: [],
             user: this.props.user,
             season: this.props.season
        }
    },
    componentDidMount: function() { this.getData();  },
    componentWillReceiveProps: function(nextProps) {
        if (nextProps.user == undefined || nextProps.season == undefined) {
            this.setState({user:null});
            return;
        }
        if (this.state.user == undefined || this.state.season == undefined || this.state.season == null || this.state.user == null) {
            this.state.user = nextProps.user;
            this.state.season = nextProps.season;
            this.getData();
            return;
        }
        if (this.state.user.id != nextProps.user.id  || this.state.season.id != nextProps.season.id ){
            this.state.user = nextProps.user;
            this.state.season = nextProps.season;
            this.getData();
            return;
        }

    },
    getData: function() {
        if (this.state.user == null || this.state.user == undefined || this.state.season == null || this.state.season == undefined) {
            return ;
        }
        Util.getSomeData(
            { url:'/api/playerresult/user/' + this.state.user.id + '/' + this.state.season.id,
                callback: function(d){this.setState({results: d});}.bind(this), module: 'UserResult'}
        );
        Util.getSomeData({url: '/api/stat/user/' + this.state.user.id  + '/' + this.state.season.id,
            callback: function(d){this.setState({stats: d});}.bind(this), module: 'UserResult'}
        );
    },
    render: function() {
        if (this.state.user == null || this.state.user == undefined || this.state.results.length == 0 || this.state.stats.length == 0) {
            return null;
        }
        return (
            <div id="user-results">
                <SeasonResults limit={this.props.limit}
                               stats={this.state.stats}
                               season={this.state.season}
                               results={this.state.results}
                               onUserClick={this.props.onUserClick}
                    />
                </div>
        );

    }
});

var SeasonResults =  React.createClass({
    getDefaultProps: function() {
        return {season : null, results: []};
    },
    render: function() {
        if (this.props.season.challenge) {
            return <ResultChallenge stats={this.props.stats} season={this.props.season} results={this.props.results} limit={this.props.limit} />
        } else if (this.props.season.nine) {
            return <ResultNine onUserClick={this.props.onUserClick} stats={this.props.stats} season={this.props.season} results={this.props.results}limit={this.props.limit}  />
        } else if (this.props.season.scramble) {
            return <ResultScramble stats={this.props.stats} season={this.props.season} results={this.props.results}limit={this.props.limit}  />;
        }
        return <ResultEight stats={this.props.stats} season={this.props.season} results={this.props.results}limit={this.props.limit}  />;
    }
});

var ResultScramble = React.createClass({
     getDefaultProps: function() {
        return {season : null, results: []};
    },
    render: function() {
        var rows = [];
        var limit = this.props.limit == null ? this.props.results.length : this.props.limit;

        for (var i = 0; i< limit && i< this.props.results.length; i++ ) {
            var r = this.props.results[i];
            rows.push(
                <tr key={r.id}>
                    <td className={"racks win-lost " + (r.win ? "win" : "lost")}>{r.win ? 'W' : 'L'}</td>
                    <td className="user"><UserLink type={'small'} user={r.opponent}  /></td>
                    <td className="user" ><UserLink type={'small'} user={r.opponentPartner}  /></td>
                    <td className="date"><Link to={'/app/season/'  + r.season.id  + '/teamresults/' + r.teamMatch.id }>{Util.formatDateTime(r.teamMatch.matchDate)}</Link></td>
                    <td className="hc" >{Handicap.formatHandicap(r.teamMemberHandicap)}</td>
                </tr>);
        }
           var statDisplay = (<div>
                <span className="label label-success">{'W:' + this.props.stats.wins} </span>
                <span className="label label-danger">{'L:' + this.props.stats.loses} </span>
            </div>);
        if (this.props.stats.wins == undefined || this.props.stats.wins+this.props.stats.loses <= 0){
            statDisplay = null;
        }

        return (
             <div className="table-responsive">
                 <table className={ Util.tableCls + " table-users"} >
                     <thead>
                     <tr>
                         <th>W/L</th>
                         <th>Opponent</th>
                         <th>Opponent</th>
                         <th>Date</th>
                         <th>HC</th>
                     </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </table>
             </div>
        );

    }
});


var ResultEight = React.createClass({
     getDefaultProps: function() {
        return {season : null, results: []};
    },
    render: function() {
        var rows = [];
        var limit = this.props.limit == null ? this.props.results.length : this.props.limit;
        for (var i = 0; i< limit && i< this.props.results.length; i++ ) {
            var r = this.props.results[i];
            rows.push(
                <tr key={r.id}>
                    <td className="date"><Link to={'/app/season/'  + r.season.id  + '/teamresults/' + r.teamMatch.id }>{Util.formatDateTime(r.teamMatch.matchDate)}</Link></td>
                    <td className={"racks win-lost " + (r.win ? "win" : "lost")}>{r.win ? 'W' : 'L'}</td>
                    <td className="user"><UserLink type={'small'} user={r.opponent} /></td>
                    <td className="hc op-hc">{Handicap.formatHandicap(r.opponentHandicap)}</td>
                    <td className="hc">{Handicap.formatHandicap(r.teamMemberHandicap)}</td>
                </tr>);
        }
           var statDisplay = (<div>
                <span className="label label-success">{'W:' + this.props.stats.wins} </span>
                <span className="label label-danger">{'L:' + this.props.stats.loses} </span>
            </div>);
        if (this.props.stats.wins == undefined || this.props.stats.wins+this.props.stats.loses <= 0){
            statDisplay = null;
        }

        return (
             <div className="table-responsive">
                 <table className={ Util.tableCls + " table-users"} >
                     <thead>
                     <tr>
                         <th>Date</th>
                         <th>W/L</th>
                         <th>Op.</th>
                         <th>Op. HC</th>
                         <th>HC</th>
                     </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </table>
             </div>
        );

    }
});

var ResultNine = React.createClass({
    getDefaultProps: function() {
        return {season : null, results: []};
    },
    render: function() {
        var rows = [];
        var limit = this.props.limit == null ? this.props.results.length : this.props.limit;
        for (var i = 0; i< limit && i< this.props.results.length; i++ ) {
            var r = this.props.results[i];
            var lnk =  <Link to={'/app/season/'  + r.season.id  + '/teamresults/' + r.teamMatch.id }>{Util.formatDateTime(r.teamMatch.matchDate)}</Link>;

            if (!r.season.active) {
                lnk = <span>{Util.formatDateTime(r.teamMatch.matchDate)}</span>
            }
            rows.push(<tr key={r.id}>
                <td className="date">
                    {lnk}
                </td>
                <td className={"racks win-lost " + (r.win ? "win" : "lost")} >{r.win ? 'W' : 'L'}</td>
                <td className="score">{r.teamMemberRacks + '-' + r.opponentRacks}</td>
                <td className="race" >{Handicap.race(r.teamMemberHandicap,r.opponentHandicap)}</td>
                <td className="user"><UserLink onClick={this.props.onUserClick(r.opponent)} user={r.opponent} handicap={r.opponentHandicap} season={r.season.id} /></td>
                <td className="hc op-hc">{Handicap.formatHandicap(r.opponentHandicap)}</td>
                <td className="hc" >{Handicap.formatHandicap(r.teamMemberHandicap)}</td>
                </tr>);
        }

        var statDisplay = (<div>
                <span className="label label-success">{'W:' + this.props.stats.wins} </span>
                <span className="label label-danger">{'L:' + this.props.stats.loses} </span>
            </div>);
        if (this.props.stats.wins == undefined || this.props.stats.wins+this.props.stats.loses <= 0){
            statDisplay = null;
        }
        return (
             <div className="table-responsive">
                 <table className={ Util.tableCls + " table-users"} >
                     <thead>
                     <tr>
                         <th>Date</th>
                         <th className="racks">W/L</th>
                         <th className="score">S</th>
                         <th className="race" >Race</th>
                         <th>Op.</th>
                         <th>Op. HC</th>
                         <th>HC</th>
                     </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </table>
             </div>
        );

    }
});

var ResultChallenge = React.createClass({
    getDefaultProps: function() {
        return {season : null, results: []};
    },
    render: function() {
        var rows = [];
        var limit = this.props.limit == null ? this.props.results.length : this.props.limit;
        for (var i = 0; i< limit && i< this.props.results.length; i++ ) {
            var r = this.props.results[i];
            if (r == undefined) {
                continue;
            }
            rows.push(<tr key={r.id}>
                <td className="date" ><Link to={'/app/season/'  + r.season.id  + '/teamresults/' + r.teamMatch.id }>{Util.formatDateTime(r.teamMatch.matchDate)}</Link></td>
                <td className={"racks " + (r.win ? "win" : "lost") }  >{r.win ? 'W' : 'L'}</td>
                <td className="points">{r.matchPoints ? r.matchPoints.points : '0'}</td>
                <td className="points">{r.matchPoints ? r.matchPoints.weightedAvg.toFixed(3) : '0'}</td>
                <td className="racks">{r.matchPoints ? r.matchPoints.matchNum : '0'}</td>
                <td className="formula">{r.matchPoints ? r.matchPoints.calculation  : ''}</td>
                <td className="score">{r.teamMemberRacks + '-' + r.opponentRacks}</td>
                <td className="user"><UserLink type={'small'} user={r.opponent} handicap={r.opponentHandicap} season={r.season.id} /></td>
                <td className="hc">{Handicap.formatHandicap(r.teamMemberHandicap)}</td>
                </tr>);
        }
        var statDisplay = (<div>
                <span className="label label-success">{'W:' + this.props.stats.wins} </span>
                <span className="label label-danger">{'L:' + this.props.stats.loses} </span>
            </div>);

        if (this.props.stats.wins == undefined || this.props.stats.wins+this.props.stats.loses <= 0){
            statDisplay = null;
        }
        return (
             <div className="table-responsive">
                 <table className="table table-users table-bordered table-striped table-condensed" >
                     <thead>
                     <tr>
                         <th>Date</th>
                         <th>W/L</th>
                         <th>P</th>
                         <th>Avg P</th>
                         <th>#</th>
                         <th>Formula</th>
                         <th>Score</th>
                         <th>Opponent</th>
                         <th>HC</th>
                     </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </table>
             </div>
        );

    }
});


module.exports = UserResults;
