var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,PanelGroup = Bootstrap.PanelGroup
    ,Input = Bootstrap.Input
    ,Nav = Bootstrap.Nav
    ,NavItem = Bootstrap.NavItem
    ,Panel = Bootstrap.Panel;
var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;
var Pie = require("react-chartjs").Pie;

var StatActions = require('../../actions/StatActions.jsx');
var StatStore = require('../../stores/StatsStore.jsx');
var UserStore = require('../../stores/UserStore.jsx');
var UserContextMixin = require('./../../UserContextMixin.jsx');
var StatsDisplay = require('./StatsDisplay.jsx');
var StatsRecord = require('./StatsRecord.jsx');
var StatsHandicap = require('./StatsHandicap.jsx');
var StatsChart = require('./StatsPie.jsx');

var StatsDisplay = React.createClass({
    mixins: [UserContextMixin],
    propTypes: {
        stats: ReactPropTypes.object.isRequired
    },
    getInitialState: function() {
        return {
            userId: this.getUserId(),
            navView: 'chart'
        }
    },
    onSelectView: function(key){
        this.setState({navView: key});
    },
    getView: function() {
        if (this.state.navView == 'record') {
            return <StatsRecord stats={this.props.stats} />
        }
        if (this.state.navView == 'handicap') {
            return <StatsHandicap stats={this.props.stats} />
        }
         if (this.state.navView == 'chart') {
             return <StatsChart stats={this.props.stats} />
        }
        return <StatsChart stats={this.props.stats} />
    },
    render: function() {
        if (this.props.stats == null) {
            return null;
        }
        return (
            <div>
                <Nav inverse bsStyle='pills' activeKey={this.state.navView} onSelect={this.onSelectView}>
                    <NavItem className="innerNav" eventKey={'chart'}>Charts</NavItem>
                    <NavItem className="innerNav" eventKey={'handicap'}>Handicap Stats</NavItem>
                    <NavItem className="innerNav" eventKey={'record'}>Record</NavItem>
                </Nav>
                {this.getView()}
            </div>
        );
    }
});

module.exports = StatsDisplay;