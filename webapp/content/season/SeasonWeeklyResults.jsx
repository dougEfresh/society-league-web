var React = require('react/addons');
var Util = require('../../jsx/util.jsx');
var TeamLink = require('../../jsx/components/links/TeamLink.jsx');
var Router = require('react-router')
    , Route = Router.Route
    , Link = Router.Link;

var SeasonWeeklyResults = React.createClass({
    mixins: [],
    getInitialState: function() {
        return {
            update: Date.now(),
            results: []
        }
    },
    getData: function() {
        Util.getData('/api/teammatch/get/season/' + this.props.params.seasonId, function(d){
            this.setState({results: d});
        }.bind(this));
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
                  rows.push(<Results seasonId={this.props.params.seasonId} key={r.id} results={displayResults} />);
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

var Results = React.createClass({
     render: function() {
        var results = this.props.results;
        if (results.length == 0) {
            return null;
        }
         var seasonId = this.props.seasonId;
        var rows = [];
        results.forEach(function(r) {
            var winner = r.home;
            var loser = r.away;
            if (r.homeRacks < r.awayRacks) {
                winner = r.away;
                loser = r.home;
            }
            var button = (
                <Link to={'/app/season/' + seasonId + '/teamresults/' + r.id }>
                    <button className='btn btn-success'>
                        <span className="main-item">Results</span>
                    </button>
                </Link>);

            if (r.homeRacks + r.awayRacks <= 0) {
                button = null;
            }
            rows.push(
                    <tr key={r.id}>
                        <td><TeamLink team={winner}/> <span>{button}</span></td>
                        <td><TeamLink team={loser}/> <span></span></td>
                        <td>{r.homeRacks < 0 ? '0' : r.homeRacks}</td>
                        <td>{r.awayRacks < 0 ? '0' : r.awayRacks}</td>
                    </tr>
                );
        }.bind(this));

        return (
            <div className="table-responsive">
          <table className="table table-condensed table-stripped table-responsive" >
              <thead>
              <th colSpan="4">{Util.formatDateTime(this.props.results[0].matchDate)}</th>
              </thead>
              <tbody>
              <tr><td>Winner</td><td>Loser</td><td colSpan="2">Racks</td></tr>
              {rows}
              </tbody>
          </table>
            </div>
        );
    }
});


module.exports = SeasonWeeklyResults;