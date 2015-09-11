var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;
var Pie = require("react-chartjs").Pie;
var Bar = require("react-chartjs").Bar;


var StatsPie = React.createClass({
     propTypes: {
        stats: ReactPropTypes.object.isRequired
    },
    getChartData: function() {
        return  [
            {
                value: this.props.stats.wins,
                color: "green",
                highlight: "#5AD3D1",
                label:  "Wins "
            },
            {
                value: this.props.stats.loses,
                color: "red",
                highlight: "#FFC870",
                label: "Loses "
            }
        ];
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
//        if (this.props.stats == undefined || this.props.stats == null) {
  //          return null;
    //    }
        var title = 'Lifetime';
        if (this.props.stats.season != undefined) {
            title = this.props.stats.season.displayName;
        }
        return (
            <div id={'chart-app'} className="panel panel-default">
             <div className="panel-heading">
                 <h3><span className="label label-primary">{title}</span></h3>
             </div>
                <div className="panel-body">
                    <Pie redraw chartOptions={this.getChartOptions()} data={this.getChartData()} />
                </div>
            </div>
           );
    }
});

module.exports = StatsPie;

/* <div>
                <Label bsStyle={'success'}>Wins:{this.props.stats.all.wins}</Label>
                <Label bsStyle={'danger'}>Loses:{this.props.stats.all.loses}</Label>

                <div>
                    <Label bsStyle={'success'}>Racks Won:{this.props.stats.all.racksFor}</Label>
                    <Label bsStyle={'danger'}>Racks Lost:{this.props.stats.all.racksAgainst}</Label>
                    <Pie redraw chartOptions={this.getChartOptions()} data={this.getChartData('all',true)} />
                </div>
            </div>

 */