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
    render: function () {
        var title =  'Reset Password';
        if (this.props.location.query.resetPassword) {
            return ( <div id="reset-sent-app" className="login-container well col-lg-5 col-md-5 col-sm-6">
                <h4>See email for a password reset link</h4>
            </div>);
        }
        return (
            <div id="reset-app" className="login-container well col-md-5 col-xs-12">
                <form id='reset' className="login-form form-signin">
                    <h2 className="form-signin-heading">{title}</h2>
                    <div className="form-field form-group">
                        <div className="form-group">
                            <input id="username" ref='username' type='input' name='username' className="form-control" placeholder='enter email'> </input>
                         </div>
                    </div>
                    <button id='submit' className="btn btn-default" onClick={this.handleSubmit}>{title}</button>
                </form>
            </div>
        );
    }
});


module.exports = ResetApp;
