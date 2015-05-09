var React = require('react/addons');
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Input = Bootstrap.Input
    ,Panel = Bootstrap.Panel
    ,Label = Bootstrap.Label;

var UserActions = require('../actions/UserAction.jsx');
var UserContextMixin = require('./../UserContextMixin.jsx');
var UserStore = require('../stores/UserStore.jsx');
var DataStore = require('../stores/DataStore.jsx');

var LoginApp = React.createClass({
    mixins: [UserContextMixin],
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
            data: {username: user, password: 'password'},
            method: 'post',
            success: function (d) {
                console.log(JSON.stringify(d));
                DataStore.setUser(d);
                router.transitionTo('home',{userId: d.userId},null);
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
            if (u.login == this.refs.newUser.getValue()) {
                newUser = u;
            }
        }.bind(this));
        console.log('Login ' + newUser.login);
         $.ajax({
            async: true,
            processData: true,
            url: '/api/authenticate',
            data: {username: newUser.login, password: 'password'},
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
        var button = (<Button onClick={this.handleSubmit} >Login</Button>);
        return (
            <div id="loginApp" className="login-container well col-lg-5 col-md-5 col-sm-6">
                <form className="login-form form-signin">
                        <h2 className="form-signin-heading">Please Log In</h2>
                        <div className="form-field form-group">
                            <Input ref='username' type='input' placeholder='enter user name'> </Input>
                            <Input ref='password' type='password' placeholder='enter password'> </Input>
                        </div>
                    {button}
                </form>
            </div>
        );
    }
});


module.exports = LoginApp;
