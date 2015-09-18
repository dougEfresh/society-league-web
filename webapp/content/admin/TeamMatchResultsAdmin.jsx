var Qs = require('qs');
var React = require('react/addons');
var moment = require('moment');
var Router = require('react-router')
    , History = Router.History
    , Link = Router.Link;

var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var Util = require('../../jsx/util.jsx');
var firstBy = require('../../lib/FirstBy.js');
var TeamLink = require('../../jsx/components/links/TeamLink.jsx');

var MatchAResultsAdmin = React.createClass({
    mixins: [UserContextMixin,History],
    getInitialState: function() {
        return {
            update: Date.now(),
            seasons: [],
            teamMatches: []
        }
    },
    componentWillMount: function () {
    },
    componentWillUnmount: function () {
    },
    componentDidMount: function () {
        this.getData();
    },
    onChange: function (e) {
        e.preventDefault();
        if (e.target.value == '-1') {
            this.history.pushState(null, '/app/admin/results');
            return;
        }
        var season = null;
        this.state.seasons.forEach(function(s){
            if (s.id == e.target.value) {
                season = s;
            }
        });
        var q = this.props.location.query;
        q.season = {id: season.id};
        Util.getData('/api/teammatch/season/'+ season.id,function(d){
            this.setState({
                teamMatches: d
            })
        }.bind(this));
        this.history.pushState(null, '/app/admin/results',q);
    },
    onDateChange: function (e) {
        e.preventDefault();
        var q = this.props.location.query;
        q.date = e.target.value;
        this.history.pushState(null, '/app/admin/results',q);
    },
    getData: function() {
        Util.getData('/api/season', function(d){
            var active = [];
            d.forEach(function(s){
                if (s.active)
                    active.push(s);
            });
            this.setState({seasons: active});
        }.bind(this),null,'MatchResultsAdmin');
        var q = this.props.location.query;
        if (q.season != undefined && q.season.id != undefined) {
            Util.getData('/api/teammatch/season/' + q.season.id, function (d) {
                    this.setState({
                        teamMatches: d
                    })
                }.bind(this));
        }
    },
    componentWillReceiveProps: function (o, n) {
        var now = Date.now();
        if (now - this.state.update > 1000*60*2)
            this.getData();
    },
    render: function () {
        var seasons = this.state.seasons;
        if (seasons.length == 0) {
            return null;
        }
        var options = [];
        options.push(<option key={-1} value={'-1'}>Choose Season</option>);
        seasons = seasons.sort(function(a,b){
            return b.startDate.localeCompare(a.startDate);
        });
        seasons.forEach(function(s) {
            options.push(<option key={s.id} value={s.id}>{s.name}</option>);
        });
        var selectedSeason = Qs.parse(this.props.location.query.season);
        var select = (
            <select ref='season' onChange={this.onChange}
                    className="form-control"
                    value={selectedSeason !=  undefined ? selectedSeason.id : '-1' }
                    type={'select'}>
                {options}
            </select>);

        var uniqueDates = {};
        this.state.teamMatches.forEach(function(tm){
            uniqueDates[tm.matchDate] = 1;
        });
        var dates = [];
        for(var d in uniqueDates) {
            dates.push(d);
        }

        dates = dates.sort(function(a,b) {
            return a.localeCompare(b)
        });
        var dateOptions = [];
        dateOptions.push(<option key={-1} value={'-1'}>Choose Date</option>);
        dates.forEach(function(d) {
            dateOptions.push(<option key={d} value={d}>{d.split('T')[0]}</option>);
        });
        return (
            <div id="season-admin-app">
                <select ref='season'
                        onChange={this.onChange}
                        className="form-control"
                        value={selectedSeason !=  undefined ? selectedSeason.id : '-1' }
                        type={'select'}>
                {options}
                </select>
                <SeasonWeeklyResults season={selectedSeason} teamMatches={this.state.teamMatches} />
            </div>
        );
    }
});



