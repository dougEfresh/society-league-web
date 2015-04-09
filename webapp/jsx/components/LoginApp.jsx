var React = require('react/addons');
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Input = Bootstrap.Input
    ,Panel = Bootstrap.Panel
    ,Label = Bootstrap.Label;

var UserActions = require('../actions/UserAction.jsx');
var DataFactory = require('./../DataFactoryMixin.jsx');

var LoginApp = React.createClass({
    mixins: [DataFactory],
    contextTypes: {
        router: React.PropTypes.func
    },
    getInitialState: function () {
        return {
            error: false,
            loggedIn: false
        };
    },
    handleSubmit: function(e){
        var router = this.context.router;
        e.preventDefault();
        var user = this.refs.username.getValue();
        var password = this.refs.password.getValue();
        console.log('Logging in: ' + user);
        $.ajax({
            async: true,
            processData: true,
            url: '/api/authenticate',
            data: {username: user, password: password},
            method: 'post',
            success: function (d) {
                console.log('Router ' +
                    JSON.stringify(router.getCurrentPath()) + ' ---- '+
                    JSON.stringify(router.getCurrentPathname()) + ' ---- '+
                    JSON.stringify(router.getCurrentParams()) + ' ---- ' +
                    JSON.stringify(router.getCurrentQuery())
                );
                this.setState({error: false});
                UserActions.set(d);
                //TODO Do a Real route
                router.transitionTo('home',{userId: d.id},{from: router.getCurrentPath()});
            }.bind(this),
            error: function (xhr, status, err) {
                this.setState({error: true});
                console.error('authenticate', status, err.toString());
            }.bind(this)
        });

    },
    render: function () {
         var button = (<Button onClick={this.handleSubmit} type="submit">login</Button>);
        return (
            <Panel header={'Login'} footer={button} >
                <Input type='text' ref='username' placeholder="username" defaultValue="login0"/>
                <Input type='text' ref='password' placeholder="password" defaultValue="login0"/>
            </Panel>
        );
    }
});


module.exports = LoginApp;
