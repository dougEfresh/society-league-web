var React = require('react/addons');
var Router = require('react-router');
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var Bootstrap = require('react-bootstrap')
    ,Panel = Bootstrap.Panel
    ,Button = Bootstrap.Button;

var DataStore = require('../../stores/DataStore.jsx');
var HomeChart = require('./HomeChart.jsx');
var HomeMatches= require('./HomeMatches.jsx');

var HomeApp = React.createClass({
    mixins: [UserContextMixin,Router.state],
    componentWillMount: function () {
        DataStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function () {
        DataStore.removeChangeListener(this._onChange);
    },
    componentDidMount: function () {

    },
    _onChange: function () {
        this.setState({user: DataStore.getAuthUserId()});
    },
    render: function () {
        if (this.getUser().id == 0) {
            return null;
        }
        var header = 'Welcome, ' + this.getUser().name;
        return (<div id="homeApp">
            <Panel header={header}>
                <HomeMatches />
                <HomeChart />
            </Panel>
        </div>);
    }
});

module.exports = HomeApp;