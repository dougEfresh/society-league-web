var React = require('react/addons');
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Input = Bootstrap.Input
    ,Panel = Bootstrap.Panel
    ,Label = Bootstrap.Label;

var UserActions = require('../actions/UserAction.jsx');
var DataFactory = require('./../DataFactoryMixin.jsx');
var UserStore = require('../stores/UserStore.jsx');

var LoginApp = React.createClass({
    mixins: [DataFactory],
    contextTypes: {
        router: React.PropTypes.func
    },
    getInitialState: function () {
        return {
            error: false,
            loggedIn: false,
            users: []
        };
    },
    componentDidMount: function() {
         $.ajax({
            url: '/api/users',
            dataType: 'json',
            success: function (d) {
                this.setState({users: d});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error('users', status, err.toString());
                console.log('Redirecting to error');
                //this.redirect('error');
            }.bind(this)
        });
    },
    handleSubmit: function(e){
        debugger;
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
                router.transitionTo('request',{userId: d.id},null);
            }.bind(this),
            error: function (xhr, status, err) {
                this.setState({error: true});
                console.error('authenticate', status, err.toString());
            }.bind(this)
        });

    },
    onClick: function() {
        var newUser = {};
        this.state.users.forEach(function(u) {
            if (u.id == this.refs.newUser.getValue()) {
                newUser = u;
            }
        }.bind(this));
        console.log('Login ' + newUser.login);
         $.ajax({
            async: true,
            processData: true,
            url: '/api/authenticate',
            data: {username: newUser.login, password: newUser.login},
            method: 'post',
            success: function (d) {
                console.log('Redirect to home ' + d.id);
                this.context.router.transitionTo('home',{userId: d.id},null);
            }.bind(this),
            error: function (xhr, status, err) {
                this.setState({error: true});
                console.error('authenticate', status, err.toString());
            }.bind(this)
        });
    },
    render: function () {
        var users = [];
        this.state.users.forEach(function(u) {
            users.push(<option key={u.id} value={u.id}>{u.name}</option>);
        });
        var button = (<Button onClick={this.onClick} >Login</Button>);
        //{linkSwitch}
        // <Panel bsStyle='primary' header={'Select User'} title={'Select User'} footer={button} >
        return (
            <div className="login-container well col-lg-5 col-md-5 col-sm-6">
                <form className="login-form form-signin">
                        <h2 className="form-signin-heading">Please Log In</h2>
                        <div className="form-field form-group">
                            <Input ref='newUser' type='select' >{users} </Input>
                        </div>
                    {button}
                </form>
            </div>
        );
    }
/*

        return (
            <Panel header={'Login'} footer={button} >
                <Input type='text' ref='username' placeholder="username" defaultValue="login0"/>
                <Input type='text' ref='password' placeholder="password" defaultValue="login0"/>
            </Panel>
        );
    }
    */
});


module.exports = LoginApp;
