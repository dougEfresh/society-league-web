var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Alert = Bootstrap.Alert
    ,Panel = Bootstrap.Panel;
var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;
var StatActions = require('../../actions/StatActions.jsx');
var StatStore = require('../../stores/StatsStore.jsx');
var DataFactory = require('./../../DataFactoryMixin.jsx');

var StatApp = React.createClass({
    mixins: [DataFactory],
    getInitialState: function() {
        return {
            userId: this.getUserId()
        }
    },
    componentWillMount: function() {
    },
    componentWillUnmount: function() {
    },
    componentDidMount: function() {
        this.setState({userId: this.getUserId()});
    },
    render: function() {
        return (<div>stats</div>);
    }
});

module.exports = StatApp;