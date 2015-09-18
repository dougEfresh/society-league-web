var React = require('react/addons');
var Util = require('../../jsx/util.jsx');
var TeamLink = require('../../jsx/components/links/TeamLink.jsx');
var Router = require('react-router')
    , Route = Router.Route
    , Link = Router.Link;
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');

var SeasonWeeklyResults = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
        return {
            update: Date.now(),
            results: []
        }
    },
    getData: function() {
        Util.getData('/api/teammatch/get/season/' + this.props.params.seasonId, function(d){
            this.setState({results: d});
        }.bind(this),null,'SeasonWeeklyResults');
    },
    componentDidMount: function () {
        this.getData();
    },
    componentWillReceiveProps: function (o, n) {
        var now = Date.now();
        if (now - this.state.update > 1000*60)
            this.getData();
    },
    render: function() {
        var results = this.state.results;
        if (results.length == 0) {
            return null;
        }
        var rows = [];
        var previousMd = results[0].matchDate;
        var displayResults = [];
        results.forEach(function(r) {
            var md = r.matchDate;
            if (previousMd != md) {
                  rows.push(<TeamMatches key={r.id} teamMatches={displayResults} />);
                displayResults = [];
                displayResults.push(r);
            } else {
                displayResults.push(r);
            }
            previousMd = md;
        }.bind(this));

        return (
            <div id="season-team-results">
                {rows}
            </div>
        );
    }
});

var TeamMatches = React.createClass({
    mixins: [UserContextMixin],
     render: function() {
        if (this.props.teamMatches.length == 0) {
            return null;
        }
        var rows = [];
        this.props.teamMatches.forEach(function(r) {
            rows.push(<NineBallTeamMatch key={r.id} teamMatch={r} />);
        }.bind(this));

        return (
            <div className="table-responsive">
                <table className="table table-condensed table-stripped table-responsive" >
                    <thead>
                    <th colSpan="7">{Util.formatDateTime(this.props.teamMatches[0].matchDate)}</th>
                    </thead>
                    <tbody>
                    <tr>
                        <td></td>
                        <td>Racks</td>
                        <td>Wins</td>
                        <td></td>
                        <td>Racks</td>
                        <td>Wins</td>
                    </tr>
                    {rows}
                    </tbody>
                    <tfoot>
                    <th><td colSpan="7"></td></th>
                    </tfoot>
                </table>
            </div>
        );
    }
});


var NineBallTeamMatch = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
        var options = [];
        for(var i = 0; i<41 ; i++) {
            options.push(<option key={i} value={i}>{i}</option>);
        }
        return {
            teamMatch: this.props.teamMatch,
            error: false,
            options: options
        }
    },
    onChange(type){
        return function(e) {
            var tm = this.state.teamMatch;
            e.preventDefault();
            if (!this.refs.hasOwnProperty(type)) {
                console.warn('Could not find prop ' + type + ' on refs');
                return;
            }
            var value = parseInt(React.findDOMNode(this.refs[type]).value);
            // Find home team or away team
            // If there are no results, than winner == home and loser == away by default
            var teamType = null;

            if (type.indexOf('winner') >=0) {
                if (!tm.hasResults) {
                    teamType = type.replace('winner','home');
                } else if (tm.homeRacks > tm.awayRacks ) {
                    teamType = type.replace('winner','home');
                } else {
                    teamType = type.replace('winner','away');
                }
            } else {
                if (!tm.hasResults) {
                    teamType = type.replace('loser','away');
                } else if (tm.homeRacks > tm.awayRacks ) {
                    teamType = type.replace('loser','away');
                } else {
                    teamType = type.replace('loser','home');
                }
            }
            tm[teamType] = value;
            tm.season = {id: tm.season.id};
            tm.home = {id: tm.home.id};
            tm.away = {id: tm.away.id};
            tm.winner = null;
            tm.loser = null;
            tm.season = null;
            tm.division = null;

            Util.sendData('/api/teammatch/admin/modify', tm, function(d) {
                this.setState({
                    teamMatch: d
                });
            }.bind(this),
            function() {
                 this.setState({
                    error: true
                });
            }.bind(this));

        }.bind(this)
    },
    genSelect: function(type) {
        var tm = this.state.teamMatch;
        if (this.getUser().admin) {
            return (
                <select ref={type}
                        onChange={this.onChange(type)}
                        className="form-control"
                        value={tm[type]}
                        type={'select'}>
                    {this.state.options}
                </select>
            )
        }
        return tm[type];
    },
    render: function() {
        if (this.state.error) {
            return <tr>
                <td colSpan="5">
                    <div className="alert alert-error" role="alert">
                        {'Error!  Please refresh your browser and try again' }
                    </div>
                </td>
            </tr>
        }
        var tm = this.state.teamMatch;
        var winner = <Link to={'/app/season/' + tm.season.id + '/teamresults/' + tm.id}>{tm.winner.name}</Link>;
        var loser = <Link to={'/app/season/' + tm.season.id + '/teamresults/' + tm.id}>{tm.loser.name}</Link>;
        if (!tm.hasResults && !this.getUser().admin) {
            winner = tm.winner.name;
            loser = tm.loser.name;
        }
        return (
            <tr>
                <td>{winner}</td>
                <td>{this.genSelect('winnerRacks')}</td>
                <td>{this.genSelect('winnerSetWins')}</td>
                <td>{loser}</td>
                <td>{this.genSelect('loserRacks')}</td>
                <td>{this.genSelect('loserSetWins')}</td>
            </tr>);
    }
});


module.exports = SeasonWeeklyResults;