var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;
var UserContextMixin = require('./../../jsx/mixins/UserContextMixin.jsx');
var Handicap = require('../../lib/Handicap');
var UserLink = require('../../../webapp/jsx/components/links/UserLink.jsx');
var Util = require('../../jsx/util.jsx');
var UserResults = require('../../jsx/components/result/UserResults.jsx');

var StatHistory = React.createClass({
    mixins: [UserContextMixin],
       getInitialState: function() {
         return {
             results: null,
             stats: [],
             selectedSeason: 'current'
         }
       },
    getData: function(statsId) {
        Util.getData('/api/playerresult/get/user/' + statsId  + '/current', function(d) {
            this.setState({results: d});
        }.bind(this), null, 'StatHistory');
        Util.getData('/api/stat/user/' + statsId , function(d){
            this.setState({stats: d , selectedSeason: 'current'});
        }.bind(this), null, 'StatHistory');
    },
    componentDidMount: function () {
        this.getData(this.props.params.statsId);
    },
    componentWillReceiveProps: function (n) {
        this.getData(n.params.statsId);
    },
    onChange: function(e) {
        e.preventDefault();
        this.setState({selectedSeason: e.target.value});
    },
    render: function() {
       if (this.state.results == null || this.state.stats.length == 0) {
           return null;
       }
        var options = [];
        //options.push(<option key={'current'} value='current' >All</option>);
        //options.push(<option key={'all'} value='all'>All</option>);
        var stats = this.state.stats.sort(function(a,b){
            if (a.season == undefined || b.season ==  undefined) {
                return 0;
            }
            if (a.season.active) {
                return 1;
            }
            if (b.season.active) {
                return 1;
            }
            return b.season.displayName.localeCompare(a.season.displayName);
        });

        stats.forEach(function(s){
            if (s.season == null)
                return;
            if (s.season.active)
                options.push(<option key={s.season.id} value={s.season.id}>{s.season.displayName}</option>);
        });

        if (options.length == 0) {
            options.push(<option key={'no'} value='no'>No active seasons for user</option>);
        }
        var results = this.state.results;
        if (this.state.selectedSeason && this.state.selectedSeason != 'all' && this.state.selectedSeason != 'current') {
            results = {};
            results[this.state.selectedSeason] = this.state.results[this.state.selectedSeason];
        }

        return (
            <div>
                <select
                    ref='season'
                    onChange={this.onChange}
                    className="form-control"
                    value={this.state.selectedSeason}
                    type={'select'}>
                    {options}
                </select>
                <UserResults stats={this.state.stats} user={this.state.stats[0].user} results={results} />
            </div>
        );
    }
});

module.exports = StatHistory;