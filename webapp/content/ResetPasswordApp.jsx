var React = require('react/addons');
var Router = require('react-router');
var UserContextMixin = require('./../jsx/mixins/UserContextMixin.jsx');

var ResetApp = React.createClass({
    mixins: [UserContextMixin],
    contextTypes: {
        router: React.PropTypes.func
    },
    handleSubmit: function(e){
        e.preventDefault();
        var url = '/api/user/reset/request';
        $.ajax({
            async: true,
            processData: false,
              dataType: 'json',
              contentType: 'application/json',
            url: url,
            data: JSON.stringify({id: 0, login:  React.findDOMNode(this.refs.username).value.toLowerCase()}),
            method: 'post',
            success: function (d) {
                window.location = '#/notification';
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
            url: '/api/user/reset/password/' + this.props.params.token,
            data: JSON.stringify({login: user, password: password}),
            method: 'post',
            success: function (d) {
                this.props.history.pushState('legacy', null, null);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error('reset', status, err.toString());
            }.bind(this)
        });
    },
    renderReset: function() {

    },
    renderSentReset: function() {
        return (
            <div id="reset-sent-app" className="login-container well col-lg-5 col-md-5 col-sm-6">
                <h4>See email for a password reset link</h4>
            </div>
        );
    },
    render: function () {
        if (!this.props.params.token) {
              return (<div id="reset-sent-app" className="login-container well col-lg-5 col-md-5 col-sm-6">
                <h4>Invalid reset token please try again
                     <Link to='/reset'>
                                    <button type="button" className="btn btn-sm btn-default btn-responsive pull-right">
                                        <b>Reset</b>
                                    </button>
                     </Link>
                </h4>
            </div>);
        }
        return (
            <div id="login-reset-app" className="login-container well col-lg-5 col-md-5 col-sm-6">
                <form id='login' className="login-form form-signin">
                    <h2 className="form-signin-heading">Reset Password</h2>
                    <div className="form-field form-group">
                        <div className="form-group">
                            <input id="username" ref='username' type='input' name='username' className="form-control" placeholder='enter email'> </input>
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
    }
});


module.exports = ResetApp;
