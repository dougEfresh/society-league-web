/*
var React = require('react/addons');
var ReactPropTypes = React.PropTypes;

var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;
var Pie = require("react-chartjs").Pie;
var Bar = require("react-chartjs").Bar;

var UserContextMixin = require('./../../jsx/mixins/UserContextMixin.jsx');

var StatsBar = React.createClass({
     propTypes: {
        stats: ReactPropTypes.object.isRequired
    },
    getHandicapChartData: function(type) {
         var labels = [];
         var wins = [];
         var lost = [];
         for(var hc in this.props.stats[type]) {
             labels.push(hc);
         }
        labels.sort();
        labels.forEach(function(hc){
            wins.push(this.props.stats[type][hc].wins);
            lost.push(this.props.stats[type][hc].loses);
        }.bind(this));

         var data = {
             labels: labels,
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
                     fillColor: "red",
                     strokeColor: "rgba(151,187,205,0.8)",
                     highlightFill: "rgba(151,187,205,0.75)",
                     highlightStroke: "rgba(151,187,205,1)",
                     data: lost
                 }
             ]
         };

        return data;
    },

    render: function() {
        var options = {
    //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
    scaleBeginAtZero : true,

    //Boolean - Whether grid lines are shown across the chart
    scaleShowGridLines : true,

    //String - Colour of the grid lines
    scaleGridLineColor : "rgba(0,0,0,.05)",

    //Number - Width of the grid lines
    scaleGridLineWidth : 1,

    //Boolean - Whether to show horizontal lines (except X axis)
    scaleShowHorizontalLines: true,

    //Boolean - Whether to show vertical lines (except Y axis)
    scaleShowVerticalLines: true,

    //Boolean - If there is a stroke on each bar
    barShowStroke : true,

    //Number - Pixel width of the bar stroke
    barStrokeWidth : 10,

    //Number - Spacing between each of the X value sets
    barValueSpacing : 10,

    //Number - Spacing between data sets within X values
    barDatasetSpacing : 5,

    //String - A legend template
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

        };
        return (
            <div className="leagueChart">
                <Bar redraw width={600} height={400} charOptions={options} data={this.getHandicapChartData('byHandicap')} />
            </div>
        );
    }

});
*/

module.exports = StatsBar;