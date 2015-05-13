var React = require('react/addons');
var Bootstrap = require('react-bootstrap');

var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var TeamMixin = require('../../mixins/TeamMixin.jsx');
var Chart = require('../Chart.jsx');
var Pie = require("react-chartjs").Pie;

var HomeChart = React.createClass({
    mixins: [TeamMixin,UserContextMixin],
    render: function() {
        if (this.getUser().id == 0) {
            return null;
        }
        var label = [];
        var wins = [];
        var lost = [];
        var user = this.getUser();
        var stats = user.getStats();

        if (stats.matches == 0) {
            return null;
        }
        var handicapStats = user.getHandicapStats();
        var seasonStats = user.getSeasonStats();
        var stats = user.getStats();
        var chartData = [
            {
                value: stats.wins,
                color: "green",
                highlight: "#5AD3D1",
                label:"Wins "
            },
            {
                value: stats.loses,
                color: "#9c302d",
                highlight: "#FFC870",
                label: "Loses "
            }
        ];
        return (
            <div>
                <Pie data={chartData} />
           </div>
        );
    }
});


module.exports = HomeChart;