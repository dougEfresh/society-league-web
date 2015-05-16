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
    ,State = Router.State
    ,RouteHandler = Router.RouteHandler;

var StatsDisplay = require('./StatsDisplay.jsx');
var DataStore= require('../../stores/DataStore.jsx');
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var TeamMixin = require('../../mixins/TeamMixin.jsx');

var StatApp = React.createClass({
    mixins: [UserContextMixin,State,Router.Navigation],
    getInitialState: function() {
        return {
            userId: this.getUserId(),
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
    onSelect: function(e) {
        this.transitionTo('stats',{statsId: e.target.value},null);
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
    render: function() {
        if (this.getUserId() == null) {
            return null;
        }
        return null;
        /*
        var title = <span>Stats for {this.getUser(this.getParams().statsId).name}</span>;
        return (
            <div id='statsApp'>
                <Panel header={title}>
                    <Input type='select' value={this.getParams().statsId} ref='viewer' label={'Switch User'}
                           onChange={this.onSelect} >{this.getOptions()}
                    </Input>

                    <StatsDisplay stats={DataStore.getStats()[this.getParams().statsId]} />
               </Panel>
            </div>
        );
    }
    */
}

});

module.exports = StatApp;
