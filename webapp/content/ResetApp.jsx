var React = require('react/addons');
var Router = require('react-router');
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Input = Bootstrap.Input
    ,Panel = Bootstrap.Panel;

var UserContextMixin = require('./../jsx/mixins/UserContextMixin.jsx');
var DataStore = require('../jsx/stores/DataStore.jsx');
var User = require('../lib/User');

var ResetApp = React.createClass({
    mixins: [UserContextMixin,Router.State,Router.Navigation],
    contextTypes: {
        router: React.PropTypes.func
    },
    handleSubmit: function(e){
        e.preventDefault();
        $.ajax({
            async: true,
            processData: false,
              dataType: 'json',
              contentType: 'application/json',
            url: '/api/reset/request',
            data: JSON.stringify({id: 0, login: this.refs.username.getValue().toLowerCase()}),
            method: 'post',
            success: function (d) {
                this.transitionTo('reset', null, {passwordReset: 'true'});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error('authenticate', status, err.toString());
            }.bind(this)
        });
    },
    handlePasswordReset: function(e){
        e.preventDefault();
        var user = this.refs.username.getValue().toLowerCase();
        var password = this.refs.password.getValue();
        $.ajax({
            async: true,
            processData: false,
            dataType: 'json',
            contentType: 'application/json',
            url: '/api/reset/password/' + this.getQuery().token,
            data: JSON.stringify({login: user, password: password}),
            method: 'post',
            success: function (d) {
                //DataStore.setUser(d);
                //DataStore.init();
                this.transitionTo('login', null, null);
            }.bind(this),
            error: function (xhr, status, err) {
                this.setState({error: true});
                console.error('authenticate', status, err.toString());
            }.bind(this)
        });
    },
    renderReset: function() {
        return (
            <div id="login-reset-app" className="login-container well col-lg-5 col-md-5 col-sm-6">
                <form id='login' className="login-form form-signin">
                    <h2 className="form-signin-heading">Reset Password</h2>
                    <div className="form-field form-group">
                        <Input id="username" ref='username' type='input' name='username' placeholder='enter user name'> </Input>
                        <Input id="password" ref='password' type='password' name='password' placeholder='enter password'> </Input>
                        <Input id="confirm-password" ref='confirm-password' type='password' name='confirm-password' placeholder='re-enter password'> </Input>
                    </div>
                    <Button id='submit' onClick={this.handlePasswordReset} >Reset</Button>
                </form>
            </div>
        );
    },
    renderSentReset: function() {
        return (
            <div id="reset-sent-app" className="login-container well col-lg-5 col-md-5 col-sm-6">
                <h4>Check email for password reset link</h4>
            </div>
        );
    },
    render: function () {
        var q = this.getQuery();
        if (q.token != undefined) {
            return this.renderReset();
        }
        if (q.passwordReset != undefined) {
            return this.renderSentReset();
        }
        var title = q.changePassword == undefined ? 'Reset Password' : 'Change Password';
        return (
            <div id="reset-app" className="login-container well col-lg-5 col-md-5 col-sm-6">
                <form id='reset' className="login-form form-signin">
                    <h2 className="form-signin-heading">{title}</h2>
                    <div className="form-field form-group">
                        <Input id="username" ref='username' type='input' name='username' placeholder='enter user name'> </Input>
                    </div>
                    <Button id='submit' onClick={this.handleSubmit}>{title}</Button>
                </form>
            </div>
        );
    }
});


module.exports = ResetApp;
