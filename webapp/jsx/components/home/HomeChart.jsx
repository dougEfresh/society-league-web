var React = require('react/addons');
var Bootstrap = require('react-bootstrap');
var Row = Bootstrap.Row;
var Col = Bootstrap.Col;
var Grid = Bootstrap.Grid;
var Panel = Bootstrap.Panel;

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
                <Panel className="homeChar" header={'Overall Stats'} >
                <Grid>
                    <Row>
                        <Col xs={2} md={2}>{'Matches: ' + stats.matches}</Col>
                        <Col xs={2} md={2}>{'Wins: ' + stats.wins}</Col>
                        <Col xs={2} md={2}>{'Loses: ' + stats.loses} </Col>
                        <Col xs={2} md={2}>{'RW: ' + stats.racksFor}</Col>
                        <Col xs={2} md={2}>{'RL:' + stats.racksAgainst}</Col>
                    </Row>
                    <Row >
                        <Col xs={12} md={6}>
                            <Pie data={chartData} />
                        </Col>
                    </Row>
                </Grid>
                </Panel>
           </div>
        );
    }
});


module.exports = HomeChart;