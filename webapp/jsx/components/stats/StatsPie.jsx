var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,PanelGroup = Bootstrap.PanelGroup
    ,Badge = Bootstrap.Badge
    ,Table = Bootstrap.Table
    ,Label = Bootstrap.Label
    ,Panel = Bootstrap.Panel;

var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;
var Pie = require("react-chartjs").Pie;
var Bar = require("react-chartjs").Bar;

var StatActions = require('../../actions/StatActions.jsx');
var StatStore = require('../../stores/StatsStore.jsx');
var UserStore = require('../../stores/UserStore.jsx');
var UserContextMixin = require('./../../UserContextMixin.jsx');
var BallIcon = require('../../BallMixin.jsx');
var ChallengeConstants = require('../../constants/ChallengeConstants.jsx');

var StatsPie = React.createClass({
     propTypes: {
        stats: ReactPropTypes.object.isRequired
    },
    getChartData: function(type,racks) {
        var chartData = [
            {
                value: (racks ? this.props.stats[type].racksFor : this.props.stats[type].wins),
                color: "green",
                highlight: "#5AD3D1",
                label: racks ? "Racks Won " : "Wins "
            },
            {
                value: (racks ? this.props.stats[type].racksAgainst : this.props.stats[type].loses),
                color: "red",
                highlight: "#FFC870",
                label: racks ? "Racks Lost " : "Loses "
            }
        ];
        return chartData;
    },
    getChartOptions: function() {
        return  {
            //Boolean - Whether we should show a stroke on each segment
            segmentShowStroke : true,

            //String - The colour of each segment stroke
            segmentStrokeColor : "#fff",

            //Number - The width of each segment stroke
            segmentStrokeWidth : 2,

            //Number - The percentage of the chart that we cut out of the middle
            percentageInnerCutout : 5, // This is 0 for Pie charts

            //Number - Amount of animation steps
            animationSteps : 100,

            //String - Animation easing effect
            animationEasing : "easeOutBounce",

            //Boolean - Whether we animate the rotation of the Doughnut
            animateRotate : true,

            //Boolean - Whether we animate scaling the Doughnut from the centre
            animateScale : false,

            //String - A legend template
            legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"

        }
    },
    render: function() {
        if (this.props.stats == undefined || this.props.stats == null) {
            return null;
        }
        return (
            <div>
                <Label bsStyle={'success'}>Wins:{this.props.stats.all.wins}</Label>
                <Label bsStyle={'danger'}>Loses:{this.props.stats.all.loses}</Label>
                <Pie redraw chartOptions={this.getChartOptions()} data={this.getChartData('all',false)} />
                <div>
                    <Label bsStyle={'success'}>Racks Won:{this.props.stats.all.racksFor}</Label>
                    <Label bsStyle={'danger'}>Racks Lost:{this.props.stats.all.racksAgainst}</Label>
                    <Pie redraw chartOptions={this.getChartOptions()} data={this.getChartData('all',true)} />
                </div>
            </div>);
    }
});

module.exports = StatsPie;