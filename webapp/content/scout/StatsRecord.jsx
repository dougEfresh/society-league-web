var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;
var Pie = require("react-chartjs").Pie;
var Bar = require("react-chartjs").Bar;

var UserContextMixin = require('./../../jsx/mixins/UserContextMixin.jsx');
var BallIcon = require('../../jsx/components/BallMixin.jsx');
var ChallengeConstants = require('../../jsx/constants/ChallengeConstants.jsx');

function format(number) {
    var n = number.toFixed(2) * 100;
    return n.toFixed(2) + '%';
}

var StatsRecord = React.createClass({
    mixins: [UserContextMixin,BallIcon],
    propTypes: {
        stats: ReactPropTypes.object.isRequired
    },
    render: function(){
        var rows = [];
        if (this.props.stats == null || this.props.stats == undefined) {
            return null;
        }

        rows.push(
            <tr key={'all'}>
                <td><div>{this.getEight()}</div><div>{this.getNine()}</div></td>
                <td>{this.props.stats.all.points}</td>
                <td>{format(this.props.stats.all.percentage)}</td>
                <td>{this.props.stats.all.wins}</td>
                <td>{this.props.stats.all.loses}</td>
                <td>{this.props.stats.all.racksWon}</td>
                <td>{this.props.stats.all.racksLost}</td>
            </tr>
        );
        var s = this.props.stats.byDivision[ChallengeConstants.EIGHT_BALL_CHALLENGE];
        rows.push(
            <tr key={8} >
                <td>{this.getEight()}</td>
                <td>{s.points}</td>
                <td>{format(s.percentage)}</td>
                <td>{s.wins}</td>
                <td>{s.loses}</td>
                <td>{s.racksWon}</td>
                <td>{s.racksLost}</td>
            </tr>
        );

        s = this.props.stats.byDivision[ChallengeConstants.NINE_BALL_CHALLENGE];
        rows.push(
            <tr key={9} >
                <td>{this.getNine()}</td>
                <td>{s.points}</td>
                <td>{format(s.percentage)}</td>
                <td>{s.wins}</td>
                <td>{s.loses}</td>
                <td>{s.racksWon}</td>
                <td>{s.racksLost}</td>
            </tr>
        );

        return (
            null
        );
    }
});


module.exports = StatsRecord;