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

var UserStore = require('../../stores/UserStore.jsx');
var UserContextMixin = require('./../../UserContextMixin.jsx');
var StatsDisplay = require('./StatsDisplay.jsx');
var StatsRecord = require('./StatsRecord.jsx');
var StatsHandicap = require('./StatsHandicap.jsx');
var StatsChart = require('./StatsPie.jsx');

var DataStore= require('../../stores/DataStore.jsx');
var ChallengeStatus = require('../../constants/ChallengeStatus.jsx');
var UserContextMixin = require('../../UserContextMixin.jsx');
var SeasonMixin = require('../../SeasonMixin.jsx');
var StatsMixin = require('../../StatsMixin.jsx');
var TeamMixin = require('../../TeamMixin.jsx');

var StatApp = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
        return {
            userId: this.getUserId(),
            viewUserId: this.getContextParam('statsId'),
            navView: 'chart'
        }
    },
    componentWillMount: function () {
        DataStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function () {
        DataStore.removeChangeListener(this._onChange);
    },
    componentDidMount: function () {
        this.setState({user: this.getUser()});
    },
    _onChange: function() {
        this.setState({user: this.state.user});
    },
    onSelect: function() {

    },
    getOptions: function() {
        var options = [];
        options.push(<option key={0} value={0}>{'------'}</option>);
        var users = this.getUsers();
        for(var p in users) {
            options.push(<option key={p} value={p}>{users[p].firstName + ' '+ users[p].lastName}</option>);
        }
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
        if (this.state.viewUserId == null) {
            return null;
        }
        //
        var title = <span>Stats for {this.getUser(this.state.viewUserId).name}</span>;
        return (
            <div id='statsApp'>
                <Panel header={title}>
                <Input type='select' value={this.state.viewUserId} ref='viewer' label={'Switch'}
                       onChange={this.onSelect} >{this.getOptions()}
                </Input>
                    <StatsDisplay stats={DataStore.getStats()[this.state.viewUserId]} />
               </Panel>


            </div>
        );
    }
});

module.exports = StatApp;