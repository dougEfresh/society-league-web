var React = require('react/addons');
var Util = require('../../jsx/util.jsx');
var TeamLink = require('../../jsx/components/links/TeamLink.jsx');
var Router = require('react-router')
    , Route = Router.Route
    , Link = Router.Link;
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var LoadingApp = require('../../jsx/components/LoadingApp.jsx');

var SeasonWeeklyResults = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
        return {
            update: Date.now(),
            loading: false,
            results: null
        }
    },
    getData: function(id) {
        Util.getSomeData({
            url: '/api/teammatch/season/' + id,
            callback: function (d) {
                this.setState({results: d});
            }.bind(this),
            module: 'SeasonWeeklyResults'
        });
    },
    componentDidMount: function () {
        this.getData(this.props.params.seasonId);
    },
    componentWillReceiveProps: function (n) {
        this.getData(n.params.seasonId);
    },
    render: function() {
        var results = this.state.results;
        if (results == null) {
            return (<LoadingApp /> )
        }
        var rows = [];
        for (var md in results) {
            if (results.hasOwnProperty(md))
                rows.push(<TeamMatches key={md} date={md} teamMatches={results[md]} />);
        }
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
            if (r.season.challenge)
                rows.push(<NineBallTeamMatch key={r.id} teamMatch={r} />);
            else
                rows.push(<NineBallTeamMatch key={r.id} teamMatch={r} />);
        }.bind(this));
         var season  = this.props.teamMatches[0].season;
        return (
            <div className="table-responsive">
                <table className="table table-condensed table-stripped table-responsive" >
                    <thead>
                    <th colSpan="7">{Util.formatDateTime(this.props.date)}</th>
                    </thead>
                    <tbody>
                    <tr>
                        <td></td>
                        <td style={{display: season.nine && !season.challenge ? 'table-cell' : 'none'}} >Wins</td>
                        <td>Racks</td>
                        <td></td>
                        <td style={{display: season.nine && !season.challenge ? 'table-cell' : 'none'}} >Wins</td>
                        <td>Racks</td>
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
        return {
            teamMatch: this.props.teamMatch
        }
    },
    reload: function(d) {
        this.setState({
            teamMatch: d
        })
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
                <td style={{display:  tm.nine && !tm.challenge ? 'table-cell' :'none'}} >
                    <TeamResult type={'wins'} callback={this.reload} teamMatch={tm} team={tm.winner} result={tm.winnerSetWins}/>
                </td>
                <td>
                    <TeamResult type={'racks'} callback={this.reload} teamMatch={tm} team={tm.winner} result={tm.winnerRacks}/>
                </td>

                <td>{loser}</td>
                <td>
                    <TeamResult type={'wins'} callback={this.reload} teamMatch={tm} team={tm.loser} result={tm.loserSetWins}/>
                </td>
                <td>
                    <TeamResult type={'racks'} callback={this.reload} teamMatch={tm} team={tm.loser} result={tm.loserRacks}/>
                </td>

            </tr>);
    }
});

var options=[];
for(var i = 0; i<30 ; i++) {
    options.push(<option key={i} value={i}>{i}</option>);
}

var TeamResult =  React.createClass({
    getInitialState: function() {
        return {
        }
    },
    onChange: function(e) {
        Util.getSomeData({
            url: '/api/teammatch/' +this.props.type + '/' + this.props.teamMatch.id + '/' + this.props.team.id + '/' + e.target.value,
            callback: function(d) {this.props.callback(d)}.bind(this),
            module: 'TeamRacks'
        })
    },
    render: function() {
        return (
          <select
                  onChange={this.onChange}
                  className="form-control"
                  value={this.props.result}
                  type={'select'}>
              {options}
          </select>
        );
    }
});


module.exports = SeasonWeeklyResults;