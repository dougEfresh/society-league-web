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
    handleSubmitFB: function(e){
        e.preventDefault();
        $.ajax({
            async: true,
            processData: true,
            url: '/connect/facebook',
            method: 'post',
            data: {scope: 'public_profile,email,user_friends'},
            success: function (d) {
                DataStore.setUser(d);
                if (this.context.location.pathname == "/" || this.context.location.pathname == "/login") {
                    this.history.replaceState(null, '/app/home');
                    return;
                }
                this.history.replaceState(null, this.context.location.pathname,this.context.location.query);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error('authenticate', status, err.toString());
                this.history.pushState(null, '/login', {error: 'true'});
            }.bind(this)
        });
    },
    render: function () {
        var errorMsg = null;
        if (this.context.location.query.error == 'true') {
            errorMsg = <div className="form-group alert alert-danger" role="alert">Your username or password was incorrect.</div>;
        }

        if (this.context.location.query.expired == 'true') {
            errorMsg = <div className="form-group alert alert-danger" role="alert">Session Expired. Please login again.</div>;
        }
        return (
            <div id="login-app" className="container fluid container-fluid wrap">
            <div className="login-container well col-md-5 col-sm-6">
                <form name="fb_signin" id="fb_signin" action="/signin/facebook" method="POST">
                        <h2 className="form-signin-heading">Please Log In</h2>
                        <div className="row">
                             <div className="btn-group col-md-3 col-xs-6 login-options">
                                 <input type="hidden" name="scope" value="public_profile,email,user_friends"></input>
                                 <input type="hidden" value="true" name="springRememberMe" />
                                 <button className="btn btn-block btn-social btn-facebook" type="submit">
                                     <i className="fa fa-facebook"></i>
                                     Facebook
                                 </button>
                             </div>
                            <div style={{float: 'right'}} className="col-md-3 col-xs-6">
                                <Link to='/legacy'>
                                    <button type="button" className="btn btn-sm btn-default btn-responsive pull-right">
                                        <b>Username</b>
                                    </button>
                                </Link>
                            </div>
                        </div>
                </form>
            </div>
            </div>
        );
    }
});


module.exports = LoginApp;
