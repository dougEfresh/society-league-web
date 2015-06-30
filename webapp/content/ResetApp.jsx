var React = require('react/addons');
var Router = require('react-router');
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
            data: JSON.stringify({id: 0, login:  React.findDOMNode(this.refs.username).value.toLowerCase()}),
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
        var user = React.findDOMNode(this.refs.username).value.toLowerCase();
        var password = React.findDOMNode(this.refs.password).value;
        $.ajax({
            async: true,
            processData: false,
            dataType: 'json',
            contentType: 'application/json',
            url: '/api/reset/password/' + this.getQuery().token,
            data: JSON.stringify({login: user, password: password}),
            method: 'post',
            success: function (d) {
                this.transitionTo('login', null, null);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error('reset', status, err.toString());
            }.bind(this)
        });
    },
    renderReset: function() {
        return (
            <div id="login-reset-app" className="login-container well col-lg-5 col-md-5 col-sm-6">
                <form id='login' className="login-form form-signin">
                    <h2 className="form-signin-heading">Reset Password</h2>
                    <div className="form-field form-group">
                        <div className="form-group">
                            <input id="username" ref='username' type='input' name='username' className="form-control" placeholder='enter user name'> </input>
                        </div>
                        <div className="form-group">
                            <input className="form-control" id="password" ref='password' type='password' name='password' placeholder='enter password'> </input>
                        </div>
                        <div className="form-group">
                            <input className="form-control" id="confirm-password" ref='confirm-password' type='password' name='confirm-password' placeholder='re-enter password'> </input>
                        </div>
                    </div>
                    <button id='submit' className="btn btn-default" onClick={this.handlePasswordReset}>Reset</button>
                </form>
            </div>
        );
    },
    renderSentReset: function() {
        return (
            <div id="reset-sent-app" className="login-container well col-lg-5 col-md-5 col-sm-6">
                <h4>See email for a password reset link</h4>
            </div>
        );
    },
    render: function () {
        var q = this.getQuery();
        if (q.passwordReset != undefined) {
            return this.renderSentReset();
        }
        if (q.token != undefined) {
            return this.renderReset();
        }
        var title = q.changePassword == undefined ? 'Reset Password' : 'Change Password';
        if (q.register != undefined) {
            title = "Register";
        }
        return (
            <div id="reset-app" className="login-container well col-lg-5 col-md-5 col-sm-6">
                <form id='reset' className="login-form form-signin">
                    <h2 className="form-signin-heading">{title}</h2>
                    <div className="form-field form-group">
                        <div className="form-group">
                            <input id="username" ref='username' type='input' name='username' className="form-control" placeholder='enter user name'> </input>
                         </div>
                    </div>
                    <button id='submit' className="btn btn-default" onClick={this.handleSubmit}>{title}</button>
                </form>
            </div>
        );
    }
});


module.exports = ResetApp;
