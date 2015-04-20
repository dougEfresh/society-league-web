var React = require('react/addons');
var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;
var DataFactory = require('./../../DataFactoryMixin.jsx');
var UserStore = require('../../stores/UserStore.jsx');
var UserActions = require('../../actions/UserAction.jsx');
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Badge = Bootstrap.Badge
    ,TabbedArea = Bootstrap.TabbedArea
    ,TabPane = Bootstrap.TabPane
    ,Nav = Bootstrap.Nav
    ,NavItem = Bootstrap.NavItem
    ,Alert = Bootstrap.Alert
    ,Input = Bootstrap.Input
    ,Link = Bootstrap.Link
    ,Panel = Bootstrap.Panel;


var AdminApp = React.createClass({
    mixins: [DataFactory],
    getInitialState: function() {
        return {
            user: UserStore.getFromServer(),
            users: UserStore.getAll(),
            switch : false
        }
    },
    componentWillMount: function() {
        UserStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        UserStore.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        var oldUser = this.state.user;
        if (oldUser.id !== 0 && oldUser.id !== UserStore.getFromServer().id) {
            this.context.router.transitionTo('request',{userId: UserStore.getFromServer().id}, null);
        }
    },
    onClick: function(e) {
        var newUser = {};
        UserStore.getAll().forEach(function(u) {
            if (u.id == this.refs.newUser.getValue()) {
                newUser = u;
            }
        }.bind(this));
        console.log('Switching to ' + newUser.name);
        UserActions.set(newUser);
    },
    render: function() {
        var users = [];
        var currentUser = UserStore.getFromServer();
        users.push(<option key={currentUser.id} value={currentUser.id}>{currentUser.name}</option>);
        this.state.users.forEach(function(u) {
            if (currentUser.id != u.id)
                users.push(<option key={u.id} value={u.id}>{u.name}</option>);
        });
        var linkSwitch = (<Alert bsStyle='success'> Click <Link to='challenge' params={{userId: this.state.user.id}} ></Link> to view user</Alert>);
        var button = (<Button onClick={this.onClick} >Go</Button>);
        //{linkSwitch}
        return (
            <Panel bsStyle='primary' header={'Select User'} title={'Select User'} footer={button} >

                <Input ref='newUser' type='select' >{users} </Input>
            </Panel>
        );
    }
});

module.exports = AdminApp;