var React = require('react/addons');
var Router = require('react-router');
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Input = Bootstrap.Input
    ,Panel = Bootstrap.Panel
    ,Label = Bootstrap.Label;

var UserContextMixin = require('./../../jsx/mixins/UserContextMixin.jsx');
var DataStore = require('../../jsx/stores/DataStore.jsx');
var login = require('../../lib/Login');

var LoginApp = React.createClass({
    mixins: [UserContextMixin,Router.State,Router.Navigation],
    contextTypes: {
        router: React.PropTypes.func
    },
    getInitialState: function () {
        return {
            error: false,
            loggedIn: false
        };
    },
    handleReset: function(e){
        this.transitionTo('reset', null, null);
    },
    handleSubmit: function(e){
        e.preventDefault();
        var user = this.refs.username.getValue().toLowerCase();
        var password = this.refs.password.getValue();
        console.log('Logging in: ' + user);
        $.ajax({
            async: true,
            processData: true,
            url: '/api/authenticate',
            data: {username: user, password: 'password'},
            method: 'post',
            success: function (d) {
                DataStore.setUser(d);
                //DataStore.init();
                if (this.isActive('login')) {
                    this.transitionTo('home', null, null);
                }
            }.bind(this),
            error: function (xhr, status, err) {
                this.setState({error: true});
                console.error('authenticate', status, err.toString());
            }.bind(this)
        });
    },
    render: function () {
        var button = (<Button id='submit' onClick={this.handleSubmit} >Login</Button>);
        return (
            <div id="login-app" className="login-container well col-lg-5 col-md-5 col-sm-6">
                <form id='login' className="login-form form-signin">
                        <h2 className="form-signin-heading">Please Log In</h2>
                        <div className="form-field form-group">
                            <Input id="username" ref='username' type='input' name='username' placeholder='enter user name'> </Input>
                            <Input id="password" ref='password' type='password' name='password' placeholder='enter password'> </Input>
                        </div>
                    {button}
                    <Button id='reset-password' onClick={this.handleReset} >Forget Password?</Button>
                </form>
            </div>
        );
    }
});


module.exports = LoginApp;