var SeasonWeeklyResults = React.createClass({
    mixins: [],
    render: function() {
        var teamMatches = this.props.teamMatches;
        if (teamMatches.length == 0) {
            return null;
        }
        var rows = [];
        var previousMd = teamMatches[0].matchDate;
        var displayTeamMatches = [];
        teamMatches.forEach(function(r) {
            var md = r.matchDate;
            if (previousMd != md) {
                  rows.push(<Results seasonId={this.props.season.id} key={r.id} teamMatches={displayTeamMatches} />);
                displayTeamMatches = [];
                displayTeamMatches.push(r);
            } else {
                displayTeamMatches.push(r);
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

var Results = React.createClass({
        render: function() {
        var teamMatches = this.props.teamMatches;
        if (teamMatches.length == 0) {
            return null;
        }
         var rows = [];
        teamMatches.forEach(function(r) {
            rows.push(<Result teamMatch={r} key={r.id}/>);
        }.bind(this));
            var header =  (<tr>
                <td></td>
                <td>Home</td>
                <td>racks</td>
                <td>wins</td>
                <td>Away</td>
                <td>racks</td>
                <td>wins</td>
            </tr>);
            if (teamMatches[0].season.challenge || !teamMatches[0].season.nine) {
                header =  (<tr>
                    <td></td>
                    <td>Home</td>
                    <td>racks</td>
                    <td>Away</td>
                    <td>racks</td>
                    </tr>
                );
            }
        return (
            <div className="table-responsive">
                <table className="table table-condensed table-stripped table-responsive" >
                    <thead>
                    <th colSpan="4">{Util.formatDateTime(teamMatches[0].matchDate)}</th>
                    </thead>
                    <tbody>
                    {header}
                    {rows}
                    </tbody>
                </table>
            </div>
        );
    }
});

var Result = React.createClass({
    contextTypes: {
        location: React.PropTypes.object,
        history: React.PropTypes.object
    },
    getInitialState: function() {
        return {
            teamMatch: this.props.teamMatch,
            changed : false,
            submitted: false
        }
    },
    handleUpdate: function(e) {
        e.preventDefault();
        Util.sendData(this.state.teamMatch,'/api/teammatch/admin/modify',function(d){
            this.setState({
                tm: d,
                changed : false,
                submitted :true
            });
        }.bind(this));
    },
    onChange(type){
        return function() {
            if (!this.refs.hasOwnProperty(type)) {
                console.warn('Could not find prop ' + type + ' on refs');
                return;
            }
            var value = React.findDOMNode(this.refs[type]).value;
            var tm = this.state.teamMatch;
            if (!tm.hasOwnProperty(type)) {
                console.warn('Could not find prop ' + type + ' on teamMatch');
                return;
            }
            tm[type] = parseInt(value);
            this.setState({
                teamMatch: tm,
                changed: true
            });
        }.bind(this)
    },
    render: function() {
        var tm = this.state.teamMatch;
        var options = [];
         for(var i = 0; i<41 ; i++) {
             options.push(<option key={i} value={i}>{i}</option>);
         }
        var button = ( <button disabled={!this.state.changed} id="update"
                                    type="button" onClick={this.handleUpdate}
                                    className="btn btn-sm btn-primary btn-responsive">
                                   <b>Update</b>
                            </button>);
        if (this.state.submitted) {
             button = (<button id="update"
                                    type="button" onClick={this.handleUpdate}
                                    className="btn btn-sm btn-success btn-responsive">
                                   <b>Success </b>
                            </button>
             );
            setTimeout(function() {
                this.setState({submitted: false});
            }.bind(this),2000);
        }
        var setHomeWinsSelect = (   <td>
            <select ref='setHomeWins' onChange={this.onChange('setHomeWins')}
                    className="form-control"
                    value={tm.setHomeWins}
                    type={'select'}>
                {options}
            </select>
        </td>);

        var setAwayWinsSelect = (
            <td>
                <select ref='setAwayWins' onChange={this.onChange('setAwayWins')}
                        className="form-control"
                        value={tm.setAwayWins}
                        type={'select'}>
                    {options}
                </select>
            </td>
        );
        if (tm.season.challenge || !tm.season.nine) {
            setAwayWinsSelect = null;
            setHomeWinsSelect = null;
        }

        return (
               <tr key={tm.id}>
                        <td>
                            {button}
                        </td>
                        <td>
                            <TeamLink team={tm.home}/></td>
                        <td>
                            <select ref='homeRacks' onChange={this.onChange('homeRacks')}
                                    className="form-control"
                                    value={tm.homeRacks}
                                    type={'select'}>
                                {options}
                            </select>
                        </td>
                   {setHomeWinsSelect}
                        <td>
                            <TeamLink team={tm.away}/></td>
                        <td>
                            <select ref='awayRacks' onChange={this.onChange('awayRacks')}
                                    className="form-control"
                                    value={tm.awayRacks}
                                    type={'select'}>
                                {options}
                            </select>
                        </td>
                   {setAwayWinsSelect}
                    </tr>
        );
    }
});

module.exports = MatchAResultsAdmin;