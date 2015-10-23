var React = require('react/addons');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var History = ReactRouter.History;
var UserContextMixin = require('./../../jsx/mixins/UserContextMixin.jsx');
var DataStore = require('../../jsx/stores/DataStore.jsx');

var LoginApp = React.createClass({
    mixins: [UserContextMixin,History],
    contextTypes: {
        location: React.PropTypes.object
    },
    getInitialState: function () {
        return {
            error: false,
            loggedIn: false
        };
    },   
    render: function () {
        var errorMsg = null;
        if (this.context.location.query.error == 'true') {
            errorMsg = <div className="form-group alert alert-danger" role="alert">Your username or password was incorrect.</div>;
        }

        return (
            <div id="login-app" className="login-container well col-lg-5 col-md-5 col-sm-6">
                <form name="fb_signin" id="fb_signin" action="/api/signup" method="POST">
                        <h2 className="form-signin-heading">Please Provide Registered Email</h2>
                        <div className="form-field form-group">
                            <div  className="form-group">
                                <input ref='email' id="email" type="input" name="email" placeholder="enter email" className="form-control"/>
                                <input type="hidden" value="true" name="springRememberMe" />
                                <input type="hidden" name="scope" value="public_profile,email,user_friends"></input>
                            </div>
                        </div>
                        <div className="row">
                            <div className="btn-group col-lg-6 col-md-7 col-sm-12 col-xs-12 login-options">
                                 <button  className="btn btn-sm btn-primary btn-responsive" type="submit">
                                     Submit
                                 </button>
                            </div>
                        </div>
                </form>
            </div>
        );
    }
});


module.exports = LoginApp;
