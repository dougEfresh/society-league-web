var React = require('react/addons');
var Router = require('react-router');

var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var Chart = require('../../jsx/components/Chart.jsx');
var Util = require('../../jsx/util.jsx');

var TeamChart = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
        return {
            update: Date.now(),
            statTeam: {},
            statTeamMembers: []
        }
    },
    getData: function(id) {
        Util.getSomeData({ url: '/api/stat/team/' + id,
            callback: function(d){this.setState({statTeam: d});}.bind(this),
            module: 'TeamChart',
            router: this.props.history
        });

        Util.getSomeData(
            {
                url: '/api/stat/team/' + id + '/members',
                callback: function(d){ this.setState({statTeamMembers: d});}.bind(this),
                module: 'TeamChar',
                router: this.props.history
            }
        );
    },
    componentDidMount: function () {
        this.getData(this.props.params.teamId);
    },
    componentWillReceiveProps: function (n) {
        this.getData(n.params.teamId);
    },
    render: function() {
        var label = [];
        var team = this.state.statTeam;
        if (team == undefined) {
            return null;
        }
        var stats = this.state.statTeamMembers;
        if (stats.length == 0) {
            return null;
        }
        var wins = [];
        var lost = [];

        if (team.season && team.season.nine) {
            label.push('team');
            wins.push(team.wins);
            lost.push(team.loses);
        }

        stats = stats.sort(function(a,b) {
            if (a.winPct>b.winPct) {
                return -1;
            }
            if (a.winPct<b.winPct) {
                return 1;
            }
            return 0;
        });

        stats.forEach(function(u) {
            //label.push(u.user.fName + ' ' + u.user.lName.substr(0,1) + '.');
            label.push(u.user.name);
            wins.push(u.wins);
            lost.push(u.loses);
        });
         var data = {
             labels: label,
             datasets: [
                 {
                     label: "Wins",
                     fillColor: "green",
                     strokeColor: "rgba(220,220,220,0.8)",
                     highlightFill: "rgba(220,220,220,0.75)",
                     highlightStroke: "rgba(220,220,220,1)",
                     data: wins
                 },
                 {
                     label: "Lost",
                     fillColor: "#9c302d",
                     strokeColor: "rgba(151,187,205,0.8)",
                     highlightFill: "rgba(151,187,205,0.75)",
                     highlightStroke: "rgba(151,187,205,1)",
                     data: lost
                 }
             ]
         };
        return (
            <Chart data={data} />
        );
    }
});


module.exports = TeamChart;