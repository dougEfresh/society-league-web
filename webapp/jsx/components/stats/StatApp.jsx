var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,PanelGroup = Bootstrap.PanelGroup
    ,Panel = Bootstrap.Panel;
var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;
var Pie = require("react-chartjs").Pie;

var StatActions = require('../../actions/StatActions.jsx');
var StatStore = require('../../stores/StatsStore.jsx');
var UserStore = require('../../stores/UserStore.jsx');
var DataFactory = require('./../../DataFactoryMixin.jsx');
var StatsDisplay = require('./StatsDisplay.jsx');

var StatApp = React.createClass({
    mixins: [DataFactory],
    getInitialState: function() {
        return {
            userId: this.getUserId(),
            stats: null
        }
    },
    componentWillMount: function() {
        StatStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        StatStore.removeChangeListener(this._onChange);
    },
    componentDidMount: function() {
        this.setState({userId: this.getUserId()});
    },
    _onChange: function() {
        this.setState({stats: StatStore.getStats(this.state.userId)});
    },
    render: function() {
        return (<StatsDisplay /> );
    }
});

module.exports = StatApp;