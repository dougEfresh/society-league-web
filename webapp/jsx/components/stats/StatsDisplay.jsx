var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,PanelGroup = Bootstrap.PanelGroup
    ,Badge = Bootstrap.Badge
    ,Label = Bootstrap.Label
    ,Panel = Bootstrap.Panel;

var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;
var Pie = require("react-chartjs").Pie;
var Bar = require("react-chartjs").Bar;

var StatActions = require('../../actions/StatActions.jsx');
var StatStore = require('../../stores/StatsStore.jsx');
var UserStore = require('../../stores/UserStore.jsx');
var DataFactory = require('./../../DataFactoryMixin.jsx');

var StatsDisplay = React.createClass({
    mixins: [DataFactory],
    propTypes: {
        stats: ReactPropTypes.object.isRequired
    },
    getInitialState: function() {
        return {
            userId: this.getUserId(),
            stats: null
        }
    },
    componentDidMount: function() {
        this.setState({userId: this.getUserId()});
    },
    render: function() {
        if  (this.props.stats == null){
            return null;
        }

        return (
            <div>
                <Panel collapsable defaultExpanded  header={'Pretty Charts'}>
                    <StatsPie stats={this.props.stats} />
                </Panel>
                <Panel collapsable defaultExpanded  header={'Handicap Stats'}>
                    <StatsBar stats={this.props.stats} />
                </Panel>
                <Panel collapsable defaultCollapsed  header={'Record'}>
                    <h3>Record</h3>
                </Panel>
            </div>
        );
    }
});

var StatsPie = React.createClass({
     propTypes: {
        stats: ReactPropTypes.object.isRequired
    },
    getChartData: function(type,racks) {
        var chartData = [
            {
                value: (racks ? this.props.stats[type].racksWon : this.props.stats[type].wins),
                color: "red",
                highlight: "#5AD3D1",
                label: racks ? "Racks Won " : "Wins "
            },
            {
                value: (racks ? this.props.stats[type].racksLost : this.props.stats[type].loses),
                color: "green",
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

        return (
            <div>
                <Label bsStyle={'success'}>Wins:{this.props.stats.all.wins}</Label>
                <Label bsStyle={'danger'}>Loses:{this.props.stats.all.loses}</Label>
                <Pie chartOptions={this.getChartOptions()} data={this.getChartData('all',false)} />
                <div>
                    <Label bsStyle={'success'}>Racks Won:{this.props.stats.all.racksWon}</Label>
                    <Label bsStyle={'danger'}>Racks Lost:{this.props.stats.all.racksLost}</Label>
                    <Pie chartOptions={this.getChartOptions()} data={this.getChartData('all',true)} />
                </div>
            </div>);
    }
});

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
        <div>
            <Bar width={600} height={400} charOptions={options} data={this.getHandicapChartData('byHandicap')} />
        </div>
        );
    }

});


module.exports = StatsDisplay;