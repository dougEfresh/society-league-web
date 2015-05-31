var React = require('react/addons');
var Router = require('react-router');
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Input = Bootstrap.Input
    ,Panel = Bootstrap.Panel
    ,Label = Bootstrap.Label;

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
                this.transitionTo('login', null, {passwordRest: 'true'});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error('authenticate', status, err.toString());
            }.bind(this)
        });
    },
    render: function () {
        return (
            <div id="login-app" className="login-container well col-lg-5 col-md-5 col-sm-6">
                <form id='login' className="login-form form-signin">
                        <h2 className="form-signin-heading">Reset Password</h2>
                        <div className="form-field form-group">
                           <Input id="username" ref='username' type='input' name='username' placeholder='enter user name'> </Input>
                        </div>
                    <Button id='submit' onClick={this.handleSubmit}>Reset</Button>;
                </form>
            </div>
        );
    }
});


module.exports = ResetApp;
