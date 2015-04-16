var React = require('react/addons');
var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;

var Navigator = require('./Navigator.jsx');
var UserStore = require('../stores/UserStore.jsx');
var DataFactory = require('../DataFactoryMixin.jsx');

var NavApp = React.createClass({
    mixins: [DataFactory],
    getInitialState: function() {
        return { user : UserStore.get() };
    },
    componentDidMount: function() {
        UserStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        UserStore.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        this.setState({user: UserStore.get()});
    },
    render: function() {
        return (
            <div>
                <Navigator user={this.state.user} />
            </div>
        )
    }
});

module.exports = NavApp;