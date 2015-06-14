var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;
var Pie = require("react-chartjs").Pie;

var UserContextMixin = require('./../../jsx/mixins/UserContextMixin.jsx');
var StatsRecord = require('./StatsRecord.jsx');
var StatsHandicap = require('./StatsHandicap.jsx');
var StatsChart = require('./StatsPie.jsx');
var firstBy = require('../../lib/FirstBy.js');
var UserStat = require('../../lib/UsersStat');

var StatHistory = React.createClass({
    mixins: [UserContextMixin,Router.State],
    render: function() {
        var user = this.getUser(this.getParams().statsId);
        var stats = user.stats;
        var userStats = [];
        stats.forEach(function(s){
            if (s.type.indexOf('handicap') >= 0 || s.type.indexOf('division') >=0 ) {
                return;
            }
            if (s.type.indexOf('challenge') >= 0 ) {
                return ;
            }
            userStats.push(new UserStat(user,s));
        });
        userStats.sort(function(a,b){
            if (a.stat.type == 'all') {
                return -1;
            }

            if (b.stat.type == 'all') {
                return 0;
            }

            if (b.stat.type == 'season') {
                return  b.stat.season.startDate.localeCompare(a.stat.season.startDate);
            }

            return 0;
        });
        /*
        var rowGetter = function(rowIndex) {
            return userStats[rowIndex];
        };
         var width =
            // ColumnConfig.name.width +
             ColumnConfig.season.width +
            ColumnConfig.wins.width +
            ColumnConfig.wins.width +
            ColumnConfig.racksFor.width +
            ColumnConfig.racksAgainst.width + 10;
            */
         return (
               <h2>Coming Soon</h2>
        );
    }
});

module.exports = StatHistory;