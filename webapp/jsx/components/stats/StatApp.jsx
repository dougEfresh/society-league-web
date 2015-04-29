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
var DataFactory = require('./../../UserContextMixin.jsx');
var StatsDisplay = require('./StatsDisplay.jsx');
var StatsRecord = require('./StatsRecord.jsx');
var StatsHandicap = require('./StatsHandicap.jsx');
var StatsChart = require('./StatsPie.jsx');

var StatApp = React.createClass({
    mixins: [DataFactory],
    getInitialState: function() {
        return {
            userId: this.getUserId(),
            viewing: null,
            navView: 'chart'
        }
    },
    componentWillMount: function() {
        StatStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        StatStore.removeChangeListener(this._onChange);
    },
    componentDidMount: function() {

        this.setState(
            {
                userId: this.getUserId(),
                viewing: StatStore.getViewingStats(this.state.userId)
            }
        );
    },
    _onChange: function() {
        this.setState({viewing: StatStore.getViewingStats(this.state.userId)});
    },
    onSelect: function() {
        StatActions.changeView(this.refs.viewer.getValue());
    },
    getOptions: function() {
        var options = [];
        options.push(<option key={0} value={0}>{'------'}</option>);
        var users = UserStore.getAll();
        users.forEach(function(p) {
            options.push(<option key={p.id} value={p.id}>{p.name}</option>);
        }.bind(this));
        return options;
    },
    onSelectView: function(key){
        this.setState({navView: key});
    },
    getView: function() {
        if (this.state.navView == 'record') {
            return <StatsRecord stats={this.state.viewing.stats} />
        }
        if (this.state.navView == 'handicap') {
            return <StatsHandicap stats={this.state.viewing.stats} />
        }
         if (this.state.navView == 'chart') {
             return <StatsChart stats={this.state.viewing.stats} />
        }
        return <StatsChart stats={this.state.viewing.stats} />
    },
    render: function() {
        if (this.state.viewing == null) {
            return null;
        }
        return (
            <div>
                <h3>Stats for {UserStore.get(this.state.viewing.id).name}</h3>
                <Input type='select' value={this.state.viewing.id} ref='viewer' label={'Switch View'}
                       onChange={this.onSelect} >{this.getOptions()}
                </Input>
               <StatsDisplay stats={this.state.viewing.stats} />
            </div>
        );
    }
});

module.exports = StatApp;